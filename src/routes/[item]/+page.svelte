<script lang="ts">
	import { onMount } from 'svelte';
 	import { browser } from '$app/environment';
	let Images;

	export let data: {
		id: number;
		load_category: string;
		load_type: string;
		images: string;
		industry_images: string;
		special_remarks: string;
		supporting_info: string;
	};
	const { id, load_category, load_type, images, industry_images, special_remarks, supporting_info } = data || {};
	const renderImages = images ? JSON.parse(images).map(item => ({src: item, alt: 'image'})) : null;
	const renderIndustryImages = industry_images ? JSON.parse(industry_images).map(item => ({src: item, alt: 'image'})) : null;
	onMount(async () => {
		if (browser) {
			const ImagesLib = await import("svelte-images");
			Images = ImagesLib.Images;
		}
	})
</script>

{#if id}
	<article>
		<h1>Item {id}</h1>
		<p><strong>Category:</strong> {load_category}</p>
		<p><strong>Type:</strong> {load_type}</p>

		{#if renderImages && browser && Images}
			<section>
				<h2>Images</h2>
				<Images images={renderImages} />
			</section>
		{/if}

		{#if renderIndustryImages && browser && Images}
			<section>
				<h2>Industry Images</h2>
				<Images images={renderIndustryImages} />
			</section>
		{/if}

		{#if special_remarks}
			<section>
				<h2>Special Remarks</h2>
				<p>{special_remarks}</p>
			</section>
		{/if}

		{#if supporting_info}
			<section>
				<h2>Supporting Info</h2>
				<p>{supporting_info}</p>
			</section>
		{/if}
	</article>
{:else}
	<article>
		<h1>Wrong product id</h1>
	</article>
{/if}

<style lang='scss'>
	img {
		max-width: 100%;
		height: auto;
		margin-bottom: 1rem;
	}

	article {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
		padding-top: 100px;
		padding-bottom: 20px;
		max-width: 800px;
		margin: 0 auto;
		color: whitesmoke;
	}

	section {
		margin-top: 1rem;
		:global(img) {
			opacity: 1;
		}
	}
</style>
