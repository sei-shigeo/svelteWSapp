import {
	pgTable,
	serial,
	integer,
	text,
	varchar,
	boolean,
	date,
	timestamp
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: serial('id').primaryKey(),
	age: integer('age')
});

// ============================================
// マスタテーブル
// ============================================

/**
 * 国籍マスタテーブル
 * 従業員の国籍情報を管理
 */
export const nationality = pgTable('nationality', {
	id: serial('id').primaryKey(), // 主キー
	label: varchar('label', { length: 100 }).notNull() // 国籍名（例: 日本、ブラジル、ペルー）
});

/**
 * 社員区分マスタテーブル
 * 雇用形態を管理
 */
export const employeeClassification = pgTable('employee_classification', {
	id: serial('id').primaryKey(), // 主キー
	label: varchar('label', { length: 100 }).notNull() // 社員区分名（例: 正社員、非正社員、契約社員、その他）
});

/**
 * 部門マスタテーブル
 * 組織の部門情報を管理
 */
export const department = pgTable('department', {
	id: serial('id').primaryKey(), // 主キー
	label: varchar('label', { length: 100 }).notNull() // 部門名（例: 総務部、人事部、経理部、その他）
});

/**
 * 役職マスタテーブル
 * 従業員の役職情報を管理
 */
export const position = pgTable('position', {
	id: serial('id').primaryKey(), // 主キー
	label: varchar('label', { length: 100 }).notNull() // 役職名（例: 社長、部長、課長、その他）
});

/**
 * 学歴タイプマスタテーブル
 * 学歴の種類を管理
 */
export const educationType = pgTable('education_type', {
	id: serial('id').primaryKey(), // 主キー
	type: varchar('type', { length: 100 }).notNull() // 学歴タイプ（例: 中学校、高校、大学、専門学校、その他）
});

/**
 * 適性診断タイプマスタテーブル
 * 適性診断の種類を管理
 */
export const suitabilityAssessmentType = pgTable('suitability_assessment_type', {
	id: serial('id').primaryKey(), // 主キー
	type: varchar('type', { length: 100 }).notNull() // 適性診断タイプ（例: 初任診断、一般診断、適齢診断、特別診断、特定診断）
});

/**
 * 特別教育タイプマスタテーブル
 * 特別教育の種類を管理
 */
export const specialEducationType = pgTable('special_education_type', {
	id: serial('id').primaryKey(), // 主キー
	type: varchar('type', { length: 100 }).notNull() // 特別教育タイプ
});

/**
 * 健康診断タイプマスタテーブル
 * 健康診断の種類を管理
 */
export const healthCheckupType = pgTable('health_checkup_type', {
	id: serial('id').primaryKey(), // 主キー
	type: varchar('type', { length: 100 }).notNull() // 健康診断タイプ（例: 定期健康診断、特定健康診断、その他）
});

/**
 * 所有者タイプマスタテーブル
 * 銀行口座の所有者タイプを管理
 */
export const ownerType = pgTable('owner_type', {
	id: serial('id').primaryKey(), // 主キー
	label: varchar('label', { length: 100 }).notNull() // 所有者タイプ（例: 自社、取引先、従業員）
});

/**
 * 口座種別マスタテーブル
 * 銀行口座の種別を管理
 */
export const bankAccountType = pgTable('bank_account_type', {
	id: serial('id').primaryKey(), // 主キー
	label: varchar('label', { length: 100 }).notNull() // 口座種別（例: 普通、当座、貯金、その他）
});

/**
 * 運転免許証タイプマスタテーブル
 * 運転免許証の種類を管理
 */
export const licenseType = pgTable('license_type', {
	id: serial('id').primaryKey(), // 主キー
	type: varchar('type', { length: 100 }).notNull() // 免許証タイプ（例: 中型、大型、牽引）
});

/**
 * ロールマスタテーブル
 * ユーザーの権限ロールを管理
 */
export const role = pgTable('role', {
	id: serial('id').primaryKey(), // 主キー
	type: varchar('type', { length: 100 }).notNull() // ロールタイプ（例: 管理者、一般）
});

// ============================================
// メインテーブル
// ============================================

/**
 * 従業員テーブル
 * 従業員の基本情報と詳細情報を管理するメインテーブル
 */
