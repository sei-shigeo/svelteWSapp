<script lang="ts">
	import type { PageProps } from './$types';
	import EmployeeForm from '../../components/EmployeeForm.svelte';

	let { data }: PageProps = $props();

	const employee = $derived(data.employee);
</script>

<div class="form-container">
	<div class="header">
		<h1>従業員詳細</h1>
		<div class="button-group">
			<a href={`/employees/details/${employee.id}/print`} class="btn">印刷</a>
			<a href={`/employees/edit/${employee.id}`} class="btn">編集</a>
			<button class="btn">削除</button>
		</div>
	</div>

	<EmployeeForm mode="edit" {employee} isEditing={true} />
</div>

<style>
	/* ページ固有のスタイルがあればここに追加 */
</style>

