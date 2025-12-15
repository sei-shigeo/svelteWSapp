<script lang="ts">
	import type { FieldConfig } from '../data/formData';

	type MasterDataItem = { id: number | string | boolean; label: string };

	let {
		field,
		value,
		disabled,
		error,
		validationState,
		displayMessage,
		oninput,
		options = []
	}: {
		field: FieldConfig;
		value?: string | number;
		disabled?: boolean;
		error?: string;
		validationState?: 'error' | 'success' | 'required' | null;
		displayMessage?: string;
		oninput?: (e: Event) => void;
		options?: MasterDataItem[];
	} = $props();

	const displayValue = $derived(
		value !== undefined && value !== null
			? String(value)
			: field.value !== undefined && field.value !== null
				? String(field.value)
				: ''
	);

	// input要素の値を同期する（外部からvalueが変更された場合に反映）
	let inputElement = $state<HTMLInputElement | null>(null);
	$effect(() => {
		if (inputElement && displayValue !== undefined) {
			// 現在の値と異なる場合のみ更新（無限ループを防ぐ）
			if (inputElement.value !== String(displayValue)) {
				inputElement.value = String(displayValue);
			}
		}
	});

	// PDFファイルかどうかを判定
	const isPdfFile = $derived(field.className?.includes('_pdf') || field.name?.includes('pdf'));

	// 画像プレビュー用の状態（画像ファイルの場合のみ使用）
	let imagePreviewSrc = $state<string | null>(null);

	// PDFファイル名用の状態
	let pdfFileName = $state<string | null>(null);

	// 画像変更ハンドラー
	const imageChangeHandler = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (!target.files?.[0]) {
			imagePreviewSrc = null;
			pdfFileName = null;
			return;
		}

		if (isPdfFile) {
			pdfFileName = target.files[0].name;
		} else {
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreviewSrc = e.target?.result as string;
			};
			reader.readAsDataURL(target.files[0]);
		}
	};
</script>

