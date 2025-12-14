import type { PageLoad } from './$types';
import type { Employee, Nationality } from './types';

/**
 * 従業員一覧ページのデータローダー
 *
 * 在職中の従業員一覧とマスタデータ（国籍）を並列で取得します。
 *
 * @returns 従業員一覧と国籍マスタデータ
 */
export const load: PageLoad = async ({ fetch }) => {
	try {
		const [employeesRes, mastersRes] = await Promise.all([
			fetch('/employees/api?isActive=true'),
			fetch('/employees/api/masters')
		]);

		const employees: Employee[] = employeesRes.ok ? await employeesRes.json() : [];
		const masters = mastersRes.ok ? await mastersRes.json() : { nationalityData: [] };
		const nationalityData: Nationality[] = masters.nationalityData || [];

		return {
			employees,
			nationalityData
		};
	} catch (error) {
		console.error('Error loading data:', error);
		return {
			employees: [],
			nationalityData: []
		};
	}
};
