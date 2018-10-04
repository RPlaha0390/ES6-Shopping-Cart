import Products from './components/Products';

function init () {
  const products = new Products();

  products.getAndDisplayProductsOnPage();
}

window.addEventListener('DOMContentLoaded', init);
