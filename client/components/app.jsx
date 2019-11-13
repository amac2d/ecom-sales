import React from 'react';
import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';
import CartSummary from './cart-summary';
import CheckoutForm from './checkout-form';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      view: {
        name: 'catalog',
        params: {}
      },
      cart: [],
      cartQuantity: 0,
      cartID: null
    };
    this.setView = this.setView.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.updateCartQuantityState = this.updateCartQuantityState.bind(this);
  }
  componentDidMount() {
    this.getProducts();
    this.getCartItems();
  }
  getProducts() {
    fetch('/api/products')
      .then(promiseObj => promiseObj.json())
      .then(successObj => {
        this.setState({ products: successObj.data });
      });
  }
  setView(name, params) {
    this.setState({
      view: {
        name,
        params
      }
    });
  }
  getCartItems() {
    fetch('/api/cartItems')
      .then(promiseObj => promiseObj.json())
      .then(successObj => {
        this.setState({ cart: successObj.data }, this.updateCartQuantityState);
      });
  }
  updateCartQuantityState() {
    let cartQuantity = 0;
    const cartItemsArray = this.state.cart;
    for (let index = 0; index < cartItemsArray.length; index++) {
      cartQuantity += parseInt(cartItemsArray[index].count);
    }
    this.setState({ cartQuantity });
  }
  addToCart(product) {
    if (this.state.cart.find(item => item.productID === product.id)) {
      const cartItem = this.state.cart.filter(item => item.productID === product.id);
      cartItem[0].count = parseInt(product.count) + parseInt(cartItem[0].count);
      fetch('/api/cartItems', {
        method: 'PATCH',
        body: JSON.stringify({
          cartItemID: cartItem[0].cartItemID,
          count: cartItem[0].count
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(promiseObj => promiseObj.json())
        .then(successObj => {
          this.updateCartQuantityState();
        })
        .catch(error => console.error('Error:', error));
    } else {
      fetch('/api/cartItems', {
        method: 'POST',
        body: JSON.stringify(product),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(promiseObj => promiseObj.json())
        .then(successObj => {
          const newProduct = Object.assign({}, product);
          newProduct.cartItemID = successObj.data.insertId;
          newProduct.productID = product.id;
          this.setState({ cart: [...this.state.cart, newProduct] }, this.updateCartQuantityState);
        })
        .catch(error => console.error('Error:', error));
    }
  }
  removeFromCart(product) {
    fetch(`/api/cartItems`, {
      method: 'DELETE',
      body: JSON.stringify({
        cartItemID: product.cartItemID
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(promiseObj => promiseObj.json())
      .then(successObj => {
        this.setState({ cart: this.state.cart.filter(element => element.cartItemID !== product.cartItemID) }, this.updateCartQuantityState);
      })
      .catch(error => console.error('Error:', error));
  }
  placeOrder(orderObj) {
    fetch('/api/orders.php', {
      method: 'POST',
      body: JSON.stringify(orderObj),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(promiseObj => promiseObj.json())
      .then(successObj => {
        this.setState({
          cart: [],
          view: {
            name: 'catalog',
            params: {}
          }
        });
      })
      .catch(error => console.error('Error:', error));
  }
  render() {
    if (this.state.view.name === 'catalog') {
      return (
        <div>
          <Header text='PC Craft' cartItemCount={this.state.cartQuantity} click={this.setView} />
          <ProductList click={this.setView} products={this.state.products} />
        </div>
      );
    } else if (this.state.view.name === 'details') {
      return (
        <div>
          <Header text='PC Craft' cartItemCount={this.state.cartQuantity} click={this.setView} />
          <ProductDetails params={this.state.view.params} click={this.setView} addToCart={this.addToCart} />
        </div>
      );
    } else if (this.state.view.name === 'cart') {
      return (
        <div>
          <Header text='PC Craft' cartItemCount={this.state.cartQuantity} click={this.setView} />
          <CartSummary cartItems={this.state.cart} click={this.setView} removeFromCart={this.removeFromCart} updateCartQuantityState={this.updateCartQuantityState} />
        </div>
      );
    } else if (this.state.view.name === 'checkout') {
      return (
        <div>
          <Header text='PC Craft' cartItemCount={this.state.cartQuantity} click={this.setView} />
          <CheckoutForm onSubmit={this.placeOrder} click={this.setView} cartItems={this.state.cart} />
        </div>
      );
    }
  }
}
