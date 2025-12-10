<script lang="ts">
	import defaultAvatar from '$lib/assets/images/avatar.png';
	import { type Employee } from '../data/employeeData';

	let { employees }: { employees: Employee[] } = $props();
</script>

<div class="employees-card-list">
	{#each employees as employee}
		<a href={`/employees/details/${employee.id}`} target="_blank" class="card">
			<img src={employee.image || defaultAvatar} alt="従業員画像" />
			<div class="card-content">
				<p data-iconBefore="id_card">{employee.code}</p>
				<p data-iconBefore="person">{employee.firstName} {employee.lastName}</p>
				<p data-iconBefore="phone">{employee.phone}</p>
				<p data-iconBefore="email">{employee.email}</p>
			</div>
		</a>
	{/each}
</div>

<style>
	.employees-card-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: var(--spacing-sm);
	}
	.card {
		display: grid;
		grid-template-columns: 80px 1fr;
		border-radius: var(--radius);
		border: 1px solid var(--color-border);
		align-items: center;
		& img {
			width: 100%;
			aspect-ratio: 1/1;
			object-fit: cover;
			padding: var(--spacing-sm);
			border-radius: 20px;
		}
	}
	.card-content {
		padding: var(--spacing-sm);
		display: grid;
		font-size: 0.8em;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
