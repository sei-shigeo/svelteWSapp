<script lang="ts">
	import type { PageProps } from './$types';
	import EmployeeForm from '../../components/EmployeeForm.svelte';
	import { goto } from '$app/navigation';

	let { data }: PageProps = $props();

	const employee = $derived(data.employee);

	// 削除処理
	async function handleDelete() {
		if (!employee?.id) return;

		if (
			!confirm(
				`従業員「${employee.lastName} ${employee.firstName}」を削除してもよろしいですか？\nこの操作は取り消せません。`
			)
		) {
			return;
		}

		try {
			const response = await fetch(`/employees/api/${employee.id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const error = await response.json();
				alert(error.error || '削除に失敗しました');
				return;
			}

			// 成功時は一覧ページにリダイレクト
			await goto('/employees');
		} catch (error) {
			console.error('Error deleting employee:', error);
			alert('削除中にエラーが発生しました');
		}
	}
</script>

<div class="form-container">
	<div class="header">
		<h1>従業員詳細</h1>
		<div class="button-group">
			<a
				href={`/employees/details/${employee.id}/print`}
				class="btn"
				data-sveltekit-preload-data="hover">印刷</a
			>
			<a href={`/employees/edit/${employee.id}`} class="btn" data-sveltekit-preload-data="hover"
				>編集</a
			>
			<button class="btn" onclick={handleDelete}>削除</button>
		</div>
	</div>

	<EmployeeForm mode="edit" {employee} isEditing={true} />
</div>
