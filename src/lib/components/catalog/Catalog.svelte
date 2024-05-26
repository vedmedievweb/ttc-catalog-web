<script>
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let catalog = [];
	let loadTypes = [];
	let loadCategories = [];
	let page = 1;
	let limit = 10;
	let sortBy = 'id';
	let sortOrder = 'asc';
	let selectedLoadTypes = writable([]);
	let selectedLoadCategories = writable([]);
	let search = '';
	let totalPages = 1;

	const fetchCatalog = async () => {
		const loadTypeIds = $selectedLoadTypes.join(',');
		const loadCategoryIds = $selectedLoadCategories.join(',');

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

		catalog = data.data;
		totalPages = Math.ceil(data.total / limit);
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

	onMount(() => {
		fetchCatalog();
		fetchLoadTypes();
		fetchLoadCategories();
	});
</script>

<style>
	.container {
		display: flex;
	}
	.sidebar {
		width: 250px;
		padding: 20px;
		border-right: 1px solid #ddd;
	}
	.content {
		flex-grow: 1;
		padding: 20px;
	}
	.sortable {
		cursor: pointer;
	}
	.sortable::after {
		content: ' ⬍';
		font-size: 0.8em;
		margin-left: 5px;
	}
	.sortable.asc::after {
		content: ' ▲';
	}
	.sortable.desc::after {
		content: ' ▼';
	}
</style>

<div class="container">
	<div class="sidebar">
		<h2>Filters</h2>
		<button on:click={clearFilters}>Clear Filters</button>
		<div>
			<h3>Load Types</h3>
			{#each loadTypes as type}
				<div>
					<input
						type="checkbox"
						bind:group={$selectedLoadTypes}
						value={type.id}
						on:change={fetchCatalog}
					/>
					<label>{type.name}</label>
				</div>
			{/each}
		</div>
		<div>
			<h3>Load Categories</h3>
			{#each loadCategories as category}
				<div>
					<input
						type="checkbox"
						bind:group={$selectedLoadCategories}
						value={category.id}
						on:change={fetchCatalog}
					/>
					<label>{category.name}</label>
				</div>
			{/each}
		</div>
	</div>
	<div class="content">
		<h1>Catalog Page</h1>
		<input type="text" placeholder="Search..." bind:value={search} on:input={handleSearch} />

		<table>
			<thead>
				<tr>
					<th class="sortable" class:asc={sortBy === 'id' && sortOrder === 'asc'} class:desc={sortBy === 'id' && sortOrder === 'desc'} on:click={() => toggleSort('id')}>ID</th>
					<th class="sortable" class:asc={sortBy === 'load_category' && sortOrder === 'asc'} class:desc={sortBy === 'load_category' && sortOrder === 'desc'} on:click={() => toggleSort('load_category')}>Load Category</th>
					<th class="sortable" class:asc={sortBy === 'load_type' && sortOrder === 'asc'} class:desc={sortBy === 'load_type' && sortOrder === 'desc'} on:click={() => toggleSort('load_type')}>Load Type</th>
					<th>Special Remarks</th>
					<th>Supporting Info</th>
				</tr>
			</thead>
			<tbody>
			{#each catalog as item}
				<tr>
					<td>{item.id}</td>
					<td>{item.load_category}</td>
					<td>{item.load_type}</td>
					<td>{item.special_remarks}</td>
					<td>{item.supporting_info}</td>
				</tr>
			{/each}
			</tbody>
		</table>

		<div>
			<button on:click={() => { page = Math.max(1, page - 1); fetchCatalog(); }} disabled={page === 1}>Previous</button>
			<span>Page {page} of {totalPages}</span>
			<button on:click={() => { page = Math.min(totalPages, page + 1); fetchCatalog(); }} disabled={page === totalPages}>Next</button>
		</div>
	</div>
</div>
