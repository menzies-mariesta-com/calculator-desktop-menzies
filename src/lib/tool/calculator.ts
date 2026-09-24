/** Pure calculator helpers: formatting, binary ops, and expression evaluation. */

export type CalcOp = '+' | '-' | '*' | '/';
export type AngleMode = 'deg' | 'rad';

export interface HistoryEntry {
	id: string;
	expression: string;
	result: string;
}

export interface CalcSnapshot {
	expression: string;
	display: string;
	fresh: boolean;
}

const MAX_HISTORY = 50;

export function formatDisplay(value: number): string {
	if (!Number.isFinite(value)) return 'Error';
	const rounded = Math.round(value * 1e12) / 1e12;
	const text = String(rounded);
	return text.length > 16 ? rounded.toExponential(8) : text;
}

export function applyOp(left: number, op: CalcOp, right: number): number {
	switch (op) {
		case '+':
			return left + right;
		case '-':
			return left - right;
		case '*':
			return left * right;
		case '/':
			return right === 0 ? Number.NaN : left / right;
	}
}

function toRadians(value: number, mode: AngleMode): number {
	return mode === 'deg' ? (value * Math.PI) / 180 : value;
}

type Token =
	| { kind: 'num'; value: number }
	| { kind: 'op'; value: string }
	| { kind: 'lparen' }
	| { kind: 'rparen' }
	| { kind: 'fn'; value: string }
	| { kind: 'const'; value: number };

const FUNCTIONS = new Set(['sin', 'cos', 'tan', 'log', 'ln', 'sqrt']);

function tokenize(input: string): Token[] {
	const src = input.replace(/\s+/g, '').toLowerCase();
	const tokens: Token[] = [];
	let i = 0;

	while (i < src.length) {
		const ch = src[i]!;

		if (ch >= '0' && ch <= '9') {
			let j = i + 1;
			while (j < src.length && ((src[j]! >= '0' && src[j]! <= '9') || src[j] === '.')) j++;
			const raw = src.slice(i, j);
			const value = Number(raw);
			if (!Number.isFinite(value)) throw new Error('Invalid number');
			tokens.push({ kind: 'num', value });
			i = j;
			continue;
		}

		if (ch === '.') {
			let j = i + 1;
			while (j < src.length && src[j]! >= '0' && src[j]! <= '9') j++;
			const raw = src.slice(i, j);
			const value = Number(raw);
			if (!Number.isFinite(value)) throw new Error('Invalid number');
			tokens.push({ kind: 'num', value });
			i = j;
			continue;
		}

		if (ch === '(') {
			tokens.push({ kind: 'lparen' });
			i++;
			continue;
		}
		if (ch === ')') {
			tokens.push({ kind: 'rparen' });
			i++;
			continue;
		}

		if ('+-*/^%'.includes(ch)) {
			const prev = tokens[tokens.length - 1];
			const unary =
				ch === '-' &&
				(tokens.length === 0 ||
					prev?.kind === 'op' ||
					prev?.kind === 'lparen' ||
					prev?.kind === 'fn');
			if (unary) {
				tokens.push({ kind: 'op', value: 'u-' });
			} else {
				tokens.push({ kind: 'op', value: ch });
			}
			i++;
			continue;
		}

		if (ch === 'π' || (ch === 'p' && src.slice(i, i + 2) === 'pi')) {
			tokens.push({ kind: 'const', value: Math.PI });
			i += ch === 'π' ? 1 : 2;
			continue;
		}

		if (ch === 'e' && (i + 1 >= src.length || !/[a-z]/.test(src[i + 1]!))) {
			tokens.push({ kind: 'const', value: Math.E });
			i++;
			continue;
		}

		let j = i;
		while (j < src.length && src[j]! >= 'a' && src[j]! <= 'z') j++;
		const name = src.slice(i, j);
		if (FUNCTIONS.has(name)) {
			tokens.push({ kind: 'fn', value: name });
			i = j;
			continue;
		}

		throw new Error(`Unexpected token near "${src.slice(i, i + 8)}"`);
	}

	return tokens;
}

function precedence(op: string): number {
	switch (op) {
		case 'u-':
			return 4;
		case '^':
			return 3;
		case '*':
		case '/':
		case '%':
			return 2;
		case '+':
		case '-':
			return 1;
		default:
			return 0;
	}
}

