import React from 'react';
import ProductListItem from './product-list-item';

class ProductList extends React.Component {
  render() {
    return (
      <div className='productListContainer main'>
        <div className='album py-4 bg-light'>
          <div className='row mx-4'>
            {this.props.products.map(element => <ProductListItem key={element.id} element={element} click={this.props.click}/>)}
          </div>
        </div>
      </div>
    );
  }
}

export default ProductList;
