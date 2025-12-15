<script lang="ts">
	let {
		employeeImageSrc = $bindable(),
		disabled = false,
		imageAt = $bindable(),
		onImageAtChange
	}: {
		employeeImageSrc: string;
		disabled?: boolean;
		imageAt?: string;
		onImageAtChange?: (value: string) => void;
	} = $props();

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
	}

	// 撮影日の表示用フォーマット
	function formatImageAt(date?: string): string {
		if (!date) return '';
		try {
			const d = new Date(date);
			return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
		} catch {
			return date;
		}
	}

	// 撮影日の変更ハンドラー
	function handleImageAtChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = target.value;
		imageAt = value;
		if (onImageAtChange) {
			onImageAtChange(value);
		}
	}
</script>

<div class="image-container" style:grid-area="img">
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
			<div class="image-date-overlay">
				<label class="image-at-field-inline">
					<span class="image-date-label">撮影日:</span>
					<input
						type="date"
						name="image_at"
						value={imageAt || ''}
						{disabled}
						oninput={handleImageAtChange}
						class="image-date-input"
					/>
				</label>
			</div>
		</label>
	</div>
</div>

<style>
	/* 従業員画像 */
	.image-container {
		width: 150px;
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
			overflow: hidden;
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
				z-index: 2;
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

	.image-date-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.5), transparent);
		padding: var(--spacing-sm) var(--spacing-sm);
		z-index: 1;
	}

	.image-at-field-inline {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
		cursor: default;
	}

	.image-date-label {
		font-weight: 500;
		color: white;
		font-size: 0.7em;
		white-space: nowrap;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
		line-height: 1.2;
	}

	.image-date-input {
		width: 100%;
		padding: 4px 8px;
		height: 28px;
		border: 1px solid rgba(255, 255, 255, 0.4);
		border-radius: var(--radius, 4px);
		background-color: rgba(255, 255, 255, 0.95);
		color: var(--color-text, #333);
		font-size: 0.75em;
		min-width: 0;
		transition: all 0.2s ease;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.image-date-input:hover:not(:disabled) {
		background-color: rgba(255, 255, 255, 1);
		border-color: rgba(255, 255, 255, 0.6);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.image-date-input:focus {
		outline: none;
		background-color: rgba(255, 255, 255, 1);
		border-color: var(--color-primary, #007bff);
		box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25), 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.image-date-input:disabled {
		background-color: rgba(255, 255, 255, 0.7);
		opacity: 0.8;
		cursor: not-allowed;
	}
</style>
