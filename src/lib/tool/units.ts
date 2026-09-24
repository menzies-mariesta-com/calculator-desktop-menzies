import { z } from 'zod';

export const unitCategorySchema = z.enum([
	'length',
	'mass',
	'temperature',
	'volume',
	'area',
	'speed',
	'time',
	'digital',
	'pressure',
	'energy',
	'power',
	'angle',
	'frequency',
	'data_rate'
]);
export type UnitCategory = z.infer<typeof unitCategorySchema>;

export interface UnitDef {
	id: string;
	label: string;
	/** Factor to base unit, or special for temperature. */
	toBase: number | 'celsius' | 'fahrenheit' | 'kelvin';
}

export interface CategoryMeta {
	id: UnitCategory;
	label: string;
	blurb: string;
	/** Lucide-style icon key used by the Units UI. */
	icon: CategoryIcon;
}

export type CategoryIcon =
	| 'ruler'
	| 'scale'
	| 'thermometer'
	| 'beaker'
	| 'square'
	| 'gauge'
	| 'clock'
	| 'hard-drive'
	| 'activity'
	| 'zap'
	| 'bolt'
	| 'compass'
	| 'waveform'
	| 'wifi';

const LENGTH: UnitDef[] = [
	{ id: 'm', label: 'Metre (m)', toBase: 1 },
	{ id: 'km', label: 'Kilometre (km)', toBase: 1000 },
	{ id: 'cm', label: 'Centimetre (cm)', toBase: 0.01 },
	{ id: 'mm', label: 'Millimetre (mm)', toBase: 0.001 },
	{ id: 'um', label: 'Micrometre (µm)', toBase: 1e-6 },
	{ id: 'nm', label: 'Nanometre (nm)', toBase: 1e-9 },
	{ id: 'mi', label: 'Mile (mi)', toBase: 1609.344 },
	{ id: 'yd', label: 'Yard (yd)', toBase: 0.9144 },
	{ id: 'ft', label: 'Foot (ft)', toBase: 0.3048 },
	{ id: 'in', label: 'Inch (in)', toBase: 0.0254 },
	{ id: 'nmi', label: 'Nautical mile (nmi)', toBase: 1852 }
];

const MASS: UnitDef[] = [
	{ id: 'kg', label: 'Kilogram (kg)', toBase: 1 },
	{ id: 'g', label: 'Gram (g)', toBase: 0.001 },
	{ id: 'mg', label: 'Milligram (mg)', toBase: 0.000001 },
	{ id: 'ug', label: 'Microgram (µg)', toBase: 1e-9 },
	{ id: 't', label: 'Tonne (t)', toBase: 1000 },
	{ id: 'lb', label: 'Pound (lb)', toBase: 0.45359237 },
	{ id: 'oz', label: 'Ounce (oz)', toBase: 0.028349523125 },
	{ id: 'st', label: 'Stone (st)', toBase: 6.35029318 }
];

const TEMPERATURE: UnitDef[] = [
	{ id: 'c', label: 'Celsius (°C)', toBase: 'celsius' },
	{ id: 'f', label: 'Fahrenheit (°F)', toBase: 'fahrenheit' },
	{ id: 'k', label: 'Kelvin (K)', toBase: 'kelvin' }
];

const VOLUME: UnitDef[] = [
	{ id: 'l', label: 'Litre (L)', toBase: 1 },
	{ id: 'ml', label: 'Millilitre (mL)', toBase: 0.001 },
	{ id: 'm3', label: 'Cubic metre (m³)', toBase: 1000 },
	{ id: 'cm3', label: 'Cubic centimetre (cm³)', toBase: 0.001 },
	{ id: 'gal', label: 'US gallon (gal)', toBase: 3.785411784 },
	{ id: 'qt', label: 'US quart (qt)', toBase: 0.946352946 },
	{ id: 'pt', label: 'US pint (pt)', toBase: 0.473176473 },
	{ id: 'cup', label: 'US cup', toBase: 0.2365882365 },
	{ id: 'floz', label: 'US fluid ounce (fl oz)', toBase: 0.0295735295625 },
	{ id: 'tbsp', label: 'US tablespoon (tbsp)', toBase: 0.01478676478125 },
	{ id: 'tsp', label: 'US teaspoon (tsp)', toBase: 0.00492892159375 },
	{ id: 'igal', label: 'Imperial gallon (imp gal)', toBase: 4.54609 }
];

