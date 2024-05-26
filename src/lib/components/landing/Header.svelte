<script lang="ts">
</script>

<header class="nav">
	<div class="content">
		<div class="logo-wrapper">
			<div class="logo">
				<img alt="logo" src="/logo.png"/>
			</div>
		</div>
		<div class="links-wrapper">
			<a href="">About</a>
			<a href="">Catalog</a>
			<a href="">News</a>
		</div>
	</div>
</header>

<style lang="scss">
	.nav {
		color: white;
		display: flex;
		justify-content: center;
		width: 100vw;
		height: 100px;
	}

	.content {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
		max-width: 850px;
	}

	.links-wrapper {
		display: flex;
		gap: 25px;
		align-items: center;
	}

	.cta {
		background: linear-gradient(180deg, #7408DF 0%, #560E9C 100%);
		border-radius: 9999px;
		padding: 6px 30px;
	}
</style>
