import React from 'react';

class CartSummaryItem extends React.Component {
  constructor(props) {
    super(props);
    this.removeFromCart = this.removeFromCart.bind(this);
  }
  removeFromCart() {
    const product = this.props.element;
    this.props.removeFromCart(product);
  }
  handleQuantityInput(event) {
    let quantity = this.state.quantity;
    quantity = event.target.value;
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
            <button onClick={this.removeFromCart}>Remove from Cart</button>
          </div>
        </div>
      </div>
    );

  }
}

export default CartSummaryItem;
