/**
 * Lucide icon nodes for Svelte, matching Wash UI's lucide-react 1.28.0 pin
 * (`@menzies-mariesta-com/menzies-design-wash-ui/icons`).
 *
 * Import `__iconNode` synchronously from each icon module. Do **not** use
 * top-level `await` + `dynamicIconImports` here: that suspends `+layout.svelte`
 * evaluation and triggers WebKitGTK / Tauri
 * `ReferenceError: Cannot access 'component' before initialization` when
 * SvelteKit reads the live `component` export from `nodes/0.js`.
 *
 * Also avoid `@menzies-mariesta-com/menzies-design-wash-ui/icons` barrel imports
 * in the app boot graph: that entry re-exports all of lucide-react.
 */
import { __iconNode as activity } from 'lucide-react/dist/esm/icons/activity.mjs';
import { __iconNode as arrowLeftRight } from 'lucide-react/dist/esm/icons/arrow-left-right.mjs';
import { __iconNode as audioLines } from 'lucide-react/dist/esm/icons/audio-lines.mjs';
import { __iconNode as beaker } from 'lucide-react/dist/esm/icons/beaker.mjs';
import { __iconNode as bolt } from 'lucide-react/dist/esm/icons/bolt.mjs';
import { __iconNode as check } from 'lucide-react/dist/esm/icons/check.mjs';
import { __iconNode as chevronDown } from 'lucide-react/dist/esm/icons/chevron-down.mjs';
import { __iconNode as clock } from 'lucide-react/dist/esm/icons/clock.mjs';
import { __iconNode as compass } from 'lucide-react/dist/esm/icons/compass.mjs';
import { __iconNode as copy } from 'lucide-react/dist/esm/icons/copy.mjs';
import { __iconNode as deleteIcon } from 'lucide-react/dist/esm/icons/delete.mjs';
import { __iconNode as download } from 'lucide-react/dist/esm/icons/download.mjs';
import { __iconNode as gauge } from 'lucide-react/dist/esm/icons/gauge.mjs';
import { __iconNode as hardDrive } from 'lucide-react/dist/esm/icons/hard-drive.mjs';
import { __iconNode as layoutGrid } from 'lucide-react/dist/esm/icons/layout-grid.mjs';
import { __iconNode as menu } from 'lucide-react/dist/esm/icons/menu.mjs';
import { __iconNode as minus } from 'lucide-react/dist/esm/icons/minus.mjs';
import { __iconNode as ruler } from 'lucide-react/dist/esm/icons/ruler.mjs';
import { __iconNode as scale } from 'lucide-react/dist/esm/icons/scale.mjs';
import { __iconNode as square } from 'lucide-react/dist/esm/icons/square.mjs';
import { __iconNode as sun } from 'lucide-react/dist/esm/icons/sun.mjs';
import { __iconNode as thermometer } from 'lucide-react/dist/esm/icons/thermometer.mjs';
import { __iconNode as wifi } from 'lucide-react/dist/esm/icons/wifi.mjs';
import { __iconNode as x } from 'lucide-react/dist/esm/icons/x.mjs';
import { __iconNode as zap } from 'lucide-react/dist/esm/icons/zap.mjs';
import type { WashIconNode } from '$lib/tool/wash-icon-node';

export type { WashIconNode };

export const washIcons = {
	sun,
	download,
	minus,
	square,
	copy,
	x,
	menu,
	delete: deleteIcon,
	'arrow-left-right': arrowLeftRight,
	'chevron-down': chevronDown,
	check,
	ruler,
	scale,
	thermometer,
	beaker,
	'layout-grid': layoutGrid,
	gauge,
	clock,
	'hard-drive': hardDrive,
	activity,
	zap,
	bolt,
	compass,
	'audio-lines': audioLines,
	wifi
} as const satisfies Record<string, WashIconNode>;

/** Units category keys → Wash Lucide icon names. */
export const categoryWashIcon = {
	ruler: 'ruler',
	scale: 'scale',
	thermometer: 'thermometer',
	beaker: 'beaker',
	square: 'layout-grid',
	gauge: 'gauge',
	clock: 'clock',
	'hard-drive': 'hard-drive',
	activity: 'activity',
	zap: 'zap',
	bolt: 'bolt',
	compass: 'compass',
	waveform: 'audio-lines',
	wifi: 'wifi'
} as const satisfies Record<string, keyof typeof washIcons>;
