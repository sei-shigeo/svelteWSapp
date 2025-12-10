<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { DetailData } from '../data/detailsData';
	let { detail, children }: { detail: DetailData; children: Snippet } = $props();
</script>

{#snippet buttonGroup()}
	<button class="btn add" style="grid-area: add;">+</button>
	<button class="btn remove" style="grid-area: remove;">-</button>
	<style>
		.add,
		.remove {
			grid-area: var(--grid-area);
			text-align: center;
		}
		.add {
			grid-area: add;
			background-color: var(--color-success);
		}
		.remove {
			grid-area: remove;
			background-color: var(--color-danger);
		}
	</style>
{/snippet}

<div class="details-container">
	<details open={detail.open}>
		<summary>{detail.title}</summary>
		<div class={['content-area', detail.className]}>
			{@render children()}
			{#if detail.showButtons}
				{@render buttonGroup()}
			{/if}
		</div>
	</details>
</div>

<style>
	.details-container {
		display: flex;
		flex-direction: column;
		background-color: var(--color-bg-muted);
		border-radius: var(--radius);
		padding: var(--spacing-sm) var(--spacing-md);
	}
	.content-area {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--spacing-sm);
		padding: var(--spacing-sm);
	}
	/* 従業員情報 Grid Areas */
	.employee-info {
		grid-template-areas:
			'code nationality . .'
			'gender blood_type date_of_birth .'
			'f_name m_name l_name .'
			'fk_name mk_name lk_name .'
			'phone email email email'
			'p_code address address address';
	}
	/* 緊急連絡先 Grid Areas */
	.emergency-contact {
		grid-template-areas:
			'relationship name phone .'
			'email email address address';
	}
	/* 雇用情報 Grid Areas */
	.employment-info {
		grid-template-areas:
			'type department position'
			'hire_date leave_date .';
	}

	/* 免許証情報 Grid Areas */
	.license-info {
		grid-template-areas:
			'number number exp_date exp_date'
			'f_img f_img b_img b_img';
	}

	/* 資格証書情報 Grid Areas */
	.qualification-info {
		grid-template-areas:
			'type number exp_date .'
			'f_img f_img b_img b_img'
			'add add remove remove';
	}

	/* 保険情報 Grid Areas */
	.insurance-info {
		grid-template-areas:
			'type number exp_date .'
			'f_img f_img b_img b_img'
			'add add remove remove';
	}

	/* 職歴情報 Grid Areas */
	.job-history-info {
		grid-template-areas:
			'name content sAt eAt'
			'add add remove remove';
	}

	/* 学歴情報 Grid Areas */
	.education-info {
		grid-template-areas:
			'type name sAt eAt'
			'add add remove remove';
	}
</style>
