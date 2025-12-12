// 国籍データ
export const nationalityData = [
	{ id: 1, label: '日本' },
	{ id: 2, label: 'ブラジル' },
	{ id: 3, label: 'ペルー' }
] as const;

// 社員区分
export const employeeClassificationData = [
	{ id: 1, label: '正社員' },
	{ id: 2, label: '非正社員' },
	{ id: 3, label: '契約社員' },
	{ id: 4, label: 'その他' }
] as const;

// 部門
export const departmentData = [
	{ id: 1, label: '総務部' },
	{ id: 2, label: '人事部' },
	{ id: 3, label: '経理部' },
	{ id: 4, label: 'その他' }
] as const;

// 役職
export const positionData = [
	{ id: 1, label: '社長' },
	{ id: 2, label: '部長' },
	{ id: 3, label: '課長' },
	{ id: 4, label: 'その他' }
] as const;

// 資格証明データ(複数 登録可能)
export const qualificationData = [
	{
		id: 1,
		type: 'フォークリフト',
		number: '1234567890',
		acq_at: '2025-01-01',
		exp_at: '2025-01-01',
		img: 'https://via.placeholder.com/150'
	},
	{
		id: 1,
		type: '玉掛け',
		number: '1234567890',
		acq_at: '2025-01-01',
		exp_at: '2025-01-01',
		img: 'https://via.placeholder.com/150'
	},
	{
		id: 3,
		type: '5トン未満クレーン',
		number: '1234567890',
		acq_at: '2025-01-01',
		exp_at: '2025-01-01',
		img: 'https://via.placeholder.com/150'
	}
] as const;

// 保険データ(複数 登録可能)
export const insuranceData = [
	{
		id: 1,
		type: '健康保険',
		number: '1234567890',
		acq_at: '2025-01-01',
		img: 'https://via.placeholder.com/150'
	},
	{
		id: 1,
		type: '厚生年金',
		number: '1234567890',
		acq_at: '2025-01-01',
		img: 'https://via.placeholder.com/150'
	},
	{
		id: 1,
		type: '雇用保険',
		number: '1234567890',
		acq_at: '2025-01-01',
		img: 'https://via.placeholder.com/150'
	},
	{
		id: 1,
		type: 'マイナンバー',
		number: '1234567890',
		acq_at: '2025-01-01',
		img: 'https://via.placeholder.com/150'
	}
] as const;

// 学歴typeデータ
export const educationType = [
	{ id: 1, type: '中学校' },
	{ id: 2, type: '高校' },
	{ id: 3, type: '大学' },
	{ id: 4, type: '専門学校' },
	{ id: 5, type: 'その他' }
] as const;

// 学歴データ
export const educationData = [
	{ id: 1, education_type_id: 1, name: '中学校', start_at: '2025-01-01', end_at: '2025-01-01' },
	{ id: 2, education_type_id: 2, name: '高校', start_at: '2025-01-01', end_at: '2025-01-01' },
	{ id: 3, education_type_id: 3, name: '大学', start_at: '2025-01-01', end_at: '2025-01-01' },
	{ id: 4, education_type_id: 4, name: '専門学校', start_at: '2025-01-01', end_at: '2025-01-01' },
	{ id: 5, education_type_id: 5, name: 'その他', start_at: '2025-01-01', end_at: '2025-01-01' }
] as const;

// 職歴データ
export const jobHistoryData = [
	{ id: 1, name: '職歴1', content: '職歴1の内容', start_at: '2025-01-01', end_at: '2025-01-01' },
	{ id: 2, name: '職歴2', content: '職歴2の内容', start_at: '2025-01-01', end_at: '2025-01-01' },
	{ id: 3, name: '職歴3', content: '職歴3の内容', start_at: '2025-01-01', end_at: '2025-01-01' }
] as const;

// 適性診断typeデータ
export const suitabilityAssessmentType = [
	{ id: 1, type: '初任診断' },
	{ id: 2, type: '一般診断' },
	{ id: 3, type: '適齢診断' },
	{ id: 4, type: '特別診断' },
	{ id: 5, type: '特定診断' }
] as const;

