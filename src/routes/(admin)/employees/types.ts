import type { InferSelectModel } from 'drizzle-orm';
import {
	employee,
	nationality,
	employeeClassification,
	department,
	position
} from '$lib/server/db/schema';

/**
 * データベースから取得した従業員データの型（Drizzleから自動推論）
 */
export type EmployeeDb = InferSelectModel<typeof employee>;

/**
 * フロントエンド用の従業員型
 * データベースのスネークケースをキャメルケースに変換
 */
export type Employee = {
	id: EmployeeDb['id'];
	code: EmployeeDb['code'];
	image?: EmployeeDb['image'];
	image_at?: EmployeeDb['image_at'];
	nationality: EmployeeDb['nationality_id']; // nationality_id → nationality
	gender: EmployeeDb['gender'];
	bloodType: EmployeeDb['blood_type']; // blood_type → bloodType
	dateOfBirth: EmployeeDb['date_of_birth']; // date_of_birth → dateOfBirth
	firstName: EmployeeDb['first_name']; // first_name → firstName
	middleName?: EmployeeDb['middle_name']; // middle_name → middleName
	lastName: EmployeeDb['last_name']; // last_name → lastName
	firstNameKana?: EmployeeDb['first_name_kana']; // first_name_kana → firstNameKana
	middleNameKana?: EmployeeDb['middle_name_kana']; // middle_name_kana → middleNameKana
	lastNameKana?: EmployeeDb['last_name_kana']; // last_name_kana → lastNameKana
	phone_mobile?: EmployeeDb['phone_mobile'];
	phone_tel?: EmployeeDb['phone_tel'];
	email?: EmployeeDb['email'];
	postal_code?: EmployeeDb['postal_code'];
	address?: EmployeeDb['address'];
	password?: EmployeeDb['password'];
	role_id?: EmployeeDb['role_id'];
	license_type_id?: EmployeeDb['license_type_id'];
	license_number?: EmployeeDb['license_number'];
	license_exp_at?: EmployeeDb['license_exp_at'];
	license_f_img?: EmployeeDb['license_f_img'];
	license_b_img?: EmployeeDb['license_b_img'];
	pdf_url_driver?: EmployeeDb['pdf_url_driver'];
	employment_type_id?: EmployeeDb['employment_type_id'];
	department_id?: EmployeeDb['department_id'];
	position_id?: EmployeeDb['position_id'];
	hire_at?: EmployeeDb['hire_at'];
	appointment_at?: EmployeeDb['appointment_at'];
	discharge_at?: EmployeeDb['discharge_at'];
	discharge_reason?: EmployeeDb['discharge_reason'];
	leave_at?: EmployeeDb['leave_at'];
	leave_reason?: EmployeeDb['leave_reason'];
	death_at?: EmployeeDb['death_at'];
	death_reason?: EmployeeDb['death_reason'];
	note?: EmployeeDb['note'];
	isActive: EmployeeDb['is_active']; // is_active → isActive
};

/**
 * マスタデータの型定義（Drizzleから自動推論）
 */
export type Nationality = InferSelectModel<typeof nationality>;
export type EmployeeClassification = InferSelectModel<typeof employeeClassification>;
export type Department = InferSelectModel<typeof department>;
export type Position = InferSelectModel<typeof position>;
