<script lang="ts">
	import type { PageProps } from './$types';
	import EmployeeForm from '../../components/EmployeeForm.svelte';

	let { data }: PageProps = $props();

	const employee = $derived(data.employee);

	// キャンセルボタンの処理
	function handleCancel() {
		window.history.back();
	}
</script>

<div class="form-container">
	<div class="header">
		<h1>従業員編集</h1>
		<div class="button-group">
			<button class="btn submit" type="submit" form="edit-form">保存</button>
			<button class="btn" onclick={handleCancel}>キャンセル</button>
		</div>
	</div>

	<EmployeeForm mode="edit" {employee} isEditing={false} formId="edit-form" />
</div>