const AREA: UnitDef[] = [
	{ id: 'm2', label: 'Square metre (m²)', toBase: 1 },
	{ id: 'km2', label: 'Square kilometre (km²)', toBase: 1_000_000 },
	{ id: 'ha', label: 'Hectare (ha)', toBase: 10_000 },
	{ id: 'acre', label: 'Acre', toBase: 4046.8564224 },
	{ id: 'ft2', label: 'Square foot (ft²)', toBase: 0.09290304 },
	{ id: 'yd2', label: 'Square yard (yd²)', toBase: 0.83612736 },
	{ id: 'in2', label: 'Square inch (in²)', toBase: 0.00064516 },
	{ id: 'mi2', label: 'Square mile (mi²)', toBase: 2_589_988.110336 }
];

const SPEED: UnitDef[] = [
	{ id: 'mps', label: 'Metres per second (m/s)', toBase: 1 },
	{ id: 'kph', label: 'Kilometres per hour (km/h)', toBase: 1 / 3.6 },
	{ id: 'mph', label: 'Miles per hour (mph)', toBase: 0.44704 },
	{ id: 'knot', label: 'Knot (kn)', toBase: 0.514444 },
	{ id: 'ftps', label: 'Feet per second (ft/s)', toBase: 0.3048 },
	{ id: 'mach', label: 'Mach (sea level)', toBase: 340.29 }
];

const TIME: UnitDef[] = [
	{ id: 'ns', label: 'Nanosecond (ns)', toBase: 1e-9 },
	{ id: 'us', label: 'Microsecond (µs)', toBase: 1e-6 },
	{ id: 'ms', label: 'Millisecond (ms)', toBase: 0.001 },
	{ id: 's', label: 'Second (s)', toBase: 1 },
	{ id: 'min', label: 'Minute (min)', toBase: 60 },
	{ id: 'h', label: 'Hour (h)', toBase: 3600 },
	{ id: 'd', label: 'Day (d)', toBase: 86_400 },
	{ id: 'wk', label: 'Week (wk)', toBase: 604_800 },
	{ id: 'yr', label: 'Year (365 d)', toBase: 31_536_000 }
];

/** Base: byte. Decimal SI and binary IEC prefixes. */
const DIGITAL: UnitDef[] = [
	{ id: 'bit', label: 'Bit (b)', toBase: 0.125 },
	{ id: 'B', label: 'Byte (B)', toBase: 1 },
	{ id: 'KB', label: 'Kilobyte (KB)', toBase: 1000 },
	{ id: 'KiB', label: 'Kibibyte (KiB)', toBase: 1024 },
	{ id: 'MB', label: 'Megabyte (MB)', toBase: 1_000_000 },
	{ id: 'MiB', label: 'Mebibyte (MiB)', toBase: 1_048_576 },
	{ id: 'GB', label: 'Gigabyte (GB)', toBase: 1_000_000_000 },
	{ id: 'GiB', label: 'Gibibyte (GiB)', toBase: 1_073_741_824 },
	{ id: 'TB', label: 'Terabyte (TB)', toBase: 1_000_000_000_000 },
	{ id: 'TiB', label: 'Tebibyte (TiB)', toBase: 1_099_511_627_776 }
];

/** Base: pascal (Pa). */
const PRESSURE: UnitDef[] = [
	{ id: 'Pa', label: 'Pascal (Pa)', toBase: 1 },
	{ id: 'kPa', label: 'Kilopascal (kPa)', toBase: 1000 },
	{ id: 'MPa', label: 'Megapascal (MPa)', toBase: 1_000_000 },
	{ id: 'bar', label: 'Bar', toBase: 100_000 },
	{ id: 'mbar', label: 'Millibar (mbar)', toBase: 100 },
	{ id: 'psi', label: 'Pound per square inch (psi)', toBase: 6894.757293168 },
	{ id: 'atm', label: 'Atmosphere (atm)', toBase: 101_325 },
	{ id: 'torr', label: 'Torr', toBase: 133.322368421 }
];