export const employee = pgTable('employee', {
	id: serial('id').primaryKey(), // 主キー
	code: varchar('code', { length: 50 }).notNull().unique(), // 従業員コード（一意）
	image: text('image'), // プロフィール画像URL
	image_at: date('image_at'), // 画像登録日
	nationality_id: integer('nationality_id').references(() => nationality.id), // 国籍ID（外部キー）
	gender: integer('gender'), // 性別（1: 男性, 2: 女性）
	blood_type: integer('blood_type'), // 血液型（1-4）
	date_of_birth: date('date_of_birth').notNull(), // 生年月日
	first_name: varchar('first_name', { length: 100 }).notNull(), // 名
	middle_name: varchar('middle_name', { length: 100 }), // ミドルネーム（外国人の場合）
	last_name: varchar('last_name', { length: 100 }).notNull(), // 姓
	first_name_kana: varchar('first_name_kana', { length: 100 }), // 名（カナ）
	middle_name_kana: varchar('middle_name_kana', { length: 100 }), // ミドルネーム（カナ）
	last_name_kana: varchar('last_name_kana', { length: 100 }), // 姓（カナ）
	phone_mobile: varchar('phone_mobile', { length: 20 }), // 携帯電話番号
	phone_tel: varchar('phone_tel', { length: 20 }), // 固定電話番号
	email: varchar('email', { length: 255 }), // メールアドレス
	postal_code: varchar('postal_code', { length: 10 }), // 郵便番号
	address: text('address'), // 住所
	password: text('password'), // パスワード（ハッシュ化）
	role_id: integer('role_id').references(() => role.id), // ロールID（外部キー）
	// 運転免許証関連
	license_type_id: integer('license_type_id').references(() => licenseType.id), // 免許証タイプID（外部キー）
	license_number: varchar('license_number', { length: 50 }), // 免許証番号
	license_exp_at: date('license_exp_at'), // 免許証有効期限
	license_f_img: text('license_f_img'), // 免許証表面画像URL
	license_b_img: text('license_b_img'), // 免許証裏面画像URL
	pdf_url_driver: text('pdf_url_driver'), // 運転手台帳用PDF URL
	// 雇用関連
	employment_type_id: integer('employment_type_id').references(() => employeeClassification.id), // 雇用形態ID（外部キー）
	department_id: integer('department_id').references(() => department.id), // 部門ID（外部キー）
	position_id: integer('position_id').references(() => position.id), // 役職ID（外部キー）
	hire_at: date('hire_at'), // 雇用日
	// ドライバー関連
	appointment_at: date('appointment_at'), // 選任日（ドライバー）
	discharge_at: date('discharge_at'), // 解任日（ドライバー）
	discharge_reason: text('discharge_reason'), // 解任理由（ドライバー）
	// 退職・死亡関連
	leave_at: date('leave_at'), // 退職日
	leave_reason: text('leave_reason'), // 退職理由
	death_at: date('death_at'), // 死亡年月日
	death_reason: text('death_reason'), // 死亡理由
	// その他
	note: text('note'), // 備考欄
	is_active: boolean('is_active').notNull().default(true), // アクティブフラグ
	created_at: timestamp('created_at').defaultNow().notNull(), // 作成日時
	updated_at: timestamp('updated_at').defaultNow().notNull() // 更新日時
});

// ============================================
// リレーションテーブル（1対多）
// ============================================

/**
 * 資格証明テーブル
 * 従業員の資格証明情報を管理（複数登録可能）
 * 例: フォークリフト、玉掛け、クレーンなど
 */
export const qualification = pgTable('qualification', {
	id: serial('id').primaryKey(), // 主キー
	type: varchar('type', { length: 100 }).notNull(), // 資格タイプ（例: フォークリフト、玉掛け、5トン未満クレーン）
	number: varchar('number', { length: 100 }), // 資格番号
	acq_at: date('acq_at'), // 取得日
	exp_at: date('exp_at'), // 有効期限
	img: text('img'), // 資格証明書画像URL
	employee_id: integer('employee_id')
		.notNull()
		.references(() => employee.id, { onDelete: 'cascade' }), // 従業員ID（外部キー、カスケード削除）
	created_at: timestamp('created_at').defaultNow().notNull(), // 作成日時
	updated_at: timestamp('updated_at').defaultNow().notNull() // 更新日時
});

/**
 * 保険テーブル
 * 従業員の保険情報を管理（複数登録可能）
 * 例: 健康保険、厚生年金、雇用保険、マイナンバーなど
 */
