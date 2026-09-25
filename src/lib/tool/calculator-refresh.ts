/**
 * Titlebar Refresh → CalculatorPad soft reset.
 * Titlebar calls `requestCalculatorRefresh()`; the pad subscribes and clears display state.
 */

type Listener = () => void;

const listeners = new Set<Listener>();

export function requestCalculatorRefresh(): void {
	for (const listener of listeners) {
		listener();
	}
}

export function subscribeCalculatorRefresh(listener: Listener): () => void {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}
