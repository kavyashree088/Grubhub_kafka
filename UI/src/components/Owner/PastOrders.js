import React, { Component } from "react";
import Navigation from "../Navbar";
import { connect } from "react-redux";
import * as actionCreators from "../../js/actions/ownerActions";
import { Row, Col, Container, Card } from "react-bootstrap";
import "../../css/sidebar.css";

class PastOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderDetails: null,
      updateStatus: false
    };
  }

  componentWillMount() {
    if (!localStorage.getItem("jwtToken")) {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      this.props.history.push("/SignIn");
    }
    this.props.getRestaurantDetails(localStorage.getItem("email"));
  }
  componentWillReceiveProps(nextProps) {
    const newRestaurantDetails = nextProps.restaurant;
    if (newRestaurantDetails !== this.props.restaurant) {
      this.props.getOrdersforRestaurant(newRestaurantDetails._id);
    }
  }
  render() {
    let pastOrderDetails = this.props.getOrders.map(order => {
      if (order.status === "Delivered" || order.status === "Cancelled") {
        let itemsName = order.items.map(item => {
          return <div>{item.itemName}</div>;
        });
        return (
          <div
            as={Col}
            md={3}
            style={{
              margin: " 8px 0 0 8px",
              cursor: "pointer"
            }}
          >
            <Card>
              <Card.Header>Order Id:{order._id}</Card.Header>
              <Card.Body>
                <Card.Title>{order.status}</Card.Title>
                <Card.Text>
                  Time:
                  {
                    order.createdAt
                      .toString()
                      .slice(0, 19)
                      .replace("T", " ")
                      .split(" ")[1]
                  }
                </Card.Text>
                <Card.Text>
                  Date:
                  {
                    order.createdAt
                      .toString()
                      .slice(0, 19)
                      .replace("T", " ")
                      .split(" ")[0]
                  }
                </Card.Text>
                <Card.Text>
                  {order.user.firstName} {order.user.lastName}
                </Card.Text>
                <Card.Text>{itemsName}</Card.Text>
              </Card.Body>
            </Card>
          </div>
        );
      }
      return null;
    });
    return (
      <div>
        <Navigation></Navigation>
        <Row>
          <Col className="col-sm-3">
            <div className="vertical-menu bg-light">
              <a href="/Owner/PastOrders" className="header">
                <h2>Past Orders</h2>
              </a>
              <a href="/OwnerHome">Home</a>
              <a href="/Menu">Menu</a>
              <a href="/Owner/Messages">Messages</a>
              <a href="/OwnerProfile">Profile</a>
              <a href="/Owner/PastOrders" className="active">
                Past Orders
              </a>
            </div>
          </Col>
          <Col className="col-sm-9">
            <Container>
              <div className="pt-3">
                <h1>Your Orders</h1>
              </div>
              <hr></hr>
              <div>
                <h3>Past Orders</h3>
              </div>
              <Row>{pastOrderDetails}</Row>
            </Container>
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStoreToProps(state) {
  return {
    getOrders: state.ownerDetails.getOrdersRestaurant,
    restaurant: state.ownerDetails.restaurantDetails
  };
}
export default connect(
  mapStoreToProps,
  actionCreators
)(PastOrders);