export const insurance = pgTable('insurance', {
	id: serial('id').primaryKey(), // 主キー
	type: varchar('type', { length: 100 }).notNull(), // 保険タイプ（例: 健康保険、厚生年金、雇用保険、マイナンバー）
	number: varchar('number', { length: 100 }), // 保険番号
	acq_at: date('acq_at'), // 取得日
	img: text('img'), // 保険証画像URL
	employee_id: integer('employee_id')
		.notNull()
		.references(() => employee.id, { onDelete: 'cascade' }), // 従業員ID（外部キー、カスケード削除）
	created_at: timestamp('created_at').defaultNow().notNull(), // 作成日時
	updated_at: timestamp('updated_at').defaultNow().notNull() // 更新日時
});

/**
 * 学歴テーブル
 * 従業員の学歴情報を管理（複数登録可能）
 */
export const education = pgTable('education', {
	id: serial('id').primaryKey(), // 主キー
	education_type_id: integer('education_type_id').references(() => educationType.id), // 学歴タイプID（外部キー）
	name: varchar('name', { length: 200 }).notNull(), // 学校名
	start_at: date('start_at'), // 入学日
	end_at: date('end_at'), // 卒業日
	employee_id: integer('employee_id')
		.notNull()
		.references(() => employee.id, { onDelete: 'cascade' }), // 従業員ID（外部キー、カスケード削除）
	created_at: timestamp('created_at').defaultNow().notNull(), // 作成日時
	updated_at: timestamp('updated_at').defaultNow().notNull() // 更新日時
});

/**
 * 職歴テーブル
 * 従業員の職歴情報を管理（複数登録可能）
 */
export const jobHistory = pgTable('job_history', {
	id: serial('id').primaryKey(), // 主キー
	name: varchar('name', { length: 200 }).notNull(), // 職歴名
	content: text('content'), // 職歴内容
	start_at: date('start_at'), // 開始日
	end_at: date('end_at'), // 終了日
	employee_id: integer('employee_id')
		.notNull()
		.references(() => employee.id, { onDelete: 'cascade' }), // 従業員ID（外部キー、カスケード削除）
	created_at: timestamp('created_at').defaultNow().notNull(), // 作成日時
	updated_at: timestamp('updated_at').defaultNow().notNull() // 更新日時
});

/**
 * 適性診断テーブル
 * 従業員の適性診断結果を管理（複数登録可能）
 */
export const suitabilityAssessment = pgTable('suitability_assessment', {
	id: serial('id').primaryKey(), // 主キー
	suitability_assessment_type_id: integer('suitability_assessment_type_id').references(
		() => suitabilityAssessmentType.id
	), // 適性診断タイプID（外部キー）
	score: integer('score'), // スコア
	result: text('result'), // 診断結果
	pdf_url: text('pdf_url'), // 診断結果PDF URL
	employee_id: integer('employee_id')
		.notNull()
		.references(() => employee.id, { onDelete: 'cascade' }), // 従業員ID（外部キー、カスケード削除）
	created_at: timestamp('created_at').defaultNow().notNull(), // 作成日時
	updated_at: timestamp('updated_at').defaultNow().notNull() // 更新日時
});

/**
 * 特別教育テーブル
 * 従業員の特別教育履歴を管理（複数登録可能）
 */
export const specialEducation = pgTable('special_education', {
	id: serial('id').primaryKey(), // 主キー
	special_education_type_id: integer('special_education_type_id').references(
		() => specialEducationType.id
	), // 特別教育タイプID（外部キー）
	trainer: varchar('trainer', { length: 200 }), // 講師名
	content: text('content'), // 教育内容
	start_at: date('start_at'), // 開始日
	end_at: date('end_at'), // 終了日
	employee_id: integer('employee_id')
		.notNull()
		.references(() => employee.id, { onDelete: 'cascade' }), // 従業員ID（外部キー、カスケード削除）
	created_at: timestamp('created_at').defaultNow().notNull(), // 作成日時
	updated_at: timestamp('updated_at').defaultNow().notNull() // 更新日時
});

/**
 * 健康診断テーブル
 * 従業員の健康診断結果を管理（複数登録可能）
 */
