import { getProduct } from "./api/index.js";
import { printProducts, printProductsAll } from "./UI/index.js";


function handleShortCart() {
    const iconCartHTML = document.querySelector('.bx-cart')
    const cartHTML = document.querySelector('.cart')
    const iconX = document.querySelector('.cart .bx-x')


    iconCartHTML.addEventListener('click', function () {
        cartHTML.classList.add('cart__show')
    })

    iconX.addEventListener('click', (e) => {
        cartHTML.classList.remove('cart__show')
    })
}

function addToCartFromProducts(db) {
    const productsHTML = document.querySelector('.products')

    productsHTML.addEventListener('click', function (e) {

        if (e.target.classList.contains('bx-plus')) {

            const id = Number(e.target.id);
    
        const productFind = db.products.find(
            (product) => product.id === id
        ); 

        if (db.cart[productFind.id]) {
            if (productFind.quantity <= db.cart[productFind.id].amount) 
                return alert('Este producto se encuentra agotado')

            db.cart[productFind.id].amount++;
        } else {
            db.cart[productFind.id] = {...productFind, amount: 1}
        }

            window.localStorage.setItem('cart', JSON.stringify(db.cart))

            printProductsInCart(db)
            printCartTotal(db)
            printAmountProducts(db)
        }
    })
}

function printProductsInCart(db) {
    const cartProductsHTML = document.querySelector('.cart_products');

    let html = '';

    for (const product in db.cart) {

        const { name, image, price, amount, quantity, id} = db.cart[product]

        console.log({ name, image, price, amount, quantity, id});

        html += `<div class="cart_product">
            <div class="cart_product_img">
            <img src="${image}" alt="">
            </div>
            <div class="cart_product_info">
                <h4>${name} | $${price}</h4>
                <p>stock: ${quantity}</p>

                <div class="cart_product_info--op" id='${id}'>
                    <i class='bx bx-minus'></i>
                    <span class='cart_span'>${amount} unit</span>                        
                    <i class='bx bx-plus'></i>
                    <i class='bx bx-trash' ></i>
                    </div>
                </div>
            </div>`
    }
    

    cartProductsHTML.innerHTML = html
}

function printCartTotal(db) {
    const infoTotal = document.querySelector('.info_total')
    const infoAmount = document.querySelector('.info_amount')

    let totalPrice = 0;
    let totalAmount = 0;

    for (const product in db.cart) {
        totalPrice += db.cart[product].price * db.cart[product].amount
        totalAmount += db.cart[product].amount
    }
    
    infoAmount.textContent = totalAmount + ' units'
    infoTotal.textContent = '$' + totalPrice + '.00'
}

function handleProductsInCart(db) {
    const cartProductsHTML = document.querySelector('.cart_products')
    
    cartProductsHTML.addEventListener('click', function(e) {
        if(e.target.classList.contains('bx-plus')){
            const id = Number(e.target.parentElement.id)

            const productFind = db.products.find(
                (product) => product.id === id
            ); 
    
            if (db.cart[productFind.id]) {
                if (productFind.quantity <= db.cart[productFind.id].amount) 
                    return alert('Este producto se encuentra agotado')
    
                db.cart[productFind.id].amount + 1;
            } else {
                db.cart[productFind.id] = {...productFind, amount: 1}
            }

            db.cart[id].amount++;
        }

        if(e.target.classList.contains('bx-minus')){
            const id = Number(e.target.parentElement.id)

            if(db.cart[id].amount === 1){
                const response = confirm('Estás seguro de que quieres eliminar este producto?')
                if (!response) return;
                delete db.cart[id]
            } else {
                db.cart[id].amount--
            }
        }

        if(e.target.classList.contains('bx-trash')){
            const id = Number(e.target.parentElement.id)

            const response = confirm('Estás seguro de que quieres eliminar este producto?')
                if (!response) return;
            delete db.cart[id];
        }
        
        window.localStorage.setItem('cart', JSON.stringify(db.cart))
        printProductsInCart(db)
        printCartTotal(db)
        printAmountProducts(db)
    })
}

function buyProducts(db) {
    const btnBuy = document.querySelector('.btn__buy')

    btnBuy.addEventListener('click', function () {
        if (Object.values(db.cart).length === 0){
            alert('Aún no has añadido un producto al carrito')
        } else {
            const response = confirm('Estás seguro de realizar la compra?')
            if(!response) return;
        }

        const currentProducts = []

        for (const product of db.products) {
            const productsCart = db.cart[product.id]
            if (product.id === productsCart?.id) {
                currentProducts.push({
                    ...product,
                    quantity: product.quantity - productsCart.amount
                })
            } else {
                currentProducts.push(product)
            }
        }
        db.products = currentProducts
        db.cart = {}

        window.localStorage.setItem('products', JSON.stringify(db.products))
        window.localStorage.setItem('cart', JSON.stringify(db.cart))

        printCartTotal(db)
        printProducts(currentProducts)
        printProductsInCart(currentProducts)
        printAmountProducts(db)
    })
}

