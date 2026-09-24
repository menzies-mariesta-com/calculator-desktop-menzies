import { describe, expect, it } from 'vitest';
import {
	applyOp,
	evaluateExpression,
	formatDisplay,
	prependHistory,
	createHistoryEntry
} from './calculator';
import { convertUnit, formatUnitValue } from './units';

describe('calculator', () => {
	it('adds and formats', () => {
		expect(applyOp(2, '+', 3)).toBe(5);
		expect(formatDisplay(5)).toBe('5');
	});

	it('guards divide by zero', () => {
		expect(Number.isNaN(applyOp(1, '/', 0))).toBe(true);
		expect(formatDisplay(Number.NaN)).toBe('Error');
	});

	it('evaluates scientific expressions in degrees', () => {
		expect(evaluateExpression('2+3*4')).toBe(14);
		expect(evaluateExpression('(2+3)*4')).toBe(20);
		expect(evaluateExpression('2^10')).toBe(1024);
		expect(evaluateExpression('sqrt(16)')).toBe(4);
		expect(evaluateExpression('sin(90)', 'deg')).toBeCloseTo(1, 10);
		expect(evaluateExpression('cos(0)', 'deg')).toBeCloseTo(1, 10);
		expect(evaluateExpression('log(100)')).toBeCloseTo(2, 10);
		expect(evaluateExpression('ln(e)')).toBeCloseTo(1, 10);
		expect(evaluateExpression('pi')).toBeCloseTo(Math.PI, 10);
	});

	it('evaluates radians mode', () => {
		expect(evaluateExpression('sin(pi/2)', 'rad')).toBeCloseTo(1, 10);
	});

	it('prepends history with a cap', () => {
		const a = createHistoryEntry('1+1', '2');
		const b = createHistoryEntry('2+2', '4');
		const list = prependHistory([a], b);
		expect(list[0]?.expression).toBe('2+2');
		expect(list).toHaveLength(2);
	});
});

describe('units', () => {
	it('converts length', () => {
		expect(convertUnit(1, 'km', 'm', 'length')).toBe(1000);
		expect(convertUnit(12, 'in', 'ft', 'length')).toBeCloseTo(1, 10);
	});

	it('converts temperature', () => {
		expect(convertUnit(0, 'c', 'f', 'temperature')).toBeCloseTo(32, 10);
		expect(convertUnit(32, 'f', 'c', 'temperature')).toBeCloseTo(0, 10);
		expect(convertUnit(0, 'c', 'k', 'temperature')).toBeCloseTo(273.15, 10);
		expect(convertUnit(273.15, 'k', 'c', 'temperature')).toBeCloseTo(0, 10);
	});

	it('converts mass, volume, and area', () => {
		expect(convertUnit(1, 'kg', 'g', 'mass')).toBeCloseTo(1000, 10);
		expect(convertUnit(1, 'l', 'ml', 'volume')).toBeCloseTo(1000, 10);
		expect(convertUnit(1, 'ha', 'm2', 'area')).toBeCloseTo(10_000, 10);
	});

	it('converts speed, time, and angle', () => {
		expect(convertUnit(36, 'kph', 'mps', 'speed')).toBeCloseTo(10, 10);
		expect(convertUnit(1, 'h', 's', 'time')).toBe(3600);
		expect(convertUnit(180, 'deg', 'rad', 'angle')).toBeCloseTo(Math.PI, 10);
	});

	it('converts digital storage and data rate', () => {
		expect(convertUnit(1, 'KiB', 'B', 'digital')).toBe(1024);
		expect(convertUnit(1, 'KB', 'B', 'digital')).toBe(1000);
		expect(convertUnit(1, 'Mbps', 'kbps', 'data_rate')).toBeCloseTo(1000, 10);
	});

	it('converts pressure, energy, power, and frequency', () => {
		expect(convertUnit(1, 'bar', 'Pa', 'pressure')).toBeCloseTo(100_000, 6);
		expect(convertUnit(1, 'kWh', 'J', 'energy')).toBeCloseTo(3_600_000, 6);
		expect(convertUnit(1, 'kW', 'W', 'power')).toBe(1000);
		expect(convertUnit(60, 'rpm', 'Hz', 'frequency')).toBeCloseTo(1, 10);
	});

	it('formats unit values', () => {
		expect(formatUnitValue(1.5)).toBe('1.5');
		expect(formatUnitValue(Number.NaN)).toBe('Error');
	});
});
