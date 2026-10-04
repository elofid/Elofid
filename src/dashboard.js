// Elofid Dashboard v0.9.85 — Foreground request throttling + compact Settings time display.
// Elofid Dashboard v0.9.54 — Snapshot token metadata + production Exit Depth display field.
// Elofid Dashboard v0.8.3 — My Monitoring previous-scan deltas + compact UI/i18n polish.
// Elofid Dashboard v0.8.2 — Global Feed card context (before → after, liquidity,
// relative time, live relative-time refresh, copy / explorer, clickable cards) + Time display setting applied to the feed.
// Elofid Dashboard v0.8 — Finish Pass Batch 1
// Billing cycle UI sync + My Monitoring current snapshot + production-safe QA logs.
import { Clerk } from '@clerk/clerk-js'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const CONTROL_PLANE = 'https://control.elofid.com'

// Paddle Sandbox checkout uses a publishable client-side token, but price selection is
// authoritative only on the Clerk-authenticated Control Plane. The browser sends plan +
// billing cycle and receives a short-lived opaque checkout reference plus the server-selected price.
const PADDLE_CLIENT_TOKEN = String(import.meta.env.VITE_PADDLE_CLIENT_TOKEN || '').trim()

let paddleInitialized = false
let activePaddleCheckout = null
let authoritativeStateRefreshPromise = null
let authoritativeStateLastRefreshAt = 0
let foregroundRefreshTimer = null
let foregroundRefreshReasons = new Set()
let foregroundTransitionArmed = document.visibilityState === 'hidden'

const FOREGROUND_REFRESH_DEBOUNCE_MS = 450
const FOREGROUND_REFRESH_COOLDOWN_MS = 15000

const CHAINS = [
  ['eth', 'Ethereum'],
  ['bsc', 'BNB Smart Chain'],
  ['polygon', 'Polygon'],
  ['solana', 'Solana'],
  ['base', 'Base'],
  ['arbitrum', 'Arbitrum'],
  ['optimism', 'Optimism'],
  ['avalanche', 'Avalanche'],
  ['linea', 'Linea'],
  ['scroll', 'Scroll'],
  ['opbnb', 'opBNB'],
  ['robinhood', 'Robinhood Chain']
]

const EVM_CHAINS = new Set(
  CHAINS.map(([id]) => id).filter((id) => id !== 'solana')
)


const PLAN_PRESENTATION = Object.freeze({
  free: { name: 'Free', monthly: 0, annual: null, assets: '10', api: '10,000', history: '7 days', webhooks: '1', global: 'Preview', priority: 'Standard', position: 'Build, test and monitor your first assets.' },
  starter: { name: 'Starter', monthly: 49, annual: 490, assets: '250', api: '50,000', history: '30 days', webhooks: '3', global: 'Full', priority: 'Standard', position: 'Unlock Full Global Intelligence.' },
  growth: { name: 'Growth', monthly: 149, annual: 1490, assets: '1,000', api: '250,000', history: '60 days', webhooks: '10', global: 'Full', priority: 'Increased', position: 'Scale a production application.' },
  pro: { name: 'Pro', monthly: 299, annual: 2990, assets: '5,000', api: '1,000,000', history: '90 days', webhooks: '25', global: 'Full', priority: 'High', position: 'High-capacity intelligence infrastructure.' },
  enterprise: { name: 'Enterprise', monthly: null, annual: null, assets: 'Custom', api: 'Custom', history: 'Custom', webhooks: 'Custom', global: 'Full / Custom', priority: 'Custom', position: 'Custom infrastructure and requirements.' },
})

function planIdentityIcon(planCode, size = 22) {
  const code = String(planCode || 'free').toLowerCase()
  const common = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`
  if (code === 'free') return `<svg ${common}><path d="M12 3.5 14.25 9.75 20.5 12l-6.25 2.25L12 20.5l-2.25-6.25L3.5 12l6.25-2.25L12 3.5Z"/></svg>`
  if (code === 'starter') return `<svg ${common}><path d="M12 3 19 6v5c0 4.6-2.8 8-7 10-4.2-2-7-5.4-7-10V6l7-3Z"/><path d="m9.5 12 1.7 1.7 3.5-4"/></svg>`
  if (code === 'growth') return `<svg ${common}><path d="M5 18V13"/><path d="M10 18V9"/><path d="M15 18V5"/><path d="m13 7 2-2 2 2"/><path d="M4 20h16"/></svg>`
  if (code === 'pro') return `<svg ${common}><path d="m12 3 7 6-7 12L5 9l7-6Z"/><path d="M5 9h14"/><path d="m9 9 3 12 3-12"/></svg>`
  if (code === 'enterprise') return `<svg ${common}><path d="M4 21V7l8-4 8 4v14"/><path d="M8 9h2M14 9h2M8 13h2M14 13h2M8 17h2M14 17h2"/><path d="M2 21h20"/></svg>`
  return `<svg ${common}><circle cx="12" cy="12" r="8"/></svg>`
}

if (!publishableKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY')
}

const clerkDomain = atob(publishableKey.split('_')[2]).slice(0, -1)

await new Promise((resolve, reject) => {
  const script = document.createElement('script')
  script.src = `https://${clerkDomain}/npm/@clerk/ui@1/dist/ui.browser.js`
  script.async = true
  script.crossOrigin = 'anonymous'
  script.onload = resolve
  script.onerror = () => reject(new Error('Failed to load Clerk UI'))
  document.head.appendChild(script)
})

const clerk = new Clerk(publishableKey)

await clerk.load({
  ui: { ClerkUI: window.__internal_ClerkUICtor },

  appearance: {
    variables: {
      colorPrimary: '#00e5ff',
      colorPrimaryForeground: '#001014',
      colorBackground: '#0b0f14',
      colorForeground: '#f5f7fa',
      colorMutedForeground: '#8e9aaa',
      colorInput: '#111722',
      colorInputForeground: '#f5f7fa',
      colorBorder: '#273241',
      colorRing: '#00e5ff',
      colorNeutral: '#64748b',
      colorDanger: '#ff5c70',
      colorSuccess: '#5dffb2',
      borderRadius: '10px'
    }
  }
})

const app = document.getElementById('dashboard-app')
const gate = document.getElementById('auth-gate')
let authGateTimer = null
const AUTH_GATE_SETTLE_MS = 800
const signInButton = document.getElementById('sign-in-button')
const userName = document.getElementById('user-name')
const userButton = document.getElementById('user-button')

document.body.dataset.staging = String(location.hostname === 'localhost' || location.hostname.endsWith('.workers.dev'))
const QA_LOGS_ENABLED = document.body.dataset.staging === 'true'
const qaLog = (...args) => { if (QA_LOGS_ENABLED) console.log(...args) }
const qaWarn = (...args) => { if (QA_LOGS_ENABLED) console.warn(...args) }

let workspace = null
let bootstrapPromise = null
let mountedUserButton = false
let watchlists = []
let assetUiReady = false
let watchlistDetails = []
const monitoringSnapshotCache = new Map()
const monitoringAssetNameCache = new Map()
const MONITORING_SNAPSHOT_CACHE_MS = 60 * 1000
let monitoringSnapshotObserver = null
let currentView = 'overview'
let apiKeys = []
let apiKeysLoaded = false
let usageLoaded = false
let eventAssets = []
let selectedEventAssetIndex = -1 // -1 = All monitored assets
let incidentAssets = []
let selectedIncidentAssetIndex = -1 // -1 = All monitored assets
let lastEventsBody = null
let lastEventsAsset = null
let lastIncidentsBody = null
let lastIncidentsAsset = null
let globalAlertEventRows = []
let globalAlertIncidentRows = []
let globalAlertPollTimer = null
let globalAlertBaselineReady = false
const globalAlertEventFingerprints = new Map()
const globalAlertIncidentFingerprints = new Map()
const GLOBAL_ALERT_POLL_MS = 15 * 1000
const MONITORING_AUTO_REFRESH_MS = 15 * 60 * 1000
const NOTIFICATION_STORAGE_KEY = 'elofid.dashboard.notifications.v1'
const NOTIFICATION_CLEAR_KEY = 'elofid.dashboard.notifications.clearedAt'
const NOTIFICATION_MAX_ITEMS = 60
let notificationItems = []
let notificationClearedAt = Number(localStorage.getItem(NOTIFICATION_CLEAR_KEY) || 0) || 0
let monitoringAutoRefreshTimer = null
let monitoringRefreshInFlight = false
let monitoringRefreshLabelTimer = null
let webhooks = []
let webhookPlan = null
let webhookUsage = null
let usageData = null
let globalFeedEvents = []
let globalFeedIncidents = []
let globalPreviewItems = []
let globalAccessMode = 'preview'
let billingCycle = 'monthly'
let upgradeBillingCycle = 'monthly'
let billingSubscription = null
let timeDisplayMode = localStorage.getItem('elofid.dashboard.timeDisplay') === 'utc' ? 'utc' : 'local'

function findStep(title) {
  return [...document.querySelectorAll('.step')].find((row) => {
    return row.querySelector('strong')?.textContent?.trim() === title
  })
}

function workspaceStep() {
  return findStep('Elofid Workspace')
}

function monitoredAssetStep() {
  return findStep('Add first monitored asset') || findStep('Add monitored asset')
}

function setWorkspaceState(state, data = null) {
  const row = workspaceStep()
  if (!row) return

  const badge = row.querySelector(':scope > span:last-child')
  const detail = row.querySelector('div span')

  if (state === 'loading') {
    if (badge) {
      badge.textContent = 'CONNECTING'
      badge.className = 'next'
    }
    if (detail) detail.textContent = 'Provisioning secure workspace'
    return
  }

  if (state === 'connected') {
    if (badge) {
      badge.textContent = 'CONNECTED'
      badge.className = 'done'
    }

    if (detail && data) {
      const plan = String(data.plan_code || 'free').toUpperCase()
      const role = String(data.role || 'owner')
      detail.textContent = `${plan} workspace · ${role}`
    }
    return
  }

  if (badge) {
    badge.textContent = 'ERROR'
    badge.className = ''
  }

  if (detail) {
    detail.textContent = 'Workspace connection failed'
  }
}

function totalMonitoredAssets() {
  return watchlists.reduce((sum, item) => {
    return sum + Math.max(0, Number(item?.active_asset_count || 0))
  }, 0)
}


function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function chainDisplayName(chain) {
  return CHAINS.find(([id]) => id === chain)?.[1] || chain || 'Unknown chain'
}

function dashboardDate(value, options = {}) {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return null
  const date = new Date(n * 1000)
  const localeOptions = timeDisplayMode === 'utc' ? { ...options, timeZone: 'UTC' } : options
  return date.toLocaleString(undefined, localeOptions)
}

let settingsTimePreviewTimer = null

function renderSettingsTimePreview() {
  const clock = document.getElementById('settings-time-preview-clock')
  const dateEl = document.getElementById('settings-time-preview-date')
  const modeEl = document.getElementById('settings-time-preview-mode')
  const zoneEl = document.getElementById('settings-time-preview-zone')
  if (!clock && !dateEl && !modeEl && !zoneEl) return

  const now = new Date()
  const utc = timeDisplayMode === 'utc'
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }
  const dateOptions = { year: 'numeric', month: 'short', day: '2-digit' }
  if (utc) {
    timeOptions.timeZone = 'UTC'
    dateOptions.timeZone = 'UTC'
  }

  if (clock) clock.textContent = now.toLocaleTimeString(undefined, timeOptions)
  if (dateEl) dateEl.textContent = now.toLocaleDateString(undefined, dateOptions)
  if (modeEl) modeEl.textContent = utc ? 'UTC' : 'LOCAL'
  if (zoneEl) {
    const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Device time'
    zoneEl.textContent = utc ? 'Coordinated Universal Time' : localZone
    zoneEl.title = zoneEl.textContent
  }
}

function stopSettingsTimePreview() {
  if (settingsTimePreviewTimer === null) return
  window.clearInterval(settingsTimePreviewTimer)
  settingsTimePreviewTimer = null
}

function syncSettingsTimePreviewTimer() {
  const shouldRun = currentView === 'settings' && document.visibilityState === 'visible'
  if (!shouldRun) {
    stopSettingsTimePreview()
    return
  }

  renderSettingsTimePreview()
  if (settingsTimePreviewTimer !== null) return
  settingsTimePreviewTimer = window.setInterval(renderSettingsTimePreview, 1000)
}

function renderSettingsView() {
  const user = clerk.user
  const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || '—'
  const name = user?.fullName || user?.firstName || (email !== '—' ? email.split('@')[0] : '—')
  const plan = String(workspace?.plan_code || '—')
  const role = String(workspace?.role || '—')
  const status = String(workspace?.status || '—')

  const planEl = document.getElementById('settings-plan')
  const roleEl = document.getElementById('settings-role')
  const statusEl = document.getElementById('settings-status')
  const nameEl = document.getElementById('settings-account-name')
  const emailEl = document.getElementById('settings-account-email')
  if (planEl) planEl.textContent = plan === '—' ? plan : plan.toUpperCase()
  if (roleEl) roleEl.textContent = role === '—' ? role : role.charAt(0).toUpperCase() + role.slice(1)
  if (statusEl) statusEl.textContent = status === '—' ? status : status.charAt(0).toUpperCase() + status.slice(1)
  if (nameEl) nameEl.textContent = name
  if (emailEl) emailEl.textContent = email

  const settingsManage = document.getElementById('settings-manage-subscription')
  const paidSubscription = Boolean(billingSubscription?.has_subscription) && ['starter','growth','pro'].includes(String(billingSubscription?.current_plan_code || plan).toLowerCase())
  if (settingsManage) {
    settingsManage.hidden = !paidSubscription
    settingsManage.disabled = String(workspace?.role || '').toLowerCase() !== 'owner'
    settingsManage.textContent = globalDetailT('manageSubscription')
  }

  document.querySelectorAll('[data-time-display]').forEach((button) => {
    button.classList.toggle('active', button.dataset.timeDisplay === timeDisplayMode)
  })
  syncSettingsTimePreviewTimer()
}

function formatBillingDate(value) {
  if (!value) return null
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return null
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  if (timeDisplayMode === 'utc') options.timeZone = 'UTC'
  return date.toLocaleDateString(undefined, options)
}

function renderPlanIdentity() {
  const planCode = String(billingSubscription?.current_plan_code || workspace?.plan_code || 'free').toLowerCase()
  const plan = PLAN_PRESENTATION[planCode] || PLAN_PRESENTATION.free
  const sub = billingSubscription?.subscription || null
  const status = String(sub?.status || (planCode === 'free' ? 'free' : 'active')).toLowerCase()
  const billingCycleLabel = sub?.billing_cycle === 'annual' ? 'Annual billing' : sub?.billing_cycle === 'monthly' ? 'Monthly billing' : 'No paid subscription'
  const nextBilling = formatBillingDate(sub?.next_billed_at || sub?.current_period_ends_at)
  const statusLabel = status === 'past_due' ? 'PAST DUE' : status === 'trialing' ? 'TRIAL' : status === 'paused' ? 'PAUSED' : status === 'canceled' ? 'CANCELED' : status === 'active' ? 'ACTIVE' : 'FREE'
  const price = planCode === 'enterprise' ? 'Custom' : planCode === 'free' ? '$0' : sub?.billing_cycle === 'annual' ? `${money(plan.annual)} / year` : `${money(plan.monthly)} / month`

  const sidebar = document.getElementById('workspace-plan-pill')
  const sidebarIcon = document.getElementById('workspace-plan-pill-icon')
  const sidebarName = document.getElementById('workspace-plan-pill-name')
  if (sidebar) sidebar.dataset.plan = planCode
  if (sidebarIcon) sidebarIcon.innerHTML = planIdentityIcon(planCode, planCode === 'free' ? 18 : 16)
  if (sidebarName) sidebarName.textContent = plan.name

  const card = document.getElementById('billing-current-plan')
  if (!card) return
  card.dataset.plan = planCode
  card.dataset.status = status
  const icon = document.getElementById('billing-current-plan-icon')
  const name = document.getElementById('billing-current-plan-name')
  const badge = document.getElementById('billing-current-plan-status')
  const cycle = document.getElementById('billing-current-plan-cycle')
  const renewal = document.getElementById('billing-current-plan-renewal')
  const summary = document.getElementById('billing-current-plan-summary')
  const priceEl = document.getElementById('billing-current-plan-price')
  const manageButton = document.getElementById('billing-manage-subscription')
  if (icon) icon.innerHTML = planIdentityIcon(planCode, planCode === 'free' ? 34 : 30)
  if (name) name.textContent = plan.name
  if (badge) badge.textContent = statusLabel
  if (cycle) cycle.textContent = billingCycleLabel
  if (renewal) {
    renewal.textContent = nextBilling
      ? `${status === 'canceled' ? 'Access through' : status === 'paused' ? 'Period ends' : 'Next billing'} · ${nextBilling}`
      : (planCode === 'free' ? 'No recurring charge' : 'Billing date unavailable')
  }
  if (summary) summary.textContent = `${plan.assets} monitored assets · ${plan.api} API calls / month · ${plan.global === 'Preview' ? 'Global Intelligence Preview' : 'Full Global Intelligence'}`
  if (priceEl) priceEl.textContent = price
  if (manageButton) {
    const paidSubscription = Boolean(billingSubscription?.has_subscription) && ['starter','growth','pro'].includes(planCode)
    manageButton.hidden = !paidSubscription
    manageButton.disabled = String(workspace?.role || '').toLowerCase() !== 'owner'
    manageButton.textContent = globalDetailT('manageSubscription')
  }

  const paidSubscription = Boolean(billingSubscription?.has_subscription) && ['starter','growth','pro'].includes(planCode)
  const owner = String(workspace?.role || '').toLowerCase() === 'owner'
  const setBillingDetail = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value }
  setBillingDetail('billing-detail-plan', plan.name)
  setBillingDetail('billing-detail-cycle', billingCycleLabel)
  setBillingDetail('billing-detail-status', statusLabel)
  setBillingDetail('billing-detail-next', nextBilling || (planCode === 'free' ? 'No recurring charge' : 'Unavailable'))
  setBillingDetail('billing-detail-rate', price)

  const changePlan = document.getElementById('billing-change-plan')
  if (changePlan) changePlan.textContent = paidSubscription ? globalDetailT('changePlan') : 'Compare paid plans'
  const documentsButton = document.getElementById('billing-open-documents')
  const documentsTitle = document.getElementById('billing-documents-title')
  const documentsCopy = document.getElementById('billing-documents-copy')
  if (documentsButton) {
    documentsButton.disabled = !paidSubscription || !owner
    documentsButton.textContent = paidSubscription ? 'View invoices & receipts' : 'View invoices & receipts'
  }
  if (documentsTitle) documentsTitle.textContent = paidSubscription ? 'Billing documents available in Paddle' : 'No billing documents yet'
  if (documentsCopy) documentsCopy.textContent = paidSubscription
    ? (owner ? 'Open the secure Paddle customer portal to view and download invoices and receipts.' : 'Billing documents can be opened by the workspace owner.')
    : 'Invoices and receipts become available after a paid subscription charge.'

  renderOverviewPlanStatus()
}


function overviewPlanStatusLabel(status, planCode) {
  const normalized = String(status || '').toLowerCase()
  if (normalized === 'past_due') return globalDetailT('overviewStatusPastDue')
  if (normalized === 'paused') return globalDetailT('overviewStatusPaused')
  if (normalized === 'canceled') return globalDetailT('overviewStatusCanceled')
  if (normalized === 'trialing') return globalDetailT('overviewStatusTrial')
  if (normalized === 'active') return globalDetailT('overviewStatusActive')
  return String(planCode || '').toLowerCase() === 'free' ? globalDetailT('overviewStatusFree') : globalDetailT('overviewStatusActive')
}

function overviewUsagePct(used, limit) {
  const u = Number(used)
  const l = Number(limit)
  if (!(Number.isFinite(u) && Number.isFinite(l) && l > 0)) return null
  return Math.min(100, Math.max(0, (u / l) * 100))
}

function renderOverviewPlanStatus() {
  const card = document.getElementById('overview-plan-status')
  if (!card) return

  if (!workspace || !usageLoaded) {
    card.dataset.plan = 'loading'
    card.dataset.status = 'loading'

    const icon = document.getElementById('overview-plan-icon')
    const kicker = document.getElementById('overview-plan-kicker')
    const name = document.getElementById('overview-plan-name')
    const badge = document.getElementById('overview-plan-status-badge')
    const assetValue = document.getElementById('overview-plan-assets-value')
    const apiValue = document.getElementById('overview-plan-api-value')
    const assetProgress = document.getElementById('overview-plan-assets-progress')
    const apiProgress = document.getElementById('overview-plan-api-progress')
    const billing = document.getElementById('overview-plan-billing')

    if (icon) icon.innerHTML = ''
    if (kicker) kicker.textContent = globalDetailT('overviewCurrentPlan')
    if (name) name.textContent = 'Loading plan…'
    if (badge) badge.textContent = 'SYNCING'
    if (assetValue) assetValue.textContent = '—'
    if (apiValue) apiValue.textContent = '—'
    if (assetProgress) assetProgress.style.width = '0%'
    if (apiProgress) apiProgress.style.width = '0%'
    if (billing) billing.textContent = 'Checking your Elofid plan…'
    return
  }

  const planCode = String(billingSubscription?.current_plan_code || workspace?.plan_code || 'free').toLowerCase()
  const plan = PLAN_PRESENTATION[planCode] || PLAN_PRESENTATION.free
  const sub = billingSubscription?.subscription || null
  const status = String(sub?.status || (planCode === 'free' ? 'free' : 'active')).toLowerCase()

  card.dataset.plan = planCode
  card.dataset.status = status
  card.setAttribute('dir', globalDetailLanguage() === 'ar' ? 'rtl' : 'ltr')

  const icon = document.getElementById('overview-plan-icon')
  const kicker = document.getElementById('overview-plan-kicker')
  const name = document.getElementById('overview-plan-name')
  const badge = document.getElementById('overview-plan-status-badge')
  const assetLabel = document.getElementById('overview-plan-assets-label')
  const assetValue = document.getElementById('overview-plan-assets-value')
  const assetProgress = document.getElementById('overview-plan-assets-progress')
  const apiLabel = document.getElementById('overview-plan-api-label')
  const apiValue = document.getElementById('overview-plan-api-value')
  const apiProgress = document.getElementById('overview-plan-api-progress')
  const billing = document.getElementById('overview-plan-billing')
  const action = document.getElementById('overview-plan-billing-link')

  if (icon) icon.innerHTML = planIdentityIcon(planCode, planCode === 'free' ? 22 : 20)
  if (kicker) kicker.textContent = globalDetailT('overviewCurrentPlan')
  if (name) name.textContent = plan.name
  if (badge) badge.textContent = overviewPlanStatusLabel(status, planCode)
  if (assetLabel) assetLabel.textContent = globalDetailT('overviewMonitoredAssets')
  if (apiLabel) apiLabel.textContent = globalDetailT('overviewApiCalls')
  if (action) action.textContent = `${globalDetailT('overviewViewBilling')} →`

  const assetsUsed = Number(usageData?.monitored_assets?.used ?? 0)
  const assetsLimit = usageData?.monitored_assets?.limit == null ? null : Number(usageData.monitored_assets.limit)
  const apiUsed = Number(usageData?.used ?? 0)
  const apiLimit = usageData?.limit == null ? null : Number(usageData.limit)

  if (assetValue) assetValue.textContent = assetsLimit == null
    ? `${formatCompactNumber(assetsUsed)} / ${plan.assets}`
    : `${formatCompactNumber(assetsUsed)} / ${formatCompactNumber(assetsLimit)}`
  if (apiValue) apiValue.textContent = apiLimit == null
    ? `${formatCompactNumber(apiUsed)} / ${plan.api}`
    : `${formatCompactNumber(apiUsed)} / ${formatCompactNumber(apiLimit)}`

  const assetPct = overviewUsagePct(assetsUsed, assetsLimit)
  const apiPct = overviewUsagePct(apiUsed, apiLimit)
  if (assetProgress) assetProgress.style.width = `${assetPct ?? 0}%`
  if (apiProgress) apiProgress.style.width = `${apiPct ?? 0}%`

  const nextBilling = formatBillingDate(sub?.next_billed_at || sub?.current_period_ends_at)
  let billingText = globalDetailT('overviewNoPaidSubscription')
  if (planCode === 'free') {
    billingText = globalDetailT('overviewNoRecurringCharge')
  } else {
    const cycle = sub?.billing_cycle === 'annual'
      ? globalDetailT('overviewAnnualBilling')
      : sub?.billing_cycle === 'monthly'
        ? globalDetailT('overviewMonthlyBilling')
        : globalDetailT('overviewNoPaidSubscription')
    const dateLabel = status === 'canceled'
      ? globalDetailT('overviewAccessThrough')
      : status === 'paused'
        ? globalDetailT('overviewPeriodEnds')
        : globalDetailT('overviewNextBilling')
    billingText = nextBilling ? `${cycle} · ${dateLabel} ${nextBilling}` : `${cycle} · ${globalDetailT('overviewBillingUnavailable')}`
  }
  if (billing) billing.textContent = billingText
}

function syncBillingCycleToSubscription() {
  const currentCycle = String(billingSubscription?.subscription?.billing_cycle || '').toLowerCase()
  if (!['monthly', 'annual'].includes(currentCycle)) return
  billingCycle = currentCycle
  document.querySelectorAll('[data-billing-cycle]').forEach((button) => {
    button.classList.toggle('active', button.dataset.billingCycle === billingCycle)
  })
}

async function loadBillingSubscription(token) {
  const response = await fetch(`${CONTROL_PLANE}/v1/billing/subscription`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  })
  const body = await response.json().catch(() => null)
  if (!response.ok || !body?.ok || !body?.data) {
    throw new Error(body?.error || `HTTP ${response.status}`)
  }
  billingSubscription = body.data
  syncBillingCycleToSubscription()
  qaLog('ELOFID BILLING SUBSCRIPTION VIEW CLIENT QA', {
    status: response.status,
    current_plan_code: billingSubscription?.current_plan_code || null,
    has_subscription: Boolean(billingSubscription?.has_subscription),
    subscription_plan_code: billingSubscription?.subscription?.plan_code || null,
    billing_cycle: billingSubscription?.subscription?.billing_cycle || null,
    subscription_status: billingSubscription?.subscription?.status || null,
    billing_identifiers_exposed: false
  })
  renderPlanIdentity()
  renderOverviewPlanStatus()
  return billingSubscription
}

function billingPortalErrorMessage(code) {
  const key = String(code || '')
  if (key === 'billing_owner_required') return globalDetailT('billingPortalOwnerRequired')
  if (key === 'paid_subscription_not_found' || key === 'paddle_billing_identity_unavailable') return globalDetailT('billingPortalUnavailable')
  if (key === 'unsupported_subscription_status') return globalDetailT('billingPortalUnsupportedStatus')
  return globalDetailT('billingPortalFailed')
}

function trustedPaddlePortalUrl(value, environment) {
  try {
    const url = new URL(String(value || ''))
    if (url.protocol !== 'https:') return false
    const host = url.hostname.toLowerCase()
    if (environment === 'sandbox') return host === 'sandbox-customer-portal.paddle.com' || host === 'customer-portal.paddle.com'
    return host === 'customer-portal.paddle.com'
  } catch {
    return false
  }
}

async function openBillingPortal(triggerButton) {
  const planCode = String(billingSubscription?.current_plan_code || workspace?.plan_code || 'free').toLowerCase()
  if (!['starter','growth','pro'].includes(planCode) || !billingSubscription?.has_subscription) {
    throw new Error(globalDetailT('billingPortalUnavailable'))
  }

  const token = await clerk.session?.getToken()
  if (!token) throw new Error(globalDetailT('authenticationUnavailable'))

  const originalText = triggerButton?.textContent || ''
  if (triggerButton) {
    triggerButton.disabled = true
    triggerButton.textContent = globalDetailT('billingPortalOpening')
  }

  try {
    const response = await fetch(`${CONTROL_PLANE}/v1/billing/portal-session`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
    const body = await response.json().catch(() => null)
    if (!response.ok || !body?.ok || !body?.data?.portal_url) {
      throw new Error(billingPortalErrorMessage(body?.error || `HTTP ${response.status}`))
    }

    const portalUrl = String(body.data.portal_url || '')
    const environment = String(body.data.environment || '')
    if (!trustedPaddlePortalUrl(portalUrl, environment)) {
      throw new Error(globalDetailT('billingPortalInvalidUrl'))
    }

    qaLog('ELOFID PADDLE CUSTOMER PORTAL CLIENT QA', {
      status: response.status,
      environment,
      plan_code: body.data.plan_code || null,
      subscription_status: body.data.subscription_status || null,
      temporary: body.data.temporary === true,
      billing_identifiers_exposed: false,
      portal_host_validated: true,
    })

    window.location.assign(portalUrl)
  } finally {
    if (triggerButton?.isConnected) {
      triggerButton.disabled = false
      triggerButton.textContent = originalText
    }
  }
}

function setDashboardView(view) {
  const overview = document.getElementById('overview-view')
  const monitoring = document.getElementById('monitoring-view')
  const apiKeysView = document.getElementById('api-keys-view')
  const eventsView = document.getElementById('events-view')
  const incidentsView = document.getElementById('incidents-view')
  const webhooksView = document.getElementById('webhooks-view')
  const globalFeedView = document.getElementById('global-feed-view')
  const usageView = document.getElementById('usage-view')
  const billingView = document.getElementById('billing-view')
  const billingAccountView = document.getElementById('billing-account-view')
  const settingsView = document.getElementById('settings-view')
  const monitoringList = document.getElementById('monitoring-list')
  if (monitoringList && monitoringList.dataset.actionsBound !== 'true') {
    monitoringList.dataset.actionsBound = 'true'
    monitoringList.addEventListener('click', async (event) => {
      const favoriteButton = event.target.closest('.monitoring-favorite-toggle')
      if (favoriteButton) {
        const chain = String(favoriteButton.dataset.chain || '')
        const tokenAddress = String(favoriteButton.dataset.token || '')
        if (!chain || !tokenAddress) return
        const enabled = favoriteButton.getAttribute('aria-pressed') !== 'true'
        setMonitoringFavorite(chain, tokenAddress, enabled)
        favoriteButton.classList.toggle('is-favorite', enabled)
        favoriteButton.setAttribute('aria-pressed', enabled ? 'true' : 'false')
        favoriteButton.setAttribute('aria-label', enabled ? 'Remove from Favorites' : 'Add to Favorites')
        favoriteButton.setAttribute('title', enabled ? 'Remove from Favorites' : 'Add to Favorites')
        if (String(document.getElementById('monitoring-watchlist-filter')?.value || 'all') === 'favorites' && !enabled) {
          renderMonitoringView()
        }
        return
      }

      const tokenCopy = event.target.closest('.monitoring-token-copy')
      if (tokenCopy) {
        const tokenAddress = String(tokenCopy.dataset.token || '')
        if (!tokenAddress) return
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(tokenAddress)
          } else {
            const textarea = document.createElement('textarea')
            textarea.value = tokenAddress
            textarea.setAttribute('readonly', '')
            textarea.style.position = 'fixed'
            textarea.style.opacity = '0'
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            textarea.remove()
          }
          tokenCopy.classList.add('is-copied')
          tokenCopy.setAttribute('aria-label', 'Contract address copied')
          setTimeout(() => {
            if (!tokenCopy.isConnected) return
            tokenCopy.classList.remove('is-copied')
            tokenCopy.setAttribute('aria-label', `Copy contract address ${tokenAddress}`)
          }, 1200)
        } catch (error) {
          console.error('Elofid contract address copy failed', error)
        }
        return
      }

      const button = event.target.closest('.monitoring-remove-trigger')
      if (!button) return
      const watchlistId = Number(button.dataset.watchlistId)
      const chain = String(button.dataset.chain || '')
      const tokenAddress = String(button.dataset.token || '')
      if (!(Number.isSafeInteger(watchlistId) && watchlistId > 0 && chain && tokenAddress)) return
      window.__elofidOpenRemoveAsset?.(watchlistId, chain, tokenAddress)
    })
  }

  
const dashboardAside = document.querySelector('#dashboard-app > aside')
const mobileNavToggle = document.getElementById('mobile-nav-toggle')
const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop')

function setMobileNav(open) {
  const isOpen = Boolean(open) && window.matchMedia('(max-width: 950px)').matches
  dashboardAside?.classList.toggle('mobile-open', isOpen)
  if (mobileNavBackdrop) {
    mobileNavBackdrop.dataset.open = isOpen ? 'true' : 'false'
    mobileNavBackdrop.setAttribute('aria-hidden', isOpen ? 'false' : 'true')
  }
  mobileNavToggle?.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
  mobileNavToggle?.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation')
}

if (mobileNavToggle && mobileNavToggle.dataset.navBound !== 'true') {
  mobileNavToggle.dataset.navBound = 'true'
  mobileNavToggle.addEventListener('click', () => {
    setMobileNav(!dashboardAside?.classList.contains('mobile-open'))
  })
  mobileNavBackdrop?.addEventListener('click', () => setMobileNav(false))
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMobileNav(false)
  })
  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 950px)').matches) setMobileNav(false)
  })
  document.querySelectorAll('#dashboard-app aside nav a').forEach((link) => {
    link.addEventListener('click', () => setMobileNav(false))
  })
}

const navOverview = document.getElementById('nav-overview')
  const navMonitoring = document.getElementById('nav-monitoring')
  const navApiKeys = document.getElementById('nav-api-keys')
  const navEvents = document.getElementById('nav-events')
  const navIncidents = document.getElementById('nav-incidents')
  const navWebhooks = document.getElementById('nav-webhooks')
  const navGlobalFeed = document.getElementById('nav-global-feed')
  const navUsage = document.getElementById('nav-usage')
  const navBilling = document.getElementById('nav-billing')
  const navSettings = document.getElementById('nav-settings')
  const topbarTitle = document.querySelector('.topbar-title')

  currentView = ['global-feed', 'monitoring', 'events', 'incidents', 'webhooks', 'api-keys', 'usage', 'billing', 'billing-account', 'settings'].includes(view) ? view : 'overview'

  if (overview) overview.hidden = currentView !== 'overview'
  if (monitoring) monitoring.hidden = currentView !== 'monitoring'
  if (apiKeysView) apiKeysView.hidden = currentView !== 'api-keys'
  if (eventsView) eventsView.hidden = currentView !== 'events'
  if (incidentsView) incidentsView.hidden = currentView !== 'incidents'
  if (webhooksView) webhooksView.hidden = currentView !== 'webhooks'
  if (globalFeedView) globalFeedView.hidden = currentView !== 'global-feed'
  if (usageView) usageView.hidden = currentView !== 'usage'
  if (billingView) billingView.hidden = currentView !== 'billing'
  if (billingAccountView) billingAccountView.hidden = currentView !== 'billing-account'
  if (settingsView) settingsView.hidden = currentView !== 'settings'
  syncSettingsTimePreviewTimer()

  navOverview?.classList.toggle('active', currentView === 'overview')
  navMonitoring?.classList.toggle('active', currentView === 'monitoring')
  navApiKeys?.classList.toggle('active', currentView === 'api-keys')
  navEvents?.classList.toggle('active', currentView === 'events')
  navIncidents?.classList.toggle('active', currentView === 'incidents')
  navWebhooks?.classList.toggle('active', currentView === 'webhooks')
  navGlobalFeed?.classList.toggle('active', currentView === 'global-feed')
  navUsage?.classList.toggle('active', currentView === 'usage')
  navBilling?.classList.toggle('active', currentView === 'billing')
  navSettings?.classList.toggle('active', currentView === 'settings')

  if (topbarTitle) {
    const titles = { 'global-feed':'Global Feed', monitoring:'My Monitoring', events:'Events', incidents:'Incidents', webhooks:'Webhooks', 'api-keys':'API Keys', usage:'Usage', billing:'Plans', 'billing-account':'Billing', settings:'Settings', overview:'Dashboard' }
    topbarTitle.textContent = titles[currentView] || 'Dashboard'
  }
}

const API_KEY_PREFIXES = ['elo_live_', 'elo_test_']

function apiKeyVisiblePrefix(value) {
  const text = String(value || '')
  return API_KEY_PREFIXES.find((prefix) => text.startsWith(prefix)) || ''
}

function maskedApiKeyLabel(keyPrefix) {
  const prefix = apiKeyVisiblePrefix(keyPrefix)
  return `${prefix || 'elo_'}••••••••••••••••`
}

function maskedPlaintextApiKey(fullKey) {
  const value = String(fullKey || '')
  const visiblePrefix = apiKeyVisiblePrefix(value)
  return `${visiblePrefix}${'•'.repeat(Math.max(16, value.length - visiblePrefix.length))}`
}

function renderApiKeysView() {
  const list = document.getElementById('api-keys-list')
  if (!list) return

  if (!apiKeys.length) {
    list.innerHTML = `
      <div class="api-keys-empty">
        No API keys yet. Create one when you are ready to connect server-side to the Elofid API.
      </div>
    `
    return
  }

  list.innerHTML = apiKeys.map((key) => {
    const created = Number.isFinite(Number(key?.created_at))
      ? dashboardDate(Number(key.created_at))
      : 'Unknown'
    const status = String(key?.status || 'unknown')
    const active = status === 'active'
    const id = Number(key?.id)

    return `
      <div class="api-key-row" data-key-id="${Number.isSafeInteger(id) ? id : ''}">
        <div>
          <div class="api-key-name">${escapeHtml(key?.name || 'Unnamed key')}</div>
          <div class="api-key-id">ID #${escapeHtml(Number.isSafeInteger(id) ? id : '—')}</div>
        </div>
        <div class="api-key-prefix" title="The full secret is not stored and cannot be revealed again.">${escapeHtml(maskedApiKeyLabel(key?.key_prefix))}</div>
        <div class="api-key-status ${active ? '' : 'is-revoked'}">${escapeHtml(status)}</div>
        <div class="api-key-meta">Created ${escapeHtml(created)}</div>
        <div class="api-key-actions">
          ${active ? `
            <button type="button" class="api-key-action" data-api-key-action="rotate" data-api-key-id="${id}">Rotate</button>
            <button type="button" class="api-key-action is-danger" data-api-key-action="revoke" data-api-key-id="${id}">Revoke</button>
          ` : '<span class="api-key-revoked-note">No longer valid</span>'}
        </div>
      </div>
    `
  }).join('')
}

function renderApiKeysError(message) {
  const list = document.getElementById('api-keys-list')
  if (!list) return
  list.innerHTML = `<div class="api-keys-error">${escapeHtml(message)}</div>`
}

