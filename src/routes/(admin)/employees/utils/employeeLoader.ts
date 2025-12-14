import { error } from '@sveltejs/kit';
import type { PageLoad } from '@sveltejs/kit';
import type { Employee } from '../types';

/**
 * 従業員IDから従業員データを取得する共通ローダー関数
 *
 * @param params - ページパラメータ（idを含む）
 * @returns 従業員データを含むオブジェクト
 * @throws 404エラー - 従業員が見つからない場合、またはIDが無効な場合
 * @throws 500エラー - サーバーエラーが発生した場合
 */
export async function loadEmployee(params: { id?: string }): Promise<{ employee: Employee }> {
	if (!params.id) {
		throw error(404, 'Employee not found');
	}

	const id = parseInt(params.id, 10);
	if (isNaN(id)) {
		throw error(404, 'Invalid employee ID');
	}

	const response = await fetch(`/employees/api/${id}`);
	if (!response.ok) {
		if (response.status === 404) {
			throw error(404, 'Employee not found');
		}
		throw error(500, 'Failed to fetch employee');
	}

	const employee: Employee = await response.json();

	return {
		employee
	};
}

/**
 * SvelteKitのPageLoad関数として使用するラッパー
 *
 * @returns PageLoad関数
 */
export const createEmployeeLoader = (): PageLoad => {
	return async ({ params }) => loadEmployee(params);
};
