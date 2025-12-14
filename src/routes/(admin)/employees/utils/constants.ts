/**
 * 従業員関連の定数定義
 */

/**
 * 必須フィールドの定義
 */
export const REQUIRED_FIELDS: Record<string, string> = {
	employee_id: '従業員ID',
	first_name: '名',
	last_name: '姓',
	date_of_birth: '生年月日'
} as const;

/**
 * フィールド名から従業員データへのマッピング
 */
export const FIELD_TO_EMPLOYEE_MAP: Record<string, string> = {
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
} as const;

/**
 * 銀行口座の所有者タイプ（従業員）
 */
export const BANK_ACCOUNT_OWNER_TYPE_EMPLOYEE = 3;

/**
 * デフォルトの従業員ステータス
 */
export const DEFAULT_EMPLOYEE_STATUS = {
	isActive: true
} as const;
