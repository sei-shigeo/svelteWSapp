<!-- 共通フォームスタイル - 作成画面と編集画面で共有 -->
<style>
	/* コンテナ */
	:global(.form-container) {
		display: grid;
		grid-template-rows: 57px 1fr;
	}

	/* ヘッダー */
	:global(.form-container .header) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
		border-bottom: 1px solid var(--color-border);
		padding: var(--spacing-sm);
		font-size: 0.8em;
		font-weight: 600;
		color: var(--color-text-muted);
	}

	:global(.form-container .header .button-group) {
		display: flex;
		gap: 1rem;
	}

	/* コンテンツ */
	:global(.form-container .content) {
		display: grid;
		grid-template-rows: 40px 1fr;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
	}

	:global(.form-container .content .tab-container) {
		display: flex;
		gap: var(--spacing-sm);
		flex-wrap: wrap;
	}

	/* タブボタン */
	:global(.form-container .tab-btn) {
		padding: var(--spacing-xs) var(--spacing-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background-color: var(--color-bg);
		color: var(--color-text-muted);
		font-size: 0.8em;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global(.form-container .tab-btn:hover) {
		background-color: var(--color-bg-muted);
	}

	:global(.form-container .tab-btn.active) {
		background-color: var(--color-primary);
		color: var(--color-white);
		border-color: var(--color-primary);
	}

	/* フォーム */
	:global(.form-container .form) {
		display: grid;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	/* 詳細コンテナ */
	:global(.form-container .detail-container) {
		background-color: var(--color-bg-muted);
		border-radius: var(--radius);
		padding: var(--spacing-md);
	}

	/* コンテンツエリア */
	:global(.form-container .content-area) {
		display: grid;
		/* grid-template-columns: repeat(auto-fit, 1fr); */
		grid-template-rows: repeat(auto-fit, 70px);
		gap: var(--spacing-sm);
		position: relative;
	}

	:global(.form-container .content-area.entry-item) {
		margin-bottom: var(--spacing-md);
		padding-bottom: var(--spacing-md);
		padding-right: 40px;
		border-bottom: 1px solid var(--color-border);
	}

	:global(.form-container .content-area.entry-item:last-of-type) {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	/* 削除ボタン */
	:global(.form-container .remove-entry) {
		position: absolute;
		top: var(--spacing-sm);
		right: var(--spacing-sm);
		width: 28px;
		height: 28px;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-danger);
		color: var(--color-white);
		border: 1px solid var(--color-danger);
		border-radius: var(--radius);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global(.form-container .remove-entry:hover:not(:disabled)) {
		background-color: color-mix(in srgb, var(--color-danger) 90%, black);
	}

	:global(.form-container .remove-entry:disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}

	:global(.form-container .remove-entry svg) {
		width: 14px;
		height: 14px;
	}

	/* ボタンコンテナ */
	:global(.form-container .button-container) {
		display: flex;
		gap: var(--spacing-sm);
		justify-content: flex-end;
		margin-top: var(--spacing-md);
		padding-top: var(--spacing-md);
		border-top: 1px solid var(--color-border);
	}

	/* 従業員情報 */
	:global(.form-container .employee-info) {
		grid-template-areas:
			'img role code nationality'
			'img gender blood_type date_of_birth'
			'img f_name m_name l_name'
			'image_at fk_name mk_name lk_name'
			'. phone_mobile phone_tel email'
			'. p_code address address';
		grid-template-columns: 200px repeat(3, 1fr);
		grid-template-rows: repeat(6, 70px);
	}

	/* 画像関連のグローバルスタイル */
	:global(.form-container .employee-info .image-container) {
		position: relative;
		width: 100%;
		align-self: start;
	}

	:global(.form-container .employee-info .image-label) {
		font-size: 0.7em;
		text-wrap: nowrap;
		height: 1.5rem;
		line-height: 1.5rem;
		padding-left: 8px;
	}

	:global(.form-container .employee-info .employee-image) {
		width: 100%;
		border: 1px solid var(--color-border);
	}

	/* 無効化された入力 */
	:global(.form-container input:disabled),
	:global(.form-container select:disabled) {
		background-color: var(--color-white);
		-webkit-text-fill-color: var(--color-text-muted);
		opacity: 1;
	}

	/* 緊急連絡先 Grid Areas */
	:global(.form-container .emergency-contact) {
		grid-template-areas:
			'relationship name phone phone'
			'email email address address';
	}

	/* サブセクション */
	:global(.form-container .sub-section) {
		margin-bottom: var(--spacing-md);
		padding-bottom: var(--spacing-md);
		border-bottom: 1px solid var(--color-border);
	}

	:global(.form-container .sub-section:last-child) {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	:global(.form-container .sub-section-title) {
		font-size: 0.9em;
		font-weight: 600;
		color: var(--color-text-muted);
		margin-bottom: var(--spacing-sm);
		padding-bottom: var(--spacing-xs);
		border-bottom: 1px solid var(--color-border);
	}

	/* 雇用情報 Grid Areas（基本設定） */
	:global(.form-container .employment-info) {
		grid-template-columns: repeat(3, 1fr);
	}

	/* 雇用情報サブセクション */
	:global(.form-container .sub-section-employment) {
		grid-template-areas:
			'type department position'
			'hire_date hire_date .';
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(2, 70px);
	}

	/* 解任情報サブセクション */
	:global(.form-container .sub-section-discharge) {
		grid-template-areas: 'appointment_at discharge_at discharge_reason';
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: 70px;
	}

	/* 退職情報サブセクション */
	:global(.form-container .sub-section-leave) {
		grid-template-areas: 'leave_date leave_reason .';
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: 70px;
	}

	/* 死亡情報サブセクション */
	:global(.form-container .sub-section-death) {
		grid-template-areas: 'death_at death_reason .';
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: 70px;
	}

	/* 免許証情報 Grid Areas */
	:global(.form-container .license-info) {
		grid-template-areas:
			'type number exp_date .'
			'f_img f_img b_img b_img';
		grid-template-columns: repeat(4, 1fr);
	}

	/* 資格証書情報 Grid Areas */
	:global(.form-container .qualification-info) {
		grid-template-areas:
			'type number exp_date .'
			'f_img f_img b_img b_img';
		grid-template-columns: repeat(4, 1fr);
	}

	/* 保険情報 Grid Areas */
	:global(.form-container .insurance-info) {
		grid-template-areas:
			'type number exp_date .'
			'f_img f_img b_img b_img';
		grid-template-columns: repeat(4, 1fr);
	}

	/* 職歴情報 Grid Areas */
	:global(.form-container .job-history-info) {
		grid-template-areas: 'name content sAt eAt';
		grid-template-columns: repeat(4, 1fr);
	}

	/* 学歴情報 Grid Areas */
	:global(.form-container .education-info) {
		grid-template-areas: 'type name sAt eAt';
		grid-template-columns: repeat(4, 1fr);
	}

	/* 銀行情報 Grid Areas */
	:global(.form-container .bank-account-info) {
		grid-template-areas:
			'type bank_name branch_name .'
			'account_number account_holder . .';
	}

	/* 健康診断情報 Grid Areas */
	:global(.form-container .health-checkup-info) {
		grid-template-areas:
			'type pdf_url'
			'date_at pdf_url'
			'result pdf_url'
			'content pdf_url';
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(4, 70px);
	}

	/* 適性診断情報 Grid Areas */
	:global(.form-container .suitability-assessment-info) {
		grid-template-areas:
			'type pdf_url'
			'score pdf_url'
			'result pdf_url';
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: repeat(3, 70px);
	}

	/* 特別教育情報 Grid Areas */
	:global(.form-container .special-education-info) {
		grid-template-areas:
			'type trainer start_at end_at'
			'content content content content';
	}

	/* 追加・削除ボタン */
	:global(.form-container .add),
	:global(.form-container .remove) {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--radius);
		font-size: 0.9em;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global(.form-container .add svg),
	:global(.form-container .remove svg) {
		width: 16px;
		height: 16px;
	}

	:global(.form-container .add:disabled),
	:global(.form-container .remove:disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}

	:global(.form-container .add) {
		background-color: var(--color-success);
		color: var(--color-white);
		border: 1px solid var(--color-success);
	}

	:global(.form-container .add:hover:not(:disabled)) {
		background-color: color-mix(in srgb, var(--color-success) 90%, black);
	}

	:global(.form-container .remove) {
		background-color: var(--color-danger);
		color: var(--color-white);
		border: 1px solid var(--color-danger);
	}

	:global(.form-container .remove:hover:not(:disabled)) {
		background-color: color-mix(in srgb, var(--color-danger) 90%, black);
	}
</style>
