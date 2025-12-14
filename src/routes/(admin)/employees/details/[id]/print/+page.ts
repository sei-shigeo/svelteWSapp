import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Employee } from '../../../types';

export const load: PageLoad = async ({ params, fetch }) => {
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
};
