<script lang="ts">
	import type { FieldConfig } from '../data/formData';
	import { PUBLIC_BANKCODEJP_API_KEY } from '$env/static/public';

	type Props = {
		field: FieldConfig;
		value?: string | number;
		disabled?: boolean;
		error?: string;
		validationState?: 'error' | 'success' | 'required' | null;
		displayMessage?: string;
		oninput?: (e: Event) => void;
		onBankInfoChange?: (bankCode: string, bankName: string) => void;
		onBranchInfoChange?: (branchCode: string, branchName: string) => void;
		bankCode?: string; // 支店コード検索時に使用
	};

	let {
		field,
		value,
		disabled,
		error,
		validationState,
		displayMessage,
		oninput,
		onBankInfoChange,
		onBranchInfoChange,
		bankCode = ''
	}: Props = $props();

	const displayValue = $derived(
		value !== undefined && value !== null
			? String(value)
			: field.value !== undefined && field.value !== null
				? String(field.value)
				: ''
	);

	// 検索結果の状態
	let searchResults = $state<Array<{ code: string; name: string }>>([]);
	let showSuggestions = $state(false);
	let isLoading = $state(false);
	let inputValue = $state('');
	let selectedIndex = $state(-1);

	// 入力値が変更されたときに検索
	$effect(() => {
		inputValue = displayValue;
	});

	// 銀行コード検索（BankCodeJP APIを使用）
	async function searchBankCode(query: string) {
		if (!query || query.length < 1) {
			searchResults = [];
			showSuggestions = false;
			return;
		}

		isLoading = true;
		try {
			// BankCodeJP API v3を使用
			const apiKey = PUBLIC_BANKCODEJP_API_KEY || '';
			if (!apiKey) {
				console.warn('BankCodeJP APIキーが設定されていません');
			}

			// v3の曖昧検索APIを使用
			const response = await fetch(
				`https://apis.bankcode-jp.com/v3/banks/search?q=${encodeURIComponent(query)}&limit=10`,
				{
					method: 'GET',
					headers: {
						Accept: 'application/json',
						apikey: apiKey
					}
				}
			);

			if (response.ok) {
				const data = await response.json();
				// v3のレスポンス形式: { banks: [...], size: number, ... }
				if (data.banks && Array.isArray(data.banks)) {
					searchResults = data.banks.slice(0, 10).map((item: { code?: string; name?: string }) => ({
						code: item.code || '',
						name: item.name || ''
					}));
					showSuggestions = searchResults.length > 0;
				}
			} else if (response.status === 403) {
				const errorData = await response.json().catch(() => ({}));
				console.error('APIキー制限エラー（403）:', errorData);
				console.error(
					'HTTPリファラー制限に開発環境のURL（http://localhost:5173/*）が含まれているか確認してください'
				);
				searchResults = [];
				showSuggestions = false;
			} else {
				const errorText = await response.text();
				console.error('銀行コード検索APIエラー:', response.status, response.statusText, errorText);
				searchResults = [];
				showSuggestions = false;
			}
		} catch (error) {
			console.error('銀行コード検索エラー:', error);
			searchResults = [];
			showSuggestions = false;
		} finally {
			isLoading = false;
		}
	}

	// 支店コード検索
	async function searchBranchCode(bankCode: string, branchQuery: string) {
		if (!bankCode || !branchQuery || branchQuery.length < 1) {
			searchResults = [];
			showSuggestions = false;
			return;
		}

		isLoading = true;
		try {
			const apiKey = PUBLIC_BANKCODEJP_API_KEY || '';
			// v3の支店曖昧検索APIを使用
			const response = await fetch(
				`https://apis.bankcode-jp.com/v3/branches/search?bankCode=${encodeURIComponent(bankCode)}&q=${encodeURIComponent(branchQuery)}&limit=10`,
				{
					method: 'GET',
					headers: {
						Accept: 'application/json',
						apikey: apiKey
					}
				}
			);

			if (response.ok) {
				const data = await response.json();
				// v3のレスポンス形式: { branches: [...], size: number, ... }
				if (data.branches && Array.isArray(data.branches)) {
					searchResults = data.branches
						.slice(0, 10)
						.map((item: { code?: string; name?: string }) => ({
							code: item.code || '',
							name: item.name || ''
						}));
					showSuggestions = searchResults.length > 0;
				}
			} else if (response.status === 403) {
				const errorData = await response.json().catch(() => ({}));
				console.error('APIキー制限エラー（403）:', errorData);
				console.error(
					'HTTPリファラー制限に開発環境のURL（http://localhost:5173/*）が含まれているか確認してください'
				);
				searchResults = [];
				showSuggestions = false;
			} else {
				const errorText = await response.text();
				console.error('支店コード検索APIエラー:', response.status, response.statusText, errorText);
				searchResults = [];
				showSuggestions = false;
			}
		} catch (error) {
			console.error('支店コード検索エラー:', error);
			searchResults = [];
			showSuggestions = false;
		} finally {
			isLoading = false;
		}
	}

	// 銀行コードから銀行名を取得（完全一致）
	async function getBankNameByCode(code: string) {
		if (!code || code.length < 4) return null;

		try {
			const apiKey = PUBLIC_BANKCODEJP_API_KEY || '';
			if (!apiKey) {
				console.error(
					'APIキーが設定されていません。.envファイルにPUBLIC_BANKCODEJP_API_KEYを設定してください。'
				);
				return null;
			}

			// v3の金融機関個別取得APIを使用（/v3/banks/{code}）
			// まず個別取得APIを試す
			let url = `https://apis.bankcode-jp.com/v3/banks/${encodeURIComponent(code)}`;
			let response = await fetch(url, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					apikey: apiKey
				}
			});

			if (response.ok) {
				const data = await response.json();
				// 個別取得の場合は単一のbankオブジェクトが返される
				if (data && data.code) {
					return data.name || null;
				}
			} else if (response.status === 403) {
				// 403エラーの場合は、APIキーの制限に関するエラー
				const errorData = await response.json().catch(() => ({}));
				console.error('APIキー制限エラー（403）:', errorData);
				console.error('解決方法:');
				console.error(
					'1. BankCodeJP APIダッシュボードでAPIキーのHTTPリファラー制限を確認してください'
				);
				console.error('2. 開発環境の場合、以下のリファラーを追加してください:');
				console.error('   - http://localhost:5173/*');
				console.error('   - http://localhost:*/*');
				console.error('3. 本番環境のURLも追加してください');
				alert(
					'APIキーの制限によりリクエストが拒否されました。\nHTTPリファラー制限に開発環境のURL（http://localhost:5173/*）が含まれているか確認してください。'
				);
			} else if (response.status === 404) {
				// 個別取得で見つからない場合は、フィルタで検索
				url = `https://apis.bankcode-jp.com/v3/banks?filter=code=${encodeURIComponent(code)}&limit=1`;
				response = await fetch(url, {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						apikey: apiKey
					}
				});

				if (response.ok) {
					const data = await response.json();
					if (data.banks && Array.isArray(data.banks) && data.banks.length > 0) {
						const bank = data.banks[0];
						return bank.name || null;
					}
				} else if (response.status === 403) {
					const errorData = await response.json().catch(() => ({}));
					console.error('APIキー制限エラー（フィルタ、403）:', errorData);
					alert(
						'APIキーの制限によりリクエストが拒否されました。\nHTTPリファラー制限に開発環境のURL（http://localhost:5173/*）が含まれているか確認してください。'
					);
				} else {
					const errorText = await response.text();
					console.error(
						'銀行名取得APIエラー（フィルタ）:',
						response.status,
						response.statusText,
						errorText
					);
				}
			} else {
				const errorText = await response.text();
				console.error(
					'銀行名取得APIエラー（個別取得）:',
					response.status,
					response.statusText,
					errorText
				);
			}
		} catch (error) {
			console.error('銀行名取得エラー:', error);
		}
		return null;
	}

	// 支店コードから支店名を取得（完全一致）
	async function getBranchNameByCode(bankCode: string, branchCode: string) {
		if (!bankCode || !branchCode || branchCode.length < 3) return null;

		try {
			const apiKey = PUBLIC_BANKCODEJP_API_KEY || '';
			if (!apiKey) {
				console.error(
					'APIキーが設定されていません。.envファイルにPUBLIC_BANKCODEJP_API_KEYを設定してください。'
				);
				return null;
			}

			// v3の支店個別取得APIを使用（/v3/banks/{bankCode}/branches/{branchCode}）
			// まず個別取得APIを試す
			let url = `https://apis.bankcode-jp.com/v3/banks/${encodeURIComponent(bankCode)}/branches/${encodeURIComponent(branchCode)}`;
			let response = await fetch(url, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					apikey: apiKey
				}
			});

			if (response.ok) {
				const data = await response.json();
				// 個別取得のレスポンス形式: { bank: {...}, branch: {...} }
				if (data && data.branch && data.branch.code) {
					return data.branch.name || null;
				} else if (data && data.code) {
					// フォールバック: 直接branchオブジェクトが返される場合
					return data.name || null;
				}
			} else if (response.status === 404) {
				// 個別取得で見つからない場合は、フィルタで検索
				url = `https://apis.bankcode-jp.com/v3/branches?filter=bankCode=${encodeURIComponent(bankCode)} AND code=${encodeURIComponent(branchCode)}&limit=1`;
				response = await fetch(url, {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						apikey: apiKey
					}
				});

				if (response.ok) {
					const data = await response.json();
					if (data.branches && Array.isArray(data.branches) && data.branches.length > 0) {
						const branch = data.branches[0];
						return branch.name || null;
					}
				} else if (response.status === 403) {
					const errorData = await response.json().catch(() => ({}));
					console.error('APIキー制限エラー（フィルタ、403）:', errorData);
					alert(
						'APIキーの制限によりリクエストが拒否されました。\nHTTPリファラー制限に開発環境のURL（http://localhost:5173/*）が含まれているか確認してください。'
					);
				} else {
					const errorText = await response.text();
					console.error(
						'支店名取得APIエラー（フィルタ）:',
						response.status,
						response.statusText,
						errorText
					);
				}
			} else if (response.status === 403) {
				const errorData = await response.json().catch(() => ({}));
				console.error('APIキー制限エラー（個別取得、403）:', errorData);
				alert(
					'APIキーの制限によりリクエストが拒否されました。\nHTTPリファラー制限に開発環境のURL（http://localhost:5173/*）が含まれているか確認してください。'
				);
			} else {
				const errorText = await response.text();
				console.error(
					'支店名取得APIエラー（個別取得）:',
					response.status,
					response.statusText,
					errorText
				);
			}
		} catch (error) {
			console.error('支店名取得エラー:', error);
		}
		return null;
	}

	// 入力ハンドラー
	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const newValue = target.value;
		inputValue = newValue;
		selectedIndex = -1; // 入力時に選択をリセット

		// 元のoninputイベントを呼び出し
		if (oninput) {
			oninput(e);
		}

		// 銀行コードまたは支店コードの検索
		if (field.name === 'bank_code') {
			searchBankCode(newValue);
		} else if (field.name === 'branch_code') {
			// 銀行コードを使用して支店コードを検索
			searchBranchCode(bankCode, newValue);
		}
	}

	// 入力完了時の処理（blur時）
	async function handleBlurComplete() {
		// 少し遅延させてクリックイベントを処理できるようにする
		setTimeout(async () => {
			showSuggestions = false;

			// 銀行コードが完全に入力された場合、銀行名を自動取得
			if (field.name === 'bank_code' && inputValue && inputValue.length >= 4) {
				const bankName = await getBankNameByCode(inputValue);
				if (bankName && onBankInfoChange) {
					onBankInfoChange(inputValue, bankName);
				}
			}
			// 支店コードが完全に入力された場合、支店名を自動取得
			else if (field.name === 'branch_code' && inputValue && inputValue.length >= 3 && bankCode) {
				const branchName = await getBranchNameByCode(bankCode, inputValue);
				if (branchName && onBranchInfoChange) {
					onBranchInfoChange(inputValue, branchName);
				}
			}
		}, 200);
	}

	// 候補を選択
	function selectSuggestion(result: { code: string; name: string }) {
		inputValue = result.code;
		showSuggestions = false;
		selectedIndex = -1;

		// 入力イベントを発火
		const input = document.querySelector(`input[name="${field.name}"]`) as HTMLInputElement;
		if (input) {
			input.value = result.code;
			const event = new Event('input', { bubbles: true });
			input.dispatchEvent(event);
			// 元のoninputイベントを呼び出し
			if (oninput) {
				oninput(event);
			}
		}

		// 銀行情報または支店情報の変更を通知
		if (field.name === 'bank_code' && onBankInfoChange) {
			onBankInfoChange(result.code, result.name);
		} else if (field.name === 'branch_code' && onBranchInfoChange) {
			onBranchInfoChange(result.code, result.name);
		}
	}

	// Enterキー押下時の処理
	async function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			showSuggestions = false;

			// 銀行コードが完全に入力された場合、銀行名を自動取得
			if (field.name === 'bank_code' && inputValue && inputValue.length >= 4) {
				const bankName = await getBankNameByCode(inputValue);
				if (bankName && onBankInfoChange) {
					onBankInfoChange(inputValue, bankName);
				}
			}
			// 支店コードが完全に入力された場合、支店名を自動取得
			else if (field.name === 'branch_code' && inputValue && inputValue.length >= 3 && bankCode) {
				const branchName = await getBranchNameByCode(bankCode, inputValue);
				if (branchName && onBranchInfoChange) {
					onBranchInfoChange(inputValue, branchName);
				}
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
	<div class="autocomplete-container">
		<input
			type={field.type}
			name={field.name}
			placeholder={field.placeholder}
			value={inputValue}
			required={field.required}
			{disabled}
			class:error={!!error}
			oninput={handleInput}
			onkeydown={handleKeyDown}
			onfocus={() => {
				if (inputValue && searchResults.length === 0) {
					if (field.name === 'bank_code') {
						searchBankCode(inputValue);
					} else if (field.name === 'branch_code') {
						searchBranchCode(bankCode, inputValue);
					}
				} else {
					showSuggestions = searchResults.length > 0;
				}
			}}
			onblur={handleBlurComplete}
		/>
		{#if isLoading}
			<div class="loading-indicator">検索中...</div>
		{/if}
		{#if showSuggestions && searchResults.length > 0}
			<ul class="suggestions-list" role="listbox">
				{#each searchResults as result, index}
					<li role="option" class="suggestion-item" aria-selected={selectedIndex === index}>
						<button
							type="button"
							class="suggestion-button"
							onclick={() => selectSuggestion(result)}
							onmouseenter={() => (selectedIndex = index)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									selectSuggestion(result);
								} else if (e.key === 'ArrowDown') {
									e.preventDefault();
									selectedIndex = Math.min(selectedIndex + 1, searchResults.length - 1);
								} else if (e.key === 'ArrowUp') {
									e.preventDefault();
									selectedIndex = Math.max(selectedIndex - 1, -1);
								}
							}}
						>
							<span class="suggestion-code">{result.code}</span>
							<span class="suggestion-name">{result.name}</span>
						</button>
					</li>
				{/each}
			</ul>
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

	.autocomplete-container {
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

	.suggestions-list {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background-color: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		max-height: 200px;
		overflow-y: auto;
		z-index: 1000;
		margin-top: 4px;
		list-style: none;
		padding: 0;
	}

	.suggestion-item {
		padding: 0;
		list-style: none;
	}

	.suggestion-button {
		width: 100%;
		padding: var(--spacing-xs) var(--spacing-sm);
		cursor: pointer;
		display: flex;
		gap: var(--spacing-sm);
		align-items: center;
		transition: background-color 0.2s ease;
		background: none;
		border: none;
		text-align: left;
		color: inherit;
		font: inherit;
	}

	.suggestion-button:hover,
	.suggestion-button:focus {
		background-color: var(--color-bg-muted);
		outline: none;
	}

	.suggestion-code {
		font-weight: 600;
		color: var(--color-primary);
		min-width: 60px;
	}

	.suggestion-name {
		color: var(--color-text);
		flex: 1;
	}
</style>
