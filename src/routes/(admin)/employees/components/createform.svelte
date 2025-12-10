<script lang="ts">
	import defaultAvatar from '$lib/assets/images/avatar.png';
	import Details from './details.svelte';
	import { detailData } from '../data/detailsData';
	import Input from './input.svelte';
	import Image from './image.svelte';

	// 親から受け取るprops（双方向バインディング可能）
	let { open = $bindable(false) }: { open: boolean } = $props();

	// モーダル参照
	let dialogRef: HTMLDialogElement;

	// openの変化を監視してダイアログを開閉
	$effect(() => {
		if (open) {
			dialogRef?.showModal();
		} else {
			dialogRef?.close();
		}
	});

	// 画像のsrcをリアクティブな変数で管理
	let employeeImageSrc = $state(defaultAvatar);
</script>

<!-- 従業員作成フォーム -->
<dialog id="createModalEmployee" bind:this={dialogRef} onclose={() => (open = false)}>
	<form class="employee-create-form">
		<div class="main-content">
			<Image {employeeImageSrc} />
			<div class="main-form">
				{#each detailData as detail}
					<Details {detail}>
						{#each detail.fields as field}
							<Input {field} />
						{/each}
					</Details>
				{/each}
				<div class="button-container">
					<button class="btn submit">作成</button>
					<button class="btn close" onclick={() => (open = false)}>閉じる</button>
				</div>
			</div>
		</div>
	</form>
</dialog>

<style>
	.employee-create-form {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		height: 100%;
		overflow: auto;

		& .main-content {
			display: flex;
			gap: var(--spacing-md);
			overflow-y: auto;
			flex: 1;
			min-height: 0;

			& .main-form {
				display: flex;
				flex: 1;
				flex-direction: column;
				gap: var(--spacing-md);
			}
		}
		& .button-container {
			position: sticky;
			bottom: 0;
			display: grid;
			grid-template-columns: repeat(2, 100px);
			align-items: center;
			justify-content: end;
			text-align: center;
			gap: var(--spacing-sm);
		}
	}
</style>
