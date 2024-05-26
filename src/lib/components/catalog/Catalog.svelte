<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import LoadingSpinner from '../common/LoadingSpinner.svelte';
	import ArrowDown from '../icons/ArrowDown.svelte';

	let Images;
	let catalog = [];
	let loadTypes = [];
	let loadCategories = [];
	let page: number = 1;
	let limit: number = 10;
	let sortBy: string = 'id';
	let sortOrder: string = 'asc';
	let selectedLoadTypes = writable([]);
	let selectedLoadCategories = writable([]);
	let search: string = '';
	let totalPages = 1;
	let showLoadTypes: boolean = false;
	let showLoadCategories: boolean = false;
	let isLoading: boolean = true;

	const fetchCatalog = async () => {
		isLoading = true;
		const loadTypeIds: string = $selectedLoadTypes.join(',');
		const loadCategoryIds: string = $selectedLoadCategories.join(',');

		// @ts-ignore
		const params = new URLSearchParams({
			page,
			limit,
			sortBy,
			sortOrder,
			load_type_ids: loadTypeIds,
			load_category_ids: loadCategoryIds,
			search,
		});

		const response = await fetch(`${import.meta.env.VITE_API_URL}/catalog?${params.toString()}`);
		const { data } = await response.json();

		catalog = data.data.map(item => ({...item, images: JSON.parse(item.images), industry_images: JSON.parse(item.industry_images)}));
		totalPages = Math.ceil(data.total / limit);
		isLoading = false;
	};

	const fetchLoadTypes = async () => {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/load_data/load_types`);
		const data = await response.json();
		loadTypes = data.data;
	};

	const fetchLoadCategories = async () => {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/load_data/load_categories`);
		const data = await response.json();
		loadCategories = data.data;
	};

	const handleSearch = () => {
		page = 1;
		fetchCatalog();
	};

	const clearFilters = () => {
		selectedLoadTypes.set([]);
		selectedLoadCategories.set([]);
		page = 1;
		fetchCatalog();
	};

	const toggleSort = (column) => {
		if (sortBy === column) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = column;
			sortOrder = 'asc';
		}
		fetchCatalog();
	};

	onMount(async () => {
		fetchCatalog();
		fetchLoadTypes();
		fetchLoadCategories();
		if (browser) {
			const ImagesLib = await import("svelte-images");
			Images = ImagesLib.Images;
		}
	});
</script>

