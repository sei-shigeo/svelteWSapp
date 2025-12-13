import { error } from '@sveltejs/kit';
import type { PageLoad } from '@sveltejs/kit';
import { employeeData, type Employee } from '../data/employeeData';

/**
 * 従業員IDから従業員データを取得する共通ローダー関数
 * @param params - ページパラメータ（idを含む）
 * @returns 従業員データ
 * @throws 404エラー（従業員が見つからない場合）
 */
export function loadEmployee(params: { id?: string }): { employee: Employee } {
	if (!params.id) {
		throw error(404, 'Employee not found');
	}

	const id = parseInt(params.id, 10);
	if (isNaN(id)) {
		throw error(404, 'Invalid employee ID');
	}

	const employee = employeeData.find((emp: Employee) => emp.id === id);

	if (!employee) {
		throw error(404, 'Employee not found');
	}

	return {
		employee
	};
}

/**
 * SvelteKitのPageLoad関数として使用するラッパー
 */
export const createEmployeeLoader = (): PageLoad => {
	return async ({ params }) => loadEmployee(params);
};

