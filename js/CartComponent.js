Vue.component('cart', {
  props: ['cartItems', 'img', 'visibility'],
  template:
    `<div class="cart-block" v-show="visibility">
        <cart-item v-for="item of cartItems"
          :key="item.id_product"
          :img="img"
          :cart-item="item">
        </cart-item>
      </div>`
});

Vue.component('cart-item', {
  props: ['img', 'cartItem'],
  template:
    `<div class="cart-item">
        <div class="product-bio">
          <img :src="img" class="img" alt="img">
            <div class="product-desc">
              <div class="product-title">{{cartItem.product_name}}</div>
              <div class="product-quantity">Количество: {{cartItem.quantity}}</div>
              <div class="product-single-price">Стоиомость: {{cartItem.price}} руб.</div>
            </div>
        </div>

        <div class="right-block">
          <div class="product-price"> ИТОГО: 
            {{cartItem.quantity*cartItem.price}} руб.
          </div>
          <button class="del-btn" @click="$root.remove(cartItem)">Удалить</button>
        </div>
      </div>`
})