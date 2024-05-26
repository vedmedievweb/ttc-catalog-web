export async function load({ params }) {
	const response = await fetch(`${import.meta.env.VITE_API_URL}/catalog/${params.item}`);
	if (!response.ok) {
		return {
			status: response.status,
			error: new Error('Could not load the item')
		};
	}
	const { data } = await response.json();
	return data;
}