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

	/* 詳細コンテナ（fieldset） */
	:global(.form-container .detail-container) {
		background-color: var(--color-bg-muted);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		padding: var(--spacing-md);
		margin-bottom: var(--spacing-md);
	}

	/* 詳細コンテナのlegend */
	:global(.form-container .detail-container legend) {
		font-size: 1em;
		font-weight: 600;
		color: var(--color-text);
		padding: 0 var(--spacing-xs);
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	/* 銀行情報リンク */
	:global(.form-container .detail-container legend .bank-info-link) {
		font-size: 0.75em;
		font-weight: 400;
		color: var(--color-primary);
		text-decoration: none;
		margin-left: var(--spacing-sm);
		padding: 2px 8px;
		border: 1px solid var(--color-primary);
		border-radius: var(--radius);
		transition: all 0.2s ease;
	}

	:global(.form-container .detail-container legend .bank-info-link:hover) {
		background-color: var(--color-primary);
		color: var(--color-white);
		text-decoration: none;
	}

	/* コンテンツエリア */
	:global(.form-container .content-area) {
		display: grid;
		/* grid-template-columns: repeat(auto-fit, 1fr); */
		grid-template-rows: repeat(auto-fit, 70px);
		gap: var(--spacing-sm);
		position: relative;
	}

	/* 複数登録可能なセクションのエントリ（fieldset） */
	:global(.form-container .entry-item) {
		margin-bottom: var(--spacing-md);
		padding: var(--spacing-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background-color: var(--color-bg-muted);
		position: relative;
	}

	:global(.form-container .entry-item:last-of-type) {
		margin-bottom: 0;
	}

	:global(.form-container .entry-item-title) {
		font-size: 0.9em;
		font-weight: 600;
		color: var(--color-text-muted);
		padding: 0 var(--spacing-xs);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--spacing-sm);
	}

	:global(.form-container .entry-type-label) {
		font-weight: 400;
		color: var(--color-text);
		margin-left: var(--spacing-xs);
	}

	/* 削除ボタン */
	:global(.form-container .remove-entry) {
		width: 24px;
		height: 24px;
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
		flex-shrink: 0;
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

	/* 従業員情報 Grid Areas（基本設定） */
	:global(.form-container .employee-info) {
		grid-template-columns: repeat(3, 1fr);
	}

	/* 基本情報サブセクション */
	:global(.form-container .sub-section-basic) {
		grid-template-areas:
			'img code nationality .'
			'img gender blood_type date_of_birth'
			'img image_at . .';
		grid-template-columns: 200px repeat(3, 1fr);
		grid-template-rows: repeat(3, 70px);
	}

	/* セキュリティサブセクション */
	:global(.form-container .sub-section-security) {
		grid-template-areas: 'role password password_confirm';
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: 70px;
		align-items: start;
	}

	/* 名前サブセクション */
	:global(.form-container .sub-section-name) {
		grid-template-areas:
			'l_name f_name m_name'
			'lk_name fk_name mk_name';
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: repeat(2, 70px);
	}

	/* 連絡先サブセクション */
	:global(.form-container .sub-section-contact) {
		grid-template-areas: 'phone_mobile phone_tel email';
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: 70px;
	}

	/* 住まいサブセクション */
	:global(.form-container .sub-section-address) {
		grid-template-areas: 'p_code address address';
		grid-template-columns: repeat(3, 1fr);
		grid-template-rows: 70px;
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

	/* サブセクション（fieldset） */
	:global(.form-container .sub-section) {
		margin-bottom: var(--spacing-md);
		padding: var(--spacing-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background-color: var(--color-bg-muted);
	}

	:global(.form-container .sub-section:last-child) {
		margin-bottom: 0;
	}

	:global(.form-container .sub-section-title) {
		font-size: 0.9em;
		font-weight: 600;
		color: var(--color-text-muted);
		padding: 0 var(--spacing-xs);
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
			'bank_code bank_name branch_code branch_name'
			'account_type account_number account_holder default_account';
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(2, 70px);
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

	/* セキュリティセクションのlabelを統一 */
	:global(.form-container .sub-section-security label) {
		display: grid;
		gap: var(--spacing-xs);
		grid-template-rows: 1.5rem 1fr;
		min-height: 70px;
		align-content: start;
		& span {
			font-size: 0.7em;
			text-wrap: nowrap;
		}
	}

	/* パスワード確認エラーメッセージ */
	:global(.form-container .sub-section-security label.has-error) {
		grid-template-rows: 1.5rem 1fr auto;
	}

	:global(.form-container .sub-section-security .error-message) {
		color: var(--color-danger);
		font-size: 0.7em;
		display: block;
		line-height: 1.2;
		margin-top: 4px;
	}

	:global(.form-container input.error) {
		border-color: var(--color-danger);
	}

	/* セキュリティセクションのlabelを統一 */
	:global(.form-container .sub-section-security label) {
		min-height: 70px;
		align-content: start;
	}

	/* エラーメッセージ */
	:global(.error) {
		padding: var(--spacing-md);
		text-align: center;
	}

	/* 印刷時にヘッダーを非表示 */
	@media print {
		:global(.form-container .header) {
			display: none !important;
		}

		:global(.form-container) {
			grid-template-rows: 1fr;
		}
	}
</style>
