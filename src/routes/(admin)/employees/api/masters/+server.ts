import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { nationality, employeeClassification, department, position } from '$lib/server/db/schema';

/**
 * GET /employees/api/masters
 * マスタデータを取得
 *
 * 国籍、従業員区分、部門、役職のマスタデータを並列で取得します。
 *
 * @returns マスタデータのJSONレスポンス
 */
export const GET: RequestHandler = async () => {
	try {
		const [nationalities, classifications, departments, positions] = await Promise.all([
			db.select().from(nationality),
			db.select().from(employeeClassification),
			db.select().from(department),
			db.select().from(position)
		]);

		return json({
			nationalityData: nationalities.map((n) => ({ id: n.id, label: n.label })),
			employeeClassificationData: classifications.map((c) => ({ id: c.id, label: c.label })),
			departmentData: departments.map((d) => ({ id: d.id, label: d.label })),
			positionData: positions.map((p) => ({ id: p.id, label: p.label }))
		});
	} catch (error) {
		console.error('Error fetching master data:', error);
		return json({ error: 'Failed to fetch master data' }, { status: 500 });
	}
};