async function loadApiKeys(token) {
  const response = await fetch(`${CONTROL_PLANE}/v1/api-keys`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  })

  const body = await response.json().catch(() => null)

  qaLog('ELOFID API KEYS QA', {
    status: response.status,
    body
  })

  if (!response.ok || !Array.isArray(body?.data)) {
    const message =
      body?.detail ||
      body?.message ||
      body?.error ||
      `HTTP ${response.status}`

    throw new Error(`Unable to load API keys: ${message}`)
  }

  apiKeys = body.data
  apiKeysLoaded = true
  renderApiKeysView()
  setApiKeyStepState()
  return apiKeys
}

async function createApiKey(token, name) {
  const response = await fetch(`${CONTROL_PLANE}/v1/api-keys`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name })
  })

  const body = await response.json().catch(() => null)
  const created = body?.data

  qaLog('ELOFID API KEY CREATE QA', {
    status: response.status,
    data: created ? {
      id: created.id,
      name: created.name,
      key_prefix: created.key_prefix,
      status: created.status,
      secret_received: typeof created.api_key === 'string' && created.api_key.length > 0
    } : null
  })

  if (!response.ok || !created?.id || !created?.api_key) {
    const message = body?.detail || body?.message || body?.error || `HTTP ${response.status}`
    throw new Error(`Unable to create API key: ${message}`)
  }

  return created
}

async function rotateApiKey(token, apiKeyId) {
  const response = await fetch(`${CONTROL_PLANE}/v1/api-keys/${apiKeyId}/rotate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  })

  const body = await response.json().catch(() => null)
  const created = body?.data

  qaLog('ELOFID API KEY ROTATE QA', {
    status: response.status,
    data: created ? {
      id: created.id,
      name: created.name,
      key_prefix: created.key_prefix,
      status: created.status,
      rotated_from_id: created?.rotated_from?.id || apiKeyId,
      previous_key_still_active: created?.rotated_from?.status === 'active',
      secret_received: typeof created.api_key === 'string' && created.api_key.length > 0
    } : null
  })

  if (!response.ok || !created?.id || !created?.api_key) {
    const message = body?.detail || body?.message || body?.error || `HTTP ${response.status}`
    throw new Error(`Unable to rotate API key: ${message}`)
  }

  return created
}

async function revokeApiKey(token, apiKeyId) {
  const response = await fetch(`${CONTROL_PLANE}/v1/api-keys/${apiKeyId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  })

  const body = await response.json().catch(() => null)

  qaLog('ELOFID API KEY REVOKE QA', {
    status: response.status,
    data: body?.data ? {
      id: body.data.id,
      status: body.data.status,
      revoked_at: body.data.revoked_at
    } : null
  })

  if (!response.ok || body?.data?.status !== 'revoked') {
    const message = body?.detail || body?.message || body?.error || `HTTP ${response.status}`
    throw new Error(`Unable to revoke API key: ${message}`)
  }

  return body.data
}

function setApiKeyStepState() {
  const row = findStep('Create API key')
  if (!row) return

  const detail = row.querySelector('div span')
  const badge = row.querySelector(':scope > span:last-child')
  const count = apiKeys.filter((item) => item?.status === 'active').length

  if (detail) {
    detail.textContent = count > 0
      ? `${count} active API key${count === 1 ? '' : 's'}`
      : 'Server-side access'
  }

  if (badge) {
    badge.textContent = count > 0 ? 'CREATED' : 'READY'
    badge.className = count > 0 ? 'done' : 'next'
  }
}

function injectApiKeyCreateUi() {
  const openButton = document.getElementById('api-key-create')
  const list = document.getElementById('api-keys-list')
  const backdrop = document.getElementById('cx-key-backdrop')
  const form = document.getElementById('cx-key-form')
  const title = document.getElementById('cx-key-title')
  const subtitle = document.getElementById('cx-key-subtitle')
  const nameLabel = document.querySelector('label[for="cx-key-name"]')
  const nameInput = document.getElementById('cx-key-name')
  const note = document.getElementById('cx-key-note')
  const secretWrap = document.getElementById('cx-key-secret-wrap')
  const secretEl = document.getElementById('cx-key-secret')
  const submit = document.getElementById('cx-key-submit')
  const copy = document.getElementById('cx-key-copy')
  const toggle = document.getElementById('cx-key-toggle')
  const confirm = document.getElementById('cx-key-confirm')
  const close = document.getElementById('cx-key-close')
  const cancel = document.getElementById('cx-key-cancel')

  if (!openButton || !list || !backdrop || !form || !title || !subtitle || !nameLabel || !nameInput || !note || !secretWrap || !secretEl || !submit || !copy || !toggle || !confirm || !close || !cancel) return
  if (openButton.dataset.bound === 'true') return
  openButton.dataset.bound = 'true'

  let mode = 'create'
  let rotateTarget = null
  let revealedKey = null
  let secretVisible = true

  const renderSecret = () => {
    if (!revealedKey) {
      secretEl.textContent = ''
      return
    }
    secretEl.textContent = secretVisible ? revealedKey : maskedPlaintextApiKey(revealedKey)
    toggle.textContent = secretVisible ? 'Hide' : 'Show'
  }

  const reset = () => {
    mode = 'create'
    rotateTarget = null
    revealedKey = null
    secretVisible = true
    secretEl.textContent = ''
    secretWrap.dataset.open = 'false'
    form.reset()
    title.textContent = 'Create API key'
    subtitle.textContent = 'Name the credential so you can identify it later. The plaintext key will be shown exactly once.'
    nameLabel.hidden = false
    nameInput.hidden = false
    nameInput.disabled = false
    note.dataset.state = ''
    note.textContent = 'Keep API keys server-side and out of browser code or public repositories.'
    submit.hidden = false
    submit.disabled = false
    submit.textContent = 'Create key'
    copy.hidden = true
    copy.disabled = false
    copy.textContent = 'Copy key'
    toggle.hidden = true
    confirm.hidden = true
    cancel.hidden = false
  }

  const closeModal = async () => {
    const hadSecret = Boolean(revealedKey)
    reset()
    backdrop.dataset.open = 'false'
    if (hadSecret) {
      try {
        const sessionToken = await clerk.session?.getToken()
        if (sessionToken) await loadApiKeys(sessionToken)
      } catch (error) {
        console.error('Elofid API Keys refresh failed', error)
      }
    }
  }

  const openCreateModal = () => {
    reset()
    backdrop.dataset.open = 'true'
    window.setTimeout(() => nameInput.focus(), 30)
  }

  const openRotateModal = (key) => {
    reset()
    mode = 'rotate'
    rotateTarget = key
    title.textContent = 'Rotate API key'
    subtitle.textContent = 'Create a replacement credential. The current key stays active until you revoke it, preventing accidental downtime.'
    nameInput.value = String(key?.name || 'API key')
    nameInput.disabled = true
    note.textContent = `Rotating ${key?.name || 'API key'} · ID #${key?.id || '—'}`
    submit.textContent = 'Create replacement'
    backdrop.dataset.open = 'true'
  }

  openButton.addEventListener('click', openCreateModal)
  close.addEventListener('click', closeModal)
  cancel.addEventListener('click', closeModal)
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) closeModal()
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && backdrop.dataset.open === 'true') closeModal()
  })

  list.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-api-key-action]')
    if (!button) return

    const apiKeyId = Number(button.dataset.apiKeyId)
    const action = button.dataset.apiKeyAction
    const key = apiKeys.find((item) => Number(item?.id) === apiKeyId)
    if (!key || !Number.isSafeInteger(apiKeyId) || apiKeyId <= 0) return

    if (action === 'rotate') {
      openRotateModal(key)
      return
    }

    if (action === 'revoke') {
      const approved = window.confirm(`Revoke “${key.name || 'API key'}” (ID #${apiKeyId})?\n\nApplications using this key will stop authenticating immediately.`)
      if (!approved) return

      button.disabled = true
      try {
        const sessionToken = await clerk.session?.getToken()
        if (!sessionToken) throw new Error('Authentication session is unavailable.')
        await revokeApiKey(sessionToken, apiKeyId)
        await loadApiKeys(sessionToken)
      } catch (error) {
        console.error('Elofid API key revoke failed', error)
        window.alert(error?.message || 'Unable to revoke API key.')
        button.disabled = false
      }
    }
  })

  copy.addEventListener('click', async () => {
    if (!revealedKey) return
    try {
      await navigator.clipboard.writeText(revealedKey)
      copy.textContent = 'Copied'
      window.setTimeout(() => {
        if (revealedKey) copy.textContent = 'Copy key'
      }, 1200)
    } catch {
      note.dataset.state = 'error'
      note.textContent = 'Clipboard access failed. Select the key above and copy it manually.'
    }
  })

  toggle.addEventListener('click', () => {
    if (!revealedKey) return
    secretVisible = !secretVisible
    renderSecret()
  })

  confirm.addEventListener('click', closeModal)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (revealedKey) return

    const name = nameInput.value.trim()
    if (mode === 'create' && (!name || name.length > 80)) {
      note.dataset.state = 'error'
      note.textContent = 'Enter a key name between 1 and 80 characters.'
      return
    }

    if (mode === 'rotate' && (!rotateTarget?.id || rotateTarget?.status !== 'active')) {
      note.dataset.state = 'error'
      note.textContent = 'This API key is not available for rotation.'
      return
    }

    submit.disabled = true
    submit.textContent = mode === 'rotate' ? 'Rotating…' : 'Creating…'
    note.dataset.state = ''
    note.textContent = mode === 'rotate'
      ? 'Creating a replacement Elofid API key…'
      : 'Creating your Elofid API key…'

    try {
      const sessionToken = await clerk.session?.getToken()
      if (!sessionToken) throw new Error('Authentication session is unavailable.')

      const created = mode === 'rotate'
        ? await rotateApiKey(sessionToken, Number(rotateTarget.id))
        : await createApiKey(sessionToken, name)

      revealedKey = created.api_key
      secretVisible = true
      renderSecret()
      secretWrap.dataset.open = 'true'
      note.dataset.state = ''
      note.textContent = mode === 'rotate'
        ? `Replacement created. The previous key remains active until you revoke it.`
        : `Created ${created.name || 'API key'} · ${created.key_prefix || ''}`
      submit.hidden = true
      copy.hidden = false
      toggle.hidden = false
      confirm.hidden = false
      cancel.hidden = true

      await loadApiKeys(sessionToken)
      setApiKeyStepState()
    } catch (error) {
      console.error(`Elofid API key ${mode === 'rotate' ? 'rotation' : 'creation'} failed`, error)
      note.dataset.state = 'error'
      note.textContent = error?.message || `Unable to ${mode === 'rotate' ? 'rotate' : 'create'} API key.`
      submit.disabled = false
      submit.textContent = mode === 'rotate' ? 'Create replacement' : 'Create key'
    }
  })
}



function formatCompactNumber(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n)
}


function shortToken(value) {
  const s = String(value || '')
  if (s.length <= 18) return s
  return `${s.slice(0, 8)}…${s.slice(-6)}`
}

function formatPrimaryChange(primary, fallbackChange = null) {
  const metric = String(primary?.metric || '')
  const raw = primary?.value
  const n = Number(raw)
  if (Number.isFinite(n)) {
    if (metric === 'price_drop_pct') return `Price ↓${Math.abs(n).toFixed(1)}%`
    if (metric === 'liquidity_drop_pct') return `Liquidity ↓${Math.abs(n).toFixed(1)}%`
    if (metric === 'exit_depth_drop_pct') return `Exit Depth ↓${Math.abs(n).toFixed(1)}%`
    if (metric === 'score_change') return `Score ${n > 0 ? '+' : ''}${n}`
  }
  const c = fallbackChange || {}
  for (const [k,label] of [['price_drop_pct','Price'],['liquidity_drop_pct','Liquidity'],['exit_depth_drop_pct','Exit Depth']]) {
    const v = Number(c?.[k]); if (Number.isFinite(v)) return `${label} ↓${Math.abs(v).toFixed(1)}%`
  }
  const score = Number(c?.score_change); if (Number.isFinite(score)) return `Score ${score > 0 ? '+' : ''}${score}`
  return 'Meaningful change detected'
}

function globalCardIcon(kind, row) {
  const type = String(row?.type || '').toLowerCase()
  if (kind === 'incident') {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.3 19 6v5.2c0 4.5-2.7 7.9-7 9.5-4.3-1.6-7-5-7-9.5V6l7-2.7Z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`
  }
  if (type.includes('price')) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6v12h16"/><path d="m7 9 4 4 3-3 4 5"/><path d="M18 11v4h-4"/></svg>`
  }
  if (type.includes('liquidity') || type.includes('exit_depth')) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11Z"/><path d="M9.5 15.5c.7.7 1.5 1 2.5 1"/></svg>`
  }
  if (type.includes('score')) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.3 19 6v5.2c0 4.5-2.7 7.9-7 9.5-4.3-1.6-7-5-7-9.5V6l7-2.7Z"/><path d="m9 10 3 3 3-3"/><path d="M12 8v5"/></svg>`
  }
  if (type.includes('pause')) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`
  }
  if (type.includes('mint') || type.includes('freeze') || type.includes('honeypot')) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.3 19 6v5.2c0 4.5-2.7 7.9-7 9.5-4.3-1.6-7-5-7-9.5V6l7-2.7Z"/><path d="M9 12h6"/><path d="M12 9v6"/></svg>`
  }
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.3 19 6v5.2c0 4.5-2.7 7.9-7 9.5-4.3-1.6-7-5-7-9.5V6l7-2.7Z"/><path d="M8.5 12h7"/></svg>`
}

function globalFeedDateObject(value) {
  const n = Number(value)
  const d = Number.isFinite(n) && n > 0
    ? new Date(n * 1000)
    : new Date(String(value || ''))
  return Number.isNaN(d.getTime()) ? null : d
}

function formatGlobalFeedTime(value) {
  const d = globalFeedDateObject(value)
  if (!d) return 'Time unavailable'
  // Respects the Settings → Time display preference (Local / UTC).
  const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }
  if (timeDisplayMode === 'utc') { options.timeZone = 'UTC'; options.timeZoneName = 'short' }
  return new Intl.DateTimeFormat(undefined, options).format(d)
}

// "just now", "12m ago", "5h ago", "10d ago". The exact time stays available as a tooltip.
function globalFeedRelativeTime(value) {
  const d = globalFeedDateObject(value)
  if (!d) return 'Time unavailable'
  const sec = Math.max(0, Math.round((Date.now() - d.getTime()) / 1000))
  if (sec < 60) return 'just now'
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`
  if (sec < 86400 * 60) return `${Math.floor(sec / 86400)}d ago`
  return formatGlobalFeedTime(value)
}

function refreshGlobalFeedRelativeLabels() {
  if (currentView !== 'global-feed') return
  const root = document.getElementById('global-feed-view')
  if (!root) return

  root.querySelectorAll('[data-global-feed-time]').forEach((el) => {
    const value = el.dataset.globalFeedTime
    if (!value) return
    el.textContent = globalFeedRelativeTime(value)
    el.title = formatGlobalFeedTime(value)
  })

  const meta = document.getElementById('global-feed-meta')
  const base = meta?.dataset?.globalFeedMetaBase || ''
  if (meta && base && globalFeedLoadedAt) {
    meta.textContent = `${base} · Updated ${globalFeedRelativeTime(Math.floor(globalFeedLoadedAt / 1000))}`
  }
}

const GLOBAL_EXPLORERS = Object.freeze({
  eth: 'https://etherscan.io/token/',
  bsc: 'https://bscscan.com/token/',
  polygon: 'https://polygonscan.com/token/',
  base: 'https://basescan.org/token/',
  arbitrum: 'https://arbiscan.io/token/',
  optimism: 'https://optimistic.etherscan.io/token/',
  avalanche: 'https://snowtrace.io/token/',
  linea: 'https://lineascan.build/token/',
  scroll: 'https://scrollscan.com/token/',
  opbnb: 'https://opbnb.bscscan.com/token/',
  robinhood: 'https://robinhoodchain.blockscout.com/token/',
  solana: 'https://solscan.io/token/'
})

function globalExplorerUrl(chain, token) {
  const base = GLOBAL_EXPLORERS[String(chain || '').toLowerCase()]
  const t = String(token || '').trim()
  if (!base || !t) return null
  if (String(chain) === 'solana' ? !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(t) : !/^0x[0-9a-fA-F]{40}$/.test(t)) return null
  return base + encodeURIComponent(t)
}

// Before → after for the event's own metric, plus liquidity at detection time.
// Uses only values returned by the API. Nothing is estimated in the browser.
function globalCardContext(kind, row) {
  if (kind !== 'event') return ''
  const def = globalDetailMetricDefinition(row?.type)
  const parts = []
  if (def) {
    const before = globalDetailFinite(row?.baseline?.[def.key])
    const after = globalDetailFinite(row?.current?.[def.key])
    if (before != null && after != null && def.key !== 'liquidity_usd') parts.push(`${def.format(before)} → ${def.format(after)}`)
    if (before != null && after != null && def.key === 'liquidity_usd') parts.push(`${globalDetailUsd(before)} → ${globalDetailUsd(after)} liquidity`)
  }
  if (!def || def.key !== 'liquidity_usd') {
    const liq = globalDetailFinite(row?.current?.liquidity_usd ?? row?.market_context?.liquidity_usd ?? row?.baseline?.liquidity_usd)
    if (liq != null) parts.push(`${globalDetailUsd(liq)} liquidity`)
  }
  return parts.join(' · ')
}

function globalCardTokenTools(row) {
  const token = String(row?.token || '').trim()
  if (!token) return ''
  const explorer = globalExplorerUrl(row?.chain, token)
  return `<button type="button" class="global-card-copy" data-copy-token="${escapeHtml(token)}" title="Copy contract address" aria-label="Copy contract address">Copy</button>`
    + (explorer ? `<a class="global-card-explorer" href="${escapeHtml(explorer)}" target="_blank" rel="noopener noreferrer" title="Open in explorer">Explorer ↗</a>` : '')
}

// API v0.17: an Event or Incident that closed because Elofid stopped monitoring it is shown as
// "Monitoring ended", never as resolved. The raw status stays 'resolved' for filtering and sorting.
function isMonitoringEnded(row) {
  return row?.monitoring_ended === true || row?.resolution_reason === 'monitoring_ended'
}

function lifecycleDisplayStatus(row) {
  const status = row?.status
  if (String(status || '').toLowerCase() === 'resolved' && isMonitoringEnded(row)) return 'monitoring_ended'
  return status
}

function globalStatusLabel(value) {
  const status = String(value || 'open').trim().toLowerCase()
  if (!status) return 'Open'
  if (status === 'monitoring_ended') return 'Monitoring ended'
  return status.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
}

function renderGlobalPreviewCard(row) {
  const kind = String(row?.kind || 'event')
  const severity = String(row?.severity || 'unknown').toLowerCase()
  const chain = chainDisplayName(row?.chain)
  const symbol = String(row?.symbol || '').trim() || shortToken(row?.token)
  const confidence = String(row?.confidence || 'unknown')
  const title = kind === 'incident' ? 'Risk Incident' : formatEventType(row?.type)
  const change = kind === 'event' ? formatPrimaryChange(row?.primary_change, row?.change) : `${row?.event_count ?? 0} related Events`
  const status = globalStatusLabel(lifecycleDisplayStatus(row))
  // Free preview: values stay a Starter+ detail, so no before → after line here.
  return `<article class="global-card global-card-preview">
    <div class="global-card-icon">${globalCardIcon(kind, row)}</div>
    <div class="global-card-identity">
      <div class="global-card-type">${escapeHtml(title)}</div>
      <div class="global-card-symbol">${escapeHtml(symbol)}</div>
      <div class="global-card-context"><span>${escapeHtml(chain)}</span><span class="global-card-contract">${escapeHtml(shortToken(row?.token))}</span></div>
      <div class="global-card-tools">${globalCardTokenTools(row)}</div>
    </div>
    <div class="global-card-signal">
      <span class="global-card-signal-label">Primary signal</span>
      <strong>${escapeHtml(change)}</strong>
      <div class="global-card-meta"><span>${escapeHtml(confidence)} confidence</span><span>${escapeHtml(status)}</span><span data-global-feed-time="${escapeHtml(String(row?.detected_at ?? ''))}" title="${escapeHtml(formatGlobalFeedTime(row?.detected_at))}">${escapeHtml(globalFeedRelativeTime(row?.detected_at))}</span></div>
    </div>
    <div class="global-card-side">
      <div class="event-badge severity-${escapeHtml(severity)}">${escapeHtml(severity)}</div>
      <button type="button" class="global-card-action global-unlock">Unlock intelligence →</button>
    </div>
  </article>`
}

function renderFullGlobalCard(kind, row, at) {
  const severity = String(row?.severity || 'unknown').toLowerCase()
  const chain = chainDisplayName(row?.chain)
  const symbol = String(row?.symbol || '').trim() || shortToken(row?.token)
  const title = kind === 'incident' ? `Risk Incident #${row?.id ?? '—'}` : formatEventType(row?.type)
  const change = kind === 'incident' ? `${row?.event_count ?? 0} Events · ${row?.family_count ?? 0} families` : formatPrimaryChange(row?.primary_change, row?.change)
  const status = globalStatusLabel(lifecycleDisplayStatus(row))
  const context = globalCardContext(kind, row)
  return `<article class="global-card global-card-clickable" data-kind="${escapeHtml(kind)}" data-id="${escapeHtml(row?.id ?? '')}" tabindex="0">
    <div class="global-card-icon">${globalCardIcon(kind, row)}</div>
    <div class="global-card-identity">
      <div class="global-card-type">${escapeHtml(title)}</div>
      <div class="global-card-symbol">${escapeHtml(symbol)}</div>
      <div class="global-card-context"><span>${escapeHtml(chain)}</span><span class="global-card-contract">${escapeHtml(shortToken(row?.token))}</span></div>
      <div class="global-card-tools">${globalCardTokenTools(row)}</div>
    </div>
    <div class="global-card-signal">
      <span class="global-card-signal-label">${kind === 'incident' ? 'Incident scope' : 'Primary signal'}</span>
      <strong>${escapeHtml(change)}</strong>
      ${context ? `<div class="global-card-values">${escapeHtml(context)}</div>` : ''}
      <div class="global-card-meta"><span>${escapeHtml(String(row?.confidence || 'unknown'))} confidence</span><span>${escapeHtml(status)}</span><span data-global-feed-time="${escapeHtml(String(at || ''))}" title="${escapeHtml(formatGlobalFeedTime(at))}">${escapeHtml(globalFeedRelativeTime(at))}</span></div>
    </div>
    <div class="global-card-side">
      <div class="event-badge severity-${escapeHtml(severity)}">${escapeHtml(severity)}</div>
      <button type="button" class="global-card-action global-detail-trigger" data-kind="${escapeHtml(kind)}" data-id="${escapeHtml(row?.id ?? '')}">View intelligence →</button>
    </div>
  </article>`
}

function renderOverviewGlobalPreview() {
  const host = document.getElementById('overview-global-preview')
  if (!host) return
  const rows = Array.isArray(globalPreviewItems)
    ? globalPreviewItems
        .slice()
        .sort((a, b) => Number(b?.detected_at ?? b?.updated_at ?? 0) - Number(a?.detected_at ?? a?.updated_at ?? 0))
        .slice(0, 3)
    : []
  if (!rows.length) {
    host.innerHTML = '<div class="empty"><div><strong>No global signals right now</strong><span>New Events and Risk Incidents appear here as soon as Elofid detects them.</span></div></div>'
    return
  }
  host.innerHTML = rows.map((row) => {
    const title = row?.kind === 'incident' ? globalDetailT('riskIncident') : globalDetailEventType(row?.type)
    const symbol = String(row?.symbol || '').trim() || shortToken(row?.token)
    const change = row?.kind === 'incident' ? `${row?.event_count ?? 0} ${globalDetailT('relatedEvents')}` : formatPrimaryChange(row?.primary_change, row?.change)
    const severityRaw = String(row?.severity || 'unknown').trim().toLowerCase() || 'unknown'
    const severityLabel = globalDetailEnum('severity', severityRaw)
    const detectedAt = row?.detected_at ?? row?.updated_at ?? null
    const detected = detectedAt == null ? globalDetailT('timeUnavailable') : formatGlobalFeedTime(detectedAt)
    return `<div class="overview-feed-item">
      <div class="overview-feed-top"><div class="overview-feed-type">${escapeHtml(title)} · ${escapeHtml(symbol)}</div><span class="event-badge severity-${escapeHtml(severityRaw)}">${escapeHtml(severityLabel)}</span></div>
      <div class="overview-feed-sub"><span>${escapeHtml(chainDisplayName(row?.chain))}</span><span>${escapeHtml(globalDetailT('detected'))} ${escapeHtml(detected)}</span></div>
      <div class="overview-feed-change">${escapeHtml(change)}</div>
    </div>`
  }).join('')
}

async function loadGlobalPreview(token) {
  const response = await fetch(`${CONTROL_PLANE}/v1/global/preview?limit=5`, { method:'GET', headers:{ Authorization:`Bearer ${token}`, Accept:'application/json' } })
  const body = await response.json().catch(() => null)
  qaLog('ELOFID GLOBAL PREVIEW QA', { status: response.status, mode: body?.access?.mode || null, items: Array.isArray(body?.data) ? body.data.length : null, plan: body?.plan?.code || null })
  if (!response.ok || !Array.isArray(body?.data)) {
    const message = body?.detail || body?.message || body?.error || `HTTP ${response.status}`
    throw new Error(`Unable to load Global Intelligence preview: ${message}`)
  }
  globalPreviewItems = body.data
  globalAccessMode = String(body?.access?.mode || body?.plan?.global_feed_access || 'preview')
  renderOverviewGlobalPreview()
  return body
}
function setGlobalFeedEntitlementLoadingState() {
  const badge = document.getElementById('global-access-badge')
  const scopeBadge = document.getElementById('global-access-scope')
  const accessCopy = document.getElementById('global-access-copy')
  const upgrade = document.getElementById('global-upgrade')
  const controls = document.getElementById('global-controls')
  const meta = document.getElementById('global-feed-meta')
  const list = document.getElementById('global-feed-list')
  const headlineCopy = document.getElementById('global-feed-copy')

  if (badge) badge.textContent = 'LOADING'
  if (scopeBadge) scopeBadge.textContent = 'SYNCING ACCESS'
  if (accessCopy) accessCopy.textContent = 'Checking your Elofid plan and Global Intelligence access…'
  if (upgrade) upgrade.hidden = true
  if (controls) controls.hidden = true
  if (meta) {
    delete meta.dataset.globalFeedMetaBase
    meta.textContent = 'Loading Global Intelligence…'
  }
  if (list) list.innerHTML = '<div class="events-empty">Loading Global Intelligence…</div>'
  if (headlineCopy) headlineCopy.textContent = 'Loading your Global Intelligence access and current network signals…'
}

function renderGlobalFeed() {
  const list = document.getElementById('global-feed-list')
  const meta = document.getElementById('global-feed-meta')
  const badge = document.getElementById('global-access-badge')
  const accessCopy = document.getElementById('global-access-copy')
  const upgrade = document.getElementById('global-upgrade')
  const controls = document.getElementById('global-controls')
  const headlineCopy = document.getElementById('global-feed-copy')
  if (!list || !meta) return

  const planCode = String(usageData?.plan_code || workspace?.plan_code || 'free').toLowerCase()
  const entitlementAccess = String(usageData?.entitlements?.global_feed_access || globalAccessMode || 'preview')
  const historyDays = Number(usageData?.entitlements?.history_days || 0)
  const full = entitlementAccess === 'full'
  globalAccessMode = full ? 'full' : 'preview'

  const scopeBadge = document.getElementById('global-access-scope')
  if (badge) badge.textContent = full ? planCode.toUpperCase() : 'FREE'
  if (scopeBadge) scopeBadge.textContent = full ? 'GLOBAL INTELLIGENCE' : 'PREVIEW'
  if (accessCopy) accessCopy.textContent = full
    ? `${historyDays || 'Plan'}-day history · Full Global Intelligence + Global Feed API`
    : 'Latest global signals · Full Global Intelligence available on Starter+'
  if (upgrade) upgrade.hidden = full
  if (controls) controls.hidden = !full
  if (headlineCopy) headlineCopy.textContent = full
    ? 'Explore Events and Risk Incidents detected by Elofid across the network. Access to details and history depends on your plan.'
    : 'Explore a live preview of Events and Risk Incidents detected by Elofid across the network. Full details, history, filters and API access depend on your plan.'

  if (!full) {
    const items = Array.isArray(globalPreviewItems) ? globalPreviewItems : []
    delete meta.dataset.globalFeedMetaBase
    meta.textContent = 'FREE PREVIEW · Real Elofid signals · Details remain locked'
    if (!items.length) {
      list.innerHTML = '<div class="events-empty"><strong>No global signals in the current preview window.</strong><br>New Events and Risk Incidents appear here as soon as Elofid detects them.</div>'
      return
    }
    list.innerHTML = items.map((row) => renderGlobalPreviewCard(row)).join('')
    return
  }

  let items = [
    ...globalFeedEvents.map((row) => ({ kind: 'event', at: Number(row?.detected_at || 0), row })),
    ...globalFeedIncidents.map((row) => ({ kind: 'incident', at: Number(row?.last_event_at || row?.detected_at || 0), row })),
  ].sort((a, b) => b.at - a.at)

  const search = String(document.getElementById('global-search')?.value || '').trim().toLowerCase()
  const kind = String(document.getElementById('global-kind')?.value || 'all')
  const chainFilter = String(document.getElementById('global-chain')?.value || 'all')
  const severityFilter = String(document.getElementById('global-severity')?.value || 'all')
  items = items.filter(({ kind: itemKind, row }) => {
    if (kind !== 'all' && itemKind !== kind) return false
    if (chainFilter !== 'all' && String(row?.chain || '') !== chainFilter) return false
    if (severityFilter !== 'all' && String(row?.severity || '').toLowerCase() !== severityFilter) return false
    if (search) {
      const hay = `${row?.symbol || ''} ${row?.token || ''} ${row?.type || ''}`.toLowerCase()
      if (!hay.includes(search)) return false
    }
    return true
  })

  const globalFeedMetaBase = `${items.length} result${items.length === 1 ? '' : 's'} · Newest first · ${historyDays || 'Plan'}-day history`
  meta.dataset.globalFeedMetaBase = globalFeedMetaBase
  meta.textContent = `${globalFeedMetaBase}${globalFeedLoadedAt ? ` · Updated ${globalFeedRelativeTime(Math.floor(globalFeedLoadedAt / 1000))}` : ''}`
  if (!items.length) {
    list.innerHTML = '<div class="events-empty"><strong>No matching Global Intelligence on this page.</strong><br>Adjust the filters or search terms.</div>'
    return
  }

  list.innerHTML = items.map((item) => renderFullGlobalCard(item.kind, item.row, item.at)).join('')
}

async function populateGlobalFilters() {
  const select = document.getElementById('global-chain')
  if (!select) return
  const selected = select.value || 'all'
  const chains = [...new Set([...globalFeedEvents, ...globalFeedIncidents].map(row => String(row?.chain || '')).filter(Boolean))]
  select.innerHTML = '<option value="all">All chains</option>' + chains.map(chain => `<option value="${escapeHtml(chain)}">${escapeHtml(chainDisplayName(chain))}</option>`).join('')
  if ([...select.options].some(o => o.value === selected)) select.value = selected
}

function waitForAuthoritativeState(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

async function refreshAuthoritativeDashboardState({
  targetPlan = null,
  targetBillingCycle = null,
  attempts = 1,
  reason = 'foreground',
} = {}) {
  if (!clerk.user) return false
  if (authoritativeStateRefreshPromise) return authoritativeStateRefreshPromise

  authoritativeStateRefreshPromise = (async () => {
    const token = await clerk.session?.getToken()
    if (!token) return false

    const expectedPlan = targetPlan ? String(targetPlan).toLowerCase() : null
    const expectedCycle = targetBillingCycle ? String(targetBillingCycle).toLowerCase() : null
    const totalAttempts = Math.max(1, Number(attempts) || 1)
    let matched = false

    for (let attempt = 0; attempt < totalAttempts; attempt += 1) {
      try {
        const bootstrapResponse = await fetch(`${CONTROL_PLANE}/v1/bootstrap`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
        const bootstrapBody = await bootstrapResponse.json().catch(() => null)
        if (bootstrapResponse.ok && bootstrapBody?.ok && bootstrapBody?.workspace) {
          workspace = bootstrapBody.workspace
          setWorkspaceState('connected', workspace)
        }

        await loadBillingSubscription(token)
        await loadUsage(token)
        renderBillingPlans()
        refreshOverviewUi()
        renderSettingsView()

        const currentPlan = String(billingSubscription?.current_plan_code || workspace?.plan_code || 'free').toLowerCase()
        const currentCycle = String(billingSubscription?.subscription?.billing_cycle || '').toLowerCase()
        const currentStatus = String(billingSubscription?.subscription?.status || '').toLowerCase()

        matched = !expectedPlan || (
          currentPlan === expectedPlan &&
          (!expectedCycle || currentCycle === expectedCycle) &&
          (!['starter', 'growth', 'pro'].includes(expectedPlan) || currentStatus === 'active')
        )

        if (matched) break
      } catch (error) {
        console.error(`Elofid authoritative state refresh failed (${reason})`, error)
      }

      if (attempt < totalAttempts - 1) {
        await waitForAuthoritativeState(Math.min(700 + (attempt * 450), 2500))
      }
    }

    if (matched) {
      await Promise.allSettled([
        loadWebhooks(token),
        loadGlobalPreview(token),
      ])
      renderBillingPlans()
      refreshOverviewUi()
      renderSettingsView()
    }

    qaLog('ELOFID AUTHORITATIVE STATE REFRESH QA', {
      reason,
      target_plan: expectedPlan,
      target_billing_cycle: expectedCycle,
      matched,
      current_plan: billingSubscription?.current_plan_code || workspace?.plan_code || null,
      current_billing_cycle: billingSubscription?.subscription?.billing_cycle || null,
      subscription_status: billingSubscription?.subscription?.status || null,
    })

    return matched
  })()

  try {
    return await authoritativeStateRefreshPromise
  } finally {
    authoritativeStateRefreshPromise = null
    authoritativeStateLastRefreshAt = Date.now()
  }
}

function refreshAuthoritativeStateOnForeground(reason) {
  if (!clerk.user) return
  foregroundRefreshReasons.add(String(reason || 'foreground'))

  if (foregroundRefreshTimer) window.clearTimeout(foregroundRefreshTimer)
  foregroundRefreshTimer = window.setTimeout(() => {
    foregroundRefreshTimer = null

    const reasons = [...foregroundRefreshReasons]
    foregroundRefreshReasons.clear()

    if (!clerk.user || document.visibilityState !== 'visible') return

    // Consume the hidden→visible transition once. A later bare window focus
    // (for example DevTools/browser chrome focus) must not start another batch.
    foregroundTransitionArmed = false

    // Initial bootstrap already fetches the same authoritative surfaces. Avoid
    // racing pageshow/focus/visibilitychange against it or immediately after it.
    if (!workspace || bootstrapPromise || authoritativeStateRefreshPromise) return

    const now = Date.now()
    if (now - authoritativeStateLastRefreshAt < FOREGROUND_REFRESH_COOLDOWN_MS) return

    void refreshAuthoritativeDashboardState({
      attempts: 3,
      reason: reasons.length ? `foreground:${reasons.join('+')}` : 'foreground',
    })
  }, FOREGROUND_REFRESH_DEBOUNCE_MS)
}

function paddleCheckoutEvent(event) {
  const name = String(event?.name || '')
  if (!name.startsWith('checkout.')) return

  const data = event?.data || {}
  if (name === 'checkout.completed') {
    const transactionId = data?.transaction_id || data?.transaction?.id || data?.id || null
    qaLog('ELOFID PADDLE CHECKOUT QA', {
      environment: 'sandbox',
      event: name,
      plan: activePaddleCheckout?.plan || null,
      billing_cycle: activePaddleCheckout?.billingCycle || null,
      price_id: activePaddleCheckout?.priceId || null,
      checkout_ref_prefix: activePaddleCheckout?.checkoutRefPrefix || null,
      transaction_id: transactionId,
      entitlement_mutation: false,
    })

    const targetPlan = activePaddleCheckout?.plan || null
    const targetBillingCycle = activePaddleCheckout?.billingCycle || null
    void refreshAuthoritativeDashboardState({
      targetPlan,
      targetBillingCycle,
      attempts: 10,
      reason: 'checkout.completed',
    }).finally(() => {
      activePaddleCheckout = null
    })
    return
  }

  if (name === 'checkout.warning' || name === 'checkout.error') {
    qaWarn('ELOFID PADDLE CHECKOUT EVENT', {
      environment: 'sandbox',
      event: name,
      plan: activePaddleCheckout?.plan || null,
      billing_cycle: activePaddleCheckout?.billingCycle || null,
      price_id: activePaddleCheckout?.priceId || null,
      data,
    })
  }
}

function ensurePaddleSandbox() {
  if (paddleInitialized) return window.Paddle
  if (!window.Paddle) throw new Error('Paddle.js failed to load. Refresh the page and try again.')
  if (!PADDLE_CLIENT_TOKEN) throw new Error('Missing VITE_PADDLE_CLIENT_TOKEN in the local environment.')
  if (!PADDLE_CLIENT_TOKEN.startsWith('test_')) throw new Error('Sandbox checkout requires a Paddle client-side token that starts with test_.')

  window.Paddle.Environment.set('sandbox')
  window.Paddle.Initialize({
    token: PADDLE_CLIENT_TOKEN,
    eventCallback: paddleCheckoutEvent,
  })
  paddleInitialized = true

  qaLog('ELOFID PADDLE CONFIG QA', {
    environment: 'sandbox',
    client_token_present: true,
    price_selection: 'server_authoritative',
    checkout_reference: 'required',
  })

  return window.Paddle
}

async function createBillingCheckoutReference(planCode, billingCycleValue) {
  const plan = String(planCode || '').trim().toLowerCase()
  const cycle = billingCycleValue === 'annual' ? 'annual' : 'monthly'

  if (!['starter', 'growth', 'pro'].includes(plan)) {
    throw new Error('Invalid Paddle Sandbox checkout selection.')
  }

  const sessionToken = await clerk.session?.getToken()
  if (!sessionToken) throw new Error('Authentication session is unavailable.')

  const response = await fetch(`${CONTROL_PLANE}/v1/billing/checkout-reference`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plan_code: plan,
      billing_cycle: cycle,
    }),
  })

  const body = await response.json().catch(() => null)
  const data = body?.data

  qaLog('ELOFID BILLING CHECKOUT REFERENCE CLIENT QA', {
    status: response.status,
    ok: response.ok,
    plan_code: data?.plan_code || plan,
    billing_cycle: data?.billing_cycle || cycle,
    price_id: data?.price_id || null,
    checkout_ref_prefix: typeof data?.checkout_ref === 'string' ? data.checkout_ref.slice(0, 12) : null,
    expires_at: data?.expires_at || null,
    tenant_id_exposed: Boolean(data?.tenant_id),
  })

  if (!response.ok) {
    const message = body?.detail || body?.message || body?.error || `HTTP ${response.status}`
    throw new Error(`Unable to prepare billing checkout: ${message}`)
  }

  const checkoutRef = String(data?.checkout_ref || '')
  const priceId = String(data?.price_id || '')
  const returnedPlan = String(data?.plan_code || '').toLowerCase()
  const returnedCycle = String(data?.billing_cycle || '').toLowerCase()
  const expiresAt = Number(data?.expires_at)
  const now = Math.floor(Date.now() / 1000)

  if (!/^cxchk_[a-f0-9]{48}$/.test(checkoutRef)) {
    throw new Error('Control Plane returned an invalid billing checkout reference.')
  }
  if (!/^pri_[A-Za-z0-9]+$/.test(priceId)) {
    throw new Error('Control Plane returned an invalid Paddle price.')
  }
  if (returnedPlan !== plan || returnedCycle !== cycle) {
    throw new Error('Control Plane billing selection did not match the requested plan.')
  }
  if (!Number.isFinite(expiresAt) || expiresAt <= now) {
    throw new Error('Control Plane returned an expired billing checkout reference.')
  }

  return {
    checkoutRef,
    priceId,
    plan: returnedPlan,
    billingCycle: returnedCycle,
    expiresAt,
  }
}

