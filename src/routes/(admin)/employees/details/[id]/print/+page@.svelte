<script lang="ts">
	import type { PageProps } from './$types';
	import type { Nationality } from '../../../types';
	import { onMount } from 'svelte';

	// 型定義
	type PageDefinition = {
		id: string;
		label: string;
		description: string;
		title?: string; // ページの見出し（プレビューで表示）
		sections: string[];
	};

	type Template = {
		id: string;
		label: string;
		description: string;
		pages: PageDefinition[];
	};

	type SectionField = {
		key: string;
		label: string;
	};

	type EmployeeListItem = {
		id: number;
		code: string;
		lastName: string;
		firstName: string;
	};

	// 定数
	const GENDER_MAP: Record<number, string> = { 1: '男性', 2: '女性' };
	const BLOOD_TYPE_MAP: Record<number, string> = { 1: 'A型', 2: 'B型', 3: 'O型', 4: 'AB型' };
	const MIN_PAGES = 1;

	let nationalityData: Nationality[] = $state([]);

	// マスタデータを取得（クライアントサイドのみ）
	async function loadMasters(): Promise<void> {
		if (typeof window === 'undefined') return;
		try {
			const response = await fetch('/employees/api/masters');
			if (!response.ok) return;

			const masters = await response.json();
			nationalityData = masters.nationalityData || [];
		} catch (error) {
			console.error('Error loading master data:', error);
		}
	}

	import defaultAvatar from '$lib/assets/images/avatar.png';

	let { data }: PageProps = $props();

	// 従業員一覧を取得
	let employeesList = $state<EmployeeListItem[]>([]);
	// 従業員選択状態
	let selectedEmployeeId = $state<number>(0);

	// 従業員データを取得
	async function loadEmployees(): Promise<void> {
		if (typeof window === 'undefined') return;
		try {
			const response = await fetch('/employees/api');
			if (!response.ok) return;

			const employees = await response.json();
			employeesList = employees.map((emp: EmployeeListItem) => ({
				id: emp.id,
				code: emp.code,
				lastName: emp.lastName,
				firstName: emp.firstName
			}));
		} catch (error) {
			console.error('Error loading employees:', error);
		}
	}

	// 選択された従業員の詳細データ
	let employee = $state<typeof data.employee>({} as typeof data.employee);

	onMount(() => {
		// 初期値を設定
		selectedEmployeeId = data.employee.id;
		employee = data.employee;
		// データを読み込む
		loadMasters();
		loadEmployees();
	});

	const currentEmployeeId = $derived(data.employee.id);
	$effect(() => {
		if (selectedEmployeeId > 0 && selectedEmployeeId !== currentEmployeeId) {
			loadEmployeeDetails(selectedEmployeeId);
		}
	});

	async function loadEmployeeDetails(employeeId: number): Promise<void> {
		if (typeof window === 'undefined') return;
		try {
			const response = await fetch(`/employees/api/${employeeId}`);
			if (!response.ok) return;

			employee = await response.json();
		} catch (error) {
			console.error('Error loading employee details:', error);
		}
	}

	// セクション名のマッピング
	const sectionLabels: Record<string, string> = {
		basicInfo: '基本情報',
		contactInfo: '連絡先情報',
		emergencyContact: '緊急連絡先',
		employmentInfo: '雇用情報',
		licenseInfo: '免許証情報',
		qualificationInfo: '資格証書情報',
		insuranceInfo: '保険情報',
		jobHistory: '職歴情報',
		educationInfo: '学歴情報',
		driverLedgerHeader: '運転者台帳ヘッダー',
		driverLedgerInfo: '運転者台帳情報'
	};

	// セクションごとのフィールド定義
	const sectionFields: Record<string, SectionField[]> = {
		basicInfo: [
			{ key: 'furigana', label: 'フリガナ' },
			{ key: 'name', label: '氏名' },
			{ key: 'gender', label: '性別' },
			{ key: 'dateOfBirth', label: '生年月日' },
			{ key: 'address', label: '現住所' },
			{ key: 'phone_tel', label: '電話番号' },
			{ key: 'phone_mobile', label: '携帯番号' }
		],
		contactInfo: [
			{ key: 'phone', label: '電話番号' },
			{ key: 'email', label: 'Email' },
			{ key: 'postal_code', label: '郵便番号' },
			{ key: 'address', label: '住所' }
		],
		employmentInfo: [
			{ key: 'hire_at', label: '雇入年月日' },
			{ key: 'department', label: '部門名' },
			{ key: 'employee_type', label: '社員区分' },
			{ key: 'job_type', label: '業務の種類' },
			{ key: 'appointment_at', label: '選任年月日' }
		]
	};

	// セクションの展開状態（フィールド設定用）
	let expandedSectionFields = $state<Record<string, boolean>>({});

	// 固定テンプレートの定義
	const templates: Record<string, Template> = {
		custom: {
			id: 'custom',
			label: 'カスタム',
			description: '自由にページを構成',
			pages: [
				{
					id: 'page1',
					label: '1ページ目',
					description: '基本情報・連絡先',
					title: '1ページ目',
					sections: ['basicInfo', 'contactInfo']
				}
			]
		},
		driverLedger: {
			id: 'driverLedger',
			label: '運転手台帳用(労働者台帳)',
			description: '運送業の運転者台帳に必要な全項目を含む形式',
			pages: [
				{
					id: 'driverLedgerPage1',
					label: '運転者台帳',
					description: '運転者台帳必須項目',
					title: '運転者台帳',
					sections: [
						'driverLedgerHeader',
						'basicInfo',
						'contactInfo',
						'employmentInfo',
						'licenseInfo',
						'driverLedgerInfo'
					]
				}
			]
		}
	};

	// 現在選択されているテンプレート
	let selectedTemplate = $state<string>('driverLedger');

	// ページ構成の定義（動的に変更可能）
	let pageDefinitions = $state<PageDefinition[]>([
		{
			id: 'driverLedgerPage1',
			label: '運転者台帳',
			description: '運転者台帳必須項目',
			title: '運転者台帳',
			sections: [
				'driverLedgerHeader',
				'basicInfo',
				'contactInfo',
				'employmentInfo',
				'licenseInfo',
				'driverLedgerInfo'
			]
		}
	]);

	// 初期化フラグ
	let initialized = $state(false);

	// 初期化時にテンプレートを適用（初回のみ）
	$effect(() => {
		if (!initialized && pageDefinitions.length > 0 && selectedTemplate === 'driverLedger') {
			applyTemplate('driverLedger');
			initialized = true;
		}
	});

	// テンプレートを適用
	function applyTemplate(templateId: string): void {
		selectedTemplate = templateId;
		const template = templates[templateId];
		if (!template) return;

		pageDefinitions = JSON.parse(JSON.stringify(template.pages));
		// すべてのセクションを有効化
		pageDefinitions.forEach((page) => {
			page.sections.forEach((sectionId) => {
				setSectionState(page.id, sectionId, true);
			});
			setSelectedState(page.id, true);
		});
	}

	// モーダルの表示状態
	let showAddSectionModal = $state<{ pageId: string } | null>(null);
	let showAddPageModal = $state(false);

	// ページの展開状態
	let expandedPages = $state<Record<string, boolean>>({});

	// ページの選択状態
	let selectedPages = $state<Record<string, boolean>>({
		driverLedgerPage1: true
	});

	// ページ状態管理関数
	function getExpandedState(pageId: string): boolean {
		return expandedPages[pageId] ?? false;
	}

	function setExpandedState(pageId: string, value: boolean): void {
		expandedPages[pageId] = value;
	}

	function getSelectedState(pageId: string): boolean {
		return selectedPages[pageId] ?? false;
	}

	function setSelectedState(pageId: string, value: boolean): void {
		selectedPages[pageId] = value;
	}

	// 印刷するセクションの選択状態（ページごとに管理）
	let sections = $state<Record<string, Record<string, boolean>>>({});

	// セクション状態管理関数
	function getSectionState(pageId: string, sectionId: string): boolean {
		return sections[pageId]?.[sectionId] ?? true;
	}

	function setSectionState(pageId: string, sectionId: string, value: boolean): void {
		if (!sections[pageId]) {
			sections[pageId] = {};
		}
		sections[pageId][sectionId] = value;
	}

	// フィールド単位の表示制御
	let fieldVisibility = $state<Record<string, boolean>>({
		// 基本情報
		'basicInfo.furigana': true,
		'basicInfo.name': true,
		'basicInfo.gender': true,
		'basicInfo.dateOfBirth': true,
		'basicInfo.address': true,
		'basicInfo.phone_tel': true,
		'basicInfo.phone_mobile': true,
		// 連絡先情報
		'contactInfo.phone': true,
		'contactInfo.email': true,
		'contactInfo.postal_code': true,
		'contactInfo.address': true,
		// 雇用情報
		'employmentInfo.hire_at': true,
		'employmentInfo.department': true,
		'employmentInfo.employee_type': true,
		'employmentInfo.job_type': true,
		'employmentInfo.appointment_at': true
	});

	// ページ選択を切り替え
	function togglePage(pageId: string, checked: boolean): void {
		setSelectedState(pageId, checked);
		const page = pageDefinitions.find((p) => p.id === pageId);
		if (page) {
			page.sections.forEach((sectionId) => {
				setSectionState(pageId, sectionId, checked);
			});
		}
	}

	// 全ページ選択/解除
	function toggleAllPages(checked: boolean): void {
		pageDefinitions.forEach((page) => {
			togglePage(page.id, checked);
		});
	}

	// 新しいページを追加
	function addNewPage(): void {
		const pageNumber = pageDefinitions.length + 1;
		const newPageId = `page${pageNumber}`;
		const newPage: PageDefinition = {
			id: newPageId,
			label: `${pageNumber}ページ目`,
			description: '新しいページ',
			title: `${pageNumber}ページ目`,
			sections: []
		};

		pageDefinitions = [...pageDefinitions, newPage];
		setSelectedState(newPageId, true);
		setExpandedState(newPageId, false);
		showAddPageModal = false;
	}

	// ページを削除
	function removePage(pageId: string): void {
		if (pageDefinitions.length <= MIN_PAGES) {
			alert('最後の1ページは削除できません');
			return;
		}

		const page = pageDefinitions.find((p) => p.id === pageId);
		if (page) {
			page.sections.forEach((sectionId) => {
				setSectionState(pageId, sectionId, false);
			});
		}

		pageDefinitions = pageDefinitions.filter((p) => p.id !== pageId);
		delete selectedPages[pageId];
		delete expandedPages[pageId];
	}

	// セクション選択時にページ状態を更新（ページ全体の選択/解除時に使用）
	function updatePageState(pageId: string): void {
		const page = pageDefinitions.find((p) => p.id === pageId);
		if (!page) return;

		const allSelected = page.sections.every((sectionId) => getSectionState(pageId, sectionId));
		setSelectedState(pageId, allSelected);
	}

	// セクション変更時のハンドラー（個別セクションの表示/非表示のみ制御）
	function handleSectionChange(sectionId: string): void {
		// セクションの表示/非表示は個別に制御されるため、
		// ページの選択状態は変更しない（ページは表示され続ける）
	}

	// ページにセクションを追加
	function addSectionToPage(pageId: string, sectionId: string): void {
		const page = pageDefinitions.find((p) => p.id === pageId);
		if (!page || page.sections.includes(sectionId)) {
			showAddSectionModal = null;
			return;
		}

		page.sections = [...page.sections, sectionId];
		setSectionState(pageId, sectionId, true);
		updatePageState(pageId);
		showAddSectionModal = null;
	}

	// ページからセクションを削除
	function removeSectionFromPage(pageId: string, sectionId: string): void {
		const page = pageDefinitions.find((p) => p.id === pageId);
		if (!page) return;

		page.sections = page.sections.filter((id) => id !== sectionId);
		setSectionState(pageId, sectionId, false);
		updatePageState(pageId);
	}

	// ページに追加可能なセクションを取得
	function getAvailableSections(pageId: string): string[] {
		const page = pageDefinitions.find((p) => p.id === pageId);
		if (!page) return [];

		const allSections = Object.keys(sectionLabels);
		return allSections.filter((sectionId) => !page.sections.includes(sectionId));
	}

	// ページが表示されるかどうか
	function isPageVisible(pageId: string): boolean {
		return getSelectedState(pageId);
	}

	// 国籍ラベルを取得
	function getNationalityLabel(id: number): string {
		const nationality = nationalityData.find((n) => n.id === id);
		return nationality?.label || '-';
	}

	// 性別ラベルを取得
	function getGenderLabel(id: number | null): string {
		if (id === null) return '-';
		return GENDER_MAP[id] || '-';
	}

	// 血液型ラベルを取得
	function getBloodTypeLabel(id: number): string {
		return BLOOD_TYPE_MAP[id] || '-';
	}

	// 日付フォーマット
	function formatDate(date: string | null | undefined): string {
		if (!date) return '-';
		return new Date(date).toLocaleDateString('ja-JP');
	}

	// フルネームを取得
	function getFullName(): string {
		const parts = [employee.lastName, employee.middleName, employee.firstName].filter(Boolean);
		return parts.join(' ') || '-';
	}

	// フルネーム（カナ）を取得
	function getFullNameKana(): string {
		const parts = [employee.lastNameKana, employee.middleNameKana, employee.firstNameKana].filter(
			Boolean
		);
		return parts.join(' ') || '-';
	}

	// 印刷を実行
	function handlePrint() {
		window.print();
	}
