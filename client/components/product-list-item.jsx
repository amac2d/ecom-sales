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
    const priceStr = this.props.element.price.toString();
    return (
      <div className='col-md-3'>
        <div className='productCard card mb-4 shadow-sm' onClick={this.sendViewStateObj}>
          <img src={img} alt={this.props.element.name} className='img-fluid p-3' />
          <div className='productCardBody card-body'>
            <p className='productName card-title'>
              <strong>{this.props.element.name}</strong>
            </p>
            <p className='productPrice card-text price'>
              <strong>
                ${priceStr.slice(0, -2)}
              </strong>
              <sup>
                .{priceStr.slice(-2)}
              </sup>
            </p>
            <p className='productDescription card-text'>
              <i>
                {this.props.element.shortDescription}
              </i>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductListItem;