async function openPaddleCheckout(planCode, billingCycleValue, triggerButton = null) {
  const plan = String(planCode || '').toLowerCase()
  const cycle = billingCycleValue === 'annual' ? 'annual' : 'monthly'
  const currentPlan = String(workspace?.plan_code || 'free').toLowerCase()

  if (!['starter', 'growth', 'pro'].includes(plan)) {
    throw new Error('Invalid Paddle Sandbox checkout selection.')
  }

  // New-subscription checkout is intentionally limited to Free workspaces in this pass.
  // Paid-plan changes will use the verified subscription lifecycle / Customer Portal flow later.
  if (currentPlan !== 'free') {
    throw new Error('This Sandbox checkout pass only creates a new paid subscription from the Free plan.')
  }

  const originalText = triggerButton?.textContent || ''
  if (triggerButton) {
    triggerButton.disabled = true
    triggerButton.textContent = 'Securing checkout…'
  }

  try {
    // The browser never chooses tenant_id or an authoritative Paddle price. The Clerk-authenticated
    // Control Plane resolves the workspace, chooses the server-side price, and stores the one-time ref.
    const reference = await createBillingCheckoutReference(plan, cycle)
    const Paddle = ensurePaddleSandbox()
    const email = clerk.user?.primaryEmailAddress?.emailAddress || clerk.user?.emailAddresses?.[0]?.emailAddress || ''

    activePaddleCheckout = {
      plan: reference.plan,
      billingCycle: reference.billingCycle,
      priceId: reference.priceId,
      checkoutRefPrefix: reference.checkoutRef.slice(0, 12),
      expiresAt: reference.expiresAt,
    }

    qaLog('ELOFID PADDLE CHECKOUT OPEN QA', {
      environment: 'sandbox',
      plan: reference.plan,
      billing_cycle: reference.billingCycle,
      price_id: reference.priceId,
      checkout_ref_prefix: reference.checkoutRef.slice(0, 12),
      checkout_ref_expires_at: reference.expiresAt,
      quantity: 1,
      customer_prefilled: Boolean(email),
      price_selection: 'server_authoritative',
      tenant_id_exposed: false,
      entitlement_mutation: false,
    })

    if (triggerButton?.closest('#upgrade-backdrop')) closeUpgradeModal()

    const checkout = {
      settings: {
        displayMode: 'overlay',
        variant: 'one-page',
        theme: 'dark',
        locale: 'en',
      },
      items: [{ priceId: reference.priceId, quantity: 1 }],
      customData: {
        elofid_checkout_ref: reference.checkoutRef,
      },
    }
    if (email) checkout.customer = { email }

    Paddle.Checkout.open(checkout)
  } finally {
    if (triggerButton) {
      triggerButton.disabled = false
      triggerButton.textContent = originalText
    }
  }
}

let activeContactKind = 'sales'

function contactConfig(kind = 'sales') {
  const support = kind === 'support'
  return support
    ? {
        kind: 'support',
        email: 'support@elofid.com',
        subject: 'Elofid Support',
        eyebrow: globalDetailT('contactSupportEyebrow'),
        title: globalDetailT('contactSupportTitle'),
        description: globalDetailT('contactSupportDescription'),
      }
    : {
        kind: 'sales',
        email: 'sales@elofid.com',
        subject: 'Elofid Enterprise Inquiry',
        eyebrow: globalDetailT('contactSalesEyebrow'),
        title: globalDetailT('contactSalesTitle'),
        description: globalDetailT('contactSalesDescription'),
      }
}

function openContactModal(kind = 'sales') {
  const backdrop = document.getElementById('contact-backdrop')
  if (!backdrop) return
  activeContactKind = kind === 'support' ? 'support' : 'sales'
  const cfg = contactConfig(activeContactKind)
  const eyebrow = document.getElementById('contact-eyebrow')
  const title = document.getElementById('contact-title')
  const description = document.getElementById('contact-description')
  const emailLabel = document.getElementById('contact-email-label')
  const email = document.getElementById('contact-email')
  const copy = document.getElementById('contact-copy-email')
  const open = document.getElementById('contact-open-email')
  const status = document.getElementById('contact-status')
  if (eyebrow) eyebrow.textContent = cfg.eyebrow
  if (title) title.textContent = cfg.title
  if (description) description.textContent = cfg.description
  if (emailLabel) emailLabel.textContent = globalDetailT('contactEmailLabel')
  if (email) email.textContent = cfg.email
  if (copy) copy.textContent = globalDetailT('contactCopyEmail')
  if (open) open.textContent = globalDetailT('contactOpenEmail')
  if (status) status.textContent = ''
  backdrop.dataset.open = 'true'
}

function closeContactModal() {
  const backdrop = document.getElementById('contact-backdrop')
  if (backdrop) backdrop.dataset.open = 'false'
}

async function copyContactEmail() {
  const cfg = contactConfig(activeContactKind)
  const status = document.getElementById('contact-status')
  try {
    await navigator.clipboard.writeText(cfg.email)
    if (status) status.textContent = globalDetailT('contactCopied')
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = cfg.email
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try { document.execCommand('copy') } catch {}
    textarea.remove()
    if (status) status.textContent = globalDetailT('contactCopied')
  }
}

function openContactEmailApp() {
  const cfg = contactConfig(activeContactKind)
  window.location.href = `mailto:${cfg.email}?subject=${encodeURIComponent(cfg.subject)}`
}

function openUpgradeModal() {
  const backdrop = document.getElementById('upgrade-backdrop')
  if (!backdrop) return
  // Keep the upgrade decision independent from whatever the user last viewed on Billing.
  // The modal always opens on the simplest monthly comparison and can be toggled locally.
  upgradeBillingCycle = 'monthly'
  document.querySelectorAll('[data-upgrade-billing-cycle]').forEach((button) => {
    button.classList.toggle('active', button.dataset.upgradeBillingCycle === upgradeBillingCycle)
  })
  renderUpgradePlans()
  backdrop.dataset.open = 'true'
}

function closeUpgradeModal() { const el=document.getElementById('upgrade-backdrop'); if(el) el.dataset.open='false' }

function money(value) { return new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 }).format(value) }

function renderBillingPlans(targetId = 'billing-plans', compact = false) {
  const host = document.getElementById(targetId)
  if (!host) return
  const current = String(workspace?.plan_code || 'free').toLowerCase()
  const hasPaidSubscription = Boolean(billingSubscription?.has_subscription) && ['starter','growth','pro'].includes(current)
  const plans = ['free','starter','growth','pro','enterprise']
  host.innerHTML = plans.map(code => {
    const p = PLAN_PRESENTATION[code]
    const annual = billingCycle === 'annual'
    const price = code === 'enterprise' ? 'Custom' : code === 'free' ? '$0' : annual ? `${money(p.annual)}<small>/ year</small>` : `${money(p.monthly)}<small>/ month</small>`
    const features = [
      `${p.assets} Monitored Assets`, `${p.api} API Calls / Month`, `${p.history} History`, `${p.webhooks} Webhook Destinations`,
      code === 'free' ? 'Global Intelligence Preview' : 'Full Global Intelligence',
      code === 'free' ? 'No Global Feed API' : 'Global Feed API', code === 'enterprise' ? 'Custom Monitoring Policy + SLA' : `${p.priority} Monitoring Priority`
    ]
    const currentPlan = current === code
    const paidPlan = ['starter','growth','pro'].includes(code)
    const checkoutAvailable = current === 'free' && paidPlan
    const currentPaidManageable = currentPlan && hasPaidSubscription && paidPlan
    const otherPaidManageable = !currentPlan && hasPaidSubscription && paidPlan
    const cta = code === 'enterprise'
      ? 'Contact Sales'
      : currentPaidManageable
        ? globalDetailT('manageSubscription')
        : checkoutAvailable
          ? `Choose ${p.name}`
          : otherPaidManageable
            ? globalDetailT('changePlan')
            : currentPlan
              ? 'Current plan'
              : code === 'free'
                ? 'Free plan'
                : globalDetailT('manageSubscription')
    const actionAttrs = code === 'enterprise'
      ? ' data-sales-contact="true"'
      : checkoutAvailable
        ? ` data-paddle-checkout-plan="${code}" data-paddle-checkout-cycle="${annual ? 'annual' : 'monthly'}"`
        : (currentPaidManageable || otherPaidManageable)
          ? ' data-paddle-portal="true"'
          : ' disabled'
    return `<article class="billing-card ${currentPlan ? 'current-plan' : ''}"><div class="billing-name">${p.name.toUpperCase()}</div><div class="billing-price">${price}</div><div class="billing-position">${escapeHtml(p.position)}</div><ul class="billing-features">${features.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul><button type="button" class="billing-cta"${actionAttrs}>${escapeHtml(cta)}</button></article>`
  }).join('')
  if (compact) host.style.gridTemplateColumns = 'repeat(3,minmax(0,1fr))'
  renderPlanIdentity()
}

function renderUpgradePlans() {
  const host = document.getElementById('upgrade-plans')
  if (!host) return
  const annual = upgradeBillingCycle === 'annual'
  const paidPlans = ['starter','growth','pro']
  host.innerHTML = paidPlans.map((code) => {
    const p = PLAN_PRESENTATION[code]
    const price = annual
      ? `${money(p.annual)}<small>/ year</small>`
      : `${money(p.monthly)}<small>/ month</small>`
    const keyFeatures = [
      `${p.assets} Monitored Assets`,
      `${p.api} API Calls / Month`,
      `${p.history} History`,
      `${p.webhooks} Webhook Destinations`,
      'Full Global Intelligence',
      'Global Feed API',
      `${p.priority} Monitoring Priority`,
    ]
    return `<article class="upgrade-plan-card ${code === 'starter' ? 'featured' : ''}">
      <div class="upgrade-plan-top">
        <div><div class="billing-name">${p.name.toUpperCase()}</div><div class="billing-position">${escapeHtml(p.position)}</div></div>
        ${code === 'starter' ? '<span class="upgrade-recommended">START HERE</span>' : ''}
      </div>
      <div class="billing-price upgrade-price">${price}</div>
      <ul class="upgrade-features">${keyFeatures.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>
      <button type="button" class="billing-cta upgrade-cta" data-paddle-checkout-plan="${code}" data-paddle-checkout-cycle="${annual ? 'annual' : 'monthly'}">Choose ${escapeHtml(p.name)}</button>
    </article>`
  }).join('')

  const enterprise = document.getElementById('upgrade-enterprise')
  if (enterprise) enterprise.innerHTML = `<div><strong>Enterprise</strong><span>Custom capacity, retention, monitoring requirements and SLA/support options.</span></div><button type="button" data-sales-contact="true">Contact Sales</button>`
}

const GLOBAL_DETAIL_I18N = Object.freeze({
  en: Object.freeze({
    fullGlobalIntelligence:'Full Global Intelligence', intelligenceDetail:'Intelligence detail', close:'Close',
    loadingFullIntelligence:'Loading full intelligence…', authenticationUnavailable:'Authentication session is unavailable.', unableToLoad:'Unable to load full intelligence.',
    unknown:'unknown', confidenceSuffix:'{value} confidence',
    primarySignal:'Primary signal', currentLower:'current', baseline:'Baseline', securityStateSignal:'Security state signal', detectedSignal:'Detected signal', evidenceBackedStateChange:'Evidence-backed state change',
    signalContext:'Signal context', signalContextHelp:'Baseline → current values from the Event record. Direction is derived from the recorded values; missing data remains unavailable.',
    metric:'Metric', current:'Current', observedChange:'Observed change', price:'Price', liquidity:'Liquidity', exitDepth10:'Exit Depth · 10%', elofidScore:'Elofid Score',
    noAdditionalNumericContext:'No additional numeric context is available for this Event.', noRecordedDrop:'No recorded drop', noChange:'No change', upFromZero:'↑ from zero', downFromZero:'↓ from zero', points:'pts',
    mintAuthorityEnabled:'Mint authority enabled', mintAuthorityChanged:'Mint authority changed', freezeAuthorityEnabled:'Freeze authority enabled', pauseActivated:'Pause activated', honeypotDetected:'Honeypot state detected', securityStateChange:'Security state change',
    enabledTrue:'Enabled / true', disabledFalse:'Disabled / false',
    benchmark:'Benchmark', benchmarkMove:'Benchmark move', relativeUnderperformance:'Underperformance', relativeUnderperformanceFull:'Relative underperformance vs benchmark', providerContinuity:'Provider continuity', marketContextQuality:'Market context quality',
    yes:'Yes', no:'No', complete:'complete', partial:'partial', provisional:'provisional',
    overviewCurrentPlan:'Plan usage', overviewMonitoredAssets:'Monitored assets', overviewApiCalls:'API calls', overviewViewBilling:'View billing', overviewMonthlyBilling:'Monthly billing', overviewAnnualBilling:'Annual billing', overviewNoPaidSubscription:'No paid subscription', overviewNextBilling:'Next billing', overviewAccessThrough:'Access through', overviewPeriodEnds:'Period ends', overviewNoRecurringCharge:'No recurring charge', overviewBillingUnavailable:'Billing date unavailable', overviewStatusActive:'ACTIVE', overviewStatusFree:'FREE', overviewStatusPastDue:'PAST DUE', overviewStatusPaused:'PAUSED', overviewStatusCanceled:'CANCELED', overviewStatusTrial:'TRIAL', overviewWorkspaceSummaryUnavailable:'Workspace-wide summary not available yet', overviewActivityEmptyTitle:'No workspace-wide activity summary yet', overviewActivityEmptyBody:'Workspace-wide activity will appear here when meaningful Events or Incidents are detected. Asset-level intelligence remains available in the dedicated views.', overviewViewEvents:'View Events', overviewManageMonitoring:'Manage Monitoring', overviewWebhookActiveShort:'Active', overviewWebhookActiveShortPlural:'Active', overviewWebhookWaitingFirst:'Endpoint waiting for first production delivery', overviewWebhookWaitingFirstPlural:'{count} endpoints waiting for a first production delivery', relatedEvents:'related Events', timeUnavailable:'Time unavailable', manageSubscription:'Manage subscription', changePlan:'Change plan', billingPortalOpening:'Opening subscription management…', billingPortalUnavailable:'Subscription management is not available for this workspace.', billingPortalOwnerRequired:'Only the workspace owner can manage billing.', billingPortalUnsupportedStatus:'This subscription status cannot be managed right now.', billingPortalFailed:'Unable to open subscription management. Please try again.', billingPortalInvalidUrl:'Elofid rejected an unexpected billing portal URL.', contactSalesEyebrow:'Enterprise', contactSalesTitle:'Contact Elofid Sales', contactSalesDescription:'Tell us about your infrastructure, capacity or SLA requirements. You can copy the sales address or open your email app.', contactSupportEyebrow:'Support', contactSupportTitle:'Contact Elofid Support', contactSupportDescription:'Need help with your workspace, API, webhooks or billing? You can copy the support address or open your email app.', contactEmailLabel:'Email', contactCopyEmail:'Copy email', contactOpenEmail:'Open email app', contactCopied:'Email copied.',
    correlatedIncident:'Correlated incident', status:'Status', severity:'Severity', detected:'Detected', lastObserved:'Last observed', eventSequence:'Event sequence',
    marketContext:'Market context', marketContextHelp:'Context recorded by the event engine; it does not replace the primary signal.',
    developerData:'Developer data', developerDataDescription:'Evidence, context and the exact {kind} API response', viewData:'View data', exactAuthenticatedApiPayload:'Exact authenticated API payload', noFieldsRemoved:'No fields are removed from the response shown here.', copyJson:'Copy JSON', copied:'Copied', copyFailed:'Copy failed', evidence:'Evidence', fullApiObject:'Full API object',
    riskIncident:'Risk incident', events:'Events', signalFamilies:'signal families', updated:'Updated', confidence:'Confidence', correlation:'Correlation', reasonCodes:'Reason codes', reasonCodesHelp:'Machine-readable reasons attached to this incident.', supportingEvents:'Supporting Events', supportingEventsHelp:'Canonical Event IDs supporting this incident.',
    kindEvent:'Event', kindIncident:'Incident',
    monitoringScore:'Score', monitoringLiquidity:'Liquidity', monitoringExitDepth:'Exit Depth', monitoringLastScan:'Last Scan', monitoringWaitingFirstScan:'Waiting for first archived scan', monitoringLastObservationNoData:'The last observation returned no market data', monitoringSnapshotUnavailable:'Current snapshot unavailable', monitoringLoadingSnapshot:'Loading current snapshot…', monitoringScanTimeUnavailable:'Scan time unavailable', monitoringJustNow:'Just now', monitoringMinutesAgo:'{value}m ago', monitoringHoursAgo:'{value}h ago', monitoringDaysAgo:'{value}d ago', monitoringPreviousScan:'Compared with previous archived scan',
    event_price_collapse:'Price Collapse', event_liquidity_collapse:'Liquidity Collapse', event_exit_depth_collapse:'Exit Depth Collapse', event_score_deterioration:'Elofid Score Deterioration', event_mint_authority_risk:'Mint Authority Risk', event_freeze_authority_risk:'Freeze Authority Risk', event_pause_risk:'Pause Risk', event_honeypot_risk:'Honeypot Risk', event_sell_blocked:'Sell Blocked', event_buy_blocked:'Buy Blocked', event_tax_spike:'Tax Spike', event_tax_changed:'Tax Changed', event_tax_reduced:'Tax Reduced',
    status_open:'open', status_resolved:'resolved', status_monitoring_ended:'monitoring ended', severity_info:'info', severity_low:'low', severity_medium:'medium', severity_high:'high', severity_critical:'critical', severity_catastrophic:'catastrophic', confidence_high:'high', confidence_medium:'medium', confidence_low:'low', confidence_unknown:'unknown'
  }),
  zh: Object.freeze({
    fullGlobalIntelligence:'完整全局情报', intelligenceDetail:'情报详情', close:'关闭',
    loadingFullIntelligence:'正在加载完整情报…', authenticationUnavailable:'身份验证会话不可用。', unableToLoad:'无法加载完整情报。',
    unknown:'未知', confidenceSuffix:'{value} 置信度',
    primarySignal:'主要信号', currentLower:'当前', baseline:'基线', securityStateSignal:'安全状态信号', detectedSignal:'检测到的信号', evidenceBackedStateChange:'有证据支持的状态变化',
    signalContext:'信号上下文', signalContextHelp:'显示 Event 记录中的基线 → 当前值。方向根据已记录的值计算；缺失数据仍显示为不可用。',
    metric:'指标', current:'当前', observedChange:'观察到的变化', price:'价格', liquidity:'流动性', exitDepth10:'退出深度 · 10%', elofidScore:'Elofid 评分',
    noAdditionalNumericContext:'此 Event 没有其他可用的数值上下文。', noRecordedDrop:'未记录下降', noChange:'无变化', upFromZero:'↑ 从零上升', downFromZero:'↓ 从零下降', points:'点',
    mintAuthorityEnabled:'铸币权限已启用', mintAuthorityChanged:'铸币权限已变更', freezeAuthorityEnabled:'冻结权限已启用', pauseActivated:'暂停功能已激活', honeypotDetected:'检测到蜜罐状态', securityStateChange:'安全状态变化',
    enabledTrue:'已启用 / true', disabledFalse:'已禁用 / false',
    benchmark:'基准', benchmarkMove:'基准变动', relativeUnderperformance:'落后幅度', relativeUnderperformanceFull:'相对基准的落后幅度', providerContinuity:'数据源连续性', marketContextQuality:'市场上下文质量',
    yes:'是', no:'否', complete:'完整', partial:'部分', provisional:'暂定',
    overviewCurrentPlan:'套餐用量', overviewMonitoredAssets:'监控资产', overviewApiCalls:'API 调用', overviewViewBilling:'查看账单', overviewMonthlyBilling:'按月计费', overviewAnnualBilling:'按年计费', overviewNoPaidSubscription:'无付费订阅', overviewNextBilling:'下次计费', overviewAccessThrough:'访问权限至', overviewPeriodEnds:'当前周期结束', overviewNoRecurringCharge:'无周期性费用', overviewBillingUnavailable:'账单日期不可用', overviewStatusActive:'有效', overviewStatusFree:'免费', overviewStatusPastDue:'逾期', overviewStatusPaused:'已暂停', overviewStatusCanceled:'已取消', overviewStatusTrial:'试用', overviewWorkspaceSummaryUnavailable:'工作区级汇总暂不可用', overviewActivityEmptyTitle:'暂无工作区级活动汇总', overviewActivityEmptyBody:'当检测到有意义的 Events 或 Incidents 时，工作区级活动会显示在这里。资产级情报仍可在对应的专用视图中查看。', overviewViewEvents:'查看 Events', overviewManageMonitoring:'管理监控', overviewWebhookActiveShort:'有效', overviewWebhookActiveShortPlural:'有效', overviewWebhookWaitingFirst:'端点正在等待首次生产投递', overviewWebhookWaitingFirstPlural:'{count} 个端点正在等待首次生产投递', relatedEvents:'个相关 Events', timeUnavailable:'时间不可用', manageSubscription:'管理订阅', changePlan:'更改套餐', billingPortalOpening:'正在打开订阅管理…', billingPortalUnavailable:'此工作区当前无法使用订阅管理。', billingPortalOwnerRequired:'只有工作区所有者可以管理账单。', billingPortalUnsupportedStatus:'当前订阅状态暂时无法管理。', billingPortalFailed:'无法打开订阅管理，请重试。', billingPortalInvalidUrl:'Elofid 已拒绝意外的账单门户地址。', contactSalesEyebrow:'企业版', contactSalesTitle:'联系 Elofid 销售团队', contactSalesDescription:'告诉我们您的基础设施、容量或 SLA 需求。您可以复制销售邮箱，或打开邮件应用。', contactSupportEyebrow:'支持', contactSupportTitle:'联系 Elofid 支持团队', contactSupportDescription:'需要工作区、API、Webhook 或账单方面的帮助？您可以复制支持邮箱，或打开邮件应用。', contactEmailLabel:'邮箱', contactCopyEmail:'复制邮箱', contactOpenEmail:'打开邮件应用', contactCopied:'邮箱已复制。',
    correlatedIncident:'关联 Risk Incident', status:'状态', severity:'严重级别', detected:'检测时间', lastObserved:'最后观察', eventSequence:'Event 序列',
    marketContext:'市场上下文', marketContextHelp:'由事件引擎记录的上下文；它不会替代主要信号。',
    developerData:'开发者数据', developerDataDescription:'证据、上下文以及完整的 {kind} API 响应', viewData:'查看数据', exactAuthenticatedApiPayload:'经过身份验证的精确 API payload', noFieldsRemoved:'此处显示的响应没有删除任何字段。', copyJson:'复制 JSON', copied:'已复制', copyFailed:'复制失败', evidence:'证据', fullApiObject:'完整 API 对象',
    riskIncident:'Risk Incident', events:'Events', signalFamilies:'信号族', updated:'更新时间', confidence:'置信度', correlation:'关联规则', reasonCodes:'原因代码', reasonCodesHelp:'附加到此 Incident 的机器可读原因。', supportingEvents:'支持的 Events', supportingEventsHelp:'支持此 Incident 的规范 Event ID。',
    kindEvent:'Event', kindIncident:'Incident',
    monitoringScore:'评分', monitoringLiquidity:'流动性', monitoringExitDepth:'退出深度', monitoringLastScan:'最近扫描', monitoringWaitingFirstScan:'等待首次归档扫描', monitoringLastObservationNoData:'最近一次观测未返回市场数据', monitoringSnapshotUnavailable:'当前快照不可用', monitoringLoadingSnapshot:'正在加载当前快照…', monitoringScanTimeUnavailable:'扫描时间不可用', monitoringJustNow:'刚刚', monitoringMinutesAgo:'{value} 分钟前', monitoringHoursAgo:'{value} 小时前', monitoringDaysAgo:'{value} 天前', monitoringPreviousScan:'与上一次归档扫描相比',
    event_price_collapse:'价格暴跌', event_liquidity_collapse:'流动性暴跌', event_exit_depth_collapse:'退出深度暴跌', event_score_deterioration:'Elofid 评分恶化', event_mint_authority_risk:'铸币权限风险', event_freeze_authority_risk:'冻结权限风险', event_pause_risk:'暂停风险', event_honeypot_risk:'蜜罐风险', event_sell_blocked:'卖出受阻', event_buy_blocked:'买入受阻', event_tax_spike:'税率激增', event_tax_changed:'税率变化', event_tax_reduced:'税率降低',
    status_open:'进行中', status_resolved:'已解决', status_monitoring_ended:'监控已结束', severity_info:'信息', severity_low:'低', severity_medium:'中', severity_high:'高', severity_critical:'严重', severity_catastrophic:'灾难级', confidence_high:'高', confidence_medium:'中', confidence_low:'低', confidence_unknown:'未知'
  }),
  ar: Object.freeze({
    fullGlobalIntelligence:'الاستخبارات العالمية الكاملة', intelligenceDetail:'تفاصيل الاستخبارات', close:'إغلاق',
    loadingFullIntelligence:'جارٍ تحميل الاستخبارات الكاملة…', authenticationUnavailable:'جلسة المصادقة غير متاحة.', unableToLoad:'تعذر تحميل الاستخبارات الكاملة.',
    unknown:'غير معروف', confidenceSuffix:'ثقة {value}',
    primarySignal:'الإشارة الرئيسية', currentLower:'الحالي', baseline:'خط الأساس', securityStateSignal:'إشارة حالة الأمان', detectedSignal:'الإشارة المكتشفة', evidenceBackedStateChange:'تغيّر حالة مدعوم بالأدلة',
    signalContext:'سياق الإشارة', signalContextHelp:'قيم خط الأساس ← الحالية من سجل Event. يتم اشتقاق الاتجاه من القيم المسجلة؛ وتبقى البيانات المفقودة غير متاحة.',
    metric:'المقياس', current:'الحالي', observedChange:'التغيّر المرصود', price:'السعر', liquidity:'السيولة', exitDepth10:'عمق الخروج · 10%', elofidScore:'درجة Elofid',
    noAdditionalNumericContext:'لا يتوفر سياق رقمي إضافي لهذا Event.', noRecordedDrop:'لم يُسجّل انخفاض', noChange:'لا تغيير', upFromZero:'↑ ارتفاع من الصفر', downFromZero:'↓ انخفاض من الصفر', points:'نقطة',
    mintAuthorityEnabled:'تم تفعيل صلاحية السك', mintAuthorityChanged:'تم تغيير صلاحية السك', freezeAuthorityEnabled:'تم تفعيل صلاحية التجميد', pauseActivated:'تم تفعيل الإيقاف المؤقت', honeypotDetected:'تم اكتشاف حالة Honeypot', securityStateChange:'تغيّر في حالة الأمان',
    enabledTrue:'مفعّل / true', disabledFalse:'معطّل / false',
    benchmark:'المعيار المرجعي', benchmarkMove:'حركة المعيار', relativeUnderperformance:'فارق الأداء', relativeUnderperformanceFull:'فارق الأداء السلبي مقارنة بالمعيار المرجعي', providerContinuity:'استمرارية مزود البيانات', marketContextQuality:'جودة سياق السوق',
    yes:'نعم', no:'لا', complete:'مكتمل', partial:'جزئي', provisional:'مؤقت',
    overviewCurrentPlan:'استخدام الخطة', overviewMonitoredAssets:'الأصول المراقبة', overviewApiCalls:'استدعاءات API', overviewViewBilling:'عرض الفوترة', overviewMonthlyBilling:'فوترة شهرية', overviewAnnualBilling:'فوترة سنوية', overviewNoPaidSubscription:'لا يوجد اشتراك مدفوع', overviewNextBilling:'الفوترة التالية', overviewAccessThrough:'الوصول حتى', overviewPeriodEnds:'تنتهي الفترة', overviewNoRecurringCharge:'لا توجد رسوم متكررة', overviewBillingUnavailable:'تاريخ الفوترة غير متاح', overviewStatusActive:'نشط', overviewStatusFree:'مجاني', overviewStatusPastDue:'متأخر', overviewStatusPaused:'متوقف مؤقتًا', overviewStatusCanceled:'ملغى', overviewStatusTrial:'تجريبي', overviewWorkspaceSummaryUnavailable:'ملخص مساحة العمل غير متاح بعد', overviewActivityEmptyTitle:'لا يوجد ملخص نشاط على مستوى مساحة العمل بعد', overviewActivityEmptyBody:'سيظهر نشاط مساحة العمل هنا عند اكتشاف Events أو Incidents مهمة. وتظل معلومات الأصول التفصيلية متاحة في العروض المخصصة لها.', overviewViewEvents:'عرض Events', overviewManageMonitoring:'إدارة المراقبة', overviewWebhookActiveShort:'نشط', overviewWebhookActiveShortPlural:'نشطة', overviewWebhookWaitingFirst:'نقطة النهاية بانتظار أول تسليم إنتاجي', overviewWebhookWaitingFirstPlural:'{count} نقاط نهاية بانتظار أول تسليم إنتاجي', relatedEvents:'Events مرتبطة', timeUnavailable:'الوقت غير متاح', manageSubscription:'إدارة الاشتراك', changePlan:'تغيير الخطة', billingPortalOpening:'جارٍ فتح إدارة الاشتراك…', billingPortalUnavailable:'إدارة الاشتراك غير متاحة لمساحة العمل هذه حاليًا.', billingPortalOwnerRequired:'يمكن لمالك مساحة العمل فقط إدارة الفوترة.', billingPortalUnsupportedStatus:'لا يمكن إدارة حالة الاشتراك الحالية الآن.', billingPortalFailed:'تعذر فتح إدارة الاشتراك. حاول مرة أخرى.', billingPortalInvalidUrl:'رفض Elofid رابط بوابة فوترة غير متوقع.', contactSalesEyebrow:'المؤسسات', contactSalesTitle:'تواصل مع مبيعات Elofid', contactSalesDescription:'أخبرنا بمتطلبات البنية التحتية أو السعة أو اتفاقية مستوى الخدمة. يمكنك نسخ بريد المبيعات أو فتح تطبيق البريد.', contactSupportEyebrow:'الدعم', contactSupportTitle:'تواصل مع دعم Elofid', contactSupportDescription:'هل تحتاج إلى مساعدة في مساحة العمل أو API أو Webhooks أو الفوترة؟ يمكنك نسخ بريد الدعم أو فتح تطبيق البريد.', contactEmailLabel:'البريد الإلكتروني', contactCopyEmail:'نسخ البريد', contactOpenEmail:'فتح تطبيق البريد', contactCopied:'تم نسخ البريد.',
    correlatedIncident:'Risk Incident مترابط', status:'الحالة', severity:'الخطورة', detected:'وقت الاكتشاف', lastObserved:'آخر رصد', eventSequence:'تسلسل Event',
    marketContext:'سياق السوق', marketContextHelp:'سياق سجله محرك الأحداث؛ ولا يحل محل الإشارة الرئيسية.',
    developerData:'بيانات المطور', developerDataDescription:'الأدلة والسياق واستجابة API الدقيقة لـ {kind}', viewData:'عرض البيانات', exactAuthenticatedApiPayload:'بيانات API الدقيقة والمصادق عليها', noFieldsRemoved:'لم تتم إزالة أي حقول من الاستجابة المعروضة هنا.', copyJson:'نسخ JSON', copied:'تم النسخ', copyFailed:'فشل النسخ', evidence:'الأدلة', fullApiObject:'كائن API الكامل',
    riskIncident:'Risk Incident', events:'Events', signalFamilies:'عائلات الإشارات', updated:'آخر تحديث', confidence:'الثقة', correlation:'الترابط', reasonCodes:'رموز الأسباب', reasonCodesHelp:'أسباب قابلة للقراءة آليًا مرتبطة بهذا Incident.', supportingEvents:'Events الداعمة', supportingEventsHelp:'معرّفات Event القياسية التي تدعم هذا Incident.',
    kindEvent:'Event', kindIncident:'Incident',
    monitoringScore:'الدرجة', monitoringLiquidity:'السيولة', monitoringExitDepth:'عمق الخروج', monitoringLastScan:'آخر فحص', monitoringWaitingFirstScan:'بانتظار أول فحص مؤرشف', monitoringLastObservationNoData:'لم تُرجع آخر عملية رصد أي بيانات سوق', monitoringSnapshotUnavailable:'اللقطة الحالية غير متاحة', monitoringLoadingSnapshot:'جارٍ تحميل اللقطة الحالية…', monitoringScanTimeUnavailable:'وقت الفحص غير متاح', monitoringJustNow:'الآن', monitoringMinutesAgo:'قبل {value} د', monitoringHoursAgo:'قبل {value} س', monitoringDaysAgo:'قبل {value} ي', monitoringPreviousScan:'مقارنة بآخر فحص مؤرشف',
    event_price_collapse:'انهيار السعر', event_liquidity_collapse:'انهيار السيولة', event_exit_depth_collapse:'انهيار عمق الخروج', event_score_deterioration:'تدهور درجة Elofid', event_mint_authority_risk:'مخاطر صلاحية السك', event_freeze_authority_risk:'مخاطر صلاحية التجميد', event_pause_risk:'مخاطر الإيقاف المؤقت', event_honeypot_risk:'مخاطر Honeypot', event_sell_blocked:'حظر البيع', event_buy_blocked:'حظر الشراء', event_tax_spike:'ارتفاع حاد في الضريبة', event_tax_changed:'تغيّر الضريبة', event_tax_reduced:'انخفاض الضريبة',
    status_open:'مفتوح', status_resolved:'تم الحل', status_monitoring_ended:'انتهت المراقبة', severity_info:'معلومات', severity_low:'منخفضة', severity_medium:'متوسطة', severity_high:'مرتفعة', severity_critical:'حرجة', severity_catastrophic:'كارثية', confidence_high:'عالية', confidence_medium:'متوسطة', confidence_low:'منخفضة', confidence_unknown:'غير معروفة'
  }),
  ru: Object.freeze({
    fullGlobalIntelligence:'Полная глобальная аналитика', intelligenceDetail:'Детали аналитики', close:'Закрыть',
    loadingFullIntelligence:'Загрузка полной аналитики…', authenticationUnavailable:'Сеанс аутентификации недоступен.', unableToLoad:'Не удалось загрузить полную аналитику.',
    unknown:'неизвестно', confidenceSuffix:'достоверность: {value}',
    primarySignal:'Основной сигнал', currentLower:'текущее', baseline:'Базовое значение', securityStateSignal:'Сигнал состояния безопасности', detectedSignal:'Обнаруженный сигнал', evidenceBackedStateChange:'Изменение состояния, подтверждённое данными',
    signalContext:'Контекст сигнала', signalContextHelp:'Базовые → текущие значения из записи Event. Направление рассчитывается по сохранённым значениям; отсутствующие данные остаются недоступными.',
    metric:'Метрика', current:'Текущее', observedChange:'Наблюдаемое изменение', price:'Цена', liquidity:'Ликвидность', exitDepth10:'Глубина выхода · 10%', elofidScore:'Оценка Elofid',
    noAdditionalNumericContext:'Для этого Event нет дополнительного числового контекста.', noRecordedDrop:'Снижение не зафиксировано', noChange:'Без изменений', upFromZero:'↑ рост с нуля', downFromZero:'↓ снижение с нуля', points:'п.',
    mintAuthorityEnabled:'Включены полномочия mint', mintAuthorityChanged:'Полномочия mint изменены', freezeAuthorityEnabled:'Включены полномочия freeze', pauseActivated:'Активирована пауза', honeypotDetected:'Обнаружено состояние Honeypot', securityStateChange:'Изменение состояния безопасности',
    enabledTrue:'Включено / true', disabledFalse:'Выключено / false',
    benchmark:'Бенчмарк', benchmarkMove:'Изменение бенчмарка', relativeUnderperformance:'Отставание', relativeUnderperformanceFull:'Отставание относительно бенчмарка', providerContinuity:'Непрерывность провайдера', marketContextQuality:'Качество рыночного контекста',
    yes:'Да', no:'Нет', complete:'полное', partial:'частичное', provisional:'предварительное',
    overviewCurrentPlan:'Использование плана', overviewMonitoredAssets:'Отслеживаемые активы', overviewApiCalls:'Вызовы API', overviewViewBilling:'Открыть биллинг', overviewMonthlyBilling:'Ежемесячная оплата', overviewAnnualBilling:'Годовая оплата', overviewNoPaidSubscription:'Нет платной подписки', overviewNextBilling:'Следующее списание', overviewAccessThrough:'Доступ до', overviewPeriodEnds:'Период заканчивается', overviewNoRecurringCharge:'Нет регулярных списаний', overviewBillingUnavailable:'Дата списания недоступна', overviewStatusActive:'АКТИВЕН', overviewStatusFree:'БЕСПЛАТНЫЙ', overviewStatusPastDue:'ПРОСРОЧЕН', overviewStatusPaused:'ПРИОСТАНОВЛЕН', overviewStatusCanceled:'ОТМЕНЕН', overviewStatusTrial:'ПРОБНЫЙ', overviewWorkspaceSummaryUnavailable:'Сводка по рабочему пространству пока недоступна', overviewActivityEmptyTitle:'Сводки активности по рабочему пространству пока нет', overviewActivityEmptyBody:'Активность по рабочему пространству появится здесь, когда будут обнаружены значимые Events или Incidents. Аналитика по отдельным активам остаётся доступной в соответствующих разделах.', overviewViewEvents:'Открыть Events', overviewManageMonitoring:'Управлять мониторингом', overviewWebhookActiveShort:'Активен', overviewWebhookActiveShortPlural:'Активны', overviewWebhookWaitingFirst:'Эндпоинт ожидает первую production-доставку', overviewWebhookWaitingFirstPlural:'{count} эндпоинтов ожидают первую production-доставку', relatedEvents:'связанных Events', timeUnavailable:'Время недоступно', manageSubscription:'Управлять подпиской', changePlan:'Изменить план', billingPortalOpening:'Открываем управление подпиской…', billingPortalUnavailable:'Управление подпиской сейчас недоступно для этого рабочего пространства.', billingPortalOwnerRequired:'Управлять биллингом может только владелец рабочего пространства.', billingPortalUnsupportedStatus:'Подпиской в этом статусе сейчас нельзя управлять.', billingPortalFailed:'Не удалось открыть управление подпиской. Попробуйте ещё раз.', billingPortalInvalidUrl:'Elofid отклонил неожиданный адрес платёжного портала.', contactSalesEyebrow:'Enterprise', contactSalesTitle:'Связаться с отделом продаж Elofid', contactSalesDescription:'Расскажите о требованиях к инфраструктуре, мощности или SLA. Можно скопировать адрес отдела продаж или открыть почтовое приложение.', contactSupportEyebrow:'Поддержка', contactSupportTitle:'Связаться с поддержкой Elofid', contactSupportDescription:'Нужна помощь с рабочим пространством, API, вебхуками или биллингом? Можно скопировать адрес поддержки или открыть почтовое приложение.', contactEmailLabel:'Email', contactCopyEmail:'Скопировать email', contactOpenEmail:'Открыть почту', contactCopied:'Email скопирован.',
    correlatedIncident:'Связанный Risk Incident', status:'Статус', severity:'Уровень риска', detected:'Обнаружено', lastObserved:'Последнее наблюдение', eventSequence:'Последовательность Event',
    marketContext:'Рыночный контекст', marketContextHelp:'Контекст, записанный движком событий; он не заменяет основной сигнал.',
    developerData:'Данные для разработчика', developerDataDescription:'Доказательства, контекст и точный ответ API для {kind}', viewData:'Показать данные', exactAuthenticatedApiPayload:'Точный аутентифицированный API payload', noFieldsRemoved:'В показанном ответе не удалено ни одного поля.', copyJson:'Копировать JSON', copied:'Скопировано', copyFailed:'Ошибка копирования', evidence:'Доказательства', fullApiObject:'Полный объект API',
    riskIncident:'Risk Incident', events:'Events', signalFamilies:'семейства сигналов', updated:'Обновлено', confidence:'Достоверность', correlation:'Корреляция', reasonCodes:'Коды причин', reasonCodesHelp:'Машиночитаемые причины, связанные с этим Incident.', supportingEvents:'Поддерживающие Events', supportingEventsHelp:'Канонические ID Event, поддерживающие этот Incident.',
    kindEvent:'Event', kindIncident:'Incident',
    monitoringScore:'Оценка', monitoringLiquidity:'Ликвидность', monitoringExitDepth:'Глубина выхода', monitoringLastScan:'Последний скан', monitoringWaitingFirstScan:'Ожидание первого архивного скана', monitoringLastObservationNoData:'Последнее наблюдение не вернуло рыночных данных', monitoringSnapshotUnavailable:'Текущий снимок недоступен', monitoringLoadingSnapshot:'Загрузка текущего снимка…', monitoringScanTimeUnavailable:'Время скана недоступно', monitoringJustNow:'только что', monitoringMinutesAgo:'{value} мин назад', monitoringHoursAgo:'{value} ч назад', monitoringDaysAgo:'{value} дн назад', monitoringPreviousScan:'сравнение с предыдущим архивным сканом',
    event_price_collapse:'Обвал цены', event_liquidity_collapse:'Обвал ликвидности', event_exit_depth_collapse:'Обвал глубины выхода', event_score_deterioration:'Ухудшение оценки Elofid', event_mint_authority_risk:'Риск полномочий mint', event_freeze_authority_risk:'Риск полномочий freeze', event_pause_risk:'Риск паузы', event_honeypot_risk:'Риск Honeypot', event_sell_blocked:'Продажа заблокирована', event_buy_blocked:'Покупка заблокирована', event_tax_spike:'Резкий рост налога', event_tax_changed:'Налог изменён', event_tax_reduced:'Налог снижен',
    status_open:'открыт', status_resolved:'разрешён', status_monitoring_ended:'мониторинг завершён', severity_info:'информация', severity_low:'низкий', severity_medium:'средний', severity_high:'высокий', severity_critical:'критический', severity_catastrophic:'катастрофический', confidence_high:'высокая', confidence_medium:'средняя', confidence_low:'низкая', confidence_unknown:'неизвестная'
  }),
})

