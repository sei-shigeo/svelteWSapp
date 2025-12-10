<script lang="ts">
	type NavigationItem = {
		icon: string;
		label: string;
		href: string;
	};

	const navigationItems: NavigationItem[] = [
		{ icon: 'dashboard', label: 'ダッシュボード', href: '/' },
		{ icon: 'person', label: '従業員', href: '/employees' },
		{ icon: 'business', label: '取引先', href: '/clients/list' },
		{ icon: 'local_shipping', label: '車両', href: '/vehicles/list' },
		{ icon: 'book', label: '配車オーダー', href: '/dispatch-orders/list' },
		{ icon: 'book', label: '点呼記録', href: '/roll-calls/list' },
		{ icon: 'book', label: '車両点検', href: '/vehicle-inspections/list' },
		{ icon: 'book', label: '請求書', href: '/invoices/list' },
		{ icon: 'report', label: 'レポート', href: '/reports' },
		{ icon: 'book', label: 'マスタ', href: '/masters' }
	];

	const settingsItems: NavigationItem[] = [
		{ icon: 'settings', label: '設定', href: '/settings' },
		{ icon: 'logout', label: 'ログアウト', href: '/logout' }
	];

	// 親コンポーネントからbindで受け取る（双方向バインディング）
	let { isSidebarOpen = $bindable(false) } = $props();

	const toggleSidebar = () => {
		isSidebarOpen = !isSidebarOpen;
	};
</script>

<div class="navbar-container">
	<div class="logo">
		<button onclick={toggleSidebar} class="item icon" data-icon={isSidebarOpen ? 'close' : 'menu'}
			>運送管理システム</button
		>
	</div>
	<div class="navigation">
		{#each navigationItems as item}
			<a href={item.href} class="item icon" data-icon={item.icon}>{item.label}</a>
		{/each}
	</div>
	<div class="settings hover">
		{#each settingsItems as item}
			<button type="button" class="item icon" data-icon={item.icon}>{item.label}</button>
		{/each}
	</div>
</div>

<style>
	.navbar-container {
		display: grid;
		grid-template-rows: auto 1fr auto;
		border-right: 1px solid var(--color-border);

		& :where(.logo, .navigation, .settings) {
			width: 100%;
			padding: var(--spacing-sm);
			display: flex;
			flex-direction: column;
			gap: var(--spacing-md);
			overflow: hidden;

			& .item {
				display: grid;
				grid-template-columns: auto 1fr;
				align-items: center;
				height: 40px;
				gap: var(--spacing-sm);
				white-space: nowrap;

				&::before {
					content: attr(data-icon);
				}
			}
			&:not(.logo) .item {
				background-color: var(--color-bg-muted);
				border-radius: var(--radius);

				&:hover {
					background-color: var(--color-bg-muted-hover);
				}
			}
		}

		& .navigation {
			border-top: 1px solid var(--color-border);
			border-bottom: 1px solid var(--color-border);
		}
	}
</style>
