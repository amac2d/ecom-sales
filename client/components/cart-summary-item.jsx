import React from 'react';

class CartSummaryItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: this.props.element.count
    },
      this.removeFromCart = this.removeFromCart.bind(this);
    this.updateFromCart = this.updateFromCart.bind(this);
    this.handleQuantityInput = this.handleQuantityInput.bind(this);
  }
  removeFromCart() {
    const product = this.props.element;
    this.props.removeFromCart(product);
  }
  updateFromCart() {
    const quantity = this.state.quantity;
    if (quantity > 0) {
      const product = this.props.element;
      const newCount = quantity;
      fetch('/api/cartItems', {
        method: 'PATCH',
        body: JSON.stringify({
          cartItemID: product.cartItemID,
          count: newCount
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(promiseObj => promiseObj.json())
        .then(successObj => {
          product.count = parseInt(newCount);
          this.props.updateCartQuantityState();
        })
        .catch(error => console.error('Error:', error));
    } else {
      this.removeFromCart();
    }
  }
  handleQuantityInput(event) {
    let quantity = this.state.quantity;
    quantity = parseInt(event.target.value);
    this.setState({ quantity });
  }
  render() {
    const product = this.props.element;
    const priceStr = product.price.toString();
    return (
      <div className='main col m-4' style={{ 'maxWidth': '540px' }}>
        <div className='row'>
          <img src={product.image} alt="product image" className='img-thumbnail col-8 col-sm-4 col-md-4 col-lg-4' />
          <div className='col-10 col-sm-8 col-md-8 col-lg-8'>
            <p className='cartSummaryName'>
              <strong>{product.name}</strong>
            </p>
            <p className='cartSummaryItemPrice'>
                <strong>
                  ${priceStr.slice(0, -2)}
                </strong>
                <sup>
                  .{priceStr.slice(-2)}
                </sup>
              </p>            <div className='form-row'>
              <input className='text-center form-control' onChange={this.handleQuantityInput} style={{ 'width': '20%' }} type="number" name='quantity' min='0' defaultValue={this.state.quantity} placeholder='Qty' />
              <button onClick={this.updateFromCart} className='btn btn-info' >Update</button>
              <button onClick={this.removeFromCart} className='btn btn-danger' >Remove all</button>
            </div>
          </div>
        </div>
      </div>
    );

  }
}

export default CartSummaryItem;