function handleFilters(db) {
    const buttons = document.querySelectorAll('.buttons .btn')

    buttons.forEach(function(button) {
        button.addEventListener('click', function (e) {
            const filter = e.target.id
            if (filter === 'all') {
                printProductsAll(db)
            } else {
                const newArray = db.products.filter(function (product) {
                    return product.category === filter
                })
                console.log(newArray);
                printProducts(newArray)
            }
        })
    })
}

function productDescription() {
    const description = document.querySelector('.description')
    const iconX = document.querySelector('.description .bx-x')
    const background = document.querySelector('.background')

    

    document.querySelector('.products').addEventListener('click', (e) => {
        JSON.stringify(localStorage.setItem('selectProduct', e.target.parentElement.parentElement.id))
        if (e.target.classList.contains("name")) {
            description.classList.add('description__show')
            background.classList.add('background__obscure')
        }
        
        iconX.addEventListener('click', () => {
            description.classList.remove('description__show')
            background.classList.remove('background__obscure')
        })       
    
        printProductsDescription()
    })
}

function printProductsDescription() {

    const descriptionHTML = document.getElementById('description__info')
    const products = JSON.parse(localStorage.getItem('products'))
    const id = JSON.parse(localStorage.getItem('selectProduct'))

    const findProduct = products.find((e) => {

        let html= '' 

        let found = e.id === id
        if (e.id === id) {
            html += `
            <div class="product--description">
                <div class="product__img--description">
                    <img src="${e.image}" alt="">
                </div>
                <div class="product__info--description">
                    <div class='product_name--description'>
                        <h4 class='name--description'>${e.name} </h4>
                        <h4 class='category--description'> - ${e.category}</h4>
                    </div>
                    <p class='text_description'>${e.description}</p>
                    <div class='product_info--description--op'>
                        <h5 class='price--description'>$${e.price}.00</h5>
                        <span class='stock--description'>stock: ${e.quantity}</span>
                    </div>
                    
                </div>
            </div>
            `
        }
        descriptionHTML.innerHTML = html
        return found
    })
    return findProduct
}

function darkMode (){
    
    const iconMoon = document.querySelector('.bx-moon')
    const configUser = window.matchMedia('(prefers-color-scheme: dark)')

    const localConfig = localStorage.getItem('theme')

    if (localConfig === 'light') {
        document.body.classList.toggle('light-mode')
    } else if (localConfig === 'dark') {
        document.body.classList.toggle('dark-mode')
    }

    iconMoon.addEventListener('click', function(){

        let themeColor;

        if(localStorage.getItem('theme') === 'dark') {
            iconMoon.classList.remove('bx-sun')
            iconMoon.classList.add('bx-moon')
        } else if (localStorage.getItem('theme') === 'light') {
            iconMoon.classList.remove('bx-moon')
            iconMoon.classList.add('bx-sun')
        }


        if (configUser.matches) {
            document.body.classList.toggle('light-mode')

            themeColor = document.body.classList.contains('light-mode') ? 'light' : 'dark'
        } else {
            document.body.classList.toggle('dark-mode')

            themeColor = document.body.classList.contains('dark-mode') ? 'dark' : 'light'
        }

        localStorage.setItem('theme', themeColor)
    })

}

function printAmountProducts (db) {
    const amountProduct = document.getElementById('amount_products')
    
    let amount = 0;

    for (const products in db.cart) {
        amount += db.cart[products].amount
    }

    amountProduct.textContent = amount
}

function animationScroll() {

    document.getElementById("scrollUp").addEventListener("click", function() {
        window.scrollTo({
          top: 0,
          behavior: "smooth" 
        });
    });

    document.getElementById("scrollHome").addEventListener("click", function() {
        window.scrollTo({
          top: 0,
          behavior: "smooth" 
        });
    });

    document.getElementById("scrollProducts").addEventListener("click", function() {
        window.scrollTo({
          top: 550,
          behavior: "smooth" 
        });
    });

    document.querySelector(".btn_show_more").addEventListener("click", function() {
        window.scrollTo({
          top: 550,
          behavior: "smooth" 
        });
    });

    const headerShow = document.querySelector('.header')

    window.addEventListener('scroll', function() {
        let position = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (position > 0) {
            headerShow.classList.add('header__show')
        } else {
            headerShow.classList.remove('header__show')
        }
    })
    
}



async function main() {

    window.addEventListener('load', function() {
        const loader = document.getElementById('loader');
        this.setTimeout(function(){
            loader.style.display = 'none';
        }, 250)
    });

    const db = {
        products: JSON.parse(window.localStorage.getItem('products')) || (await getProduct("https://ecommercebackend.fundamentos-29.repl.co/")),

        cart: JSON.parse(window.localStorage.getItem('cart')) || {},
    } 

    printProductsAll(db)
    handleShortCart()
    addToCartFromProducts(db)
    printProductsInCart(db)
    printCartTotal(db)
    handleProductsInCart(db)
    buyProducts(db)
    handleFilters(db)
    darkMode()
    printAmountProducts(db)
    animationScroll()
    productDescription()     
}


main();