export const healthCheckup = pgTable('health_checkup', {
	id: serial('id').primaryKey(), // 主キー
	health_checkup_type_id: integer('health_checkup_type_id').references(() => healthCheckupType.id), // 健康診断タイプID（外部キー）
	result: varchar('result', { length: 100 }), // 診断結果（例: 正常、異常、その他）
	content: text('content'), // 診断内容詳細
	date_at: date('date_at'), // 診断日
	pdf_url: text('pdf_url'), // 診断結果PDF URL
	employee_id: integer('employee_id')
		.notNull()
		.references(() => employee.id, { onDelete: 'cascade' }), // 従業員ID（外部キー、カスケード削除）
	created_at: timestamp('created_at').defaultNow().notNull(), // 作成日時
	updated_at: timestamp('updated_at').defaultNow().notNull() // 更新日時
});

/**
 * 違反履歴テーブル
 * 従業員の違反履歴を管理（複数登録可能）
 */
export const violationHistory = pgTable('violation_history', {
	id: serial('id').primaryKey(), // 主キー
	violation_date: date('violation_date'), // 違反日
	violation_location: varchar('violation_location', { length: 200 }), // 違反場所
	violation_content: text('violation_content'), // 違反内容
	employee_id: integer('employee_id')
		.notNull()
		.references(() => employee.id, { onDelete: 'cascade' }), // 従業員ID（外部キー、カスケード削除）
	created_at: timestamp('created_at').defaultNow().notNull(), // 作成日時
	updated_at: timestamp('updated_at').defaultNow().notNull() // 更新日時
});

/**
 * 事故歴テーブル
 * 従業員の事故歴を管理（複数登録可能）
 */
export const accidentHistory = pgTable('accident_history', {
	id: serial('id').primaryKey(), // 主キー
	accident_date: date('accident_date'), // 事故日
	accident_location: varchar('accident_location', { length: 200 }), // 事故場所
	accident_summary: text('accident_summary'), // 事故概要
	employee_id: integer('employee_id')
		.notNull()
		.references(() => employee.id, { onDelete: 'cascade' }), // 従業員ID（外部キー、カスケード削除）
	created_at: timestamp('created_at').defaultNow().notNull(), // 作成日時
	updated_at: timestamp('updated_at').defaultNow().notNull() // 更新日時
});

/**
 * 銀行口座テーブル
 * 従業員の銀行口座情報を管理（複数登録可能）
 */
export const bankAccount = pgTable('bank_account', {
	id: serial('id').primaryKey(), // 主キー
	owner_type_id: integer('owner_type_id').references(() => ownerType.id), // 所有者タイプID（外部キー）
	bank_code: varchar('bank_code', { length: 10 }), // 銀行コード（3桁、API使用予定）
	bank_name: varchar('bank_name', { length: 200 }), // 銀行名
	branch_code: varchar('branch_code', { length: 10 }), // 支店コード（3桁、API使用予定）
	branch_name: varchar('branch_name', { length: 200 }), // 支店名
	account_type: integer('account_type').references(() => bankAccountType.id), // 口座種別ID（外部キー）
	account_number: varchar('account_number', { length: 50 }), // 口座番号
	account_holder: varchar('account_holder', { length: 200 }), // 口座名義人
	default_account: boolean('default_account').default(false), // デフォルト口座フラグ
	employee_id: integer('employee_id').references(() => employee.id, { onDelete: 'cascade' }), // 従業員ID（外部キー、カスケード削除）
	created_at: timestamp('created_at').defaultNow().notNull(), // 作成日時
	updated_at: timestamp('updated_at').defaultNow().notNull() // 更新日時
});

/**
 * 緊急連絡先テーブル
 * 従業員の緊急連絡先情報を管理（複数登録可能）
 */
export const emergencyContact = pgTable('emergency_contact', {
	id: serial('id').primaryKey(), // 主キー
	relationship: varchar('relationship', { length: 50 }), // 続柄（例: 父、母、兄弟）
	name: varchar('name', { length: 200 }).notNull(), // 氏名
	phone: varchar('phone', { length: 20 }), // 電話番号
	address: text('address'), // 住所
	email: varchar('email', { length: 255 }), // メールアドレス
	employee_id: integer('employee_id').references(() => employee.id, { onDelete: 'cascade' }), // 従業員ID（外部キー、カスケード削除）
	created_at: timestamp('created_at').defaultNow().notNull(), // 作成日時
	updated_at: timestamp('updated_at').defaultNow().notNull() // 更新日時
});
