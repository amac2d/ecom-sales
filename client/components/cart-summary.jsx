import React from 'react';
import CartSummaryItem from './cart-summary-item';

class CartSummary extends React.Component {
  constructor(props) {
    super(props);
    this.sendBackToCatalog = this.sendBackToCatalog.bind(this);
    this.showCheckout = this.showCheckout.bind(this);
  }
  sendBackToCatalog() {
    const setViewToCatalogObj = {
      name: 'catalog',
      params: {}
    };
    this.props.click(setViewToCatalogObj.name, setViewToCatalogObj.params);
  }
  showCheckout() {
    const setViewToCheckout = {
      name: 'checkout',
      params: {}
    };
    this.props.click(setViewToCheckout.name, setViewToCheckout.params);
  }
  render() {
    if (this.props.cartItems.length === 0) {
      return (
        <div className='cartSummaryContainer main'>
          <div className='col mx-auto'>
            <div className='row col mb-4'>
              <div onClick={this.sendBackToCatalog}>&#60; Back to catalog</div>
            </div>
            <br />
            <div>
              <h3>My Cart</h3>
            </div>
            <div>
              Your Cart is Empty
            </div>
            <div>Item Total $0.00</div>
          </div>
        </div>
      );
    } else {
      const cartItemPrice = this.props.cartItems;
      let priceTotal = 0;
      for (let indexPrice = 0; indexPrice < cartItemPrice.length; indexPrice++) {
        priceTotal += cartItemPrice[indexPrice].price;
      }
      return (
        <div className='cartSummaryContainer main'>
          <div className='col mx-auto'>
            <div className='row col mb-4'>
              <div onClick={this.sendBackToCatalog}>&#60; Back to catalog</div>
            </div>
            <br />
            <div>
              <h3>My Cart</h3>
            </div>
            <div>
              {this.props.cartItems.map(element => <CartSummaryItem key={element.id} element={element} />)}
            </div>
            <div>Item Total ${(priceTotal / 100).toFixed(2)}</div>
            <button onClick={this.showCheckout}>Checkout</button>
          </div>
        </div>
      );
    }
  }
}

export default CartSummary;