function globalDetailLanguage() {
  const candidates = []
  try {
    candidates.push(window?.ELOFID_LANGUAGE)
    candidates.push(localStorage.getItem('elofid_language'), localStorage.getItem('elofid_lang'), localStorage.getItem('language'))
  } catch {}
  candidates.push(document?.documentElement?.lang, navigator?.language)
  for (const raw of candidates) {
    const value = String(raw || '').trim().toLowerCase()
    if (!value) continue
    if (value.startsWith('zh')) return 'zh'
    if (value.startsWith('ar')) return 'ar'
    if (value.startsWith('ru')) return 'ru'
    if (value.startsWith('en')) return 'en'
  }
  return 'en'
}

function globalDetailLocale() {
  return ({ en:'en-US', zh:'zh-CN', ar:'ar', ru:'ru-RU' })[globalDetailLanguage()] || 'en-US'
}

function globalDetailT(key, vars = {}) {
  const lang = globalDetailLanguage()
  const dict = GLOBAL_DETAIL_I18N[lang] || GLOBAL_DETAIL_I18N.en
  let text = String(dict?.[key] ?? GLOBAL_DETAIL_I18N.en?.[key] ?? key)
  for (const [name, value] of Object.entries(vars || {})) text = text.replaceAll(`{${name}}`, String(value))
  return text
}

function globalDetailEnum(prefix, value) {
  const raw = String(value ?? '').trim().toLowerCase()
  if (!raw) return '—'
  const key = `${prefix}_${raw}`
  const translated = globalDetailT(key)
  return translated === key ? String(value) : translated
}

function globalDetailEventType(type) {
  const raw = String(type || '')
  const key = `event_${raw}`
  const translated = globalDetailT(key)
  return translated === key ? formatEventType(raw) : translated
}

function globalDetailBoolean(value) {
  if (value === true || value === 1 || value === 'true') return globalDetailT('yes')
  if (value === false || value === 0 || value === 'false') return globalDetailT('no')
  return String(value ?? '—')
}

function globalDetailQuality(value) {
  const raw = String(value ?? '').trim().toLowerCase()
  if (!raw) return '—'
  if (['complete','partial','provisional'].includes(raw)) return globalDetailT(raw)
  return String(value)
}

function globalDetailDate(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return '—'
  const date = new Date(n * 1000)
  const options = { year:'numeric', month:'numeric', day:'numeric', hour:'numeric', minute:'2-digit', second:'2-digit' }
  if (timeDisplayMode === 'utc') options.timeZone = 'UTC'
  return date.toLocaleString(globalDetailLocale(), options)
}

function globalDetailApplyChrome() {
  const modal = document.querySelector('.global-detail-modal')
  if (modal) modal.setAttribute('dir', globalDetailLanguage() === 'ar' ? 'rtl' : 'ltr')
  const eyebrow = document.getElementById('global-detail-eyebrow')
  const title = document.getElementById('global-detail-title')
  const close = document.getElementById('global-detail-close')
  if (eyebrow) eyebrow.textContent = globalDetailT('fullGlobalIntelligence')
  if (title && !title.dataset.dynamicTitle) title.textContent = globalDetailT('intelligenceDetail')
  if (close) close.setAttribute('aria-label', globalDetailT('close'))
}

function globalDetailFinite(value) {
  if (value == null) return null
  if (typeof value === 'string' && value.trim() === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function globalDetailUsdPrice(value) {
  const n = globalDetailFinite(value)
  if (n == null) return '—'
  if (n === 0) return '$0'
  const a = Math.abs(n)
  if (a >= 1) return `$${new Intl.NumberFormat(globalDetailLocale(), { maximumFractionDigits: 4 }).format(n)}`
  if (a >= 0.01) return `$${new Intl.NumberFormat(globalDetailLocale(), { maximumFractionDigits: 6 }).format(n)}`
  if (a >= 0.00000001) return `$${new Intl.NumberFormat(globalDetailLocale(), { maximumSignificantDigits: 8 }).format(n)}`
  return `$${n.toExponential(4)}`
}

function globalDetailUsd(value) {
  const n = globalDetailFinite(value)
  if (n == null) return '—'
  const a = Math.abs(n)
  if (a >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(a >= 10_000_000_000 ? 1 : 2).replace(/\.0+$/,'')}B`
  if (a >= 1_000_000) return `$${(n / 1_000_000).toFixed(a >= 10_000_000 ? 1 : 2).replace(/\.0+$/,'')}M`
  if (a >= 1_000) return `$${(n / 1_000).toFixed(a >= 10_000 ? 1 : 2).replace(/\.0+$/,'')}K`
  return `$${new Intl.NumberFormat(globalDetailLocale(), { maximumFractionDigits: 2 }).format(n)}`
}

function globalDetailScore(value) {
  const n = globalDetailFinite(value)
  if (n == null) return '—'
  return `${Number.isInteger(n) ? n : n.toFixed(1)} / 100`
}

function globalDetailDrop(value) {
  const n = globalDetailFinite(value)
  if (n == null) return '—'
  if (Math.abs(n) < 1e-9) return globalDetailT('noRecordedDrop')
  return `↓ ${Math.abs(n).toFixed(1)}%`
}

function globalDetailScoreChange(value) {
  const n = globalDetailFinite(value)
  if (n == null) return '—'
  if (Math.abs(n) < 1e-9) return globalDetailT('noChange')
  const sign = n > 0 ? '+' : ''
  return `${sign}${Number.isInteger(n) ? n : n.toFixed(1)} ${globalDetailT('points')}`
}

function globalDetailObservedChange(beforeValue, afterValue, { fallbackChange = null, scoreMetric = false } = {}) {
  const before = globalDetailFinite(beforeValue)
  const after = globalDetailFinite(afterValue)

  if (before != null && after != null) {
    const scale = Math.max(1, Math.abs(before), Math.abs(after))
    const delta = after - before
    const unchanged = Math.abs(delta) <= scale * 1e-12
    if (unchanged) return { text: globalDetailT('noChange'), className: 'is-neutral', direction: 'flat' }

    if (scoreMetric) {
      const value = Number.isInteger(delta) ? String(delta) : delta.toFixed(1)
      return {
        text: `${delta > 0 ? '+' : ''}${value} ${globalDetailT('points')}`,
        className: delta > 0 ? 'is-positive' : 'is-negative',
        direction: delta > 0 ? 'up' : 'down',
      }
    }

    if (before !== 0) {
      const pct = (delta / Math.abs(before)) * 100
      return {
        text: `${pct > 0 ? '↑' : '↓'} ${Math.abs(pct).toFixed(1)}%`,
        className: pct > 0 ? 'is-positive' : 'is-negative',
        direction: pct > 0 ? 'up' : 'down',
      }
    }

    return {
      text: after > 0 ? globalDetailT('upFromZero') : globalDetailT('downFromZero'),
      className: after > 0 ? 'is-positive' : 'is-negative',
      direction: after > 0 ? 'up' : 'down',
    }
  }

  const fallback = globalDetailFinite(fallbackChange)
  if (fallback == null) return { text: '—', className: '', direction: 'unknown' }

  if (scoreMetric) {
    if (Math.abs(fallback) < 1e-9) return { text: globalDetailT('noChange'), className: 'is-neutral', direction: 'flat' }
    return {
      text: globalDetailScoreChange(fallback),
      className: fallback > 0 ? 'is-positive' : 'is-negative',
      direction: fallback > 0 ? 'up' : 'down',
    }
  }

  if (Math.abs(fallback) < 1e-9) return { text: globalDetailT('noRecordedDrop'), className: 'is-neutral', direction: 'flat' }
  return { text: globalDetailDrop(fallback), className: 'is-negative', direction: 'down' }
}

function globalDetailMetricDefinition(type) {
  const defs = {
    price_collapse: { key:'price_usd', change:'price_drop_pct', labelKey:'price', format:globalDetailUsdPrice },
    liquidity_collapse: { key:'liquidity_usd', change:'liquidity_drop_pct', labelKey:'liquidity', format:globalDetailUsd },
    exit_depth_collapse: { key:'exit_depth_10_usd', change:'exit_depth_drop_pct', labelKey:'exitDepth10', format:globalDetailUsd },
    score_deterioration: { key:'score', change:'score_change', labelKey:'elofidScore', format:globalDetailScore },
  }
  const def = defs[String(type || '')] || null
  return def ? { ...def, label: globalDetailT(def.labelKey) } : null
}

function globalDetailMutationLabel(type) {
  const labels = {
    mint_authority_enabled: 'mintAuthorityEnabled',
    mint_authority_changed: 'mintAuthorityChanged',
    freeze_authority_enabled: 'freezeAuthorityEnabled',
    pause_activated: 'pauseActivated',
    honeypot_detected: 'honeypotDetected',
  }
  const key = labels[String(type || '')]
  return key ? globalDetailT(key) : (String(type || '').replaceAll('_',' ') || globalDetailT('securityStateChange'))
}

function globalDetailMutationValue(value) {
  if (value == null) return '—'
  if (value === true) return globalDetailT('enabledTrue')
  if (value === false) return globalDetailT('disabledFalse')
  const s = String(value)
  return s.length > 30 ? shortToken(s) : s
}

function globalDetailMetricRows(row) {
  const defs = [
    { labelKey:'price', key:'price_usd', changeKey:'price_drop_pct', format:globalDetailUsdPrice },
    { labelKey:'liquidity', key:'liquidity_usd', changeKey:'liquidity_drop_pct', format:globalDetailUsd },
    { labelKey:'exitDepth10', key:'exit_depth_10_usd', changeKey:'exit_depth_drop_pct', format:globalDetailUsd },
    { labelKey:'elofidScore', key:'score', changeKey:'score_change', format:globalDetailScore, scoreMetric:true },
  ]
  const rows = defs.map((def) => {
    const before = globalDetailFinite(row?.baseline?.[def.key])
    const after = globalDetailFinite(row?.current?.[def.key])
    const apiChange = globalDetailFinite(row?.change?.[def.changeKey])
    if (before == null && after == null && apiChange == null) return ''
    const observed = globalDetailObservedChange(before, after, { fallbackChange: apiChange, scoreMetric: def.scoreMetric === true })
    return `<div class="global-detail-metric-row">
      <div class="global-detail-metric-name">${escapeHtml(globalDetailT(def.labelKey))}</div>
      <div class="global-detail-metric-value">${escapeHtml(def.format(before))}</div>
      <div class="global-detail-metric-value">${escapeHtml(def.format(after))}</div>
      <div class="global-detail-metric-change ${observed.className}">${escapeHtml(observed.text)}</div>
    </div>`
  }).filter(Boolean).join('')
  if (!rows) return `<div class="global-detail-empty-context">${escapeHtml(globalDetailT('noAdditionalNumericContext'))}</div>`
  return `<div class="global-detail-metric-table">
    <div class="global-detail-metric-row is-header"><div>${escapeHtml(globalDetailT('metric'))}</div><div>${escapeHtml(globalDetailT('baseline'))}</div><div>${escapeHtml(globalDetailT('current'))}</div><div>${escapeHtml(globalDetailT('observedChange'))}</div></div>
    ${rows}
  </div>`
}

function globalDetailTechnicalPayload(row, kind = 'Event') {
  const kindLabel = globalDetailT(kind === 'Incident' ? 'kindIncident' : 'kindEvent')
  return `<details class="global-detail-technical">
    <summary>
      <span class="global-detail-technical-summary-main"><span class="global-detail-technical-icon">{ }</span><span class="global-detail-technical-copy"><strong>${escapeHtml(globalDetailT('developerData'))}</strong><small>${escapeHtml(globalDetailT('developerDataDescription', { kind:kindLabel }))}</small></span></span>
      <span class="global-detail-technical-action"><span>${escapeHtml(globalDetailT('viewData'))}</span><span class="global-detail-chevron" aria-hidden="true"></span></span>
    </summary>
    <div class="global-detail-technical-inner">
      <div class="global-detail-tech-head"><div><strong>${escapeHtml(globalDetailT('exactAuthenticatedApiPayload'))}</strong><span>${escapeHtml(globalDetailT('noFieldsRemoved'))}</span></div><button type="button" class="global-detail-copy-json">${escapeHtml(globalDetailT('copyJson'))}</button></div>
      ${kind === 'Event' ? `<div class="global-detail-tech-grid"><section><h4>${escapeHtml(globalDetailT('evidence'))}</h4><pre dir="ltr">${escapeHtml(JSON.stringify(row?.evidence ?? null, null, 2))}</pre></section><section><h4>${escapeHtml(globalDetailT('marketContext'))}</h4><pre dir="ltr">${escapeHtml(JSON.stringify(row?.market_context ?? null, null, 2))}</pre></section></div>` : ''}
      <section class="global-detail-full-payload"><h4>${escapeHtml(globalDetailT('fullApiObject'))}</h4><pre dir="ltr">${escapeHtml(JSON.stringify(row, null, 2))}</pre></section>
    </div>
  </details>`
}

let globalDetailRawPayload = null
let globalFeedLoadedAt = 0

const GLOBAL_FEED_RELATIVE_REFRESH_MS = 60 * 1000
window.setInterval(() => {
  refreshGlobalFeedRelativeLabels()
}, GLOBAL_FEED_RELATIVE_REFRESH_MS)

async function openGlobalDetail(kind, id) {
  const backdrop = document.getElementById('global-detail-backdrop')
  const bodyEl = document.getElementById('global-detail-body')
  const titleEl = document.getElementById('global-detail-title')
  const subEl = document.getElementById('global-detail-sub')
  if (!backdrop || !bodyEl) return
  globalDetailRawPayload = null
  globalDetailApplyChrome()
  if (titleEl) titleEl.dataset.dynamicTitle = ''
  backdrop.dataset.open='true'
  bodyEl.innerHTML=`<div class="events-empty">${escapeHtml(globalDetailT('loadingFullIntelligence'))}</div>`
  try {
    const token = await clerk.session?.getToken()
    if (!token) throw new Error(globalDetailT('authenticationUnavailable'))
    const response = await fetch(`${CONTROL_PLANE}/v1/global/${kind === 'incident' ? 'incidents' : 'events'}/${encodeURIComponent(id)}`, { headers:{Authorization:`Bearer ${token}`,Accept:'application/json'} })
    const result = await response.json().catch(()=>null)
    if (!response.ok || !result?.data) throw new Error(result?.detail || result?.message || result?.error || `HTTP ${response.status}`)
    const row=result.data
    globalDetailRawPayload = row

    if (titleEl) {
      titleEl.dataset.dynamicTitle = 'true'
      titleEl.textContent = kind === 'incident' ? `${globalDetailT('riskIncident')} #${row.id}` : globalDetailEventType(row.type)
    }
    if (subEl) {
      const severity = globalDetailEnum('severity', row.severity || 'unknown')
      const confidence = globalDetailEnum('confidence', row.confidence || 'unknown')
      subEl.textContent = `${chainDisplayName(row.chain)} · ${row.symbol || shortToken(row.token)} · ${severity} · ${globalDetailT('confidenceSuffix', { value:confidence })}`
    }

    if (kind === 'event') {
      const primary = globalDetailMetricDefinition(row.type)
      const mutation = row?.evidence?.mutation || null
      const isSecurity = ['mint_authority_risk','freeze_authority_risk','pause_risk','honeypot_risk'].includes(String(row?.type || ''))

      let hero = ''
      if (primary) {
        const baselineValue = row?.baseline?.[primary.key]
        const currentValue = row?.current?.[primary.key]
        const changeValue = row?.change?.[primary.change]
        const observedPrimary = globalDetailObservedChange(baselineValue, currentValue, {
          fallbackChange: changeValue,
          scoreMetric: String(row?.type || '') === 'score_deterioration',
        })
        hero = `<section class="global-detail-hero">
          <div class="global-detail-hero-kicker">${escapeHtml(globalDetailT('primarySignal'))}</div>
          <div class="global-detail-hero-row">
            <div class="global-detail-hero-main"><span>${escapeHtml(primary.label)} · ${escapeHtml(globalDetailT('currentLower'))}</span><strong>${escapeHtml(primary.format(currentValue))}</strong><span>${escapeHtml(globalDetailT('baseline'))} ${escapeHtml(primary.format(baselineValue))}</span></div>
            <div class="global-detail-delta ${observedPrimary.className}">${escapeHtml(observedPrimary.text)}</div>
          </div>
        </section>`
      } else if (isSecurity) {
        const mutationType = mutation?.type || row?.type
        hero = `<section class="global-detail-hero global-detail-hero-security">
          <div class="global-detail-hero-kicker">${escapeHtml(globalDetailT('securityStateSignal'))}</div>
          <div class="global-detail-hero-row">
            <div class="global-detail-hero-main"><span>${escapeHtml(globalDetailMutationLabel(mutationType))}</span><strong>${escapeHtml(globalDetailMutationValue(mutation?.previous))}<em>→</em>${escapeHtml(globalDetailMutationValue(mutation?.current))}</strong></div>
            <div class="global-detail-delta">${escapeHtml(globalDetailEnum('confidence', mutation?.confidence || row?.confidence || 'unknown').toUpperCase())}</div>
          </div>
        </section>`
      } else {
        hero = `<section class="global-detail-hero"><div class="global-detail-hero-kicker">${escapeHtml(globalDetailT('detectedSignal'))}</div><div class="global-detail-hero-row"><div class="global-detail-hero-main"><span>${escapeHtml(globalDetailEventType(row.type))}</span><strong>${escapeHtml(globalDetailT('evidenceBackedStateChange'))}</strong></div></div></section>`
      }

      const contextTable = globalDetailMetricRows(row)

      const market = row?.market_context || {}
      const marketItems = []
      if (market?.benchmark_key) marketItems.push(`<div><span>${escapeHtml(globalDetailT('benchmark'))}</span><strong>${escapeHtml(String(market.benchmark_key))}</strong></div>`)
      if (globalDetailFinite(market?.benchmark_move_pct) != null) marketItems.push(`<div><span>${escapeHtml(globalDetailT('benchmarkMove'))}</span><strong>${escapeHtml(`${Number(market.benchmark_move_pct).toFixed(1)}%`)}</strong></div>`)
      if (globalDetailFinite(market?.relative_underperformance_pct) != null) marketItems.push(`<div title="${escapeHtml(globalDetailT('relativeUnderperformanceFull'))}" aria-label="${escapeHtml(globalDetailT('relativeUnderperformanceFull'))}"><span>${escapeHtml(globalDetailT('relativeUnderperformance'))}</span><strong>${escapeHtml(`${Number(market.relative_underperformance_pct).toFixed(1)} pp`)}</strong></div>`)
      if (market?.provider_continuity != null) marketItems.push(`<div><span>${escapeHtml(globalDetailT('providerContinuity'))}</span><strong>${escapeHtml(globalDetailBoolean(market.provider_continuity))}</strong></div>`)
      if (market?.market_context_status_now) marketItems.push(`<div><span>${escapeHtml(globalDetailT('marketContextQuality'))}</span><strong>${escapeHtml(globalDetailQuality(market.market_context_status_now))}</strong></div>`)

      const incidentHtml = row?.incident ? `<section class="global-detail-incident"><div><span>${escapeHtml(globalDetailT('correlatedIncident'))}</span><strong>#${escapeHtml(String(row.incident.id ?? '—'))}</strong></div><div><span>${escapeHtml(globalDetailT('status'))}</span><strong>${escapeHtml(globalDetailEnum('status', row.incident.status || '—'))}</strong></div><div><span>${escapeHtml(globalDetailT('severity'))}</span><strong>${escapeHtml(globalDetailEnum('severity', row.incident.severity || '—'))}</strong></div></section>` : ''

      bodyEl.innerHTML = `${hero}
        <section class="global-detail-section">
          <div class="global-detail-section-head"><div><h3>${escapeHtml(globalDetailT('signalContext'))}</h3><p>${escapeHtml(globalDetailT('signalContextHelp'))}</p></div></div>
          ${contextTable}
        </section>
        <section class="global-detail-lifecycle">
          <div><span>${escapeHtml(globalDetailT('status'))}</span><strong>${escapeHtml(globalDetailEnum('status', lifecycleDisplayStatus(row) || '—'))}</strong></div>
          <div><span>${escapeHtml(globalDetailT('detected'))}</span><strong>${escapeHtml(globalDetailDate(row.detected_at))}</strong></div>
          <div><span>${escapeHtml(globalDetailT('lastObserved'))}</span><strong>${escapeHtml(globalDetailDate(row.last_observed_at || row.updated_at))}</strong></div>
          <div><span>${escapeHtml(globalDetailT('eventSequence'))}</span><strong>${escapeHtml(row.incident_seq == null ? '—' : String(row.incident_seq))}</strong></div>
        </section>
        ${incidentHtml}
        ${marketItems.length ? `<section class="global-detail-section"><div class="global-detail-section-head"><div><h3>${escapeHtml(globalDetailT('marketContext'))}</h3><p>${escapeHtml(globalDetailT('marketContextHelp'))}</p></div></div><div class="global-detail-facts">${marketItems.join('')}</div></section>` : ''}
        ${globalDetailTechnicalPayload(row)}`
    } else {
      const reasons = Array.isArray(row?.reason_codes) ? row.reason_codes : []
      const supporting = Array.isArray(row?.supporting_event_ids) ? row.supporting_event_ids : []
      bodyEl.innerHTML = `<section class="global-detail-hero">
          <div class="global-detail-hero-kicker">${escapeHtml(globalDetailT('riskIncident'))}</div>
          <div class="global-detail-hero-row"><div class="global-detail-hero-main"><span>${escapeHtml(globalDetailEnum('status', lifecycleDisplayStatus(row) || '—'))}</span><strong>${escapeHtml(String(row.event_count ?? 0))} ${escapeHtml(globalDetailT('events'))} <em>·</em> ${escapeHtml(String(row.family_count ?? 0))} ${escapeHtml(globalDetailT('signalFamilies'))}</strong></div><div class="global-detail-delta">${escapeHtml(globalDetailEnum('severity', row.severity || 'unknown').toUpperCase())}</div></div>
        </section>
        <section class="global-detail-lifecycle">
          <div><span>${escapeHtml(globalDetailT('detected'))}</span><strong>${escapeHtml(globalDetailDate(row.detected_at))}</strong></div>
          <div><span>${escapeHtml(globalDetailT('updated'))}</span><strong>${escapeHtml(globalDetailDate(row.updated_at))}</strong></div>
          <div><span>${escapeHtml(globalDetailT('confidence'))}</span><strong>${escapeHtml(globalDetailEnum('confidence', row.confidence || '—'))}</strong></div>
          <div><span>${escapeHtml(globalDetailT('correlation'))}</span><strong>${escapeHtml(String(row?.correlation?.version || '—'))}</strong></div>
        </section>
        ${reasons.length ? `<section class="global-detail-section"><div class="global-detail-section-head"><div><h3>${escapeHtml(globalDetailT('reasonCodes'))}</h3><p>${escapeHtml(globalDetailT('reasonCodesHelp'))}</p></div></div><div class="global-detail-tags">${reasons.map(x=>`<span>${escapeHtml(String(x))}</span>`).join('')}</div></section>` : ''}
        ${supporting.length ? `<section class="global-detail-section"><div class="global-detail-section-head"><div><h3>${escapeHtml(globalDetailT('supportingEvents'))}</h3><p>${escapeHtml(globalDetailT('supportingEventsHelp'))}</p></div></div><div class="global-detail-tags">${supporting.map(x=>`<span>#${escapeHtml(String(x))}</span>`).join('')}</div></section>` : ''}
        ${globalDetailTechnicalPayload(row, 'Incident')}`
    }
  } catch (e) {
    globalDetailRawPayload = null
    bodyEl.innerHTML=`<div class="events-error">${escapeHtml(e?.message || globalDetailT('unableToLoad'))}</div>`
  }
}

async function loadGlobalFeed(token) {
  const access = String(usageData?.entitlements?.global_feed_access || globalAccessMode || 'preview')
  if (access !== 'full') {
    await loadGlobalPreview(token)
    renderGlobalFeed()
    return
  }

  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  const [eventResponse, incidentResponse] = await Promise.all([
    fetch(`${CONTROL_PLANE}/v1/global/events?limit=50`, { method: 'GET', headers }),
    fetch(`${CONTROL_PLANE}/v1/global/incidents?limit=25`, { method: 'GET', headers }),
  ])
  const [eventBody, incidentBody] = await Promise.all([
    eventResponse.json().catch(() => null),
    incidentResponse.json().catch(() => null),
  ])

  qaLog('ELOFID GLOBAL FEED QA', {
    event_status: eventResponse.status,
    incident_status: incidentResponse.status,
    events: Array.isArray(eventBody?.data) ? eventBody.data.length : null,
    incidents: Array.isArray(incidentBody?.data) ? incidentBody.data.length : null,
    plan: workspace?.plan_code || null,
    access: 'full',
  })

  if (!eventResponse.ok || !Array.isArray(eventBody?.data)) {
    const message = eventBody?.detail || eventBody?.message || eventBody?.error || `HTTP ${eventResponse.status}`
    throw new Error(`Unable to load Global Feed Events: ${message}`)
  }
  if (!incidentResponse.ok || !Array.isArray(incidentBody?.data)) {
    const message = incidentBody?.detail || incidentBody?.message || incidentBody?.error || `HTTP ${incidentResponse.status}`
    throw new Error(`Unable to load Global Feed Incidents: ${message}`)
  }

  globalFeedEvents = eventBody.data
  globalFeedIncidents = incidentBody.data
  globalFeedLoadedAt = Date.now()
  populateGlobalFilters()
  renderGlobalFeed()
}

function renderGlobalFeedError(message) {
  const list = document.getElementById('global-feed-list')
  const meta = document.getElementById('global-feed-meta')
  if (meta) {
    delete meta.dataset.globalFeedMetaBase
    meta.textContent = 'Global Feed unavailable'
  }
  if (list) list.innerHTML = `<div class="events-error">${escapeHtml(message)}</div>`
}

function renderUsageView(body) {
  const data = body?.data || null
  if (!data) return
  const plan = String(data?.plan_code || workspace?.plan_code || 'free').toUpperCase()
  const used = Number(data?.used || 0)
  const limit = data?.limit == null ? null : Number(data.limit)
  const remaining = data?.remaining == null ? null : Number(data.remaining)
  const ent = data?.entitlements || {}
  const assets = data?.monitored_assets || {}
  const hooks = data?.webhooks || {}
  const replacements = data?.asset_replacements_24h || {}
  const pct=(u,l)=>Number.isFinite(Number(l)) && Number(l)>0 ? Math.min(100,Math.max(0,(Number(u||0)/Number(l))*100)) : 0
  const setProgress=(id,val)=>{const el=document.getElementById(id); if(el) el.style.width=`${val}%`}
  const fmtDate=(ts)=>dashboardDate(ts,{month:'short',day:'numeric'})||'—'

  const planEl=document.getElementById('usage-plan'); if(planEl) planEl.textContent=plan
  const planMeta=document.getElementById('usage-plan-meta'); if(planMeta) planMeta.textContent = `${ent.history_days ?? '—'}-day history · ${String(ent.global_feed_access||'preview')==='full'?'Full Global Intelligence':'Global Intelligence Preview'}`
  const assetEl=document.getElementById('usage-assets'); if(assetEl) assetEl.textContent = assets?.limit==null?formatCompactNumber(assets?.used||0):`${formatCompactNumber(assets?.used||0)} / ${formatCompactNumber(assets.limit)}`
  const assetMeta=document.getElementById('usage-assets-meta'); if(assetMeta) assetMeta.textContent=`${formatCompactNumber(assets?.remaining||0)} remaining · ${formatCompactNumber(assets?.used||0)} active monitored assets`
  setProgress('usage-assets-progress',pct(assets?.used,assets?.limit))
  const apiEl=document.getElementById('usage-api'); if(apiEl) apiEl.textContent=limit==null?formatCompactNumber(used):`${formatCompactNumber(used)} / ${formatCompactNumber(limit)}`
  const apiMeta=document.getElementById('usage-api-meta'); if(apiMeta) apiMeta.textContent=limit==null?'Custom API capacity':`${formatCompactNumber(used)} of ${formatCompactNumber(limit)} used · Resets ${fmtDate(data?.period_end)}`
  setProgress('usage-api-progress',pct(used,limit))
  const apiUsagePct = pct(used, limit)
  const apiCard = document.getElementById('usage-api-card')
  const apiAlert = document.getElementById('usage-api-alert')
  apiCard?.classList.remove('usage-warning', 'usage-critical')
  if (apiAlert) {
    apiAlert.removeAttribute('data-level')
    apiAlert.textContent = ''
    if (limit != null && apiUsagePct >= 90) {
      apiCard?.classList.add('usage-critical')
      apiAlert.dataset.level = 'critical'
      apiAlert.textContent = `Usage alert · ${apiUsagePct.toFixed(apiUsagePct >= 99.95 ? 0 : 1)}% of your monthly Developer API allowance is used.`
    } else if (limit != null && apiUsagePct >= 75) {
      apiCard?.classList.add('usage-warning')
      apiAlert.dataset.level = 'warning'
      apiAlert.textContent = `Usage notice · ${apiUsagePct.toFixed(1)}% of your monthly Developer API allowance is used.`
    }
  }
  const whEl=document.getElementById('usage-webhooks'); if(whEl) whEl.textContent=hooks?.limit==null?`${formatCompactNumber(hooks?.used||0)} / Custom`:`${formatCompactNumber(hooks?.used||0)} / ${formatCompactNumber(hooks.limit)}`
  const whMeta=document.getElementById('usage-webhooks-meta'); if(whMeta) whMeta.textContent=hooks?.limit==null?'Custom Webhook Destination capacity':`${formatCompactNumber(hooks?.remaining||0)} remaining · configured destinations, not deliveries`
  setProgress('usage-webhooks-progress',pct(hooks?.used,hooks?.limit))
  const replEl=document.getElementById('usage-replacements'); if(replEl) replEl.textContent=replacements?.limit==null?formatCompactNumber(replacements?.used||0):`${formatCompactNumber(replacements?.used||0)} / ${formatCompactNumber(replacements.limit)}`
  const replMeta=document.getElementById('usage-replacements-meta'); if(replMeta) replMeta.textContent=replacements?.limit==null?'No fixed daily replacement limit':`${formatCompactNumber(replacements?.remaining||0)} remaining · rolling 24h${replacements?.resets_at?` · next slot ${fmtDate(replacements.resets_at)}`:''}`
  const globalEl=document.getElementById('usage-global'); if(globalEl) globalEl.textContent=String(ent?.global_feed_access||'preview')==='full'?'Full Access':'Preview'
  const globalMeta=document.getElementById('usage-global-meta'); if(globalMeta) globalMeta.textContent=String(ent?.global_feed_access||'preview')==='full'?'Full Global Intelligence + Global Feed API':'Dashboard preview only · upgrade to Starter+ for full network intelligence and API'
  const monitoringPlanMeta=document.getElementById('monitoring-plan-meta'); if(monitoringPlanMeta) monitoringPlanMeta.textContent=`${plan} · ${formatCompactNumber(assets?.used||0)}/${formatCompactNumber(assets?.limit||0)} unique monitored assets${replacements?.limit!=null?` · ${formatCompactNumber(replacements?.used||0)}/${formatCompactNumber(replacements.limit)} replacements used / 24h`:''}`
  refreshOverviewUi()
}

async function loadUsage(token) {
  const response = await fetch(`${CONTROL_PLANE}/v1/usage`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  })
  const body = await response.json().catch(() => null)

  qaLog('ELOFID USAGE VIEW QA', {
    status: response.status,
    plan: body?.data?.plan_code || null,
    api_used: body?.data?.used ?? null,
    api_limit: body?.data?.limit ?? null,
    replacements_used: body?.data?.asset_replacements_24h?.used ?? null,
    replacements_limit: body?.data?.asset_replacements_24h?.limit ?? null,
  })

  if (!response.ok || !body?.data) {
    const message = body?.detail || body?.message || body?.error || `HTTP ${response.status}`
    throw new Error(`Unable to load Usage: ${message}`)
  }
  usageData = body.data
  usageLoaded = true
  renderUsageView(body)
  return body
}

function renderUsageError(message) {
  for (const id of ['usage-plan', 'usage-assets', 'usage-api', 'usage-replacements', 'usage-webhooks', 'usage-global']) {
    const el = document.getElementById(id)
    if (el) el.textContent = '—'
  }
  const meta = document.getElementById('usage-plan-meta')
  if (meta) meta.textContent = message
}

function monitoredEventAssets() {
  const seen = new Set()
  const assets = []

  for (const watchlist of watchlistDetails) {
    if (watchlist?.status !== 'active') continue
    for (const asset of Array.isArray(watchlist?.assets) ? watchlist.assets : []) {
      if (asset?.status !== 'active' || !asset?.chain || !asset?.token) continue
      const key = `${asset.chain}:${asset.token}`
      if (seen.has(key)) continue
      seen.add(key)
      assets.push({
        chain: String(asset.chain),
        token: String(asset.token),
        watchlistId: Number(watchlist?.id) || null,
        watchlistName: String(watchlist?.name || 'My Monitoring')
      })
    }
  }

  return assets
}

