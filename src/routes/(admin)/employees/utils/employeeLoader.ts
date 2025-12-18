import { error } from '@sveltejs/kit';
import type { Employee } from '../types';

/**
 * ページローダーの引数型（共有ユーティリティ用）
 */
type LoadEvent = {
	params: { id?: string };
	fetch: typeof globalThis.fetch;
};

/**
 * 従業員IDから従業員データを取得する共通ローダー関数
 *
 * @param params - ページパラメータ（idを含む）
 * @param fetch - SvelteKitのfetch関数
 * @returns 従業員データを含むオブジェクト
 * @throws 404エラー - 従業員が見つからない場合、またはIDが無効な場合
 * @throws 500エラー - サーバーエラーが発生した場合
 */
export async function loadEmployee(
	params: { id?: string },
	fetch: typeof globalThis.fetch
): Promise<{ employee: Employee }> {
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
 * @returns PageLoad互換のローダー関数
 */
export const createEmployeeLoader = () => {
	return async ({ params, fetch }: LoadEvent) => loadEmployee(params, fetch);
};
