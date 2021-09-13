Vue.component('products', {
  props: ['products', 'img'],
  template: `<div class="products">
              <product v-for="item of products" 
              :key="item.id_product"
              :img="img"
              :product="item"></product>
            </div>`
}); //в цикле обходим весь массив и для каждого товара строим вложенный компонент product

Vue.component('product', { //вложенный компонент
  props: ['product', 'img'], //сторим верстку каждого товара
  template: `<div class="product-item">
                <img :src="img" class="img" alt="img">
                <div class="desc">
                  <h3>{{product.product_name}}</h3>
                  <p>{{product.price}}</p>
                  <button class="buy-btn" @click="$root.addProduct(product)">Купить</button>
                </div>
            </div>` //click вызывает метод addProduct
})

  //Можно так написать < button class="buy-btn" @click="$parent.$emit('add-product', product)">Купить</button >
  // Эта конструкция работает быстрее $parent.$emit это конструкция которая дает возможность передавать данные из вложенного компонента на верх. Регистрируем событие add-product и при срабатывании события вызывается метод добавить товар addProduct и принимает на вход объект товара product