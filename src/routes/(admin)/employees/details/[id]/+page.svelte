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

	// 電話をかける
	function handleCall(phoneNumber?: string) {
		if (!phoneNumber) {
			alert('電話番号が登録されていません');
			return;
		}
		window.location.href = `tel:${phoneNumber}`;
	}

	// メールを送信
	function handleEmail(email?: string) {
		if (!email) {
			alert('メールアドレスが登録されていません');
			return;
		}
		window.location.href = `mailto:${email}`;
	}

	// LINEで連絡（電話番号をクリップボードにコピー）
	async function handleLine(phoneNumber?: string) {
		if (!phoneNumber) {
			alert('電話番号が登録されていません');
			return;
		}
		try {
			await navigator.clipboard.writeText(phoneNumber);
			alert(
				`電話番号「${phoneNumber}」をクリップボードにコピーしました。LINEアプリで検索してください。`
			);
			// LINEアプリを開く（オプション）
			window.open('line://', '_blank');
		} catch (error) {
			console.error('クリップボードへのコピーに失敗しました:', error);
			alert(`電話番号: ${phoneNumber}\nこの番号をLINEアプリで検索してください。`);
		}
	}
</script>

<div class="form-container">
	<div class="header">
		<h1>従業員詳細</h1>
		<div class="action-buttons">
			<button
				class="action-btn call"
				onclick={() => handleCall(employee?.phone_mobile || employee?.phone_tel)}
				title="電話をかける"
				disabled={!employee?.phone_mobile && !employee?.phone_tel}
			>
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
					<path
						d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
					></path>
				</svg>
			</button>
			<button
				class="action-btn email"
				onclick={() => handleEmail(employee?.email)}
				title="メールを送信"
				disabled={!employee?.email}
			>
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
					<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
					></path>
					<polyline points="22,6 12,13 2,6"></polyline>
				</svg>
			</button>
			<button
				class="action-btn line"
				onclick={() => handleLine(employee?.phone_mobile || employee?.phone_tel)}
				title="LINEで連絡"
				disabled={!employee?.phone_mobile && !employee?.phone_tel}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path
						d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766-.178 1.09-.136.168-.331.223-.586.223-.39-.012-1.042-.299-1.635-.547-.21-.123-.493-.307-.738-.307-.271 0-.651.188-.651.713 0 .371.242.713.651.713.39 0 .81-.207 1.134-.368 1.266-.64 2.687-1.35 3.933-2.216C19.953 20.06 24 15.703 24 10.314"
					/>
				</svg>
			</button>
		</div>
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

<style>
	:global(.form-container .header) {
		display: grid !important;
		grid-template-columns: auto 1fr auto !important;
		align-items: center;
		gap: 2rem;
		justify-content: unset !important;
	}

	:global(.form-container .header h1) {
		grid-column: 1;
	}

	.action-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		grid-column: 2;
	}

	:global(.form-container .header .button-group) {
		grid-column: 3;
		display: flex;
		gap: 1rem;
		justify-self: end;
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		border: none;
		border-radius: var(--radius, 4px);
		background-color: #ffb6c1;
		color: white;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.action-btn:hover:not(:disabled) {
		background-color: #ff91a4;
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background-color: #ccc;
	}

	.action-btn svg {
		flex-shrink: 0;
		width: 16px;
		height: 16px;
	}
</style>
