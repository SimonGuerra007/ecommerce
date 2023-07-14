

export function printProducts(db) {
    let html = "";

    for (const product of db) {
        html += `
        <div class="product" id='${product.id}' >
            <div class="product__img">
                <img src="${product.image}" alt="">
            </div>
            <div class="product__info">
                <h4 class='name'>${product.name}</h4>
                <span class='stock'><b>Stock</b>: ${product.quantity}</span>
                <h5 class='price'>
                    $${product.price}
                    ${product.quantity ? `<i class='bx bx-plus' id='${product.id}'></i>` : `<span class='sold_out'>Sold Out</span>`}
                </h5>
            </div>
        </div>
        `;
    }
    document.querySelector('.products').innerHTML = html;
}

export function printProductsAll(db) {
    let html = "";

    for (const product of db.products) {
        html += `
        <div class="product" id='${product.id}'>
            <div class="product__img">
                <img src="${product.image}" alt="">
            </div>
            <div class="product__info">
                <h4 class='name'>${product.name}</h4>
                <span class='stock'><b>Stock</b>: ${product.quantity}</span>
                <h5 class='price'>
                    $${product.price}
                    ${product.quantity ? `<i class='bx bx-plus'></i>` : `<span class='sold_out'>Sold Out</span>`}
                </h5>
            </div>
        </div>
        `;
    }
    document.querySelector('.products').innerHTML = html;
}