<div class="container">
	<div class="sidebar">
		<h2>
			Filters
			<button on:click={clearFilters} disabled={!$selectedLoadTypes.length && !$selectedLoadCategories.length}>Clear Filters</button>
		</h2>
		<div></div>
		<div>
			<h3
				role='presentation'
				on:click={() => {
					showLoadTypes = !showLoadTypes;
					if (showLoadTypes) {
						showLoadCategories = false;
					}
				}}
			>
				Load Types
			</h3>
			{#if showLoadTypes}
				{#each loadTypes as type}
					<div>
						<input
							type="checkbox"
							id="{type.name}"
							bind:group={$selectedLoadTypes}
							value={type.id}
							on:change={() => {
								page = 1;
								fetchCatalog();
							}}
						/>
						<label for="{type.name}">{type.name}</label>
					</div>
				{/each}
			{/if}
		</div>
		<hr/>
		<div>
			<h3
				role='presentation'
				on:click={() => {
					showLoadCategories = !showLoadCategories
					if (showLoadCategories) {
						showLoadTypes = false;
					}
				}}
			>
				Load Categories
			</h3>
			{#if showLoadCategories}
				{#each loadCategories as category}
					<div>
						<input
							type="checkbox"
							id="{category.name}"
							bind:group={$selectedLoadCategories}
							value={category.id}
							on:change={() => {
								page = 1;
								fetchCatalog();
							}}
						/>
						<label for="{category.name}">{category.name}</label>
					</div>
				{/each}
			{/if}
		</div>
	</div>
	<div class="content">
		<h1>Catalog</h1>
		<input class="search-input" type="text" placeholder="Search..." bind:value={search} on:input={handleSearch} />
		<div class="table-wrapper">
			<div class="table-scroller" class:dimmed={isLoading}>
				{#if isLoading}
					<div class="table-loader-wrapper">
						<LoadingSpinner />
					</div>
				{/if}
				<table>
					<thead>
						<tr>
							<th on:click={() => toggleSort('id')}>
								ID
								{#if sortBy === 'id'}
									<div class="arrow" class:rotate={sortOrder === 'desc'}>
										<ArrowDown />
									</div>
								{/if}
							</th>
							<th on:click={() => toggleSort('load_category')}>
								Load Category
								{#if sortBy === 'load_category'}
									<div class="arrow" class:rotate={sortOrder === 'desc'}>
										<ArrowDown />
									</div>
								{/if}
							</th>
							<th on:click={() => toggleSort('load_type')}>
								Load Type
								{#if sortBy === 'load_type'}
									<div class="arrow" class:rotate={sortOrder === 'desc'}>
										<ArrowDown />
									</div>
								{/if}
							</th>
							<th class="disabled">Images</th>
							<th class="disabled">Industry Images</th>
							<th class="disabled">Special Remarks</th>
							<th class="disabled">Supporting Info</th>
						</tr>
					</thead>
					<tbody>
					{#each catalog as item}
						<tr>
							<td><a href={`/${item.id}`}>{item.id}</a></td>
							<td>{item.load_category}</td>
							<td>{item.load_type}</td>
							<td>
								{#key item.images}
									{#if item.images && browser}
										<Images images={item.images.map(item => ({src: item, alt: 'image'}))} />
									{/if}
								{/key}
							</td>
							<td>
								{#key item.industry_images}
									{#if item.industry_images && browser}
										<Images images={item.industry_images.map(item => ({src: item, alt: 'image'}))} />
									{/if}
								{/key}
							</td>
							<td>{item.special_remarks}</td>
							<td>{item.supporting_info}</td>
						</tr>
					{/each}
					</tbody>
				</table>
			</div>
			<div class="pagination">
				<button on:click={() => { page = Math.max(1, page - 1); fetchCatalog(); }} disabled={page === 1}>Previous</button>
				<span> {page} of {totalPages}</span>
				<button on:click={() => { page = Math.min(totalPages, page + 1); fetchCatalog(); }} disabled={page === totalPages}>Next</button>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		display: flex;
		height: 100vh;
		overflow: hidden;
		padding-top: 100px;
		padding-bottom: 20px;
		max-width: 1300px;
		margin: 0 auto;
		color: whitesmoke;
	}
	.sidebar {
		flex: 0 0 250px;
		padding: 20px;
		border-right: 1px solid #ddd;
		overflow-y: auto;
		hr {
			margin: 10px 0;
		}
		h2 {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		h3 {
			cursor: pointer;
			margin-bottom: 8px;
		}
		label {
			cursor: pointer;
			user-select: none;
		}
	}
	.content {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		padding: 20px;
		gap: 10px;
	}
	.table-wrapper {
		flex-grow: 1;
		position: relative;
		overflow: hidden;
		overflow-y: auto;
		transition: 200ms;
		border-radius: 2px;
		border: 1px solid #2b2b32;

		.table-scroller {
			position: relative;
			height: calc(100% - 50px); /* Высота таблицы - высота пагинации */
			overflow-y: auto;
			&.dimmed {
				opacity: 0.5;
			}
		}

		.pagination {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 50px; /* Высота пагинации */
			gap: 10px;
		}

		table {
			width: 100%;
			border-collapse: collapse;
		}

		thead {
			position: sticky;
			top: 0;
			z-index: 10;
		}

		th,
		td {
			padding: 8px;
			border: 0.5px solid #2b2b32;
			background: #1a1a1e;
			width: auto;
			text-align: left;
			display: flex;
			align-items: center;
			overflow: hidden;
			font-size: 14px;
			color: white;
			:global(img) {
				opacity: 1;
			}
		}

		tr {
			display: grid;
			grid-template-columns: 60px 1fr 1fr 1fr 1fr 1fr 1fr;
			background-color: #25252a;
			box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
			color: white;
		}

		.arrow {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 20px;
			height: 15px;
			transition: 0.2s;
			color: grey;
		&.rotate {
			 transform: rotateX(180deg);
		 }
		}
		th {
			cursor: pointer;
			user-select: none;
			display: flex;
			align-items: center;
			justify-content: start;
			gap: 4px;
			font-weight: 300;
			background: black;
			z-index: 1;
		&.disabled {
			 cursor: default;
		 }
		}

		.table-loader-wrapper {
			position: sticky;
			top: 50%;
			left: 0;
			width: 100%;
			height: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			backdrop-filter: blur(6px);
			z-index: 10;
		}
	}
	.search-input {
		width: 100%;
		max-width: 400px;
		background-color: #1a1a1e;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 4px 4px 4px 10px;
		border-radius: 4px;
		font-weight: 300;
		font-size: 14px;
		height: 30px;
		min-height: 30px;
		border: solid 1px #222228;
		color: white;

		&:focus {
			outline: none;
			border: solid 1px #5d5d8c;
		}
	}
	button {
		align-items: center;
		text-align: center;
		gap: 8px;
		cursor: pointer;
		background: #28292f;
		padding: 5px 12px;
		border-radius: 8px;
		color: whitesmoke;
		font-weight: 300;
		font-size: 14px;

		&:disabled {
			opacity: 0.5;
			cursor: default;
		}
	}
</style>
