# Architecture

## Stack

- Frontend: SvelteKit (`adapter-static`) + Tailwind 4 + `@menzies-mariesta-com/menzies-design-wash-ui`
- i18n: Paraglide (`messages/en.json`)
- Validation: Zod (`src/lib/store/local-storage/settings.ts`, `src/lib/tool/updater.ts`)
- Shell: Tauri 2 (`src-tauri/`), identifier `com.mariesta.menzies.calculator-desktop-menzies`

## IPC

| Surface                | Purpose                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `app_paths`            | Resolve and ensure Menzies config/data directories            |
| Window APIs            | Minimize, maximize, close, drag                               |
| `tauri-plugin-updater` | Check / download / install from GitHub Releases `latest.json` |
| `tauri-plugin-process` | Relaunch after a successful install                           |

## Updater

- Config: `src-tauri/tauri.conf.json` → `plugins.updater` (`pubkey`, `endpoints`) and `bundle.createUpdaterArtifacts`
- Capabilities: `updater:default`, `process:allow-restart`
- UI: Downloads control in `Titlebar.svelte` (after Appearance); logic in `src/lib/tool/updater.ts`
- Placeholders until release is wired: `OWNER/REPO`, `REPLACE_WITH_TAURI_UPDATER_PUBLIC_KEY`

## UI map

- `Titlebar.svelte`: custom decorations, theme menu, Downloads (updater), window controls
- `CalculatorPad.svelte`: history, previous, standard/scientific pad, units mode
- Theme boot: `src/lib/tool/theme.ts` via Wash `initWash` / `applyMode`

## Data

Appearance preference is Zod-validated and stored in `localStorage` for now. Future: settings JSON under the config dir via Tauri commands.