{#if field.formType === 'input'}
	{#if field.type === 'file'}
		<label
			class="{field.className} file-input-label"
			class:pdf-file={isPdfFile}
			style:grid-area={field.areaName}
		>
			<span>{field.label}: </span>
			<div class="file-input-container">
				<input
					type="file"
					name={field.name}
					accept={isPdfFile ? 'application/pdf' : 'image/*'}
					required={field.required}
					{disabled}
					onchange={imageChangeHandler}
					id={field.name}
				/>
				{#if isPdfFile}
					{#if pdfFileName}
						<div class="pdf-file-display">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
								<polyline points="14 2 14 8 20 8"></polyline>
								<line x1="16" y1="13" x2="8" y2="13"></line>
								<line x1="16" y1="17" x2="8" y2="17"></line>
								<polyline points="10 9 9 9 8 9"></polyline>
							</svg>
							<span class="pdf-file-name">{pdfFileName}</span>
						</div>
					{:else if value}
						<div class="pdf-file-display">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
								<polyline points="14 2 14 8 20 8"></polyline>
								<line x1="16" y1="13" x2="8" y2="13"></line>
								<line x1="16" y1="17" x2="8" y2="17"></line>
								<polyline points="10 9 9 9 8 9"></polyline>
							</svg>
							<span class="pdf-file-name">PDFファイルが選択されています</span>
						</div>
					{:else}
						<div class="pdf-file-placeholder">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
								<polyline points="14 2 14 8 20 8"></polyline>
								<line x1="16" y1="13" x2="8" y2="13"></line>
								<line x1="16" y1="17" x2="8" y2="17"></line>
								<polyline points="10 9 9 9 8 9"></polyline>
							</svg>
							<span>PDFファイルを選択</span>
						</div>
					{/if}
				{:else if imagePreviewSrc}
					<img src={imagePreviewSrc} alt={field.label} class="preview-image" />
				{:else if value}
					<img src={String(value)} alt={field.label} class="preview-image" />
				{:else}
					<div class="file-placeholder">
						<span>画像を選択</span>
					</div>
				{/if}
				<label for={field.name} class="file-select-button" class:disabled> ファイルを選択 </label>
			</div>
		</label>
	{:else}
		<label class={field.className} style:grid-area={field.areaName} class:has-error={!!error}>
			<span
				data-errMsg={validationState === 'success'
					? ''
					: displayMessage !== undefined
						? displayMessage
						: undefined}
			>
				{field.label}:
			</span>
			<input
				bind:this={inputElement}
				type={field.type}
				name={field.name}
				placeholder={field.placeholder}
				value={displayValue}
				required={field.required}
				{disabled}
				class:error={!!error}
				{oninput}
			/>
		</label>
	{/if}
{:else if field.formType === 'select'}
	<label class={field.className} style:grid-area={field.areaName} class:has-error={!!error}>
		<span
			data-errMsg={validationState === 'success'
				? ''
				: displayMessage !== undefined
					? displayMessage
					: undefined}
		>
			{field.label}:
		</span>
		<select name={field.name} required {disabled} class:error={!!error} {oninput}>
			{#each options as option, index}
				<option
					value={option.id}
					selected={value !== undefined ? String(value) === String(option.id) : index === 0}
				>
					{option.label}
				</option>
			{/each}
		</select>
	</label>
{/if}

<style>
	label {
		display: grid;
		gap: var(--spacing-xs);
		grid-template-rows: 1.5rem 1fr;
		& span {
			font-size: 0.7em;
			text-wrap: nowrap;
			line-height: 1.5rem;
			height: 1.5rem;
			display: flex;
			align-items: center;
		}
		& input:not([type='date']):not([type='time']):not([type='datetime-local']),
		& select {
			appearance: none;
		}
		& input[type='date'],
		& input[type='time'],
		& input[type='datetime-local'] {
			appearance: auto;
		}
		&.has-error {
			grid-template-rows: 1.5rem 1fr auto;
		}
		& input.error,
		& select.error {
			border-color: var(--color-danger, #c33);
			border-width: 2px;
		}
	}

	.file-input-label {
		grid-template-rows: 1.5rem 1fr;
	}

	.file-input-container {
		display: grid;
		grid-template-rows: 1fr auto;
		gap: var(--spacing-xs);
		position: relative;

		& input[type='file'] {
			position: absolute;
			opacity: 0;
			width: 0;
			height: 0;
			pointer-events: none;
		}

		& .preview-image {
			width: 100%;
			height: 200px;
			object-fit: contain;
			border: 1px solid var(--color-border);
			border-radius: var(--radius);
			background-color: var(--color-bg);
		}

		& .file-placeholder {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 200px;
			border: 2px dashed var(--color-border);
			border-radius: var(--radius);
			background-color: var(--color-bg-muted);
			color: var(--color-text-muted);
			font-size: 0.9em;
		}

		& .file-select-button {
			padding: var(--spacing-xs) var(--spacing-sm);
			border: 1px solid var(--color-border);
			border-radius: var(--radius);
			background-color: var(--color-primary);
			color: var(--color-white);
			text-align: center;
			cursor: pointer;
			transition: all 0.2s ease;
			font-size: 0.9em;
			height: 40px;

			&:hover:not(.disabled) {
				background-color: color-mix(in srgb, var(--color-primary) 90%, black);
			}

			&.disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}
		}

		/* PDFファイル用のスタイル */
		& .pdf-file-display {
			display: flex;
			align-items: center;
			gap: var(--spacing-xs);
			padding: var(--spacing-sm);
			border: 1px solid var(--color-border);
			border-radius: var(--radius);
			background-color: var(--color-bg);
			min-height: 60px;

			& svg {
				flex-shrink: 0;
				color: var(--color-danger);
			}

			& .pdf-file-name {
				font-size: 0.9em;
				color: var(--color-text);
				word-break: break-all;
			}
		}

		& .pdf-file-placeholder {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: var(--spacing-xs);
			/* height: 120px; */
			border: 2px dashed var(--color-border);
			border-radius: var(--radius);
			background-color: var(--color-bg-muted);
			color: var(--color-text-muted);
			font-size: 0.9em;

			& svg {
				color: var(--color-text-muted);
			}
		}
	}

	/* PDFファイル用のラベルスタイル */
	:global(.pdf-file.file-input-label) {
		grid-template-rows: 1.5rem auto;
	}
</style>
