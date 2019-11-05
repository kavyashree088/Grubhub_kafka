import React, { Component } from "react";
import Navigation from "../Navbar";
import { connect } from "react-redux";
import * as actionCreators from "../../js/actions/index";
import Cart from "./Cart";
import {
  Container,
  Card,
  Col,
  Row,
  Modal,
  Button,
  Image,
  InputGroup,
  FormControl,
  Form,
  Toast
} from "react-bootstrap";
import "../../css/grubhub.css";
import { rooturl } from "../../config/constants";

class MessagePage extends Component {
  constructor(props) {
    super();
    this.state = {
      restaurant: {},
      message: "",
      userId: "",
      active: false,
      selectedList: null,
      recieverId: ""
    };
  }
  componentWillMount() {
    if (!localStorage.getItem("jwtToken")) {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      this.props.history.push("/SignIn");
    }
    console.log(this.props.location.state);
    if (this.props.location.state) {
      this.setState({
        restaurant: this.props.location.state.restaurant,
        userId: this.props.location.state.userId
      });
      this.props.getMessages(this.props.location.state.userId);
    }
    console.log(this.state);
  }

  componentWillReceiveProps(nextProps) {
    let newUser = nextProps.user;
    if (newUser !== this.props.user && newUser !== undefined) {
      this.props.getMessages(newUser._id);
      this.setState({
        userId: newUser._id
      });
    }
  }
  handleChange = event => {
    this.setState({
      message: event.target.value
    });
  };

  onSend = event => {
    if (this.state.message.trim().length > 0) {
      let rId = "";
      let recieverName = "";
      if (this.state.restaurant._id) {
        rId = this.state.restaurant._id;
        recieverName = this.state.restaurant.name;
      } else {
        rId = this.state.restaurantId;
        recieverName = this.state.recieverName;
      }

      let data = {
        recieverId: rId,
        senderId: this.state.userId,
        senderName: this.props.user.firstName,
        recieverName: recieverName,
        message: this.state.message,
        sent: this.props.user.firstName
      };
      console.log(data);
      this.setState({ message: "" });
      this.props.sendMessages(data, data.senderId);
    }
  };

  messageDesc = messages => {
    let toast = messages[0].messages.map(message => {
      return (
        <Toast>
          <Toast.Header>Sent: {message.sent}</Toast.Header>
          <Toast.Body>{message.message}</Toast.Body>
        </Toast>
      );
    });
    return toast;
  };

  restaurantMessages = messages => {
    let toast = messages.map(message => {
      if (
        message.recieverId === this.state.restaurant._id ||
        message.senderId === this.state.restaurant._id
      ) {
        let mes = message.messages.map(message => {
          return (
            <Toast>
              <Toast.Header>Sent: {message.sent}</Toast.Header>
              <Toast.Body>{message.message}</Toast.Body>
            </Toast>
          );
        });
        return mes;
      }
    });
    return toast;
  };

  clickMessageList = message => event => {
    console.log(message);
    let rId = "";
    let recieverName = "";
    if (message.senderId !== this.state.userId) {
      rId = message.senderId;
      recieverName = message.senderName;
    } else {
      rId = message.recieverId;
      recieverName = message.recieverName;
    }
    this.setState({
      active: true,
      selectedList: message,
      restaurant: {},
      restaurantId: rId,
      recieverName: recieverName
    });
  };
  viewMessage = selectedList => {
    let mess = selectedList.messages.map(message => {
      return (
        <Toast>
          <Toast.Header>Sent: {message.sent}</Toast.Header>
          <Toast.Body>{message.message}</Toast.Body>
        </Toast>
      );
    });
    return mess;
  };

  render() {
    let messageList = this.props.message.map(message => {
      return (
        <div onClick={this.clickMessageList(message)}>
          {message.recieverName}
          <hr />
        </div>
      );
    });

    return (
      <div>
        <Navigation></Navigation>
        <Row>
          <Col className="col-sm-3">
            <div className="vertical-menu bg-light">
              <a href="/user/PastOrders" className="header">
                <h2>Messages</h2>
              </a>
              <a href="/UserHome">Home</a>
              <a href="/user/upcomingOrders">Upcoming orders</a>
              <a href="/user/Messages" className="active">
                Messages
              </a>
              <a href="/Profile">Profile</a>
              <a href="/user/AddressAndPhone">Address and phone</a>
              <a href="/user/PastOrders">Past orders</a>
            </div>
          </Col>
          <Col className="col-sm-9">
            <Row>
              <Col className="col-sm-4">
                <Container>
                  <div className="vertical-menu">
                    <a href="/user/PastOrders" className="header">
                      <h2>Message List</h2>
                    </a>
                    <hr />
                    <div>
                      {this.state.restaurant.name ? (
                        <div>
                          <div>{this.state.restaurant.name}</div>
                          <hr />
                          <div>
                            {this.props.message.length > 0 ? (
                              <div>{messageList}</div>
                            ) : (
                              <div></div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          {this.props.message.length > 0 ? (
                            <div>{messageList}</div>
                          ) : (
                            <div>No messages</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Container>
              </Col>
              <div
                style={{
                  borderLeft: "4px solid black"
                }}
              ></div>
              <Col className="col-sm-7">
                <Container>
                  <div className="vertical-menu">
                    {this.state.restaurant.name ? (
                      <div>
                        <h2>{this.state.restaurant.name}</h2>
                        <hr />
                        <div
                          style={{
                            minHeight: "600 px",
                            width: "100%",
                            border: "1px black"
                          }}
                        >
                          {this.props.message.find(
                            message =>
                              message.recieverId === this.state.restaurant._id
                          ) ? (
                            <div>
                              {this.restaurantMessages(this.props.message)}
                            </div>
                          ) : (
                            <div>No Previous Messages</div>
                          )}
                        </div>
                        <hr />
                        <Form>
                          <Row>
                            <Col className="col-sm-10">
                              <Form.Control
                                placeholder="type message...."
                                name="message"
                                onChange={this.handleChange}
                              ></Form.Control>
                            </Col>
                            <Col className="col-sm-2">
                              <Button onClick={this.onSend}>Send</Button>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    ) : (
                      <div>
                        {this.props.message.length > 0 ? (
                          <div>
                            <a>
                              <h2>View Messages</h2>
                            </a>
                            <hr />
                            <div>
                              {this.state.selectedList ? (
                                <div>
                                  {this.viewMessage(this.state.selectedList)}
                                  <div>
                                    <hr />
                                    <Form>
                                      <Row>
                                        <Col className="col-sm-10">
                                          <Form.Control
                                            placeholder="type message...."
                                            name="message"
                                            onChange={this.handleChange}
                                          ></Form.Control>
                                        </Col>
                                        <Col className="col-sm-2">
                                          <Button onClick={this.onSend}>
                                            Send
                                          </Button>
                                        </Col>
                                      </Row>
                                    </Form>
                                  </div>
                                </div>
                              ) : (
                                <div>Select from List</div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>No messages</div>
                        )}
                      </div>
                    )}
                  </div>
                </Container>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStoreToProps(state) {
  return {
    message: state.userDetails.messages,
    user: state.userDetails.userProfile
  };
}
export default connect(
  mapStoreToProps,
  actionCreators
)(MessagePage);
