<script lang="ts">
	import defaultAvatar from '$lib/assets/images/avatar.png';
	import Input from './input.svelte';
	import BankCodeInput from './BankCodeInput.svelte';
	import { detailData } from '../data/detailsData';
	import Image from './image.svelte';
	import FormStyles from './FormStyles.svelte';
	import type { FieldConfig } from '../data/formData';
	import type { Employee } from '../types';
	import {
		FIELD_TO_EMPLOYEE_MAP,
		REQUIRED_FIELDS,
		BANK_ACCOUNT_OWNER_TYPE_EMPLOYEE
	} from '../utils/constants';
	import { validateField, validateEmployeeRequiredFields } from '../utils/validation';

	type Props = {
		mode: 'create' | 'edit';
		employee?: Employee;
		isEditing?: boolean;
		onCancel?: () => void;
		formId?: string;
	};

	let { mode, employee, isEditing = true, onCancel, formId = 'employee-form' }: Props = $props();

	// タブの状態管理
	let activeTabIndex = $state(0);

	// 現在アクティブなタブのデータ
	const activeDetail = $derived(detailData[activeTabIndex]);

	// 画像のsrcをリアクティブな変数で管理
	let employeeImageSrc = $state(defaultAvatar);

	// パスワードと確認用パスワードの値を追跡
	let passwordValue = $state<string>('');
	let passwordConfirmValue = $state<string>('');

	// 従業員基本情報の値を管理する状態
	let employeeFormValues: Record<string, string | number | undefined> = $state({});

	// フィールド名から従業員データへのマッピング（定数から取得）
	const fieldToEmployeeMap = FIELD_TO_EMPLOYEE_MAP;

	// フィールド名から従業員の値を取得
	function getEmployeeValue(fieldName: string): string | number | undefined {
		if (mode === 'create' || !employee) return undefined;
		const employeeKey = fieldToEmployeeMap[fieldName];
		if (employeeKey) {
			const value = employee[employeeKey as keyof typeof employee] as
				| string
				| number
				| null
				| undefined;
			// nullの場合はundefinedに変換（「null」という文字列が表示されないようにする）
			if (value === null) return undefined;
			return value;
		}
		return undefined;
	}

	// 従業員データが変更されたときに画像を更新（編集モードのみ）
	$effect(() => {
		if (mode === 'edit' && employee) {
			employeeImageSrc = employee.image || defaultAvatar;
			// パスワードの初期値をクリア（セキュリティのため）
			passwordValue = '';
			passwordConfirmValue = '';
			// 既存の従業員データをフォーム値に設定
			const employeeInfoDetail = detailData.find((d) => d.className === 'employee-info');
			if (employeeInfoDetail) {
				employeeInfoDetail.fields.forEach((field) => {
					const value = getEmployeeValue(field.name);
					if (value !== undefined && value !== null) {
						employeeFormValues[field.name] = value;
					}
				});
			}
			const employmentInfoDetail = detailData.find((d) => d.className === 'employment-info');
			if (employmentInfoDetail) {
				employmentInfoDetail.fields.forEach((field) => {
					const value = getEmployeeValue(field.name);
					if (value !== undefined && value !== null) {
						employeeFormValues[field.name] = value;
					}
				});
			}
			const licenseInfoDetail = detailData.find((d) => d.className === 'license-info');
			if (licenseInfoDetail) {
				licenseInfoDetail.fields.forEach((field) => {
					const value = getEmployeeValue(field.name);
					if (value !== undefined && value !== null) {
						employeeFormValues[field.name] = value;
					}
				});
			}
		} else if (mode === 'create') {
			// 作成モードでも初期値をクリア
			passwordValue = '';
			passwordConfirmValue = '';
			employeeFormValues = {};
		}
	});

	// エントリのtypeフィールドのラベルを取得
	function getEntryTypeLabel(entryFields: FieldConfig[], entryIndex: number): string | null {
		// 銀行口座情報の場合は「銀行名＋支店」を返す
		if (activeDetail.className === 'bank-account-info') {
			const bankName = getEntryFieldValue(entryIndex, 'bank_name');
			const branchName = getEntryFieldValue(entryIndex, 'branch_name');
			if (bankName || branchName) {
				return (
					`${bankName || ''}${bankName && branchName ? ' ' : ''}${branchName || ''}`.trim() || null
				);
			}
			return null;
		}

		// typeに相当するフィールドを探す（*_type_id または relationship を含むselectフィールド）
		const typeField = entryFields.find(
			(field) =>
				field.type === 'select' &&
				(field.name.includes('_type_id') ||
					field.name.includes('relationship') ||
					field.name === 'type')
		);
		if (!typeField || !typeField.options) return null;

		// 現在の値を取得（フォームの入力値から）
		const currentValue = getEntryFieldValue(entryIndex, typeField.name);
		if (currentValue === undefined) {
			// デフォルト値（selected: true）を探す
			const defaultOption = typeField.options.find((opt) => opt.selected);
			return defaultOption?.label || null;
		}

		// 現在の値に対応するラベルを探す
		const selectedOption = typeField.options.find((opt) => opt.value === String(currentValue));
		return selectedOption?.label || null;
	}

	// 複数登録可能なセクションのエントリ管理
	type EntryMap = Record<string, FieldConfig[][]>;
	let entries: EntryMap = $state({});

	// フォームの入力値を追跡する状態（エントリごとのフィールド値）
	type EntryValuesMap = Record<string, Record<number, Record<string, string | number | undefined>>>;
	let entryValues: EntryValuesMap = $state({});

	// エントリを初期化（タブが変わったときのみ）
	$effect(() => {
		const detail = detailData[activeTabIndex];
		if (detail && detail.showButtons && !entries[detail.className]) {
			entries[detail.className] = [detail.fields.map((field) => ({ ...field }))];
			// 初期値を設定
			if (!entryValues[detail.className]) {
				entryValues[detail.className] = {};
			}
			entryValues[detail.className][0] = {};
			detail.fields.forEach((field) => {
				// 銀行口座情報の場合、従業員ページでは所有者タイプを「従業員」に固定
				if (detail.className === 'bank-account-info' && field.name === 'owner_type_id') {
					entryValues[detail.className][0][field.name] = BANK_ACCOUNT_OWNER_TYPE_EMPLOYEE;
				} else {
					const value = getEmployeeValue(field.name);
					if (value !== undefined && value !== null) {
						entryValues[detail.className][0][field.name] = value;
					}
				}
			});
		}
	});

	// 現在のタブのエントリを取得
	const currentEntries = $derived(entries[activeDetail.className] || []);

	// エントリのフィールド値を取得
	function getEntryFieldValue(entryIndex: number, fieldName: string): string | number | undefined {
		const className = activeDetail.className;
		return entryValues[className]?.[entryIndex]?.[fieldName] ?? getEmployeeValue(fieldName);
	}

	// エントリのフィールド値を更新
	function updateEntryFieldValue(
		entryIndex: number,
		fieldName: string,
		value: string | number | undefined
	) {
		const className = activeDetail.className;
		if (!entryValues[className]) {
			entryValues[className] = {};
		}
		if (!entryValues[className][entryIndex]) {
			entryValues[className][entryIndex] = {};
		}
		// Svelte 5のリアクティビティを確実にトリガーするため、新しいオブジェクトを作成
		entryValues[className] = {
			...entryValues[className],
			[entryIndex]: {
				...entryValues[className][entryIndex],
				[fieldName]: value
			}
		};
	}

	// エントリを追加
	function addEntry(className: string, fields: FieldConfig[]) {
		if (!entries[className]) {
			entries[className] = [];
		}
		const newIndex = entries[className].length;
		entries[className] = [...entries[className], fields.map((field) => ({ ...field }))];
		// 新しいエントリの値を初期化
		if (!entryValues[className]) {
			entryValues[className] = {};
		}
		entryValues[className][newIndex] = {};
		// 銀行口座情報の場合、従業員ページでは所有者タイプを「従業員」に固定
		if (className === 'bank-account-info') {
			entryValues[className][newIndex]['owner_type_id'] = BANK_ACCOUNT_OWNER_TYPE_EMPLOYEE;
		}
	}

	// エントリを削除
	function removeEntry(className: string, index: number) {
		if (entries[className] && entries[className].length > 1) {
			entries[className] = entries[className].filter((_, i) => i !== index);
			// エントリの値を再インデックス
			if (entryValues[className]) {
				const newValues: Record<number, Record<string, string | number | undefined>> = {};
				entries[className].forEach((_, i) => {
					if (i < index) {
						newValues[i] = entryValues[className][i] || {};
					} else if (i >= index) {
						newValues[i] = entryValues[className][i + 1] || {};
					}
				});
				entryValues[className] = newValues;
			}
		}
	}

	// 編集モードの判定
	// 作成時は常に編集可能
	// 編集時はisEditingがfalseの時に編集可能（isEditing=trueは表示モード）
	const canEdit = $derived(mode === 'create' || !isEditing);

	// パスワード確認のバリデーション
	const passwordMismatch = $derived(
		passwordValue !== '' && passwordConfirmValue !== '' && passwordValue !== passwordConfirmValue
	);

	// フォーム送信状態
	let isSubmitting = $state(false);
	let submitError = $state<string | null>(null);

	// バリデーションエラーを管理する状態
	let fieldErrors: Record<string, string> = $state({});

	// フィールドが入力されたかどうかを追跡（touched状態）
	let touchedFields: Record<string, boolean> = $state({});

	// 必須フィールドの定義（定数から取得）
	const requiredFields = REQUIRED_FIELDS;

	// フィールドの値を更新（従業員基本情報用）
	function updateEmployeeValue(fieldName: string, value: string | number | undefined) {
		employeeFormValues[fieldName] = value;
		// フィールドが入力されたことを記録
		touchedFields[fieldName] = true;
		// リアルタイムバリデーション
		const error = validateField(fieldName, value);
		if (error) {
			fieldErrors = { ...fieldErrors, [fieldName]: error };
		} else {
			// エラーがない場合はエラーをクリア
			if (fieldErrors[fieldName]) {
				fieldErrors = { ...fieldErrors, [fieldName]: '' };
			}
		}
	}

	// フィールドのバリデーション状態を取得（チェックアイコン表示用）
	function getFieldValidationState(fieldName: string): 'error' | 'success' | 'required' | null {
		const value = employeeFormValues[fieldName] ?? getEmployeeValue(fieldName);

		// フィールドがselectかどうかを確認
		const fieldConfig = detailData
			.flatMap((detail) => detail.fields)
			.find((field) => field.name === fieldName);
		const isSelectField = fieldConfig?.formType === 'select';

		// 必須フィールドで未入力の場合
		if (requiredFields[fieldName]) {
			// エラーがある場合はエラー表示
			if (fieldErrors[fieldName]) {
				return 'error';
			}
			// 値が入力されていてエラーがない場合は成功表示
			if (value !== undefined && value !== null && String(value).trim() !== '' && value !== '0') {
				return 'success';
			}
			// 値が入力されていない場合は「必須項目」を表示
			return 'required';
		}

		// selectフィールドで値が選択されている場合（0以外）は成功表示
		if (
			isSelectField &&
			value !== undefined &&
			value !== null &&
			String(value).trim() !== '' &&
			value !== '0'
		) {
			return 'success';
		}

		// 必須フィールドでない場合
		if (!touchedFields[fieldName]) {
			return null;
		}
		// エラーがある場合はエラー表示
		if (fieldErrors[fieldName]) {
			return 'error';
		}
		// エラーがなく、値がある場合は成功表示
		if (value !== undefined && value !== null && String(value).trim() !== '' && value !== '0') {
			return 'success';
		}
		return null;
	}

	// フィールドの表示メッセージを取得
	function getFieldDisplayMessage(fieldName: string): string | undefined {
		const validationState = getFieldValidationState(fieldName);
		if (validationState === 'error') {
			return fieldErrors[fieldName];
		}
		if (validationState === 'required') {
			return '必須項目';
		}
		if (validationState === 'success') {
			return '';
		}
		return undefined;
	}

	// すべての必須フィールドをバリデーション
	function validateRequiredFields(): boolean {
		const validation = validateEmployeeRequiredFields(
			{},
			(fieldName) => employeeFormValues[fieldName] ?? getEmployeeValue(fieldName)
		);
		fieldErrors = validation.errors;
		return validation.isValid;
	}

	// フォームデータを収集してEmployee型に変換
	function collectFormData(): Partial<Employee> {
		const formDataObj: Partial<Employee> = {};

		// すべてのタブのフィールドを収集（employeeFormValuesを優先的に使用）
		detailData.forEach((detail) => {
			// 従業員基本情報、雇用情報、免許証情報のみを収集
			if (
				detail.className === 'employee-info' ||
				detail.className === 'employment-info' ||
				detail.className === 'license-info'
			) {
				detail.fields.forEach((field) => {
					// まずemployeeFormValuesから取得（これが最も確実）
					let value: string | number | undefined = employeeFormValues[field.name];

					// employeeFormValuesにない場合、FormDataから取得を試みる
					// ただし、非表示のタブのフィールドはDOMに存在しない可能性があるため、
					// 直接input要素を検索する
					if (value === undefined && formElement) {
						const inputElement = formElement.querySelector(
							`input[name="${field.name}"], select[name="${field.name}"]`
						) as HTMLInputElement | HTMLSelectElement | null;
						if (inputElement) {
							const inputValue = inputElement.value;
							if (inputValue !== null && inputValue !== undefined && inputValue !== '') {
								value = inputValue;
							}
						}
					}

					// それでもない場合、既存の従業員データから取得（編集モードの場合）
					if (value === undefined || value === '') {
						const existingValue = getEmployeeValue(field.name);
						if (
							existingValue !== undefined &&
							existingValue !== null &&
							String(existingValue).trim() !== ''
						) {
							value = existingValue;
						}
					}

					// 値が存在する場合のみ設定
					if (value !== undefined && value !== null && String(value).trim() !== '') {
						const employeeKey = fieldToEmployeeMap[field.name];
						if (employeeKey) {
							// 型変換
							// employee_idは文字列として保存
							if (field.name === 'employee_id') {
								formDataObj[employeeKey as keyof Employee] = String(value) as any;
							} else if (field.type === 'number') {
								const numValue = Number(value);
								if (!isNaN(numValue)) {
									formDataObj[employeeKey as keyof Employee] = numValue as any;
								}
							} else if (field.name.includes('_id') && field.type !== 'text') {
								// _idで終わるフィールドで、テキスト型でない場合は数値として扱う
								const numValue = Number(value);
								if (!isNaN(numValue)) {
									formDataObj[employeeKey as keyof Employee] = numValue as any;
								}
							} else if (field.type === 'date') {
								// 日付フィールドは文字列として保存
								formDataObj[employeeKey as keyof Employee] = String(value) as any;
							} else {
								// その他は文字列として保存
								formDataObj[employeeKey as keyof Employee] = String(value) as any;
							}
						}
					}
				});
			}
		});

		// パスワード
		if (passwordValue) {
			formDataObj.password = passwordValue;
		}

		// 画像データ（DataURLがデフォルトアバターでない場合、または編集モードで画像が変更された場合）
		if (employeeImageSrc && employeeImageSrc !== defaultAvatar) {
			// DataURL（base64）の場合はそのまま保存
			// 既存のURLの場合はそのまま保存
			if (
				employeeImageSrc.startsWith('data:') ||
				employeeImageSrc.startsWith('http://') ||
				employeeImageSrc.startsWith('https://')
			) {
				formDataObj.image = employeeImageSrc;
			}
		} else if (mode === 'edit' && employee?.image) {
			// 編集モードで画像が変更されていない場合は既存の画像を保持
			formDataObj.image = employee.image;
		}

		return formDataObj;
	}

	// フォーム送信処理
	async function handleSubmit(event: Event) {
		event.preventDefault();
		if (isSubmitting) return;

		// パスワード確認
		if (passwordValue && passwordValue !== passwordConfirmValue) {
			submitError = 'パスワードが一致しません';
			return;
		}

		isSubmitting = true;
		submitError = null;

		try {
			// バリデーション実行
			if (!validateRequiredFields()) {
				submitError = '必須フィールドを入力してください';
				isSubmitting = false;
				// エラーフィールドがあるタブにスクロール
				const firstErrorField = Object.keys(fieldErrors).find((key) => fieldErrors[key]);
				if (firstErrorField) {
					const errorFieldElement = formElement?.querySelector(`[name="${firstErrorField}"]`);
					if (errorFieldElement) {
						errorFieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
						(errorFieldElement as HTMLElement).focus();
					}
				}
				return;
			}

			const formData = collectFormData();

			// デバッグ用（開発時のみ）
			if (typeof window !== 'undefined' && import.meta.env.DEV) {
				console.log('Collected form data:', formData);
				console.log('employeeFormValues:', employeeFormValues);
				// employee_idフィールドの値を確認
				const employeeIdInput = formElement?.querySelector(
					'input[name="employee_id"]'
				) as HTMLInputElement;
				if (employeeIdInput) {
					console.log('employee_id input value:', employeeIdInput.value);
				}
			}

			// 念のため再度チェック（FormDataから取得した値）
			if (!formData.code || !formData.firstName || !formData.lastName || !formData.dateOfBirth) {
				submitError = `必須フィールドが入力されていません（従業員ID: ${formData.code ? '✓' : '✗'}, 名: ${formData.firstName ? '✓' : '✗'}, 姓: ${formData.lastName ? '✓' : '✗'}, 生年月日: ${formData.dateOfBirth ? '✓' : '✗'}）`;
				isSubmitting = false;
				return;
			}

			let response: Response;
			if (mode === 'create') {
				// 作成
				response = await fetch('/employees/api', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData)
				});
			} else {
				// 編集
				if (!employee?.id) {
					submitError = '従業員IDが取得できません';
					isSubmitting = false;
					return;
				}
				response = await fetch(`/employees/api/${employee.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(formData)
				});
			}

			if (!response.ok) {
				const error = await response.json();
				submitError = error.error || '保存に失敗しました';
				isSubmitting = false;
				return;
			}

			// 成功時は一覧ページにリダイレクト
			window.location.href = '/employees';
		} catch (error) {
			console.error('Error submitting form:', error);
			submitError = '保存中にエラーが発生しました';
			isSubmitting = false;
		}
	}

	// フォーム要素への参照
	let formElement = $state<HTMLFormElement | null>(null);

	// フォーム送信イベントを設定
	$effect(() => {
		if (formElement) {
			formElement.addEventListener('submit', handleSubmit);
			return () => {
				formElement?.removeEventListener('submit', handleSubmit);
			};
		}
	});
</script>

<FormStyles />
<div class="form-container">
	<div class="content">
		<div class="tab-container">
			{#each detailData as detail, index}
				<button
					class="tab-btn"
					class:active={activeTabIndex === index}
					onclick={() => (activeTabIndex = index)}
				>
					{detail.title}
				</button>
			{/each}
		</div>
		<form id={formId} bind:this={formElement} action="" class="form">
			{#if submitError}
				<div
					class="error-message"
					style="padding: 1rem; background: #fee; color: #c33; border-radius: 4px; margin-bottom: 1rem;"
				>
					{submitError}
				</div>
			{/if}
			<fieldset class="detail-container">
				<legend>
					{activeDetail.title}
					{#if activeDetail.className === 'bank-account-info'}
						<a
							href="https://zengin.ajtw.net/"
							target="_blank"
							rel="noopener noreferrer"
							class="bank-info-link"
							title="金融機関コード・銀行コード検索サイトを開く"
						>
							金融機関コード検索
						</a>
					{/if}
				</legend>
				{#if activeDetail.showButtons}
					<!-- 複数登録可能なセクション -->
					{#each currentEntries as entryFields, entryIndex}
						{@const typeLabel = getEntryTypeLabel(entryFields, entryIndex)}
						<fieldset class="entry-item">
							<legend class="entry-item-title">
								<span>
									{activeDetail.title}
									{entryIndex + 1}
									{#if typeLabel}
										<span class="entry-type-label"> - {typeLabel}</span>
									{/if}
								</span>
								{#if currentEntries.length > 1 && canEdit}
									<button
										type="button"
										class="btn remove-entry"
										onclick={() => removeEntry(activeDetail.className, entryIndex)}
										title="この項目を削除"
									>
										<span data-iconBefore="delete"></span>
									</button>
								{/if}
							</legend>
							<div class={['content-area', activeDetail.className]}>
								{#if activeDetail.className === 'employee-info' && entryIndex === 0}
									<Image bind:employeeImageSrc disabled={!canEdit} />
								{/if}
								{#each entryFields as field}
									{#if activeDetail.className === 'bank-account-info' && field.name === 'owner_type_id'}
										<!-- 従業員ページでは所有者タイプを非表示（固定値：従業員） -->
										<input
											type="hidden"
											name={field.name}
											value={BANK_ACCOUNT_OWNER_TYPE_EMPLOYEE}
										/>
									{:else if activeDetail.className === 'bank-account-info' && (field.name === 'bank_code' || field.name === 'branch_code')}
										<!-- 銀行コード・支店コード入力は専用コンポーネントを使用 -->
										<BankCodeInput
											{field}
											disabled={!canEdit}
											value={getEntryFieldValue(entryIndex, field.name)}
											bankCode={field.name === 'branch_code'
												? String(getEntryFieldValue(entryIndex, 'bank_code') || '')
												: ''}
											oninput={(e) => {
												const target = e.target as HTMLInputElement | HTMLSelectElement;
												updateEntryFieldValue(entryIndex, field.name, target.value);
											}}
											onBankInfoChange={(bankCode, bankName) => {
												updateEntryFieldValue(entryIndex, 'bank_code', bankCode);
												updateEntryFieldValue(entryIndex, 'bank_name', bankName);
											}}
											onBranchInfoChange={(branchCode, branchName) => {
												updateEntryFieldValue(entryIndex, 'branch_code', branchCode);
												updateEntryFieldValue(entryIndex, 'branch_name', branchName);
											}}
										/>
									{:else}
										<Input
											{field}
											disabled={!canEdit ||
												(activeDetail.className === 'bank-account-info' &&
													field.name === 'owner_type_id')}
											value={activeDetail.className === 'bank-account-info' &&
											field.name === 'owner_type_id'
												? BANK_ACCOUNT_OWNER_TYPE_EMPLOYEE
												: getEntryFieldValue(entryIndex, field.name)}
											oninput={(e) => {
												const target = e.target as HTMLInputElement | HTMLSelectElement;
												updateEntryFieldValue(entryIndex, field.name, target.value);
											}}
										/>
									{/if}
								{/each}
							</div>
						</fieldset>
					{/each}
					<div class="button-container">
						<button
							type="button"
							class="btn add"
							disabled={!canEdit}
							onclick={() => addEntry(activeDetail.className, activeDetail.fields)}
							data-iconBefore="add"
						>
							追加
						</button>
					</div>
				{:else}
					<!-- 単一登録のセクション -->
					{#if activeDetail.className === 'employment-info' || activeDetail.className === 'employee-info'}
						<!-- 雇用情報・従業員情報セクション: サブセクションごとに表示 -->
						{@const groupedFields: Record<string, FieldConfig[]> = activeDetail.fields.reduce<Record<string, FieldConfig[]>>((acc, field) => {
							const section = field.section || 'その他';
							if (!acc[section]) {
								acc[section] = [];
							}
							acc[section].push(field);
							return acc;
						}, {})}
						{@const sectionClassMap: Record<string, string> = {
							'雇用情報': 'employment',
							'解任情報': 'discharge',
							'退職情報': 'leave',
							'死亡情報': 'death',
							'基本情報': 'basic',
							'セキュリティ': 'security',
							'名前': 'name',
							'連絡先': 'contact',
							'住まい': 'address'
						}}
						{#each Object.entries(groupedFields) as [sectionName, fields]}
							<fieldset class="sub-section">
								<legend class="sub-section-title">{sectionName}</legend>
								<div
									class={[
										'content-area',
										activeDetail.className,
										`sub-section-${sectionClassMap[sectionName] || 'other'}`
									]}
								>
									{#if activeDetail.className === 'employee-info' && sectionName === '基本情報'}
										<Image bind:employeeImageSrc disabled={!canEdit} />
									{/if}
									{#each fields as field}
										{#if field.name === 'password'}
											<label class={field.className} style:grid-area={field.areaName}>
												<span>{field.label}: </span>
												<input
													type={field.type}
													name={field.name}
													placeholder={field.placeholder}
													value={passwordValue}
													required={field.required}
													disabled={!canEdit}
													oninput={(e) => {
														const target = e.target as HTMLInputElement;
														passwordValue = target.value;
													}}
												/>
											</label>
										{:else if field.name === 'password_confirm'}
											<label
												class={field.className}
												style:grid-area={field.areaName}
												class:has-error={passwordMismatch}
											>
												<span
													data-errMsg={passwordMismatch ? 'パスワードが一致しません' : undefined}
												>
													{field.label}:
												</span>
												<input
													type={field.type}
													name={field.name}
													placeholder={field.placeholder}
													value={passwordConfirmValue}
													required={field.required}
													disabled={!canEdit}
													class:error={passwordMismatch}
													oninput={(e) => {
														const target = e.target as HTMLInputElement;
														passwordConfirmValue = target.value;
													}}
												/>
											</label>
										{:else}
											<Input
												{field}
												disabled={!canEdit}
												value={employeeFormValues[field.name] ?? getEmployeeValue(field.name)}
												error={fieldErrors[field.name]}
												validationState={getFieldValidationState(field.name)}
												displayMessage={getFieldDisplayMessage(field.name)}
												oninput={(e) => {
													const target = e.target as HTMLInputElement | HTMLSelectElement;
													updateEmployeeValue(field.name, target.value);
												}}
											/>
										{/if}
									{/each}
								</div>
							</fieldset>
						{/each}
					{:else}
						<div class={['content-area', activeDetail.className]}>
							{#if activeDetail.className === 'employee-info'}
								<Image bind:employeeImageSrc disabled={!canEdit} />
							{/if}
							{#each activeDetail.fields as field}
								<Input
									{field}
									disabled={!canEdit}
									value={employeeFormValues[field.name] ?? getEmployeeValue(field.name)}
									error={fieldErrors[field.name]}
									validationState={getFieldValidationState(field.name)}
									displayMessage={getFieldDisplayMessage(field.name)}
									oninput={(e) => {
										const target = e.target as HTMLInputElement | HTMLSelectElement;
										updateEmployeeValue(field.name, target.value);
									}}
								/>
							{/each}
						</div>
					{/if}
				{/if}
			</fieldset>
		</form>
		{#if isSubmitting}
			<div class="submitting-overlay">
				<div class="submitting-message">保存中...</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.error-message {
		padding: 1rem;
		background: #fee;
		color: #c33;
		border-radius: 4px;
		margin-bottom: 1rem;
		border: 1px solid #fcc;
	}

	.submitting-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.submitting-message {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		font-size: 1.2rem;
	}
</style>
