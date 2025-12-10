import {
	type FieldConfig,
	employeeInfoData,
	emergencyContactData,
	employmentInfoData,
	licenseInfoData,
	qualificationInfoData,
	insuranceInfoData,
	jobHistoryInfoData,
	educationInfoData
} from './formData';

export type DetailData = {
	open?: boolean;
	title: string;
	className: string;
	showButtons?: boolean;
	fields: FieldConfig[];
};

export const detailData: DetailData[] = [
	{
		open: true,
		title: '従業員情報',
		className: 'employee-info',
		fields: employeeInfoData
	},
	{
		title: '緊急連絡先',
		className: 'emergency-contact',
		fields: emergencyContactData
	},
	{
		title: '雇用情報',
		className: 'employment-info',
		fields: employmentInfoData
	},
	{
		title: '免許証情報',
		className: 'license-info',
		fields: licenseInfoData
	},
	{
		title: '資格証書情報',
		className: 'qualification-info',
		fields: qualificationInfoData,
		showButtons: true
	},
	{
		title: '保険情報',
		className: 'insurance-info',
		fields: insuranceInfoData,
		showButtons: true
	},
	{
		title: '職歴情報',
		className: 'job-history-info',
		fields: jobHistoryInfoData,
		showButtons: true
	},
	{
		title: '学歴情報',
		className: 'education-info',
		fields: educationInfoData,
		showButtons: true
	}
];
