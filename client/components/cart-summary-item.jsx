import React from 'react';

class CartSummaryItem extends React.Component {
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
          </div>
        </div>
      </div>
    );

  }
}

export default CartSummaryItem;
