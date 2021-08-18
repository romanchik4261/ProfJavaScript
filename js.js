const products = [
    {id: 1, title: 'Клубничка', price: 2000},
    {id: 1, title: 'Ягодка', price: 1900},
    {id: 1, title: 'Малинка', price: 1800},
    {id: 1, title: 'Черничка', price: 1500},
]

// list - это массив
// Преобразуем один массив в другой массив
// item - это объекты массива. В каждый объект передается функция renderProduct c двумя параметрами товара и цены.
// Функция фозвращает верстку для отображения каждого товара

const renderProduct = (item) =>
    `<div class="product-item">
        <img class="img" src="image/cardProduct.jpg" alt="cardProduct">
        <h3>${item.title}</h3>
        <p>${item.price} руб.</p>
        <button class="buy-btn">Купить</button>
    </div>`;

const renderPage = list => {
    const productsList = list.map(item => renderProduct(item));
    // productsList - это массив со всеми товарами
    document.querySelector('.products').innerHTML = productsList.join('');
    // добавляем созданный массив
};

renderPage(products);