// 適性診断データ (複数 登録可能)
export const suitabilityAssessmentData = [
	{
		id: 1,
		suitability_assessment_type_id: 1,
		score: 100,
		result: '適性診断1の結果',
		pdf_url: 'https://via.placeholder.com/150'
	},
	{
		id: 2,
		suitability_assessment_type_id: 2,
		score: 100,
		result: '適性診断2の結果',
		pdf_url: 'https://via.placeholder.com/150'
	},
	{
		id: 3,
		suitability_assessment_type_id: 3,
		score: 100,
		result: '適性診断3の結果',
		pdf_url: 'https://via.placeholder.com/150'
	},
	{
		id: 4,
		suitability_assessment_type_id: 4,
		score: 100,
		result: '適性診断4の結果',
		pdf_url: 'https://via.placeholder.com/150'
	},
	{
		id: 5,
		suitability_assessment_type_id: 5,
		score: 100,
		result: '適性診断5の結果',
		pdf_url: 'https://via.placeholder.com/150'
	}
] as const;

// 特別教育typeデータ
export const specialEducationType = [
	{ id: 1, type: '特別教育1' },
	{ id: 2, type: '特別教育2' },
	{ id: 3, type: '特別教育3' }
] as const;

// 特別教育データ (複数 登録可能)
export const specialEducationData = [
	{
		id: 1,
		special_education_type_id: 1,
		trainer: '特別教育1',
		content: '特別教育1の内容',
		start_at: '2025-01-01',
		end_at: '2025-01-01'
	},
	{
		id: 2,
		special_education_type_id: 2,
		trainer: '特別教育2',
		content: '特別教育2の内容',
		start_at: '2025-01-01',
		end_at: '2025-01-01'
	},
	{
		id: 3,
		special_education_type_id: 3,
		trainer: '特別教育3',
		content: '特別教育3の内容',
		start_at: '2025-01-01',
		end_at: '2025-01-01'
	}
] as const;

// 健康診断typeデータ
export const healthCheckupType = [
	{ id: 1, type: '定期健康診断' },
	{ id: 2, type: '特定健康診断' },
	{ id: 3, type: 'その他' }
] as const;

// 健康診断 (複数 登録可能)
export const healthCheckupData = [
	{
		id: 1,
		health_checkup_type_id: 1,
		result: '正常',
		content: '健康診断1の内容',
		date_at: '2025-01-01',
		pdf_url: 'https://via.placeholder.com/150'
	},
	{
		id: 2,
		health_checkup_type_id: 2,
		result: '異常',
		content: '健康診断2の内容',
		date_at: '2025-01-01',
		pdf_url: 'https://via.placeholder.com/150'
	},
	{
		id: 3,
		health_checkup_type_id: 3,
		result: 'その他',
		content: '健康診断3の内容',
		date_at: '2025-01-01',
		pdf_url: 'https://via.placeholder.com/150'
	}
] as const;

// 銀行口座Type (会社、取引先、従業)
export const bankAccountType = [
	{ id: 1, type: '会社' },
	{ id: 2, type: '取引先' },
	{ id: 3, type: '従業員' }
] as const;

// 銀行口座データ (複数 登録可能)
export const bankAccountData = [
	{
		id: 1,
		bank_account_type_id: 1,
		bank_name: '銀行1',
		branch_name: '支店1',
		account_number: '1234567890',
		account_holder: '銀行1'
	},
	{
		id: 2,
		bank_account_type_id: 2,
		bank_name: '銀行2',
		branch_name: '支店2',
		account_number: '1234567890',
		account_holder: '銀行2'
	},
	{
		id: 3,
		bank_account_type_id: 3,
		bank_name: '銀行3',
		branch_name: '支店3',
		account_number: '1234567890',
		account_holder: '銀行3'
	}
] as const;

// 運転免許証typeデータ
export const licenseType = [
	{ id: 1, type: '中型' },
	{ id: 2, type: '大型' },
	{ id: 3, type: '牽引' }
] as const;

// roleデータ
export const roleData = [
	{ id: 1, type: '管理者' },
	{ id: 2, type: '一般' }
] as const;

// 緊急連絡先 (複数 登録可能)
export const emergencyContactData = [
	{
		id: 1,
		relationship: '父',
		name: '緊急連絡先1',
		phone: '090-1234-5678',
		address: '東京都千代田区永田町1-7-1',
		email: 'employee1@example.com'
	},
	{
		id: 2,
		relationship: '母',
		name: '緊急連絡先2',
		phone: '090-2345-6789',
		address: '大阪府大阪市北区梅田1-1-1',
		email: 'employee2@example.com'
	},
	{
		id: 3,
		relationship: '兄弟',
		name: '緊急連絡先3',
		phone: '090-3456-7890',
		address: '愛知県名古屋市中村区名駅1-1-1',
		email: 'employee3@example.com'
	}
] as const;

