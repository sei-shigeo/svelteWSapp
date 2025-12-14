import type { Employee } from '../types';
import { REQUIRED_FIELDS } from './constants';

/**
 * フィールドのバリデーション
 */
export function validateField(fieldName: string, value: string | number | undefined): string {
	if (REQUIRED_FIELDS[fieldName] && (!value || String(value).trim() === '')) {
		return `${REQUIRED_FIELDS[fieldName]}は必須です`;
	}
	return '';
}

/**
 * 従業員データの必須フィールドをバリデーション
 */
export function validateEmployeeRequiredFields(
	employee: Partial<Employee>,
	getValue?: (fieldName: string) => string | number | undefined
): { isValid: boolean; errors: Record<string, string> } {
	const errors: Record<string, string> = {};
	let hasError = false;

	Object.keys(REQUIRED_FIELDS).forEach((fieldName) => {
		const value = getValue ? getValue(fieldName) : employee[fieldName as keyof Employee];
		const error = validateField(fieldName, value as string | number | undefined);
		if (error) {
			errors[fieldName] = error;
			hasError = true;
		}
	});

	return {
		isValid: !hasError,
		errors
	};
}

/**
 * 従業員コードの重複チェック用バリデーション
 */
export function validateEmployeeCode(code: string | undefined): string {
	if (!code || code.trim() === '') {
		return '従業員IDは必須です';
	}
	return '';
}
