<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Search from '$lib/components/Search.svelte';

	let { children } = $props();

	// サイドバーの開閉状態
	let isSidebarOpen = $state(false);

	// 👇 $derived: isSidebarOpenが変わると自動的に再計算される！
	let gridColumns = $derived(isSidebarOpen ? 'calc(40px + var(--spacing-md)) 1fr' : '200px 1fr');

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
	/>
</svelte:head>

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
</style>