function rightAssociative(op: string): boolean {
	return op === '^' || op === 'u-';
}

function toRpn(tokens: Token[]): Token[] {
	const output: Token[] = [];
	const stack: Token[] = [];

	for (const token of tokens) {
		if (token.kind === 'num' || token.kind === 'const') {
			output.push(token);
			continue;
		}
		if (token.kind === 'fn') {
			stack.push(token);
			continue;
		}
		if (token.kind === 'op') {
			while (stack.length > 0) {
				const top = stack[stack.length - 1]!;
				if (top.kind !== 'op') break;
				const move =
					(!rightAssociative(token.value) && precedence(top.value) >= precedence(token.value)) ||
					(rightAssociative(token.value) && precedence(top.value) > precedence(token.value));
				if (!move) break;
				output.push(stack.pop()!);
			}
			stack.push(token);
			continue;
		}
		if (token.kind === 'lparen') {
			stack.push(token);
			continue;
		}
		if (token.kind === 'rparen') {
			while (stack.length > 0 && stack[stack.length - 1]!.kind !== 'lparen') {
				output.push(stack.pop()!);
			}
			if (stack.length === 0) throw new Error('Mismatched parentheses');
			stack.pop();
			if (stack.length > 0 && stack[stack.length - 1]!.kind === 'fn') {
				output.push(stack.pop()!);
			}
		}
	}

	while (stack.length > 0) {
		const top = stack.pop()!;
		if (top.kind === 'lparen' || top.kind === 'rparen') throw new Error('Mismatched parentheses');
		output.push(top);
	}

	return output;
}

function applyFn(name: string, value: number, angleMode: AngleMode): number {
	switch (name) {
		case 'sin':
			return Math.sin(toRadians(value, angleMode));
		case 'cos':
			return Math.cos(toRadians(value, angleMode));
		case 'tan':
			return Math.tan(toRadians(value, angleMode));
		case 'log':
			return value <= 0 ? Number.NaN : Math.log10(value);
		case 'ln':
			return value <= 0 ? Number.NaN : Math.log(value);
		case 'sqrt':
			return value < 0 ? Number.NaN : Math.sqrt(value);
		default:
			return Number.NaN;
	}
}

function evalRpn(rpn: Token[], angleMode: AngleMode): number {
	const stack: number[] = [];

	for (const token of rpn) {
		if (token.kind === 'num' || token.kind === 'const') {
			stack.push(token.value);
			continue;
		}
		if (token.kind === 'fn') {
			const a = stack.pop();
			if (a === undefined) throw new Error('Invalid expression');
			stack.push(applyFn(token.value, a, angleMode));
			continue;
		}
		if (token.kind === 'op') {
			if (token.value === 'u-') {
				const a = stack.pop();
				if (a === undefined) throw new Error('Invalid expression');
				stack.push(-a);
				continue;
			}
			const b = stack.pop();
			const a = stack.pop();
			if (a === undefined || b === undefined) throw new Error('Invalid expression');
			switch (token.value) {
				case '+':
					stack.push(a + b);
					break;
				case '-':
					stack.push(a - b);
					break;
				case '*':
					stack.push(a * b);
					break;
				case '/':
					stack.push(b === 0 ? Number.NaN : a / b);
					break;
				case '%':
					stack.push(b === 0 ? Number.NaN : a % b);
					break;
				case '^':
					stack.push(a ** b);
					break;
				default:
					throw new Error('Unknown operator');
			}
		}
	}

	if (stack.length !== 1) throw new Error('Invalid expression');
	return stack[0]!;
}

/** Evaluate a mathematical expression. Returns NaN on domain errors. */
export function evaluateExpression(expression: string, angleMode: AngleMode = 'deg'): number {
	const trimmed = expression.trim();
	if (!trimmed) return Number.NaN;
	try {
		const tokens = tokenize(trimmed);
		if (tokens.length === 0) return Number.NaN;
		const rpn = toRpn(tokens);
		return evalRpn(rpn, angleMode);
	} catch {
		return Number.NaN;
	}
}

export function createHistoryEntry(expression: string, result: string): HistoryEntry {
	return {
		id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
		expression,
		result
	};
}

export function prependHistory(list: HistoryEntry[], entry: HistoryEntry): HistoryEntry[] {
	return [entry, ...list].slice(0, MAX_HISTORY);
}
