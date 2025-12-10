<script lang="ts">
	let { employeeImageSrc }: { employeeImageSrc: string } = $props();
	// 画像変更ハンドラー（Svelte風）
	const imageChangeHandler = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (!target.files?.[0]) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			employeeImageSrc = e.target?.result as string;
		};
		reader.readAsDataURL(target.files[0]);
	};
</script>

<div class="image-container" style:grid-area='img'>
	<label for="image">画像</label>
	<input type="file" name="image" id="image" style="display: none;" onchange={imageChangeHandler} />
	<img class="employee-image" src={employeeImageSrc} alt="従業員画像" />
</div>

<style>
	/* 従業員画像 */
	.image-container {
		position: sticky;
		top: 0;
		width: 150px;
		aspect-ratio: 1/1;
		& .employee-image {
			width: 150px;
			aspect-ratio: 1/1;
			object-fit: cover;
			border-radius: var(--radius);
		}
		& label {
			position: absolute;
			inset: 0;
			cursor: pointer;
			border-radius: var(--radius);
			display: flex;
			align-items: flex-start;
			justify-content: flex-end;
			padding: var(--spacing-sm);

			&::before {
				font-family: 'Material Symbols Outlined';
				content: 'edit';
				color: var(--color-primary);
			}
		}
	}
</style>
