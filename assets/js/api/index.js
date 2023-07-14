export async function getProduct(BASE_URL) {
    try {
        const data = await fetch(BASE_URL);
        const res = await data.json();

        window.localStorage.setItem('products', JSON.stringify(res))

        return res
    } catch (error) {
        console.error(error);
    }
}