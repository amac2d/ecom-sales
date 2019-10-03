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
      cartQuantity: 0
    };
    this.setView = this.setView.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
  }
  componentDidMount() {
    this.getProducts();
    this.getCartItems();
  }
  getProducts() {
    fetch('http://localhost:3001/products')
      .then(promiseObj => promiseObj.json())
      .then(successObj => {
        this.setState({ products: successObj.data });
        // console.log('what is the successObj:', successObj);
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
    fetch('http://localhost:3001/cartItems')
      .then(promiseObj => promiseObj.json())
      .then(successObj => {
        this.setState({ cart: successObj.data }, this.updateCartQuantityState);
        console.log('what is in getCartItems:', successObj);
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
    // console.log('what is product in addToCart in app.jsx:', product);
    if (this.state.cart.find(element => element.productID === product.id)) {
      console.log('yes update should work now!!!!');
    } else {
      fetch('http://localhost:3001/cartItems', {
        method: 'POST',
        body: JSON.stringify(product),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(promiseObj => promiseObj.json())
        .then(successObj => {
          console.log('what is in successObj in addToCart:', successObj);
          const newProduct = Object.assign({}, product);
          newProduct.cartItemID = successObj.data.insertId;
          newProduct.productID = product.id;
          this.setState({ cart: [...this.state.cart, newProduct] }, this.updateCartQuantityState);
        })
        .catch(error => console.error('Error:', error));
    }
  }
  removeFromCart(product) {
    // fetch(`http://localhost:3001/cartItems?cartItemID=${product.cartItemID}`, {
    fetch(`http://localhost:3001/cartItems`, {
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
          <Header text='Wicked Sales' cartItemCount={this.state.cartQuantity} click={this.setView} />
          <ProductList click={this.setView} products={this.state.products} />
        </div>
      );
    } else if (this.state.view.name === 'details') {
      return (
        <div>
          <Header text='Wicked Sales' cartItemCount={this.state.cartQuantity} click={this.setView} />
          <ProductDetails params={this.state.view.params} click={this.setView} addToCart={this.addToCart} />
        </div>
      );
    } else if (this.state.view.name === 'cart') {
      return (
        <div>
          <Header text='Wicked Sales' cartItemCount={this.state.cartQuantity} click={this.setView} />
          <CartSummary cartItems={this.state.cart} click={this.setView} removeFromCart={this.removeFromCart} />
        </div>
      );
    } else if (this.state.view.name === 'checkout') {
      return (
        <div>
          <Header text='Wicked Sales' cartItemCount={this.state.cartQuantity} click={this.setView} />
          <CheckoutForm onSubmit={this.placeOrder} click={this.setView} cartItems={this.state.cart} />
        </div>
      );
    }
  }
}
