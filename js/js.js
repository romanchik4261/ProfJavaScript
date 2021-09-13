const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses'; //тут путь

const app = new Vue({
    el: '#app',

    data: {
        catalogUrl: '/catalogData.json',
        cartUrl: '/getBasket.json',
        cartItems: [],
        products: [],
        filtered: [],
        imgCatalog: 'image/cardProduct.jpg',
        imgCart: 'image/cardProduct.jpg',
        userSearch: '', //для фильтрации
        showCart: false // для того чтобы показывать или скрывать корзину, по умолчанию скрыта
    },

    methods: {
        getJson(url) {
            return fetch(url)
                .then(result => result.json())
                .catch(error => {
                    console.log(error);
                })
        },

        addProduct(item) {// добавляем товар в корзину
            this.getJson(`${API}/addToBasket.json`)//можно не делать эту часть кода, она для демонстрации того, как можно сделать проверку сервера, в этом файле одна инструкция "result": 1
                .then(data => {
                    if (data.result === 1) { //после считывания файла, если result равен1, значит доступ к серверу есть

                        let find = this.cartItems.find(el => el.id_product === item.id_product);//дальше нужно понять полученный товар есть уже в корзине или нет.

                        if (find) { //если такой товар с таким id есть, то добавляется количество на 1
                            find.quantity++;
                        } else { //а если такого товара нет, то создаем его
                            let product = Object.assign({ quantity: 1 }, item); //создаем товар на основе двух объектов в параметрах
                            this.cartItems.push(product)
                        }
                    }
                })
        },

        filter(userSearch) {
            let regexp = new RegExp(userSearch, 'i'); // рег. выражение проверяет название каждого товара на соответствие введенному значению в инпут, регист не учитывается
            this.filtered = this.products.filter(el => regexp.test(el.product_name)); // обходим массив всех товаров и из товара берем название товара, проверяем название на соответствие рег. выражению и такие товары помещаем в массив filtered (массив содержащий элементы соответствующие правилу)
        },

        remove(item) {
            this.getJson(`${API}/addToBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        if (item.quantity > 1) {
                            item.quantity--;
                        } else {
                            this.cartItems.splice(this.cartItems.indexOf(item), 1);
                        }
                    }
                })
        }
    },

    mounted() { //при создании объекта запускается этот метод
        this.getJson(`${API + this.cartUrl}`)
            .then(data => {
                for (let item of data.contents) {
                    this.cartItems.push(item);
                }
            });
        this.getJson(`${API + this.catalogUrl}`)
            .then(data => {
                for (let el of data) {
                    this.products.push(el);
                    this.$data.filtered.push(el); //можно к свойствам из data обращаться не только через this, но и через $, это тоже работает. Если нет локального data можно обращаться через this
                }
            });
        this.getJson(`getProducts.json`) //локальный файл
            .then(data => {
                for (let el of data) {
                    this.products.push(el);
                    this.filtered.push(el);
                }
            })
    },

})