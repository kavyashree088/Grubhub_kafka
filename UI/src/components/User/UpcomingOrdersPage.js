import React, { Component } from "react";
import Navigation from "../Navbar";
import { connect } from "react-redux";
import * as actionCreators from "../../js/actions/index";
import { Container, Card, Col, Row } from "react-bootstrap";
import "../../css/grubhub.css";

class UpcomingOrdersPage extends Component {
  constructor(props) {
    super();
    this.state = {
      items: []
    };
  }

  async componentWillMount() {
    if (!localStorage.getItem("jwtToken")) {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      this.props.history.push("/SignIn");
    }
    await this.props.getUserProfile(localStorage.getItem("email"));
    console.log(this.props.profile);
  }
  componentWillReceiveProps(nextProps) {
    const newProfile = nextProps.profile;
    if (newProfile !== this.props.profile) {
      this.props.getOrderDetails(newProfile._id);
    }
  }
  clickMessage = order => event => {
    console.log(order._id);
    this.props.history.push({
      pathname: "/user/Messages",
      state: { restaurant: order.restaurant, userId: order.user._id }
    });
  };
  render() {
    let itemDetails = id => {
      let orders = this.props.orderDetails.map(order => {
        let items = "";
        if (order._id === id) {
          items = order.items.map(item => {
            return <div>{item.itemName}</div>;
          });
        }
        return items;
      });
      return orders;
    };
    let newOrders = this.props.orderDetails.map(order => {
      if (order.status === "New") {
        return (
          <div
            style={{
              margin: " 8px 0 0 8px"
            }}
            className="pt-3"
          >
            <Card>
              <Card.Header>
                <a>Order Id:{order._id}</a>
                <a
                  class="float-right"
                  href="#"
                  onClick={this.clickMessage(order)}
                >
                  Message Restaurant
                </a>
              </Card.Header>
              <Card.Body as={Row}>
                <Col>
                  <Card.Title>{order.name}</Card.Title>
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
                </Col>
                <Col>
                  <b>Items</b>
                  <Card.Text>{itemDetails(order._id)}</Card.Text>
                </Col>
                <Col>
                  <b>Status</b>
                  <Card.Text>{order.status}</Card.Text>
                </Col>
              </Card.Body>
            </Card>
          </div>
        );
      }
      return null;
    });
    let preparingOrders = this.props.orderDetails.map(order => {
      if (order.status === "Preparing") {
        return (
          <div
            style={{
              margin: " 8px 0 0 8px"
            }}
            className="pt-3"
          >
            <Card>
              <Card.Header>
                <a>Order Id:{order._id}</a>
                <a>Message Restaurant</a>
              </Card.Header>
              <Card.Body as={Row}>
                <Col>
                  <Card.Title>{order.name}</Card.Title>
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
                </Col>
                <Col>
                  <b>Items</b>
                  <Card.Text>{itemDetails(order._id)}</Card.Text>
                </Col>
                <Col>
                  <b>Status</b>
                  <Card.Text>{order.status}</Card.Text>
                </Col>
              </Card.Body>
            </Card>
          </div>
        );
      }
      return null;
    });
    let readyOrders = this.props.orderDetails.map(order => {
      if (order.status === "Ready") {
        return (
          <div
            style={{
              margin: " 8px 0 0 8px"
            }}
            className="pt-3"
          >
            <Card>
              <Card.Header>
                <a>Order Id:{order._id}</a>
                <a>Message Restaurant</a>
              </Card.Header>
              <Card.Body as={Row}>
                <Col>
                  <Card.Title>{order.name}</Card.Title>
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
                </Col>
                <Col>
                  <b>Items</b>
                  <Card.Text>{itemDetails(order._id)}</Card.Text>
                </Col>
                <Col>
                  <b>Status</b>
                  <Card.Text>{order.status}</Card.Text>
                </Col>
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
              <a href="/user/PastOrders" className="header">
                <h2>Upcoming Orders</h2>
              </a>
              <a href="/UserHome">Home</a>
              <a href="/user/upcomingOrders" className="active">
                Upcoming orders
              </a>
              <a href="/user/Messages">Messages</a>
              <a href="/Profile">Profile</a>
              <a href="/user/AddressAndPhone">Address and phone</a>
              <a href="/user/PastOrders">Past orders</a>
            </div>
          </Col>
          <Col className="col-sm-9">
            <Container>
              <div className="pt-3">
                <h1>Your Orders</h1>
              </div>
              <hr></hr>
              <div>
                <h3>New Orders</h3>
              </div>
              <div>{newOrders}</div>
              <hr></hr>
              <div>
                <h3>Preparing Orders</h3>
              </div>
              <div>{preparingOrders}</div>
              <hr></hr>
              <div>
                <h3>Ready Orders</h3>
              </div>
              <div>{readyOrders}</div>
            </Container>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStoreToProps(state) {
  return {
    profile: state.userDetails.userProfile,
    orderDetails: state.userDetails.orderDetails,
    itemDetails: state.userDetails.itemDetails
  };
}
export default connect(
  mapStoreToProps,
  actionCreators
)(UpcomingOrdersPage);
