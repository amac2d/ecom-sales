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

      return (
        <div className='main col m-4'>

          <div className='row col mb-4'>
            <div onClick={this.sendBackToCatalog}>&#60; Back to catalog</div>
          </div>

          <div className='row'>
            <img src={product.image} alt="product image" className='img-fluid col-md-6' />
            <div className='col-md-6 m-auto'>

              <p className='productDetailsName'>
                <strong>{product.name}</strong>
              </p>
              <p>${(product.price / 100).toFixed(2)}</p>
              <p>{product.shortDescription}</p>
              <input className='text-center' onChange={this.handleQuantityInput} style={{ 'width': '20%' }} type="number" name='quantity' min='0' defaultValue={this.state.quantity} placeholder='Qty' />
              <button onClick={this.addToCart}>Add to Cart</button>

            </div>

          </div>

          <div className='row col mt-4'>{product.longDescription}</div>

        </div>
      );
    } else {
      return null;
    }
  }
}

export default ProductDetails;