</script>

<svelte:head>
	<title>従業員情報印刷 - {getFullName()}</title>
</svelte:head>

<div class="print-page">
	<!-- 印刷ボタンエリア（印刷時は非表示） -->
	<div class="no-print action-bar">
		<!-- 従業員選択 -->
		<div class="employee-selector">
			<label for="employee-select" class="employee-select-label">従業員を選択</label>
			<select
				id="employee-select"
				class="employee-select"
				bind:value={selectedEmployeeId}
				onchange={(e) => {
					const newId = Number(e.currentTarget.value);
					if (newId && newId !== selectedEmployeeId) {
						selectedEmployeeId = newId;
						loadEmployeeDetails(newId);
					}
				}}
			>
				{#if employeesList.length === 0}
					<option value={selectedEmployeeId}>
						{employee.code} - {employee.lastName}
						{employee.firstName}
					</option>
				{:else}
					{#each employeesList as emp}
						<option value={emp.id}>
							{emp.code} - {emp.lastName}
							{emp.firstName}
						</option>
					{/each}
				{/if}
			</select>
		</div>

		<div class="action-buttons">
			<button class="print-btn" onclick={handlePrint}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="6 9 6 2 18 2 18 9"></polyline>
					<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"
					></path>
					<rect x="6" y="14" width="12" height="8"></rect>
				</svg>
				印刷する
			</button>
			<a href={`/employees/details/${employee.id}`} class="back-btn">戻る</a>
		</div>

		<!-- テンプレート選択 -->
		<div class="template-selector">
			<div class="selector-header">
				<h3>テンプレートを選択</h3>
			</div>
			<div class="template-grid">
				{#each Object.values(templates) as template}
					<button
						class="template-btn"
						class:active={selectedTemplate === template.id}
						onclick={() => applyTemplate(template.id)}
						type="button"
					>
						<div class="template-info">
							<span class="template-label">{template.label}</span>
							<span class="template-desc">{template.description}</span>
						</div>
					</button>
				{/each}
			</div>
		</div>

		<!-- ページ選択 -->
		<div class="page-selector">
			<div class="selector-header">
				<h3>印刷ページを選択</h3>
				<div class="checkbox-controls">
					<button class="select-btn" onclick={() => toggleAllPages(true)}>全選択</button>
					<button class="select-btn" onclick={() => toggleAllPages(false)}>全解除</button>
					<button class="select-btn add-page-btn" onclick={() => addNewPage()}>ページを追加</button>
				</div>
			</div>
			<div class="page-grid">
				{#each pageDefinitions as page}
					<div class="page-item" class:selected={getSelectedState(page.id)}>
						<div class="page-header">
							<label class="page-checkbox-label">
								<input
									type="checkbox"
									checked={getSelectedState(page.id)}
									onchange={(e) => togglePage(page.id, e.currentTarget.checked)}
								/>
								<div class="page-info">
									{#if getExpandedState(page.id)}
										<input
											type="text"
											class="page-label-input"
											bind:value={page.label}
											onclick={(e) => e.stopPropagation()}
											placeholder="ページ名"
										/>
										<input
											type="text"
											class="page-title-input"
											bind:value={page.title}
											onclick={(e) => e.stopPropagation()}
											placeholder="ページ見出し（プレビューに表示）"
										/>
									{:else}
										<span class="page-label">{page.label}</span>
									{/if}
								</div>
							</label>
							<div class="page-actions">
								{#if pageDefinitions.length > 1}
									<button
										class="remove-page-btn"
										onclick={() => removePage(page.id)}
										type="button"
										title="このページを削除"
										aria-label="ページを削除"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<line x1="18" y1="6" x2="6" y2="18"></line>
											<line x1="6" y1="6" x2="18" y2="18"></line>
										</svg>
									</button>
								{/if}
								<button
									class="expand-btn"
									onclick={() => setExpandedState(page.id, !getExpandedState(page.id))}
									type="button"
									aria-label={getExpandedState(page.id) ? '折りたたむ' : '展開する'}
									title={getExpandedState(page.id) ? '折りたたむ' : '展開する'}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="14"
										height="14"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										class:rotated={getExpandedState(page.id)}
									>
										<polyline points="6 9 12 15 18 9"></polyline>
									</svg>
								</button>
							</div>
						</div>
						{#if getExpandedState(page.id)}
							<div class="page-sections">
								{#each page.sections as sectionId}
									<div class="section-checkbox-item">
										<div class="section-main-row">
											<label class="section-label">
												<input
													type="checkbox"
													checked={getSectionState(page.id, sectionId)}
													onchange={(e) => {
														setSectionState(page.id, sectionId, e.currentTarget.checked);
														handleSectionChange(sectionId);
													}}
												/>
												<span>{sectionLabels[sectionId] || sectionId}</span>
											</label>
											<div class="section-actions">
												{#if sectionFields[sectionId]}
													<button
														class="expand-field-btn"
														onclick={(e) => {
															e.stopPropagation();
															expandedSectionFields[sectionId] = !expandedSectionFields[sectionId];
														}}
														type="button"
														title="フィールド設定"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="12"
															height="12"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="2"
															stroke-linecap="round"
															stroke-linejoin="round"
															class:rotated={expandedSectionFields[sectionId]}
														>
															<polyline points="6 9 12 15 18 9"></polyline>
														</svg>
													</button>
												{/if}
												<button
													class="remove-section-btn"
													onclick={() => removeSectionFromPage(page.id, sectionId)}
													type="button"
													title="この項目を削除"
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="12"
														height="12"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
													>
														<line x1="18" y1="6" x2="6" y2="18"></line>
														<line x1="6" y1="6" x2="18" y2="18"></line>
													</svg>
												</button>
											</div>
										</div>
										{#if expandedSectionFields[sectionId] && sectionFields[sectionId]}
											<div class="section-fields">
												{#each sectionFields[sectionId] as field}
													<label class="field-checkbox-item">
														<input
															type="checkbox"
															checked={fieldVisibility[`${sectionId}.${field.key}`] ?? true}
															onchange={(e) => {
																fieldVisibility[`${sectionId}.${field.key}`] =
																	e.currentTarget.checked;
															}}
														/>
														<span>{field.label}</span>
														{#if fieldVisibility[`${sectionId}.${field.key}`] ?? true}
															<svg
																class="checkbox-check-icon"
																xmlns="http://www.w3.org/2000/svg"
																width="16"
																height="16"
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																stroke-width="3"
																stroke-linecap="round"
																stroke-linejoin="round"
															>
																<polyline points="20 6 9 17 4 12"></polyline>
															</svg>
														{/if}
													</label>
												{/each}
											</div>
										{/if}
									</div>
								{/each}
								<button
									class="add-section-btn"
									onclick={() => (showAddSectionModal = { pageId: page.id })}
									type="button"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="12"
										height="12"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									>
										<line x1="12" y1="5" x2="12" y2="19"></line>
										<line x1="5" y1="12" x2="19" y2="12"></line>
									</svg>
									項目を追加
								</button>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- 項目追加モーダル -->
		{#if showAddSectionModal}
			<div
				class="modal-overlay"
				onclick={() => (showAddSectionModal = null)}
				onkeydown={(e) => {
					if (e.key === 'Escape') {
						showAddSectionModal = null;
					}
				}}
				role="button"
				tabindex={0}
				aria-label="モーダルを閉じる"
			>
				<div
					class="modal-content"
					onclick={(e) => e.stopPropagation()}
					onkeydown={(e) => e.stopPropagation()}
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-title"
					tabindex={0}
				>
					<div class="modal-header">
						<h3 id="modal-title">項目を追加</h3>
						<button
							class="modal-close-btn"
							onclick={() => (showAddSectionModal = null)}
							type="button"
							aria-label="閉じる"
							title="閉じる"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</button>
					</div>
					<div class="modal-body">
						{#if getAvailableSections(showAddSectionModal.pageId).length === 0}
							<p class="no-sections">追加可能な項目がありません</p>
						{:else}
							<div class="available-sections">
								{#each getAvailableSections(showAddSectionModal.pageId) as sectionId}
									<button
										class="section-option-btn"
										onclick={() => addSectionToPage(showAddSectionModal!.pageId, sectionId)}
										type="button"
									>
										{sectionLabels[sectionId] || sectionId}
									</button>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- 動的ページ表示 -->
	<div class="content-area">
		{#each pageDefinitions as page, pageIndex}
			{#if isPageVisible(page.id)}
				<div class="print-container print-page-section">
					{#if page.title}
						<h1 class="page-title">{page.title}</h1>
					{/if}
					{#each page.sections as sectionId}
						{#if getSectionState(page.id, sectionId)}
							{#if sectionId === 'driverLedgerHeader'}
								<section class="section driver-ledger-header">
									<h2 class="section-title">運転者台帳【労働者名簿】</h2>
									<table class="info-table full-width">
										<tbody>
											<tr>
												<th>作成番号</th>
												<td>{employee.code || '-'}</td>
												<th>作成年月日</th>
												<td>{new Date().toLocaleDateString('ja-JP')}</td>
											</tr>
											<tr>
												<th>事業者の氏名又は名称</th>
												<td colspan="3">株式会社和清商事</td>
											</tr>
										</tbody>
									</table>
								</section>
							{:else if sectionId === 'basicInfo'}
								<section class="section">
									<h2 class="section-title">運転者等の基本情報</h2>
									<div class="basic-info">
										<div class="avatar-container">
											<img src={employee.image || defaultAvatar} alt="運転者写真" class="avatar" />
										</div>
										<table class="info-table">
											<tbody>
												{#if fieldVisibility['basicInfo.furigana'] ?? true}
													<tr>
														<th>フリガナ</th>
														<td>{getFullNameKana()}</td>
														{#if fieldVisibility['basicInfo.name'] ?? true}
															<th>氏名</th>
															<td>{getFullName()}</td>
														{/if}
													</tr>
												{:else if fieldVisibility['basicInfo.name'] ?? true}
													<tr>
														<th>氏名</th>
														<td>{getFullName()}</td>
													</tr>
												{/if}
												{#if (fieldVisibility['basicInfo.gender'] ?? true) || (fieldVisibility['basicInfo.dateOfBirth'] ?? true)}
													<tr>
														{#if fieldVisibility['basicInfo.gender'] ?? true}
															<th>性別</th>
															<td>{getGenderLabel(employee.gender)}</td>
														{/if}
														{#if fieldVisibility['basicInfo.dateOfBirth'] ?? true}
															<th>生年月日</th>
															<td>{formatDate(employee.dateOfBirth)}</td>
														{/if}
													</tr>
												{/if}
												{#if fieldVisibility['basicInfo.address'] ?? true}
													<tr>
														<th>現住所</th>
														<td colspan="3">{employee.address || '-'}</td>
													</tr>
												{/if}
												{#if (fieldVisibility['basicInfo.phone_tel'] ?? true) || (fieldVisibility['basicInfo.phone_mobile'] ?? true)}
													<tr>
														{#if fieldVisibility['basicInfo.phone_tel'] ?? true}
															<th>電話番号</th>
															<td>{employee.phone_tel || '-'}</td>
														{/if}
														{#if fieldVisibility['basicInfo.phone_mobile'] ?? true}
															<th>携帯番号</th>
															<td>{employee.phone_mobile || '-'}</td>
														{/if}
													</tr>
												{/if}
											</tbody>
										</table>
									</div>
								</section>
							{:else if sectionId === 'contactInfo'}
								<section class="section">
									<h2 class="section-title">連絡先情報</h2>
									<table class="info-table full-width">
										<tbody>
											{#if (fieldVisibility['contactInfo.phone'] ?? true) || (fieldVisibility['contactInfo.email'] ?? true)}
												<tr>
													{#if fieldVisibility['contactInfo.phone'] ?? true}
														<th>電話番号</th>
														<td>{employee.phone_mobile || employee.phone_tel || '-'}</td>
													{/if}
													{#if fieldVisibility['contactInfo.email'] ?? true}
														<th>Email</th>
														<td>{employee.email || '-'}</td>
													{/if}
												</tr>
											{/if}
											{#if (fieldVisibility['contactInfo.postal_code'] ?? true) || (fieldVisibility['contactInfo.address'] ?? true)}
												<tr>
													{#if fieldVisibility['contactInfo.postal_code'] ?? true}
														<th>郵便番号</th>
														<td>{employee.postal_code || '-'}</td>
													{/if}
													{#if fieldVisibility['contactInfo.address'] ?? true}
														<th>住所</th>
														<td>{employee.address || '-'}</td>
													{/if}
												</tr>
											{/if}
										</tbody>
									</table>
								</section>
							{:else if sectionId === 'emergencyContact'}
								<section class="section">
									<h2 class="section-title">緊急連絡先</h2>
									<table class="info-table full-width">
										<tbody>
											<tr>
												<th>続柄</th>
												<td>-</td>
												<th>氏名</th>
												<td>-</td>
											</tr>
											<tr>
												<th>電話番号</th>
												<td>-</td>
												<th>メールアドレス</th>
												<td>-</td>
											</tr>
											<tr>
												<th>住所</th>
												<td colspan="3">-</td>
											</tr>
										</tbody>
									</table>
								</section>
							{:else if sectionId === 'employmentInfo'}
								<section class="section">
									<h2 class="section-title">雇用・選任情報</h2>
									<table class="info-table full-width">
										<tbody>
											{#if (fieldVisibility['employmentInfo.hire_at'] ?? true) || (fieldVisibility['employmentInfo.department'] ?? true)}
												<tr>
													{#if fieldVisibility['employmentInfo.hire_at'] ?? true}
														<th>雇入年月日</th>
														<td>{formatDate(employee.hire_at)}</td>
													{/if}
													{#if fieldVisibility['employmentInfo.department'] ?? true}
														<th>部門名</th>
														<td>-</td>
													{/if}
												</tr>
											{/if}
											{#if (fieldVisibility['employmentInfo.employee_type'] ?? true) || (fieldVisibility['employmentInfo.job_type'] ?? true)}
												<tr>
													{#if fieldVisibility['employmentInfo.employee_type'] ?? true}
														<th>社員区分</th>
														<td>-</td>
													{/if}
													{#if fieldVisibility['employmentInfo.job_type'] ?? true}
														<th>業務の種類</th>
														<td>一般貨物自動車運送事業</td>
													{/if}
												</tr>
											{/if}
											{#if fieldVisibility['employmentInfo.appointment_at'] ?? true}
												<tr>
													<th>選任年月日</th>
													<td>{formatDate(employee.appointment_at)}</td>
													<th></th>
													<td></td>
												</tr>
											{/if}
										</tbody>
									</table>
								</section>
							{:else if sectionId === 'licenseInfo'}
								<section class="section">
									<h2 class="section-title">運転免許証</h2>
									<table class="info-table full-width driver-ledger-table">
										<thead>
											<tr>
												<th>免許の種類</th>
												<th>免許証番号</th>
												<th>取得年月日</th>
												<th>有効期限</th>
												<th>免許条件</th>
											</tr>
										</thead>
										<tbody>
											{#if employee.license_number || employee.license_exp_at}
												<tr>
													<td>-</td>
													<td>{employee.license_number || '-'}</td>
													<td>-</td>
													<td>{formatDate(employee.license_exp_at)}</td>
													<td>-</td>
												</tr>
											{/if}
										</tbody>
									</table>
								</section>
							{:else if sectionId === 'driverLedgerInfo'}
								<!-- 資格 -->
								<section class="section">
									<h2 class="section-title">資格</h2>
									<table class="info-table full-width driver-ledger-table">
										<thead>
											<tr>
												<th>資格名</th>
												<th>資格証番号</th>
												<th>取得年月日</th>
												<th>有効期限</th>
											</tr>
										</thead>
										<tbody>
											<!-- データがある場合のみ表示（将来的に実装） -->
										</tbody>
									</table>
								</section>

								<!-- 違反歴 -->
								<section class="section">
									<h2 class="section-title">違反歴</h2>
									<table class="info-table full-width driver-ledger-table">
										<thead>
											<tr>
												<th>違反年月日</th>
												<th>違反場所</th>
												<th>違反内容</th>
											</tr>
										</thead>
										<tbody>
											<!-- データがある場合のみ表示（将来的に実装） -->
										</tbody>
									</table>
								</section>

								<!-- 事故歴 -->
								<section class="section">
									<h2 class="section-title">事故歴</h2>
									<table class="info-table full-width driver-ledger-table">
										<thead>
											<tr>
												<th>事故年月日</th>
												<th>事故場所</th>
												<th>事故内容</th>
											</tr>
										</thead>
										<tbody>
											<!-- データがある場合のみ表示（将来的に実装） -->
										</tbody>
									</table>
								</section>

								<!-- 適性診断 -->
								<section class="section">
									<h2 class="section-title">適性診断</h2>
									<table class="info-table full-width driver-ledger-table">
										<thead>
											<tr>
												<th>実施年月日</th>
												<th>種類</th>
												<th>診断結果の所見摘要</th>
											</tr>
										</thead>
										<tbody>
											<!-- データがある場合のみ表示（将来的に実装） -->
										</tbody>
									</table>
								</section>

								<!-- 特別教育 -->
								<section class="section">
									<h2 class="section-title">特別教育</h2>
									<table class="info-table full-width driver-ledger-table">
										<thead>
											<tr>
												<th>実施年月日</th>
												<th>種類</th>
												<th>指導教育内容</th>
											</tr>
										</thead>
										<tbody>
											<!-- データがある場合のみ表示（将来的に実装） -->
										</tbody>
									</table>
								</section>

								<!-- 健康診断 -->
								<section class="section">
									<h2 class="section-title">健康診断</h2>
									<table class="info-table full-width driver-ledger-table">
										<thead>
											<tr>
												<th>実施年月日</th>
												<th>健康状態</th>
											</tr>
										</thead>
										<tbody>
											<!-- データがある場合のみ表示（将来的に実装） -->
										</tbody>
									</table>
								</section>

								<!-- 解任 -->
								{#if employee.discharge_at || employee.discharge_reason}
									<section class="section">
										<h2 class="section-title">解任</h2>
										<table class="info-table full-width">
											<tbody>
												<tr>
													<th>解任年月日</th>
													<td>{formatDate(employee.discharge_at)}</td>
													<th>解任理由</th>
													<td>{employee.discharge_reason || '-'}</td>
												</tr>
											</tbody>
										</table>
									</section>
								{/if}

								<!-- 履歴 -->
								<section class="section">
									<h2 class="section-title">履歴</h2>
									<table class="info-table full-width driver-ledger-table">
										<thead>
											<tr>
												<th>年月</th>
												<th>内容</th>
											</tr>
										</thead>
										<tbody>
											<!-- データがある場合のみ表示（将来的に実装） -->
										</tbody>
									</table>
								</section>

								<!-- 保険等 -->
								<section class="section">
									<h2 class="section-title">保険等</h2>
									<table class="info-table full-width driver-ledger-table">
										<thead>
											<tr>
												<th>保険種類</th>
												<th>加入年月日</th>
												<th>保険番号</th>
											</tr>
										</thead>
										<tbody>
											<!-- データがある場合のみ表示（将来的に実装） -->
										</tbody>
									</table>
								</section>

								<!-- 退職 -->
								{#if employee.leave_at || employee.leave_reason}
									<section class="section">
										<h2 class="section-title">退職</h2>
										<table class="info-table full-width">
											<tbody>
												<tr>
													<th>退職年月日</th>
													<td>{formatDate(employee.leave_at)}</td>
													<th>退職理由</th>
													<td>{employee.leave_reason || '-'}</td>
												</tr>
											</tbody>
										</table>
									</section>
								{/if}

								<!-- 備考 -->
								{#if employee.note}
									<section class="section">
										<h2 class="section-title">備考</h2>
										<table class="info-table full-width">
											<tbody>
												<tr>
													<td style="height: 80px; vertical-align: top;">{employee.note}</td>
												</tr>
											</tbody>
										</table>
									</section>
								{/if}
							{:else if sectionId === 'qualificationInfo'}
								<section class="section">
									<h2 class="section-title">資格証書情報</h2>
									<table class="info-table full-width">
										<tbody>
											<tr>
												<th>資格種類</th>
												<td>-</td>
												<th>資格番号</th>
												<td>-</td>
											</tr>
											<tr>
												<th>有効期限</th>
												<td>-</td>
												<th></th>
												<td></td>
											</tr>
										</tbody>
									</table>
								</section>
							{:else if sectionId === 'insuranceInfo'}
								<section class="section">
									<h2 class="section-title">保険情報</h2>
									<table class="info-table full-width">
										<tbody>
											<tr>
												<th>保険種類</th>
												<td>-</td>
												<th>保険番号</th>
												<td>-</td>
											</tr>
											<tr>
												<th>有効期限</th>
												<td>-</td>
												<th></th>
												<td></td>
											</tr>
										</tbody>
									</table>
								</section>
							{:else if sectionId === 'jobHistory'}
								<section class="section">
									<h2 class="section-title">職歴情報</h2>
									<table class="info-table full-width">
										<thead>
											<tr>
												<th>会社名</th>
												<th>業務内容</th>
												<th>開始日</th>
												<th>終了日</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>-</td>
												<td>-</td>
												<td>-</td>
												<td>-</td>
											</tr>
										</tbody>
									</table>
								</section>
							{:else if sectionId === 'educationInfo'}
								<section class="section">
									<h2 class="section-title">学歴情報</h2>
									<table class="info-table full-width">
										<thead>
											<tr>
												<th>学校種別</th>
												<th>学校名</th>
												<th>入学日</th>
												<th>卒業日</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>-</td>
												<td>-</td>
												<td>-</td>
												<td>-</td>
											</tr>
										</tbody>
									</table>
								</section>
							{/if}
						{/if}
					{/each}

					<footer class="footer">
						<p>この書類は機密情報を含みます。取り扱いにご注意ください。</p>
						<p class="page-number">{pageIndex + 1} / {pageDefinitions.length}</p>
					</footer>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	/* 基本スタイル */
	.print-page {
		font-family: 'Hiragino Kaku Gothic ProN', 'メイリオ', sans-serif;
		font-size: 11px;
		color: var(--color-text);
		background: var(--color-bg-muted);
		min-height: 100vh;
		display: grid;
		grid-template-columns: 400px 1fr;
	}

	/* 印刷ボタンエリア */
	.action-bar {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 0.75rem 1.5rem;
		background: var(--color-white);
		border-right: 1px solid var(--color-border);
		height: 100vh;
		overflow-y: auto;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	/* 従業員選択 */
	.employee-selector {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.employee-select-label {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.employee-select {
		padding: 0.5rem;
		font-size: 0.8rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-white);
		color: var(--color-text);
		cursor: pointer;
	}

	.action-buttons {
		display: flex;
		gap: 0.75rem;
	}

	.print-btn {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 1rem;
		background: var(--color-primary);
		color: var(--color-white);
		border: none;
		border-radius: var(--radius);
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s;
	}

	.print-btn:hover {
		background: hsl(220, 86%, 65%);
	}

	.back-btn {
		display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
		background: var(--color-bg-muted);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font-size: 0.8rem;
		text-decoration: none;
		transition: background 0.2s;
	}

	.back-btn:hover {
		background: var(--color-bg-muted-hover);
	}

	/* ページ選択エリア */
	.template-selector {
		background: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		padding: 1rem;
		margin-bottom: 1rem;
	}

	.template-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 0.75rem;
		margin-top: 0.75rem;
	}

	.template-btn {
		display: flex;
		align-items: center;
		padding: 0.75rem 1rem;
		background: var(--color-bg-muted);
		border: 2px solid var(--color-border);
		border-radius: var(--radius);
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	.template-btn:hover {
		background: var(--color-bg-muted-hover);
		border-color: var(--color-border);
	}

	.template-btn.active {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: var(--color-white);
	}

	.template-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		width: 100%;
	}

	.template-label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text);
	}

	.template-btn.active .template-label {
		color: var(--color-white);
	}

	.template-desc {
		font-size: 0.75rem;
		color: var(--color-text-muted);
	}

	.template-btn.active .template-desc {
		color: var(--color-white);
	}

	.page-selector {
		background: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		padding: 1rem;
	}

	.selector-header {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.selector-header h3 {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0;
	}

	.checkbox-controls {
		display: flex;
		gap: 0.5rem;
		width: 100%;
	}

	.select-btn {
		padding: 0.375rem 0.75rem;
		font-size: 0.8rem;
		background: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		cursor: pointer;
		transition: background 0.2s;
		color: var(--color-text);
	}

	.select-btn:hover {
		background: var(--color-bg-muted);
	}

	.add-page-btn {
		background: var(--color-primary);
		color: var(--color-white);
		border-color: var(--color-primary);
	}

	.add-page-btn:hover {
		background: hsl(220, 86%, 65%);
		border-color: hsl(220, 86%, 65%);
	}

	/* 右側コンテンツエリア */
	.content-area {
		overflow-y: auto;
		height: 100vh;
		padding: 1.5rem 0;
	}

	.page-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 0.75rem;
	}

	.page-item {
		display: flex;
		flex-direction: column;
		background: var(--color-white);
		border: 2px solid var(--color-border);
		border-radius: var(--radius);
		transition: all 0.2s;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.page-item:hover {
		border-color: var(--color-primary);
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	}

	.page-item.selected {
		border-color: var(--color-primary);
		background: var(--color-white);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.875rem;
		gap: 0.5rem;
	}

	.page-checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		cursor: pointer;
	}

	.page-checkbox-label {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.page-checkbox-label input[type='checkbox'] {
		width: 20px;
		height: 20px;
		cursor: pointer;
		flex-shrink: 0;
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		border: 2px solid var(--color-border);
		border-radius: 4px;
		background-color: var(--color-white);
		position: relative;
		transition: all 0.2s;
	}

	.page-checkbox-label input[type='checkbox']:checked {
		background-color: var(--color-primary);
		border-color: var(--color-primary);
	}

	.page-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
	}

	.page-label {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-text);
		line-height: 1.4;
	}

	.page-actions {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		flex-shrink: 0;
	}

	.remove-page-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		padding: 0;
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--color-text-muted);
		border-radius: 4px;
		transition: all 0.2s;
	}

	.remove-page-btn:hover {
		color: var(--color-danger);
		background: var(--color-bg-muted);
	}

	.expand-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		padding: 0;
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--color-text-muted);
		transition: all 0.2s;
	}

	.expand-btn:hover {
		color: var(--color-text);
		background: var(--color-bg-muted);
		border-radius: 4px;
	}

	.expand-btn svg {
		transition: transform 0.2s;
	}

	.expand-btn svg.rotated {
		transform: rotate(180deg);
	}

	.page-sections {
		padding: 0.75rem;
		padding-top: 0;
		border-top: 1px solid var(--color-border);
		margin-top: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background: var(--color-white);
	}

	.section-checkbox-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem;
		font-size: 0.8rem;
		color: var(--color-text);
		border-radius: var(--radius);
		transition: all 0.2s;
		background: var(--color-white);
		border: 1px solid var(--color-border);
	}

	.section-checkbox-item:hover {
		background: var(--color-bg-muted);
		border-color: var(--color-primary);
	}

	.section-main-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.section-actions {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.expand-field-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		padding: 0;
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--color-text-muted);
		border-radius: 3px;
		transition: all 0.2s;
	}

	.expand-field-btn:hover {
		color: var(--color-text);
		background: var(--color-bg-muted);
	}

	.expand-field-btn svg {
		transition: transform 0.2s;
	}

	.expand-field-btn svg.rotated {
		transform: rotate(180deg);
	}

	.section-fields {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem;
		margin-top: 0.5rem;
		background: var(--color-bg-muted);
		border-radius: var(--radius);
		border: 1px solid var(--color-border);
	}

	.field-checkbox-item {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.5rem 0.75rem;
		font-size: 0.8rem;
		color: var(--color-text);
		cursor: pointer;
		border-radius: var(--radius);
		transition: all 0.2s;
		background: var(--color-white);
		border: 1px solid var(--color-border);
	}

	.field-checkbox-item:hover {
		background: var(--color-bg-muted-hover);
		border-color: var(--color-primary);
	}

	.field-checkbox-item {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}

	.field-checkbox-item input[type='checkbox'] {
		width: 18px;
		height: 18px;
		cursor: pointer;
		flex-shrink: 0;
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		border: 2px solid var(--color-border);
		border-radius: 4px;
		background-color: var(--color-white);
		position: relative;
		transition: all 0.2s;
	}

	.field-checkbox-item input[type='checkbox']:checked {
		background-color: var(--color-primary);
		border-color: var(--color-primary);
	}

	.field-checkbox-item span {
		flex: 1;
	}

	.field-checkbox-item .checkbox-check-icon {
		flex-shrink: 0;
		color: var(--color-success);
		pointer-events: none;
		margin-left: auto;
	}

	.page-label-input {
		width: 100%;
		padding: 0.25rem 0.5rem;
		font-size: 0.85rem;
		font-weight: 600;
		border: 1px solid var(--color-border);
		border-radius: 4px;
		background: var(--color-white);
		color: var(--color-text);
		margin-bottom: 0.5rem;
	}

	.page-title-input {
		width: 100%;
		padding: 0.25rem 0.5rem;
		font-size: 0.8rem;
		border: 1px solid var(--color-border);
		border-radius: 4px;
		background: var(--color-white);
		color: var(--color-text);
	}

	.page-title {
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 1.5rem 0;
		padding-bottom: 0.75rem;
		border-bottom: 2px solid var(--color-border);
		text-align: center;
	}

	.section-label {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
		cursor: pointer;
		position: relative;
	}

	.section-label input[type='checkbox'] {
		width: 20px;
		height: 20px;
		cursor: pointer;
		flex-shrink: 0;
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		border: 2px solid var(--color-border);
		border-radius: 4px;
		background-color: var(--color-white);
		position: relative;
		transition: all 0.2s;
	}

	.section-label input[type='checkbox']:checked {
		background-color: var(--color-primary);
		border-color: var(--color-primary);
	}

	.section-label span {
		font-weight: 500;
	}

	.remove-section-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		padding: 0;
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--color-text-muted);
		border-radius: 3px;
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.remove-section-btn:hover {
		color: var(--color-danger);
		background: var(--color-bg-muted);
	}

	.add-section-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.625rem;
		margin-top: 0.5rem;
		background: var(--color-white);
		border: 1px dashed var(--color-border);
		border-radius: var(--radius);
		font-size: 0.8rem;
		color: var(--color-text);
		cursor: pointer;
		transition: all 0.2s;
		font-weight: 500;
	}

	.add-section-btn:hover {
		background: var(--color-bg-muted);
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	/* モーダル */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: var(--color-backdrop);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-content {
		background: var(--color-white);
		border-radius: var(--radius);
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
		max-width: 400px;
		width: 90%;
		max-height: 80vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		border-bottom: 1px solid var(--color-border);
	}

	.modal-header h3 {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0;
	}

	.modal-close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		padding: 0;
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--color-text-muted);
		border-radius: 4px;
		transition: all 0.2s;
	}

	.modal-close-btn:hover {
		background: var(--color-bg-muted);
		color: var(--color-text);
	}

	.modal-body {
		padding: 1rem;
		overflow-y: auto;
	}

	.no-sections {
		text-align: center;
		font-size: 0.8rem;
		color: var(--color-text-muted);
		margin: 1rem 0;
	}

	.available-sections {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.section-option-btn {
		padding: 0.625rem 0.875rem;
		background: var(--color-white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font-size: 0.75rem;
		color: var(--color-text);
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
	}

	.section-option-btn:hover {
		background: var(--color-bg-muted);
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	/* 印刷コンテナ（ページごと） */
	.print-container {
		max-width: 210mm;
		width: 100%;
		margin: 1.5rem auto;
		padding: 1.5rem;
		background: var(--color-white);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		min-height: 270mm;
		display: flex;
		flex-direction: column;
	}

	.print-page-section {
		position: relative;
	}

	/* セクション */
	.section {
		margin-bottom: 1rem;
	}

	.section-title {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-text);
		margin: 0 0 0.5rem;
		padding: 0.375rem 0.625rem;
		background: var(--color-bg-muted);
		border-left: 3px solid var(--color-primary);
	}

	/* 基本情報レイアウト */
	.basic-info {
		display: flex;
		gap: 0.5rem;
	}

	.avatar-container {
		flex-shrink: 0;
	}

	.avatar {
		width: 150px;
		aspect-ratio: 1/1;
		object-fit: cover;
		border-radius: 3px;
	}

	.driver-ledger-header {
		margin-bottom: 1rem;
	}

	.driver-ledger-table {
		margin-top: 0.5rem;
	}

	.driver-ledger-table thead th {
		background: var(--color-bg-muted);
		font-weight: 600;
		text-align: center;
		padding: 0.5rem;
		border: 1px solid var(--color-border);
	}

	.driver-ledger-table tbody td {
		padding: 0.5rem;
		border: 1px solid var(--color-border);
		text-align: left;
		min-height: 2rem;
	}

	.driver-ledger-table tbody tr {
		min-height: 2rem;
	}

	/* テーブル */
	.info-table {
		flex: 1;
		border-collapse: collapse;
		font-size: 0.7rem;
	}

	.info-table.full-width {
		width: 100%;
	}

	.info-table th,
	.info-table td {
		padding: 0.375rem 0.5rem;
		border: 1px solid var(--color-border);
		text-align: left;
	}

	.info-table th {
		background: var(--color-bg-muted);
		font-weight: 600;
		width: 90px;
		color: var(--color-text);
	}

	.info-table td {
		background: var(--color-white);
	}

	.info-table thead th {
		text-align: center;
		width: auto;
	}

	.info-table tbody td {
		text-align: left;
	}

	/* フッター */
	.footer {
		margin-top: auto;
		padding-top: 0.625rem;
		border-top: 1px solid var(--color-border);
		text-align: center;
	}

	.footer p {
		font-size: 0.625rem;
		color: var(--color-text-muted);
		margin: 0;
	}

	.page-number {
		margin-top: 0.25rem !important;
		font-weight: 500;
		color: var(--color-text-muted) !important;
	}

	/* 印刷時のスタイル */
	@media print {
		.no-print {
			display: none !important;
		}

		.print-page {
			background: var(--color-white);
			font-size: 10px;
			display: block;
			grid-template-columns: none;
		}

		.content-area {
			height: auto;
			overflow: visible;
			padding: 0;
		}

		.print-container {
			margin: 0 auto;
			padding: 8mm;
			box-shadow: none;
			max-width: none;
			min-height: auto;
			page-break-after: always;
		}

		.print-container:last-of-type {
			page-break-after: auto;
		}

		.section {
			page-break-inside: avoid;
		}

		.section-title {
			font-size: 10pt;
		}

		.info-table {
			font-size: 8pt;
		}

		.avatar {
			width: 150px;
			aspect-ratio: 1/1;
		}

		@page {
			size: A4;
			margin: 8mm;
		}
	}
</style>
