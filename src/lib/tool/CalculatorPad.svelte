<script lang="ts">
	import { washRecipes } from '@menzies-mariesta-com/menzies-design-wash-ui/core';
	import { m } from '$lib/paraglide/messages.js';
	import {
		createHistoryEntry,
		evaluateExpression,
		formatDisplay,
		prependHistory,
		type AngleMode,
		type CalcSnapshot,
		type HistoryEntry
	} from '$lib/tool/calculator';
	import {
		loadSettings,
		saveSettings,
		type CalcPadMode
	} from '$lib/store/local-storage/settings';
	import UnitConverter from '$lib/tool/UnitConverter.svelte';
	import WashIcon from '$lib/tool/WashIcon.svelte';
	import { washIcons } from '$lib/tool/wash-icons';

	type AppView = 'calculator' | 'units';

	const initial = loadSettings();
	const MD_QUERY = '(min-width: 768px)';

	let appView = $state<AppView>(initial.appView);
	let padMode = $state<CalcPadMode>(initial.calcPadMode);
	let angleMode = $state<AngleMode>(initial.angleMode);
	let expression = $state('');
	let display = $state('0');
	let fresh = $state(true);
	let history = $state<HistoryEntry[]>([]);
	let undoStack = $state<CalcSnapshot[]>([]);
	let sidebarOpen = $state(false);
	let isDesktop = $state(
		typeof window !== 'undefined' ? window.matchMedia(MD_QUERY).matches : false
	);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const mq = window.matchMedia(MD_QUERY);
		const sync = () => {
			isDesktop = mq.matches;
			if (mq.matches) sidebarOpen = false;
		};
		sync();
		mq.addEventListener('change', sync);
		return () => mq.removeEventListener('change', sync);
	});

	function persistPrefs() {
		const settings = loadSettings();
		settings.appView = appView;
		settings.calcPadMode = padMode;
		settings.angleMode = angleMode;
		saveSettings(settings);
	}

	function pushUndo() {
		undoStack = [{ expression, display, fresh }, ...undoStack].slice(0, 40);
	}

	function setAppView(next: AppView) {
		appView = next;
		persistPrefs();
	}

	function setPadMode(next: CalcPadMode) {
		padMode = next;
		persistPrefs();
	}

	function setAngleMode(next: AngleMode) {
		angleMode = next;
		persistPrefs();
	}

	function clearAll() {
		pushUndo();
		expression = '';
		display = '0';
		fresh = true;
	}

	function backspace() {
		if (fresh && !expression) return;
		pushUndo();
		if (expression.length > 0) {
			expression = expression.slice(0, -1);
			display = expression || '0';
			fresh = expression.length === 0;
			return;
		}
		display = '0';
		fresh = true;
	}

	function appendToken(token: string) {
		pushUndo();
		if (fresh && /[0-9.]/.test(token)) {
			expression = token;
			display = token;
			fresh = false;
			return;
		}
		if (fresh && token !== '.') {
			expression = token;
			display = token;
			fresh = false;
			return;
		}
		expression += token;
		display = expression;
		fresh = false;
	}

	function insertFn(name: string) {
		pushUndo();
		if (fresh) {
			expression = `${name}(`;
		} else {
			expression += `${name}(`;
		}
		display = expression;
		fresh = false;
	}

	function equals() {
		const source = expression.trim() || display;
		if (!source || source === 'Error') return;
		pushUndo();
		const value = evaluateExpression(source, angleMode);
		const resultText = formatDisplay(value);
		history = prependHistory(history, createHistoryEntry(source, resultText));
		expression = resultText === 'Error' ? '' : resultText;
		display = resultText;
		fresh = true;
	}

	function previous() {
		const prior = undoStack[0];
		if (!prior) return;
		undoStack = undoStack.slice(1);
		expression = prior.expression;
		display = prior.display;
		fresh = prior.fresh;
	}

	function pickHistory(entry: HistoryEntry) {
		pushUndo();
		expression = entry.result === 'Error' ? '' : entry.result;
		display = entry.result;
		fresh = true;
		setAppView('calculator');
		if (!isDesktop) sidebarOpen = false;
	}

	function openSidebar() {
		sidebarOpen = true;
	}

	function closeSidebar() {
		sidebarOpen = false;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && sidebarOpen && !isDesktop) {
			event.preventDefault();
			closeSidebar();
			return;
		}
		const calcPadVisible = !isDesktop || appView === 'calculator';
		if (!calcPadVisible) return;
		const target = event.target as HTMLElement | null;
		if (
			target &&
			(target.tagName === 'INPUT' ||
				target.tagName === 'SELECT' ||
				target.tagName === 'TEXTAREA' ||
				target.closest('[role="combobox"], [role="listbox"]'))
		) {
			return;
		}
		const key = event.key;
		if (key >= '0' && key <= '9') {
			event.preventDefault();
			appendToken(key);
			return;
		}
		if (key === '.' || key === ',') {
			event.preventDefault();
			appendToken('.');
			return;
		}
		if (key === '+' || key === '-' || key === '*' || key === '/' || key === '%' || key === '^') {
			event.preventDefault();
			appendToken(key);
			return;
		}
		if (key === '(' || key === ')') {
			event.preventDefault();
			appendToken(key);
			return;
		}
		if (key === 'Enter' || key === '=') {
			event.preventDefault();
			equals();
			return;
		}
		if (key === 'Backspace') {
			event.preventDefault();
			backspace();
			return;
		}
		if (key === 'Escape') {
			event.preventDefault();
			clearAll();
		}
	}

	type KeyDef = {
		id: string;
		label: string;
		action: () => void;
		class?: string;
		aria?: string;
		span?: string;
		icon?: keyof typeof washIcons;
	};

	const scientificKeys = $derived.by((): KeyDef[] => [
		{ id: 'sin', label: 'sin', action: () => insertFn('sin'), class: 'btn-ghost', aria: m.sine() },
		{ id: 'cos', label: 'cos', action: () => insertFn('cos'), class: 'btn-ghost', aria: m.cosine() },
		{ id: 'tan', label: 'tan', action: () => insertFn('tan'), class: 'btn-ghost', aria: m.tangent() },
		{ id: 'log', label: 'log', action: () => insertFn('log'), class: 'btn-ghost', aria: m.log10() },
		{ id: 'ln', label: 'ln', action: () => insertFn('ln'), class: 'btn-ghost', aria: m.natural_log() },
		{ id: 'sqrt', label: '√', action: () => insertFn('sqrt'), class: 'btn-ghost', aria: m.sqrt() },
		{ id: 'pow', label: 'xʸ', action: () => appendToken('^'), class: 'btn-ghost', aria: m.power() },
		{ id: 'lparen', label: '(', action: () => appendToken('('), class: 'btn-ghost', aria: m.open_paren() },
		{ id: 'rparen', label: ')', action: () => appendToken(')'), class: 'btn-ghost', aria: m.close_paren() },
		{ id: 'pi', label: 'π', action: () => appendToken('π'), class: 'btn-ghost', aria: m.pi_const() },
		{ id: 'e', label: 'e', action: () => appendToken('e'), class: 'btn-ghost', aria: m.e_const() },
		{
			id: 'angle',
			label: angleMode === 'deg' ? 'DEG' : 'RAD',
			action: () => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg'),
			class: 'btn-secondary',
			aria: angleMode === 'deg' ? m.angle_deg() : m.angle_rad()
		}
	]);

	const mainKeys: KeyDef[] = [
		{ id: 'ac', label: 'AC', action: clearAll, class: 'btn-ghost', aria: m.clear() },
		{
			id: 'bs',
			label: '⌫',
			action: backspace,
			class: 'btn-ghost',
			aria: m.backspace(),
			icon: 'delete'
		},
		{ id: 'pct', label: '%', action: () => appendToken('%'), class: 'btn-ghost' },
		{ id: 'div', label: '÷', action: () => appendToken('/'), class: 'btn-primary' },
		{ id: '7', label: '7', action: () => appendToken('7') },
		{ id: '8', label: '8', action: () => appendToken('8') },
		{ id: '9', label: '9', action: () => appendToken('9') },
		{ id: 'mul', label: '×', action: () => appendToken('*'), class: 'btn-primary' },
		{ id: '4', label: '4', action: () => appendToken('4') },
		{ id: '5', label: '5', action: () => appendToken('5') },
		{ id: '6', label: '6', action: () => appendToken('6') },
		{ id: 'sub', label: '-', action: () => appendToken('-'), class: 'btn-primary' },
		{ id: '1', label: '1', action: () => appendToken('1') },
		{ id: '2', label: '2', action: () => appendToken('2') },
		{ id: '3', label: '3', action: () => appendToken('3') },
		{ id: 'add', label: '+', action: () => appendToken('+'), class: 'btn-primary' },
		{ id: '0', label: '0', action: () => appendToken('0'), span: 'col-span-2' },
		{ id: 'dot', label: '.', action: () => appendToken('.') },
		{ id: 'eq', label: '=', action: equals, class: 'btn-accent', aria: m.equals() }
	];
