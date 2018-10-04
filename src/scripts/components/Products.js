import Utils from '../utils';

export default class Products {
  /**
   * constructor
   */
  constructor() {
    this.cart = [];
    this.itemCounter = 0;

    this.addProductToCart = this.addProductToCart.bind(this);
  }

  /**
   * attachEventHandlers
   */
  attachEventHandlers () {
    const productItems = document.querySelectorAll('.product__item');
    const emptyCartButton = document.querySelector('.cart__empty');

    const attachEvent = (productId, button) => {
      button.addEventListener('click', () => this.addProductToCart(parseInt(productId)), false);
    }

    emptyCartButton.addEventListener('click', this.clearCartContents.bind(this));

    productItems.forEach(product => {
      const productId = product.getAttribute('data-id');
      const button = product.querySelectorAll('.product__button-add-to-cart')[0];

      attachEvent(productId, button);
    });
  }

  attachCartEventHandlers () {
    const cartItemContainer = document.querySelectorAll('.cart__item');

    const attachEvent = (productId, button) => {
      button.addEventListener('click', () => this.removeProductFromCart(productId), false);
    }

    cartItemContainer.forEach(product => {
      const productId = product.getAttribute('data-id');
      const button = product.querySelectorAll('.button--remove')[0];

      attachEvent(productId, button);
    })
  }

  /**
   * displayProductsOnPage
   * @param  {Array} products
   */
  displayProductsOnPage () {
    const containerDiv = document.querySelectorAll('.product')[0];
    let allProductsHtml = '';

    this.products.forEach(product => {
      const individualProductMarkup = this.createProductHtmlString(product);

      allProductsHtml += individualProductMarkup;
    });

    containerDiv.innerHTML = allProductsHtml;
  }

  /**
   * updateCartView
   */
  updateCartView (productId) {
    const cart = document.querySelectorAll('.cart__items')[0];
    let cartHtml = '';

    this.cart.forEach(cartItem => {
      const cartItemMarkup = this.createCartHtmlString(cartItem);
      cartHtml += cartItemMarkup;
    })

    cart.innerHTML = cartHtml;
    this.showCartButtons();
  }

  /**
   * showCartButtons
   */
  showCartButtons() {
    const emptyCartButton = document.querySelector('.cart__empty');
    const checkoutCartButton = document.querySelector('.cart__checkout');
    const cartTotalContainer = document.querySelector('.cart__total');

    emptyCartButton.style.display = 'block';
    checkoutCartButton.style.display = 'block';
    cartTotalContainer.style.display = 'block';
    cartTotalContainer.innerHTML = `£${this.calculateTotalPrice()}`
  }

  /**
   * addProductToCart
   * @param {integer}
   */
  addProductToCart (productId) {
    const product = this.products.find(product => product.id === productId);

    if (this.cart.length === 0 || this.productFound(productId) === undefined) {
      this.cart.push({
        product: product,
        quantity: 1
      })
    } else {
      this.cart.forEach((newProduct) => {
        if (newProduct.product.id === productId) {
          newProduct.quantity++;
        }
      })
    }

    this.updateCartView();
  }

  productFound (productId) {
    return this.cart.find(function(item) {
      return item.product.id === productId;
    });
  }

  clearCartContents () {
    const cartItemsContainer = document.querySelector('.cart__items');
    const cartTotalContainer = document.querySelector('.cart__total');
    const checkoutCartButton = document.querySelector('.cart__checkout');
    const emptyCartButton = document.querySelector('.cart__empty');

    cartItemsContainer.innerHTML = '';
    cartTotalContainer.innerHTML = '';
    checkoutCartButton.style.display = 'none';
    emptyCartButton.style.display = 'none';
    cartTotalContainer.style.display = 'none';

    this.cart = [];
  }

  calculateTotalPrice () {
    return this.cart.reduce((total, item) => {
      return total + (item.product.variants[0].price * item.quantity);
    }, 0);
  }


  /**
   * createProductHtmlString
   * @param  {Object} product
   * @return {String}
   */
  createProductHtmlString (product) {
    return `
      <div class="product__item" data-id="${product.id}">
        <div class="product__image" style="background-image: url('${product.images[0].src}');">
        </div>
        <div class="product__text">${product.title}</div>
        <div class="product__button-container">
          <button class="button product__button-add-to-cart" data-action="add">add to cart</button>
        </div>
      </div>
    `;
  }

  /**
   * createCartHtmlString
   * @param  {Object} product
   * @return {String}
   */
  createCartHtmlString (product) {
    return `
      <li class="cart__item" data-id="${product.product.id}">
        <p class="cart__item-name">${product.product.title}</p>
        <p class="cart__item-quantity">x ${product.quantity}</p>
        <p class="cart__item-price">£${product.product.variants[0].price * product.quantity}</p>
      </li>
    `;
  }

  /**
   * getAndDisplayProductsOnPage
   */
  getAndDisplayProductsOnPage () {
    Utils.getData('../data/products.json')
      .then(response => this.products = response.products)
      .then(() => this.displayProductsOnPage())
      .then(() => this.attachEventHandlers())
  }
}
