const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/'; //тут путь

class List { // 1 базовый класс список товаров
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

    getJson(url) { // получаем массив объектов товаров
        return fetch(url ? url : `${API + this.url}`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
    }

    handleData(data) { //запускает отрисовку либо каталога товаров, либо списка товаров корзины
        this.goods = [...data];
        this.render();
    }

    render() { //вывод товаров на страницу 
        const block = document.querySelector(this.container);
        // В block выведутся все товары
        for (let product of this.goods) { //обходим все товары в массиве
            const productObj = new this.list[this.constructor.name](product); // создали объект и наполнили его свойствами
            // помещаем этот объект в массив объектов
            this.allProducts.push(productObj);
            block.insertAdjacentHTML("beforeend", productObj.render()); // с помощью объекта товаров вызываем метод render() и поскольку это цикл, получаем верстку каждого товара в block
        }
    }


}

class ProductsList extends List { // 2 список товаров каталога. Наследуемся от класса список List
    constructor(cart, container = '.products', url = "/catalogData.json") {
        super(url, container); //super вызывает базовый констркутор. После вызова super запускается init() его вызов прописан в конструкторе класса List
        this.cart = cart;
        this.getJson()
            .then(data => this.handleData(data));

    }

    _init() { //регистрируем кнопку купить
        document.querySelector(this.container).addEventListener('click', e => {
            if (e.target.classList.contains('buy-btn')) {
                this.cart.addProduct(e.target); //в метод addProduct передаем кнопку которую нажали
            }
        });
    }
}

class Cart extends List { // 3 список товаров корзины
    //потомок класса список товаров List 
    constructor(container = ".cart-block", url = "/getBasket.json") {
        super(url, container);
        this.getJson()
            .then(data => {
                this.handleData(data.contents); // выводим все товары в корзине. Теперь в handleData вызывается метод render  и в нем делаем объект класса товар корзины CartItem
            });
    }

    addProduct(element) { // добавляем товар в корзину
        this.getJson(`${API}/addToBasket.json`)//можно не делать эту часть кода, она для демонстрации того, как можно сделать проверку серверу в этом файле одна инструкция "result": 1
            .then(data => {
                if (data.result === 1) {
                    let productId = +element.dataset['id'];
                    //дальше нужно понять полученный товар есть уже в корзине или нет
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if (find) { //если такой товар с таким id есть, то добавляется просто количество
                        find.quantity++;
                        this._updateCart(find);
                    } else { //а если такого товара нет, то создаем
                        let product = {
                            id_product: productId,
                            price: +element.dataset['price'],
                            product_name: element.dataset['name'],
                            quantity: 1
                        };
                        this.goods = [product];
                        this.render();
                    }
                } else {
                    alert('Error');
                }
            })
    }

    _updateCart(product) {
        let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
        block.querySelector('.product-quantity').textContent = `Количество: ${product.quantity}`;
        block.querySelector('.product-price').textContent = `${product.quantity * product.price} руб.`;
    }
}

class Item { // 4 базовый класс товар
    // у всех товаров есть общие свойства, они описаны в этом классе
    constructor(product, img = `image/cardProduct.jpg`) {
        this.product_name = product.product_name;
        this.id = product.id;
        this.price = product.price;
        this.img = img;
    }

    render() { // генерация товара для каталога товаров
        return `<div class="product-item" data-id="${this.id_product}">
        <img class="img" src="${this.img}" alt="img">
        <div class="desk">
            <h3>${this.product_name}</h3>
            <p>${this.price} руб.</p>
            <button class="buy-btn"
            data-id="${this.id_product}"
            data-name="${this.product_name}"
            data-price="${this.price}">Купить</button>
        </div>
    </div>`
    }
}



class ProductItem extends Item { } // 5 товар каталога

class CartItem extends Item { // 6 товар корзины
    constructor(el, img = `image/cardProduct.jpg`) {
        super(el, img);
        this.quantity = el.quantity; // тут добавляется ещё количество
    }

    render() {
        return `<div class="cart-item" data-id="${this.id_product}">
                    <div class="product-bio">
                        <img class="product-bio-img" src="${this.img}" alt="image">
                        <div class="product-desc">
                            <p class="product-title">${this.product_name}</p>
                            <p class="product-quantity">Количество: ${this.quantity}</p>
                            <p class="product-single-price">Стоимость: ${this.price} руб.</p>

                            <div class="right-block">
                                <p class="product-price">Итого: ${this.quantity * this.price} руб.</p>
                                <button class="del-btn" data-id="${this.id_product}">Удалить</button>
                            </div>
                        </div>
                    </div>
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


const list2 = {
    ProductsList: ProductItem,
    Cart: CartItem
};

let cart = new Cart();
let products = new ProductsList(cart);
//чтобы использовать в классе методы другого класса, то
//нужно в конструктор ProductList (список каталог товаров) передать объект класса Cart(корзина) методы которого на нужны