// 国籍データ
export const nationalityData = [
	{ id: 1, label: '日本' },
	{ id: 2, label: 'ブラジル' },
	{ id: 3, label: 'ペルー' }
] as const;

// 従業員データ
export type Employee = {
	id: number;
	code: string;
	image?: string;
	nationality: (typeof nationalityData)[number]['id'];
	gender: 1 | 2;
	bloodType: 1 | 2 | 3 | 4;
	dateOfBirth: string;
	firstName: string;
	middleName?: string;
	lastName: string;
	firstNameKana?: string;
	middleNameKana?: string;
	lastNameKana?: string;
	phone?: string;
	email?: string;
	postalCode?: string;
	address?: string;
	isActive: boolean;
	isEditModalOpen?: boolean;
};

export const employeeData: Employee[] = [
	{
		id: 1,
		code: '1234567890',
		// image: 'https://via.placeholder.com/150',
		nationality: 1,
		gender: 1,
		bloodType: 1,
		dateOfBirth: '1990-01-01',
		firstName: '山田',
		lastName: '太郎',
		firstNameKana: 'ヤマダ',
		lastNameKana: 'タロウ',
		phone: '090-1234-5678',
		email: 'employee1@example.com',
		address: '東京都千代田区永田町1-7-1',
		isActive: true
	},
	{
		id: 2,
		code: '2345678901',
		// image: 'https://via.placeholder.com/150',
		nationality: 1,
		gender: 2,
		bloodType: 2,
		dateOfBirth: '1985-05-15',
		firstName: '佐藤',
		lastName: '花子',
		firstNameKana: 'サトウ',
		lastNameKana: 'ハナコ',
		phone: '090-2345-6789',
		email: 'employee2@example.com',
		address: '大阪府大阪市北区梅田1-1-1',
		isActive: false
	},
	{
		id: 3,
		code: '3456789012',
		// image: 'https://via.placeholder.com/150',
		nationality: 2,
		gender: 1,
		bloodType: 3,
		dateOfBirth: '1992-08-20',
		firstName: '鈴木',
		lastName: '一郎',
		firstNameKana: 'スズキ',
		lastNameKana: 'イチロウ',
		phone: '090-3456-7890',
		email: 'employee3@example.com',
		address: '愛知県名古屋市中村区名駅1-1-1',
		isActive: true
	},
	{
		id: 4,
		code: '4567890123',
		// image: 'https://via.placeholder.com/150',
		nationality: 2,
		gender: 2,
		bloodType: 4,
		dateOfBirth: '1988-12-03',
		firstName: '田中',
		lastName: '美咲',
		firstNameKana: 'タナカ',
		lastNameKana: 'ミサキ',
		phone: '090-4567-8901',
		email: 'employee4@example.com',
		address: '福岡県福岡市博多区博多駅前2-2-2',
		isActive: true
	},
	{
		id: 5,
		code: '5678901234',
		// image: 'https://via.placeholder.com/150',
		nationality: 3,
		gender: 1,
		bloodType: 1,
		dateOfBirth: '1995-03-28',
		firstName: '高橋',
		lastName: '健太',
		firstNameKana: 'タカハシ',
		lastNameKana: 'ケンタ',
		phone: '090-5678-9012',
		email: 'employee5@example.com',
		address: '北海道札幌市中央区北1条西2-2-2',
		isActive: true
	}
];
