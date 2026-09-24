<script lang="ts">
	import { washRecipes } from '@menzies-mariesta-com/menzies-design-wash-ui/core';
	import { m } from '$lib/paraglide/messages.js';
	import {
		CATEGORY_META,
		UNITS_BY_CATEGORY,
		convertUnit,
		formatUnitValue,
		getCategoryMeta,
		getUnitLabel,
		unitCategorySchema,
		type CategoryIcon,
		type UnitCategory
	} from '$lib/tool/units';
	import WashSelect from '$lib/tool/WashSelect.svelte';
	import WashIcon from '$lib/tool/WashIcon.svelte';
	import { categoryWashIcon, washIcons } from '$lib/tool/wash-icons';

	let category = $state<UnitCategory>('length');
	let fromId = $state('m');
	let toId = $state('ft');
	let amountText = $state('1');

	const units = $derived(UNITS_BY_CATEGORY[category]);
	const meta = $derived(getCategoryMeta(category));
	const amount = $derived(Number(amountText));
	const amountValid = $derived(amountText.trim() !== '' && Number.isFinite(amount));
	const result = $derived(
		amountValid ? convertUnit(amount, fromId, toId, category) : Number.NaN
	);
	const fromLabel = $derived(getUnitLabel(category, fromId));
	const toLabel = $derived(getUnitLabel(category, toId));

	const categoryOptions = $derived(CATEGORY_META.map((c) => ({ value: c.id, label: c.label })));
	const unitOptions = $derived(units.map((unit) => ({ value: unit.id, label: unit.label })));

	function onCategoryChange(next: string) {
		const parsed = unitCategorySchema.safeParse(next);
		if (!parsed.success) return;
		category = parsed.data;
		const list = UNITS_BY_CATEGORY[parsed.data];
		fromId = list[0]?.id ?? '';
		toId = list[1]?.id ?? list[0]?.id ?? '';
	}

	function swapUnits() {
		const prevFrom = fromId;
		fromId = toId;
		toId = prevFrom;
	}
</script>

{#snippet categoryIcon(name: CategoryIcon, className = 'size-[1.1em]')}
	<WashIcon icon={washIcons[categoryWashIcon[name]]} class={className} />
{/snippet}

<section
	class="{washRecipes.washPanel} wash-allow-dropdown-overflow calc-units flex min-h-0 flex-1 flex-col overflow-hidden"
	aria-label={m.mode_units()}
>
	<header
		class="flex shrink-0 items-start gap-[clamp(0.75rem,2vw,1.25rem)] border-b border-ink-border/15 px-[clamp(0.875rem,2.5vw,1.5rem)] py-[clamp(0.75rem,2vw,1.15rem)]"
	>
		<div
			class="flex size-[clamp(2.25rem,5vw,2.75rem)] shrink-0 items-center justify-center rounded-box border border-ink-border/20 bg-primary/10 text-primary"
			aria-hidden="true"
		>
			{@render categoryIcon(meta.icon, 'size-[clamp(1.15rem,2.8vw,1.35rem)]')}
		</div>
		<div class="min-w-0 flex-1">
			<h2
				class="font-display text-[clamp(1.15rem,3.2vw,1.65rem)] font-bold leading-tight text-primary"
			>
				{m.unit_convert_title()}
			</h2>
			<p class="mt-0.5 text-[clamp(0.8rem,2vw,0.95rem)] text-base-content/65">
				{meta.blurb}
			</p>
		</div>
	</header>

	<div
		class="wash-allow-dropdown-overflow flex min-h-0 flex-1 flex-col gap-[clamp(0.85rem,2.2vw,1.35rem)] overflow-y-auto overscroll-contain p-[clamp(0.875rem,2.5vw,1.5rem)]"
	>
		<div
			class="wash-allow-dropdown-overflow rounded-box border border-ink-border/15 bg-base-200/35 p-[clamp(0.75rem,2vw,1.1rem)]"
		>
			<WashSelect
				label={m.unit_category()}
				options={categoryOptions}
				value={category}
				class="select-bordered text-[clamp(0.9rem,2.1vw,1.05rem)]"
				menuWidth="trigger"
				onchange={onCategoryChange}
			/>
		</div>

		<div
			class="wash-allow-dropdown-overflow flex flex-col gap-[clamp(0.75rem,2vw,1.1rem)] rounded-box border border-ink-border/15 bg-base-100/50 p-[clamp(0.75rem,2vw,1.1rem)]"
		>
			<label class="flex flex-col gap-1.5">
				<span class="text-[clamp(0.85rem,2vw,1rem)] font-medium text-base-content/80">
					{m.unit_amount()}<span
						class="align-top text-sm leading-none text-error"
						aria-hidden="true">*</span
					>
				</span>
				<input
					class="input input-bordered w-full cursor-text font-mono text-[clamp(1rem,2.4vw,1.25rem)] tabular-nums"
					type="text"
					inputmode="decimal"
					required
					value={amountText}
					oninput={(e) => (amountText = e.currentTarget.value)}
					aria-required="true"
					aria-invalid={amountValid ? undefined : true}
				/>
			</label>

			<div
				class="grid grid-cols-1 gap-[clamp(0.65rem,1.8vw,1rem)] sm:grid-cols-[1fr_auto_1fr] sm:items-end"
			>
				<WashSelect
					label={m.unit_from()}
					options={unitOptions}
					bind:value={fromId}
					class="select-bordered text-[clamp(0.9rem,2.1vw,1.05rem)]"
				/>

				<div class="flex justify-center sm:pb-1">
					<div class={washRecipes.tooltipIcon('secondary', 'bottom')} data-tip={m.unit_swap()}>
						<button
							type="button"
							class="{washRecipes.btnRipple} btn-ghost btn-square btn-secondary size-[clamp(2.5rem,6vw,3rem)] cursor-pointer"
							aria-label={m.unit_swap()}
							onclick={swapUnits}
						>
							<WashIcon
								icon={washIcons['arrow-left-right']}
								class="size-[clamp(1.1rem,2.5vw,1.25rem)]"
							/>
						</button>
					</div>
				</div>

				<WashSelect
					label={m.unit_to()}
					options={unitOptions}
					bind:value={toId}
					class="select-bordered text-[clamp(0.9rem,2.1vw,1.05rem)]"
				/>
			</div>
		</div>

		<div
			class="flex min-h-[clamp(7rem,22vh,12rem)] flex-1 flex-col justify-center gap-2 rounded-box border border-ink-border/20 bg-base-200/60 px-[clamp(1rem,2.5vw,1.5rem)] py-[clamp(1rem,2.5vw,1.35rem)]"
			role="status"
			aria-live="polite"
		>
			<p class="text-[clamp(0.85rem,2vw,1rem)] font-medium tracking-wide text-base-content/65 uppercase">
				{m.unit_result()}
			</p>
			{#if amountValid}
				<p
					class="font-mono text-[clamp(1.75rem,6vw,3rem)] leading-none font-semibold tabular-nums tracking-tight text-base-content"
				>
					{formatUnitValue(result)}
				</p>
				<p class="text-[clamp(0.85rem,2vw,1.05rem)] text-base-content/70">
					{toLabel}
				</p>
				<p class="mt-1 font-mono text-[clamp(0.75rem,1.8vw,0.9rem)] text-base-content/55">
					{formatUnitValue(amount)}
					{fromLabel}
					=
					{formatUnitValue(result)}
					{toLabel}
				</p>
			{:else}
				<p class="text-[clamp(1rem,2.5vw,1.25rem)] text-base-content/55">{m.unit_invalid_amount()}</p>
			{/if}
		</div>
	</div>
</section>
