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
    const productContainer = document.querySelectorAll('.product');
    const emptyCartButton = document.querySelector('.cart__empty');

    const attachEvent = (productId, button) => {
      button.addEventListener('click', () => this.addProductToCart(parseInt(productId)), false);
    }

    emptyCartButton.addEventListener('click', this.clearCartContents.bind(this));

    productContainer.forEach(product => {
      const productId = product.firstElementChild.getAttribute('data-id');
      const button = product.querySelectorAll('.button--add')[0];

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
    const containerDiv = document.querySelectorAll('.products')[0];
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

    cartItemsContainer.innerHTML = '';
    cartTotalContainer.innerHTML = '';

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
      <div class="product">
        <div data-id="${product.id}" class="product__item">
          <div class="product__image">
            <img src="${product.images[0].src}" />
          </div>
          <div class="product__text">${product.title}</div>
          <div class="product__buttons">
            <button class="button button--add" data-action="add">add to cart</button>
            <button class="button button--view">quick view</button>
          </div>
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
        <p>${product.product.title}</p>
        <p>${product.product.variants[0].price * product.quantity}</p>
        <p>${product.quantity}</p>
      </li>
    `;
  }

  /**
   * getAndDisplayProductsOnPage
   */
  getAndDisplayProductsOnPage () {
    Utils.getData('https://j-parre.myshopify.com/products.json')
      .then(response => this.products = response.products)
      .then(() => this.displayProductsOnPage())
      .then(() => this.attachEventHandlers())
  }
}
