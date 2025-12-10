<script lang="ts">
	import type { PageProps } from './$types';
	import { nationalityData } from '../../data/employeeData';
	import defaultAvatar from '$lib/assets/images/avatar.png';

	let { data }: PageProps = $props();

	const employee = $derived(data.employee);
	const nationality = $derived(
		nationalityData.find((n) => n.id === employee.nationality)?.label || '不明'
	);
	const gender = $derived(employee.gender === 1 ? '男性' : '女性');
	const bloodTypeLabels = { 1: 'A型', 2: 'B型', 3: 'AB型', 4: 'O型' } as const;
	const bloodType = $derived(bloodTypeLabels[employee.bloodType]);
</script>

<div class="employee-detail">
	<div class="detail-header">
		<a href="/employees" class="back-link">← 一覧に戻る</a>
		<h1>従業員詳細</h1>
	</div>

	<div class="detail-content">
		<div class="detail-image">
			<img src={employee.image || defaultAvatar} alt="従業員画像" />
		</div>

		<div class="detail-info">
			<div class="info-section">
				<h2>基本情報</h2>
				<div class="info-grid">
					<div class="info-item">
						<div class="info-label">従業員コード</div>
						<p>{employee.code}</p>
					</div>
					<div class="info-item">
						<div class="info-label">氏名</div>
						<p>{employee.lastName} {employee.firstName} {employee.middleName || ''}</p>
					</div>
					<div class="info-item">
						<div class="info-label">氏名（カナ）</div>
						<p>
							{employee.lastNameKana || ''}
							{employee.firstNameKana || ''}
							{employee.middleNameKana || ''}
						</p>
					</div>
					<div class="info-item">
						<div class="info-label">生年月日</div>
						<p>{employee.dateOfBirth}</p>
					</div>
					<div class="info-item">
						<div class="info-label">国籍</div>
						<p>{nationality}</p>
					</div>
					<div class="info-item">
						<div class="info-label">性別</div>
						<p>{gender}</p>
					</div>
					<div class="info-item">
						<div class="info-label">血液型</div>
						<p>{bloodType}</p>
					</div>
					<div class="info-item">
						<div class="info-label">ステータス</div>
						<p class={employee.isActive ? 'status-active' : 'status-inactive'}>
							{employee.isActive ? '在職中' : '退職'}
						</p>
					</div>
				</div>
			</div>

			<div class="info-section">
				<h2>連絡先情報</h2>
				<div class="info-grid">
					<div class="info-item">
						<div class="info-label">電話番号</div>
						<p>{employee.phone || '未登録'}</p>
					</div>
					<div class="info-item">
						<div class="info-label">メールアドレス</div>
						<p>{employee.email || '未登録'}</p>
					</div>
					<div class="info-item">
						<div class="info-label">郵便番号</div>
						<p>{employee.postalCode || '未登録'}</p>
					</div>
					<div class="info-item full-width">
						<div class="info-label">住所</div>
						<p>{employee.address || '未登録'}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.employee-detail {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--spacing-md);
	}

	.detail-header {
		margin-bottom: var(--spacing-lg);
	}

	.back-link {
		display: inline-block;
		margin-bottom: var(--spacing-sm);
		color: var(--color-primary);
		text-decoration: none;
		&:hover {
			text-decoration: underline;
		}
	}

	.detail-content {
		display: grid;
		grid-template-columns: 200px 1fr;
		gap: var(--spacing-lg);
	}

	.detail-image img {
		width: 100%;
		aspect-ratio: 1/1;
		object-fit: cover;
		border-radius: var(--radius);
		border: 1px solid var(--color-border);
	}

	.detail-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.info-section h2 {
		font-size: var(--font-size-lg);
		margin-bottom: var(--spacing-md);
		padding-bottom: var(--spacing-sm);
		border-bottom: 2px solid var(--color-border);
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--spacing-md);
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.info-item.full-width {
		grid-column: 1 / -1;
	}

	.info-label {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		font-weight: 500;
	}

	.info-item p {
		font-size: var(--font-size-base);
		color: var(--color-text);
	}

	.status-active {
		color: var(--color-success);
		font-weight: 600;
	}

	.status-inactive {
		color: var(--color-text-muted);
	}
</style>
