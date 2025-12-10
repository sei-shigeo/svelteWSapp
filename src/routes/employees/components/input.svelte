<script lang="ts">
	import type { FieldConfig } from '../data/formData';
	let { field }: { field: FieldConfig } = $props();
</script>

{#if field.formType === 'input'}
	<label class={field.className} style:grid-area={field.areaName}>
		<span data-errMsg="true">{field.label}: </span>
		<input
			type={field.type}
			name={field.name}
			placeholder={field.placeholder}
			value={field.value}
			required={field.required}
		/>
	</label>
{:else if field.formType === 'select'}
	<label class={field.className} style:grid-area={field.areaName}>
		<span data-errMsg="">{field.label}: </span>
		<select name={field.name} required>
			{#each field.options as option}
				<option value={option.value} selected={option.selected}>{option.label}</option>
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
