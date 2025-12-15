import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import {
	nationality,
	employeeClassification,
	department,
	position,
	educationType,
	suitabilityAssessmentType,
	specialEducationType,
	healthCheckupType,
	ownerType,
	bankAccountType,
	licenseType,
	role
} from '$lib/server/db/schema';

/**
 * GET /employees/api/masters
 * マスタデータを取得
 *
 * すべてのマスタデータを並列で取得します。
 *
 * @returns マスタデータのJSONレスポンス
 */
export const GET: RequestHandler = async () => {
	try {
		const [
			nationalities,
			classifications,
			departments,
			positions,
			educationTypes,
			suitabilityAssessmentTypes,
			specialEducationTypes,
			healthCheckupTypes,
			ownerTypes,
			bankAccountTypes,
			licenseTypes,
			roles
		] = await Promise.all([
			db.select().from(nationality),
			db.select().from(employeeClassification),
			db.select().from(department),
			db.select().from(position),
			db.select().from(educationType),
			db.select().from(suitabilityAssessmentType),
			db.select().from(specialEducationType),
			db.select().from(healthCheckupType),
			db.select().from(ownerType),
			db.select().from(bankAccountType),
			db.select().from(licenseType),
			db.select().from(role)
		]);

		return json({
			nationalityData: nationalities.map((n) => ({ id: n.id, label: n.label })),
			employeeClassificationData: classifications.map((c) => ({ id: c.id, label: c.label })),
			departmentData: departments.map((d) => ({ id: d.id, label: d.label })),
			positionData: positions.map((p) => ({ id: p.id, label: p.label })),
			educationTypeData: educationTypes.map((e) => ({ id: e.id, label: e.type })),
			suitabilityAssessmentTypeData: suitabilityAssessmentTypes.map((s) => ({
				id: s.id,
				label: s.type
			})),
			specialEducationTypeData: specialEducationTypes.map((s) => ({ id: s.id, label: s.type })),
			healthCheckupTypeData: healthCheckupTypes.map((h) => ({ id: h.id, label: h.type })),
			ownerTypeData: ownerTypes.map((o) => ({ id: o.id, label: o.label })),
			bankAccountTypeData: bankAccountTypes.map((b) => ({ id: b.id, label: b.label })),
			licenseTypeData: licenseTypes.map((l) => ({ id: l.id, label: l.type })),
			roleData: roles.map((r) => ({ id: r.id, label: r.type }))
		});
	} catch (error) {
		console.error('Error fetching master data:', error);
		return json({ error: 'Failed to fetch master data' }, { status: 500 });
	}
};
