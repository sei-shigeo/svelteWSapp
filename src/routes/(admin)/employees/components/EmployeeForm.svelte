<script lang="ts">
	import defaultAvatar from '$lib/assets/images/avatar.png';
	import Input from './input.svelte';
	import BankCodeInput from './BankCodeInput.svelte';
	import PostalCodeInput from './PostalCodeInput.svelte';
	import GoogleMap from './GoogleMap.svelte';
	import { detailData } from '../data/detailsData';
	import Image from './image.svelte';
	import FormStyles from './FormStyles.svelte';
	import type { FieldConfig } from '../data/formData';
	import type { Employee } from '../types';
	import { env } from '$env/dynamic/public';
	import {
		FIELD_TO_EMPLOYEE_MAP,
		REQUIRED_FIELDS,
		BANK_ACCOUNT_OWNER_TYPE_EMPLOYEE,
		STATIC_MASTER_DATA
	} from '../utils/constants';
	import { validateField, validateEmployeeRequiredFields } from '../utils/validation';
	import { onMount } from 'svelte';

	type Props = {
		mode: 'create' | 'edit';
		employee?: Employee;
		isEditing?: boolean;
		onCancel?: () => void;
		formId?: string;
	};

	let { mode, employee, isEditing = true, onCancel, formId = 'employee-form' }: Props = $props();

	// マスターデータの型定義
	type MasterDataItem = { id: number | string | boolean; label: string };
	type MasterData = {
		nationality: MasterDataItem[];
		employeeClassification: MasterDataItem[];
		department: MasterDataItem[];
		position: MasterDataItem[];
		educationType: MasterDataItem[];
		suitabilityAssessmentType: MasterDataItem[];
		specialEducationType: MasterDataItem[];
		healthCheckupType: MasterDataItem[];
		ownerType: MasterDataItem[];
		bankAccountType: MasterDataItem[];
		licenseType: MasterDataItem[];
		role: MasterDataItem[];
		gender: MasterDataItem[];
		bloodType: MasterDataItem[];
		relationship: MasterDataItem[];
		qualificationCertificateType: MasterDataItem[];
		insuranceType: MasterDataItem[];
		defaultAccount: MasterDataItem[];
	};

	// マスターデータを保持する状態
	let masterData = $state<MasterData>({
		nationality: [],
		employeeClassification: [],
		department: [],
		position: [],
		educationType: [],
		suitabilityAssessmentType: [],
		specialEducationType: [],
		healthCheckupType: [],
		ownerType: [],
		bankAccountType: [],
		licenseType: [],
		role: [],
		gender: STATIC_MASTER_DATA.gender,
		bloodType: STATIC_MASTER_DATA.bloodType,
		relationship: STATIC_MASTER_DATA.relationship,
		qualificationCertificateType: STATIC_MASTER_DATA.qualificationCertificateType,
		insuranceType: STATIC_MASTER_DATA.insuranceType,
		defaultAccount: STATIC_MASTER_DATA.defaultAccount
	});

	// マスターデータをAPIから取得
	onMount(async () => {
		try {
			const response = await fetch('/employees/api/masters');
			if (response.ok) {
				const data = await response.json();
				masterData.nationality = data.nationalityData || [];
				masterData.employeeClassification = data.employeeClassificationData || [];
				masterData.department = data.departmentData || [];
				masterData.position = data.positionData || [];
				masterData.educationType = data.educationTypeData || [];
				masterData.suitabilityAssessmentType = data.suitabilityAssessmentTypeData || [];
				masterData.specialEducationType = data.specialEducationTypeData || [];
				masterData.healthCheckupType = data.healthCheckupTypeData || [];
				masterData.ownerType = data.ownerTypeData || [];
				masterData.bankAccountType = data.bankAccountTypeData || [];
				masterData.licenseType = data.licenseTypeData || [];
				masterData.role = data.roleData || [];
			}
		} catch (error) {
			console.error('Failed to load master data:', error);
		}
	});

	// タブの状態管理
	let activeTabIndex = $state(0);

	// 現在アクティブなタブのデータ
	const activeDetail = $derived(detailData[activeTabIndex]);

	// 画像のsrcをリアクティブな変数で管理
	let employeeImageSrc = $state(defaultAvatar);

	// 撮影日の値を管理
	let imageAtValue = $state<string>('');

	// パスワードと確認用パスワードの値を追跡
	let passwordValue = $state<string>('');
	let passwordConfirmValue = $state<string>('');

	// メールアドレスと確認用メールアドレスの値を追跡
	let emailValue = $state<string>('');
	let emailConfirmValue = $state<string>('');

	// 住所の値を追跡（Google Maps表示用）
	const currentAddress = $derived(() => {
		return String(employeeFormValues['address'] ?? getEmployeeValue('address') ?? '');
	});

	// 和暦/西暦の選択状態
	let dateCalendarType = $state<'seireki' | 'wareki'>('seireki');

	// 和暦の元号定義
	const eraData = [
		{ name: '令和', startYear: 2019, startMonth: 5, startDay: 1 },
		{ name: '平成', startYear: 1989, startMonth: 1, startDay: 8 },
		{ name: '昭和', startYear: 1926, startMonth: 12, startDay: 25 },
		{ name: '大正', startYear: 1912, startMonth: 7, startDay: 30 },
		{ name: '明治', startYear: 1868, startMonth: 1, startDay: 25 }
	];

	// 西暦から和暦に変換
	function convertToWareki(year: number, month: number, day: number): { era: string; eraYear: number } | null {
		const date = new Date(year, month - 1, day);
		for (const era of eraData) {
			const eraStart = new Date(era.startYear, era.startMonth - 1, era.startDay);
			if (date >= eraStart) {
				const eraYear = year - era.startYear + 1;
				return { era: era.name, eraYear };
			}
		}
		return null;
	}

	// 和暦から西暦に変換
	function convertToSeireki(era: string, eraYear: number, month: number, day: number): string | null {
		const eraInfo = eraData.find((e) => e.name === era);
		if (!eraInfo) return null;
		const seirekiYear = eraInfo.startYear + eraYear - 1;
		try {
			const date = new Date(seirekiYear, month - 1, day);
			if (date.getFullYear() === seirekiYear && date.getMonth() === month - 1 && date.getDate() === day) {
				return `${seirekiYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
			}
		} catch {
			return null;
		}
		return null;
	}

	// 西暦日付を和暦表示に変換
	function formatToWareki(dateStr: string): string | null {
		if (!dateStr) return null;
		try {
			const [year, month, day] = dateStr.split('-').map(Number);
			const wareki = convertToWareki(year, month, day);
			if (wareki) {
				return `${wareki.era}${wareki.eraYear}年${month}月${day}日`;
			}
		} catch {
			return null;
		}
		return null;
	}

	// 和暦入力値の状態管理
	let warekiEra = $state<string>('');
	let warekiYear = $state<string>('');
	let warekiMonth = $state<string>('');
	let warekiDay = $state<string>('');

	// 西暦日付から和暦入力値を初期化
	function initializeWarekiFromSeireki(dateStr: string) {
		if (!dateStr) {
			warekiEra = '';
			warekiYear = '';
			warekiMonth = '';
			warekiDay = '';
			return;
		}
		try {
			const [year, month, day] = dateStr.split('-').map(Number);
			const wareki = convertToWareki(year, month, day);
			if (wareki) {
				warekiEra = wareki.era;
				warekiYear = String(wareki.eraYear);
				warekiMonth = String(month);
				warekiDay = String(day);
			}
		} catch {
			warekiEra = '';
			warekiYear = '';
			warekiMonth = '';
			warekiDay = '';
		}
	}

	// 和暦入力値から西暦日付に変換して保存
	function updateDateFromWareki() {
		if (warekiEra && warekiYear && warekiMonth && warekiDay) {
			const seirekiDate = convertToSeireki(
				warekiEra,
				Number(warekiYear),
				Number(warekiMonth),
				Number(warekiDay)
			);
			if (seirekiDate) {
				updateEmployeeValue('date_of_birth', seirekiDate);
			}
		}
	}

	// 年齢を計算する関数
	function calculateAge(dateOfBirth: string | undefined): number | null {
		if (!dateOfBirth) return null;
		try {
			const birthDate = new Date(dateOfBirth);
			const today = new Date();
			let age = today.getFullYear() - birthDate.getFullYear();
			const monthDiff = today.getMonth() - birthDate.getMonth();
			if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
				age--;
			}
			return age >= 0 ? age : null;
		} catch {
			return null;
		}
	}

	// 生年月日から年齢を計算
	const age = $derived(() => {
		const dateOfBirth = String(employeeFormValues['date_of_birth'] ?? getEmployeeValue('date_of_birth') ?? '');
		return calculateAge(dateOfBirth || undefined);
	});

	// 生年月日の値を監視して和暦入力を初期化
	$effect(() => {
		const dateOfBirth = String(employeeFormValues['date_of_birth'] ?? getEmployeeValue('date_of_birth') ?? '');
		if (dateCalendarType === 'wareki' && dateOfBirth) {
			initializeWarekiFromSeireki(dateOfBirth);
		}
	});

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
			// 撮影日の初期値を設定
			const imageAtValueFromEmployee = getEmployeeValue('image_at');
			imageAtValue = imageAtValueFromEmployee ? String(imageAtValueFromEmployee) : '';
			// パスワードの初期値をクリア（セキュリティのため）
			passwordValue = '';
			passwordConfirmValue = '';
			// メールアドレスの初期値を設定（フォーム値に設定後）
			emailConfirmValue = '';
			// 既存の従業員データをフォーム値に設定
			const employeeInfoDetail = detailData.find((d) => d.className === 'employee-info');
			if (employeeInfoDetail) {
				employeeInfoDetail.fields.forEach((field) => {
					const value = getEmployeeValue(field.name);
					if (value !== undefined && value !== null) {
						employeeFormValues[field.name] = value;
						// メールアドレスの初期値を設定
						if (field.name === 'email') {
							emailValue = String(value);
						}
						// 生年月日の初期値を設定（和暦入力も初期化）
						if (field.name === 'date_of_birth') {
							const dateStr = String(value);
							if (dateCalendarType === 'wareki') {
								initializeWarekiFromSeireki(dateStr);
							}
						}
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
			imageAtValue = '';
			passwordValue = '';
			passwordConfirmValue = '';
			emailValue = '';
			emailConfirmValue = '';
			employeeFormValues = {};
		}
	});

	// フィールド名からマスターデータの選択肢を取得
	function getOptionsForField(fieldName: string): MasterDataItem[] {
		const fieldMap: Record<string, keyof MasterData> = {
			nationality_id: 'nationality',
			gender_id: 'gender',
			blood_type_id: 'bloodType',
			role_id: 'role',
			employment_type_id: 'employeeClassification',
			department_id: 'department',
			position_id: 'position',
			license_type_id: 'licenseType',
			qualification_certificate_type_id: 'qualificationCertificateType',
			insurance_type_id: 'insuranceType',
			education_type_id: 'educationType',
			health_checkup_type_id: 'healthCheckupType',
			suitability_assessment_type_id: 'suitabilityAssessmentType',
			special_education_type_id: 'specialEducationType',
			owner_type_id: 'ownerType',
			account_type: 'bankAccountType',
			default_account: 'defaultAccount',
			relationship_contact: 'relationship'
		};

		const key = fieldMap[fieldName];
		return key ? masterData[key] : [];
	}

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
		if (!typeField) return null;

		// 現在の値を取得（フォームの入力値から）
		const currentValue = getEntryFieldValue(entryIndex, typeField.name);
		const options = getOptionsForField(typeField.name);

		if (currentValue === undefined) {
			// デフォルト値（最初の選択肢）を返す
			return options[0]?.label || null;
		}

		// 現在の値に対応するラベルを探す
		const selectedOption = options.find((opt) => String(opt.id) === String(currentValue));
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

	// メールアドレス確認のバリデーション
	const emailMismatch = $derived(
		emailValue !== '' && emailConfirmValue !== '' && emailValue !== emailConfirmValue
	);

	// 現在選択されている国籍IDを取得
	const currentNationalityId = $derived(() => {
		const nationalityValue = employeeFormValues['nationality_id'] ?? getEmployeeValue('nationality_id');
		return nationalityValue ? Number(nationalityValue) : undefined;
	});

	// フィールドが表示されるかどうかを判定
	function shouldShowField(field: FieldConfig): boolean {
		// ミドルネーム、ミドルネーム(カナ)は国籍が日本でない時だけ表示
		if (field.name === 'middle_name' || field.name === 'middle_name_kana') {
			const nationalityId = currentNationalityId();
			// 国籍IDが1（日本）でない場合のみ表示
			return nationalityId !== undefined && nationalityId !== 1;
		}
		return true;
	}

	// セクションが表示されるかどうかを判定
	function shouldShowSection(sectionName: string): boolean {
		// 解任情報、退職情報、死亡情報は編集画面でのみ表示
		if (sectionName === '解任情報' || sectionName === '退職情報' || sectionName === '死亡情報') {
			// isEditingがfalse（編集モード）の時のみ表示
			return !isEditing;
		}
		return true;
	}

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

		// 撮影日
		if (imageAtValue) {
			const employeeKey = fieldToEmployeeMap['image_at'];
			if (employeeKey) {
				formDataObj[employeeKey as keyof Employee] = imageAtValue as any;
			}
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

		// メールアドレス確認
		if (emailValue && emailValue !== emailConfirmValue) {
			submitError = 'メールアドレスが一致しません';
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
									<Image
										bind:employeeImageSrc
										disabled={!canEdit}
										bind:imageAt={imageAtValue}
										onImageAtChange={(value) => {
											imageAtValue = value;
											updateEmployeeValue('image_at', value);
										}}
									/>
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
											options={getOptionsForField(field.name)}
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
							{#if shouldShowSection(sectionName)}
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
											<Image
												bind:employeeImageSrc
												disabled={!canEdit}
												bind:imageAt={imageAtValue}
												onImageAtChange={(value) => {
													imageAtValue = value;
													updateEmployeeValue('image_at', value);
												}}
											/>
										{/if}
										{#each fields as field}
											{#if shouldShowField(field) && field.name !== 'image_at'}
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
										{:else if field.name === 'email'}
											<label class={field.className} style:grid-area={field.areaName}>
												<span>{field.label}: </span>
												<input
													type={field.type}
													name={field.name}
													placeholder={field.placeholder}
													value={emailValue || String(employeeFormValues[field.name] ?? getEmployeeValue(field.name) ?? '')}
													required={field.required}
													disabled={!canEdit}
													oninput={(e) => {
														const target = e.target as HTMLInputElement;
														emailValue = target.value;
														updateEmployeeValue(field.name, target.value);
													}}
												/>
											</label>
										{:else if field.name === 'email_confirm'}
											<label
												class={field.className}
												style:grid-area={field.areaName}
												class:has-error={emailMismatch}
											>
												<span
													data-errMsg={emailMismatch ? 'メールアドレスが一致しません' : undefined}
												>
													{field.label}:
												</span>
												<input
													type={field.type}
													name={field.name}
													placeholder={field.placeholder}
													value={emailConfirmValue}
													required={field.required}
													disabled={!canEdit}
													class:error={emailMismatch}
													oninput={(e) => {
														const target = e.target as HTMLInputElement;
														emailConfirmValue = target.value;
													}}
												/>
											</label>
										{:else if field.name === 'postal_code'}
											<!-- 郵便番号入力は専用コンポーネントを使用 -->
											<PostalCodeInput
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
												onAddressChange={(address) => {
													// 住所フィールドに自動入力
													updateEmployeeValue('address', address);
												}}
											/>
										{:else if field.name === 'date_of_birth'}
											<!-- 生年月日フィールドと年齢表示 -->
											<label class={field.className} style:grid-area={field.areaName}>
												<div class="date-of-birth-label-wrapper">
													<span>{field.label}: </span>
													<div class="calendar-type-selector">
														<button
															type="button"
															class="calendar-type-btn"
															class:active={dateCalendarType === 'seireki'}
															disabled={!canEdit}
															onclick={() => {
																dateCalendarType = 'seireki';
															}}
														>
															西暦
														</button>
														<button
															type="button"
															class="calendar-type-btn"
															class:active={dateCalendarType === 'wareki'}
															disabled={!canEdit}
															onclick={() => {
																dateCalendarType = 'wareki';
																const currentDate = String(employeeFormValues[field.name] ?? getEmployeeValue(field.name) ?? '');
																initializeWarekiFromSeireki(currentDate);
															}}
														>
															和暦
														</button>
													</div>
												</div>
												<div class="date-of-birth-input-wrapper">
													{#if dateCalendarType === 'seireki'}
														<div class="date-of-birth-wrapper">
															<input
																type={field.type}
																name={field.name}
																placeholder={field.placeholder}
																value={employeeFormValues[field.name] ?? getEmployeeValue(field.name)}
																required={field.required}
																disabled={!canEdit}
																oninput={(e) => {
																	const target = e.target as HTMLInputElement;
																	updateEmployeeValue(field.name, target.value);
																}}
															/>
															{#if age() !== null}
																<span class="age-display">{age()}歳</span>
															{/if}
														</div>
													{:else}
														<div class="wareki-input-wrapper">
															<select
																name="wareki_era"
																disabled={!canEdit}
																bind:value={warekiEra}
																onchange={updateDateFromWareki}
																class="wareki-era-select"
															>
																<option value="">元号</option>
																{#each eraData as era}
																	<option value={era.name}>{era.name}</option>
																{/each}
															</select>
															<input
																type="number"
																name="wareki_year"
																placeholder="年"
																min="1"
																max="100"
																disabled={!canEdit}
																bind:value={warekiYear}
																oninput={updateDateFromWareki}
																class="wareki-year-input"
															/>
															<span class="wareki-unit">年</span>
															<input
																type="number"
																name="wareki_month"
																placeholder="月"
																min="1"
																max="12"
																disabled={!canEdit}
																bind:value={warekiMonth}
																oninput={updateDateFromWareki}
																class="wareki-month-input"
															/>
															<span class="wareki-unit">月</span>
															<input
																type="number"
																name="wareki_day"
																placeholder="日"
																min="1"
																max="31"
																disabled={!canEdit}
																bind:value={warekiDay}
																oninput={updateDateFromWareki}
																class="wareki-day-input"
															/>
															<span class="wareki-unit">日</span>
															{#if age() !== null}
																<span class="age-display">{age()}歳</span>
															{/if}
														</div>
													{/if}
												</div>
											</label>
										{:else if field.name === 'address' && sectionName === '住まい'}
											<!-- 住所フィールドとGoogle Mapsを表示 -->
											<Input
												{field}
												disabled={!canEdit}
												value={employeeFormValues[field.name] ?? getEmployeeValue(field.name)}
												error={fieldErrors[field.name]}
												validationState={getFieldValidationState(field.name)}
												displayMessage={getFieldDisplayMessage(field.name)}
												options={getOptionsForField(field.name)}
												oninput={(e) => {
													const target = e.target as HTMLInputElement | HTMLSelectElement;
													updateEmployeeValue(field.name, target.value);
												}}
											/>
											<!-- Google Mapsで住所を表示 -->
											{#if currentAddress()}
												<div style:grid-area="map" class="google-map-wrapper">
													<GoogleMap address={currentAddress()} apiKey={env.PUBLIC_GOOGLE_MAPS_API_KEY} />
												</div>
											{/if}
										{:else}
											<Input
												{field}
												disabled={!canEdit}
												value={employeeFormValues[field.name] ?? getEmployeeValue(field.name)}
												error={fieldErrors[field.name]}
												validationState={getFieldValidationState(field.name)}
												displayMessage={getFieldDisplayMessage(field.name)}
												options={getOptionsForField(field.name)}
												oninput={(e) => {
													const target = e.target as HTMLInputElement | HTMLSelectElement;
													updateEmployeeValue(field.name, target.value);
												}}
											/>
										{/if}
											{/if}
										{/each}
									</div>
								</fieldset>
							{/if}
						{/each}
					{:else}
						<div class={['content-area', activeDetail.className]}>
							{#if activeDetail.className === 'employee-info'}
								<Image
									bind:employeeImageSrc
									disabled={!canEdit}
									bind:imageAt={imageAtValue}
									onImageAtChange={(value) => {
										imageAtValue = value;
										updateEmployeeValue('image_at', value);
									}}
								/>
							{/if}
							{#each activeDetail.fields as field}
								{#if shouldShowField(field) && field.name !== 'image_at'}
									{#if field.name === 'email'}
										<label class={field.className} style:grid-area={field.areaName}>
											<span>{field.label}: </span>
											<input
												type={field.type}
												name={field.name}
												placeholder={field.placeholder}
												value={emailValue || (employeeFormValues[field.name] ?? getEmployeeValue(field.name))}
												required={field.required}
												disabled={!canEdit}
												oninput={(e) => {
													const target = e.target as HTMLInputElement;
													emailValue = target.value;
													updateEmployeeValue(field.name, target.value);
												}}
											/>
										</label>
									{:else if field.name === 'email_confirm'}
										<label
											class={field.className}
											style:grid-area={field.areaName}
											class:has-error={emailMismatch}
										>
											<span
												data-errMsg={emailMismatch ? 'メールアドレスが一致しません' : undefined}
											>
												{field.label}:
											</span>
											<input
												type={field.type}
												name={field.name}
												placeholder={field.placeholder}
												value={emailConfirmValue}
												required={field.required}
												disabled={!canEdit}
												class:error={emailMismatch}
												oninput={(e) => {
													const target = e.target as HTMLInputElement;
													emailConfirmValue = target.value;
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
											options={getOptionsForField(field.name)}
											oninput={(e) => {
												const target = e.target as HTMLInputElement | HTMLSelectElement;
												updateEmployeeValue(field.name, target.value);
											}}
										/>
									{/if}
								{/if}
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
