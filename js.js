const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/'; //тут путь

class ProductList {
    constructor(container = '.products') {
        this.container = container;
        this.goods = [];
        this._getProducts()
            .then(data => {
                this.goods = [...data];
                this.render() //вывод товаров на страницу 
            });

        this.priceGoods(); //сумма товаров
        this.result(); //вывод суммы
    }

    _getProducts() {
        return fetch(`${API}/catalogData.json`) // тут название файла
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            });
    }

    // fetchProducts() {
    //     this.goods = [
    //         { id: 1, title: 'Клубничка', price: 2000 },
    //         { id: 2, title: 'Ягодка', price: 1900 },
    //         { id: 3, title: 'Малинка', price: 1800 },
    //         { id: 4, title: 'Черничка', price: 1500 },
    //     ]
    // }

    render() { //вывод товаров на страницу 
        const block = document.querySelector(this.container);
        // В block выведутся все товары
        for (let product of this.goods) {
            const item = new ProductItem(product);
            block.insertAdjacentHTML("beforeend", item.render()); //добавляем верстку отдельного товара в block
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

}

class ProductItem { //отдельный товар
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

class basket { //корзина товаров

    generate() { //генерация списка товаров корзины

    }

    addGoods() { //добавляем товар в корзину

    }

    delGoods() { //удаление товара из корзины

    }

    clearbasket() { //очищение корзины

    }
}

class basketGoods { //элемент товара в корзине

    renderGood() { // генерация товара

    }

    amountGoods() { //изменение кол-ва товаров

    }
}

let list = new ProductList();