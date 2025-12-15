<script lang="ts">
	import defaultAvatar from '$lib/assets/images/avatar.png';
	import type { Employee } from '../types';

	let { employees }: { employees: Employee[] } = $props();

	// 印刷ボタンのクリックハンドラー
	function handlePrint(event: MouseEvent, employeeId: number) {
		event.preventDefault();
		event.stopPropagation();
		window.open(`/employees/details/${employeeId}/print`, '_blank');
	}
</script>

<div class="employees-card-list">
	{#each employees as employee}
		<div class="card-wrapper">
			<a href={`/employees/details/${employee.id}`} class="card">
				<img src={employee.image || defaultAvatar} alt="従業員画像" />
				<div class="card-content">
					<p data-iconBefore="id_card">
						{#if employee.code}
							{employee.code}
						{:else}
							<span class="empty-field">未設定</span>
						{/if}
					</p>
					<p data-iconBefore="person">
						{#if employee.firstName || employee.lastName}
							{`${employee.firstName || ''} ${employee.lastName || ''}`.trim()}
						{:else}
							<span class="empty-field">未設定</span>
						{/if}
					</p>
					<p data-iconBefore="phone">
						{#if employee.phone_mobile}
							{employee.phone_mobile}
						{:else}
							<span class="empty-field">未設定</span>
						{/if}
					</p>
					<p data-iconBefore="email">
						{#if employee.email}
							{employee.email}
						{:else}
							<span class="empty-field">未設定</span>
						{/if}
					</p>
				</div>
			</a>
			<button class="print-btn" onclick={(e) => handlePrint(e, employee.id)} title="印刷">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="6 9 6 2 18 2 18 9"></polyline>
					<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
					></path>
					<rect x="6" y="14" width="12" height="8"></rect>
				</svg>
			</button>
		</div>
	{/each}
</div>

<style>
	.employees-card-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--spacing-sm);
	}

	.card-wrapper {
		position: relative;
	}

	.card {
		display: grid;
		grid-template-columns: 80px 1fr;
		border-radius: var(--radius);
		border: 1px solid var(--color-border);
		align-items: center;
		transition: all 0.2s ease;
		background-color: var(--color-bg);
		& img {
			width: 100%;
			aspect-ratio: 1/1;
			object-fit: cover;
			padding: var(--spacing-sm);
			border-radius: 20px;
			transition: transform 0.2s ease;
		}
	}

	.card-wrapper:hover .card,
	.card:hover {
		border-color: var(--color-primary);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
		background-color: var(--color-bg-muted);
	}

	.card-wrapper:hover .card img,
	.card:hover img {
		transform: scale(1.05);
	}

	.card-content {
		padding: var(--spacing-sm);
		display: grid;
		font-size: 0.8em;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.empty-field {
		color: var(--color-danger, #c33);
		font-style: italic;
	}

	.print-btn {
		position: absolute;
		top: 50%;
		right: var(--spacing-md);
		transform: translateY(-50%);
		width: 32px;
		height: 32px;
		padding: 0;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background-color: var(--color-bg);
		color: var(--color-text);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		z-index: 1;
	}

	.print-btn:hover {
		background-color: var(--color-primary);
		color: var(--color-white);
		border-color: var(--color-primary);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
	}

	.print-btn svg {
		width: 16px;
		height: 16px;
	}
</style>