function formatEventType(value) {
  return String(value || 'event')
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatUnixTime(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return 'Unknown time'
  return dashboardDate(n) || 'Unknown time'
}

function setSelectOptions(select, options, fallbackLabel) {
  if (!select) return
  const selected = select.value || 'all'
  select.innerHTML = `<option value="all">${escapeHtml(fallbackLabel)}</option>` + options.map(({ value, label }) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`).join('')
  if ([...select.options].some((option) => option.value === selected)) select.value = selected
}

function populateMonitoringFilters() {
  const favoritesSelect = document.getElementById('monitoring-watchlist-filter')
  const chainSelect = document.getElementById('monitoring-chain-filter')
  const activeWatchlists = watchlistDetails.filter((watchlist) => watchlist?.status === 'active')
  const chains = [...new Set(activeWatchlists.flatMap((watchlist) => Array.isArray(watchlist?.assets) ? watchlist.assets : [])
    .filter((asset) => asset?.status === 'active' && asset?.chain)
    .map((asset) => String(asset.chain)))]
    .sort((a, b) => chainDisplayName(a).localeCompare(chainDisplayName(b)))
  setSelectOptions(favoritesSelect, [{ value: 'favorites', label: 'Favorites' }], 'All assets')
  setSelectOptions(chainSelect, chains.map((chain) => ({ value: chain, label: chainDisplayName(chain) })), 'All chains')
}

function populateEventFilters(rows) {
  const types = [...new Set(rows.map((row) => String(row?.type || '')).filter(Boolean))]
    .sort((a, b) => formatEventType(a).localeCompare(formatEventType(b)))
  const severities = [...new Set(rows.map((row) => String(row?.severity || '').toLowerCase()).filter(Boolean))]
    .sort()
  setSelectOptions(document.getElementById('events-type-filter'), types.map((type) => ({ value: type, label: formatEventType(type) })), 'All event types')
  setSelectOptions(document.getElementById('events-severity-filter'), severities.map((severity) => ({ value: severity, label: globalDetailEnum('severity', severity) })), 'All severities')
}

function populateIncidentFilters(rows) {
  const severities = [...new Set(rows.map((row) => String(row?.severity || '').toLowerCase()).filter(Boolean))].sort()
  const statuses = [...new Set(rows.map((row) => String(row?.status || '').toLowerCase()).filter(Boolean))].sort()
  setSelectOptions(document.getElementById('incidents-severity-filter'), severities.map((severity) => ({ value: severity, label: globalDetailEnum('severity', severity) })), 'All severities')
  setSelectOptions(document.getElementById('incidents-status-filter'), statuses.map((status) => ({ value: status, label: globalDetailEnum('status', status) })), 'All statuses')
}

function renderEventAssetPicker() {
  const select = document.getElementById('events-asset-select')
  if (!select) return

  if (!eventAssets.length) {
    select.disabled = true
    select.innerHTML = '<option>No active monitored assets</option>'
    return
  }

  select.disabled = false
  const allOption = `<option value="-1"${selectedEventAssetIndex === -1 ? ' selected' : ''}>All monitored assets</option>`
  const assetOptions = eventAssets.map((asset, index) => {
    const label = `${chainDisplayName(asset.chain)} · ${asset.token}`
    return `<option value="${index}"${index === selectedEventAssetIndex ? ' selected' : ''}>${escapeHtml(label)}</option>`
  }).join('')
  select.innerHTML = allOption + assetOptions
}


function monitoredDetailTechnicalPayload(row, kind = 'Event') {
  const kindLabel = kind === 'Incident' ? 'Risk Incident' : 'Event'
  return `<details class="global-detail-technical">
    <summary>
      <span class="global-detail-technical-summary-main"><span class="global-detail-technical-icon">{ }</span><span class="global-detail-technical-copy"><strong>Developer data</strong><small>Exact authenticated ${escapeHtml(kindLabel)} object returned to this Dashboard.</small></span></span>
      <span class="global-detail-technical-action"><span>View data</span><span class="global-detail-chevron" aria-hidden="true"></span></span>
    </summary>
    <div class="global-detail-technical-inner">
      <div class="global-detail-tech-head"><div><strong>Authenticated My Monitoring payload</strong><span>No synthetic fields are added to this object.</span></div><button type="button" class="global-detail-copy-json">Copy JSON</button></div>
      <section class="global-detail-full-payload"><h4>API object</h4><pre dir="ltr">${escapeHtml(JSON.stringify(row, null, 2))}</pre></section>
    </div>
  </details>`
}

function monitoredDetailRow(kind, id) {
  const targetId = String(id ?? '')
  const alertSource = kind === 'incident' ? globalAlertIncidentRows : globalAlertEventRows
  const pageSource = kind === 'incident' ? lastIncidentsBody?.data : lastEventsBody?.data
  const sources = [alertSource, Array.isArray(pageSource) ? pageSource : []]
  for (const source of sources) {
    const row = source.find((item) => String(item?.id ?? '') === targetId)
    if (row) return row
  }
  return null
}

function openMonitoredDetail(kind, id) {
  const row = monitoredDetailRow(kind, id)
  const backdrop = document.getElementById('global-detail-backdrop')
  const bodyEl = document.getElementById('global-detail-body')
  const eyebrowEl = document.getElementById('global-detail-eyebrow')
  const titleEl = document.getElementById('global-detail-title')
  const subEl = document.getElementById('global-detail-sub')
  if (!backdrop || !bodyEl || !row) return

  globalDetailRawPayload = row
  globalDetailApplyChrome()
  if (eyebrowEl) eyebrowEl.textContent = 'Monitored Intelligence'
  if (titleEl) {
    titleEl.dataset.dynamicTitle = 'true'
    titleEl.textContent = kind === 'incident'
      ? `Risk Incident #${row.id ?? '—'}`
      : `${globalDetailEventType(row.type)} · Event #${row.id ?? '—'}`
  }
  if (subEl) {
    const parts = [chainDisplayName(row.chain)]
    if (row.symbol) parts.push(String(row.symbol))
    if (row.token) parts.push(shortToken(row.token))
    if (row.severity) parts.push(globalDetailEnum('severity', row.severity))
    if (row.confidence) parts.push(globalDetailT('confidenceSuffix', { value: globalDetailEnum('confidence', row.confidence) }))
    subEl.textContent = parts.join(' · ')
  }

  backdrop.dataset.open = 'true'

  if (kind === 'event') {
    const primary = globalDetailMetricDefinition(row.type)
    let hero = ''
    if (primary) {
      const baselineValue = row?.baseline?.[primary.key]
      const currentValue = row?.current?.[primary.key]
      const changeValue = row?.change?.[primary.change]
      const observedPrimary = globalDetailObservedChange(baselineValue, currentValue, {
        fallbackChange: changeValue,
        scoreMetric: String(row?.type || '') === 'score_deterioration',
      })
      hero = `<section class="global-detail-hero">
        <div class="global-detail-hero-kicker">Primary signal</div>
        <div class="global-detail-hero-row">
          <div class="global-detail-hero-main"><span>${escapeHtml(primary.label)} · current</span><strong>${escapeHtml(primary.format(currentValue))}</strong><span>Baseline ${escapeHtml(primary.format(baselineValue))}</span></div>
          <div class="global-detail-delta ${observedPrimary.className}">${escapeHtml(observedPrimary.text)}</div>
        </div>
      </section>`
    } else {
      hero = `<section class="global-detail-hero">
        <div class="global-detail-hero-kicker">Detected signal</div>
        <div class="global-detail-hero-row"><div class="global-detail-hero-main"><span>${escapeHtml(globalDetailEventType(row.type))}</span><strong>Meaningful monitored state change</strong></div></div>
      </section>`
    }

    const incidentHtml = row?.incident ? `<section class="global-detail-incident">
      <div><span>Correlated Incident</span><strong>#${escapeHtml(String(row.incident.id ?? '—'))}</strong></div>
      <div><span>Status</span><strong>${escapeHtml(globalDetailEnum('status', row.incident.status || '—'))}</strong></div>
      <div><span>Severity</span><strong>${escapeHtml(globalDetailEnum('severity', row.incident.severity || '—'))}</strong></div>
    </section>` : ''

    bodyEl.innerHTML = `${hero}
      <section class="global-detail-section">
        <div class="global-detail-section-head"><div><h3>Baseline → Current</h3><p>Values available in the authenticated My Monitoring Event payload.</p></div></div>
        ${globalDetailMetricRows(row)}
      </section>
      <section class="global-detail-lifecycle">
        <div><span>Status</span><strong>${escapeHtml(globalDetailEnum('status', lifecycleDisplayStatus(row) || '—'))}</strong></div>
        <div><span>Detected</span><strong>${escapeHtml(globalDetailDate(row.detected_at))}</strong></div>
        <div><span>Last observed</span><strong>${escapeHtml(globalDetailDate(row.last_observed_at || row.updated_at || row.last_triggered_at))}</strong></div>
        <div><span>Confidence</span><strong>${escapeHtml(globalDetailEnum('confidence', row.confidence || '—'))}</strong></div>
      </section>
      ${incidentHtml}
      ${monitoredDetailTechnicalPayload(row, 'Event')}`
  } else {
    const correlationScore = globalDetailFinite(row?.correlation?.score)
    const correlationFacts = [
      row?.correlation?.version ? `<div><span>Correlation version</span><strong>${escapeHtml(String(row.correlation.version))}</strong></div>` : '',
      correlationScore != null ? `<div><span>Correlation score</span><strong>${escapeHtml(new Intl.NumberFormat(globalDetailLocale(), { maximumFractionDigits: 3 }).format(correlationScore))}</strong></div>` : '',
      row?.incident_seq != null ? `<div><span>Incident sequence</span><strong>${escapeHtml(String(row.incident_seq))}</strong></div>` : '',
      row?.previous_incident_id != null ? `<div><span>Previous Incident</span><strong>#${escapeHtml(String(row.previous_incident_id))}</strong></div>` : '',
    ].filter(Boolean).join('')

    const detailEventCount = Number.isFinite(Number(row?.event_count)) ? Number(row.event_count) : 0
    const detailFamilyCount = Number.isFinite(Number(row?.family_count)) ? Number(row.family_count) : 0
    bodyEl.innerHTML = `<section class="global-detail-hero">
        <div class="global-detail-hero-kicker">Risk Incident</div>
        <div class="global-detail-hero-row">
          <div class="global-detail-hero-main"><span>${escapeHtml(globalDetailEnum('status', lifecycleDisplayStatus(row) || '—'))}</span><strong>${escapeHtml(String(detailEventCount))} Event${detailEventCount === 1 ? '' : 's'} <em>·</em> ${escapeHtml(String(detailFamilyCount))} signal ${detailFamilyCount === 1 ? 'family' : 'families'}</strong></div>
          <div class="global-detail-delta">${escapeHtml(globalDetailEnum('severity', row.severity || 'unknown').toUpperCase())}</div>
        </div>
      </section>
      <section class="global-detail-lifecycle">
        <div><span>Detected</span><strong>${escapeHtml(globalDetailDate(row.detected_at))}</strong></div>
        <div><span>First Event</span><strong>${escapeHtml(globalDetailDate(row.first_event_at))}</strong></div>
        <div><span>Last Event</span><strong>${escapeHtml(globalDetailDate(row.last_event_at || row.updated_at))}</strong></div>
        <div><span>Confidence</span><strong>${escapeHtml(globalDetailEnum('confidence', row.confidence || '—'))}</strong></div>
      </section>
      ${correlationFacts ? `<section class="global-detail-section"><div class="global-detail-section-head"><div><h3>Correlation</h3><p>Correlation metadata returned for this monitored Incident.</p></div></div><div class="global-detail-facts">${correlationFacts}</div></section>` : ''}
      ${row?.resolution_reason || isMonitoringEnded(row) ? `<section class="global-detail-section"><div class="global-detail-section-head"><div><h3>Resolution</h3></div></div><div class="global-detail-tags">${isMonitoringEnded(row) ? `<span>${escapeHtml(globalDetailEnum('status', 'monitoring_ended'))}</span>` : ''}${row?.resolution_reason && row.resolution_reason !== 'monitoring_ended' ? `<span>${escapeHtml(String(row.resolution_reason))}</span>` : ''}</div></section>` : ''}
      ${monitoredDetailTechnicalPayload(row, 'Incident')}`
  }
}


function globalAlertSeverityLevel(value) {
  const severity = String(value || '').toLowerCase()
  return severity === 'critical' ? 2 : severity === 'high' ? 1 : 0
}

function globalAlertTimestamp(kind, row) {
  const raw = kind === 'incident'
    ? (row?.last_event_at || row?.detected_at || row?.updated_at)
    : (row?.detected_at || row?.last_observed_at || row?.updated_at)
  const n = Number(raw)
  return Number.isFinite(n) ? n : 0
}

function globalAlertFingerprint(kind, row) {
  if (kind === 'incident') {
    return [row?.severity, row?.status, row?.event_count, row?.family_count].map(v => String(v ?? '')).join('|')
  }
  return [row?.severity, row?.status, row?.type, row?.incident?.id].map(v => String(v ?? '')).join('|')
}

function globalAlertMap(kind) {
  return kind === 'incident' ? globalAlertIncidentFingerprints : globalAlertEventFingerprints
}

function rememberGlobalAlertRows(kind, rows) {
  const map = globalAlertMap(kind)
  const changed = []
  for (const row of rows) {
    const id = String(row?.id ?? '')
    if (!id) continue
    const fingerprint = globalAlertFingerprint(kind, row)
    const previous = map.get(id)
    map.set(id, fingerprint)
    if (globalAlertBaselineReady && previous !== undefined && previous !== fingerprint) changed.push(row)
    if (globalAlertBaselineReady && previous === undefined) changed.push(row)
  }
  return changed
}

function notificationStorageLoad() {
  try {
    const parsed = JSON.parse(localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '[]')
    notificationItems = Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, NOTIFICATION_MAX_ITEMS) : []
  } catch {
    notificationItems = []
  }
}

function notificationStorageSave() {
  try { localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notificationItems.slice(0, NOTIFICATION_MAX_ITEMS))) } catch {}
}

function notificationShortToken(value) {
  const text = String(value || '')
  if (text.length <= 22) return text
  return `${text.slice(0, 10)}…${text.slice(-8)}`
}

function notificationRecordFromRow(kind, row, unread = true) {
  if (!row) return null
  const id = String(row?.id ?? '')
  if (!id) return null
  const presentation = globalAlertPresentation(kind, row)
  const signal = presentation.signal
  const severity = String(row?.severity || 'high').toLowerCase()
  const status = String(row?.status || 'open').toLowerCase()
  const timestamp = globalAlertTimestamp(kind, row)
  const fingerprint = globalAlertFingerprint(kind, row)
  const signalValues = signal?.values || (kind === 'incident'
    ? `${Number(row?.event_count || 0)} Event${Number(row?.event_count || 0) === 1 ? '' : 's'} · ${Number(row?.family_count || 0)} ${Number(row?.family_count || 0) === 1 ? 'family' : 'families'}`
    : 'Open intelligence for details')
  return {
    key: `${kind}:${id}`,
    fingerprint,
    kind,
    id,
    title: presentation.title,
    displayName: presentation.displayName,
    chain: presentation.chain,
    token: presentation.token,
    severity,
    status,
    timestamp,
    signalValues,
    signalChange: signal?.change || '',
    signalClass: signal?.className || '',
    unread: Boolean(unread),
    storedAt: Date.now(),
  }
}

function notificationAdd(kind, row, unread = true) {
  const item = notificationRecordFromRow(kind, row, unread)
  if (!item) return
  const existingIndex = notificationItems.findIndex(entry => entry?.key === item.key)
  if (existingIndex >= 0) {
    const existing = notificationItems[existingIndex]
    const changed = existing?.fingerprint !== item.fingerprint
    notificationItems.splice(existingIndex, 1)
    item.unread = changed ? Boolean(unread) : Boolean(existing?.unread)
  }
  notificationItems.unshift(item)
  notificationItems = notificationItems.slice(0, NOTIFICATION_MAX_ITEMS)
  notificationStorageSave()
  renderNotificationHub()
}

function notificationBaselineSync() {
  if (notificationItems.length || notificationClearedAt > 0) return
  const baseline = [
    ...globalAlertIncidentRows.map(row => ({ kind: 'incident', row })),
    ...globalAlertEventRows.map(row => ({ kind: 'event', row })),
  ]
    .filter(item => globalAlertSeverityLevel(item.row?.severity) > 0)
    .filter(item => String(item.row?.status || 'open').toLowerCase() !== 'resolved')
    .sort((a,b) => globalAlertTimestamp(b.kind,b.row) - globalAlertTimestamp(a.kind,a.row))
    .slice(0, 20)
  for (const item of baseline.reverse()) notificationAdd(item.kind, item.row, false)
}

function notificationOpen(item) {
  if (!item) return
  const found = notificationItems.find(entry => entry?.key === item.key)
  if (found) found.unread = false
  notificationStorageSave()
  renderNotificationHub()
  const panel = document.getElementById('notification-panel')
  const bell = document.getElementById('notification-bell')
  if (panel) panel.dataset.open = 'false'
  bell?.setAttribute('aria-expanded', 'false')
  openGlobalIntelligenceAlertDestination(item.kind, item.id)
}

function renderNotificationHub() {
  const badge = document.getElementById('notification-badge')
  const list = document.getElementById('notification-list')
  const meta = document.getElementById('notification-panel-meta')
  if (!badge || !list) return
  const unread = notificationItems.filter(item => item?.unread).length
  badge.textContent = unread > 99 ? '99+' : String(unread)
  badge.dataset.visible = unread > 0 ? 'true' : 'false'
  if (meta) meta.textContent = `${notificationItems.length} saved · ${unread} unread`
  if (!notificationItems.length) {
    list.innerHTML = '<div class="notification-empty">No notifications yet.<br>New High and Critical monitored intelligence will appear here.</div>'
    return
  }
  list.innerHTML = notificationItems.map((item, index) => {
    const kindLabel = item.kind === 'incident' ? 'Risk Incident' : 'Monitored Event'
    const time = item.timestamp ? formatUnixTime(item.timestamp) : 'Just now'
    return `<article class="notification-item" data-index="${index}" data-unread="${item.unread ? 'true' : 'false'}" tabindex="0" role="button">
      <div class="notification-item-top"><span class="notification-kind">${escapeHtml(kindLabel)}</span><span class="notification-severity ${escapeHtml(item.severity)}">${escapeHtml(String(item.severity || '').toUpperCase())}</span></div>
      <div class="notification-title">${escapeHtml(item.title || kindLabel)}</div>
      <div class="notification-asset"><strong>${escapeHtml(item.displayName || 'Contract')}</strong><span>${escapeHtml(item.chain || '')}</span></div>
      <div class="notification-contract">${escapeHtml(notificationShortToken(item.token))}</div>
      <div class="notification-signal"><strong>${escapeHtml(item.signalValues || '')}</strong>${item.signalChange ? `<span class="${escapeHtml(item.signalClass || '')}">${escapeHtml(item.signalChange)}</span>` : ''}</div>
      <div class="notification-time">${escapeHtml(time)}</div>
    </article>`
  }).join('')
  list.querySelectorAll('.notification-item').forEach(node => {
    const open = () => notificationOpen(notificationItems[Number(node.dataset.index)])
    node.addEventListener('click', open)
    node.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open() } })
  })
}

function setupNotificationHub() {
  notificationStorageLoad()
  renderNotificationHub()
  const hub = document.getElementById('notification-hub')
  const bell = document.getElementById('notification-bell')
  const panel = document.getElementById('notification-panel')
  bell?.addEventListener('click', event => {
    event.stopPropagation()
    const open = panel?.dataset.open !== 'true'
    if (panel) panel.dataset.open = open ? 'true' : 'false'
    bell.setAttribute('aria-expanded', open ? 'true' : 'false')
  })
  panel?.addEventListener('click', event => event.stopPropagation())
  document.addEventListener('click', event => {
    if (!hub?.contains(event.target)) {
      if (panel) panel.dataset.open = 'false'
      bell?.setAttribute('aria-expanded', 'false')
    }
  })
  document.getElementById('notification-mark-read')?.addEventListener('click', () => {
    notificationItems.forEach(item => { item.unread = false })
    notificationStorageSave(); renderNotificationHub()
  })
  document.getElementById('notification-clear')?.addEventListener('click', () => {
    notificationItems = []
    notificationClearedAt = Date.now()
    try { localStorage.setItem(NOTIFICATION_CLEAR_KEY, String(notificationClearedAt)) } catch {}
    notificationStorageSave(); renderNotificationHub()
  })
}

function globalAlertTitle(kind, row) {
  if (kind === 'incident') return `Risk Incident #${row?.id ?? '—'}`
  return `${globalDetailEventType(row?.type)} · Event #${row?.id ?? '—'}`
}

function globalAlertPresentation(kind, row) {
  const primaryEvent = kind === 'incident' ? monitoredIncidentPrimaryEvent(row) : row
  const identityRow = primaryEvent || row
  const signal = monitoredListSignalData(primaryEvent || row)
  const assetName = monitoredListAssetName(identityRow)
  const symbol = String(identityRow?.symbol || row?.symbol || '').trim()
  const displayName = symbol && assetName !== symbol ? `${assetName} (${symbol})` : assetName
  const chain = chainDisplayName(identityRow?.chain || row?.chain)
  const token = String(identityRow?.token || row?.token || '').trim()
  const eventType = primaryEvent ? globalDetailEventType(primaryEvent?.type) : ''
  const title = kind === 'incident'
    ? `Risk Incident #${row?.id ?? '—'}`
    : globalDetailEventType(row?.type)
  return { primaryEvent, signal, displayName, chain, token, eventType, title }
}

function openGlobalIntelligenceAlertDestination(kind, id) {
  const targetView = kind === 'incident' ? 'incidents' : 'events'
  setDashboardView(targetView)
  history.replaceState(null, '', `#${targetView}`)
  requestAnimationFrame(() => openMonitoredDetail(kind, id))
}

function showGlobalIntelligenceAlert(kind, row) {
  const stack = document.getElementById('intelligence-alert-stack')
  if (!stack || !row) return
  const severity = String(row?.severity || 'high').toLowerCase()
  const severityClass = severity === 'critical' ? 'is-critical' : 'is-high'
  const status = String(row?.status || 'open').toLowerCase()
  const time = formatUnixTime(globalAlertTimestamp(kind, row))
  const id = String(row?.id ?? '')
  const presentation = globalAlertPresentation(kind, row)
  const signal = presentation.signal
  const signalLabel = signal?.label || (kind === 'incident' ? 'Primary signal' : 'Intelligence')
  const signalType = presentation.eventType || signal?.typeLabel || (kind === 'incident' ? 'Correlated intelligence' : globalDetailEventType(row?.type))
  const signalValues = signal?.values || (kind === 'incident'
    ? `${Number(row?.event_count || 0)} Event${Number(row?.event_count || 0) === 1 ? '' : 's'} · ${Number(row?.family_count || 0)} signal ${Number(row?.family_count || 0) === 1 ? 'family' : 'families'}`
    : 'Open intelligence for details')
  const signalChange = signal?.change || ''
  const signalClass = signal?.className || ''

  notificationAdd(kind, row, true)

  const card = document.createElement('section')
  const alertTypeKey = String(presentation.primaryEvent?.type || row?.type || '').toLowerCase().replaceAll('_', '-').replace(/[^a-z0-9-]/g, '')
  card.className = `intelligence-alert ${severityClass}${alertTypeKey ? ` type-${alertTypeKey}` : ''}`
  card.dataset.kind = kind
  card.dataset.id = id
  card.setAttribute('role', 'button')
  card.setAttribute('tabindex', '0')
  card.setAttribute('aria-label', `Open ${kind === 'incident' ? 'Risk Incident' : 'Event'} ${id}`)
  card.innerHTML = `
    <span class="intelligence-alert-accent" aria-hidden="true"></span>
    <div class="intelligence-alert-head">
      <div class="intelligence-alert-kicker">${kind === 'incident' ? 'Risk Incident' : 'Monitored Event'}</div>
      <div class="intelligence-alert-badges">
        <span class="intelligence-alert-badge intelligence-alert-severity">${escapeHtml(severity.toUpperCase())}</span>
        <span class="intelligence-alert-badge intelligence-alert-status">${escapeHtml(String(globalDetailEnum('status', lifecycleDisplayStatus(row) || status)).toUpperCase())}</span>
      </div>
      <button type="button" class="intelligence-alert-close" aria-label="Dismiss">×</button>
    </div>
    <div class="intelligence-alert-body">
      <h3 class="intelligence-alert-title">${escapeHtml(presentation.title)}</h3>
      <div class="intelligence-alert-asset"><strong>${escapeHtml(presentation.displayName)}</strong><span>${escapeHtml(presentation.chain)}</span></div>
      <div class="intelligence-alert-contract" title="${escapeHtml(presentation.token)}">${escapeHtml(presentation.token || 'Contract address unavailable')}</div>
      <div class="intelligence-alert-signal">
        <div class="intelligence-alert-signal-top"><span class="intelligence-alert-signal-label">${escapeHtml(signalLabel)}</span><span class="intelligence-alert-signal-type">${escapeHtml(signalType)}</span></div>
        <div class="intelligence-alert-signal-values"><strong>${escapeHtml(signalValues)}</strong>${signalChange ? `<span class="${escapeHtml(signalClass)}">${escapeHtml(signalChange)}</span>` : ''}</div>
      </div>
      <div class="intelligence-alert-foot"><span>${escapeHtml(time || 'Just now')}</span><span class="intelligence-alert-open">Open intelligence →</span></div>
    </div>`

  stack.prepend(card)
  while (stack.children.length > 3) stack.lastElementChild?.remove()
  const timeout = window.setTimeout(() => card.remove(), severity === 'critical' ? 25000 : 18000)
  const openDestination = () => {
    window.clearTimeout(timeout)
    openGlobalIntelligenceAlertDestination(kind, id)
    card.remove()
  }
  card.addEventListener('click', (event) => {
    if (event.target.closest('.intelligence-alert-close')) return
    openDestination()
  })
  card.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    openDestination()
  })
  card.querySelector('.intelligence-alert-close')?.addEventListener('click', (event) => {
    event.stopPropagation()
    window.clearTimeout(timeout)
    card.remove()
  })
}

async function pollGlobalIntelligenceAlerts() {
  if (!clerk.user || document.visibilityState !== 'visible') return
  try {
    const token = await clerk.session?.getToken()
    if (!token) return
    const [eventResponse, incidentResponse] = await Promise.all([
      fetch(`${CONTROL_PLANE}/v1/monitoring/events?limit=20`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }),
      fetch(`${CONTROL_PLANE}/v1/monitoring/incidents?limit=20`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }),
    ])
    const [eventBody, incidentBody] = await Promise.all([
      eventResponse.json().catch(() => null),
      incidentResponse.json().catch(() => null),
    ])
    if (!eventResponse.ok || !incidentResponse.ok || !Array.isArray(eventBody?.data) || !Array.isArray(incidentBody?.data)) return

    globalAlertEventRows = eventBody.data
    globalAlertIncidentRows = incidentBody.data
    if (currentView === 'incidents' && lastIncidentsBody) renderIncidentsData(lastIncidentsBody, lastIncidentsAsset)
    const changedIncidents = rememberGlobalAlertRows('incident', globalAlertIncidentRows)
    const changedEvents = rememberGlobalAlertRows('event', globalAlertEventRows)

    if (!globalAlertBaselineReady) {
      globalAlertBaselineReady = true
      notificationBaselineSync()
      return
    }

    const newIncidentIds = new Set(changedIncidents.map(row => String(row?.id ?? '')).filter(Boolean))
    const candidates = [
      ...changedIncidents.map(row => ({ kind: 'incident', row })),
      ...changedEvents
        .filter(row => !row?.incident?.id || !newIncidentIds.has(String(row.incident.id)))
        .map(row => ({ kind: 'event', row })),
    ]
      .filter(item => globalAlertSeverityLevel(item.row?.severity) > 0)
      .filter(item => String(item.row?.status || 'open').toLowerCase() !== 'resolved')
      .sort((a, b) => {
        const timeDiff = globalAlertTimestamp(b.kind, b.row) - globalAlertTimestamp(a.kind, a.row)
        if (timeDiff) return timeDiff
        return globalAlertSeverityLevel(b.row?.severity) - globalAlertSeverityLevel(a.row?.severity)
      })

    candidates.slice(0, 3).reverse().forEach(item => showGlobalIntelligenceAlert(item.kind, item.row))
    if (candidates.length) {
      qaLog('ELOFID GLOBAL MONITORED ALERT QA', { candidates: candidates.length, shown: Math.min(candidates.length, 3) })
      if (currentView === 'monitoring' && !monitoringInteractionLocked()) {
        void refreshMonitoringData({ manual: false, reason: 'new_intelligence' })
        scheduleMonitoringAutoRefresh()
      }
    }
  } catch (error) {
    qaWarn('Elofid monitored intelligence alert poll failed', error)
  }
}

function startGlobalIntelligenceAlertWatch() {
  if (globalAlertPollTimer) return
  void pollGlobalIntelligenceAlerts()
  globalAlertPollTimer = window.setInterval(() => { void pollGlobalIntelligenceAlerts() }, GLOBAL_ALERT_POLL_MS)
}


function monitoredListAssetName(row) {
  return String(row?.token_name || row?.tokenName || row?.asset_name || row?.assetName || row?.name || row?.symbol || 'Contract').trim()
}

function monitoredListSignalData(event) {
  if (!event) return null
  const primary = globalDetailMetricDefinition(event?.type)
  if (primary) {
    const before = event?.baseline?.[primary.key]
    const after = event?.current?.[primary.key]
    const fallback = event?.change?.[primary.change]
    const observed = globalDetailObservedChange(before, after, {
      fallbackChange: fallback,
      scoreMetric: String(event?.type || '') === 'score_deterioration',
    })
    const beforeFinite = globalDetailFinite(before)
    const afterFinite = globalDetailFinite(after)
    return {
      label: primary.label,
      typeLabel: globalDetailEventType(event?.type),
      values: beforeFinite != null || afterFinite != null
        ? `${primary.format(before)} → ${primary.format(after)}`
        : formatPrimaryChange(event?.primary_change, event?.change),
      change: observed.text,
      className: observed.className,
    }
  }

  return {
    label: globalDetailEventType(event?.type),
    typeLabel: globalDetailEventType(event?.type),
    values: formatPrimaryChange(event?.primary_change, event?.change),
    change: '',
    className: '',
  }
}

function monitoredIncidentPrimaryEvent(incident) {
  const incidentId = String(incident?.id ?? '')
  if (!incidentId) return null
  const embedded = [
    ...(Array.isArray(incident?.events) ? incident.events : []),
    ...(Array.isArray(incident?.supporting_events) ? incident.supporting_events : []),
  ].filter(Boolean)
  if (embedded.length) return embedded[0]

  const sources = [
    Array.isArray(globalAlertEventRows) ? globalAlertEventRows : [],
    Array.isArray(lastEventsBody?.data) ? lastEventsBody.data : [],
  ]
  const supportingIds = new Set((Array.isArray(incident?.supporting_event_ids) ? incident.supporting_event_ids : []).map((value) => String(value)))
  const matches = sources.flat().filter((event) => {
    if (String(event?.incident?.id ?? '') === incidentId) return true
    if (supportingIds.size && supportingIds.has(String(event?.id ?? ''))) return true
    return false
  })
  matches.sort((a, b) => Number(b?.detected_at || 0) - Number(a?.detected_at || 0))
  return matches[0] || null
}

function monitoredListIdentityHtml(row, title) {
  const name = monitoredListAssetName(row)
  const symbol = String(row?.symbol || '').trim()
  const chain = chainDisplayName(row?.chain)
  const token = String(row?.token || '').trim()
  const displayName = symbol && name !== symbol ? `${name} (${symbol})` : name
  return `<div class="monitored-row-identity">
    <div class="event-type">${escapeHtml(title)}</div>
    <div class="monitored-row-asset"><strong>${escapeHtml(displayName)}</strong><span>${escapeHtml(chain)}</span></div>
    <div class="monitored-row-contract" title="${escapeHtml(token)}">${escapeHtml(token || 'Contract address unavailable')}</div>
  </div>`
}

function monitoredListSignalHtml(signal, footer = '') {
  if (!signal) return `<div class="monitored-row-signal"><div class="monitored-row-signal-label">Intelligence</div><div class="monitored-row-signal-values"><strong>Signal details available on open</strong></div>${footer ? `<div class="monitored-row-signal-foot">${escapeHtml(footer)}</div>` : ''}</div>`
  return `<div class="monitored-row-signal">
    <div class="monitored-row-signal-label">${escapeHtml(signal.label || 'Primary signal')}</div>
    <div class="monitored-row-signal-values"><strong>${escapeHtml(signal.values || '—')}</strong>${signal.change ? `<span class="${escapeHtml(signal.className || '')}">${escapeHtml(signal.change)}</span>` : ''}</div>
    ${footer ? `<div class="monitored-row-signal-foot">${escapeHtml(footer)}</div>` : ''}
  </div>`
}

function renderEventsData(body, asset = null) {
  const list = document.getElementById('events-list')
  const meta = document.getElementById('events-meta')
  if (!list || !meta) return

  const sourceRows = Array.isArray(body?.data) ? body.data : []
  populateEventFilters(sourceRows)
  const search = String(document.getElementById('events-search')?.value || '').trim().toLowerCase()
  const typeFilter = String(document.getElementById('events-type-filter')?.value || 'all')
  const severityFilter = String(document.getElementById('events-severity-filter')?.value || 'all')
  const rows = sourceRows.filter((event) => {
    if (typeFilter !== 'all' && String(event?.type || '') !== typeFilter) return false
    if (severityFilter !== 'all' && String(event?.severity || '').toLowerCase() !== severityFilter) return false
    if (!search) return true
    const hay = `${event?.chain || ''} ${event?.token || ''} ${event?.symbol || ''} ${event?.name || ''} ${event?.token_name || ''} ${event?.type || ''} ${event?.id || ''} ${event?.severity || ''} ${event?.status || ''} ${event?.incident?.id || ''} ${asset?.chain || ''} ${asset?.token || ''}`.toLowerCase()
    return hay.includes(search)
  })
  const historyDays = Number(body?.plan?.history_days)
  const historyLabel = Number.isFinite(historyDays) && historyDays > 0
    ? `${historyDays}-day history`
    : 'Plan history'
  const allAssets = !asset
  const scopeLabel = allAssets
    ? 'All monitored assets'
    : `${chainDisplayName(asset.chain)} · ${asset.token}`
  const hasMore = Boolean(body?.pagination?.next_cursor)
  const filtersActive = Boolean(search || typeFilter !== 'all' || severityFilter !== 'all')
  const countLabel = `${rows.length}${hasMore && !filtersActive ? '+' : ''} Event${rows.length === 1 && !(hasMore && !filtersActive) ? '' : 's'}`

  meta.textContent = `${scopeLabel} · ${historyLabel} · ${countLabel}`

  if (!rows.length) {
    list.innerHTML = filtersActive
      ? '<div class="events-empty"><strong>No matching Events on this page.</strong><br>Adjust the filters or search terms.</div>'
      : `
        <div class="events-empty">
          <strong>No Events detected in this history window${allAssets ? ' across your monitored assets' : ''}.</strong><br>
          Only real Events detected by Elofid will appear here.
        </div>
      `
    return
  }

  list.innerHTML = rows.map((event) => {
    const severity = String(event?.severity || 'unknown').toLowerCase()
    const status = String(event?.status || 'unknown')
    const incident = event?.incident?.id ? `Incident #${event.incident.id}` : 'No linked Incident'
    const signal = monitoredListSignalData(event)
    const footer = `Event #${event?.id ?? '—'} · ${incident}`
    return `
      <article class="event-row monitored-detail-trigger monitored-intelligence-row" data-monitored-detail-kind="event" data-monitored-detail-id="${escapeHtml(event?.id ?? '')}" role="button" tabindex="0" aria-label="View Event #${escapeHtml(event?.id ?? '—')} intelligence details">
        ${monitoredListIdentityHtml(event, globalDetailEventType(event?.type))}
        ${monitoredListSignalHtml(signal, footer)}
        <div class="event-badge severity-${escapeHtml(severity)}">${escapeHtml(globalDetailEnum('severity', severity))}</div>
        <div class="event-badge event-status">${escapeHtml(globalDetailEnum('status', lifecycleDisplayStatus(event) || status))}</div>
        <div class="event-time">${escapeHtml(formatUnixTime(event?.detected_at))}</div>
      </article>
    `
  }).join('')
}

function renderEventsError(message) {
  const list = document.getElementById('events-list')
  const meta = document.getElementById('events-meta')
  if (meta) meta.textContent = 'Event data unavailable'
  if (list) list.innerHTML = `<div class="events-error">${escapeHtml(message)}</div>`
}

async function loadMonitoredAssetEvents(token, asset) {
  const path = `${CONTROL_PLANE}/v1/monitoring/assets/${encodeURIComponent(asset.chain)}/${encodeURIComponent(asset.token)}/events?limit=25`
  const response = await fetch(path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  })

  const body = await response.json().catch(() => null)

  qaLog('ELOFID MONITORED EVENTS QA', {
    scope: 'single_asset',
    chain: asset.chain,
    token: asset.token,
    status: response.status,
    body
  })

  if (!response.ok || !Array.isArray(body?.data)) {
    const message = body?.detail || body?.message || body?.error || `HTTP ${response.status}`
    throw new Error(`Unable to load monitored Events: ${message}`)
  }

  lastEventsBody = body
  lastEventsAsset = asset
  renderEventsData(body, asset)
  return body
}

async function loadAllMonitoredEvents(token) {
  const path = `${CONTROL_PLANE}/v1/monitoring/events?limit=50`
  const response = await fetch(path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  })

  const body = await response.json().catch(() => null)

  qaLog('ELOFID ALL MONITORED EVENTS QA', {
    scope: body?.scope || 'all_monitored_assets',
    status: response.status,
    events: Array.isArray(body?.data) ? body.data.length : null,
    unread: Number.isFinite(Number(body?.unread_count)) ? Number(body.unread_count) : null,
    next_cursor: body?.pagination?.next_cursor || null,
    body
  })

  if (!response.ok || !Array.isArray(body?.data)) {
    const message = body?.detail || body?.message || body?.error || `HTTP ${response.status}`
    throw new Error(`Unable to load all monitored Events: ${message}`)
  }

  lastEventsBody = body
  lastEventsAsset = null
  renderEventsData(body, null)
  return body
}

async function refreshEventsView(token, preferredIndex = -1) {
  eventAssets = monitoredEventAssets()
  const preferred = Number(preferredIndex)
  selectedEventAssetIndex = preferred === -1
    ? -1
    : eventAssets.length
      ? Math.min(Math.max(0, Number.isSafeInteger(preferred) ? preferred : 0), eventAssets.length - 1)
      : -1
  renderEventAssetPicker()

  const list = document.getElementById('events-list')
  const meta = document.getElementById('events-meta')

  if (!eventAssets.length) {
    if (meta) meta.textContent = 'No active monitored assets'
    if (list) {
      list.innerHTML = '<div class="events-empty">Add an asset to My Monitoring before browsing its Events.</div>'
    }
    return
  }

  if (meta) meta.textContent = 'Loading Events…'
  if (list) list.innerHTML = '<div class="events-empty">Loading Events…</div>'

  if (selectedEventAssetIndex === -1) {
    await loadAllMonitoredEvents(token)
    return
  }
  await loadMonitoredAssetEvents(token, eventAssets[selectedEventAssetIndex])
}

