# Calculator (desktop Menzies)

Linux-first desktop calculator for Menzies OS: SvelteKit static SPA, Tauri 2, Wash UI, Paraglide, Zod.

## App identity

- Tauri identifier: `com.mariesta.menzies.calculator-desktop-menzies`
- Icon: Lucide Calculator + mineral splash (music recipe: paper `#F7F4EF`, blue/ochre/rose); master `static/app-icon.svg`
- Default Wash UI pigment: `vermilion`
- Regenerate Tauri / favicon rasters: `npm run icon:export` (or `scripts/export-app-icon.sh`)

## Requirements

- Node 22+
- Rust 1.77.2+
- Linux system libraries for Tauri (webkitgtk, etc.)

## Develop

```sh
cd calculator-desktop-menzies
npm install
npm run tauri dev
```

Vite and Tauri `devUrl` use port **2001**.

### Using the app

- **Calculator / Units**: top mode tabs.
- **Standard / Scientific**: pad mode (scientific adds trig, log, ln, sqrt, powers, parentheses, π, e, DEG/RAD).
- **History**: left list; click an entry to load its result.
- **Previous**: undo the last edit or evaluation.
- **Downloads** (titlebar, right of Appearance): checks GitHub Releases via Tauri updater, then install and restart if you confirm.
- Titles use Wash **Fraunces** (`font-display`); results use mono.

Browser-only frontend (no native shell):

```sh
npm run dev
```

## Updates (GitHub Releases)

Configured in `src-tauri/tauri.conf.json` under `plugins.updater`:

| Placeholder                             | Replace with                                                  |
| --------------------------------------- | ------------------------------------------------------------- |
| `OWNER/REPO` in `endpoints`             | GitHub owner and repo that publish `latest.json`              |
| `REPLACE_WITH_TAURI_UPDATER_PUBLIC_KEY` | Full contents of the `.pub` file from `tauri signer generate` |

Signing for release builds (shell or CI only; never commit):

```sh
export TAURI_SIGNING_PRIVATE_KEY="path-or-contents-of-private-key"
export TAURI_SIGNING_PRIVATE_KEY_PASSWORD=""  # if set when generating
npm run tauri build
```

Generate keys once:

```sh
npm run tauri signer generate -- -w ~/.tauri/calculator-desktop-menzies.key
```

See `.env.example` for the same notes.

## Build

```sh
npm run tauri build
```

## Paths

| Kind   | Location                                                                    |
| ------ | --------------------------------------------------------------------------- |
| Config | `{config_dir}/menzies/com.mariesta.menzies.calculator-desktop-menzies/`     |
| Data   | `{data_local_dir}/menzies/com.mariesta.menzies.calculator-desktop-menzies/` |

## License

GPL-3.0-or-later. See [LICENSE](LICENSE).
