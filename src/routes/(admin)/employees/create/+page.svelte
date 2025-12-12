<script lang="ts">
	import EmployeeForm from '../components/EmployeeForm.svelte';

	// キャンセルボタンの処理
	function handleCancel() {
		window.history.back();
	}
</script>

<div class="form-container">
	<div class="header">
		<h1>従業員作成</h1>
		<div class="button-group">
			<button class="btn submit" type="submit" form="create-form">保存</button>
			<button class="btn" onclick={handleCancel}>キャンセル</button>
		</div>
	</div>

	<EmployeeForm mode="create" formId="create-form" />
</div>

<style>
	/* ページ固有のスタイルがあればここに追加 */
</style>
