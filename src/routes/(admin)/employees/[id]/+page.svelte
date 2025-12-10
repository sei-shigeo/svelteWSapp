<script lang="ts">
	import type { PageProps } from './$types';
	import { nationalityData } from '../data/employeeData';
	import defaultAvatar from '$lib/assets/images/avatar.png';
	import Input from '../components/input.svelte';
	import { detailData } from '../data/detailsData';
	import Image from '../components/image.svelte';

	let { data }: PageProps = $props();

	const employee = $derived(data.employee);

	// タブの状態管理
	let activeTabIndex = $state(0);

	// フィールド名から従業員データへのマッピング
	const fieldToEmployeeMap: Record<string, string> = {
		// 従業員情報
		employee_id: 'code',
		nationality_id: 'nationality',
		gender_id: 'gender',
		blood_type_id: 'bloodType',
		date_of_birth: 'dateOfBirth',
		first_name: 'firstName',
		middle_name: 'middleName',
		last_name: 'lastName',
		first_name_kana: 'firstNameKana',
		middle_name_kana: 'middleNameKana',
		last_name_kana: 'lastNameKana',
		phone: 'phone',
		email: 'email',
		postal_code: 'postalCode',
		address: 'address'
	};

	// フィールド名から従業員の値を取得
	function getEmployeeValue(fieldName: string): string | number | undefined {
		const employeeKey = fieldToEmployeeMap[fieldName];
		if (employeeKey && employee) {
			return employee[employeeKey as keyof typeof employee] as string | number | undefined;
		}
		return undefined;
	}

	// 現在アクティブなタブのデータ
	const activeDetail = $derived(detailData[activeTabIndex]);

	let isEditing = $state(true);
</script>

<div class="edit-container">
	<div class="header">
		<h1>従業員詳細</h1>
		<div class="button-group">
			<a href={`/employees/print/${employee.id}`} class="btn">印刷</a>
			<button class="btn" onclick={() => (isEditing = !isEditing)}>{isEditing ? '編集' : '保存'}</button>
			<button class="btn">削除</button>
		</div>
	</div>

	<div class="content">
		<div class="tab-container">
			{#each detailData as detail, index}
				<button
					class="tab-btn"
					class:active={activeTabIndex === index}
					onclick={() => (activeTabIndex = index)}
				>
					{detail.title}
				</button>
			{/each}
		</div>
		<form action="" class="form">
			<div class="detail-container">
				<h3>{activeDetail.title}</h3>
				<div class={['content-area', activeDetail.className]}>
					{#if activeDetail.className === 'employee-info'}
						<Image employeeImageSrc={employee.image || defaultAvatar} />
					{/if}
					{#each activeDetail.fields as field}
						<Input {field} disabled={isEditing} value={getEmployeeValue(field.name)} />
					{/each}
				</div>
			</div>
		</form>
	</div>
</div>

<style>
	.edit-container {
		display: grid;
		grid-template-rows: 57px 1fr;
		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 2rem;
			border-bottom: 1px solid var(--color-border);
			padding: var(--spacing-sm);
			font-size: 0.8em;
			font-weight: 600;
			color: var(--color-text-muted);
			& .button-group {
				display: flex;
				gap: 1rem;
			}
		}
		& .content {
			display: grid;
			grid-template-rows: 40px 1fr;
			gap: var(--spacing-md);
			padding: var(--spacing-md);
			& .tab-container {
				display: flex;
				gap: var(--spacing-sm);
				flex-wrap: wrap;
			}
		}
		& .tab-btn {
			padding: var(--spacing-xs) var(--spacing-sm);
			border: 1px solid var(--color-border);
			border-radius: var(--radius);
			background-color: var(--color-bg);
			color: var(--color-text-muted);
			font-size: 0.8em;
			cursor: pointer;
			transition: all 0.2s ease;
			&:hover {
				background-color: var(--color-bg-muted);
			}
			&.active {
				background-color: var(--color-primary);
				color: var(--color-white);
				border-color: var(--color-primary);
			}
		}
		& .form {
			display: grid;
			flex-direction: column;
			gap: var(--spacing-sm);
		}
		& .detail-container {
			background-color: var(--color-bg-muted);
			border-radius: var(--radius);
			padding: var(--spacing-md);
		}
		& .content-area {
			display: grid;
			gap: var(--spacing-sm);
		}
		& .employee-info {
			grid-template-areas:
				'img code nationality  .'
				'img gender blood_type date_of_birth'
				'img f_name m_name l_name'
				'img fk_name mk_name lk_name'
				'img phone email email'
				'img p_code address address';
				grid-template-columns: 200px 1fr 1fr 1fr;

			/* :global() で子コンポーネントのクラスをターゲット */
			& :global(.image-container) {
				position: relative;
				width: 100%;
			}
			& :global(.employee-image) {
				width: 100%;
				border: 1px solid var(--color-border);
			}
		}
		& :global(input:disabled),
		& :global(select:disabled) {
			background-color: var(--color-white);
			-webkit-text-fill-color: var(--color-text-muted);
			opacity: 1;
		}

		/* 緊急連絡先 Grid Areas */
		& .emergency-contact {
			grid-template-areas:
				'relationship name phone .'
				'email email address address';
			grid-template-columns: 1fr 1fr 1fr 1fr;
		}
		/* 雇用情報 Grid Areas */
		& .employment-info {
			grid-template-areas:
				'type department position'
				'hire_date leave_date .';
		}

		/* 免許証情報 Grid Areas */
		& .license-info {
			grid-template-areas:
				'number number exp_date exp_date'
				'f_img f_img b_img b_img';
		}

		/* 資格証書情報 Grid Areas */
		& .qualification-info {
			grid-template-areas:
				'type number exp_date .'
				'f_img f_img b_img b_img'
				'add add remove remove';
		}

		/* 保険情報 Grid Areas */
		& .insurance-info {
			grid-template-areas:
				'type number exp_date .'
				'f_img f_img b_img b_img'
				'add add remove remove';
		}

		/* 職歴情報 Grid Areas */
		& .job-history-info {
			grid-template-areas:
				'name content sAt eAt'
				'add add remove remove';
		}

		/* 学歴情報 Grid Areas */
		& .education-info {
			grid-template-areas:
				'type name sAt eAt'
				'add add remove remove';
		}
	}
</style>
