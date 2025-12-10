import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { employeeData, type Employee } from '../data/employeeData';

export const load: PageLoad = async ({ params }) => {
	if (!params.id) {
		throw error(404, 'Employee not found');
	}

	const id = parseInt(params.id, 10);
	const employee = employeeData.find((emp: Employee) => emp.id === id);

	if (!employee) {
		throw error(404, 'Employee not found');
	}

	return {
		employee
	};
};
