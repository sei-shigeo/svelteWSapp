<script lang="ts">
	import Search from '$lib/components/Search.svelte';
	import Createform from './components/createform.svelte';
	import { employeeData, nationalityData, type Employee } from './data/employeeData';

	import Card from './components/card.svelte';

	// 従業員データ(ダミーデータ)
	const employeesData: Employee[] = employeeData;

	// モーダルの開閉状態
	let isModalOpen = $state(false);

	// グループ化のオン/オフ
	let isGrouped = $state(true);

	// 在職中のオン/オフ
	let isActive = $state(true);

</script>

<div>
	<div class="main-header">
		<Search />
		<button class="btn" onclick={() => (isModalOpen = true)}>作成</button>
	</div>
	<div class="container employees-list">
		<div class="employees-header">
			<p>従業員一覧</p>
			<p>
				<!-- isActive: true → 在職中, false → 全員 -->
				{isActive ? '在職中' : '全'}の従業員数: {isActive
					? employeesData.filter((employee) => employee.isActive).length
					: employeesData.length}
			</p>
			<div class="employees-header-checkbox">
				<!-- グループ化のオン/オフの表示 -->
				<label class={['checkbox btn', { isGrouped }]}>
					<input type="checkbox" onchange={() => (isGrouped = !isGrouped)} />
					{isGrouped ? 'グループ解除' : 'グループ化'}
				</label>
				<!-- 在職中　on / off の表示 -->
				<label class={['checkbox btn', { isActive }]}>
					<input type="checkbox" onchange={() => (isActive = !isActive)} />
					{isActive ? '在職中' : '不在'}
				</label>
			</div>
		</div>

		{#if isGrouped}
			<!--グループ化表示-->
			{#each nationalityData as nationality}
				<!-- 国籍ごとの従業員数を取得 -->
				{@const filteredEmployees = employeesData.filter((e) => e.nationality === nationality.id)}
				<!-- 表示対象の従業員（isActiveフィルター適用後） -->
				{@const displayEmployees = isActive
					? filteredEmployees.filter((e) => e.isActive)
					: filteredEmployees}

				<!-- 表示する従業員がいる場合のみグループを表示 -->
				{#if displayEmployees.length > 0}
					<div class="nationality-group">
						<p>{nationality.label}（{displayEmployees.length}人）</p>
					</div>

					<Card employees={displayEmployees} />
				{/if}
			{/each}
		{:else}
			<!--フラット表示（グループなし）-->
			{@const displayEmployees = isActive ? employeesData.filter((e) => e.isActive) : employeesData}
			<Card employees={displayEmployees} />
		{/if}

		<Createform bind:open={isModalOpen} />
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
