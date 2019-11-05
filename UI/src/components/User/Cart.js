import React, { Component } from "react";
import { connect } from "react-redux";
import * as actionCreators from "../../js/actions/ownerActions";
import { Row, Col, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";

class Cart extends Component {
  constructor(props) {
    super();
    this.state = {
      items: [],
      sum: 0.0
    };
  }

  componentWillMount() {
    console.log("here");
    //this.props.getCartItems(this.props.user._id);
  }
  componentWillReceiveProps(nextProps) {
    const newUser = nextProps.user;
    const newcartItems = nextProps.cartItems;
    const newOrderPlaced = nextProps.orderPlaced;
    const newDeleteAll = nextProps.deleteAll;
    if (newUser !== this.props.user) {
      console.log(newUser);
      this.props.getCartItems(newUser._id);
    }
    if (newcartItems !== this.props.cartItems) {
      let total = 0.0;
      newcartItems.map(item => {
        total = total + parseFloat(item.price);
        return null;
      });
      this.setState({
        items: newcartItems,
        sum: total
      });
    }
    if (
      newOrderPlaced !== this.props.orderPlaced &&
      newOrderPlaced === "Successfully order placed"
    ) {
      this.props.deleteAllCartItems(this.props.user._id);
      this.props.history.push("/UserHome");
    }
    if (
      newDeleteAll !== this.props.deleteAll &&
      newDeleteAll === "Successfully deleted"
    ) {
      console.log("de;ete");
      this.props.getCartItems(this.props.user._id);
    }
  }
  deleteItem = id => event => {
    console.log(id);
    this.props.deleteCartItem(id, this.props.user._id);
  };
  placeOrder = () => {
    let data = {
      items: this.state.items,
      userId: this.props.user._id,
      restaurantId: this.props.restaurant._id
    };
    this.props.placeOrder(data);
  };

  emptyBag = () => {
    this.props.deleteAllCartItems(this.props.user._id);
  };
  render() {
    let cartItemsDisplay = this.state.items.map(item => {
      return (
        <div>
          <Row>
            <Col md={1}>{item.quantity}</Col>
            <Col
              md={3}
              style={{
                color: "blue"
              }}
            >
              {item.itemName}
            </Col>
            <Col
              md={1}
              style={{
                cursor: "pointer"
              }}
              onClick={this.deleteItem(item._id)}
            >
              <i class="trash icon"></i>
            </Col>
            <Col>${item.price}</Col>
          </Row>
          <hr></hr>
        </div>
      );
    });
    return (
      <div>
        <hr></hr>
        {cartItemsDisplay}
        <div>
          {this.state.items.length === 0 ? (
            <div>Your cart is empty</div>
          ) : (
            <div>
              <div>
                <div>Items Total: $ {this.state.sum}</div>
              </div>
              <div className="pt-3">
                <Button
                  variant="light"
                  style={{
                    color: "#0070eb"
                  }}
                  onClick={this.emptyBag}
                >
                  Empty Bag
                </Button>
              </div>
              <div className="pt-3">
                <Button
                  variant="success"
                  className="btn-block"
                  onClick={this.placeOrder}
                >
                  Place Order
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
function mapStoreToProps(state) {
  return {
    user: state.userDetails.userProfile,
    cartItems: state.ownerDetails.cartItems,
    restaurant: state.ownerDetails.restaurantDetailsID,
    orderPlaced: state.ownerDetails.orderPlaced,
    deleteAll: state.ownerDetails.cartEmptied
  };
}
export default withRouter(
  connect(
    mapStoreToProps,
    actionCreators
  )(Cart)
);
