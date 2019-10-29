import React from 'react';

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      creditCard: '',
      shippingAddress: ''
    };
    this.handleNameInput = this.handleNameInput.bind(this);
    this.handleCreditCardInput = this.handleCreditCardInput.bind(this);
    this.handleShippingAddressInput = this.handleShippingAddressInput.bind(this);
    this.handlePlaceOrder = this.handlePlaceOrder.bind(this);
    this.sendBackToCatalog = this.sendBackToCatalog.bind(this);
  }
  handleNameInput(event) {
    let name = this.state.name;
    name = event.target.value;
    this.setState({ name });
  }
  handleCreditCardInput(event) {
    let creditCard = this.state.creditCard;
    creditCard = event.target.value;
    this.setState({ creditCard });
  }
  handleShippingAddressInput(event) {
    let shippingAddress = this.state.shippingAddress;
    shippingAddress = event.target.value;
    this.setState({ shippingAddress });
  }
  handlePlaceOrder(event) {
    event.preventDefault();
    this.props.onSubmit(this.state);
    this.setState({
      name: '',
      creditCard: '',
      shippingAddress: ''
    });
  }
  sendBackToCatalog() {
    const setViewToCatalogObj = {
      name: 'catalog',
      params: {}
    };
    this.props.click(setViewToCatalogObj.name, setViewToCatalogObj.params);
  }
  render() {
    const cartItems = this.props.cartItems;
    let priceTotal = 0;
    for (let indexPrice = 0; indexPrice < cartItems.length; indexPrice++) {
      priceTotal += cartItems[indexPrice].price * cartItems[indexPrice].count;
    }
    return (
      <div className='checkoutForm container main col-9  col-md-6 col-lg-6'>
        <div>
          <div>
            <h3>Checkout</h3>
            Order Total: ${(priceTotal / 100).toFixed(2)}
          </div>
        </div>
        <br />
        <div>
          <div className='mb-3' >
            Name
            <br />
            <input value={this.state.name} onChange={this.handleNameInput} type="text" placeholder='Name' className='form-control' />
          </div>
          <div className='mb-3' >
            Credit Card
            <br />
            <input value={this.state.creditCard} onChange={this.handleCreditCardInput} type="text" placeholder='Credit Card #' className='form-control' />
          </div>
          <div className='mb-3' >
            Shipping Address
            <br />
            <textarea value={this.state.shippingAddress} onChange={this.handleShippingAddressInput} name="" id="" cols="30" rows="10" placeholder='Street Address, City, State, Zipcode' className='form-control'></textarea>
          </div>
          <div className='mb-3 form-row' >
            <div className='col-6'>
              <span onClick={this.sendBackToCatalog} className='float-left' >&#60; Continue Shopping</span>
            </div>
            <div className='col-6'>
              <button onClick={this.handlePlaceOrder} className='float-right btn btn-primary' >Place Order</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutForm;