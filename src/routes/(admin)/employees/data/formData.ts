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
	options?: { value: string; label: string; selected?: boolean }[];
};
// 従業員情報
export const employeeInfoData: FieldConfig[] = [
	{
		formType: 'input',
		className: 'employee_code',
		areaName: 'code',
		label: '従業員ID',
		type: 'text',
		name: 'employee_id',
		placeholder: '従業員ID',
	},
	{
		formType: 'select',
		className: 'nationality',
		areaName: 'nationality',
		label: '国籍',
		type: 'select',
		name: 'nationality_id',
		options: [
			{ value: '1', label: '日本', selected: true },
			{ value: '2', label: 'ブラジル' },
			{ value: '3', label: 'ペルー' }
		]
	},
	{
		formType: 'select',
		className: 'gender',
		areaName: 'gender',
		label: '性別',
		type: 'select',
		name: 'gender_id',
		options: [
			{ value: '1', label: '男性', selected: true },
			{ value: '2', label: '女性' }
		]
	},
	{
		formType: 'select',
		className: 'blood_type',
		areaName: 'blood_type',
		label: '血液型',
		type: 'select',
		name: 'blood_type_id',
		options: [
			{ value: '1', label: 'A', selected: true },
			{ value: '2', label: 'B' },
			{ value: '3', label: 'O' },
			{ value: '4', label: 'AB' }
		]
	},
	{
		formType: 'input',
		className: 'date_of_birth',
		areaName: 'date_of_birth',
		label: '生年月日',
		type: 'date',
		name: 'date_of_birth',
		placeholder: '生年月日'
	},
	{
		formType: 'input',
		className: 'first_name',
		areaName: 'f_name',
		label: '名',
		type: 'text',
		name: 'first_name',
		placeholder: '名'
	},
	{
		formType: 'input',
		className: 'middle_name',
		areaName: 'm_name',
		label: 'ミドルネーム',
		type: 'text',
		name: 'middle_name',
		placeholder: 'ミドルネーム'
	},
	{
		formType: 'input',
		className: 'last_name',
		areaName: 'l_name',
		label: '姓',
		type: 'text',
		name: 'last_name',
		placeholder: '姓'
	},
	{
		formType: 'input',
		className: 'first_name_kana',
		areaName: 'fk_name',
		label: '名(カナ)',
		type: 'text',
		name: 'first_name_kana',
		placeholder: '名(カナ)'
	},
	{
		formType: 'input',
		className: 'middle_name_kana',
		areaName: 'mk_name',
		label: 'ミドルネーム(カナ)',
		type: 'text',
		name: 'middle_name_kana',
		placeholder: 'ミドルネーム(カナ)'
	},
	{
		formType: 'input',
		className: 'last_name_kana',
		areaName: 'lk_name',
		label: '姓(カナ)',
		type: 'text',
		name: 'last_name_kana',
		placeholder: '姓(カナ)'
	},
	{
		formType: 'input',
		className: 'phone',
		areaName: 'phone',
		label: '電話番号',
		type: 'text',
		name: 'phone',
		placeholder: '電話番号'
	},
	{
		formType: 'input',
		className: 'email',
		areaName: 'email',
		label: 'メールアドレス',
		type: 'email',
		name: 'email',
		placeholder: 'メールアドレス'
	},
	{
		formType: 'input',
		className: 'postal_code',
		areaName: 'p_code',
		label: '郵便番号',
		type: 'text',
		name: 'postal_code',
		placeholder: '郵便番号'
	},
	{
		formType: 'input',
		className: 'address',
		areaName: 'address',
		label: '住所',
		type: 'text',
		name: 'address',
		placeholder: '住所'
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
		name: 'relationship_contact',
		options: [
			{ value: '1', label: '父', selected: true },
			{ value: '2', label: '母' },
			{ value: '3', label: '兄弟' },
			{ value: '4', label: '友人' },
			{ value: '5', label: 'その他' }
		]
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
	{
		formType: 'select',
		className: 'employment_type',
		areaName: 'type',
		label: '雇用形態',
		type: 'select',
		name: 'employment_type_id',
		options: [
			{ value: '1', label: '正社員', selected: true },
			{ value: '2', label: '非正社員' },
			{ value: '3', label: '契約社員' },
			{ value: '4', label: 'その他' }
		]
	},
	{
		formType: 'select',
		className: 'department',
		areaName: 'department',
		label: '部署',
		type: 'select',
		name: 'department_id',
		options: [
			{ value: '1', label: '総務部', selected: true },
			{ value: '2', label: '人事部' },
			{ value: '3', label: '経理部' },
			{ value: '4', label: 'その他' }
		]
	},
	{
		formType: 'select',
		className: 'position',
		areaName: 'position',
		label: '役職',
		type: 'select',
		name: 'position_id',
		options: [
			{ value: '1', label: '社長', selected: true },
			{ value: '2', label: '部長' },
			{ value: '3', label: '課長' },
			{ value: '4', label: 'その他' }
		]
	},
	{
		formType: 'input',
		className: 'hire_date',
		areaName: 'hire_date',
		label: '入社日',
		type: 'date',
		name: 'hire_date',
		placeholder: '入社日'
	},
	{
		formType: 'input',
		className: 'leave_date',
		areaName: 'leave_date',
		label: '退職日',
		type: 'date',
		name: 'leave_date',
		placeholder: '退職日'
	}
];
// 免許証情報
export const licenseInfoData: FieldConfig[] = [
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
		name: 'qualification_certificate_type_id',
		options: [{ value: '1', label: 'フォークリフト', selected: true }, { value: '2', label: '玉掛け' }, { value: '3', label: '5トン未満クレーン' }]
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
		name: 'insurance_type_id',
		options: [{ value: '1', label: '健康保険', selected: true }, { value: '2', label: '厚生年金' }, { value: '3', label: '雇用保険' }, { value: '4', label: 'その他' }]
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
		name: 'education_type_id',
		options: [{ value: '1', label: '中学校', selected: true }, { value: '2', label: '高校' }, { value: '3', label: '大学' }, { value: '4', label: '専門学校' }, { value: '5', label: 'その他' }]
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