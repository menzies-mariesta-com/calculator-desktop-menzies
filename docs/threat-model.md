# Threat model

## Assets

- Local settings (appearance preference)
- App logs under the Menzies data directory
- Calculator UI state (ephemeral, not sensitive)
- Updater signing trust (embedded public key; private key never in the app binary)

## Trust boundaries

- Webview ↔ Rust IPC (`app_paths`, window APIs, updater, process relaunch)
- Updater HTTPS to GitHub Releases (`latest.json` and artifact URLs); verified with `plugins.updater.pubkey`
- CSP denies unexpected script/connect origins in the webview (updater network is Rust-side)

## Capabilities

Default deny. Granted:

- `core:default`
- Window: close, minimize, maximize, toggle maximize, is-maximized, start-dragging
- `updater:default` (check, download, install)
- `process:allow-restart`

## Residual risks

- Custom titlebar drag must not start from interactive controls (`data-no-drag`)
- Settings currently in `localStorage` (webview scoped); migrate to config-dir JSON when multi-process needs arise
- Until `OWNER/REPO` and a real pubkey replace placeholders, update checks will fail with a formal error toast (expected)
- Compromised GitHub release or lost private signing key breaks the update channel for existing installs