function renderIncidentAssetPicker() {
  const select = document.getElementById('incidents-asset-select')
  if (!select) return

  if (!incidentAssets.length) {
    select.disabled = true
    select.innerHTML = '<option>No active monitored assets</option>'
    return
  }

  select.disabled = false
  const allOption = `<option value="-1"${selectedIncidentAssetIndex === -1 ? ' selected' : ''}>All monitored assets</option>`
  const assetOptions = incidentAssets.map((asset, index) => {
    const label = `${chainDisplayName(asset.chain)} · ${asset.token}`
    return `<option value="${index}"${index === selectedIncidentAssetIndex ? ' selected' : ''}>${escapeHtml(label)}</option>`
  }).join('')
  select.innerHTML = allOption + assetOptions
}

function renderIncidentsData(body, asset = null) {
  const list = document.getElementById('incidents-list')
  const meta = document.getElementById('incidents-meta')
  if (!list || !meta) return

  const sourceRows = Array.isArray(body?.data) ? body.data : []
  populateIncidentFilters(sourceRows)
  const search = String(document.getElementById('incidents-search')?.value || '').trim().toLowerCase()
  const severityFilter = String(document.getElementById('incidents-severity-filter')?.value || 'all')
  const statusFilter = String(document.getElementById('incidents-status-filter')?.value || 'all')
  const rows = sourceRows.filter((incident) => {
    if (severityFilter !== 'all' && String(incident?.severity || '').toLowerCase() !== severityFilter) return false
    if (statusFilter !== 'all' && String(incident?.status || '').toLowerCase() !== statusFilter) return false
    if (!search) return true
    const hay = `${incident?.chain || ''} ${incident?.token || ''} ${incident?.symbol || ''} ${incident?.name || ''} ${incident?.token_name || ''} ${incident?.id || ''} ${incident?.severity || ''} ${incident?.status || ''} ${incident?.confidence || ''} ${asset?.chain || ''} ${asset?.token || ''}`.toLowerCase()
    return hay.includes(search)
  })
  const historyDays = Number(body?.plan?.history_days)
  const historyLabel = Number.isFinite(historyDays) && historyDays > 0
    ? `${historyDays}-day history`
    : 'Plan history'
  const allAssets = !asset
  const scopeLabel = allAssets
    ? 'All monitored assets'
    : `${chainDisplayName(asset.chain)} · ${asset.token}`
  const hasMore = Boolean(body?.pagination?.next_cursor)
  const filtersActive = Boolean(search || severityFilter !== 'all' || statusFilter !== 'all')
  const countLabel = `${rows.length}${hasMore && !filtersActive ? '+' : ''} Incident${rows.length === 1 && !(hasMore && !filtersActive) ? '' : 's'}`

  meta.textContent = `${scopeLabel} · ${historyLabel} · ${countLabel}`

  if (!rows.length) {
    list.innerHTML = filtersActive
      ? '<div class="events-empty"><strong>No matching Risk Incidents on this page.</strong><br>Adjust the filters or search terms.</div>'
      : `
        <div class="events-empty">
          <strong>No Risk Incidents detected in this history window${allAssets ? ' across your monitored assets' : ''}.</strong><br>
          Only correlated Incidents detected by Elofid will appear here.
        </div>
      `
    return
  }

  list.innerHTML = rows.map((incident) => {
    const severity = String(incident?.severity || 'unknown').toLowerCase()
    const status = String(incident?.status || 'unknown')
    const confidence = String(incident?.confidence || 'unknown')
    const eventCount = Number.isFinite(Number(incident?.event_count)) ? Number(incident.event_count) : 0
    const familyCount = Number.isFinite(Number(incident?.family_count)) ? Number(incident.family_count) : 0
    const when = incident?.last_event_at || incident?.detected_at
    const primaryEvent = monitoredIncidentPrimaryEvent(incident)
    const signal = monitoredListSignalData(primaryEvent)
    if (signal && primaryEvent?.type) signal.label = `Primary signal · ${globalDetailEventType(primaryEvent.type)}`
    const footer = `${eventCount} Event${eventCount === 1 ? '' : 's'} · ${familyCount} ${familyCount === 1 ? 'family' : 'families'} · ${globalDetailT('confidenceSuffix', { value: globalDetailEnum('confidence', confidence) })}`
    return `
      <article class="event-row monitored-detail-trigger monitored-intelligence-row" data-monitored-detail-kind="incident" data-monitored-detail-id="${escapeHtml(incident?.id ?? '')}" role="button" tabindex="0" aria-label="View Risk Incident #${escapeHtml(incident?.id ?? '—')} intelligence details">
        ${monitoredListIdentityHtml(incident, `Risk Incident #${incident?.id ?? '—'}`)}
        ${monitoredListSignalHtml(signal, footer)}
        <div class="event-badge severity-${escapeHtml(severity)}">${escapeHtml(globalDetailEnum('severity', severity))}</div>
        <div class="event-badge event-status">${escapeHtml(globalDetailEnum('status', lifecycleDisplayStatus(incident) || status))}</div>
        <div class="event-time">${escapeHtml(formatUnixTime(when))}</div>
      </article>
    `
  }).join('')
}

function renderIncidentsError(message) {
  const list = document.getElementById('incidents-list')
  const meta = document.getElementById('incidents-meta')
  if (meta) meta.textContent = 'Incident data unavailable'
  if (list) list.innerHTML = `<div class="events-error">${escapeHtml(message)}</div>`
}

async function loadMonitoredAssetIncidents(token, asset) {
  const path = `${CONTROL_PLANE}/v1/monitoring/assets/${encodeURIComponent(asset.chain)}/${encodeURIComponent(asset.token)}/incidents?limit=25`
  const response = await fetch(path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  })

  const body = await response.json().catch(() => null)

  qaLog('ELOFID MONITORED INCIDENTS QA', {
    scope: 'single_asset',
    chain: asset.chain,
    token: asset.token,
    status: response.status,
    body
  })

  if (!response.ok || !Array.isArray(body?.data)) {
    const message = body?.detail || body?.message || body?.error || `HTTP ${response.status}`
    throw new Error(`Unable to load monitored Incidents: ${message}`)
  }

  lastIncidentsBody = body
  lastIncidentsAsset = asset
  renderIncidentsData(body, asset)
  return body
}

async function loadAllMonitoredIncidents(token) {
  const path = `${CONTROL_PLANE}/v1/monitoring/incidents?limit=50`
  const response = await fetch(path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  })

  const body = await response.json().catch(() => null)

  qaLog('ELOFID ALL MONITORED INCIDENTS QA', {
    scope: body?.scope || 'all_monitored_assets',
    status: response.status,
    incidents: Array.isArray(body?.data) ? body.data.length : null,
    unread: Number.isFinite(Number(body?.unread_count)) ? Number(body.unread_count) : null,
    next_cursor: body?.pagination?.next_cursor || null,
    body
  })

  if (!response.ok || !Array.isArray(body?.data)) {
    const message = body?.detail || body?.message || body?.error || `HTTP ${response.status}`
    throw new Error(`Unable to load all monitored Incidents: ${message}`)
  }

  lastIncidentsBody = body
  lastIncidentsAsset = null
  renderIncidentsData(body, null)
  return body
}

async function refreshIncidentsView(token, preferredIndex = -1) {
  incidentAssets = monitoredEventAssets()
  const preferred = Number(preferredIndex)
  selectedIncidentAssetIndex = preferred === -1
    ? -1
    : incidentAssets.length
      ? Math.min(Math.max(0, Number.isSafeInteger(preferred) ? preferred : 0), incidentAssets.length - 1)
      : -1
  renderIncidentAssetPicker()

  const list = document.getElementById('incidents-list')
  const meta = document.getElementById('incidents-meta')

  if (!incidentAssets.length) {
    if (meta) meta.textContent = 'No active monitored assets'
    if (list) {
      list.innerHTML = '<div class="events-empty">Add an asset to My Monitoring before browsing tenant-scoped Incidents.</div>'
    }
    return
  }

  if (meta) meta.textContent = 'Loading Risk Incidents…'
  if (list) list.innerHTML = '<div class="events-empty">Loading Incidents…</div>'

  if (selectedIncidentAssetIndex === -1) {
    await loadAllMonitoredIncidents(token)
    return
  }
  await loadMonitoredAssetIncidents(token, incidentAssets[selectedIncidentAssetIndex])
}

const MONITORING_FAVORITES_STORAGE_PREFIX = 'elofid-monitoring-favorites-v1'

function monitoringFavoriteTokenKey(tokenAddress) {
  const token = String(tokenAddress || '').trim()
  return /^0x[0-9a-f]+$/i.test(token) ? token.toLowerCase() : token
}

function monitoringFavoriteAssetKey(chain, tokenAddress) {
  return `${String(chain || '').trim().toLowerCase()}:${monitoringFavoriteTokenKey(tokenAddress)}`
}

function monitoringFavoritesStorageKey() {
  const owner = String(clerk?.user?.id || workspace?.tenant_id || workspace?.id || 'local')
  return `${MONITORING_FAVORITES_STORAGE_PREFIX}:${owner}`
}

function readMonitoringFavorites() {
  try {
    const raw = localStorage.getItem(monitoringFavoritesStorageKey())
    const parsed = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(parsed) ? parsed.map((value) => String(value)) : [])
  } catch {
    return new Set()
  }
}

function writeMonitoringFavorites(favorites) {
  try {
    localStorage.setItem(monitoringFavoritesStorageKey(), JSON.stringify([...favorites]))
  } catch (error) {
    console.warn('Elofid favorites persistence unavailable', error)
  }
}

function isMonitoringFavorite(chain, tokenAddress) {
  return readMonitoringFavorites().has(monitoringFavoriteAssetKey(chain, tokenAddress))
}

function setMonitoringFavorite(chain, tokenAddress, enabled) {
  const favorites = readMonitoringFavorites()
  const key = monitoringFavoriteAssetKey(chain, tokenAddress)
  if (enabled) favorites.add(key)
  else favorites.delete(key)
  writeMonitoringFavorites(favorites)
  return enabled
}

function monitoringMaybeParsedJson(value) {
  if (typeof value !== 'string') return value
  const text = value.trim()
  if (!text || text.length > 120000 || !['{','['].includes(text[0])) return value
  try { return JSON.parse(text) } catch { return value }
}

function monitoringDeepObjects(root, maxDepth = 7) {
  const out = []
  const queue = [{ value: root, depth: 0, hint: '' }]
  const seen = new WeakSet()
  while (queue.length) {
    const current = queue.shift()
    let value = monitoringMaybeParsedJson(current.value)
    if (!value || typeof value !== 'object') continue
    if (seen.has(value)) continue
    seen.add(value)
    out.push({ value, hint: current.hint })
    if (current.depth >= maxDepth) continue
    if (Array.isArray(value)) {
      value.slice(0, 80).forEach((child, index) => queue.push({ value: child, depth: current.depth + 1, hint: `${current.hint}[${index}]` }))
      continue
    }
    Object.entries(value).slice(0, 120).forEach(([key, child]) => {
      const parsed = monitoringMaybeParsedJson(child)
      if (parsed && typeof parsed === 'object') queue.push({ value: parsed, depth: current.depth + 1, hint: `${current.hint}.${key}` })
    })
  }
  return out
}

function monitoringAssetNameFromSources(chain, tokenAddress, payload = null, asset = null) {
  const wantedChain = String(chain || '').toLowerCase()
  const wantedToken = monitoringFavoriteTokenKey(tokenAddress)
  const cacheKey = `${wantedChain}:${wantedToken}`
  const remember = (value) => {
    const text = String(value || '').trim()
    if (!text || text.length > 80) return ''
    monitoringAssetNameCache.set(cacheKey, text)
    return text
  }

  const preferredKeys = ['token_name','tokenName','asset_name','assetName','name','token_symbol','tokenSymbol','symbol']
  const roots = [asset, payload?.latest, payload, payload?.previous].filter(Boolean)
  for (const root of roots) {
    for (const { value: obj, hint } of monitoringDeepObjects(root)) {
      if (!obj || Array.isArray(obj)) continue
      for (const key of preferredKeys) {
        const text = remember(obj?.[key])
        if (text) return text
      }
      const context = String(hint || '').toLowerCase()
      const hasTokenContext = /(token|asset|metadata|scanner|contract|mint)/.test(context) || ['symbol','token','token_address','tokenAddress','address','mint'].some((key) => obj?.[key] != null)
      if (hasTokenContext) {
        const text = remember(obj?.name)
        if (text) return text
      }
    }
  }

  const eventRows = [
    ...globalPreviewItems,
    ...globalFeedEvents,
    ...globalFeedIncidents,
    ...(Array.isArray(lastEventsBody?.data) ? lastEventsBody.data : []),
    ...(Array.isArray(lastIncidentsBody?.data) ? lastIncidentsBody.data : []),
  ]
  const matched = eventRows.find((row) => {
    const rowChain = String(row?.chain || '').toLowerCase()
    const rowToken = monitoringFavoriteTokenKey(row?.token)
    return rowChain === wantedChain && rowToken === wantedToken
  })
  const matchedName = remember(matched?.token_name || matched?.asset_name || matched?.token_symbol || matched?.symbol || matched?.name)
  if (matchedName) return matchedName
  return monitoringAssetNameCache.get(cacheKey) || ''
}

function monitoringFavoriteButtonHtml(chain, tokenAddress) {
  const favorite = isMonitoringFavorite(chain, tokenAddress)
  const label = favorite ? 'Remove from Favorites' : 'Add to Favorites'
  return `<button type="button" class="monitoring-favorite-toggle${favorite ? ' is-favorite' : ''}" data-chain="${escapeHtml(chain)}" data-token="${escapeHtml(tokenAddress)}" aria-pressed="${favorite ? 'true' : 'false'}" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 3.35 2.63 5.33 5.88.85-4.25 4.14 1 5.86L12 16.76l-5.26 2.77 1-5.86-4.25-4.14 5.88-.85L12 3.35Z"/></svg></button>`
}

function monitoringSnapshotKey(chain, tokenAddress) {
  return `${String(chain || '').toLowerCase()}:${String(tokenAddress || '')}`
}

function compactUsd(value) {
  if (value === null || value === undefined || value === '') return '—'
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: Math.abs(n) >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: Math.abs(n) >= 1000 ? 1 : 2,
  }).format(n)
}

function monitoringScore(value) {
  if (value === null || value === undefined || value === '') return '—'
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return Number.isInteger(n) ? String(n) : n.toFixed(1)
}

function monitoringRelativeTime(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n <= 0) return '—'
  const diff = Math.max(0, Math.floor(Date.now() / 1000) - n)
  if (diff < 60) return globalDetailT('monitoringJustNow')
  if (diff < 3600) return globalDetailT('monitoringMinutesAgo', { value: Math.floor(diff / 60) })
  if (diff < 86400) return globalDetailT('monitoringHoursAgo', { value: Math.floor(diff / 3600) })
  if (diff < 604800) return globalDetailT('monitoringDaysAgo', { value: Math.floor(diff / 86400) })
  return dashboardDate(n, { year: 'numeric', month: 'short', day: 'numeric' }) || '—'
}

function monitoringFinite(value) {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function monitoringExitDepthRaw(row) {
  if (!row || typeof row !== 'object') return null
  const keys = ['exit_depth_display_usd','exitDepthDisplayUsd','exit_depth_routable_10_usd','exitDepthRoutable10Usd','exit_depth_10_usd','production_exit_depth_10_usd','productionExitDepth10Usd','exitDepth10Usd','exit_depth_10_min_usd','exitDepth10MinUsd']
  for (const { value: obj } of monitoringDeepObjects(row)) {
    if (!obj || Array.isArray(obj)) continue
    for (const key of keys) {
      const n = monitoringFinite(obj?.[key])
      if (n != null && n >= 0) return n
    }
  }
  return null
}

function monitoringArchivedRows(payload) {
  if (!payload || typeof payload !== 'object') return []
  const collections = [payload.history, payload.archive, payload.scans, payload.snapshots]
  return collections.flatMap((value) => Array.isArray(value) ? value : [])
}

function monitoringLatestArchivedExitDepth(payload) {
  const rows = [payload?.latest, payload?.previous, ...monitoringArchivedRows(payload)].filter(Boolean)
  for (const row of rows) {
    const value = monitoringExitDepthRaw(row)
    if (value != null) return { value, row }
  }
  const nested = monitoringExitDepthRaw(payload)
  return nested == null ? null : { value: nested, row: payload }
}

function monitoringSnapshotChanged(latest, previous, exitDepthCurrent, exitDepthPrevious) {
  if (!latest || !previous) return false
  const pairs = [
    [monitoringFinite(latest.score), monitoringFinite(previous.score)],
    [monitoringFinite(latest.liquidity_usd), monitoringFinite(previous.liquidity_usd)],
    [monitoringFinite(exitDepthCurrent), monitoringFinite(exitDepthPrevious)],
  ]
  return pairs.some(([current, prior]) => current != null && prior != null && Math.abs(current - prior) > 1e-9)
}

function monitoringDelta(currentValue, previousValue, { scoreMetric = false, previousFormatter = null } = {}) {
  const current = monitoringFinite(currentValue)
  const previous = monitoringFinite(previousValue)
  if (current == null || previous == null) return null

  if (scoreMetric) {
    const delta = current - previous
    if (Math.abs(delta) < 1e-9) return { text: globalDetailT('noChange'), className: 'is-neutral' }
    const abs = Math.abs(delta)
    const amount = Number.isInteger(abs) ? String(abs) : abs.toFixed(1)
    return {
      text: `${delta > 0 ? '↑' : '↓'} ${amount} ${globalDetailT('points')}`,
      className: delta > 0 ? 'is-positive' : 'is-negative',
    }
  }

  const previousText = typeof previousFormatter === 'function' ? previousFormatter(previous) : null

  // Percent deltas from a zero baseline are intentionally omitted: an infinite/undefined
  // percentage would be misleading in the compact My Monitoring row. The previous numeric
  // value is still useful, so keep it available to the renderer.
  if (Math.abs(previous) < 1e-9) {
    return previousText ? { text: '—', previousText, className: 'is-neutral' } : null
  }
  const pct = ((current - previous) / Math.abs(previous)) * 100
  if (!Number.isFinite(pct)) return previousText ? { text: '—', previousText, className: 'is-neutral' } : null
  if (Math.abs(pct) < 0.05) return { text: '0.0%', previousText, className: 'is-neutral' }
  return {
    text: `${pct > 0 ? '↑' : '↓'} ${Math.abs(pct).toFixed(1)}%`,
    previousText,
    className: pct > 0 ? 'is-positive' : 'is-negative',
  }
}

function monitoringTrendSvg(delta) {
  if (!delta) return ''
  const neutral = delta.className === 'is-neutral'
  const positive = delta.className === 'is-positive'
  const y1 = neutral ? 6 : positive ? 9 : 3
  const y2 = neutral ? 6 : positive ? 3 : 9
  return `<svg class="monitoring-trend" viewBox="0 0 22 12" aria-hidden="true" focusable="false"><line x1="3" y1="${y1}" x2="19" y2="${y2}"></line><circle cx="3" cy="${y1}" r="1.6"></circle><circle cx="19" cy="${y2}" r="1.6"></circle></svg>`
}

function monitoringMetric(label, value, delta = null, extraClass = '') {
  const previousHtml = delta?.previousText
    ? `<span class="monitoring-previous-value">Prev ${escapeHtml(delta.previousText)}</span>`
    : ''
  const deltaHtml = delta
    ? `<small class="monitoring-delta ${escapeHtml(delta.className)}" title="${escapeHtml(globalDetailT('monitoringPreviousScan'))}">${previousHtml}<span class="monitoring-delta-value">${escapeHtml(delta.text)}</span>${monitoringTrendSvg(delta)}</small>`
    : `<small class="monitoring-delta is-neutral monitoring-delta-empty" aria-hidden="true"><span>—</span></small>`
  return `<div class="monitoring-metric ${escapeHtml(extraClass)}"><span class="monitoring-metric-label">${escapeHtml(label)}</span><strong class="monitoring-metric-value">${escapeHtml(value)}</strong>${deltaHtml}</div>`
}

function renderMonitoringSnapshot(target, payload) {
  if (!target) return
  const latest = payload?.latest || null
  const previous = payload?.previous || null
  const row = target.closest('.monitoring-asset')
  const hydratedAssetName = monitoringAssetNameFromSources(target.dataset.chain, target.dataset.token, payload)
  const assetNameEl = row?.querySelector('[data-monitoring-asset-name]')
  if (assetNameEl && hydratedAssetName) assetNameEl.textContent = hydratedAssetName
  if (!latest) {
    target.dataset.state = 'empty'
    if (row) {
      row.dataset.snapshotState = 'waiting'
      row.dataset.lastScan = ''
      row.dataset.score = ''
      row.dataset.liquidity = ''
      row.dataset.exitDepth = ''
      row.dataset.changed = 'false'
    }
    const lastScanSlot = row?.querySelector('[data-monitoring-last-scan]')
    if (lastScanSlot) lastScanSlot.innerHTML = `<div class="monitoring-metric monitoring-metric-time is-empty"><span class="monitoring-metric-label">${escapeHtml(globalDetailT('monitoringLastScan'))}</span><strong class="monitoring-metric-value">—</strong></div>`
    target.innerHTML = `<span class="monitoring-snapshot-note">${escapeHtml(globalDetailT('monitoringWaitingFirstScan'))}</span>`
    applyMonitoringSnapshotFilters()
    return
  }

  const scoreRaw = monitoringFinite(latest.score)
  const liquidityRaw = monitoringFinite(latest.liquidity_usd)
  const score = monitoringScore(latest.score)
  const liquidity = compactUsd(latest.liquidity_usd)

  // API v0.17: latest is exactly the last evaluated observation. When it returned no market data
  // (status no_data), values stay empty. An older scan is never shown in its place.
  const latestNoData = String(latest.status || '').toLowerCase() === 'no_data'
  const latestExitDepth = monitoringExitDepthRaw(latest)
  const previousExitDepth = monitoringExitDepthRaw(previous)
  const archivedExitDepth = latestExitDepth == null && !latestNoData ? monitoringLatestArchivedExitDepth(payload) : null
  const exitDepthRaw = latestExitDepth ?? archivedExitDepth?.value ?? null
  const exitDepth = exitDepthRaw == null ? null : compactUsd(exitDepthRaw)
  const exitDepthIsArchivedFallback = latestExitDepth == null && exitDepthRaw != null

  const lastScanRaw = monitoringFinite(latest.scanned_at)
  const lastScan = monitoringRelativeTime(latest.scanned_at)
  const exactScan = dashboardDate(latest.scanned_at, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) || globalDetailT('monitoringScanTimeUnavailable')

  const scoreDelta = monitoringDelta(latest.score, previous?.score, { scoreMetric: true })
  const liquidityDelta = monitoringDelta(latest.liquidity_usd, previous?.liquidity_usd, { previousFormatter: compactUsd })
  const exitDepthDelta = exitDepthRaw == null || exitDepthIsArchivedFallback
    ? null
    : monitoringDelta(latestExitDepth, previousExitDepth, { previousFormatter: compactUsd })

  const archivedExitDepthNote = exitDepthIsArchivedFallback
    ? { text: 'Archived', className: 'is-neutral', previousText: null }
    : exitDepthDelta

  const changed = monitoringSnapshotChanged(latest, previous, latestExitDepth, previousExitDepth)

  if (row) {
    row.dataset.snapshotState = 'ready'
    row.dataset.lastScan = lastScanRaw == null ? '' : String(lastScanRaw)
    row.dataset.score = scoreRaw == null ? '' : String(scoreRaw)
    row.dataset.liquidity = liquidityRaw == null ? '' : String(liquidityRaw)
    row.dataset.exitDepth = exitDepthRaw == null ? '' : String(exitDepthRaw)
    row.dataset.changed = changed ? 'true' : 'false'
  }

  const lastScanSlot = row?.querySelector('[data-monitoring-last-scan]')
  if (lastScanSlot) {
    lastScanSlot.innerHTML = `<div class="monitoring-metric monitoring-metric-time" title="${escapeHtml(exactScan)}"><span class="monitoring-metric-label">${escapeHtml(globalDetailT('monitoringLastScan'))}</span><strong class="monitoring-metric-value">${escapeHtml(lastScan)}</strong></div>`
  }

  const metrics = [
    monitoringMetric(globalDetailT('monitoringScore'), score, scoreDelta, 'monitoring-metric-score'),
    monitoringMetric(globalDetailT('monitoringLiquidity'), liquidity, liquidityDelta, 'monitoring-metric-liquidity'),
    exitDepth == null ? '' : monitoringMetric(globalDetailT('monitoringExitDepth'), exitDepth, archivedExitDepthNote, 'monitoring-metric-exit-depth'),
  ].filter(Boolean)

  if (latestNoData) metrics.push(`<span class="monitoring-snapshot-note">${escapeHtml(globalDetailT('monitoringLastObservationNoData'))}</span>`)

  target.dataset.state = 'ready'
  target.classList.toggle('has-exit-depth', exitDepth != null)
  target.innerHTML = metrics.join('')
  applyMonitoringSnapshotFilters()
}

function renderMonitoringSnapshotError(target) {
  if (!target) return
  target.dataset.state = 'error'
  const row = target.closest('.monitoring-asset')
  if (row) {
    row.dataset.snapshotState = 'error'
    const lastScanSlot = row.querySelector('[data-monitoring-last-scan]')
    if (lastScanSlot) lastScanSlot.innerHTML = `<div class="monitoring-metric monitoring-metric-time is-empty"><span class="monitoring-metric-label">${escapeHtml(globalDetailT('monitoringLastScan'))}</span><strong class="monitoring-metric-value">—</strong></div>`
  }
  target.innerHTML = `<span class="monitoring-snapshot-note">${escapeHtml(globalDetailT('monitoringSnapshotUnavailable'))}</span>`
  applyMonitoringSnapshotFilters()
}

async function loadMonitoringSnapshot(sessionToken, target) {
  const chain = String(target?.dataset?.chain || '')
  const tokenAddress = String(target?.dataset?.token || '')
  if (!chain || !tokenAddress) return

  const key = monitoringSnapshotKey(chain, tokenAddress)
  const cached = monitoringSnapshotCache.get(key)
  if (cached && Date.now() - cached.fetchedAt < MONITORING_SNAPSHOT_CACHE_MS) {
    renderMonitoringSnapshot(target, cached.data)
    return
  }

  target.dataset.state = 'loading'
  target.innerHTML = `<span class="monitoring-snapshot-note">${escapeHtml(globalDetailT('monitoringLoadingSnapshot'))}</span>`

  try {
    const response = await fetch(
      `${CONTROL_PLANE}/v1/monitoring/assets/${encodeURIComponent(chain)}/${encodeURIComponent(tokenAddress)}/snapshot`,
      {
        method: 'GET',
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          Accept: 'application/json'
        }
      }
    )
    const body = await response.json().catch(() => null)
    if (!response.ok || !body?.data) {
      throw new Error(body?.error || `HTTP ${response.status}`)
    }
    monitoringSnapshotCache.set(key, { fetchedAt: Date.now(), data: body.data })
    renderMonitoringSnapshot(target, body.data)
  } catch (error) {
    console.error('Elofid monitoring snapshot load failed', error)
    renderMonitoringSnapshotError(target)
  }
}

function setupMonitoringSnapshotObserver() {
  monitoringSnapshotObserver?.disconnect()
  monitoringSnapshotObserver = null

  const targets = [...document.querySelectorAll('.monitoring-intelligence[data-chain][data-token]')]
  if (!targets.length) return

  if (!('IntersectionObserver' in window)) {
    void clerk.session?.getToken().then((sessionToken) => {
      if (!sessionToken) return
      return Promise.all(targets.slice(0, 30).map((target) => loadMonitoringSnapshot(sessionToken, target)))
    }).catch((error) => console.error('Elofid monitoring snapshot bootstrap failed', error))
    return
  }

  monitoringSnapshotObserver = new IntersectionObserver(async (entries, observer) => {
    const visible = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target)
    if (!visible.length) return
    visible.forEach((target) => observer.unobserve(target))

    try {
      const sessionToken = await clerk.session?.getToken()
      if (!sessionToken) throw new Error('Authentication session is unavailable.')
      await Promise.all(visible.map((target) => loadMonitoringSnapshot(sessionToken, target)))
    } catch (error) {
      console.error('Elofid monitoring snapshot hydration failed', error)
      visible.forEach(renderMonitoringSnapshotError)
    }
  }, { rootMargin: '220px 0px' })

  targets.forEach((target) => monitoringSnapshotObserver.observe(target))
}

function applyMonitoringSnapshotFilters() {
  const list = document.getElementById('monitoring-list')
  if (!list) return

  const lastScanFilter = String(document.getElementById('monitoring-last-scan-filter')?.value || 'any')
  const intelligenceFilter = String(document.getElementById('monitoring-intelligence-filter')?.value || 'all')
  const sortMode = String(document.getElementById('monitoring-sort')?.value || 'default')
  const now = Math.floor(Date.now() / 1000)

  const matchesLastScan = (row) => {
    const state = String(row.dataset.snapshotState || '')
    const scannedAt = monitoringFinite(row.dataset.lastScan)
    if (lastScanFilter === 'any') return true
    if (lastScanFilter === 'waiting') return state === 'waiting'
    if (state !== 'ready' || scannedAt == null) return state === 'idle' || state === 'loading'
    const age = Math.max(0, now - scannedAt)
    if (lastScanFilter === '1h') return age <= 3600
    if (lastScanFilter === '24h') return age <= 86400
    if (lastScanFilter === '7d') return age <= 604800
    if (lastScanFilter === 'older') return age > 604800
    return true
  }

  const matchesIntelligence = (row) => {
    const state = String(row.dataset.snapshotState || '')
    if (intelligenceFilter === 'all') return true
    if (intelligenceFilter === 'waiting') return state === 'waiting'
    if (state !== 'ready') return state === 'idle' || state === 'loading'
    if (intelligenceFilter === 'exit-depth') return monitoringFinite(row.dataset.exitDepth) != null
    if (intelligenceFilter === 'changed') return row.dataset.changed === 'true'
    return true
  }

  document.querySelectorAll('.monitoring-watchlist').forEach((section) => {
    const container = section.querySelector('.monitoring-assets')
    if (!container) return
    const rows = [...container.querySelectorAll('.monitoring-asset')]

    rows.forEach((row) => {
      row.hidden = !(matchesLastScan(row) && matchesIntelligence(row))
    })

    const sortNumber = (row, key, fallback) => {
      const value = monitoringFinite(row.dataset[key])
      return value == null ? fallback : value
    }

    let sorted = rows
    if (sortMode === 'latest-scan') sorted = [...rows].sort((a,b) => sortNumber(b,'lastScan',-1) - sortNumber(a,'lastScan',-1))
    if (sortMode === 'oldest-scan') sorted = [...rows].sort((a,b) => sortNumber(a,'lastScan',Number.MAX_SAFE_INTEGER) - sortNumber(b,'lastScan',Number.MAX_SAFE_INTEGER))
    if (sortMode === 'score-desc') sorted = [...rows].sort((a,b) => sortNumber(b,'score',-1) - sortNumber(a,'score',-1))
    if (sortMode === 'liquidity-desc') sorted = [...rows].sort((a,b) => sortNumber(b,'liquidity',-1) - sortNumber(a,'liquidity',-1))
    if (['latest-scan','oldest-scan','score-desc','liquidity-desc'].includes(sortMode)) {
      sorted.forEach((row) => container.appendChild(row))
    }

    const visibleCount = rows.filter((row) => !row.hidden).length
    const meta = section.querySelector('.monitoring-watchlist-meta')
    if (meta) {
      const total = Number(meta.dataset.total || rows.length)
      meta.textContent = visibleCount === total
        ? `${total} active monitored asset${total === 1 ? '' : 's'}`
        : `${visibleCount} of ${total} shown`
    }
    section.hidden = visibleCount === 0
  })
}

function monitoringInteractionLocked() {
  const bulkBackdrop = document.getElementById('cx-bulk-asset-backdrop')
  const singleBackdrop = document.getElementById('cx-asset-backdrop')
  if (bulkBackdrop?.dataset.open === 'true' || singleBackdrop?.dataset.open === 'true') return true

  const active = document.activeElement
  if (!(active instanceof Element)) return false
  const editable = active.matches('input, textarea, select, [contenteditable="true"]')
  if (!editable) return false
  return Boolean(active.closest('#monitoring-view') || active.closest('.cx-asset-backdrop'))
}

function setMonitoringRefreshButtonState(state = 'idle') {
  const button = document.getElementById('monitoring-refresh')
  if (!button) return
  const label = button.querySelector('[data-monitoring-refresh-label]')
  button.dataset.state = state
  button.disabled = state === 'loading'
  if (label) label.textContent = state === 'loading' ? 'Refreshing…' : state === 'updated' ? 'Updated' : 'Refresh'
}

async function refreshMonitoringData({ manual = false, reason = 'manual' } = {}) {
  if (monitoringRefreshInFlight || currentView !== 'monitoring') return false
  if (!manual && document.visibilityState !== 'visible') return false
  if (monitoringInteractionLocked()) return false

  monitoringRefreshInFlight = true
  if (monitoringRefreshLabelTimer) {
    window.clearTimeout(monitoringRefreshLabelTimer)
    monitoringRefreshLabelTimer = null
  }
  setMonitoringRefreshButtonState('loading')

  try {
    const sessionToken = await clerk.session?.getToken()
    if (!sessionToken) throw new Error('Authentication session is unavailable.')

    await loadWatchlists(sessionToken)
    if (monitoringInteractionLocked()) return false

    // A Monitoring refresh must bypass the previous snapshot cache so a newly
    // archived scan becomes visible immediately. Asset-name cache is preserved
    // intentionally so a transient metadata omission never regresses to
    // "Name unavailable" after a safe table rerender.
    monitoringSnapshotCache.clear()

    const refreshed = await refreshMonitoringView(sessionToken, { abortIfInteraction: true })
    if (!refreshed) return false

    setMonitoringRefreshButtonState('updated')
    monitoringRefreshLabelTimer = window.setTimeout(() => {
      setMonitoringRefreshButtonState('idle')
      monitoringRefreshLabelTimer = null
    }, 1400)
    qaLog('ELOFID MONITORING REFRESH QA', { reason, manual, refreshed: true })
    return true
  } catch (error) {
    console.error('Elofid My Monitoring refresh failed', error)
    setMonitoringRefreshButtonState('idle')
    if (manual) renderMonitoringError(error?.message || 'Unable to refresh My Monitoring.')
    return false
  } finally {
    monitoringRefreshInFlight = false
  }
}

function scheduleMonitoringAutoRefresh() {
  if (monitoringAutoRefreshTimer) window.clearTimeout(monitoringAutoRefreshTimer)
  monitoringAutoRefreshTimer = window.setTimeout(async () => {
    monitoringAutoRefreshTimer = null
    if (currentView === 'monitoring' && document.visibilityState === 'visible' && !monitoringInteractionLocked()) {
      await refreshMonitoringData({ manual: false, reason: 'idle_timer' })
    }
    scheduleMonitoringAutoRefresh()
  }, MONITORING_AUTO_REFRESH_MS)
}

function monitoringTableFiltersHtml() {
  const lastValue = String(document.getElementById('monitoring-last-scan-filter')?.value || 'any')
  const intelValue = String(document.getElementById('monitoring-intelligence-filter')?.value || 'all')
  return `
    <div class="monitoring-table-filters" aria-label="Monitoring table filters">
      <span class="monitoring-table-filter-label">Filters</span>
      <select id="monitoring-last-scan-filter" aria-label="Filter by last scan">
        <option value="any"${lastValue === 'any' ? ' selected' : ''}>Any last scan</option>
        <option value="1h"${lastValue === '1h' ? ' selected' : ''}>Last hour</option>
        <option value="24h"${lastValue === '24h' ? ' selected' : ''}>Last 24 hours</option>
        <option value="7d"${lastValue === '7d' ? ' selected' : ''}>Last 7 days</option>
        <option value="older"${lastValue === 'older' ? ' selected' : ''}>Older than 7 days</option>
        <option value="waiting"${lastValue === 'waiting' ? ' selected' : ''}>Waiting for first scan</option>
      </select>
      <select id="monitoring-intelligence-filter" aria-label="Filter by monitoring intelligence">
        <option value="all"${intelValue === 'all' ? ' selected' : ''}>All intelligence</option>
        <option value="exit-depth"${intelValue === 'exit-depth' ? ' selected' : ''}>Has Exit Depth</option>
        <option value="changed"${intelValue === 'changed' ? ' selected' : ''}>Changed since previous scan</option>
        <option value="waiting"${intelValue === 'waiting' ? ' selected' : ''}>Waiting for first scan</option>
      </select>
      <button type="button" class="monitoring-refresh" id="monitoring-refresh" aria-label="Refresh monitoring data" title="Refresh monitoring data">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20 11a8 8 0 1 0-2.34 5.66" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M20 5v6h-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span data-monitoring-refresh-label>Refresh</span>
      </button>
    </div>
  `
}

function bindMonitoringInlineFilters() {
  for (const id of ['monitoring-last-scan-filter','monitoring-intelligence-filter']) {
    const select = document.getElementById(id)
    if (!select || select.dataset.bound === 'true') continue
    select.dataset.bound = 'true'
    select.addEventListener('input', applyMonitoringSnapshotFilters)
    select.addEventListener('change', applyMonitoringSnapshotFilters)
  }
}