/** Base: joule (J). */
const ENERGY: UnitDef[] = [
	{ id: 'J', label: 'Joule (J)', toBase: 1 },
	{ id: 'kJ', label: 'Kilojoule (kJ)', toBase: 1000 },
	{ id: 'cal', label: 'Calorie (cal)', toBase: 4.184 },
	{ id: 'kcal', label: 'Kilocalorie (kcal)', toBase: 4184 },
	{ id: 'Wh', label: 'Watt-hour (Wh)', toBase: 3600 },
	{ id: 'kWh', label: 'Kilowatt-hour (kWh)', toBase: 3_600_000 },
	{ id: 'eV', label: 'Electronvolt (eV)', toBase: 1.602176634e-19 },
	{ id: 'BTU', label: 'British thermal unit (BTU)', toBase: 1055.05585262 }
];

/** Base: watt (W). */
const POWER: UnitDef[] = [
	{ id: 'W', label: 'Watt (W)', toBase: 1 },
	{ id: 'mW', label: 'Milliwatt (mW)', toBase: 0.001 },
	{ id: 'kW', label: 'Kilowatt (kW)', toBase: 1000 },
	{ id: 'MW', label: 'Megawatt (MW)', toBase: 1_000_000 },
	{ id: 'hp', label: 'Horsepower (hp)', toBase: 745.6998715822702 },
	{ id: 'BTUh', label: 'BTU per hour', toBase: 0.29307107017222 }
];

/** Base: radian. */
const ANGLE: UnitDef[] = [
	{ id: 'rad', label: 'Radian (rad)', toBase: 1 },
	{ id: 'deg', label: 'Degree (°)', toBase: Math.PI / 180 },
	{ id: 'gon', label: 'Gradian (gon)', toBase: Math.PI / 200 },
	{ id: 'arcmin', label: 'Arcminute (′)', toBase: Math.PI / (180 * 60) },
	{ id: 'arcsec', label: 'Arcsecond (″)', toBase: Math.PI / (180 * 3600) },
	{ id: 'turn', label: 'Turn', toBase: Math.PI * 2 }
];

/** Base: hertz (Hz). */
const FREQUENCY: UnitDef[] = [
	{ id: 'Hz', label: 'Hertz (Hz)', toBase: 1 },
	{ id: 'kHz', label: 'Kilohertz (kHz)', toBase: 1000 },
	{ id: 'MHz', label: 'Megahertz (MHz)', toBase: 1_000_000 },
	{ id: 'GHz', label: 'Gigahertz (GHz)', toBase: 1_000_000_000 },
	{ id: 'rpm', label: 'Revolutions per minute (rpm)', toBase: 1 / 60 }
];

/** Base: bit per second. */
const DATA_RATE: UnitDef[] = [
	{ id: 'bps', label: 'Bit per second (bit/s)', toBase: 1 },
	{ id: 'kbps', label: 'Kilobit per second (kbit/s)', toBase: 1000 },
	{ id: 'Mbps', label: 'Megabit per second (Mbit/s)', toBase: 1_000_000 },
	{ id: 'Gbps', label: 'Gigabit per second (Gbit/s)', toBase: 1_000_000_000 },
	{ id: 'Bps', label: 'Byte per second (B/s)', toBase: 8 },
	{ id: 'KBps', label: 'Kilobyte per second (KB/s)', toBase: 8000 },
	{ id: 'MBps', label: 'Megabyte per second (MB/s)', toBase: 8_000_000 },
	{ id: 'MiBps', label: 'Mebibyte per second (MiB/s)', toBase: 8_388_608 }
];

export const UNITS_BY_CATEGORY: Record<UnitCategory, UnitDef[]> = {
	length: LENGTH,
	mass: MASS,
	temperature: TEMPERATURE,
	volume: VOLUME,
	area: AREA,
	speed: SPEED,
	time: TIME,
	digital: DIGITAL,
	pressure: PRESSURE,
	energy: ENERGY,
	power: POWER,
	angle: ANGLE,
	frequency: FREQUENCY,
	data_rate: DATA_RATE
};

