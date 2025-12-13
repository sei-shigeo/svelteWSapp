<script lang="ts">
	import defaultAvatar from '$lib/assets/images/avatar.png';
	import Input from './input.svelte';
	import BankCodeInput from './BankCodeInput.svelte';
	import { detailData } from '../data/detailsData';
	import Image from './image.svelte';
	import FormStyles from './FormStyles.svelte';
	import type { FieldConfig } from '../data/formData';
	import type { Employee } from '../data/employeeData';

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

	// 従業員データが変更されたときに画像を更新（編集モードのみ）
	$effect(() => {
		if (mode === 'edit' && employee) {
			employeeImageSrc = employee.image || defaultAvatar;
			// パスワードの初期値をクリア（セキュリティのため）
			passwordValue = '';
			passwordConfirmValue = '';
		} else if (mode === 'create') {
			// 作成モードでも初期値をクリア
			passwordValue = '';
			passwordConfirmValue = '';
		}
	});

	// フィールド名から従業員データへのマッピング
	const fieldToEmployeeMap: Record<string, string> = {
		// 従業員情報
		employee_id: 'code',
		nationality_id: 'nationality',
		gender_id: 'gender',
		blood_type_id: 'bloodType',
		date_of_birth: 'dateOfBirth',
		first_name: 'firstName',
		middle_name: 'middleName',
		last_name: 'lastName',
		first_name_kana: 'firstNameKana',
		middle_name_kana: 'middleNameKana',
		last_name_kana: 'lastNameKana',
		phone: 'phone',
		phone_mobile: 'phone_mobile',
		phone_tel: 'phone_tel',
		email: 'email',
		postal_code: 'postal_code',
		address: 'address',
		role_id: 'role_id',
		image_at: 'image_at',
		// 雇用情報
		employment_type_id: 'employment_type_id',
		department_id: 'department_id',
		position_id: 'position_id',
		hire_date: 'hire_at',
		leave_date: 'leave_at',
		leave_reason: 'leave_reason',
		appointment_at: 'appointment_at',
		discharge_at: 'discharge_at',
		discharge_reason: 'discharge_reason',
		// 免許証情報
		license_type_id: 'license_type_id',
		license_number: 'license_number',
		license_expiration_date: 'license_exp_at',
		// その他情報
		death_at: 'death_at',
		death_reason: 'death_reason',
		note: 'note'
	};

	// フィールド名から従業員の値を取得
	function getEmployeeValue(fieldName: string): string | number | undefined {
		if (mode === 'create' || !employee) return undefined;
		const employeeKey = fieldToEmployeeMap[fieldName];
		if (employeeKey) {
			return employee[employeeKey as keyof typeof employee] as string | number | undefined;
		}
		return undefined;
	}

	// エントリのtypeフィールドのラベルを取得
	function getEntryTypeLabel(entryFields: FieldConfig[], entryIndex: number): string | null {
		// 銀行口座情報の場合は「銀行名＋支店」を返す
		if (activeDetail.className === 'bank-account-info') {
			const bankName = getEntryFieldValue(entryIndex, 'bank_name');
			const branchName = getEntryFieldValue(entryIndex, 'branch_name');
			if (bankName || branchName) {
				return `${bankName || ''}${bankName && branchName ? ' ' : ''}${branchName || ''}`.trim() || null;
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
					entryValues[detail.className][0][field.name] = 3; // 従業員
				} else {
					const value = getEmployeeValue(field.name);
					if (value !== undefined) {
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
	function updateEntryFieldValue(entryIndex: number, fieldName: string, value: string | number | undefined) {
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
			entryValues[className][newIndex]['owner_type_id'] = 3; // 従業員
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

	// パスワードと確認用パスワードの値を追跡
	let passwordValue = $state<string>('');
	let passwordConfirmValue = $state<string>('');

	// パスワード確認のバリデーション
	const passwordMismatch = $derived(
		passwordValue !== '' && passwordConfirmValue !== '' && passwordValue !== passwordConfirmValue
	);
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
		<form id={formId} action="" class="form">
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
									{activeDetail.title} {entryIndex + 1}
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
									<Image bind:employeeImageSrc />
								{/if}
							{#each entryFields as field}
								{#if activeDetail.className === 'bank-account-info' && field.name === 'owner_type_id'}
									<!-- 従業員ページでは所有者タイプを非表示（固定値：従業員） -->
									<input type="hidden" name={field.name} value="3" />
								{:else if activeDetail.className === 'bank-account-info' && (field.name === 'bank_code' || field.name === 'branch_code')}
									<!-- 銀行コード・支店コード入力は専用コンポーネントを使用 -->
									<BankCodeInput
										{field}
										disabled={!canEdit}
										value={getEntryFieldValue(entryIndex, field.name)}
										bankCode={field.name === 'branch_code' ? String(getEntryFieldValue(entryIndex, 'bank_code') || '') : ''}
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
										disabled={!canEdit || (activeDetail.className === 'bank-account-info' && field.name === 'owner_type_id')}
										value={activeDetail.className === 'bank-account-info' && field.name === 'owner_type_id'
											? 3
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
										<Image bind:employeeImageSrc />
									{/if}
									{#each fields as field}
										{#if field.name === 'password'}
											<label class={field.className} style:grid-area={field.areaName}>
												<span data-errMsg="true">{field.label}: </span>
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
											<label class={field.className} style:grid-area={field.areaName} class:has-error={passwordMismatch}>
												<span data-errMsg="true">{field.label}: </span>
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
												{#if passwordMismatch}
													<span class="error-message">パスワードが一致しません</span>
												{/if}
											</label>
										{:else}
											<Input {field} disabled={!canEdit} value={getEmployeeValue(field.name)} />
										{/if}
									{/each}
								</div>
							</fieldset>
						{/each}
					{:else}
						<div class={['content-area', activeDetail.className]}>
							{#if activeDetail.className === 'employee-info'}
								<Image bind:employeeImageSrc />
							{/if}
							{#each activeDetail.fields as field}
								<Input {field} disabled={!canEdit} value={getEmployeeValue(field.name)} />
							{/each}
						</div>
					{/if}
				{/if}
			</fieldset>
		</form>
	</div>
</div>

