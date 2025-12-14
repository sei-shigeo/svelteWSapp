import type { InferSelectModel } from 'drizzle-orm';
import { employee } from '$lib/server/db/schema';
import type { Employee } from '../types';

/**
 * データベース形式の従業員データをフロントエンド形式に変換
 */
export function formatEmployee(emp: InferSelectModel<typeof employee>): Employee {
	return {
		id: emp.id,
		code: emp.code,
		image: emp.image,
		image_at: emp.image_at,
		nationality: emp.nationality_id,
		gender: emp.gender,
		bloodType: emp.blood_type,
		dateOfBirth: emp.date_of_birth,
		firstName: emp.first_name,
		middleName: emp.middle_name,
		lastName: emp.last_name,
		firstNameKana: emp.first_name_kana,
		middleNameKana: emp.middle_name_kana,
		lastNameKana: emp.last_name_kana,
		phone_mobile: emp.phone_mobile,
		phone_tel: emp.phone_tel,
		email: emp.email,
		postal_code: emp.postal_code,
		address: emp.address,
		password: emp.password,
		role_id: emp.role_id,
		license_type_id: emp.license_type_id,
		license_number: emp.license_number,
		license_exp_at: emp.license_exp_at,
		license_f_img: emp.license_f_img,
		license_b_img: emp.license_b_img,
		pdf_url_driver: emp.pdf_url_driver,
		employment_type_id: emp.employment_type_id,
		department_id: emp.department_id,
		position_id: emp.position_id,
		hire_at: emp.hire_at,
		appointment_at: emp.appointment_at,
		discharge_at: emp.discharge_at,
		discharge_reason: emp.discharge_reason,
		leave_at: emp.leave_at,
		leave_reason: emp.leave_reason,
		death_at: emp.death_at,
		death_reason: emp.death_reason,
		note: emp.note,
		isActive: emp.is_active
	};
}

/**
 * フロントエンド形式の従業員データをデータベース形式に変換
 */
export function convertToDbFormat(
	emp: Partial<Employee>
): Partial<InferSelectModel<typeof employee>> {
	return {
		code: emp.code,
		image: emp.image ?? null,
		image_at: emp.image_at ?? null,
		nationality_id: emp.nationality ?? null,
		gender: emp.gender ?? null,
		blood_type: emp.bloodType ?? null,
		date_of_birth: emp.dateOfBirth,
		first_name: emp.firstName,
		middle_name: emp.middleName ?? null,
		last_name: emp.lastName,
		first_name_kana: emp.firstNameKana ?? null,
		middle_name_kana: emp.middleNameKana ?? null,
		last_name_kana: emp.lastNameKana ?? null,
		phone_mobile: emp.phone_mobile ?? null,
		phone_tel: emp.phone_tel ?? null,
		email: emp.email ?? null,
		postal_code: emp.postal_code ?? null,
		address: emp.address ?? null,
		password: emp.password ?? null,
		role_id: emp.role_id ?? null,
		license_type_id: emp.license_type_id ?? null,
		license_number: emp.license_number ?? null,
		license_exp_at: emp.license_exp_at ?? null,
		license_f_img: emp.license_f_img ?? null,
		license_b_img: emp.license_b_img ?? null,
		pdf_url_driver: emp.pdf_url_driver ?? null,
		employment_type_id: emp.employment_type_id ?? null,
		department_id: emp.department_id ?? null,
		position_id: emp.position_id ?? null,
		hire_at: emp.hire_at ?? null,
		appointment_at: emp.appointment_at ?? null,
		discharge_at: emp.discharge_at ?? null,
		discharge_reason: emp.discharge_reason ?? null,
		leave_at: emp.leave_at ?? null,
		leave_reason: emp.leave_reason ?? null,
		death_at: emp.death_at ?? null,
		death_reason: emp.death_reason ?? null,
		note: emp.note ?? null,
		is_active: emp.isActive ?? true
	};
}
