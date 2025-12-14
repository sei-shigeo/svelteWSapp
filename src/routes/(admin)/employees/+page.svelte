<script lang="ts">
	import Search from '$lib/components/Search.svelte';
	import type { PageData } from './$types';
	import type { Employee } from './types';
	import Card from './components/card.svelte';

	let { data }: { data: PageData } = $props();

	let employeesData = $state<Employee[]>([]);
	let nationalityData = $state<Array<{ id: number; label: string }>>([]);
	let isGrouped = $state(true);
	let isActive = $state(true);

	// 初期データを設定（初回のみ）
	let initialized = $state(false);
	$effect(() => {
		if (!initialized) {
			employeesData = data.employees || [];
			nationalityData = data.nationalityData || [];
			initialized = true;
		}
	});

	/**
	 * 従業員データをAPIから取得
	 */
	async function loadData() {
		if (typeof window === 'undefined') return;
		try {
			const response = await fetch(`/employees/api?isActive=${isActive}`);
			if (response.ok) {
				employeesData = await response.json();
			}
		} catch (error) {
			console.error('Error loading data:', error);
		}
	}

	// isActiveが変更されたときにデータを再読み込み
	$effect(() => {
		if (typeof window !== 'undefined') {
			loadData();
		}
	});
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
				{isActive ? '在職中' : '退職者'}の従業員数: {employeesData.length}
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

				{#if filteredEmployees.length > 0}
					<div class="nationality-group">
						<p>{nationality.label}（{filteredEmployees.length}人）</p>
					</div>
					<Card employees={filteredEmployees} />
				{/if}
			{/each}
		{:else}
			<Card employees={employeesData} />
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