// 従業員データ
export type Employee = {
	id: number;
	code: string;
	image?: string;
	image_at?: string;
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
	// 携帯電話
	phone_mobile?: string;
	// 電話番号
	phone_tel?: string;
	// メールアドレス
	email?: string;
	// 郵便番号
	postal_code?: string;
	// 住所
	address?: string;

	// パスワード
	password?: string;

	// role (admin, user)
	role_id?: (typeof roleData)[number]['id'];

	// 運転免許証
	license_type_id?: (typeof licenseType)[number]['id'];
	license_number?: string;
	license_exp_at?: string;
	license_f_img?: string;
	license_b_img?: string;
	// 運転手台帳用 pdf_url
	pdf_url_driver?: string;

	// 雇用形態 (正社員、非正社員、契約社員、その他)
	employment_type_id?: (typeof employeeClassificationData)[number]['id'];

	// 部門 (総務部、人事部、経理部、その他)
	department_id?: (typeof departmentData)[number]['id'];

	// 役職 (社長、部長、課長、その他)
	position_id?: (typeof positionData)[number]['id'];

	// 雇用日
	hire_at?: string;
	// 選任日 (ドライバー)
	appointment_at?: string;
	// 解任日 (ドライバー)
	discharge_at?: string;
	// 解任理由 (ドライバー)
	discharge_reason?: string;
	// 退職日
	leave_at?: string;
	// 退職理由
	leave_reason?: string;
	// 死亡年月日
	death_at?: string;
	// 死亡理由
	death_reason?: string;

	// 備考欄
	note?: string;

	isActive: boolean;
};

// ランダムデータ生成用のヘルパー関数
function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start: Date, end: Date): string {
	const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	return date.toISOString().split('T')[0];
}

function randomPhone(): string {
	return `0${randomInt(7, 9)}0-${randomInt(1000, 9999)}-${randomInt(1000, 9999)}`;
}