function renderMonitoringView() {
  const list = document.getElementById('monitoring-list')
  if (!list) return

  populateMonitoringFilters()

  if (!watchlistDetails.length) {
    monitoringSnapshotObserver?.disconnect()
    monitoringSnapshotObserver = null
    list.innerHTML = `
      <div class="monitoring-empty">
        No monitored assets yet. Add a contract to create your Elofid monitoring state.
      </div>
    `
    return
  }

  const search = String(document.getElementById('monitoring-search')?.value || '').trim().toLowerCase()
  const favoritesFilter = String(document.getElementById('monitoring-watchlist-filter')?.value || 'all')
  const chainFilter = String(document.getElementById('monitoring-chain-filter')?.value || 'all')
  const sortMode = String(document.getElementById('monitoring-sort')?.value || 'default')

  const sections = watchlistDetails.map((watchlist, watchlistIndex) => {
    if (watchlist?.status !== 'active') return ''
    const assets = Array.isArray(watchlist?.assets) ? watchlist.assets : []
    let activeAssets = assets.filter((asset) => {
      if (asset?.status !== 'active') return false
      if (favoritesFilter === 'favorites' && !isMonitoringFavorite(asset?.chain, asset?.token)) return false
      if (chainFilter !== 'all' && String(asset?.chain || '') !== chainFilter) return false
      if (!search) return true
      const assetName = monitoringAssetNameFromSources(asset?.chain, asset?.token, null, asset)
      const hay = `${assetName} ${asset?.chain || ''} ${chainDisplayName(asset?.chain)} ${asset?.token || ''}`.toLowerCase()
      return hay.includes(search)
    })
    if (sortMode === 'chain') activeAssets = [...activeAssets].sort((a, b) => chainDisplayName(a?.chain).localeCompare(chainDisplayName(b?.chain)) || String(a?.token || '').localeCompare(String(b?.token || '')))
    if (sortMode === 'address') activeAssets = [...activeAssets].sort((a, b) => String(a?.token || '').localeCompare(String(b?.token || '')))
    if (!activeAssets.length) return ''
    const rows = activeAssets.map((asset) => `
          <div class="monitoring-asset" data-snapshot-state="idle" data-last-scan="" data-score="" data-liquidity="" data-exit-depth="" data-changed="false">
            ${monitoringFavoriteButtonHtml(asset.chain, asset.token)}
            <div class="monitoring-asset-identity">
              <div class="monitoring-chain">${escapeHtml(chainDisplayName(asset.chain))}</div>
              <div class="monitoring-status">${escapeHtml(asset.status || 'active')}</div>
            </div>
            <div class="monitoring-contract">
              <div class="monitoring-token-name" data-monitoring-asset-name>${escapeHtml(monitoringAssetNameFromSources(asset.chain, asset.token, null, asset) || 'Name unavailable')}</div>
              <button type="button" class="monitoring-token monitoring-token-copy" data-token="${escapeHtml(asset.token)}" aria-label="Copy contract address ${escapeHtml(asset.token)}" title="Click to copy contract address">${escapeHtml(asset.token)}</button>
            </div>
            <div class="monitoring-last-scan-slot" data-monitoring-last-scan>
              <div class="monitoring-metric monitoring-metric-time is-empty"><span class="monitoring-metric-label">${escapeHtml(globalDetailT('monitoringLastScan'))}</span><strong class="monitoring-metric-value">—</strong></div>
            </div>
            <div
              class="monitoring-intelligence"
              data-chain="${escapeHtml(asset.chain)}"
              data-token="${escapeHtml(asset.token)}"
              data-state="idle"
            ><span class="monitoring-snapshot-note">Current snapshot</span></div>
            <div class="monitoring-action">
              <button
                type="button"
                class="monitoring-remove-trigger"
                data-watchlist-id="${escapeHtml(watchlist?.id)}"
                data-chain="${escapeHtml(asset.chain)}"
                data-token="${escapeHtml(asset.token)}"
                aria-label="Remove ${escapeHtml(asset.token)} from monitoring"
                title="Remove from monitoring"
              >⋯</button>
            </div>
          </div>
        `).join('')


    return `
      <section class="monitoring-watchlist">
        <div class="monitoring-watchlist-head">
          <div>
            <div class="monitoring-watchlist-title">${escapeHtml(watchlist?.name || 'My Monitoring')}</div>
            <div class="monitoring-watchlist-meta" data-total="${activeAssets.length}">${activeAssets.length} active monitored asset${activeAssets.length === 1 ? '' : 's'}</div>
          </div>
          <div class="monitoring-watchlist-head-right">
            ${watchlistIndex === 0 ? monitoringTableFiltersHtml() : ''}
            <div class="monitoring-status">${escapeHtml(watchlist?.status || 'active')}</div>
          </div>
        </div>
        <div class="monitoring-assets">${rows}</div>
      </section>
    `
  }).filter(Boolean)

  list.innerHTML = sections.length
    ? sections.join('')
    : '<div class="monitoring-empty"><strong>No matching monitored assets.</strong><br>Adjust the filters or search terms.</div>'
  bindMonitoringInlineFilters()
  setupMonitoringSnapshotObserver()
}

function renderMonitoringError(message) {
  const list = document.getElementById('monitoring-list')
  if (!list) return
  monitoringSnapshotObserver?.disconnect()
  monitoringSnapshotObserver = null
  list.innerHTML = `<div class="monitoring-error">${escapeHtml(message)}</div>`
}


function refreshOverviewUi() {
  updateMonitoredAssetMetric(usageData?.monitored_assets?.used ?? monitoredEventAssets().length)
  renderOverviewGlobalPreview()
  renderOverviewPlanStatus()
  const incidentMeta = document.getElementById('overview-incidents-meta')
  const eventsMeta = document.getElementById('overview-events-meta')
  if (incidentMeta) incidentMeta.textContent = globalDetailT('overviewWorkspaceSummaryUnavailable')
  if (eventsMeta) eventsMeta.textContent = globalDetailT('overviewWorkspaceSummaryUnavailable')
  const viewEventsLink = document.getElementById('overview-my-monitoring-link')
  const manageMonitoringLink = document.getElementById('overview-manage-monitoring-link')
  if (viewEventsLink) viewEventsLink.textContent = `${globalDetailT('overviewViewEvents')} →`
  if (manageMonitoringLink) manageMonitoringLink.textContent = globalDetailT('overviewManageMonitoring')
  const activity = document.getElementById('overview-monitoring-activity')
  if (activity) {
    const title = activity.querySelector('strong')
    const body = activity.querySelector('span')
    if (title) title.textContent = globalDetailT('overviewActivityEmptyTitle')
    if (body) body.textContent = globalDetailT('overviewActivityEmptyBody')
  }
  const onboarding = document.getElementById('overview-onboarding')
  if (!onboarding) return

  // Never infer onboarding from transient default state while bootstrap requests
  // are still resolving. Show "Finish setup" only after both authoritative
  // Usage and API Keys reads have completed.
  if (!usageLoaded || !apiKeysLoaded) {
    onboarding.hidden = true
    return
  }

  const assetCount = Number(usageData?.monitored_assets?.used ?? monitoredEventAssets().length)
  const activeKeys = apiKeys.filter(k => String(k?.status || '') === 'active').length
  onboarding.hidden = assetCount > 0 && activeKeys > 0
}
function updateMonitoredAssetMetric(count) {
  const used = Number(usageData?.monitored_assets?.used ?? count ?? 0)
  const limit = usageData?.monitored_assets?.limit == null ? null : Number(usageData.monitored_assets.limit)
  const value = document.getElementById('overview-monitored-value')
  const meta = document.getElementById('overview-monitored-meta')
  if (value) value.textContent = limit == null ? formatCompactNumber(used) : `${formatCompactNumber(used)} / ${formatCompactNumber(limit)}`
  if (meta) meta.textContent = `${formatCompactNumber(used)} active monitored asset${used === 1 ? '' : 's'}`
}

function updateWebhookMetric(body) {
  const value = document.getElementById('webhook-health-value')
  const meta = document.getElementById('webhook-health-meta')
  if (!value || !meta) return

  const rows = Array.isArray(body?.data) ? body.data : []
  const configured = Number.isFinite(Number(body?.usage?.configured))
    ? Math.max(0, Number(body.usage.configured))
    : rows.length
  const health = body?.health || null

  if (configured === 0) {
    value.textContent = '0'
    meta.textContent = 'No webhook endpoints configured'
    return
  }

  const attention = Math.max(0, Number(health?.attention || 0))
  const retrying = Math.max(0, Number(health?.retrying || 0))
  const healthy = Math.max(0, Number(health?.healthy || 0))
  const waiting = Math.max(0, Number(health?.waiting || 0))

  if (attention > 0) {
    value.textContent = 'Attention'
    meta.textContent = `${attention} endpoint${attention === 1 ? '' : 's'} with a dead latest production delivery`
  } else if (retrying > 0) {
    value.textContent = 'Retrying'
    meta.textContent = `${retrying} endpoint${retrying === 1 ? '' : 's'} with pending/retry production delivery work`
  } else if (healthy > 0 && healthy === configured) {
    value.textContent = 'Healthy'
    meta.textContent = `${configured} configured endpoint${configured === 1 ? '' : 's'} · latest production delivery succeeded`
  } else if (waiting > 0) {
    const active = rows.filter((item) => String(item?.status || '') === 'active').length
    value.textContent = active > 0
      ? `${active} ${globalDetailT(active === 1 ? 'overviewWebhookActiveShort' : 'overviewWebhookActiveShortPlural')}`
      : String(configured)
    meta.textContent = waiting === 1
      ? globalDetailT('overviewWebhookWaitingFirst')
      : globalDetailT('overviewWebhookWaitingFirstPlural', { count: waiting })
  } else {
    value.textContent = String(configured)
    meta.textContent = `${configured} configured endpoint${configured === 1 ? '' : 's'} · delivery state available in Webhooks`
  }
}

function renderWebhooksView() {
  const list = document.getElementById('webhooks-list')
  const planBox = document.getElementById('webhooks-plan')
  if (!list || !planBox) return

  const planCode = String(webhookPlan?.code || workspace?.plan_code || 'free').toUpperCase()
  const policy = String(webhookPlan?.webhook_policy || 'unknown')
  const max = webhookPlan?.max_webhooks == null ? null : Number(webhookPlan.max_webhooks)
  const configured = Number.isFinite(Number(webhookUsage?.configured))
    ? Math.max(0, Number(webhookUsage.configured))
    : webhooks.length

  const planValue = planBox.querySelector('.webhooks-plan-value')
  if (planValue) {
    planValue.textContent = Number.isFinite(max)
      ? `${planCode} · ${configured}/${max} destinations configured`
      : `${planCode} · ${configured} destinations configured`
  }

  const createButton = document.getElementById('webhook-create')
  if (createButton) {
    const limitReached = policy === 'hard_limit' && Number.isFinite(max) && configured >= max
    createButton.disabled = limitReached
    createButton.textContent = limitReached ? 'Limit reached' : 'Create webhook'
    createButton.title = limitReached ? `Plan ${planCode} allows ${max} Webhook Destination${max === 1 ? '' : 's'}.` : ''
  }

  if (!webhooks.length) {
    list.innerHTML = `
      <div class="webhooks-empty">
        <strong>No webhook endpoints configured.</strong><br>
        This is the real workspace state. Elofid does not create demo webhook destinations.
      </div>
    `
    return
  }

  list.innerHTML = webhooks.map((hook) => {
    const status = String(hook?.status || 'unknown')
    const healthState = String(hook?.delivery_health?.state || 'unknown')
    const pendingCount = Math.max(0, Number(hook?.delivery_health?.pending_count || 0))
    const latestStatus = hook?.delivery_health?.latest_status
    const latestAttemptAt = hook?.delivery_health?.latest_updated_at || hook?.delivery_health?.latest_created_at

    let lastDelivery = 'No production deliveries yet'
    if (hook?.last_delivery_at) {
      lastDelivery = `Last production delivery ${formatUnixTime(hook.last_delivery_at)}`
    } else if (latestAttemptAt && latestStatus) {
      lastDelivery = `Latest production attempt ${escapeHtml(String(latestStatus))} · ${formatUnixTime(latestAttemptAt)}`
    }

    const healthLabel = healthState === 'healthy'
      ? 'HEALTHY'
      : healthState === 'waiting'
        ? 'WAITING'
        : healthState === 'retrying'
          ? 'RETRYING'
          : healthState === 'attention'
            ? 'ATTENTION'
            : healthState.toUpperCase()
    const healthMeta = pendingCount > 0 ? ` · ${pendingCount} pending` : ''

    return `
      <article class="webhook-row">
        <div>
          <div class="webhook-name">${escapeHtml(hook?.name || 'Webhook')}</div>
          <div class="webhook-id">ID ${escapeHtml(hook?.id ?? '—')} · secret v${escapeHtml(hook?.secret_version ?? '—')}</div>
        </div>
        <div class="webhook-url">${escapeHtml(hook?.url || '—')}</div>
        <div class="webhook-status">
          <span class="webhook-pill ${status === 'revoked' ? 'is-revoked' : ''}">${escapeHtml(status.toUpperCase())}</span>
          <span class="webhook-pill health-${escapeHtml(healthState)}">${escapeHtml(healthLabel)}${escapeHtml(healthMeta)}</span>
        </div>
        <div class="webhook-time">${escapeHtml(lastDelivery)}</div>
        <div class="webhook-actions">
          ${status === 'active' && Number.isSafeInteger(Number(hook?.id))
            ? `<button type="button" class="webhook-action" data-webhook-action="test-delivery" data-webhook-id="${Number(hook.id)}">Send test</button>
               <button type="button" class="webhook-action" data-webhook-action="rotate-secret" data-webhook-id="${Number(hook.id)}">Rotate secret</button>
               <button type="button" class="webhook-action" data-webhook-action="revoke" data-webhook-id="${Number(hook.id)}">Revoke</button>`
            : ''}
        </div>
      </article>
    `
  }).join('')
}

function renderWebhooksError(message) {
  const list = document.getElementById('webhooks-list')
  const planValue = document.querySelector('#webhooks-plan .webhooks-plan-value')
  if (planValue) planValue.textContent = 'Unavailable'
  if (list) list.innerHTML = `<div class="webhooks-error">${escapeHtml(message)}</div>`
}

async function loadWebhooks(token) {
  const response = await fetch(`${CONTROL_PLANE}/v1/webhooks`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  })

  const body = await response.json().catch(() => null)

  qaLog('ELOFID WEBHOOK QA', {
    status: response.status,
    body
  })

  if (response.ok && Array.isArray(body?.data)) {
    webhooks = body.data
    webhookPlan = body?.plan || null
    webhookUsage = body?.usage || null
    updateWebhookMetric(body)
    if (currentView === 'webhooks') renderWebhooksView()

    qaLog('ELOFID WEBHOOK LIST VIEW QA', {
      status: response.status,
      configured: Number(body?.usage?.configured ?? body.data.length),
      active: body.data.filter((item) => item?.status === 'active').length,
      plan: body?.plan?.code || null,
      health: body?.health || null,
      endpoints: body.data.map((item) => ({
        id: item?.id ?? null,
        status: item?.status ?? null,
        delivery_health: item?.delivery_health?.state ?? null,
        last_delivery_at: item?.last_delivery_at ?? null,
        latest_delivery_status: item?.delivery_health?.latest_status ?? null,
        pending_count: item?.delivery_health?.pending_count ?? null
      }))
    })
  } else {
    const value = document.getElementById('webhook-health-value')
    const meta = document.getElementById('webhook-health-meta')
    if (value) value.textContent = '—'
    if (meta) meta.textContent = 'Webhook configuration unavailable'
    webhooks = []
    webhookPlan = null
    webhookUsage = null
    if (currentView === 'webhooks') {
      const message = body?.detail || body?.message || body?.error || `HTTP ${response.status}`
      renderWebhooksError(`Unable to load Webhooks: ${message}`)
    }
  }

  return {
    ok: response.ok,
    status: response.status,
    body
  }
}

async function createWebhookEndpoint(token, name, url) {
  const response = await fetch(`${CONTROL_PLANE}/v1/webhooks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, url })
  })

  const body = await response.json().catch(() => null)

  qaLog('ELOFID WEBHOOK CREATE QA', {
    status: response.status,
    id: body?.data?.id || null,
    webhook_status: body?.data?.status || null,
    configured: body?.usage?.configured ?? null,
    remaining: body?.usage?.remaining ?? null,
    plan: body?.plan?.code || null,
    body
  })

  if (!response.ok || !body?.data?.id) {
    const message = body?.detail || body?.message || body?.error || `HTTP ${response.status}`
    const error = new Error(`Unable to create webhook: ${message}`)
    error.status = response.status
    error.body = body
    throw error
  }

  return body
}

async function revokeWebhookEndpoint(token, webhookId) {
  const response = await fetch(`${CONTROL_PLANE}/v1/webhooks/${webhookId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  })

  const body = await response.json().catch(() => null)

  qaLog('ELOFID WEBHOOK REVOKE QA', {
    status: response.status,
    webhook_id: body?.revoked?.id ?? webhookId,
    webhook_status: body?.revoked?.status ?? null,
    revoked_at: body?.revoked?.revoked_at ?? null,
    body
  })

  if (!response.ok || body?.revoked?.status !== 'revoked') {
    const message = body?.detail || body?.message || body?.error || `HTTP ${response.status}`
    const error = new Error(`Unable to revoke webhook: ${message}`)
    error.status = response.status
    error.body = body
    throw error
  }

  return body
}

function injectWebhookRevokeUi() {
  const list = document.getElementById('webhooks-list')
  if (!list || list.dataset.webhookRevokeBound === 'true') return
  list.dataset.webhookRevokeBound = 'true'

  list.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-webhook-action="revoke"]')
    if (!button) return

    const webhookId = Number(button.dataset.webhookId)
    const hook = webhooks.find((item) => Number(item?.id) === webhookId)
    if (!hook || hook?.status !== 'active' || !Number.isSafeInteger(webhookId) || webhookId <= 0) return

    const confirmed = window.confirm(
      `Revoke webhook "${hook?.name || `#${webhookId}`}"?\n\nFuture deliveries to this endpoint will stop. Delivery audit history is preserved.`
    )
    if (!confirmed) return

    button.disabled = true
    const originalText = button.textContent
    button.textContent = 'Revoking…'

    try {
      const sessionToken = await clerk.session?.getToken()
      if (!sessionToken) throw new Error('Authentication session is unavailable.')

      await revokeWebhookEndpoint(sessionToken, webhookId)
      await loadWebhooks(sessionToken)
      renderWebhooksView()
    } catch (error) {
      console.error('Elofid webhook revoke failed', error)
      button.disabled = false
      button.textContent = 'Revoke failed'
      button.title = error?.message || 'Unable to revoke webhook.'
      window.setTimeout(() => {
        if (button.isConnected) button.textContent = originalText
      }, 2200)
    }
  })
}

async function sendWebhookTestDelivery(token, webhookId) {
  const response = await fetch(`${CONTROL_PLANE}/v1/webhooks/${webhookId}/test`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  })

  const body = await response.json().catch(() => null)

  qaLog('ELOFID WEBHOOK TEST DELIVERY QA', {
    status: response.status,
    webhook_id: webhookId,
    delivered: body?.delivered ?? null,
    target_http_status: body?.target_http_status ?? null,
    retryable: body?.retryable ?? null,
    delivery_id: body?.delivery_id ?? null,
    body
  })

  if (!response.ok || body?.delivered !== true) {
    const message = body?.diagnostic || body?.detail || body?.message || body?.error || `HTTP ${response.status}`
    const error = new Error(`Webhook test delivery failed: ${message}`)
    error.status = response.status
    error.body = body
    throw error
  }

  return body
}

function injectWebhookTestDeliveryUi() {
  const list = document.getElementById('webhooks-list')
  if (!list || list.dataset.webhookTestBound === 'true') return
  list.dataset.webhookTestBound = 'true'

  list.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-webhook-action="test-delivery"]')
    if (!button) return

    const webhookId = Number(button.dataset.webhookId)
    const hook = webhooks.find((item) => Number(item?.id) === webhookId)
    if (!hook || hook?.status !== 'active' || !Number.isSafeInteger(webhookId) || webhookId <= 0) return

    button.disabled = true
    const originalText = button.textContent
    button.textContent = 'Sending…'

    try {
      const sessionToken = await clerk.session?.getToken()
      if (!sessionToken) throw new Error('Authentication session is unavailable.')

      const body = await sendWebhookTestDelivery(sessionToken, webhookId)
      button.textContent = body?.target_http_status ? `Delivered ${body.target_http_status}` : 'Delivered'
      button.title = `Delivery ID: ${body?.delivery_id || 'unknown'}`
      window.setTimeout(() => {
        if (button.isConnected) {
          button.disabled = false
          button.textContent = originalText
        }
      }, 1800)
    } catch (error) {
      console.error('Elofid webhook test delivery failed', error)
      button.disabled = false
      button.textContent = 'Test failed'
      button.title = error?.message || 'Webhook test delivery failed.'
      window.setTimeout(() => {
        if (button.isConnected) button.textContent = originalText
      }, 2200)
    }
  })
}

async function rotateWebhookSigningSecret(token, webhookId) {
  const response = await fetch(`${CONTROL_PLANE}/v1/webhooks/${webhookId}/rotate-secret`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  })

  const body = await response.json().catch(() => null)
  const secret = typeof body?.signing_secret === 'string' ? body.signing_secret : ''

  qaLog('ELOFID WEBHOOK SECRET ROTATE QA', {
    status: response.status,
    webhook_id: body?.webhook?.id ?? webhookId,
    signing_version: body?.webhook?.signing_version ?? null,
    secret_version: body?.webhook?.secret_version ?? null,
    secret_received: secret.startsWith('whsec_') && secret.length > 10
  })

  if (!response.ok || !body?.webhook?.id || !secret) {
    const message = body?.detail || body?.message || body?.error || `HTTP ${response.status}`
    const error = new Error(`Unable to rotate webhook signing secret: ${message}`)
    error.status = response.status
    throw error
  }

  return body
}

function maskedWebhookSecret(secret) {
  const value = String(secret || '')
  const prefix = value.startsWith('whsec_') ? 'whsec_' : ''
  return `${prefix}${'•'.repeat(Math.max(24, value.length - prefix.length))}`
}

function injectWebhookSecretRotationUi() {
  const list = document.getElementById('webhooks-list')
  const backdrop = document.getElementById('cx-wh-secret-backdrop')
  const subtitle = document.getElementById('cx-wh-secret-subtitle')
  const note = document.getElementById('cx-wh-secret-note')
  const value = document.getElementById('cx-wh-secret-value')
  const warning = document.getElementById('cx-wh-secret-warning')
  const rotate = document.getElementById('cx-wh-secret-rotate')
  const copy = document.getElementById('cx-wh-secret-copy')
  const toggle = document.getElementById('cx-wh-secret-toggle')
  const confirm = document.getElementById('cx-wh-secret-confirm')
  const close = document.getElementById('cx-wh-secret-close')
  const cancel = document.getElementById('cx-wh-secret-cancel')

  if (!list || !backdrop || !subtitle || !note || !value || !warning || !rotate || !copy || !toggle || !confirm || !close || !cancel) return
  if (list.dataset.webhookSecretBound === 'true') return
  list.dataset.webhookSecretBound = 'true'

  let target = null
  let revealedSecret = null
  let secretVisible = true

  const renderSecret = () => {
    if (!revealedSecret) {
      value.textContent = ''
      return
    }
    value.textContent = secretVisible ? revealedSecret : maskedWebhookSecret(revealedSecret)
    toggle.textContent = secretVisible ? 'Hide' : 'Show'
  }

  const reset = () => {
    target = null
    revealedSecret = null
    secretVisible = true
    value.textContent = ''
    value.hidden = true
    warning.hidden = true
    note.dataset.state = ''
    note.textContent = 'The new signing secret is revealed once after rotation. Update your receiver before relying on future deliveries.'
    subtitle.textContent = 'A new secret version will sign future deliveries for this endpoint.'
    rotate.hidden = false
    rotate.disabled = false
    rotate.textContent = 'Rotate secret'
    copy.hidden = true
    copy.disabled = false
    copy.textContent = 'Copy secret'
    toggle.hidden = true
    confirm.hidden = true
    cancel.hidden = false
  }

  const closeModal = async () => {
    const changed = Boolean(revealedSecret)
    reset()
    backdrop.dataset.open = 'false'
    if (changed) {
      try {
        const sessionToken = await clerk.session?.getToken()
        if (sessionToken) await loadWebhooks(sessionToken)
      } catch (error) {
        console.error('Elofid Webhooks refresh after secret rotation failed', error)
      }
    }
  }

  const openModal = (hook) => {
    reset()
    target = hook
    subtitle.textContent = `${hook?.name || 'Webhook'} · ID #${hook?.id || '—'} · current secret v${hook?.secret_version ?? '—'}`
    backdrop.dataset.open = 'true'
  }

  list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-webhook-action="rotate-secret"]')
    if (!button) return

    const webhookId = Number(button.dataset.webhookId)
    const hook = webhooks.find((item) => Number(item?.id) === webhookId)
    if (!hook || hook?.status !== 'active' || !Number.isSafeInteger(webhookId) || webhookId <= 0) return
    openModal(hook)
  })

  rotate.addEventListener('click', async () => {
    const webhookId = Number(target?.id)
    if (!target || target?.status !== 'active' || !Number.isSafeInteger(webhookId) || webhookId <= 0) {
      note.dataset.state = 'error'
      note.textContent = 'This webhook is not available for secret rotation.'
      return
    }

    rotate.disabled = true
    rotate.textContent = 'Rotating…'
    note.dataset.state = ''
    note.textContent = 'Creating the next signing-secret version…'

    try {
      const sessionToken = await clerk.session?.getToken()
      if (!sessionToken) throw new Error('Authentication session is unavailable.')

      const body = await rotateWebhookSigningSecret(sessionToken, webhookId)
      revealedSecret = body.signing_secret
      secretVisible = true
      renderSecret()
      value.hidden = false
      warning.hidden = false
      note.dataset.state = 'success'
      note.textContent = `Webhook #${webhookId} rotated to secret v${body.webhook.secret_version}. Future deliveries use the new version.`
      rotate.hidden = true
      copy.hidden = false
      toggle.hidden = false
      confirm.hidden = false
      cancel.hidden = true

      await loadWebhooks(sessionToken)
      renderWebhooksView()
    } catch (error) {
      console.error('Elofid webhook signing-secret rotation failed', error)
      note.dataset.state = 'error'
      note.textContent = error?.message || 'Unable to rotate webhook signing secret.'
      rotate.disabled = false
      rotate.textContent = 'Rotate secret'
    }
  })

  copy.addEventListener('click', async () => {
    if (!revealedSecret) return
    try {
      await navigator.clipboard.writeText(revealedSecret)
      copy.textContent = 'Copied'
      window.setTimeout(() => {
        if (revealedSecret) copy.textContent = 'Copy secret'
      }, 1200)
    } catch {
      note.dataset.state = 'error'
      note.textContent = 'Clipboard access failed. Select the secret above and copy it manually.'
    }
  })

  toggle.addEventListener('click', () => {
    if (!revealedSecret) return
    secretVisible = !secretVisible
    renderSecret()
  })

  confirm.addEventListener('click', closeModal)
  close.addEventListener('click', closeModal)
  cancel.addEventListener('click', closeModal)
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) closeModal()
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && backdrop.dataset.open === 'true') closeModal()
  })
}

function injectWebhookCreateUi() {
  const openButton = document.getElementById('webhook-create')
  const backdrop = document.getElementById('cx-webhook-backdrop')
  const form = document.getElementById('cx-webhook-form')
  const nameInput = document.getElementById('cx-webhook-name')
  const urlInput = document.getElementById('cx-webhook-url')
  const note = document.getElementById('cx-webhook-note')
  const submit = document.getElementById('cx-webhook-submit')
  const close = document.getElementById('cx-webhook-close')
  const cancel = document.getElementById('cx-webhook-cancel')

  if (!openButton || !backdrop || !form || !nameInput || !urlInput || !note || !submit || !close || !cancel) return
  if (openButton.dataset.bound === 'true') return
  openButton.dataset.bound = 'true'

  const reset = () => {
    form.reset()
    note.dataset.state = ''
    note.textContent = 'Use a real public HTTPS endpoint. No test delivery is sent during creation.'
    submit.disabled = false
    submit.textContent = 'Create webhook'
  }

  const closeModal = () => {
    reset()
    backdrop.dataset.open = 'false'
  }

  const openModal = () => {
    if (openButton.disabled) return
    reset()
    backdrop.dataset.open = 'true'
    window.setTimeout(() => nameInput.focus(), 30)
  }

  openButton.addEventListener('click', openModal)
  close.addEventListener('click', closeModal)
  cancel.addEventListener('click', closeModal)
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) closeModal()
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && backdrop.dataset.open === 'true') closeModal()
  })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const name = nameInput.value.trim()
    const endpoint = urlInput.value.trim()

    if (!name || name.length > 80) {
      note.dataset.state = 'error'
      note.textContent = 'Enter a webhook name between 1 and 80 characters.'
      return
    }

    let parsedUrl
    try {
      parsedUrl = new URL(endpoint)
    } catch {
      note.dataset.state = 'error'
      note.textContent = 'Enter a valid absolute HTTPS URL.'
      return
    }

    if (parsedUrl.protocol !== 'https:') {
      note.dataset.state = 'error'
      note.textContent = 'Webhook endpoints must use HTTPS.'
      return
    }

    submit.disabled = true
    submit.textContent = 'Creating…'
    note.dataset.state = ''
    note.textContent = 'Registering the endpoint with Elofid…'

    try {
      const sessionToken = await clerk.session?.getToken()
      if (!sessionToken) throw new Error('Authentication session is unavailable.')

      const created = await createWebhookEndpoint(sessionToken, name, endpoint)
      await loadWebhooks(sessionToken)
      renderWebhooksView()

      note.dataset.state = 'success'
      note.textContent = `Webhook #${created.data.id} created. Secret rotation and signed test delivery are separate verified stages.`
      submit.textContent = 'Created'
      window.setTimeout(closeModal, 1100)
    } catch (error) {
      console.error('Elofid webhook creation failed', error)
      note.dataset.state = 'error'
      note.textContent = error?.message || 'Unable to create webhook.'
      submit.disabled = false
      submit.textContent = 'Create webhook'
    }
  })
}

function setMonitoredAssetStepState() {
  const row = monitoredAssetStep()
  if (!row) return

  const title = row.querySelector('strong')
  const detail = row.querySelector('div span')
  const badge = row.querySelector(':scope > span:last-child')
  const count = totalMonitoredAssets()

  if (title && count > 0) {
    title.textContent = 'Add monitored asset'
  }

  if (detail) {
    detail.textContent = count > 0
      ? `${count} active monitored asset${count === 1 ? '' : 's'}`
      : 'Chain + contract address'
  }

  if (badge) {
    badge.textContent = count > 0 ? 'ADD MORE' : 'READY'
    badge.className = 'next'
  }

  row.style.cursor = 'pointer'
  row.style.userSelect = 'none'
  row.setAttribute('role', 'button')
  row.setAttribute('tabindex', '0')
  row.setAttribute('aria-label', 'Add a monitored asset')

  updateMonitoredAssetMetric(count)
}

async function loadWatchlists(token) {
  const response = await fetch(`${CONTROL_PLANE}/v1/watchlists`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  })

  const body = await response.json().catch(() => null)

  qaLog('ELOFID WATCHLIST QA', {
    status: response.status,
    body
  })

  if (response.ok && Array.isArray(body?.data)) {
    watchlists = body.data
    setMonitoredAssetStepState()
  }

  return {
    ok: response.ok,
    status: response.status,
    body
  }
}


async function loadWatchlistDetail(token, watchlistId) {
  const response = await fetch(`${CONTROL_PLANE}/v1/watchlists/${watchlistId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  })

  const body = await response.json().catch(() => null)

  qaLog('ELOFID WATCHLIST DETAIL QA', {
    watchlistId,
    status: response.status,
    body
  })

  if (!response.ok || !body?.data) {
    const message =
      body?.detail ||
      body?.message ||
      body?.error ||
      `HTTP ${response.status}`
    throw new Error(`Unable to load My Monitoring: ${message}`)
  }

  return body.data
}

async function refreshMonitoringView(token, { abortIfInteraction = false } = {}) {
  const activeWatchlists = watchlists.filter((item) => item?.status === 'active' && item?.id)

  if (!activeWatchlists.length) {
    if (abortIfInteraction && monitoringInteractionLocked()) return false
    watchlistDetails = []
    renderMonitoringView()
    return true
  }

  const nextDetails = await Promise.all(
    activeWatchlists.map((item) => loadWatchlistDetail(token, item.id))
  )

  if (abortIfInteraction && monitoringInteractionLocked()) return false
  watchlistDetails = nextDetails
  renderMonitoringView()
  return true
}

async function createWatchlist(token) {
  const response = await fetch(`${CONTROL_PLANE}/v1/watchlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'My Monitoring'
    })
  })

  const body = await response.json().catch(() => null)

  if (!response.ok || !body?.data?.id) {
    const message =
      body?.detail ||
      body?.message ||
      body?.error ||
      `HTTP ${response.status}`

    throw new Error(`Unable to create My Monitoring: ${message}`)
  }

  return body.data
}

async function ensureWatchlist(token) {
  const active =
    watchlists.find((item) =>
      item?.status === 'active' && item?.name === 'My Monitoring'
    ) ||
    watchlists.find((item) => item?.status === 'active')

  if (active?.id) return active

  const created = await createWatchlist(token)
  await loadWatchlists(token)
  return created
}

async function addMonitoredAsset(token, watchlistId, chain, tokenAddress, { qa = true } = {}) {
  const response = await fetch(
    `${CONTROL_PLANE}/v1/watchlists/${watchlistId}/assets`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chain,
        token: tokenAddress
      })
    }
  )

  const body = await response.json().catch(() => null)

  if (qa) {
    qaLog('ELOFID ADD ASSET QA', {
      status: response.status,
      body
    })
  }

  if (!response.ok || !body?.data) {
    const message =
      body?.detail ||
      body?.message ||
      body?.error ||
      `HTTP ${response.status}`

    const error = new Error(message)
    error.code = body?.error || null
    error.status = response.status
    throw error
  }

  return body.data
}