export const CATEGORY_META: CategoryMeta[] = [
	{ id: 'length', label: 'Length', blurb: 'Distance and dimension.', icon: 'ruler' },
	{ id: 'mass', label: 'Mass / Weight', blurb: 'Mass and common weight units.', icon: 'scale' },
	{ id: 'temperature', label: 'Temperature', blurb: 'Celsius, Fahrenheit, and Kelvin.', icon: 'thermometer' },
	{ id: 'volume', label: 'Volume / Capacity', blurb: 'Liquid and cubic measures.', icon: 'beaker' },
	{ id: 'area', label: 'Area', blurb: 'Surface and land area.', icon: 'square' },
	{ id: 'speed', label: 'Speed', blurb: 'Velocity and travel rate.', icon: 'gauge' },
	{ id: 'time', label: 'Time', blurb: 'Duration from nanoseconds to years.', icon: 'clock' },
	{ id: 'digital', label: 'Digital storage', blurb: 'Bits, bytes, and storage prefixes.', icon: 'hard-drive' },
	{ id: 'pressure', label: 'Pressure', blurb: 'Force per area.', icon: 'activity' },
	{ id: 'energy', label: 'Energy', blurb: 'Work and heat.', icon: 'zap' },
	{ id: 'power', label: 'Power', blurb: 'Rate of energy transfer.', icon: 'bolt' },
	{ id: 'angle', label: 'Angle', blurb: 'Plane angle measures.', icon: 'compass' },
	{ id: 'frequency', label: 'Frequency', blurb: 'Cycles and revolutions.', icon: 'waveform' },
	{ id: 'data_rate', label: 'Data transfer rate', blurb: 'Network and throughput rates.', icon: 'wifi' }
];

export const CATEGORY_LABELS: Record<UnitCategory, string> = Object.fromEntries(
	CATEGORY_META.map((c) => [c.id, c.label])
) as Record<UnitCategory, string>;

export function getCategoryMeta(id: UnitCategory): CategoryMeta {
	return CATEGORY_META.find((c) => c.id === id) ?? CATEGORY_META[0]!;
}

export function getUnitLabel(category: UnitCategory, unitId: string): string {
	return UNITS_BY_CATEGORY[category].find((u) => u.id === unitId)?.label ?? unitId;
}

function toKelvin(value: number, unit: UnitDef['toBase']): number {
	if (unit === 'celsius') return value + 273.15;
	if (unit === 'fahrenheit') return ((value - 32) * 5) / 9 + 273.15;
	if (unit === 'kelvin') return value;
	return Number.NaN;
}

function fromKelvin(kelvin: number, unit: UnitDef['toBase']): number {
	if (unit === 'celsius') return kelvin - 273.15;
	if (unit === 'fahrenheit') return ((kelvin - 273.15) * 9) / 5 + 32;
	if (unit === 'kelvin') return kelvin;
	return Number.NaN;
}

export function convertUnit(
	value: number,
	fromId: string,
	toId: string,
	category: UnitCategory
): number {
	if (!Number.isFinite(value)) return Number.NaN;
	const units = UNITS_BY_CATEGORY[category];
	const from = units.find((u) => u.id === fromId);
	const to = units.find((u) => u.id === toId);
	if (!from || !to) return Number.NaN;

	if (category === 'temperature') {
		const kelvin = toKelvin(value, from.toBase);
		return fromKelvin(kelvin, to.toBase);
	}

	if (typeof from.toBase !== 'number' || typeof to.toBase !== 'number') return Number.NaN;
	const base = value * from.toBase;
	return base / to.toBase;
}

export function formatUnitValue(value: number): string {
	if (!Number.isFinite(value)) return 'Error';
	const rounded = Math.round(value * 1e10) / 1e10;
	const text = String(rounded);
	return text.length > 18 ? rounded.toExponential(8) : text;
}
