const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/'; //тут путь

class List { //список всех товаров
    constructor(url, container, list = list2) {
        this.container = container;
        this.list = list;
        this.url = url;
        this.goods = [];
        this.allProducts = [];
        this._init();

        // this._getProducts()
        //     .then(data => {
        //         this.goods = [...data];
        //         this.render() //вывод товаров на страницу 
        //     });
    }

    render() { //вывод товаров на страницу 
        const block = document.querySelector(this.container);
        // В block выведутся все товары
        for (let product of this.goods) {
            const item = new Item(product);
            block.insertAdjacentHTML("beforeend", item.render()); //добавляем верстку отдельного товара в block
        }
    }
}

class ProductsList extends List {
    constructor()
}

class Item { //отдельный товар
    constructor(product, img = `image/cardProduct.jpg`) {
        this.product_name = product.product_name;
        this.id = product.id;
        this.price = product.price;
        this.img = img;
    }

    render() { // верстка товара
        return `<div class="product-item">
        <img class="img" src="${this.img}">
        <h3>${this.product_name}</h3>
        <p>${this.price} руб.</p>
        <button class="buy-btn">Купить</button>
    </div>`
    }
}

class Basket { //корзина товаров
    constructor(container = '.cart-block') {
        this.container = container;
        this.goods = [];
        this._clickBasket();
        this._generateBasket()
            .then(data => {
                this.goods = data.contents;
                this.render() //вывод товаров 
                this.priceGoods(); //сумма товаров
                this.result(); //вывод суммы
            });
    }

    _clickBasket() {
        document.querySelector(".btn-cart").addEventListener('click', () => {
            document.querySelector(this.container).classList.toggle('invisible');
        });
    }

    _generateBasket() { //генерация списка товаров корзины
        return fetch(`${API}/getBasket.json`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            });
    }

    render() { //вывод товаров на страницу 
        const block = document.querySelector(this.container);
        // В block выведутся все товары
        for (let product of this.goods) {
            const item = new basketGoods();
            block.insertAdjacentHTML("beforeend", item.renderGood(product)); //добавляем верстку отдельного товара в block
        }
        block.insertAdjacentHTML("beforeend", this.result());
    }

    priceGoods() { //сумма товаров
        return this.goods.reduce(function (sum, current) {
            return sum + current.price;
        }, 0);
    }

    result() { //вывод суммы
        return `<div class="resultProduct">
        <p>В корзине товаров на сумму ${this.priceGoods()} руб.</p>
        </div>`
    }

    addGoods() { //добавляем товар в корзину

    }

    delGoods() { //удаление товара из корзины

    }

    clearbasket() { //очищение корзины

    }
}

class basketGoods { //элемент товара в корзине

    renderGood(product) { // генерация товара
        return `<div class="cart-item" data-id="${product.id_product}">
                    <div class="product-bio">
                        <img class="product-bio-img" src="image/cardProduct.jpg" alt="image">
                        <div class="product-desc">
                            <p class="product-title">${product.product_name}</p>
                            <p class="product-quantity">Количество: ${product.quantity}</p>
                            <p class="product-single-price">Стоимость: ${product.price} руб.</p>

                            <div class="right-block">
                                <p class="product-price">Итого: ${product.quantity * product.price} руб.</p>
                                <button class="del-btn" data-id="${product.id_product}">Удалить</button>
                            </div>
                        </div>
                    </div>
                </div>`

    }

    amountGoods() { //изменение кол-ва товаров

    }
}

const list2 = {
    ProductsList: ProductItem,
    Cart: CartItem
};

let cart = new Cart();
let products = new ProductsList(cart);