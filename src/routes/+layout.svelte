<script>
	import Header from '$lib/components/landing/Header.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';

	import './styles.css';
</script>

<div class="app">
	<Header />

	<main>
		<slot />
	</main>

	<Footer/>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
