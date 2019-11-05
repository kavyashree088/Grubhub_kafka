import React, { Component } from "react";
import Navigation from "../Navbar";
import { connect } from "react-redux";
import * as actionCreators from "../../js/actions/index";
import { Container, Card, Col, Row } from "react-bootstrap";
import "../../css/grubhub.css";

class PastOrdersPage extends Component {
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
    let pastOrderDetails = this.props.orderDetails.map(order => {
      if (order.status === "Delivered" || order.status === "Cancelled") {
        return (
          <div
            style={{
              margin: " 8px 0 0 8px"
            }}
            className="pt-3"
          >
            <Card>
              <Card.Header>Order Id:{order._id}</Card.Header>
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
                <h2>Past Orders</h2>
              </a>
              <a href="/UserHome">Home</a>
              <a href="/user/upcomingOrders">Upcoming orders</a>
              <a href="/user/Messages">Messages</a>
              <a href="/Profile">Profile</a>
              <a href="/user/AddressAndPhone">Address and phone</a>
              <a href="/user/PastOrders" className="active">
                Past orders
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
              <div>{pastOrderDetails}</div>
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
)(PastOrdersPage);
