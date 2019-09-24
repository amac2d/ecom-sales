import React from 'react';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.showCartSummary = this.showCartSummary.bind(this);
  }
  showCartSummary() {
    const viewStateObj = {
      name: 'cart',
      params: {}
    };
    this.props.click(viewStateObj.name, viewStateObj.params);
  }
  render() {
    return (
      <h1 className='col-sm-12 col-md-12 col-lg-12 row'>
        <div className='col mx-4' >
          {this.props.text}
        </div>
        <div className='col text-right'>
          <span className='' style={{ fontSize: '1.5rem' }}> {this.props.cartItemCount} Items</span>
          <img className='' src="/images/shoppingCartIcon.png" alt="shopping cart for wicked sales" style={{ height: '2.25rem' }} onClick={this.showCartSummary} />
        </div>
      </h1>
    );
  }
}

export default Header;
