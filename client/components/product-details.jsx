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
    console.log('what is this.state.product:', this.state.product);
    fetch('http://localhost:3001/product?id=' + this.props.params.id)
      .then(promiseObj => promiseObj.json())
      .then(successObj => {
        this.setState({ product: successObj.data[0] });
        // console.log('successObj/this.state.product:', this.props.params.id);
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
    const product = this.state.product;
    product.quantity = this.state.quantity;
    this.props.addToCart(product);
  }
  handleQuantityInput(event) {
    let quantity = this.state.quantity;
    quantity = event.target.value;
    this.setState({ quantity });
  }
  render() {
    if (this.state.product) {
      // console.log('hello from the render', this.state.product);
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
              <input className='text-center' onChange={this.handleQuantityInput} style={{'width': '20%'}} type="number" name='quantity' min='0' defaultValue={this.state.quantity} placeholder='Qty'/>
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
