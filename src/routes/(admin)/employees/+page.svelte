<script lang="ts">
	import Search from '$lib/components/Search.svelte';
	import { employeeData, nationalityData, type Employee } from './data/employeeData';

	import Card from './components/card.svelte';

	const employeesData: Employee[] = employeeData;
	let isGrouped = $state(true);
	let isActive = $state(true);
</script>

<div>
	<div class="main-header">
		<Search />
		<a href="/employees/create" class="btn">作成</a>
	</div>
	<div class="container employees-list">
		<div class="employees-header">
			<p>従業員一覧</p>
			<p>
				{isActive ? '在職中' : '退職者'}の従業員数: {isActive
					? employeesData.filter((employee) => employee.isActive).length
					: employeesData.filter((employee) => !employee.isActive).length}
			</p>
			<div class="employees-header-checkbox">
				<label class={['checkbox btn', { isGrouped }]}>
					<input type="checkbox" onchange={() => (isGrouped = !isGrouped)} />
					{isGrouped ? 'グループ解除' : 'グループ化'}
				</label>
				<label class={['checkbox btn', { isActive }]}>
					<input type="checkbox" onchange={() => (isActive = !isActive)} />
					{isActive ? '在職中' : '退職者'}
				</label>
			</div>
		</div>

		{#if isGrouped}
			{#each nationalityData as nationality}
				{@const filteredEmployees = employeesData.filter((e) => e.nationality === nationality.id)}
				{@const displayEmployees = isActive
					? filteredEmployees.filter((e) => e.isActive)
					: filteredEmployees.filter((e) => !e.isActive)}

				{#if displayEmployees.length > 0}
					<div class="nationality-group">
						<p>{nationality.label}（{displayEmployees.length}人）</p>
					</div>
					<Card employees={displayEmployees} />
				{/if}
			{/each}
		{:else}
			{@const displayEmployees = isActive 
				? employeesData.filter((e) => e.isActive) 
				: employeesData.filter((e) => !e.isActive)}
			<Card employees={displayEmployees} />
		{/if}
	</div>
</div>

<style>
	.main-header {
		display: grid;
		grid-template-columns: 1fr auto auto;
		align-items: center;
		gap: var(--spacing-sm);
		padding: calc(var(--spacing-sm) - 1px) var(--spacing-sm);
		border-bottom: 1px solid var(--color-border);
	}
	.employees-header {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		font-size: var(--font-size-sm);
		margin-bottom: var(--spacing-sm);
		& > p:after {
			content: '|';
			display: inline-block;
			margin-left: var(--spacing-sm);
			color: var(--color-text-muted);
		}
		& .employees-header-checkbox {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: var(--spacing-sm);
		}
	}
	.nationality-group {
		padding: var(--spacing-sm) 0;
		border-bottom: 1px solid var(--color-border);
		margin-bottom: var(--spacing-sm);
		font-size: var(--font-size-sm);
	}
</style>