</script>

{#snippet modeTabs(compact = false)}
	<div class="join w-full sm:w-auto" role="tablist" aria-label="Application mode">
		<button
			type="button"
			class="btn join-item font-display cursor-pointer {compact
				? 'btn-sm flex-1 text-[clamp(0.9rem,2.8vw,1.05rem)]'
				: 'btn-md text-[clamp(1rem,1.8vw,1.2rem)] lg:btn-lg'}"
			class:btn-primary={appView === 'calculator'}
			class:btn-ghost={appView !== 'calculator'}
			role="tab"
			aria-selected={appView === 'calculator'}
			onclick={() => setAppView('calculator')}
		>
			{m.mode_calculator()}
		</button>
		<button
			type="button"
			class="btn join-item font-display cursor-pointer {compact
				? 'btn-sm flex-1 text-[clamp(0.9rem,2.8vw,1.05rem)]'
				: 'btn-md text-[clamp(1rem,1.8vw,1.2rem)] lg:btn-lg'}"
			class:btn-primary={appView === 'units'}
			class:btn-ghost={appView !== 'units'}
			role="tab"
			aria-selected={appView === 'units'}
			onclick={() => setAppView('units')}
		>
			{m.mode_units()}
		</button>
	</div>
{/snippet}

{#snippet padModeTabs(compact = false)}
	<div class="join w-full sm:w-auto" role="tablist" aria-label="Pad mode">
		<button
			type="button"
			class="btn join-item font-display cursor-pointer {compact
				? 'btn-sm flex-1 text-[clamp(0.9rem,2.8vw,1.05rem)]'
				: 'btn-md text-[clamp(1rem,1.8vw,1.2rem)] lg:btn-lg'}"
			class:btn-secondary={padMode === 'standard'}
			class:btn-ghost={padMode !== 'standard'}
			role="tab"
			aria-selected={padMode === 'standard'}
			onclick={() => setPadMode('standard')}
		>
			{m.mode_standard()}
		</button>
		<button
			type="button"
			class="btn join-item font-display cursor-pointer {compact
				? 'btn-sm flex-1 text-[clamp(0.9rem,2.8vw,1.05rem)]'
				: 'btn-md text-[clamp(1rem,1.8vw,1.2rem)] lg:btn-lg'}"
			class:btn-secondary={padMode === 'scientific'}
			class:btn-ghost={padMode !== 'scientific'}
			role="tab"
			aria-selected={padMode === 'scientific'}
			onclick={() => setPadMode('scientific')}
		>
			{m.mode_scientific()}
		</button>
	</div>
{/snippet}

