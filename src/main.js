// Elofid Public Auth v0.9.46 — language-stable signed-in Dashboard CTA handling.
import { Clerk } from '@clerk/clerk-js'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

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

const dashboardLinks = [
  ...document.querySelectorAll('a[href="/dashboard/"]'),
]

const localizedDashboardLabels = new WeakMap()

function dashboardLinkRole(link) {
  const key = String(link?.dataset?.i18n || link?.dataset?.authI18n || '')
  if (key === 'signIn') return 'sign-in'
  if (key === 'startFree') return 'start-free'
  return null
}

function rememberLocalizedDashboardLabel(link) {
  if (dashboardLinkRole(link) !== 'start-free') return
  const text = String(link.textContent || '').trim()
  if (text && text !== 'Dashboard') localizedDashboardLabels.set(link, text)
}

dashboardLinks.forEach(rememberLocalizedDashboardLabel)

let userButtonMount = null

function ensureUserButton() {
  if (userButtonMount) return userButtonMount

  const navActions = document.querySelector('.nav-actions')
  if (!navActions) return null

  userButtonMount = document.createElement('div')
  userButtonMount.id = 'elofid-user-button'
  userButtonMount.style.display = 'flex'
  userButtonMount.style.alignItems = 'center'
  userButtonMount.style.marginLeft = '4px'

  const menuButton = navActions.querySelector('.menu-btn')

  if (menuButton) {
    navActions.insertBefore(userButtonMount, menuButton)
  } else {
    navActions.appendChild(userButtonMount)
  }

  return userButtonMount
}

function renderAuthState() {
  const signedIn = Boolean(clerk.user)
  document.documentElement.dataset.elofidAuth = signedIn ? 'signed-in' : 'signed-out'

  dashboardLinks.forEach((link) => {
    const role = dashboardLinkRole(link)
    link.dataset.authReady = signedIn ? 'true' : 'false'

    if (role === 'sign-in') {
      if (signedIn) {
        if (link.style.display !== 'none') link.style.display = 'none'
      } else if (link.style.display === 'none') {
        link.style.display = ''
      }
      return
    }

    if (role === 'start-free') {
      if (signedIn) {
        rememberLocalizedDashboardLabel(link)
        if (link.textContent.trim() !== 'Dashboard') link.textContent = 'Dashboard'
      } else {
        const localizedLabel = localizedDashboardLabels.get(link)
        if (localizedLabel && link.textContent.trim() !== localizedLabel) link.textContent = localizedLabel
      }
    }
  })

  if (signedIn) {
    const mount = ensureUserButton()

    if (mount && mount.childElementCount === 0) {
      clerk.mountUserButton(mount)
    }
  } else if (userButtonMount) {
    try {
      clerk.unmountUserButton(userButtonMount)
    } catch {}

    userButtonMount.remove()
    userButtonMount = null
  }
}


dashboardLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (!clerk.user) {
      event.preventDefault()

      clerk.openSignIn()
    }
  })
})

const languageSelect = document.getElementById('language')
languageSelect?.addEventListener('change', () => {
  requestAnimationFrame(() => {
    dashboardLinks.forEach(rememberLocalizedDashboardLabel)
    renderAuthState()
  })
})

// The landing-page translator rewrites [data-i18n] text after language changes.
// Re-apply the authenticated state if that rewrite touches a Dashboard CTA.
let authRenderQueued = false
const authCopyObserver = new MutationObserver((mutations) => {
  if (!clerk.user) return
  const relevant = mutations.some((mutation) => {
    const target = mutation.target?.nodeType === Node.TEXT_NODE ? mutation.target.parentElement : mutation.target
    return target?.closest?.('a[href="/dashboard/"][data-i18n="signIn"], a[href="/dashboard/"][data-i18n="startFree"]')
  })
  if (!relevant || authRenderQueued) return
  authRenderQueued = true
  requestAnimationFrame(() => {
    authRenderQueued = false
    renderAuthState()
  })
})

authCopyObserver.observe(document.body, { subtree: true, childList: true, characterData: true })

clerk.addListener(({ user }) => {
  renderAuthState()

  if (user) {
    try {
      clerk.closeSignIn()
    } catch {}
  }
})

renderAuthState()

console.log('Elofid Auth ready', {
  signedIn: Boolean(clerk.user),
  userId: clerk.user?.id || null,
})