async function removeMonitoredAsset(token, watchlistId, chain, tokenAddress) {
  const response = await fetch(
    `${CONTROL_PLANE}/v1/watchlists/${watchlistId}/assets/${encodeURIComponent(chain)}/${encodeURIComponent(tokenAddress)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    }
  )

  const body = await response.json().catch(() => null)

  qaLog('ELOFID REMOVE ASSET QA', {
    watchlistId,
    chain,
    token: tokenAddress,
    status: response.status,
    body
  })

  if (!response.ok || !body?.data) {
    const message =
      body?.detail ||
      body?.message ||
      body?.error ||
      `HTTP ${response.status}`

    const error = new Error(message)
    error.code = body?.error || null
    error.status = response.status
    throw error
  }

  return body.data
}

let removeAssetUiReady = false
let pendingAssetRemoval = null

function injectRemoveAssetUi() {
  if (removeAssetUiReady) return
  removeAssetUiReady = true

  const backdrop = document.createElement('div')
  backdrop.className = 'cx-remove-backdrop'
  backdrop.id = 'cx-remove-backdrop'
  backdrop.dataset.open = 'false'
  backdrop.innerHTML = `
    <section class="cx-remove-modal" role="dialog" aria-modal="true" aria-labelledby="cx-remove-title">
      <div class="cx-remove-head">
        <div class="eyebrow">My Monitoring</div>
        <h2 class="cx-remove-title" id="cx-remove-title">Stop monitoring this contract?</h2>
        <p class="cx-remove-copy">Elofid will stop monitoring future changes for this contract. Existing history is preserved.</p>
      </div>
      <div class="cx-remove-target" id="cx-remove-target"></div>
      <div class="cx-remove-note" id="cx-remove-note">You can add the same contract again later to reactivate monitoring.</div>
      <div class="cx-remove-actions">
        <button type="button" class="cx-remove-btn cx-remove-cancel" id="cx-remove-cancel">Cancel</button>
        <button type="button" class="cx-remove-btn cx-remove-confirm" id="cx-remove-confirm">Remove from monitoring</button>
      </div>
    </section>
  `

  document.body.appendChild(backdrop)

  const target = document.getElementById('cx-remove-target')
  const note = document.getElementById('cx-remove-note')
  const cancel = document.getElementById('cx-remove-cancel')
  const confirm = document.getElementById('cx-remove-confirm')

  const close = () => {
    backdrop.dataset.open = 'false'
    pendingAssetRemoval = null
    note.dataset.state = ''
    note.textContent = 'You can add the same contract again later to reactivate monitoring.'
    confirm.disabled = false
    confirm.textContent = 'Remove from monitoring'
  }

  cancel.addEventListener('click', close)
  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) close()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && backdrop.dataset.open === 'true' && !confirm.disabled) close()
  })

  confirm.addEventListener('click', async () => {
    if (!pendingAssetRemoval) return

    confirm.disabled = true
    confirm.textContent = 'Removing…'
    note.dataset.state = ''
    note.textContent = 'Updating your Elofid monitoring state…'

    try {
      const sessionToken = await clerk.session?.getToken()
      if (!sessionToken) throw new Error('Authentication session is unavailable.')

      await removeMonitoredAsset(
        sessionToken,
        pendingAssetRemoval.watchlistId,
        pendingAssetRemoval.chain,
        pendingAssetRemoval.token
      )

      await loadWatchlists(sessionToken)
      await refreshMonitoringView(sessionToken)
      setMonitoredAssetStepState()
      close()
    } catch (error) {
      console.error('Elofid remove monitored asset failed', error)
      note.dataset.state = 'error'
      note.textContent = error?.message || 'Unable to remove this asset from monitoring.'
      confirm.disabled = false
      confirm.textContent = 'Remove from monitoring'
    }
  })

  window.__elofidOpenRemoveAsset = (watchlistId, chain, tokenAddress) => {
    pendingAssetRemoval = { watchlistId, chain, token: tokenAddress }
    target.textContent = `${chainDisplayName(chain)} · ${tokenAddress}`
    note.dataset.state = ''
    note.textContent = 'You can add the same contract again later to reactivate monitoring.'
    backdrop.dataset.open = 'true'
  }
}

function validateAsset(chain, address) {
  const value = String(address || '').trim()

  if (EVM_CHAINS.has(chain)) {
    if (!/^0x[0-9a-fA-F]{40}$/.test(value)) {
      return 'Enter a valid 20-byte 0x contract address.'
    }
    return null
  }

  if (chain === 'solana') {
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)) {
      return 'Enter a valid Solana token address.'
    }
    return null
  }

  return 'Select a supported chain.'
}

function injectAssetUi() {
  if (assetUiReady) return
  assetUiReady = true

  const style = document.createElement('style')
  style.textContent = `
    .cx-asset-backdrop {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(2, 6, 10, .76);
      backdrop-filter: blur(10px);
    }
    .cx-asset-backdrop[data-open="true"] { display: flex; }
    .cx-asset-modal {
      width: min(540px, 100%);
      border: 1px solid #273241;
      border-radius: 16px;
      background: #0b0f14;
      box-shadow: 0 28px 80px rgba(0, 0, 0, .45);
      overflow: hidden;
    }
    .cx-asset-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 20px;
      padding: 22px 22px 18px;
      border-bottom: 1px solid #1c2632;
    }
    .cx-asset-kicker {
      margin: 0 0 6px;
      font: 700 11px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace;
      letter-spacing: .12em;
      color: #00e5ff;
      text-transform: uppercase;
    }
    .cx-asset-title {
      margin: 0;
      color: #f5f7fa;
      font: 700 20px/1.25 Inter, system-ui, sans-serif;
    }
    .cx-asset-subtitle {
      margin: 7px 0 0;
      color: #8e9aaa;
      font: 400 13px/1.5 Inter, system-ui, sans-serif;
    }
    .cx-asset-close {
      flex: 0 0 32px;
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      padding: 0;
      border: 1px solid #253140;
      border-radius: 9px;
      background: #0f151d;
      color: #91a0b2;
      cursor: pointer;
      transition: border-color .16s ease, background .16s ease, color .16s ease;
    }
    .cx-asset-close svg { width: 14px; height: 14px; display: block; }
    .cx-asset-close:hover {
      border-color: #3b5064;
      background: #131c26;
      color: #d7e2ec;
    }
    .cx-asset-body {
      padding: 22px 22px 22px;
    }
    .cx-field { margin-bottom: 18px; }
    .cx-field label {
      display: block;
      margin-bottom: 7px;
      color: #cbd5e1;
      font: 600 12px/1.2 Inter, system-ui, sans-serif;
    }
    .cx-field select,
    .cx-field input,
    .cx-field textarea {
      width: 100%;
      box-sizing: border-box;
      min-height: 44px;
      border: 1px solid #273241;
      border-radius: 10px;
      background: #111722;
      color: #f5f7fa;
      padding: 0 12px;
      outline: none;
      font: 500 13px/1.3 Inter, system-ui, sans-serif;
    }
    .cx-field input,
    .cx-field textarea {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .cx-field textarea {
      min-height: 200px;
      resize: vertical;
      padding-top: 11px;
      padding-bottom: 11px;
      line-height: 1.55;
    }
    .cx-bulk-meta {
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      margin-top:8px;
      padding:0 1px;
      color:#718297;
      font:700 10px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;
    }
    .cx-bulk-meta strong { color:#a8bacb; font:inherit; }
    .cx-field select:focus,
    .cx-field input:focus,
    .cx-field textarea:focus {
      border-color: #00e5ff;
      box-shadow: 0 0 0 3px rgba(0, 229, 255, .09);
    }
    .cx-asset-note {
      min-height: 20px;
      margin: 4px 0 18px;
      color: #8e9aaa;
      font: 500 12px/1.45 Inter, system-ui, sans-serif;
    }
    .cx-asset-note[data-state="error"] { color: #ff7d8c; }
    .cx-asset-note[data-state="success"] { color: #5dffb2; }
    .cx-asset-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      padding-top: 2px;
    }
    #cx-bulk-asset-submit {
      width: 166px;
      min-width: 166px;
    }
    .cx-btn {
      min-height: 42px;
      border-radius: 10px;
      padding: 0 16px;
      font: 700 13px/1 Inter, system-ui, sans-serif;
      cursor: pointer;
    }
    .cx-btn-secondary {
      border: 1px solid #273241;
      background: #111722;
      color: #cbd5e1;
    }
    .cx-btn-primary {
      border: 1px solid #00e5ff;
      background: #00e5ff;
      color: #001014;
    }
    .cx-btn-primary:disabled {
      cursor: wait;
      opacity: .62;
    }
    @media (max-width: 440px) {
      .cx-asset-backdrop { padding: 12px; }
      .cx-asset-head { padding: 18px 18px 16px; }
      .cx-asset-body { padding: 18px; }
      #cx-bulk-asset-submit { width: 150px; min-width: 150px; }
    }
    .step[role="button"]:hover {
      background: rgba(0, 229, 255, .025);
    }
  `
  document.head.appendChild(style)

  const backdrop = document.createElement('div')
  backdrop.className = 'cx-asset-backdrop'
  backdrop.id = 'cx-asset-backdrop'
  backdrop.dataset.open = 'false'

  const options = CHAINS
    .map(([id, label]) => `<option value="${id}">${label}</option>`)
    .join('')

  backdrop.innerHTML = `
    <section class="cx-asset-modal" role="dialog" aria-modal="true" aria-labelledby="cx-asset-title">
      <header class="cx-asset-head">
        <div>
          <p class="cx-asset-kicker">My Monitoring</p>
          <h2 class="cx-asset-title" id="cx-asset-title">Add monitored asset</h2>
          <p class="cx-asset-subtitle">
            Add a contract once. Elofid will use your monitored-asset list as the source for continuous intelligence.
          </p>
        </div>
        <button type="button" class="cx-asset-close" id="cx-asset-close" aria-label="Close">×</button>
      </header>

      <form class="cx-asset-body" id="cx-asset-form">
        <div class="cx-field">
          <label for="cx-asset-chain">Chain</label>
          <select id="cx-asset-chain" required>
            ${options}
          </select>
        </div>

        <div class="cx-field">
          <label for="cx-asset-address">Contract address</label>
          <input
            id="cx-asset-address"
            type="text"
            autocomplete="off"
            spellcheck="false"
            placeholder="0x..."
            required
          >
        </div>

        <p class="cx-asset-note" id="cx-asset-note">
          Adding an asset adds it to My Monitoring and counts toward your monitored asset capacity.
        </p>

        <div class="cx-asset-actions">
          <button type="button" class="cx-btn cx-btn-secondary" id="cx-asset-cancel">Cancel</button>
          <button type="submit" class="cx-btn cx-btn-primary" id="cx-asset-submit">Add asset</button>
        </div>
      </form>
    </section>
  `

  const bulkBackdrop = document.createElement('div')
  bulkBackdrop.className = 'cx-asset-backdrop'
  bulkBackdrop.id = 'cx-bulk-asset-backdrop'
  bulkBackdrop.dataset.open = 'false'
  bulkBackdrop.innerHTML = `
    <section class="cx-asset-modal" role="dialog" aria-modal="true" aria-labelledby="cx-bulk-asset-title">
      <header class="cx-asset-head">
        <div>
          <p class="cx-asset-kicker">My Monitoring</p>
          <h2 class="cx-asset-title" id="cx-bulk-asset-title">Bulk add monitored assets</h2>
          <p class="cx-asset-subtitle">
            Choose one chain and paste contract addresses below. Use one address per line, or separate addresses with spaces or commas.
          </p>
        </div>
        <button type="button" class="cx-asset-close" id="cx-bulk-asset-close" aria-label="Close">
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </button>
      </header>

      <form class="cx-asset-body" id="cx-bulk-asset-form">
        <div class="cx-field">
          <label for="cx-bulk-asset-chain">Chain</label>
          <select id="cx-bulk-asset-chain" required>${options}</select>
        </div>

        <div class="cx-field">
          <label for="cx-bulk-asset-addresses">Contract addresses</label>
          <textarea
            id="cx-bulk-asset-addresses"
            autocomplete="off"
            spellcheck="false"
            placeholder="0x...&#10;0x...&#10;0x..."
            required
          ></textarea>
          <div class="cx-bulk-meta"><span>Maximum 1,000 per bulk action</span><strong id="cx-bulk-asset-count">0 unique</strong></div>
        </div>

        <p class="cx-asset-note" id="cx-bulk-asset-note">
          Your plan capacity is enforced automatically. Existing monitored assets will be skipped.
        </p>

        <div class="cx-asset-actions">
          <button type="button" class="cx-btn cx-btn-secondary" id="cx-bulk-asset-cancel">Cancel</button>
          <button type="submit" class="cx-btn cx-btn-primary" id="cx-bulk-asset-submit">Bulk add</button>
        </div>
      </form>
    </section>
  `

  document.body.appendChild(backdrop)
  document.body.appendChild(bulkBackdrop)

  const form = document.getElementById('cx-asset-form')
  const chain = document.getElementById('cx-asset-chain')
  const address = document.getElementById('cx-asset-address')
  const note = document.getElementById('cx-asset-note')
  const submit = document.getElementById('cx-asset-submit')
  const close = document.getElementById('cx-asset-close')
  const cancel = document.getElementById('cx-asset-cancel')
  const bulkForm = document.getElementById('cx-bulk-asset-form')
  const bulkChain = document.getElementById('cx-bulk-asset-chain')
  const bulkAddresses = document.getElementById('cx-bulk-asset-addresses')
  const bulkCount = document.getElementById('cx-bulk-asset-count')
  const bulkNote = document.getElementById('cx-bulk-asset-note')
  const bulkSubmit = document.getElementById('cx-bulk-asset-submit')
  const bulkClose = document.getElementById('cx-bulk-asset-close')
  const bulkCancel = document.getElementById('cx-bulk-asset-cancel')

  const closeModal = () => {
    backdrop.dataset.open = 'false'
    form.reset()
    note.dataset.state = ''
    note.textContent = 'Adding an asset adds it to My Monitoring and counts toward your monitored asset capacity.'
    submit.disabled = false
    submit.textContent = 'Add asset'
  }

  const openModal = () => {
    if (!clerk.user || !workspace) return
    backdrop.dataset.open = 'true'
    window.setTimeout(() => address.focus(), 30)
  }

  const parseBulkAddresses = () => {
    const values = String(bulkAddresses.value || '').split(/[\s,;]+/).map((value) => value.trim()).filter(Boolean)
    const seen = new Set()
    const unique = []
    for (const value of values) {
      const key = EVM_CHAINS.has(bulkChain.value) ? value.toLowerCase() : value
      if (seen.has(key)) continue
      seen.add(key)
      unique.push(value)
    }
    return unique
  }

  const updateBulkCount = () => {
    const count = parseBulkAddresses().length
    bulkCount.textContent = `${count} unique`
    return count
  }

  const closeBulkModal = () => {
    bulkBackdrop.dataset.open = 'false'
    bulkForm.reset()
    bulkNote.dataset.state = ''
    bulkNote.textContent = 'Your plan capacity is enforced automatically. Existing monitored assets will be skipped.'
    bulkSubmit.disabled = false
    bulkSubmit.textContent = 'Bulk add'
    updateBulkCount()
  }

  const openBulkModal = () => {
    if (!clerk.user || !workspace) return
    bulkBackdrop.dataset.open = 'true'
    window.setTimeout(() => bulkAddresses.focus(), 30)
  }

  close.addEventListener('click', closeModal)
  cancel.addEventListener('click', closeModal)
  bulkClose.addEventListener('click', closeBulkModal)
  bulkCancel.addEventListener('click', closeBulkModal)
  bulkAddresses.addEventListener('input', updateBulkCount)
  bulkChain.addEventListener('change', updateBulkCount)

  backdrop.addEventListener('click', (event) => {
    if (event.target === backdrop) closeModal()
  })
  bulkBackdrop.addEventListener('click', (event) => {
    if (event.target === bulkBackdrop) closeBulkModal()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    if (backdrop.dataset.open === 'true') closeModal()
    if (bulkBackdrop.dataset.open === 'true') closeBulkModal()
  })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const selectedChain = chain.value
    const tokenAddress = address.value.trim()
    const validationError = validateAsset(selectedChain, tokenAddress)

    if (validationError) {
      note.dataset.state = 'error'
      note.textContent = validationError
      return
    }

    submit.disabled = true
    submit.textContent = 'Adding…'
    note.dataset.state = ''
    note.textContent = 'Connecting to your Elofid workspace…'

    try {
      const sessionToken = await clerk.session?.getToken()
      if (!sessionToken) throw new Error('Authentication session is unavailable.')

      const targetWatchlist = await ensureWatchlist(sessionToken)

      note.textContent = 'Adding contract to My Monitoring…'

      const added = await addMonitoredAsset(
        sessionToken,
        targetWatchlist.id,
        selectedChain,
        tokenAddress
      )

      await loadWatchlists(sessionToken)
      if (currentView === 'monitoring') {
        await refreshMonitoringView(sessionToken)
      }

      note.dataset.state = 'success'
      note.textContent = `Added ${added.chain}: ${added.token}`
      submit.textContent = 'Added'

      window.setTimeout(closeModal, 900)
    } catch (error) {
      console.error('Elofid add monitored asset failed', error)

      note.dataset.state = 'error'

      if (error?.code === 'asset_already_in_watchlist') {
        note.textContent = 'This contract is already in My Monitoring.'
      } else if (error?.code === 'asset_limit_reached') {
        note.textContent = 'Your current plan has reached its monitored-asset limit.'
      } else if (error?.code === 'cadence_not_allowed') {
        note.textContent = 'The monitoring policy is not available on your current plan.'
      } else {
        note.textContent = error?.message || 'Unable to add this asset.'
      }

      submit.disabled = false
      submit.textContent = 'Add asset'
    }
  })

  bulkForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const selectedChain = bulkChain.value
    const addresses = parseBulkAddresses()

    if (!addresses.length) {
      bulkNote.dataset.state = 'error'
      bulkNote.textContent = 'Paste at least one contract address.'
      return
    }
    if (addresses.length > 1000) {
      bulkNote.dataset.state = 'error'
      bulkNote.textContent = 'Add up to 1,000 unique contract addresses per bulk action.'
      return
    }

    const invalid = addresses
      .map((value, index) => ({ value, index, error: validateAsset(selectedChain, value) }))
      .filter((item) => item.error)

    if (invalid.length) {
      const preview = invalid.slice(0, 3).map((item) => `#${item.index + 1} ${item.value}`).join(' · ')
      bulkNote.dataset.state = 'error'
      bulkNote.textContent = `${invalid.length} invalid address${invalid.length === 1 ? '' : 'es'}: ${preview}${invalid.length > 3 ? ' …' : ''}`
      return
    }

    bulkSubmit.disabled = true
    bulkSubmit.textContent = 'Adding…'
    bulkNote.dataset.state = ''

    let added = 0
    let skipped = 0
    let failed = 0
    let limitReached = false

    try {
      const sessionToken = await clerk.session?.getToken()
      if (!sessionToken) throw new Error('Authentication session is unavailable.')
      const targetWatchlist = await ensureWatchlist(sessionToken)

      // A small worker pool keeps large pastes practical without flooding the Control Plane.
      let cursor = 0
      const worker = async () => {
        while (true) {
          if (limitReached) return
          const index = cursor++
          if (index >= addresses.length) return
          const tokenAddress = addresses[index]
          bulkNote.textContent = `Adding ${Math.min(index + 1, addresses.length)} of ${addresses.length}… · ${added} added · ${skipped} skipped · ${failed} failed`
          try {
            await addMonitoredAsset(sessionToken, targetWatchlist.id, selectedChain, tokenAddress, { qa: false })
            added += 1
          } catch (error) {
            if (error?.code === 'asset_already_in_watchlist') {
              skipped += 1
            } else if (error?.code === 'asset_limit_reached') {
              failed += 1
              limitReached = true
            } else {
              failed += 1
            }
          }
        }
      }

      await Promise.all(Array.from({ length: Math.min(3, addresses.length) }, () => worker()))

      await loadWatchlists(sessionToken)
      if (currentView === 'monitoring') await refreshMonitoringView(sessionToken)

      qaLog('ELOFID BULK ADD ASSETS QA', {
        chain: selectedChain,
        requested: addresses.length,
        added,
        skipped,
        failed,
        limit_reached: limitReached
      })

      bulkNote.dataset.state = failed || limitReached ? 'error' : 'success'
      bulkNote.textContent = `${added} added · ${skipped} already monitored · ${failed} failed${limitReached ? ' · Plan asset limit reached' : ''}`
      bulkSubmit.disabled = false
      bulkSubmit.textContent = 'Add more'

      if (!failed && !limitReached) {
        window.setTimeout(closeBulkModal, 900)
      }
    } catch (error) {
      console.error('Elofid bulk add monitored assets failed', error)
      bulkNote.dataset.state = 'error'
      bulkNote.textContent = error?.message || 'Unable to bulk add these assets.'
      bulkSubmit.disabled = false
      bulkSubmit.textContent = 'Bulk add'
    }
  })

  const monitoringAddButton = document.getElementById('monitoring-add-asset')
  const monitoringBulkButton = document.getElementById('monitoring-bulk-add')
  monitoringAddButton?.addEventListener('click', openModal)
  monitoringBulkButton?.addEventListener('click', openBulkModal)

  const row = monitoredAssetStep()
  if (row) {
    row.addEventListener('click', openModal)
    row.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        openModal()
      }
    })
  }
}

async function bootstrapWorkspace() {
  if (workspace) return workspace
  if (bootstrapPromise) return bootstrapPromise

  bootstrapPromise = (async () => {
    setWorkspaceState('loading')

    const token = await clerk.session?.getToken()

    if (!token) {
      throw new Error('No Clerk session token available')
    }

    const response = await fetch(`${CONTROL_PLANE}/v1/bootstrap`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    })

    const body = await response.json().catch(() => null)

    if (!response.ok || !body?.ok || !body?.workspace) {
      const code = body?.error || `HTTP_${response.status}`
      throw new Error(`Elofid workspace bootstrap failed: ${code}`)
    }

    workspace = body.workspace
    setWorkspaceState('connected', workspace)

    qaLog('Elofid workspace connected', {
      plan: workspace.plan_code,
      role: workspace.role,
      status: workspace.status
    })

    await loadWatchlists(token)
    await loadWebhooks(token)
    await loadUsage(token)
    try { await loadBillingSubscription(token) } catch (error) { console.error('Elofid billing subscription bootstrap failed', error) }
    await loadApiKeys(token)
    try { await loadGlobalPreview(token) } catch (error) { console.error('Elofid Global preview bootstrap failed', error) }
    renderBillingPlans()
    refreshOverviewUi()
    renderSettingsView()
    injectAssetUi()
    injectRemoveAssetUi()
    injectWebhookCreateUi()
    injectWebhookSecretRotationUi()
    injectWebhookTestDeliveryUi()
    injectWebhookRevokeUi()
    injectApiKeyCreateUi()
    setMonitoredAssetStepState()
    setApiKeyStepState()

    if (currentView === 'monitoring') {
      await refreshMonitoringView(token)
    } else if (currentView === 'global-feed') {
      await loadGlobalFeed(token)
    } else if (currentView === 'events') {
      await refreshMonitoringView(token)
      await refreshEventsView(token, selectedEventAssetIndex)
    } else if (currentView === 'incidents') {
      await refreshMonitoringView(token)
      await refreshIncidentsView(token, selectedIncidentAssetIndex)
    }

    startGlobalIntelligenceAlertWatch()
    scheduleMonitoringAutoRefresh()

    // The bootstrap above is itself a full authoritative refresh. Mark it fresh
    // so an immediately-following pageshow/focus event cannot duplicate it.
    authoritativeStateLastRefreshAt = Date.now()

    return workspace
  })()

  try {
    return await bootstrapPromise
  } catch (error) {
    console.error(error)
    setWorkspaceState('error')
    throw error
  } finally {
    bootstrapPromise = null
  }
}

async function render() {
  const user = clerk.user

  if (!user) {
    app.style.display = 'none'
    gate.style.display = 'none'

    if (authGateTimer) clearTimeout(authGateTimer)
    authGateTimer = setTimeout(() => {
      if (!clerk.user) {
        gate.style.display = 'grid'
      }
      authGateTimer = null
    }, AUTH_GATE_SETTLE_MS)

    workspace = null
    watchlists = []
    watchlistDetails = []
    apiKeysLoaded = false
    usageLoaded = false
    eventAssets = []
    selectedEventAssetIndex = -1
    incidentAssets = []
    selectedIncidentAssetIndex = -1
    globalFeedEvents = []
    globalFeedIncidents = []
    usageData = null
    mountedUserButton = false
    return
  }

  if (authGateTimer) {
    clearTimeout(authGateTimer)
    authGateTimer = null
  }
  gate.style.display = 'none'
  if (currentView === 'global-feed' && !usageLoaded) setGlobalFeedEntitlementLoadingState()
  if (currentView === 'overview' && !usageLoaded) renderOverviewPlanStatus()
  app.style.display = 'grid'

  const email =
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses?.[0]?.emailAddress ||
    ''

  userName.textContent =
    user.firstName ||
    user.fullName ||
    (email ? email.split('@')[0] : 'Developer')
  renderSettingsView()

  if (!mountedUserButton) {
    clerk.mountUserButton(userButton)
    mountedUserButton = true
  }

  try {
    await bootstrapWorkspace()
  } catch {
    // Visible dashboard state already switches to ERROR.
  }
}


const navOverview = document.getElementById('nav-overview')
const navMonitoring = document.getElementById('nav-monitoring')
const navApiKeys = document.getElementById('nav-api-keys')
const navEvents = document.getElementById('nav-events')
const navIncidents = document.getElementById('nav-incidents')
const navWebhooks = document.getElementById('nav-webhooks')
const navGlobalFeed = document.getElementById('nav-global-feed')
const navUsage = document.getElementById('nav-usage')
const navBilling = document.getElementById('nav-billing')
const navSettings = document.getElementById('nav-settings')

navOverview?.addEventListener('click', (event) => {
  event.preventDefault()
  setDashboardView('overview')
  history.replaceState(null, '', '/dashboard/')
})


navGlobalFeed?.addEventListener('click', async (event) => {
  event.preventDefault()
  setDashboardView('global-feed')
  history.replaceState(null, '', '#global-feed')

  const list = document.getElementById('global-feed-list')
  const meta = document.getElementById('global-feed-meta')
  if (meta) meta.textContent = 'Loading Global Feed…'
  if (list) list.innerHTML = '<div class="events-empty">Loading Global Feed…</div>'

  try {
    const sessionToken = await clerk.session?.getToken()
    if (!sessionToken) throw new Error('Authentication session is unavailable.')
    await loadGlobalFeed(sessionToken)
  } catch (error) {
    console.error('Elofid Global Feed load failed', error)
    renderGlobalFeedError(error?.message || 'Unable to load Global Feed.')
  }
})

navUsage?.addEventListener('click', async (event) => {
  event.preventDefault()
  setDashboardView('usage')
  history.replaceState(null, '', '#usage')

  try {
    const sessionToken = await clerk.session?.getToken()
    if (!sessionToken) throw new Error('Authentication session is unavailable.')
    await loadWebhooks(sessionToken)
    await loadUsage(sessionToken)
  } catch (error) {
    console.error('Elofid Usage load failed', error)
    renderUsageError(error?.message || 'Unable to load Usage.')
  }
})

navBilling?.addEventListener('click', (event) => {
  event.preventDefault()
  setDashboardView('billing')
  history.replaceState(null, '', '#plans')
  renderBillingPlans()
})

document.getElementById('workspace-plan-pill')?.addEventListener('click', () => navBilling?.click())
document.getElementById('overview-plan-billing-link')?.addEventListener('click', () => { setDashboardView('billing-account'); history.replaceState(null, '', '#billing') })

navSettings?.addEventListener('click', (event) => {
  event.preventDefault()
  setDashboardView('settings')
  history.replaceState(null, '', '#settings')
  renderSettingsView()
})

document.querySelectorAll('[data-time-display]').forEach((button) => button.addEventListener('click', () => {
  timeDisplayMode = button.dataset.timeDisplay === 'utc' ? 'utc' : 'local'
  localStorage.setItem('elofid.dashboard.timeDisplay', timeDisplayMode)
  renderSettingsView()
  renderSettingsTimePreview()
  renderApiKeysView()
  if (currentView === 'global-feed') renderGlobalFeed()
  if (currentView === 'usage' && usageData) renderUsageView({ data: usageData })
}))

document.getElementById('settings-open-billing')?.addEventListener('click', () => { setDashboardView('billing-account'); history.replaceState(null, '', '#billing') })
document.getElementById('settings-manage-subscription')?.addEventListener('click', async (event) => {
  try { await openBillingPortal(event.currentTarget) }
  catch (error) { console.error('Elofid Paddle customer portal failed', error); window.alert(error?.message || globalDetailT('billingPortalFailed')) }
})
document.getElementById('billing-manage-subscription')?.addEventListener('click', async (event) => {
  try { await openBillingPortal(event.currentTarget) }
  catch (error) { console.error('Elofid Paddle customer portal failed', error); window.alert(error?.message || globalDetailT('billingPortalFailed')) }
})
document.getElementById('billing-change-plan')?.addEventListener('click', () => navBilling?.click())
document.getElementById('billing-open-documents')?.addEventListener('click', async (event) => {
  try { await openBillingPortal(event.currentTarget) }
  catch (error) { console.error('Elofid Paddle billing documents portal failed', error); window.alert(error?.message || globalDetailT('billingPortalFailed')) }
})
document.getElementById('billing-view-usage')?.addEventListener('click', () => navUsage?.click())
document.getElementById('settings-open-usage')?.addEventListener('click', () => navUsage?.click())
document.getElementById('settings-open-api-keys')?.addEventListener('click', () => navApiKeys?.click())
document.getElementById('settings-open-webhooks')?.addEventListener('click', () => navWebhooks?.click())
document.getElementById('settings-sign-out')?.addEventListener('click', async () => {
  try { await clerk.signOut() } catch (error) { console.error('Elofid sign out failed', error) }
})

document.querySelectorAll('[data-billing-cycle]').forEach((button) => button.addEventListener('click', () => {
  billingCycle = button.dataset.billingCycle === 'annual' ? 'annual' : 'monthly'
  document.querySelectorAll('[data-billing-cycle]').forEach(b => b.classList.toggle('active', b.dataset.billingCycle === billingCycle))
  renderBillingPlans()
}))

document.querySelectorAll('[data-upgrade-billing-cycle]').forEach((button) => button.addEventListener('click', () => {
  upgradeBillingCycle = button.dataset.upgradeBillingCycle === 'annual' ? 'annual' : 'monthly'
  document.querySelectorAll('[data-upgrade-billing-cycle]').forEach(b => b.classList.toggle('active', b.dataset.upgradeBillingCycle === upgradeBillingCycle))
  renderUpgradePlans()
}))

document.addEventListener('click', async (event) => {
  const contactButton = event.target.closest('[data-contact-kind], [data-sales-contact]')
  if (contactButton) {
    event.preventDefault()
    openContactModal(contactButton.dataset.contactKind || 'sales')
    return
  }

  const portalButton = event.target.closest('[data-paddle-portal]')
  if (portalButton) {
    try { await openBillingPortal(portalButton) }
    catch (error) { console.error('Elofid Paddle customer portal failed', error); window.alert(error?.message || globalDetailT('billingPortalFailed')) }
    return
  }

  const button = event.target.closest('[data-paddle-checkout-plan]')
  if (!button) return
  try {
    await openPaddleCheckout(button.dataset.paddleCheckoutPlan, button.dataset.paddleCheckoutCycle, button)
  } catch (error) {
    console.error('Elofid Paddle Sandbox checkout failed', error)
    window.alert(error?.message || 'Unable to open Paddle Sandbox checkout.')
  }
})

document.getElementById('contact-close')?.addEventListener('click', closeContactModal)
document.getElementById('contact-copy-email')?.addEventListener('click', copyContactEmail)
document.getElementById('contact-open-email')?.addEventListener('click', openContactEmailApp)
document.getElementById('contact-backdrop')?.addEventListener('click', (event) => { if (event.target === event.currentTarget) closeContactModal() })
document.getElementById('global-upgrade')?.addEventListener('click', openUpgradeModal)
document.getElementById('upgrade-close')?.addEventListener('click', closeUpgradeModal)
document.getElementById('upgrade-backdrop')?.addEventListener('click', (event) => { if (event.target === event.currentTarget) closeUpgradeModal() })
document.getElementById('global-detail-close')?.addEventListener('click', () => { document.getElementById('global-detail-backdrop').dataset.open='false' })
document.getElementById('global-detail-backdrop')?.addEventListener('click', (event) => { if(event.target===event.currentTarget) event.currentTarget.dataset.open='false' })
document.getElementById('global-detail-body')?.addEventListener('click', async (event) => {
  const button = event.target.closest('.global-detail-copy-json')
  if (!button || globalDetailRawPayload == null) return
  try {
    await navigator.clipboard.writeText(JSON.stringify(globalDetailRawPayload, null, 2))
    const previous = button.textContent
    button.textContent = globalDetailT('copied')
    setTimeout(() => { if (button.isConnected) button.textContent = previous }, 1200)
  } catch (error) {
    console.error('Elofid Global Intelligence JSON copy failed', error)
    button.textContent = globalDetailT('copyFailed')
  }
})
document.getElementById('global-feed-list')?.addEventListener('click', async (event) => {
  const copy = event.target.closest('.global-card-copy')
  if (copy) {
    event.preventDefault()
    try {
      await navigator.clipboard.writeText(copy.dataset.copyToken || '')
      copy.textContent = 'Copied'
    } catch {
      copy.textContent = 'Copy failed'
    }
    setTimeout(() => { if (copy.isConnected) copy.textContent = 'Copy' }, 1200)
    return
  }
  if (event.target.closest('.global-card-explorer')) return
  if (event.target.closest('.global-unlock')) { openUpgradeModal(); return }
  const detail = event.target.closest('.global-detail-trigger') || event.target.closest('.global-card-clickable')
  if (detail && detail.dataset.id) openGlobalDetail(detail.dataset.kind, detail.dataset.id)
})
document.getElementById('global-feed-list')?.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return
  const card = event.target.closest('.global-card-clickable')
  if (!card || event.target !== card || !card.dataset.id) return
  event.preventDefault()
  openGlobalDetail(card.dataset.kind, card.dataset.id)
})
for (const id of ['global-search','global-kind','global-chain','global-severity']) document.getElementById(id)?.addEventListener('input', renderGlobalFeed)
for (const id of ['monitoring-search','monitoring-watchlist-filter','monitoring-chain-filter']) document.getElementById(id)?.addEventListener('input', renderMonitoringView)
document.getElementById('monitoring-list')?.addEventListener('click', (event) => {
  const button = event.target.closest('#monitoring-refresh')
  if (!button) return
  void refreshMonitoringData({ manual: true, reason: 'manual_button' })
  scheduleMonitoringAutoRefresh()
})
document.getElementById('monitoring-sort')?.addEventListener('input', () => { const mode = String(document.getElementById('monitoring-sort')?.value || 'default'); if (['default','chain','address'].includes(mode)) renderMonitoringView(); else applyMonitoringSnapshotFilters() })
for (const listId of ['events-list','incidents-list']) {
  const list = document.getElementById(listId)
  list?.addEventListener('click', (event) => {
    const row = event.target.closest('.monitored-detail-trigger')
    if (!row) return
    openMonitoredDetail(row.dataset.monitoredDetailKind, row.dataset.monitoredDetailId)
  })
  list?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    const row = event.target.closest('.monitored-detail-trigger')
    if (!row) return
    event.preventDefault()
    openMonitoredDetail(row.dataset.monitoredDetailKind, row.dataset.monitoredDetailId)
  })
}

for (const id of ['events-search','events-type-filter','events-severity-filter']) document.getElementById(id)?.addEventListener('input', () => { if (lastEventsBody) renderEventsData(lastEventsBody, lastEventsAsset) })
for (const id of ['incidents-search','incidents-severity-filter','incidents-status-filter']) document.getElementById(id)?.addEventListener('input', () => { if (lastIncidentsBody) renderIncidentsData(lastIncidentsBody, lastIncidentsAsset) })
document.getElementById('overview-global-link')?.addEventListener('click', (event) => { event.preventDefault(); document.getElementById('nav-global-feed')?.click() })
document.getElementById('overview-my-monitoring-link')?.addEventListener('click', (event) => { event.preventDefault(); document.getElementById('nav-events')?.click() })
document.getElementById('overview-manage-monitoring-link')?.addEventListener('click', (event) => { event.preventDefault(); document.getElementById('nav-monitoring')?.click() })

navMonitoring?.addEventListener('click', async (event) => {
  event.preventDefault()
  setDashboardView('monitoring')
  history.replaceState(null, '', '#monitoring')

  const list = document.getElementById('monitoring-list')
  if (list) {
    list.innerHTML = '<div class="monitoring-empty">Loading your Elofid monitoring state…</div>'
  }

  try {
    if (watchlistDetails.length) {
      renderMonitoringView()
      scheduleMonitoringAutoRefresh()
      return
    }
    const sessionToken = await clerk.session?.getToken()
    if (!sessionToken) throw new Error('Authentication session is unavailable.')
    await loadWatchlists(sessionToken)
    await refreshMonitoringView(sessionToken)
    scheduleMonitoringAutoRefresh()
  } catch (error) {
    console.error('Elofid My Monitoring load failed', error)
    renderMonitoringError(error?.message || 'Unable to load My Monitoring.')
  }
})


navEvents?.addEventListener('click', async (event) => {
  event.preventDefault()
  setDashboardView('events')
  history.replaceState(null, '', '#events')

  const list = document.getElementById('events-list')
  const meta = document.getElementById('events-meta')
  if (meta) meta.textContent = 'Loading monitored assets…'
  if (list) list.innerHTML = '<div class="events-empty">Loading Events…</div>'

  try {
    const sessionToken = await clerk.session?.getToken()
    if (!sessionToken) throw new Error('Authentication session is unavailable.')
    await loadWatchlists(sessionToken)
    await refreshMonitoringView(sessionToken)
    await refreshEventsView(sessionToken, selectedEventAssetIndex)
  } catch (error) {
    console.error('Elofid monitored Events load failed', error)
    renderEventsError(error?.message || 'Unable to load Events.')
  }
})

navIncidents?.addEventListener('click', async (event) => {
  event.preventDefault()
  setDashboardView('incidents')
  history.replaceState(null, '', '#incidents')

  const list = document.getElementById('incidents-list')
  const meta = document.getElementById('incidents-meta')
  if (meta) meta.textContent = 'Loading monitored assets…'
  if (list) list.innerHTML = '<div class="events-empty">Loading Incidents…</div>'

  try {
    const sessionToken = await clerk.session?.getToken()
    if (!sessionToken) throw new Error('Authentication session is unavailable.')
    await loadWatchlists(sessionToken)
    await refreshMonitoringView(sessionToken)
    await refreshIncidentsView(sessionToken, selectedIncidentAssetIndex)
  } catch (error) {
    console.error('Elofid monitored Incidents load failed', error)
    renderIncidentsError(error?.message || 'Unable to load Incidents.')
  }
})

navWebhooks?.addEventListener('click', async (event) => {
  event.preventDefault()
  setDashboardView('webhooks')
  history.replaceState(null, '', '#webhooks')

  const list = document.getElementById('webhooks-list')
  const planValue = document.querySelector('#webhooks-plan .webhooks-plan-value')
  if (planValue) planValue.textContent = 'Loading…'
  if (list) list.innerHTML = '<div class="webhooks-empty">Loading webhook configuration…</div>'

  try {
    const sessionToken = await clerk.session?.getToken()
    if (!sessionToken) throw new Error('Authentication session is unavailable.')
    const result = await loadWebhooks(sessionToken)
    if (!result.ok) {
      const message = result?.body?.detail || result?.body?.message || result?.body?.error || `HTTP ${result.status}`
      throw new Error(`Unable to load Webhooks: ${message}`)
    }
    renderWebhooksView()
  } catch (error) {
    console.error('Elofid Webhooks load failed', error)
    renderWebhooksError(error?.message || 'Unable to load Webhooks.')
  }
})

navApiKeys?.addEventListener('click', async (event) => {
  event.preventDefault()
  setDashboardView('api-keys')
  history.replaceState(null, '', '#api-keys')

  const list = document.getElementById('api-keys-list')
  if (list) {
    list.innerHTML = '<div class="api-keys-empty">Loading API key metadata…</div>'
  }

  try {
    const sessionToken = await clerk.session?.getToken()
    if (!sessionToken) throw new Error('Authentication session is unavailable.')
    await loadApiKeys(sessionToken)
  } catch (error) {
    console.error('Elofid API Keys load failed', error)
    renderApiKeysError(error?.message || 'Unable to load API keys.')
  }
})


const eventsAssetSelect = document.getElementById('events-asset-select')
eventsAssetSelect?.addEventListener('change', async (event) => {
  const index = Number(event.target.value)
  if (!Number.isSafeInteger(index) || index < -1 || index >= eventAssets.length) return
  selectedEventAssetIndex = index

  try {
    const sessionToken = await clerk.session?.getToken()
    if (!sessionToken) throw new Error('Authentication session is unavailable.')
    await refreshEventsView(sessionToken, selectedEventAssetIndex)
  } catch (error) {
    console.error('Elofid monitored Events asset switch failed', error)
    renderEventsError(error?.message || 'Unable to load Events.')
  }
})

const incidentsAssetSelect = document.getElementById('incidents-asset-select')
incidentsAssetSelect?.addEventListener('change', async (event) => {
  const index = Number(event.target.value)
  if (!Number.isSafeInteger(index) || index < -1 || index >= incidentAssets.length) return
  selectedIncidentAssetIndex = index

  try {
    const sessionToken = await clerk.session?.getToken()
    if (!sessionToken) throw new Error('Authentication session is unavailable.')
    await refreshIncidentsView(sessionToken, selectedIncidentAssetIndex)
  } catch (error) {
    console.error('Elofid monitored Incidents asset switch failed', error)
    renderIncidentsError(error?.message || 'Unable to load Incidents.')
  }
})

setupNotificationHub()

if (window.location.hash === '#global-feed') {
  setDashboardView('global-feed')
} else if (window.location.hash === '#usage') {
  setDashboardView('usage')
} else if (window.location.hash === '#plans') {
  setDashboardView('billing')
  renderBillingPlans()
} else if (window.location.hash === '#billing') {
  setDashboardView('billing-account')
} else if (window.location.hash === '#monitoring') {
  setDashboardView('monitoring')
} else if (window.location.hash === '#events') {
  setDashboardView('events')
} else if (window.location.hash === '#incidents') {
  setDashboardView('incidents')
} else if (window.location.hash === '#webhooks') {
  setDashboardView('webhooks')
} else if (window.location.hash === '#api-keys') {
  setDashboardView('api-keys')
} else if (window.location.hash === '#settings') {
  setDashboardView('settings')
  renderSettingsView()
} else {
  setDashboardView('overview')
}

window.addEventListener('pageshow', (event) => {
  if (event.persisted) refreshAuthoritativeStateOnForeground('pageshow')
})
window.addEventListener('focus', () => {
  if (foregroundTransitionArmed && document.visibilityState === 'visible') {
    refreshAuthoritativeStateOnForeground('focus')
  }
})
document.addEventListener('visibilitychange', () => {
  syncSettingsTimePreviewTimer()

  if (document.visibilityState === 'hidden') {
    foregroundTransitionArmed = true
    return
  }

  if (document.visibilityState === 'visible' && foregroundTransitionArmed) {
    refreshAuthoritativeStateOnForeground('visibilitychange')
  }
})

signInButton.addEventListener('click', () => {
  clerk.openSignIn()
})

clerk.addListener(() => {
  render()
})

render()
