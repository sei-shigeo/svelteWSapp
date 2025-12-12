<script lang="ts">
	import type { PageProps } from './$types';
	import { nationalityData } from '../../data/employeeData';
	import defaultAvatar from '$lib/assets/images/avatar.png';

	let { data }: PageProps = $props();

	const employee = $derived(data.employee);

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
		educationInfo: '学歴情報'
	};

	// ページ構成の定義（動的に変更可能）
	let pageDefinitions = $state([
		{
			id: 'page1',
			label: '1ページ目',
			description: '基本情報・連絡先',
			sections: ['basicInfo', 'contactInfo']
		}
	]);

	// 項目追加モーダルの表示状態
	let showAddSectionModal = $state<{ pageId: string } | null>(null);
	let showAddPageModal = $state(false);

	// ページの展開状態（動的に管理）
	function getExpandedState(pageId: string): boolean {
		return expandedPages[pageId as keyof typeof expandedPages] || false;
	}

	function setExpandedState(pageId: string, value: boolean) {
		expandedPages[pageId as keyof typeof expandedPages] = value;
	}

	// ページの展開状態
	let expandedPages = $state<Record<string, boolean>>({});

	// ページの選択状態（動的に管理）
	function getSelectedState(pageId: string): boolean {
		return selectedPages[pageId as keyof typeof selectedPages] || false;
	}

	function setSelectedState(pageId: string, value: boolean) {
		selectedPages[pageId as keyof typeof selectedPages] = value;
	}

	// ページの選択状態
	let selectedPages = $state<Record<string, boolean>>({
		page1: true
	});

	// 印刷するセクションの選択状態
	let sections = $state({
		basicInfo: true,
		contactInfo: true,
		emergencyContact: true,
		employmentInfo: true,
		licenseInfo: true,
		qualificationInfo: true,
		insuranceInfo: true,
		jobHistory: true,
		educationInfo: true
	});

	// ページ選択を切り替え
	function togglePage(pageId: string, checked: boolean) {
		setSelectedState(pageId, checked);
		const page = pageDefinitions.find((p) => p.id === pageId);
		if (page) {
			page.sections.forEach((sectionId) => {
				sections[sectionId as keyof typeof sections] = checked;
			});
		}
	}

	// 全ページ選択/解除
	function toggleAllPages(checked: boolean) {
		pageDefinitions.forEach((page) => {
			togglePage(page.id, checked);
		});
	}

	// 新しいページを追加
	function addNewPage() {
		const pageNumber = pageDefinitions.length + 1;
		const newPageId = `page${pageNumber}`;
		pageDefinitions = [
			...pageDefinitions,
			{
				id: newPageId,
				label: `${pageNumber}ページ目`,
				description: '新しいページ',
				sections: []
			}
		];
		setSelectedState(newPageId, true);
		setExpandedState(newPageId, false);
		showAddPageModal = false;
	}

	// ページを削除
	function removePage(pageId: string) {
		if (pageDefinitions.length <= 1) {
			alert('最後の1ページは削除できません');
			return;
		}
		const page = pageDefinitions.find((p) => p.id === pageId);
		if (page) {
			// ページ内のセクションを無効化
			page.sections.forEach((sectionId) => {
				sections[sectionId as keyof typeof sections] = false;
			});
		}
		pageDefinitions = pageDefinitions.filter((p) => p.id !== pageId);
		delete selectedPages[pageId];
		delete expandedPages[pageId];
	}

	// セクション選択時にページ状態を更新
	function updatePageState(pageId: string) {
		const page = pageDefinitions.find((p) => p.id === pageId);
		if (page) {
			const allSelected = page.sections.every(
				(sectionId) => sections[sectionId as keyof typeof sections]
			);
			setSelectedState(pageId, allSelected);
		}
	}

	// セクション変更時のハンドラー
	function handleSectionChange(sectionId: string) {
		const page = pageDefinitions.find((p) => p.sections.includes(sectionId));
		if (page) {
			updatePageState(page.id);
		}
	}

	// ページにセクションを追加
	function addSectionToPage(pageId: string, sectionId: string) {
		const page = pageDefinitions.find((p) => p.id === pageId);
		if (page && !page.sections.includes(sectionId)) {
			page.sections = [...page.sections, sectionId];
			// セクションを有効化
			sections[sectionId as keyof typeof sections] = true;
			updatePageState(pageId);
		}
		showAddSectionModal = null;
	}

	// ページからセクションを削除
	function removeSectionFromPage(pageId: string, sectionId: string) {
		const page = pageDefinitions.find((p) => p.id === pageId);
		if (page) {
			page.sections = page.sections.filter((id) => id !== sectionId);
			// セクションを無効化
			sections[sectionId as keyof typeof sections] = false;
			updatePageState(pageId);
		}
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
		// ページが選択されているかチェック
		if (!getSelectedState(pageId)) {
			return false;
		}
		const page = pageDefinitions.find((p) => p.id === pageId);
		if (!page) return false;
		// ページ内に選択されたセクションがあるかチェック
		return page.sections.some((sectionId) => sections[sectionId as keyof typeof sections]);
	}

	// 国籍ラベルを取得
	function getNationalityLabel(id: number): string {
		const nationality = nationalityData.find((n) => n.id === id);
		return nationality?.label || '-';
	}

	// 性別ラベルを取得
	function getGenderLabel(id: number): string {
		const genderMap: Record<number, string> = { 1: '男性', 2: '女性' };
		return genderMap[id] || '-';
	}

	// 血液型ラベルを取得
	function getBloodTypeLabel(id: number): string {
		const bloodTypeMap: Record<number, string> = { 1: 'A型', 2: 'B型', 3: 'O型', 4: 'AB型' };
		return bloodTypeMap[id] || '-';
	}

	// 日付フォーマット
	function formatDate(date: string | undefined): string {
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
			<a href={`/employees/${employee.id}`} class="back-btn">戻る</a>
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
									<span class="page-label">{page.label}</span>
									<span class="page-desc">{page.description}</span>
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
										<label class="section-label">
											<input
												type="checkbox"
												checked={sections[sectionId as keyof typeof sections]}
												onchange={(e) => {
													sections[sectionId as keyof typeof sections] = e.currentTarget.checked;
													handleSectionChange(sectionId);
												}}
											/>
											<span>{sectionLabels[sectionId] || sectionId}</span>
										</label>
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
	{#each pageDefinitions as page, pageIndex}
		{#if isPageVisible(page.id)}
			<div class="print-container print-page-section">
				<header class="header">
					<h1>従業員情報</h1>
					<p class="print-date">印刷日: {new Date().toLocaleDateString('ja-JP')}</p>
				</header>

				{#each page.sections as sectionId}
					{#if sections[sectionId as keyof typeof sections]}
						{#if sectionId === 'basicInfo'}
							<section class="section">
								<h2 class="section-title">基本情報</h2>
								<div class="basic-info">
									<div class="avatar-container">
										<img src={employee.image || defaultAvatar} alt="従業員写真" class="avatar" />
									</div>
									<table class="info-table">
										<tbody>
											<tr>
												<th>従業員ID</th>
												<td>{employee.code || '-'}</td>
												<th>ステータス</th>
												<td>
													<span class="status" class:active={employee.isActive}>
														{employee.isActive ? '在籍中' : '退職'}
													</span>
												</td>
											</tr>
											<tr>
												<th>氏名</th>
												<td>{getFullName()}</td>
												<th>氏名（カナ）</th>
												<td>{getFullNameKana()}</td>
											</tr>
											<tr>
												<th>国籍</th>
												<td>{getNationalityLabel(employee.nationality)}</td>
												<th>性別</th>
												<td>{getGenderLabel(employee.gender)}</td>
											</tr>
											<tr>
												<th>生年月日</th>
												<td>{formatDate(employee.dateOfBirth)}</td>
												<th>血液型</th>
												<td>{getBloodTypeLabel(employee.bloodType)}</td>
											</tr>
										</tbody>
									</table>
								</div>
							</section>
						{:else if sectionId === 'contactInfo'}
							<section class="section">
								<h2 class="section-title">連絡先情報</h2>
								<table class="info-table full-width">
									<tbody>
										<tr>
											<th>電話番号</th>
											<td>{employee.phone || '-'}</td>
											<th>メールアドレス</th>
											<td>{employee.email || '-'}</td>
										</tr>
										<tr>
											<th>郵便番号</th>
											<td>{employee.postalCode || '-'}</td>
											<th>住所</th>
											<td>{employee.address || '-'}</td>
										</tr>
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
								<h2 class="section-title">雇用情報</h2>
								<table class="info-table full-width">
									<tbody>
										<tr>
											<th>雇用形態</th>
											<td>-</td>
											<th>部署</th>
											<td>-</td>
										</tr>
										<tr>
											<th>役職</th>
											<td>-</td>
											<th>入社日</th>
											<td>-</td>
										</tr>
										<tr>
											<th>退社日</th>
											<td>-</td>
											<th></th>
											<td></td>
										</tr>
									</tbody>
								</table>
							</section>
						{:else if sectionId === 'licenseInfo'}
							<section class="section">
								<h2 class="section-title">免許証情報</h2>
								<table class="info-table full-width">
									<tbody>
										<tr>
											<th>免許証番号</th>
											<td>-</td>
											<th>有効期限</th>
											<td>-</td>
										</tr>
									</tbody>
								</table>
							</section>
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

<style>
	/* 基本スタイル */
	.print-page {
		font-family: 'Hiragino Kaku Gothic ProN', 'メイリオ', sans-serif;
		font-size: 11px;
		color: #333;
		background: #f5f5f5;
		min-height: 100vh;
	}

	/* 印刷ボタンエリア */
	.action-bar {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 0.75rem 1.5rem;
		background: #fff;
		border-bottom: 1px solid #e0e0e0;
		position: sticky;
		top: 0;
		z-index: 100;
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
		background: #2563eb;
		color: #fff;
		border: none;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.2s;
	}

	.print-btn:hover {
		background: #1d4ed8;
	}

	.back-btn {
		display: flex;
		align-items: center;
		padding: 0.5rem 1rem;
		background: #f3f4f6;
		color: #374151;
		border: 1px solid #d1d5db;
		border-radius: 4px;
		font-size: 0.8rem;
		text-decoration: none;
		transition: background 0.2s;
	}

	.back-btn:hover {
		background: #e5e7eb;
	}

	/* ページ選択エリア */
	.page-selector {
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		padding: 0.75rem;
	}

	.selector-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.selector-header h3 {
		font-size: 0.8rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0;
	}

	.checkbox-controls {
		display: flex;
		gap: 0.5rem;
	}

	.select-btn {
		padding: 0.25rem 0.5rem;
		font-size: 0.7rem;
		background: #fff;
		border: 1px solid #d1d5db;
		border-radius: 3px;
		cursor: pointer;
		transition: background 0.2s;
	}

	.select-btn:hover {
		background: #f3f4f6;
	}

	.add-page-btn {
		background: #2563eb;
		color: #fff;
		border-color: #2563eb;
	}

	.add-page-btn:hover {
		background: #1d4ed8;
		border-color: #1d4ed8;
	}

	.page-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 0.5rem;
	}

	.page-item {
		display: flex;
		flex-direction: column;
		background: #fff;
		border: 2px solid #e5e7eb;
		border-radius: 6px;
		transition: all 0.2s;
		overflow: hidden;
	}

	.page-item:hover {
		border-color: #93c5fd;
	}

	.page-item.selected {
		border-color: #2563eb;
		background: #eff6ff;
	}

	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.625rem;
		gap: 0.5rem;
	}

	.page-checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		cursor: pointer;
	}

	.page-checkbox-label input[type='checkbox'] {
		width: 16px;
		height: 16px;
		cursor: pointer;
		flex-shrink: 0;
	}

	.page-info {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		flex: 1;
	}

	.page-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: #1f2937;
	}

	.page-desc {
		font-size: 0.65rem;
		color: #6b7280;
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
		color: #9ca3af;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.remove-page-btn:hover {
		color: #dc2626;
		background: #fef2f2;
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
		color: #6b7280;
		transition: all 0.2s;
	}

	.expand-btn:hover {
		color: #1f2937;
		background: #f3f4f6;
		border-radius: 4px;
	}

	.expand-btn svg {
		transition: transform 0.2s;
	}

	.expand-btn svg.rotated {
		transform: rotate(180deg);
	}

	.page-sections {
		padding: 0.5rem 0.625rem;
		padding-top: 0;
		border-top: 1px solid #e5e7eb;
		margin-top: 0.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		background: #fafafa;
	}

	.section-checkbox-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.375rem 0.5rem;
		font-size: 0.7rem;
		color: #374151;
		border-radius: 4px;
		transition: background 0.2s;
	}

	.section-checkbox-item:hover {
		background: #f3f4f6;
	}

	.section-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		cursor: pointer;
	}

	.section-label input[type='checkbox'] {
		width: 14px;
		height: 14px;
		cursor: pointer;
		flex-shrink: 0;
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
		color: #9ca3af;
		border-radius: 3px;
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.remove-section-btn:hover {
		color: #dc2626;
		background: #fef2f2;
	}

	.add-section-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
		padding: 0.5rem;
		margin-top: 0.25rem;
		background: #f3f4f6;
		border: 1px dashed #d1d5db;
		border-radius: 4px;
		font-size: 0.7rem;
		color: #6b7280;
		cursor: pointer;
		transition: all 0.2s;
	}

	.add-section-btn:hover {
		background: #e5e7eb;
		border-color: #9ca3af;
		color: #374151;
	}

	/* モーダル */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-content {
		background: #fff;
		border-radius: 8px;
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
		border-bottom: 1px solid #e5e7eb;
	}

	.modal-header h3 {
		font-size: 0.9rem;
		font-weight: 600;
		color: #1f2937;
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
		color: #6b7280;
		border-radius: 4px;
		transition: all 0.2s;
	}

	.modal-close-btn:hover {
		background: #f3f4f6;
		color: #1f2937;
	}

	.modal-body {
		padding: 1rem;
		overflow-y: auto;
	}

	.no-sections {
		text-align: center;
		font-size: 0.8rem;
		color: #9ca3af;
		margin: 1rem 0;
	}

	.available-sections {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.section-option-btn {
		padding: 0.625rem 0.875rem;
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		font-size: 0.75rem;
		color: #374151;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
	}

	.section-option-btn:hover {
		background: #f9fafb;
		border-color: #2563eb;
		color: #2563eb;
	}

	/* 印刷コンテナ（ページごと） */
	.print-container {
		max-width: 210mm;
		margin: 1.5rem auto;
		padding: 1.5rem;
		background: #fff;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		min-height: 270mm;
		display: flex;
		flex-direction: column;
	}

	.print-page-section {
		position: relative;
	}

	/* ヘッダー */
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.25rem;
		padding-bottom: 0.75rem;
		border-bottom: 2px solid #333;
	}

	.header h1 {
		font-size: 1.25rem;
		font-weight: 700;
		margin: 0 0 0.375rem;
	}

	.print-date {
		font-size: 0.7rem;
		color: #666;
		margin: 0;
	}

	/* セクション */
	.section {
		margin-bottom: 1rem;
	}

	.section-title {
		font-size: 0.85rem;
		font-weight: 600;
		color: #1f2937;
		margin: 0 0 0.5rem;
		padding: 0.375rem 0.625rem;
		background: #f3f4f6;
		border-left: 3px solid #2563eb;
	}

	/* 基本情報レイアウト */
	.basic-info {
		display: flex;
		gap: 1rem;
	}

	.avatar-container {
		flex-shrink: 0;
	}

	.avatar {
		width: 80px;
		height: 100px;
		object-fit: cover;
		border: 1px solid #d1d5db;
		border-radius: 3px;
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
		border: 1px solid #e5e7eb;
		text-align: left;
	}

	.info-table th {
		background: #f9fafb;
		font-weight: 600;
		width: 90px;
		color: #4b5563;
	}

	.info-table td {
		background: #fff;
	}

	.info-table thead th {
		text-align: center;
		width: auto;
	}

	.info-table tbody td {
		text-align: left;
	}

	/* ステータスバッジ */
	.status {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		border-radius: 9999px;
		font-size: 0.625rem;
		font-weight: 500;
		background: #fef2f2;
		color: #dc2626;
	}

	.status.active {
		background: #ecfdf5;
		color: #059669;
	}

	/* フッター */
	.footer {
		margin-top: auto;
		padding-top: 0.625rem;
		border-top: 1px solid #e5e7eb;
		text-align: center;
	}

	.footer p {
		font-size: 0.625rem;
		color: #9ca3af;
		margin: 0;
	}

	.page-number {
		margin-top: 0.25rem !important;
		font-weight: 500;
		color: #6b7280 !important;
	}

	/* 印刷時のスタイル */
	@media print {
		.no-print {
			display: none !important;
		}

		.print-page {
			background: #fff;
			font-size: 10px;
		}

		.print-container {
			margin: 0;
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

		.header h1 {
			font-size: 14pt;
		}

		.section-title {
			font-size: 10pt;
		}

		.info-table {
			font-size: 8pt;
		}

		.avatar {
			width: 60px;
			height: 75px;
		}

		@page {
			size: A4;
			margin: 8mm;
		}
	}
</style>
