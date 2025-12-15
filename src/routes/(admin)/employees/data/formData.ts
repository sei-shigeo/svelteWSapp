export type FieldConfig = {
	formType: string;
	className: string;
	areaName: string;
	label: string;
	type: string;
	name: string;
	placeholder?: string;
	value?: string;
	required?: boolean;
	section?: string; // サブセクション名（雇用情報などで使用）
};
// 従業員情報
export const employeeInfoData: FieldConfig[] = [
	// 基本情報セクション
	{
		formType: 'input',
		className: 'employee_code',
		areaName: 'code',
		label: '従業員ID',
		type: 'text',
		name: 'employee_id',
		section: '基本情報',
		placeholder: '従業員ID'
	},
	{
		formType: 'select',
		className: 'nationality',
		areaName: 'nationality',
		label: '国籍',
		type: 'select',
		name: 'nationality_id',
		section: '基本情報'
	},
	{
		formType: 'select',
		className: 'gender',
		areaName: 'gender',
		label: '性別',
		type: 'select',
		name: 'gender_id',
		section: '基本情報'
	},
	{
		formType: 'select',
		className: 'blood_type',
		areaName: 'blood_type',
		label: '血液型',
		type: 'select',
		name: 'blood_type_id',
		section: '基本情報'
	},
	{
		formType: 'input',
		className: 'date_of_birth',
		areaName: 'date_of_birth',
		label: '生年月日',
		type: 'date',
		name: 'date_of_birth',
		section: '基本情報',
		placeholder: '生年月日'
	},
	{
		formType: 'input',
		className: 'image_at',
		areaName: 'image_at',
		label: '撮影日',
		type: 'date',
		name: 'image_at',
		section: '基本情報',
		placeholder: '撮影日'
	},
	// 名前セクション
	{
		formType: 'input',
		className: 'last_name',
		areaName: 'l_name',
		label: '姓',
		type: 'text',
		name: 'last_name',
		section: '名前',
		placeholder: '姓'
	},
	{
		formType: 'input',
		className: 'first_name',
		areaName: 'f_name',
		label: '名',
		type: 'text',
		name: 'first_name',
		section: '名前',
		placeholder: '名'
	},
	{
		formType: 'input',
		className: 'middle_name',
		areaName: 'm_name',
		label: 'ミドルネーム',
		type: 'text',
		name: 'middle_name',
		section: '名前',
		placeholder: 'ミドルネーム'
	},
	{
		formType: 'input',
		className: 'last_name_kana',
		areaName: 'lk_name',
		label: '姓(カナ)',
		type: 'text',
		name: 'last_name_kana',
		section: '名前',
		placeholder: '姓(カナ)'
	},
	{
		formType: 'input',
		className: 'first_name_kana',
		areaName: 'fk_name',
		label: '名(カナ)',
		type: 'text',
		name: 'first_name_kana',
		section: '名前',
		placeholder: '名(カナ)'
	},
	{
		formType: 'input',
		className: 'middle_name_kana',
		areaName: 'mk_name',
		label: 'ミドルネーム(カナ)',
		type: 'text',
		name: 'middle_name_kana',
		section: '名前',
		placeholder: 'ミドルネーム(カナ)'
	},
	// 連絡先セクション
	{
		formType: 'input',
		className: 'phone_mobile',
		areaName: 'phone_mobile',
		label: '携帯電話',
		type: 'text',
		name: 'phone_mobile',
		section: '連絡先',
		placeholder: '携帯電話'
	},
	{
		formType: 'input',
		className: 'phone_tel',
		areaName: 'phone_tel',
		label: '固定電話',
		type: 'text',
		name: 'phone_tel',
		section: '連絡先',
		placeholder: '固定電話'
	},
	{
		formType: 'input',
		className: 'email',
		areaName: 'email',
		label: 'メールアドレス',
		type: 'email',
		name: 'email',
		section: '連絡先',
		placeholder: 'メールアドレス'
	},
	{
		formType: 'input',
		className: 'email_confirm',
		areaName: 'email_confirm',
		label: '確認用メールアドレス',
		type: 'email',
		name: 'email_confirm',
		section: '連絡先',
		placeholder: '確認用メールアドレス'
	},
	// 住まいセクション
	{
		formType: 'input',
		className: 'postal_code',
		areaName: 'p_code',
		label: '郵便番号',
		type: 'text',
		name: 'postal_code',
		section: '住まい',
		placeholder: '郵便番号'
	},
	{
		formType: 'input',
		className: 'address',
		areaName: 'address',
		label: '住所',
		type: 'text',
		name: 'address',
		section: '住まい',
		placeholder: '住所'
	},
	// セキュリティセクション
	{
		formType: 'select',
		className: 'role',
		areaName: 'role',
		label: 'ロール',
		type: 'select',
		name: 'role_id',
		section: 'セキュリティ'
	},
	{
		formType: 'input',
		className: 'password',
		areaName: 'password',
		label: 'パスワード',
		type: 'password',
		name: 'password',
		section: 'セキュリティ',
		placeholder: 'パスワード'
	},
	{
		formType: 'input',
		className: 'password_confirm',
		areaName: 'password_confirm',
		label: '確認用パスワード',
		type: 'password',
		name: 'password_confirm',
		section: 'セキュリティ',
		placeholder: '確認用パスワード'
	}
];
// 緊急連絡先
export const emergencyContactData: FieldConfig[] = [
	{
		formType: 'input',
		className: 'name',
		areaName: 'name',
		label: '緊急連絡先名',
		type: 'text',
		name: 'name_contact',
		placeholder: '緊急連絡先名'
	},
	{
		formType: 'input',
		className: 'phone',
		areaName: 'phone',
		label: '緊急連絡先電話番号',
		type: 'text',
		name: 'phone_contact',
		placeholder: '緊急連絡先電話番号'
	},
	{
		formType: 'select',
		className: 'relationship',
		areaName: 'relationship',
		label: '緊急連絡先関係',
		type: 'select',
		name: 'relationship_contact'
	},
	{
		formType: 'input',
		className: 'address',
		areaName: 'address',
		label: '緊急連絡先住所',
		type: 'text',
		name: 'address_contact',
		placeholder: '緊急連絡先住所'
	},
	{
		formType: 'input',
		className: 'email',
		areaName: 'email',
		label: '緊急連絡先メールアドレス',
		type: 'email',
		name: 'email_contact',
		placeholder: '緊急連絡先メールアドレス'
	}
];
// 雇用情報
export const employmentInfoData: FieldConfig[] = [
	// 雇用情報セクション
	{
		formType: 'select',
		className: 'employment_type',
		areaName: 'type',
		label: '雇用形態',
		type: 'select',
		name: 'employment_type_id',
		section: '雇用情報'
	},
	{
		formType: 'select',
		className: 'department',
		areaName: 'department',
		label: '部署',
		type: 'select',
		name: 'department_id',
		section: '雇用情報'
	},
	{
		formType: 'select',
		className: 'position',
		areaName: 'position',
		label: '役職',
		type: 'select',
		name: 'position_id',
		section: '雇用情報'
	},
	{
		formType: 'input',
		className: 'hire_date',
		areaName: 'hire_date',
		label: '雇用年月日',
		type: 'date',
		name: 'hire_date',
		section: '雇用情報',
		placeholder: '雇用年月日'
	},
	{
		formType: 'input',
		className: 'appointment_at',
		areaName: 'appointment_at',
		label: '選任日',
		type: 'date',
		name: 'appointment_at',
		section: '雇用情報',
		placeholder: '選任日'
	},
	// 解任情報セクション
	{
		formType: 'input',
		className: 'appointment_at',
		areaName: 'appointment_at',
		label: '選任日（ドライバー）',
		type: 'date',
		name: 'appointment_at',
		section: '解任情報',
		placeholder: '選任日'
	},
	{
		formType: 'input',
		className: 'discharge_at',
		areaName: 'discharge_at',
		label: '解任日（ドライバー）',
		type: 'date',
		name: 'discharge_at',
		section: '解任情報',
		placeholder: '解任日'
	},
	{
		formType: 'input',
		className: 'discharge_reason',
		areaName: 'discharge_reason',
		label: '解任理由（ドライバー）',
		type: 'text',
		name: 'discharge_reason',
		section: '解任情報',
		placeholder: '解任理由'
	},
	// 退職情報セクション
	{
		formType: 'input',
		className: 'leave_date',
		areaName: 'leave_date',
		label: '退職日',
		type: 'date',
		name: 'leave_date',
		section: '退職情報',
		placeholder: '退職日'
	},
	{
		formType: 'input',
		className: 'leave_reason',
		areaName: 'leave_reason',
		label: '退職理由',
		type: 'text',
		name: 'leave_reason',
		section: '退職情報',
		placeholder: '退職理由'
	},
	// 死亡情報セクション
	{
		formType: 'input',
		className: 'death_at',
		areaName: 'death_at',
		label: '死亡年月日',
		type: 'date',
		name: 'death_at',
		section: '死亡情報',
		placeholder: '死亡年月日'
	},
	{
		formType: 'input',
		className: 'death_reason',
		areaName: 'death_reason',
		label: '死亡理由',
		type: 'text',
		name: 'death_reason',
		section: '死亡情報',
		placeholder: '死亡理由'
	}
];
// 免許証情報
export const licenseInfoData: FieldConfig[] = [
	{
		formType: 'select',
		className: 'license_type',
		areaName: 'type',
		label: '免許証タイプ',
		type: 'select',
		name: 'license_type_id'
	},
	{
		formType: 'input',
		className: 'license_number',
		areaName: 'number',
		label: '免許証番号',
		type: 'text',
		name: 'license_number',
		placeholder: '免許証番号'
	},
	{
		formType: 'input',
		className: 'license_expiration_date',
		areaName: 'exp_date',
		label: '免許証有効期限',
		type: 'date',
		name: 'license_expiration_date',
		placeholder: '免許証有効期限'
	},
	{
		formType: 'input',
		className: 'license_image_front',
		areaName: 'f_img',
		label: '免許証画像（表面）',
		type: 'file',
		name: 'license_image_front',
		placeholder: '免許証画像（表面）'
	},
	{
		formType: 'input',
		className: 'license_image_back',
		areaName: 'b_img',
		label: '免許証画像（裏面）',
		type: 'file',
		name: 'license_image_back',
		placeholder: '免許証画像（裏面）'
	}
];
// 資格証書情報
export const qualificationInfoData: FieldConfig[] = [
	{
		formType: 'select',
		className: 'qualification_certificate_type',
		areaName: 'type',
		label: '資格証書タイプ',
		type: 'select',
		name: 'qualification_certificate_type_id'
	},
	{
		formType: 'input',
		className: 'qualification_certificate_number',
		areaName: 'number',
		label: '資格証書番号',
		type: 'text',
		name: 'qualification_certificate_number',
		placeholder: '資格証書番号'
	},
	{
		formType: 'input',
		className: 'qualification_certificate_expiration_date',
		areaName: 'exp_date',
		label: '資格証書有効期限',
		type: 'date',
		name: 'qualification_certificate_expiration_date',
		placeholder: '資格証書有効期限'
	},
	{
		formType: 'input',
		className: 'qualification_certificate_image_front',
		areaName: 'f_img',
		label: '資格証書画像（表面）',
		type: 'file',
		name: 'qualification_certificate_image_front',
		placeholder: '資格証書画像（表面）'
	},
	{
		formType: 'input',
		className: 'qualification_certificate_image_back',
		areaName: 'b_img',
		label: '資格証書画像（裏面）',
		type: 'file',
		name: 'qualification_certificate_image_back',
		placeholder: '資格証書画像（裏面）'
	}
];
// 保険情報
export const insuranceInfoData: FieldConfig[] = [
	{
		formType: 'select',
		className: 'insurance_type',
		areaName: 'type',
		label: '保険タイプ',
		type: 'select',
		name: 'insurance_type_id'
	},
	{
		formType: 'input',
		className: 'insurance_number',
		areaName: 'number',
		label: '保険番号',
		type: 'text',
		name: 'insurance_number',
		placeholder: '保険番号'
	},
	{
		formType: 'input',
		className: 'insurance_expiration_date',
		areaName: 'exp_date',
		label: '保険有効期限',
		type: 'date',
		name: 'insurance_expiration_date',
		placeholder: '保険有効期限'
	},
	{
		formType: 'input',
		className: 'insurance_image_front',
		areaName: 'f_img',
		label: '保険画像（表面）',
		type: 'file',
		name: 'insurance_image_front',
		placeholder: '保険画像（表面）'
	},
	{
		formType: 'input',
		className: 'insurance_image_back',
		areaName: 'b_img',
		label: '保険画像（裏面）',
		type: 'file',
		name: 'insurance_image_back',
		placeholder: '保険画像（裏面）'
	}
];
// 職歴情報
export const jobHistoryInfoData: FieldConfig[] = [
	{
		formType: 'input',
		className: 'job_history_company_name',
		areaName: 'name',
		label: '職歴会社名',
		type: 'text',
		name: 'job_history_company_name',
		placeholder: '職歴会社名'
	},
	{
		formType: 'input',
		className: 'job_history_content',
		areaName: 'content',
		label: '職歴内容',
		type: 'text',
		name: 'job_history_content',
		placeholder: '職歴内容'
	},
	{
		formType: 'input',
		className: 'job_history_start_date',
		areaName: 'sAt',
		label: '職歴開始日',
		type: 'date',
		name: 'job_history_start_date',
		placeholder: '職歴開始日'
	},
	{
		formType: 'input',
		className: 'job_history_end_date',
		areaName: 'eAt',
		label: '職歴終了日',
		type: 'date',
		name: 'job_history_end_date',
		placeholder: '職歴終了日'
	}
];
// 学歴情報
export const educationInfoData: FieldConfig[] = [
	{
		formType: 'select',
		className: 'education_type',
		areaName: 'type',
		label: '学歴タイプ',
		type: 'select',
		name: 'education_type_id'
	},
	{
		formType: 'input',
		className: 'education_school_name',
		areaName: 'name',
		label: '学校名',
		type: 'text',
		name: 'education_school_name',
		placeholder: '学校名'
	},
	{
		formType: 'input',
		className: 'education_start_date',
		areaName: 'sAt',
		label: '入学日',
		type: 'date',
		name: 'education_start_date',
		placeholder: '入学日'
	},
	{
		formType: 'input',
		className: 'education_end_date',
		areaName: 'eAt',
		label: '卒業日',
		type: 'date',
		name: 'education_end_date',
		placeholder: '卒業日'
	}
];
// 銀行情報
export const bankAccountInfoData: FieldConfig[] = [
	{
		formType: 'select',
		className: 'bank_account_owner_type',
		areaName: 'owner_type',
		label: '所有者タイプ',
		type: 'select',
		name: 'owner_type_id'
	},
	{
		formType: 'input',
		className: 'bank_code',
		areaName: 'bank_code',
		label: '銀行コード',
		type: 'text',
		name: 'bank_code',
		placeholder: '銀行コード（3桁）'
	},
	{
		formType: 'input',
		className: 'bank_name',
		areaName: 'bank_name',
		label: '銀行名',
		type: 'text',
		name: 'bank_name',
		placeholder: '銀行名'
	},
	{
		formType: 'input',
		className: 'branch_code',
		areaName: 'branch_code',
		label: '支店コード',
		type: 'text',
		name: 'branch_code',
		placeholder: '支店コード（3桁）'
	},
	{
		formType: 'input',
		className: 'branch_name',
		areaName: 'branch_name',
		label: '支店名',
		type: 'text',
		name: 'branch_name',
		placeholder: '支店名'
	},
	{
		formType: 'select',
		className: 'account_type',
		areaName: 'account_type',
		label: '口座種別',
		type: 'select',
		name: 'account_type'
	},
	{
		formType: 'input',
		className: 'account_number',
		areaName: 'account_number',
		label: '口座番号',
		type: 'text',
		name: 'account_number',
		placeholder: '口座番号'
	},
	{
		formType: 'input',
		className: 'account_holder',
		areaName: 'account_holder',
		label: '口座名義',
		type: 'text',
		name: 'account_holder',
		placeholder: '口座名義'
	},
	{
		formType: 'select',
		className: 'default_account',
		areaName: 'default_account',
		label: 'デフォルト口座',
		type: 'select',
		name: 'default_account'
	}
];
// 健康診断情報
export const healthCheckupInfoData: FieldConfig[] = [
	{
		formType: 'select',
		className: 'health_checkup_type',
		areaName: 'type',
		label: '健康診断タイプ',
		type: 'select',
		name: 'health_checkup_type_id'
	},
	{
		formType: 'input',
		className: 'health_checkup_result',
		areaName: 'result',
		label: '結果',
		type: 'text',
		name: 'health_checkup_result',
		placeholder: '結果'
	},
	{
		formType: 'input',
		className: 'health_checkup_content',
		areaName: 'content',
		label: '内容',
		type: 'text',
		name: 'health_checkup_content',
		placeholder: '内容'
	},
	{
		formType: 'input',
		className: 'health_checkup_date',
		areaName: 'date_at',
		label: '診断日',
		type: 'date',
		name: 'health_checkup_date_at',
		placeholder: '診断日'
	},
	{
		formType: 'input',
		className: 'health_checkup_pdf',
		areaName: 'pdf_url',
		label: 'PDF',
		type: 'file',
		name: 'health_checkup_pdf_url',
		placeholder: 'PDF'
	}
];
// 適性診断情報
export const suitabilityAssessmentInfoData: FieldConfig[] = [
	{
		formType: 'select',
		className: 'suitability_assessment_type',
		areaName: 'type',
		label: '適性診断タイプ',
		type: 'select',
		name: 'suitability_assessment_type_id'
	},
	{
		formType: 'input',
		className: 'suitability_assessment_score',
		areaName: 'score',
		label: 'スコア',
		type: 'number',
		name: 'suitability_assessment_score',
		placeholder: 'スコア'
	},
	{
		formType: 'input',
		className: 'suitability_assessment_result',
		areaName: 'result',
		label: '結果',
		type: 'text',
		name: 'suitability_assessment_result',
		placeholder: '結果'
	},
	{
		formType: 'input',
		className: 'suitability_assessment_pdf',
		areaName: 'pdf_url',
		label: 'PDF',
		type: 'file',
		name: 'suitability_assessment_pdf_url',
		placeholder: 'PDF'
	}
];
// 特別教育情報
export const specialEducationInfoData: FieldConfig[] = [
	{
		formType: 'select',
		className: 'special_education_type',
		areaName: 'type',
		label: '特別教育タイプ',
		type: 'select',
		name: 'special_education_type_id'
	},
	{
		formType: 'input',
		className: 'special_education_trainer',
		areaName: 'trainer',
		label: '講師',
		type: 'text',
		name: 'special_education_trainer',
		placeholder: '講師'
	},
	{
		formType: 'input',
		className: 'special_education_content',
		areaName: 'content',
		label: '内容',
		type: 'text',
		name: 'special_education_content',
		placeholder: '内容'
	},
	{
		formType: 'input',
		className: 'special_education_start_date',
		areaName: 'start_at',
		label: '開始日',
		type: 'date',
		name: 'special_education_start_at',
		placeholder: '開始日'
	},
	{
		formType: 'input',
		className: 'special_education_end_date',
		areaName: 'end_at',
		label: '終了日',
		type: 'date',
		name: 'special_education_end_at',
		placeholder: '終了日'
	}
];
