<script lang="ts">
</script>

<header class="nav">
	<div class="content">
		<div class="logo-wrapper">
			<div class="logo">
				<a href='/'>
					<img alt="logo" src="/logo.png"/>
				</a>
			</div>
		</div>
		<div class="links-wrapper">
			<a href="/about">About</a>
			<a href="/catalog">Catalog</a>
			<a href="/news">News</a>
		</div>
	</div>
</header>

<style lang="scss">
	.nav {
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100vw;
		height: 80px;
		position: fixed;
		top: 0;
		background: #1b1b1d;
	}

	.content {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
		max-width: 1050px;
		padding: 0 20px;

		.logo-wrapper {
			width: 150px;
			img {
				width: 100%;
			}
		}
	}

	.links-wrapper {
		display: flex;
		gap: 25px;
		align-items: center;
		color: whitesmoke;
	}
</style>
