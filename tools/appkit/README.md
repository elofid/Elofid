# Self-hosted Reown AppKit

The wallet connection window (Reown AppKit) used to be loaded from esm.sh at the
moment a user clicked Connect. esm.sh builds packages on the fly, so the code could
change without anything changing here, and no integrity check is possible.

This folder builds one fixed copy into `assets/vendor/appkit-<version>/`, which the
Firewall and Security pages import from the site itself.

## Rebuild

```sh
cd tools/appkit
npm ci          # exact versions from package-lock.json
npm run build   # writes ../../assets/vendor/appkit-<version>/
```

The build is reproducible: the same `package-lock.json` gives byte-identical files.

## Updating AppKit

Files in `assets/vendor/` are served with a one-year cache, so never change them in
place. To update:

1. Change the versions in `package.json`, run `npm install`, then `npm run build`.
2. The output goes to a new folder (`appkit-<new version>`). Update the
   `import("/assets/vendor/appkit-…/appkit.js")` line in `firewall/index.html` and
   `security/index.html`.
3. Test a wallet connection, then delete the old folder.

If you rebuild the same AppKit version with different dependencies, rename the
output folder (for example `appkit-1.8.24-2`) for the same reason.

## License

Reown AppKit is distributed under the Reown Community License, copied next to the
bundle as `assets/vendor/appkit-<version>/LICENSE.md`.

Portions © 2025 Reown, Inc. All Rights Reserved.
