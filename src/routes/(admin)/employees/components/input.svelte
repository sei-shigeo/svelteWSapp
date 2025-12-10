<script lang="ts">
	import type { FieldConfig } from '../data/formData';
	let {
		field,
		value,
		disabled
	}: { field: FieldConfig; value?: string | number; disabled?: boolean } = $props();

	const displayValue = $derived(value !== undefined ? String(value) : (field.value ?? ''));
</script>

{#if field.formType === 'input'}
	<label class={field.className} style:grid-area={field.areaName}>
		<span data-errMsg="true">{field.label}: </span>
		<input
			type={field.type}
			name={field.name}
			placeholder={field.placeholder}
			value={displayValue}
			required={field.required}
			{disabled}
		/>
	</label>
{:else if field.formType === 'select'}
	<label class={field.className} style:grid-area={field.areaName}>
		<span data-errMsg="">{field.label}: </span>
		<select name={field.name} required {disabled}>
			{#each field.options as option}
				<option
					value={option.value}
					selected={value !== undefined ? String(value) === option.value : option.selected}
				>
					{option.label}
				</option>
			{/each}
		</select>
	</label>
{/if}

<style>
	label {
		display: grid;
		gap: var(--spacing-xs);
		grid-template-rows: 1.5rem 36px;
		& span {
			font-size: 0.7em;
			text-wrap: nowrap;
		}
		& input,
		& select {
			appearance: none;
		}
	}
</style>
