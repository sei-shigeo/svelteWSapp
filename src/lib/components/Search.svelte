<label class="search-container icon" data-icon="search">
	<input type="search" name="search" placeholder="検索" />
</label>

<style>
	.search-container {
		width: 100%;
		display: flex;
		align-items: center;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background-color: #fff;

		&::before {
			color: var(--color-text-muted);
		}
		& input {
			all: unset;
			flex: 1;
			padding-right: var(--spacing-md);
		}
	}
</style>
