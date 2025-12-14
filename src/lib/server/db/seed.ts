import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
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
	role,
	employee
} from './schema';

// 環境変数からDATABASE_URLを取得
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	throw new Error('DATABASE_URL環境変数が設定されていません');
}

// シード用のDB接続を作成
const client = postgres(DATABASE_URL);
const db = drizzle(client, { schema });

// ============================================
// マスタデータ定義
// ============================================

const nationalityData = [
	{ id: 1, label: '日本' },
	{ id: 2, label: 'ブラジル' },
	{ id: 3, label: 'ペルー' }
] as const;

const employeeClassificationData = [
	{ id: 1, label: '正社員' },
	{ id: 2, label: '非正社員' },
	{ id: 3, label: '契約社員' },
	{ id: 4, label: 'その他' }
] as const;

const departmentData = [
	{ id: 1, label: '総務部' },
	{ id: 2, label: '人事部' },
	{ id: 3, label: '経理部' },
	{ id: 4, label: 'その他' }
] as const;

const positionData = [
	{ id: 1, label: '社長' },
	{ id: 2, label: '部長' },
	{ id: 3, label: '課長' },
	{ id: 4, label: 'その他' }
] as const;

const educationTypeData = [
	{ id: 1, type: '中学校' },
	{ id: 2, type: '高校' },
	{ id: 3, type: '大学' },
	{ id: 4, type: '専門学校' },
	{ id: 5, type: 'その他' }
] as const;

const suitabilityAssessmentTypeData = [
	{ id: 1, type: '初任診断' },
	{ id: 2, type: '一般診断' },
	{ id: 3, type: '適齢診断' },
	{ id: 4, type: '特別診断' },
	{ id: 5, type: '特定診断' }
] as const;

const specialEducationTypeData = [
	{ id: 1, type: '特別教育1' },
	{ id: 2, type: '特別教育2' },
	{ id: 3, type: '特別教育3' }
] as const;

const healthCheckupTypeData = [
	{ id: 1, type: '定期健康診断' },
	{ id: 2, type: '特定健康診断' },
	{ id: 3, type: 'その他' }
] as const;

const ownerTypeData = [
	{ id: 1, label: '自社' },
	{ id: 2, label: '取引先' },
	{ id: 3, label: '従業員' }
] as const;

const bankAccountTypeData = [
	{ id: 1, label: '普通' },
	{ id: 2, label: '当座' },
	{ id: 3, label: '貯金' },
	{ id: 4, label: 'その他' }
] as const;

const licenseTypeData = [
	{ id: 1, type: '中型' },
	{ id: 2, type: '大型' },
	{ id: 3, type: '牽引' }
] as const;

const roleData = [
	{ id: 1, type: '管理者' },
	{ id: 2, type: '一般' }
] as const;

// ============================================
// データ生成用のヘルパー関数
// ============================================

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

// ============================================
// 名前データ
// ============================================

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

// ============================================
// 従業員データ生成関数
// ============================================

type EmployeeSeedData = {
	code: string;
	image?: string;
	image_at?: string;
	nationality_id: number;
	gender?: number;
	blood_type?: number;
	date_of_birth: string;
	first_name: string;
	middle_name?: string;
	last_name: string;
	first_name_kana?: string;
	middle_name_kana?: string;
	last_name_kana?: string;
	phone_mobile?: string;
	phone_tel?: string;
	email?: string;
	postal_code?: string;
	address?: string;
	password?: string;
	role_id?: number;
	license_type_id?: number;
	license_number?: string;
	license_exp_at?: string;
	license_f_img?: string;
	license_b_img?: string;
	pdf_url_driver?: string;
	employment_type_id?: number;
	department_id?: number;
	position_id?: number;
	hire_at?: string;
	appointment_at?: string;
	discharge_at?: string;
	discharge_reason?: string;
	leave_at?: string;
	leave_reason?: string;
	death_at?: string;
	death_reason?: string;
	note?: string;
	is_active: boolean;
};