function randomEmail(firstName: string, lastName: string, id: number): string {
	return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${id}@example.com`;
}

function randomPostalCode(): string {
	return `${randomInt(100, 999)}-${randomInt(1000, 9999)}`;
}

const japaneseFirstNames = [
	'太郎',
	'花子',
	'一郎',
	'美咲',
	'健太',
	'さくら',
	'雄一',
	'愛美',
	'翔太',
	'麻衣',
	'大輔',
	'優香',
	'拓也',
	'理恵',
	'直樹',
	'美咲',
	'健介',
	'由美',
	'亮太',
	'彩',
	'翔',
	'結衣',
	'智也',
	'美優',
	'和也',
	'真由美',
	'誠',
	'あかり',
	'大樹',
	'みお'
];

const japaneseLastNames = [
	'山田',
	'佐藤',
	'鈴木',
	'田中',
	'高橋',
	'伊藤',
	'渡辺',
	'中村',
	'小林',
	'加藤',
	'吉田',
	'松本',
	'井上',
	'木村',
	'林',
	'斎藤',
	'清水',
	'山口',
	'森',
	'橋本',
	'石川',
	'前田',
	'小川',
	'岡田',
	'長谷川',
	'近藤',
	'坂本',
	'遠藤',
	'村上',
	'藤田'
];

const japaneseFirstNamesKana = [
	'タロウ',
	'ハナコ',
	'イチロウ',
	'ミサキ',
	'ケンタ',
	'サクラ',
	'ユウイチ',
	'マナミ',
	'ショウタ',
	'マイ',
	'ダイスケ',
	'ユウカ',
	'タクヤ',
	'リエ',
	'ナオキ',
	'ミサキ',
	'ケンスケ',
	'ユミ',
	'リョウタ',
	'アヤ',
	'ショウ',
	'ユイ',
	'トモヤ',
	'ミユ',
	'カズヤ',
	'マユミ',
	'マコト',
	'アカリ',
	'ダイキ',
	'ミオ'
];

const japaneseLastNamesKana = [
	'ヤマダ',
	'サトウ',
	'スズキ',
	'タナカ',
	'タカハシ',
	'イトウ',
	'ワタナベ',
	'ナカムラ',
	'コバヤシ',
	'カトウ',
	'ヨシダ',
	'マツモト',
	'イノウエ',
	'キムラ',
	'ハヤシ',
	'サイトウ',
	'シミズ',
	'ヤマグチ',
	'モリ',
	'ハシモト',
	'イシカワ',
	'マエダ',
	'オガワ',
	'オカダ',
	'ハセガワ',
	'コンドウ',
	'サカモト',
	'エンドウ',
	'ムラカミ',
	'フジタ'
];

const brazilianFirstNames = [
	'Carlos',
	'Ana',
	'João',
	'Maria',
	'Roberto',
	'Paula',
	'Pedro',
	'Fernanda',
	'Lucas',
	'Juliana',
	'Rafael',
	'Camila',
	'Gabriel',
	'Beatriz',
	'Felipe',
	'Mariana',
	'Thiago',
	'Carolina',
	'Bruno',
	'Amanda'
];

const brazilianLastNames = [
	'Silva',
	'Santos',
	'Oliveira',
	'Souza',
	'Costa',
	'Pereira',
	'Rodrigues',
	'Almeida',
	'Nascimento',
	'Lima',
	'Araujo',
	'Ferreira',
	'Ribeiro',
	'Carvalho',
	'Gomes',
	'Martins',
	'Rocha',
	'Dias',
	'Moreira',
	'Cavalcanti'
];

const peruvianFirstNames = [
	'Miguel',
	'Carmen',
	'Jose',
	'Rosa',
	'Luis',
	'Maria',
	'Angel',
	'Patricia',
	'Carlos',
	'Ana',
	'Fernando',
	'Lucia',
	'Ricardo',
	'Elena',
	'Diego',
	'Sofia',
	'Manuel',
	'Isabel',
	'Francisco',
	'Gabriela'
];

const peruvianLastNames = [
	'Garcia',
	'Lopez',
	'Rodriguez',
	'Fernandez',
	'Gonzalez',
	'Martinez',
	'Sanchez',
	'Perez',
	'Ramirez',
	'Torres',
	'Flores',
	'Rivera',
	'Gomez',
	'Diaz',
	'Cruz',
	'Morales',
	'Ortiz',
	'Gutierrez',
	'Chavez',
	'Ramos'
];

const addresses = [
	'東京都千代田区永田町1-7-1',
	'大阪府大阪市北区梅田1-1-1',
	'愛知県名古屋市中村区名駅1-1-1',
	'福岡県福岡市博多区博多駅前2-2-2',
	'北海道札幌市中央区北1条西2-2-2',
	'神奈川県横浜市港北区新横浜1-1-1',
	'埼玉県さいたま市大宮区大宮1-1-1',
	'東京都新宿区新宿3-1-1',
	'千葉県千葉市中央区中央1-1-1',
	'東京都渋谷区渋谷1-1-1',
	'東京都港区六本木1-1-1',
	'東京都品川区大崎1-1-1',
	'東京都目黒区目黒1-1-1',
	'東京都世田谷区三軒茶屋1-1-1',
	'東京都練馬区練馬1-1-1',
	'東京都板橋区板橋1-1-1',
	'東京都足立区北千住1-1-1',
	'東京都江戸川区小岩1-1-1',
	'東京都葛飾区亀有1-1-1',
	'東京都杉並区高円寺1-1-1',
	'東京都中野区中野1-1-1',
	'東京都豊島区池袋1-1-1',
	'東京都北区赤羽1-1-1',
	'東京都荒川区荒川1-1-1',
	'東京都文京区本郷1-1-1',
	'東京都台東区上野1-1-1',
	'東京都墨田区押上1-1-1',
	'東京都江東区豊洲1-1-1',
	'東京都大田区蒲田1-1-1',
	'東京都調布市調布1-1-1'
];

function generateEmployee(id: number): Employee {
	const nationality = randomInt(1, 3) as 1 | 2 | 3;
	const gender = randomInt(1, 2) as 1 | 2;
	const bloodType = randomInt(1, 4) as 1 | 2 | 3 | 4;

	let firstName: string;
	let lastName: string;
	let middleName: string | undefined;
	let firstNameKana: string | undefined;
	let middleNameKana: string | undefined;
	let lastNameKana: string | undefined;

	if (nationality === 1) {
		// 日本
		firstName = japaneseFirstNames[randomInt(0, japaneseFirstNames.length - 1)];
		lastName = japaneseLastNames[randomInt(0, japaneseLastNames.length - 1)];
		firstNameKana = japaneseFirstNamesKana[randomInt(0, japaneseFirstNamesKana.length - 1)];
		lastNameKana = japaneseLastNamesKana[randomInt(0, japaneseLastNamesKana.length - 1)];
	} else if (nationality === 2) {
		// ブラジル
		firstName = brazilianFirstNames[randomInt(0, brazilianFirstNames.length - 1)];
		lastName = brazilianLastNames[randomInt(0, brazilianLastNames.length - 1)];
		if (Math.random() > 0.5) {
			middleName = brazilianFirstNames[randomInt(0, brazilianFirstNames.length - 1)];
		}
	} else {
		// ペルー
		firstName = peruvianFirstNames[randomInt(0, peruvianFirstNames.length - 1)];
		lastName = peruvianLastNames[randomInt(0, peruvianLastNames.length - 1)];
		if (Math.random() > 0.5) {
			middleName = peruvianFirstNames[randomInt(0, peruvianFirstNames.length - 1)];
		}
	}

	const dateOfBirth = randomDate(new Date(1970, 0, 1), new Date(2000, 11, 31));
	const birthYear = parseInt(dateOfBirth.split('-')[0]);
	const hireYear = birthYear + randomInt(20, 30);
	const hireDate = randomDate(new Date(hireYear, 0, 1), new Date(2024, 11, 31));

	const hasLicense = Math.random() > 0.3;
	const hasEmployment = Math.random() > 0.2;
	const hasRole = Math.random() > 0.5;
	const hasAppointment = hasLicense && Math.random() > 0.6;
	const hasLeave = Math.random() > 0.7;
	const hasDeath = Math.random() > 0.95;

	const employee: Employee = {
		id,
		code: String(randomInt(1000000000, 9999999999)),
		image: Math.random() > 0.3 ? `https://picsum.photos/150/150?random=${id}` : undefined,
		image_at: Math.random() > 0.5 ? randomDate(new Date(2020, 0, 1), new Date()) : undefined,
		nationality,
		gender,
		bloodType,
		dateOfBirth,
		firstName,
		lastName,
		middleName,
		firstNameKana,
		middleNameKana,
		lastNameKana,
		phone_mobile: Math.random() > 0.3 ? randomPhone() : undefined,
		phone_tel: Math.random() > 0.5 ? randomPhone() : undefined,
		email: randomEmail(firstName, lastName, id),
		postal_code: Math.random() > 0.2 ? randomPostalCode() : undefined,
		address: addresses[randomInt(0, addresses.length - 1)],
		password: Math.random() > 0.5 ? `password${id}` : undefined,
		role_id: hasRole ? (randomInt(1, 2) as 1 | 2) : undefined,
		license_type_id: hasLicense ? (randomInt(1, 3) as 1 | 2 | 3) : undefined,
		license_number: hasLicense ? String(randomInt(1000000000, 9999999999)) : undefined,
		license_exp_at: hasLicense ? randomDate(new Date(), new Date(2030, 11, 31)) : undefined,
		license_f_img:
			hasLicense && Math.random() > 0.3
				? `https://picsum.photos/400/300?random=${id * 2}`
				: undefined,
		license_b_img:
			hasLicense && Math.random() > 0.3
				? `https://picsum.photos/400/300?random=${id * 2 + 1}`
				: undefined,
		pdf_url_driver:
			hasLicense && hasAppointment && Math.random() > 0.5
				? `https://example.com/driver${id}.pdf`
				: undefined,
		employment_type_id: hasEmployment ? (randomInt(1, 4) as 1 | 2 | 3 | 4) : undefined,
		department_id: hasEmployment ? (randomInt(1, 4) as 1 | 2 | 3 | 4) : undefined,
		position_id: hasEmployment ? (randomInt(1, 4) as 1 | 2 | 3 | 4) : undefined,
		hire_at: hasEmployment ? hireDate : undefined,
		appointment_at: hasAppointment ? randomDate(new Date(hireYear, 0, 1), new Date()) : undefined,
		discharge_at:
			hasAppointment && Math.random() > 0.7
				? randomDate(new Date(hireYear + 1, 0, 1), new Date())
				: undefined,
		discharge_reason:
			hasAppointment && Math.random() > 0.7 ? '解任理由のサンプルテキスト' : undefined,
		leave_at: hasLeave ? randomDate(new Date(hireYear + 1, 0, 1), new Date()) : undefined,
		leave_reason: hasLeave ? '退職理由のサンプルテキスト' : undefined,
		death_at: hasDeath ? randomDate(new Date(hireYear + 1, 0, 1), new Date()) : undefined,
		death_reason: hasDeath ? '死亡理由のサンプルテキスト' : undefined,
		note: Math.random() > 0.6 ? `備考欄のサンプルテキスト ${id}` : undefined,
		isActive: Math.random() > 0.2
	};

	return employee;
}

export const employeeData: Employee[] = Array.from({ length: 30 }, (_, i) =>
	generateEmployee(i + 1)
);
