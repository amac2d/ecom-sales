import React from 'react';
import Header from './header';
import ProductList from './product-list';
import ProductDetails from './product-details';
import CartSummary from './cart-summary';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      view: {
        name: 'catalog',
        params: {}
      },
      cart: []
    };
    this.setView = this.setView.bind(this);
    this.addToCart = this.addToCart.bind(this);
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
        this.setState({ cart: successObj.data });
      });
  }
  addToCart(product) {
    fetch('http://localhost:3001/cartItems', {
      method: 'POST',
      body: JSON.stringify(product),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(promiseObj => promiseObj.json())
      .then(successObj => {
        product.id = successObj.data.insertId;
        this.setState({ cart: [...this.state.cart, product] });
      })
      .catch(error => console.error('Error:', error));
  }
  render() {
    if (this.state.view.name === 'catalog') {
      return (
        <div>
          <Header text='Wicked Sales' cartItemCount={this.state.cart.length} click={this.setView} />
          <ProductList click={this.setView} products={this.state.products} />
        </div>
      );
    } else if (this.state.view.name === 'details') {
      return (
        <div>
          <Header text='Wicked Sales' cartItemCount={this.state.cart.length} click={this.setView} />
          <ProductDetails params={this.state.view.params} click={this.setView} addToCart={this.addToCart} />
        </div>
      );
    } else if (this.state.view.name === 'cart') {
      return (
        <div>
          <Header text='Wicked Sales' cartItemCount={this.state.cart.length} click={this.setView} />
          <CartSummary cartItems={this.state.cart} click={this.setView} />
        </div>
      );
    }
  }
}
