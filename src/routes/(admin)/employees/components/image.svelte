<script lang="ts">
	let {
		employeeImageSrc = $bindable(),
		disabled = false
	}: { employeeImageSrc: string; disabled?: boolean } = $props();
	// 画像変更ハンドラー（Svelte風）
	const imageChangeHandler = (event: Event) => {
		if (disabled) return;
		const target = event.target as HTMLInputElement;
		if (!target.files?.[0]) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			employeeImageSrc = e.target?.result as string;
		};
		reader.readAsDataURL(target.files[0]);
	};
</script>

<div class="image-container" style:grid-area="img">
	<span class="image-label">画像: </span>
	<div class="image-wrapper">
		<input
			type="file"
			name="image"
			id="image"
			style="display: none;"
			{disabled}
			onchange={imageChangeHandler}
		/>
		<label for="image" class="image-click-area" class:disabled>
			<img class="employee-image" src={employeeImageSrc} alt="従業員画像" />
		</label>
	</div>
</div>

<style>
	/* 従業員画像 */
	.image-container {
		width: 150px;
		display: grid;
		gap: var(--spacing-xs);
		grid-template-rows: 1.5rem 1fr;
		& .image-label {
			display: flex;
			align-items: center;
			font-size: 0.7em;
			text-wrap: nowrap;
			height: 1.5rem;
			line-height: 1.5rem;
			padding-left: 8px;
		}
		& .image-wrapper {
			position: relative;
			width: 100%;
			aspect-ratio: 1/1;
		}
		& .employee-image {
			width: 100%;
			height: 100%;
			aspect-ratio: 1/1;
			object-fit: cover;
			border-radius: var(--radius);
			border: 1px solid var(--color-border);
			display: block;
		}
		& .image-click-area {
			position: relative;
			display: block;
			cursor: pointer;
			border-radius: var(--radius);
			&::after {
				content: 'edit';
				position: absolute;
				top: var(--spacing-sm);
				right: var(--spacing-sm);
				font-family: 'Material Symbols Outlined';
				color: var(--color-primary);
				background-color: rgba(255, 255, 255, 0.9);
				border-radius: 50%;
				width: 28px;
				height: 28px;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 18px;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
			}
			&:hover::after {
				background-color: rgba(255, 255, 255, 1);
			}
			&.disabled {
				cursor: not-allowed;
				opacity: 0.6;
				&::after {
					display: none;
				}
			}
		}
	}
</style>