function generateEmployee(id: number): EmployeeSeedData {
	const nationalityId = randomInt(1, 3);
	const gender = randomInt(1, 2);
	const bloodType = randomInt(1, 4);

	let firstName: string;
	let lastName: string;
	let middleName: string | undefined;
	let firstNameKana: string | undefined;
	let middleNameKana: string | undefined;
	let lastNameKana: string | undefined;

	if (nationalityId === 1) {
		// 日本
		firstName = japaneseFirstNames[randomInt(0, japaneseFirstNames.length - 1)];
		lastName = japaneseLastNames[randomInt(0, japaneseLastNames.length - 1)];
		firstNameKana = japaneseFirstNamesKana[randomInt(0, japaneseFirstNamesKana.length - 1)];
		lastNameKana = japaneseLastNamesKana[randomInt(0, japaneseLastNamesKana.length - 1)];
	} else if (nationalityId === 2) {
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

	return {
		code: String(randomInt(1000000000, 9999999999)),
		image: Math.random() > 0.3 ? `https://picsum.photos/150/150?random=${id}` : undefined,
		image_at: Math.random() > 0.5 ? randomDate(new Date(2020, 0, 1), new Date()) : undefined,
		nationality_id: nationalityId,
		gender,
		blood_type: bloodType,
		date_of_birth: dateOfBirth,
		first_name: firstName,
		last_name: lastName,
		middle_name: middleName,
		first_name_kana: firstNameKana,
		middle_name_kana: middleNameKana,
		last_name_kana: lastNameKana,
		phone_mobile: Math.random() > 0.3 ? randomPhone() : undefined,
		phone_tel: Math.random() > 0.5 ? randomPhone() : undefined,
		email: randomEmail(firstName, lastName, id),
		postal_code: Math.random() > 0.2 ? randomPostalCode() : undefined,
		address: addresses[randomInt(0, addresses.length - 1)],
		password: Math.random() > 0.5 ? `password${id}` : undefined,
		role_id: hasRole ? randomInt(1, 2) : undefined,
		license_type_id: hasLicense ? randomInt(1, 3) : undefined,
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
		employment_type_id: hasEmployment ? randomInt(1, 4) : undefined,
		department_id: hasEmployment ? randomInt(1, 4) : undefined,
		position_id: hasEmployment ? randomInt(1, 4) : undefined,
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
		is_active: Math.random() > 0.2
	};
}

// ============================================
// シード関数
// ============================================

/**
 * データベースにシードデータを挿入するスクリプト
 * マスタデータ → 従業員データ（30人分）の順で挿入
 */
async function seed() {
	console.log('🌱 シードデータの挿入を開始します...\n');

	try {
		// ============================================
		// 1. マスタデータの挿入
		// ============================================
		console.log('📋 マスタデータを挿入中...');

		await db.insert(nationality).values(
			nationalityData.map((item) => ({
				id: item.id,
				label: item.label
			}))
		);
		console.log(`  ✓ 国籍データ: ${nationalityData.length}件`);

		await db.insert(employeeClassification).values(
			employeeClassificationData.map((item) => ({
				id: item.id,
				label: item.label
			}))
		);
		console.log(`  ✓ 社員区分データ: ${employeeClassificationData.length}件`);

		await db.insert(department).values(
			departmentData.map((item) => ({
				id: item.id,
				label: item.label
			}))
		);
		console.log(`  ✓ 部門データ: ${departmentData.length}件`);

		await db.insert(position).values(
			positionData.map((item) => ({
				id: item.id,
				label: item.label
			}))
		);
		console.log(`  ✓ 役職データ: ${positionData.length}件`);

		await db.insert(educationType).values(
			educationTypeData.map((item) => ({
				id: item.id,
				type: item.type
			}))
		);
		console.log(`  ✓ 学歴タイプデータ: ${educationTypeData.length}件`);

		await db.insert(suitabilityAssessmentType).values(
			suitabilityAssessmentTypeData.map((item) => ({
				id: item.id,
				type: item.type
			}))
		);
		console.log(`  ✓ 適性診断タイプデータ: ${suitabilityAssessmentTypeData.length}件`);

		await db.insert(specialEducationType).values(
			specialEducationTypeData.map((item) => ({
				id: item.id,
				type: item.type
			}))
		);
		console.log(`  ✓ 特別教育タイプデータ: ${specialEducationTypeData.length}件`);

		await db.insert(healthCheckupType).values(
			healthCheckupTypeData.map((item) => ({
				id: item.id,
				type: item.type
			}))
		);
		console.log(`  ✓ 健康診断タイプデータ: ${healthCheckupTypeData.length}件`);

		await db.insert(ownerType).values(
			ownerTypeData.map((item) => ({
				id: item.id,
				label: item.label
			}))
		);
		console.log(`  ✓ 所有者タイプデータ: ${ownerTypeData.length}件`);

		await db.insert(bankAccountType).values(
			bankAccountTypeData.map((item) => ({
				id: item.id,
				label: item.label
			}))
		);
		console.log(`  ✓ 口座種別データ: ${bankAccountTypeData.length}件`);

		await db.insert(licenseType).values(
			licenseTypeData.map((item) => ({
				id: item.id,
				type: item.type
			}))
		);
		console.log(`  ✓ 運転免許証タイプデータ: ${licenseTypeData.length}件`);

		await db.insert(role).values(
			roleData.map((item) => ({
				id: item.id,
				type: item.type
			}))
		);
		console.log(`  ✓ ロールデータ: ${roleData.length}件\n`);

		// ============================================
		// 2. 従業員データの挿入（30人分）
		// ============================================
		console.log('👥 従業員データを生成・挿入中...');

		const employeeData = Array.from({ length: 30 }, (_, i) => generateEmployee(i + 1));

		const insertedEmployees = await db.insert(employee).values(employeeData).returning();

		console.log(`  ✓ 従業員データ: ${insertedEmployees.length}件\n`);

		console.log('✅ シードデータの挿入が完了しました！');
		console.log(`\n📊 挿入されたデータ:`);
		console.log(`   - マスタデータ: 12種類`);
		console.log(`   - 従業員データ: ${insertedEmployees.length}件`);
	} catch (error) {
		console.error('❌ エラーが発生しました:', error);
		throw error;
	}
}

// スクリプトが直接実行された場合のみ実行
seed()
	.then(async () => {
		console.log('\n🎉 完了しました！');
		await client.end();
		process.exit(0);
	})
	.catch(async (error) => {
		console.error('\n💥 エラー:', error);
		await client.end();
		process.exit(1);
	});

export { seed };
