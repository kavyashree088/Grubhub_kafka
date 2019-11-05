import React, { Component } from "react";
import Navigation from "../Navbar";
import { connect } from "react-redux";
import * as actionCreators from "../../js/actions/ownerActions";
import { Row, Col, Container, Button, Card, Modal } from "react-bootstrap";
import "../../css/sidebar.css";
import Form from "react-bootstrap/Form";

class OwnerHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      showModal: false,
      orderDetails: null,
      updateStatus: false,
      status: "",
      alert: false
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
      console.log("here");
      this.props.getOrdersforRestaurant(newRestaurantDetails._id);
    }
  }

  convertTodate(date) {
    date = date.split(".")[0];
    let dateTimeParts = date.split(/[-T :]/);
    dateTimeParts[1]--;
    console.log(dateTimeParts);
    return new Date(Date.UTC(...dateTimeParts));
  }
  getOrderDetails = id => event => {
    console.log(id);
    this.setState(
      {
        showModal: true,
        orderDetails: this.props.getOrders.find(order => order._id === id)
      },
      () => {
        this.setState({
          items: this.state.orderDetails.items
        });
      }
    );
  };

  setUpdateStatus = () => {
    this.setState({
      updateStatus: true
    });
  };
  updateItemStatus = () => {
    if (this.state.status.length !== 0) {
      console.log(this.state.status);
      let data = {
        id: this.state.orderDetails._id,
        status: this.state.status
      };
      this.props.updateItemStatus(data, this.props.owner.restaurant._id);
    }
    this.setState({
      updateStatus: false
    });
    this.setState(prevState => ({
      orderDetails: {
        ...prevState.orderDetails,
        status: this.state.status
      }
    }));
  };
  handleUpdateChange = event => {
    this.setState({
      status: event.target.value
    });
  };
  handleClose = event => {
    this.setState({
      showModal: false
    });
  };
  cancelOrder = () => {
    let data = {
      id: this.state.orderDetails._id,
      status: "Cancelled"
    };
    this.props.updateItemStatus(data, this.props.owner.restaurant._id);
    this.setState({
      showModal: false,
      updateStatus: false,
      alert: false
    });
  };
  closeAlert = () => {
    this.setState({
      alert: false
    });
  };
  hancleCancleClick = () => {
    console.log("here");
    this.setState(
      {
        showModal: false
      },
      () => {
        this.setState({
          alert: true
        });
      }
    );
  };

  messageCustomer = user => event => {
    console.log(user);
    this.props.history.push({
      pathname: "/owner/Messages",
      state: { user: user }
    });
  };
  render() {
    let newOrderDetails = this.props.getOrders.map(order => {
      if (order.status === "New") {
        return (
          <div
            as={Col}
            md={3}
            style={{
              margin: " 8px 0 0 8px",
              cursor: "pointer"
            }}
          >
            <Card onClick={this.getOrderDetails(order._id)}>
              <Card.Header>Order Id:{order._id}</Card.Header>
              <Card.Body>
                <Card.Title>New</Card.Title>
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
              </Card.Body>
            </Card>
          </div>
        );
      }
      return null;
    });
    let itemDetails = this.state.items.map(item => {
      return (
        <div>
          {item.itemName}({item.quantity}): {item.price}$
        </div>
      );
    });
    let prepOrderDetails = this.props.getOrders.map(order => {
      if (order.status === "Preparing" || order.status === "Ready") {
        return (
          <div
            as={Col}
            md={3}
            style={{
              margin: " 8px 0 0 8px",
              cursor: "pointer"
            }}
          >
            <Card onClick={this.getOrderDetails(order._id)}>
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
              <a href="/OwnerHome" className="header">
                <h2>Home</h2>
              </a>
              <a href="/OwnerHome" className="active">
                Home
              </a>
              <a href="/Menu">Menu</a>
              <a href="/Owner/Messages">Messages</a>
              <a href="/OwnerProfile">Profile</a>
              <a href="/owner/PastOrders">Past Orders</a>
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
              <Row>{newOrderDetails}</Row>
              <hr></hr>
              <div>
                <h3>Orders In Progress</h3>
              </div>
              <Row>{prepOrderDetails}</Row>
              <Modal
                show={this.state.showModal}
                onHide={this.handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Order Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {this.state.items.length > 0 ? (
                    <div>
                      <Row>
                        <Col md={4}>
                          <div>
                            <b>Customer Details: </b>
                          </div>
                          <div>
                            {this.state.orderDetails.user.firstName}{" "}
                            {this.state.orderDetails.user.lastName}
                          </div>
                          <div>{this.state.orderDetails.user.phoneNO}</div>
                          <div>
                            {this.state.orderDetails.user.restaurantaddress}
                          </div>
                        </Col>
                        <Col md={4}>
                          <b>Items:</b>
                          {itemDetails}
                        </Col>
                        <Col md={4}>
                          <b>Status:</b>
                          <div>{this.state.orderDetails.status}</div>
                        </Col>
                      </Row>
                      <Row>
                        {this.state.updateStatus ? (
                          <Col md={4}>
                            <Form>
                              <Form.Group>
                                <Form.Control
                                  as="select"
                                  onChange={this.handleUpdateChange}
                                >
                                  <option>New</option>
                                  <option>Preparing</option>
                                  <option>Ready</option>
                                  <option>Delivered</option>
                                </Form.Control>
                              </Form.Group>
                            </Form>
                            <Button onClick={this.updateItemStatus}>
                              Update
                            </Button>
                          </Col>
                        ) : (
                          <Col>
                            <Button
                              variant="secondary"
                              onClick={this.setUpdateStatus}
                            >
                              Update Status
                            </Button>
                          </Col>
                        )}
                        <Col>
                          <Button
                            onClick={this.messageCustomer(
                              this.state.orderDetails.user
                            )}
                          >
                            Message Customer
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={this.handleClose}>
                    Close
                  </Button>
                  <Button variant="danger" onClick={this.hancleCancleClick}>
                    Cancel Order
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal
                show={this.state.alert}
                variant="danger"
                onHide={this.closeAlert}
                size="lg"
              >
                <Modal.Header
                  closeButton
                  style={{
                    color: "red"
                  }}
                >
                  Cancel Order?
                </Modal.Header>
                <Modal.Body>
                  <p>Are you sure to cancel order?</p>
                </Modal.Body>

                <Modal.Footer>
                  <Button onClick={this.closeAlert} variant="outline-secondary">
                    Close
                  </Button>
                  <Button onClick={this.cancelOrder} variant="outline-danger">
                    Cancel Order
                  </Button>
                </Modal.Footer>
              </Modal>
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
    owner: state.ownerDetails.ownerProfile,
    restaurant: state.ownerDetails.restaurantDetails,
    orderSatusUpdate: state.ownerDetails.updateOrdersRestaurant
  };
}
export default connect(
  mapStoreToProps,
  actionCreators
)(OwnerHome);
