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
    console.log('hello from updateFromCart:', this.state.quantity);
    console.log('yes update should work now from updateFromCart!!!!');
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
          console.log('what is in successObj in updateFromCart PATCH:', successObj);
          console.log('what is product:', product);
          product.count = parseInt(newCount);
          console.log('what is product after new count:', product);
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
    return (
      <div className='main col m-4' style={{ 'maxWidth': '540px' }}>
        <div className='row'>
          <img src={product.image} alt="product image" className='img-thumbnail col-3 col-sm-3 col-md-3 col-lg-3' />
          <div className='col-9 col-sm-9 col-md-9 col-lg-9 m-auto'>
            <p className='productDetailsName'>
              <strong>{product.name}</strong>
            </p>
            <p>${(product.price / 100).toFixed(2)}</p>
            <p>{product.shortDescription}</p>
            <input className='text-center' onChange={this.handleQuantityInput} style={{ 'width': '20%' }} type="number" name='quantity' min='0' defaultValue={this.state.quantity} placeholder='Qty' />
            <button onClick={this.updateFromCart} >Update Qty</button>
            <button onClick={this.removeFromCart}>Remove all from Cart</button>
          </div>
        </div>
      </div>
    );

  }
}

export default CartSummaryItem;
