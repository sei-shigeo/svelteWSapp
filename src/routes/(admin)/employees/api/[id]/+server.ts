import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { employee } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Employee } from '../../types';
import { formatEmployee, convertToDbFormat } from '../../utils/employeeTransformers';
import { validateEmployeeCode } from '../../utils/validation';

/**
 * GET /employees/api/[id]
 * 従業員詳細を取得
 */
export const GET: RequestHandler = async ({ params }) => {
	try {
		const id = parseInt(params.id, 10);
		if (isNaN(id)) {
			throw error(404, 'Invalid employee ID');
		}

		const result = await db.select().from(employee).where(eq(employee.id, id)).limit(1);

		if (result.length === 0) {
			throw error(404, 'Employee not found');
		}

		const emp = result[0];
		return json(formatEmployee(emp));
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		console.error('Error fetching employee:', err);
		throw error(500, 'Failed to fetch employee');
	}
};

/**
 * PUT /employees/api/[id]
 * 従業員を更新
 */
export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const id = parseInt(params.id, 10);
		if (isNaN(id)) {
			throw error(400, 'Invalid employee ID');
		}

		// 従業員が存在するか確認
		const existing = await db.select().from(employee).where(eq(employee.id, id)).limit(1);
		if (existing.length === 0) {
			throw error(404, 'Employee not found');
		}

		const body: Partial<Employee> = await request.json();

		// 必須フィールドのバリデーション（更新時はundefinedでない場合のみチェック）
		if (body.code !== undefined) {
			const codeError = validateEmployeeCode(body.code);
			if (codeError) {
				return json({ error: codeError }, { status: 400 });
			}
		}
		if (body.firstName !== undefined && !body.firstName) {
			return json({ error: '名は必須です' }, { status: 400 });
		}
		if (body.lastName !== undefined && !body.lastName) {
			return json({ error: '姓は必須です' }, { status: 400 });
		}
		if (body.dateOfBirth !== undefined && !body.dateOfBirth) {
			return json({ error: '生年月日は必須です' }, { status: 400 });
		}

		// 従業員コードの重複チェック（自分以外）
		if (body.code && body.code !== existing[0].code) {
			const duplicate = await db
				.select()
				.from(employee)
				.where(eq(employee.code, body.code))
				.limit(1);

			if (duplicate.length > 0) {
				return json({ error: 'Employee code already exists' }, { status: 409 });
			}
		}

		// データベース形式に変換（更新するフィールドのみ）
		const updateData: Partial<ReturnType<typeof convertToDbFormat>> = {};
		const dbData = convertToDbFormat(body);

		// undefinedでないフィールドのみ更新
		Object.keys(dbData).forEach((key) => {
			const value = dbData[key as keyof typeof dbData];
			if (value !== undefined) {
				updateData[key as keyof typeof updateData] = value;
			}
		});

		// updated_atを更新
		updateData.updated_at = new Date();

		// 更新を実行
		const result = await db.update(employee).set(updateData).where(eq(employee.id, id)).returning();

		if (result.length === 0) {
			throw error(500, 'Failed to update employee');
		}

		return json(formatEmployee(result[0]));
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		console.error('Error updating employee:', err);
		throw error(500, 'Failed to update employee');
	}
};

/**
 * DELETE /employees/api/[id]
 * 従業員を削除
 */
export const DELETE: RequestHandler = async ({ params }) => {
	try {
		const id = parseInt(params.id, 10);
		if (isNaN(id)) {
			throw error(400, 'Invalid employee ID');
		}

		// 従業員が存在するか確認
		const existing = await db.select().from(employee).where(eq(employee.id, id)).limit(1);
		if (existing.length === 0) {
			throw error(404, 'Employee not found');
		}

		// 削除を実行（カスケード削除により関連データも削除される）
		await db.delete(employee).where(eq(employee.id, id));

		return json({ message: 'Employee deleted successfully' }, { status: 200 });
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		console.error('Error deleting employee:', err);
		throw error(500, 'Failed to delete employee');
	}
};
