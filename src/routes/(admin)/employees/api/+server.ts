import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { employee } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import type { Employee } from '../types';
import { formatEmployee, convertToDbFormat } from '../utils/employeeTransformers';
import { validateEmployeeRequiredFields, validateEmployeeCode } from '../utils/validation';

/**
 * GET /employees/api
 * 従業員一覧を取得
 */
export const GET: RequestHandler = async ({ url }) => {
	try {
		const isActive = url.searchParams.get('isActive');
		const nationalityId = url.searchParams.get('nationality_id');

		// 条件を構築
		const conditions = [];
		if (isActive !== null) {
			const active = isActive === 'true';
			conditions.push(eq(employee.is_active, active));
		}
		if (nationalityId) {
			conditions.push(eq(employee.nationality_id, parseInt(nationalityId)));
		}

		// クエリを実行
		const employees =
			conditions.length > 0
				? await db
						.select()
						.from(employee)
						.where(and(...conditions))
				: await db.select().from(employee);

		// データベースの形式をフロントエンド用の形式に変換
		const formattedEmployees = employees.map(formatEmployee);

		return json(formattedEmployees);
	} catch (error) {
		console.error('Error fetching employees:', error);
		return json({ error: 'Failed to fetch employees' }, { status: 500 });
	}
};

/**
 * POST /employees/api
 * 従業員を作成
 */
export const POST: RequestHandler = async ({ request }) => {
	try {
		const body: Partial<Employee> = await request.json();

		// 必須フィールドのバリデーション
		const validation = validateEmployeeRequiredFields(body);
		if (!validation.isValid) {
			return json(
				{ error: 'Missing required fields', details: validation.errors },
				{ status: 400 }
			);
		}

		// 従業員コードのバリデーション
		const codeError = validateEmployeeCode(body.code);
		if (codeError) {
			return json({ error: codeError }, { status: 400 });
		}

		// 従業員コードの重複チェック（バリデーション済みなのでcode存在確定）
		const existingEmployee = await db
			.select()
			.from(employee)
			.where(eq(employee.code, body.code!))
			.limit(1);

		if (existingEmployee.length > 0) {
			return json({ error: 'Employee code already exists' }, { status: 409 });
		}

		// データベース形式に変換して挿入（バリデーション済みなので必須フィールド存在確定）
		const dbData = convertToDbFormat(body) as typeof employee.$inferInsert;
		const result = await db.insert(employee).values(dbData).returning();

		if (result.length === 0) {
			return json({ error: 'Failed to create employee' }, { status: 500 });
		}

		const emp = result[0];

		// フロントエンド形式に変換して返す
		return json(formatEmployee(emp), { status: 201 });
	} catch (err) {
		console.error('Error creating employee:', err);
		return json({ error: 'Failed to create employee' }, { status: 500 });
	}
};
