<script lang="ts">
	import type { FieldConfig } from '../data/formData';

	type Props = {
		field: FieldConfig;
		value?: string | number;
		disabled?: boolean;
		error?: string;
		validationState?: 'error' | 'success' | 'required' | null;
		displayMessage?: string;
		oninput?: (e: Event) => void;
		onAddressChange?: (address: string) => void;
	};

	let {
		field,
		value,
		disabled,
		error,
		validationState,
		displayMessage,
		oninput,
		onAddressChange
	}: Props = $props();

	const displayValue = $derived(
		value !== undefined && value !== null
			? String(value)
			: field.value !== undefined && field.value !== null
				? String(field.value)
				: ''
	);

	// 入力値の状態
	let inputValue = $state('');
	let isLoading = $state(false);
	let lastSearchedPostalCode = $state('');

	// 入力値が変更されたときに更新
	$effect(() => {
		inputValue = displayValue;
	});

	// 郵便番号を正規化（ハイフンを除去）
	function normalizePostalCode(postalCode: string): string {
		return postalCode.replace(/[-\s]/g, '');
	}

	// 郵便番号の形式をチェック（7桁の数字）
	function isValidPostalCodeFormat(postalCode: string): boolean {
		const normalized = normalizePostalCode(postalCode);
		return /^\d{7}$/.test(normalized);
	}

	// ポストくんAPIから住所を取得
	async function fetchAddressFromPostalCode(postalCode: string): Promise<string | null> {
		const normalized = normalizePostalCode(postalCode);
		if (!isValidPostalCodeFormat(normalized)) {
			return null;
		}

		// 同じ郵便番号を再度検索しない
		if (lastSearchedPostalCode === normalized) {
			return null;
		}

		isLoading = true;
		lastSearchedPostalCode = normalized;

		try {
			const response = await fetch(`https://postcode.teraren.com/postcodes/${normalized}.json`, {
				method: 'GET',
				headers: {
					Accept: 'application/json'
				}
			});

			if (!response.ok) {
				console.error('郵便番号検索APIエラー:', response.status, response.statusText);
				return null;
			}

			const data = await response.json();

			// ポストくんAPIのレスポンス形式に応じて住所を構築
			// レスポンス形式: { prefecture, city, suburb }
			if (data && (data.prefecture || data.city || data.suburb)) {
				const parts: string[] = [];
				if (data.prefecture) parts.push(data.prefecture);
				if (data.city) parts.push(data.city);
				if (data.suburb) parts.push(data.suburb);
				return parts.join('');
			}

			return null;
		} catch (error) {
			console.error('郵便番号検索エラー:', error);
			return null;
		} finally {
			isLoading = false;
		}
	}

	// 入力ハンドラー
	async function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		let newValue = target.value;

		// ハイフンを自動挿入（3桁目と4桁目の間）
		const normalized = normalizePostalCode(newValue);
		if (normalized.length <= 3) {
			inputValue = normalized;
		} else if (normalized.length <= 7) {
			inputValue = `${normalized.slice(0, 3)}-${normalized.slice(3)}`;
		} else {
			inputValue = `${normalized.slice(0, 3)}-${normalized.slice(3, 7)}`;
		}

		// 元のoninputイベントを呼び出し
		if (oninput) {
			oninput(e);
		}

		// 7桁の数字が入力されたら住所を自動取得
		if (normalized.length === 7 && isValidPostalCodeFormat(normalized)) {
			const address = await fetchAddressFromPostalCode(normalized);
			if (address && onAddressChange) {
				onAddressChange(address);
			}
		}
	}

	// Enterキー押下時の処理
	async function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			const normalized = normalizePostalCode(inputValue);
			if (normalized.length === 7 && isValidPostalCodeFormat(normalized)) {
				const address = await fetchAddressFromPostalCode(normalized);
				if (address && onAddressChange) {
					onAddressChange(address);
				}
			}
		}
	}

	// フォーカスアウト時の処理
	async function handleBlur() {
		const normalized = normalizePostalCode(inputValue);
		if (normalized.length === 7 && isValidPostalCodeFormat(normalized)) {
			const address = await fetchAddressFromPostalCode(normalized);
			if (address && onAddressChange) {
				onAddressChange(address);
			}
		}
	}
</script>

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
	<div class="postal-code-container">
		<input
			type={field.type}
			name={field.name}
			placeholder={field.placeholder || '123-4567'}
			value={inputValue}
			required={field.required}
			{disabled}
			class:error={!!error}
			maxlength="8"
			oninput={handleInput}
			onkeydown={handleKeyDown}
			onblur={handleBlur}
		/>
		{#if isLoading}
			<div class="loading-indicator">検索中...</div>
		{/if}
	</div>
</label>

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
		& input {
			appearance: none;
		}
		&.has-error {
			grid-template-rows: 1.5rem 1fr;
		}
		& input.error {
			border-color: var(--color-danger, #c33);
			border-width: 2px;
		}
	}

	.postal-code-container {
		position: relative;
		width: 100%;
	}

	input {
		width: 100%;
	}

	.loading-indicator {
		position: absolute;
		right: 8px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 0.8em;
		color: var(--color-text-muted);
		pointer-events: none;
	}
</style>
