import { isWatercolorTheme } from '@menzies-mariesta-com/menzies-design-wash-ui/core';
import { z } from 'zod';

/** Appearance preference: Wash paper mode or follow OS. */
export const appearanceModeSchema = z.enum(['light', 'dark', 'system']);
export type AppearanceMode = z.infer<typeof appearanceModeSchema>;

export const appViewSchema = z.enum(['calculator', 'units']);
export type AppView = z.infer<typeof appViewSchema>;

export const calcPadModeSchema = z.enum(['standard', 'scientific']);
export type CalcPadMode = z.infer<typeof calcPadModeSchema>;

export const angleModeSchema = z.enum(['deg', 'rad']);
export type AngleModeSetting = z.infer<typeof angleModeSchema>;

/** Default Wash pigment (brand theme). Id is `vermilion` in Wash UI. */
export const DEFAULT_PIGMENT = 'vermilion' as const;

export const settingsSchema = z.object({
	appearance: appearanceModeSchema.default('system'),
	/** Wash watercolor pigment id */
	pigment: z
		.string()
		.min(1)
		.default(DEFAULT_PIGMENT)
		.transform((value) => (isWatercolorTheme(value) ? value : DEFAULT_PIGMENT)),
	appView: appViewSchema.default('calculator'),
	calcPadMode: calcPadModeSchema.default('standard'),
	angleMode: angleModeSchema.default('deg')
});

export type AppSettings = z.infer<typeof settingsSchema>;

export const SETTINGS_STORAGE_KEY = 'com.mariesta.menzies.calculator-desktop-menzies.settings';

export function loadSettings(): AppSettings {
	if (typeof localStorage === 'undefined') {
		return settingsSchema.parse({});
	}
	try {
		const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
		if (!raw) return settingsSchema.parse({});
		return settingsSchema.parse(JSON.parse(raw));
	} catch {
		return settingsSchema.parse({});
	}
}

export function saveSettings(settings: AppSettings): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}
