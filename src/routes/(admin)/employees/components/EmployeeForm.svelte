<script lang="ts">
	import defaultAvatar from '$lib/assets/images/avatar.png';
	import Input from './input.svelte';
	import { detailData } from '../data/detailsData';
	import Image from './image.svelte';
	import FormStyles from './FormStyles.svelte';
	import type { FieldConfig } from '../data/formData';
	import type { Employee } from '../data/employeeData';

	type Props = {
		mode: 'create' | 'edit';
		employee?: Employee;
		isEditing?: boolean;
		onCancel?: () => void;
		formId?: string;
	};

	let { mode, employee, isEditing = true, onCancel, formId = 'employee-form' }: Props = $props();

	// タブの状態管理
	let activeTabIndex = $state(0);

	// 現在アクティブなタブのデータ
	const activeDetail = $derived(detailData[activeTabIndex]);

	// 画像のsrcをリアクティブな変数で管理
	let employeeImageSrc = $state(defaultAvatar);

	// 従業員データが変更されたときに画像を更新（編集モードのみ）
	$effect(() => {
		if (mode === 'edit' && employee) {
			employeeImageSrc = employee.image || defaultAvatar;
		}
	});

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
		phone_mobile: 'phone_mobile',
		phone_tel: 'phone_tel',
		email: 'email',
		postal_code: 'postal_code',
		address: 'address',
		role_id: 'role_id',
		image_at: 'image_at',
		// 雇用情報
		employment_type_id: 'employment_type_id',
		department_id: 'department_id',
		position_id: 'position_id',
		hire_date: 'hire_at',
		leave_date: 'leave_at',
		leave_reason: 'leave_reason',
		appointment_at: 'appointment_at',
		discharge_at: 'discharge_at',
		discharge_reason: 'discharge_reason',
		// 免許証情報
		license_type_id: 'license_type_id',
		license_number: 'license_number',
		license_expiration_date: 'license_exp_at',
		// その他情報
		death_at: 'death_at',
		death_reason: 'death_reason',
		note: 'note'
	};

	// フィールド名から従業員の値を取得
	function getEmployeeValue(fieldName: string): string | number | undefined {
		if (mode === 'create' || !employee) return undefined;
		const employeeKey = fieldToEmployeeMap[fieldName];
		if (employeeKey) {
			return employee[employeeKey as keyof typeof employee] as string | number | undefined;
		}
		return undefined;
	}

	// 複数登録可能なセクションのエントリ管理
	type EntryMap = Record<string, FieldConfig[][]>;
	let entries: EntryMap = $state({});

	// エントリを初期化（タブが変わったときのみ）
	$effect(() => {
		const detail = detailData[activeTabIndex];
		if (detail && detail.showButtons && !entries[detail.className]) {
			entries[detail.className] = [detail.fields.map((field) => ({ ...field }))];
		}
	});

	// 現在のタブのエントリを取得
	const currentEntries = $derived(entries[activeDetail.className] || []);

	// エントリを追加
	function addEntry(className: string, fields: FieldConfig[]) {
		if (!entries[className]) {
			entries[className] = [];
		}
		entries[className] = [...entries[className], fields.map((field) => ({ ...field }))];
	}

	// エントリを削除
	function removeEntry(className: string, index: number) {
		if (entries[className] && entries[className].length > 1) {
			entries[className] = entries[className].filter((_, i) => i !== index);
		}
	}

	// 編集モードの判定
	// 作成時は常に編集可能
	// 編集時はisEditingがfalseの時に編集可能（isEditing=trueは表示モード）
	const canEdit = $derived(mode === 'create' || !isEditing);
</script>

<FormStyles />
<div class="form-container">
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
		<form id={formId} action="" class="form">
			<div class="detail-container">
				<h3>{activeDetail.title}</h3>
				{#if activeDetail.showButtons}
					<!-- 複数登録可能なセクション -->
					{#each currentEntries as entryFields, entryIndex}
						<div class={['content-area', activeDetail.className, 'entry-item']}>
							{#if activeDetail.className === 'employee-info' && entryIndex === 0}
								<Image bind:employeeImageSrc />
							{/if}
							{#each entryFields as field}
								<Input {field} disabled={!canEdit} value={getEmployeeValue(field.name)} />
							{/each}
							{#if currentEntries.length > 1 && canEdit}
								<button
									type="button"
									class="btn remove-entry"
									onclick={() => removeEntry(activeDetail.className, entryIndex)}
									title="この項目を削除"
								>
									<span data-iconBefore="delete"></span>
								</button>
							{/if}
						</div>
					{/each}
					<div class="button-container">
						<button
							type="button"
							class="btn add"
							disabled={!canEdit}
							onclick={() => addEntry(activeDetail.className, activeDetail.fields)}
							data-iconBefore="add"
						>
							追加
						</button>
					</div>
				{:else}
					<!-- 単一登録のセクション -->
					{#if activeDetail.className === 'employment-info'}
						<!-- 雇用情報セクション: サブセクションごとに表示 -->
						{@const groupedFields = activeDetail.fields.reduce((acc, field) => {
							const section = field.section || 'その他';
							if (!acc[section]) {
								acc[section] = [];
							}
							acc[section].push(field);
							return acc;
						}, {} as Record<string, FieldConfig[]>)}
						{@const sectionClassMap: Record<string, string> = {
							'雇用情報': 'employment',
							'解任情報': 'discharge',
							'退職情報': 'leave',
							'死亡情報': 'death'
						}}
						{#each Object.entries(groupedFields) as [sectionName, fields]}
							<div class="sub-section">
								<h4 class="sub-section-title">{sectionName}</h4>
								<div
									class={[
										'content-area',
										activeDetail.className,
										`sub-section-${sectionClassMap[sectionName] || 'other'}`
									]}
								>
									{#each fields as field}
										<Input {field} disabled={!canEdit} value={getEmployeeValue(field.name)} />
									{/each}
								</div>
							</div>
						{/each}
					{:else}
						<div class={['content-area', activeDetail.className]}>
							{#if activeDetail.className === 'employee-info'}
								<Image bind:employeeImageSrc />
							{/if}
							{#each activeDetail.fields as field}
								<Input {field} disabled={!canEdit} value={getEmployeeValue(field.name)} />
							{/each}
						</div>
					{/if}
				{/if}
			</div>
		</form>
	</div>
</div>

<style>
	/* ページ固有のスタイルがあればここに追加 */
</style>
