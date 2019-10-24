import React from 'react';

class ProductListItem extends React.Component {
  constructor(props) {
    super(props);
    this.sendViewStateObj = this.sendViewStateObj.bind(this);
  }
  componentDidMount() {
    // console.log('this.props.element:', this.props.element);
  }
  sendViewStateObj() {
    const viewStateObj = {
      name: 'details',
      params: {
        id: this.props.element.id
      }
    };
    this.props.click(viewStateObj.name, viewStateObj.params);
  }
  render() {
    const img = this.props.element.image;
    return (
      <div className='col-md-4'>
        <div className='productCard card mb-4 shadow-sm' onClick={this.sendViewStateObj}>
          <img src={img} alt="product image" className='img-fluid mb-4' />
          <div className='productCardBody card-body'>
            <p className='productName card-title'>
              <strong>{this.props.element.name}</strong>
            </p>
            <p className='productPrice card-text'>
              ${(this.props.element.price / 100).toFixed(2)}
            </p>
            <p className='productDescription card-text'>
              {this.props.element.shortDescription}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductListItem;