{#snippet previousButton(compact = false)}
	<button
		type="button"
		class="{washRecipes.btnRipple} {compact
			? 'btn-sm w-full text-[clamp(0.9rem,2.8vw,1.05rem)]'
			: 'btn-md text-[clamp(1rem,1.8vw,1.15rem)] lg:btn-lg'}"
		class:cursor-pointer={undoStack.length > 0}
		class:cursor-not-allowed={undoStack.length === 0}
		disabled={undoStack.length === 0}
		aria-label={undoStack.length === 0 ? m.previous_unavailable() : m.previous()}
		onclick={previous}
	>
		{m.previous()}
	</button>
{/snippet}

{#snippet historyPanel()}
	<aside
		class="{washRecipes.washPanelFlush} flex min-h-0 flex-1 flex-col overflow-hidden"
		aria-label={m.history_title()}
	>
		<div
			class="shrink-0 border-b border-ink-border/15 px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.65rem,1.8vw,0.85rem)]"
		>
			<h2
				class="font-display text-[clamp(0.95rem,2.2vw,1.15rem)] font-bold text-primary"
			>
				{m.history_title()}
			</h2>
		</div>
		{#if history.length === 0}
			<p class="px-[clamp(0.75rem,2vw,1rem)] py-[clamp(1rem,2.5vw,1.25rem)] text-[clamp(0.85rem,2vw,1rem)] text-base-content/60">
				{m.history_empty()}
			</p>
		{:else}
			<ul
				class="min-h-0 flex-1 list-none space-y-[clamp(0.35rem,1vw,0.45rem)] overflow-y-auto overscroll-contain p-[clamp(0.5rem,1.5vw,0.75rem)]"
			>
				{#each history as entry (entry.id)}
					<li>
						<button
							type="button"
							class="flex w-full cursor-pointer flex-col gap-1 rounded-lg px-[clamp(0.65rem,1.8vw,0.85rem)] py-[clamp(0.55rem,1.5vw,0.7rem)] text-left hover:bg-primary/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary"
							aria-label="{m.history_pick()}: {entry.result}"
							onclick={() => pickHistory(entry)}
						>
							<span class="truncate font-mono text-[clamp(0.7rem,1.8vw,0.85rem)] text-base-content/60"
								>{entry.expression}</span
							>
							<span
								class="truncate font-mono text-[clamp(0.95rem,2.2vw,1.15rem)] tabular-nums text-base-content"
								>{entry.result}</span
							>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</aside>
{/snippet}

{#snippet scientificPad(dense = false)}
	<div
		class="grid min-h-0 grid-cols-4 grid-rows-3 gap-[clamp(0.35rem,1.2vw,0.65rem)] sm:grid-cols-6 sm:grid-rows-2 {dense
			? 'auto-rows-[minmax(2.25rem,auto)]'
			: 'flex-[2]'}"
	>
		{#each scientificKeys as key (key.id)}
			<button
				type="button"
				class="{washRecipes.btnRipple} h-full min-h-[clamp(2.5rem,6.5vh,3.25rem)] w-full text-[clamp(1rem,2.4vw,1.35rem)] font-semibold {key.class ??
					''}"
				aria-label={key.aria ?? key.label}
				onclick={key.action}
			>
				{key.label}
			</button>
		{/each}
	</div>
{/snippet}

{#snippet calculatorPad(showScientificInline: boolean)}
	<section
		class="{washRecipes.washPanel} flex min-h-0 flex-1 flex-col gap-[clamp(0.5rem,1.5vw,1rem)] overflow-hidden p-[clamp(0.5rem,1.8vw,1rem)]"
		aria-label={m.app_title()}
	>
		<div
			class="flex min-h-[clamp(7rem,22vh,12rem)] shrink-0 flex-col items-end justify-end rounded-box border border-ink-border/20 bg-base-200/60 px-[clamp(0.75rem,2vw,1.25rem)] py-[clamp(0.85rem,2.2vw,1.35rem)]"
			role="status"
			aria-live="polite"
		>
			{#if expression && !fresh}
				<p
					class="w-full truncate text-right font-mono text-[clamp(0.8rem,2vw,1.1rem)] text-base-content/55"
				>
					{expression}
				</p>
			{/if}
			<p
				class="w-full truncate text-right font-mono text-[clamp(2rem,8vw,4.25rem)] leading-none tabular-nums tracking-tight text-base-content"
			>
				{display}
			</p>
		</div>

		<div class="flex min-h-0 flex-1 flex-col gap-[clamp(0.35rem,1.2vw,0.75rem)] overflow-hidden">
			{#if showScientificInline && padMode === 'scientific'}
				{@render scientificPad(false)}
			{/if}

			<div
				class="grid min-h-0 flex-1 grid-cols-4 grid-rows-5 gap-[clamp(0.35rem,1.2vw,0.75rem)]"
				class:flex-[5]={showScientificInline && padMode === 'scientific'}
			>
				{#each mainKeys as key (key.id)}
					<button
						type="button"
						class="{washRecipes.btnRipple} h-full min-h-0 w-full text-[clamp(1.25rem,4vw,2.15rem)] font-semibold {key.class ??
							''} {key.span ?? ''}"
						aria-label={key.aria ?? key.label}
						onclick={key.action}
					>
						{#if key.icon}
							<WashIcon
								icon={washIcons[key.icon]}
								class="mx-auto size-[clamp(1.35rem,3.8vw,1.85rem)]"
							/>
						{:else}
							{key.label}
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</section>
{/snippet}

{#snippet sidebarBody()}
	<div class="flex min-h-0 flex-1 flex-col gap-[clamp(0.65rem,2vw,0.9rem)] overflow-hidden p-[clamp(0.75rem,2.5vw,1rem)]">
		{@render modeTabs(true)}

		{#if appView === 'calculator'}
			{@render padModeTabs(true)}
			{@render previousButton(true)}

			{#if padMode === 'scientific'}
				<div
					class="{washRecipes.washPanel} shrink-0 overflow-hidden p-[clamp(0.5rem,2vw,0.75rem)]"
				>
					<p class="mb-2 font-display text-[clamp(0.85rem,2.2vw,1rem)] font-bold text-secondary">
						{m.mode_scientific()}
					</p>
					{@render scientificPad(true)}
				</div>
			{/if}

			<div class="flex min-h-0 flex-1 flex-col overflow-hidden">
				{@render historyPanel()}
			</div>
		{:else}
			<div class="wash-allow-dropdown-overflow flex min-h-0 flex-1 flex-col overflow-hidden">
				<UnitConverter />
			</div>
		{/if}
	</div>
{/snippet}

<svelte:window onkeydown={onKeydown} />

<div
	class="calc-shell flex h-full min-h-0 w-full flex-col gap-[clamp(0.5rem,1.5vw,0.75rem)] overflow-hidden"
>
	<!-- Mobile chrome: sidebar control only -->
	<div class="flex shrink-0 items-center gap-2 md:hidden">
		<div class={washRecipes.tooltipIcon('primary', 'bottom')} data-tip={m.sidebar_open()}>
			<button
				type="button"
				class="{washRecipes.btnRipple} btn-ghost btn-square btn-primary size-[clamp(2.5rem,8vw,2.75rem)] cursor-pointer"
				aria-label={m.sidebar_open()}
				aria-expanded={sidebarOpen}
				aria-controls="calc-sidebar"
				onclick={openSidebar}
			>
				<WashIcon icon={washIcons.menu} class="size-[clamp(1.15rem,3.5vw,1.35rem)]" />
			</button>
		</div>
		<div class="min-w-0 flex-1">
			<p class="font-display text-[clamp(1rem,3.5vw,1.2rem)] font-bold text-primary">
				{m.mode_calculator()}
			</p>
			<p class="truncate text-[clamp(0.7rem,2.2vw,0.8rem)] text-base-content/55">
				{m.sidebar_tools()}
			</p>
		</div>
	</div>

	<!-- Desktop chrome -->
	<div class="hidden shrink-0 flex-wrap items-center gap-[clamp(0.5rem,1.2vw,0.75rem)] md:flex">
		{@render modeTabs(false)}
		{#if appView === 'calculator'}
			{@render padModeTabs(false)}
			{@render previousButton(false)}
		{/if}
	</div>

	<!-- Main stage -->
	{#if isDesktop && appView === 'units'}
		<div class="wash-allow-dropdown-overflow flex min-h-0 flex-1 flex-col overflow-hidden">
			<UnitConverter />
		</div>
	{:else if isDesktop}
		<div
			class="grid min-h-0 flex-1 grid-cols-1 gap-[clamp(0.5rem,1.5vw,0.75rem)] overflow-hidden md:grid-cols-[minmax(14rem,20rem)_minmax(0,1fr)]"
		>
			{@render historyPanel()}
			{@render calculatorPad(true)}
		</div>
	{:else}
		<!-- Small screens: calculator only; tools live in the drawer -->
		{@render calculatorPad(false)}
	{/if}

	<!-- Mobile overlay drawer -->
	{#if sidebarOpen && !isDesktop}
		<div class="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label={m.sidebar_tools()}>
			<button
				type="button"
				class="absolute inset-0 cursor-pointer bg-base-content/40"
				aria-label={m.sidebar_overlay()}
				onclick={closeSidebar}
			></button>
			<aside
				id="calc-sidebar"
				class="{washRecipes.washPanelFlush} absolute inset-y-0 right-0 flex w-[min(100%,24rem)] max-w-[100vw] flex-col overflow-hidden shadow-[var(--shadow-paper-md)]"
			>
				<div
					class="flex shrink-0 items-center justify-between gap-2 border-b border-ink-border/15 px-[clamp(0.75rem,2.5vw,1rem)] py-[clamp(0.55rem,2vw,0.75rem)]"
				>
					<h2 class="font-display text-[clamp(1rem,3vw,1.2rem)] font-bold text-primary">
						{m.sidebar_tools()}
					</h2>
					<div class={washRecipes.tooltipIcon('secondary', 'left')} data-tip={m.sidebar_close()}>
						<button
							type="button"
							class="{washRecipes.btnRipple} btn-ghost btn-square btn-secondary size-10 cursor-pointer"
							aria-label={m.sidebar_close()}
							onclick={closeSidebar}
						>
							<WashIcon icon={washIcons.x} class="size-5" />
						</button>
					</div>
				</div>
				{@render sidebarBody()}
			</aside>
		</div>
	{/if}
</div>
