// Builds /assets/vendor/appkit-<version>/ from the exact versions in package-lock.json.
// Run: npm ci && npm run build   (inside tools/appkit)
import { build } from "esbuild";
import { readFileSync, rmSync, mkdirSync, copyFileSync } from "node:fs";

const version = JSON.parse(readFileSync("node_modules/@reown/appkit/package.json", "utf8")).version;
const outdir = `../../assets/vendor/appkit-${version}`;
rmSync(outdir, { recursive: true, force: true });
mkdirSync(outdir, { recursive: true });

await build({
  entryPoints: { appkit: "entry.js" },
  outdir,
  bundle: true,
  splitting: true,          // parts of the modal load only when they are opened
  format: "esm",
  platform: "browser",
  target: "es2020",
  minify: true,
  legalComments: "eof",
  chunkNames: "chunks/[name]-[hash]",
  define: {
    "process.env.NODE_ENV": '"production"',
    global: "globalThis",
  },
  logLevel: "info",
});

copyFileSync("node_modules/@reown/appkit/LICENSE.md", `${outdir}/LICENSE.md`);
console.log(`Built ${outdir}`);
