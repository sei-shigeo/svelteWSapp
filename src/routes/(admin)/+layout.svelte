<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();

	// サイドバーの開閉状態
	let isSidebarOpen = $state(false);

	// 👇 $derived: isSidebarOpenが変わると自動的に再計算される！
	let gridColumns = $derived(isSidebarOpen ? 'calc(40px + var(--spacing-md)) 1fr' : '200px 1fr');

</script>


<div class="layout" style:grid-template-columns={gridColumns}>
	<Sidebar bind:isSidebarOpen />
	<main>
		{@render children()}
	</main>
</div>

<style>
	.layout {
		display: grid;
		grid-template-columns: 200px 1fr;
		min-height: 100vh;
		transition: grid-template-columns 0.5s ease-in-out;
	}

	/* 印刷時にサイドバーを非表示 */
	@media print {
		.layout {
			grid-template-columns: 1fr;
		}

		:global(.navbar-container) {
			display: none !important;
		}
	}
</style>
