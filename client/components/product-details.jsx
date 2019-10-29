import React from 'react';

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      quantity: 1
    };
    this.sendBackToCatalog = this.sendBackToCatalog.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.handleQuantityInput = this.handleQuantityInput.bind(this);
  }
  componentDidMount() {
    fetch('/api/product?id=' + this.props.params.id)
      .then(promiseObj => promiseObj.json())
      .then(successObj => {
        this.setState({ product: successObj.data[0] });
      });
  }
  sendBackToCatalog() {
    const setViewToCatalogObj = {
      name: 'catalog',
      params: {}
    };
    this.props.click(setViewToCatalogObj.name, setViewToCatalogObj.params);
  }
  addToCart() {
    const quantity = this.state.quantity
    if (quantity > 0) {
      const product = this.state.product;
      product.count = quantity;
      this.props.addToCart(product);
    }
  }
  handleQuantityInput(event) {
    let quantity = this.state.quantity;
    quantity = parseInt(event.target.value);
    this.setState({ quantity });
  }
  render() {
    if (this.state.product) {
      const product = this.state.product;
      const priceStr = this.state.product.price.toString();
      return (
        <div className='main col m-4'>

          <div className='row col mb-4'>
            <div onClick={this.sendBackToCatalog}>&#60; Back to catalog</div>
          </div>

          <div className='row mb-4'>
            <img src={product.image} alt={product.name} className='img-fluid col-md-6' />
            <div className='col-md-6 p-5'>
              <p className='productDetailsName'>
                <strong>{product.name}</strong>
              </p>
              <p className='productDetailsPrice'>
                <strong>
                  ${priceStr.slice(0, -2)}
                </strong>
                <sup>
                  .{priceStr.slice(-2)}
                </sup>
              </p>              <p>{product.shortDescription}</p>
              <div className='form-row' >
                <input className='text-center form-control' onChange={this.handleQuantityInput} style={{ 'width': '20%' }} type="number" name='quantity' min='0' defaultValue={this.state.quantity} placeholder='Qty' />
                <button onClick={this.addToCart} className='btn btn-primary' >Add to Cart</button>
              </div>
            </div>
          </div>
          <ul className='col-md-6'>{product.longDescription.map(text => <li>{text}</li>)}</ul>

        </div>
      );
    } else {
      return null;
    }
  }
}

export default ProductDetails;
