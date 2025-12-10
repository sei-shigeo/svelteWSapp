import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { employeeData, type Employee } from '../../data/employeeData';

export const load: PageLoad = async ({ params }) => {
	if (!params.employeeId) {
		throw error(404, 'Employee not found');
	}

	const employeeId = parseInt(params.employeeId, 10);
	const employee = employeeData.find((emp: Employee) => emp.id === employeeId);

	if (!employee) {
		throw error(404, 'Employee not found');
	}

	return {
		employee
	};
};