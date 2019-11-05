import React, { Component } from "react";
import Navigation from "../Navbar";
import { connect } from "react-redux";
import * as actionCreators from "../../js/actions/index";
import { Container, Col, Row, Button, Form, Toast } from "react-bootstrap";
import "../../css/grubhub.css";

class Message extends Component {
  constructor(props) {
    super();
    this.state = {
      user: {},
      message: "",
      active: false,
      selectedList: null,
      senderId: "",
      senderName: ""
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
        user: this.props.location.state.user
      });
    }
    console.log(this.state);
  }

  componentWillReceiveProps(nextProps) {
    let newUser = nextProps.owner;
    if (newUser !== this.props.owner && newUser !== undefined) {
      console.log("owner");
      this.props.getMessages(newUser.restaurant._id);
    }
  }
  handleChange = event => {
    this.setState({
      message: event.target.value
    });
  };

  onSend = event => {
    if (this.state.message.trim().length > 0) {
      let sId = "";
      let senderName = "";
      if (this.state.user._id) {
        sId = this.state.user._id;
        senderName = this.state.user.firstName;
      } else {
        sId = this.state.senderId;
        senderName = this.state.senderName;
      }

      let data = {
        recieverId: this.props.owner.restaurant._id,
        senderId: sId,
        senderName: senderName,
        recieverName: this.props.owner.restaurant.name,
        message: this.state.message,
        sent: this.props.owner.restaurant.name
      };
      console.log(data);
      this.setState({ message: "" });
      this.props.sendMessages(data, data.recieverId);
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
        message.recieverId === this.state.user._id ||
        message.senderId === this.state.user._id
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
    let sId = "";
    let senderName = "";
    if (message.senderId !== this.props.owner.restaurant._id) {
      sId = message.senderId;
      senderName = message.senderName;
    } else {
      sId = message.recieverId;
      senderName = message.recieverName;
    }
    this.setState({
      active: true,
      selectedList: message,
      restaurant: {},
      senderId: sId,
      senderName: senderName
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
          {message.senderName}
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
              <a href="/OwnerHome" className="header">
                <h2>Home</h2>
              </a>
              <a href="/OwnerHome">Home</a>
              <a href="/Menu">Menu</a>
              <a href="/Owner/Messages" className="active">
                Messages
              </a>
              <a href="/OwnerProfile">Profile</a>
              <a href="/owner/PastOrders">Past Orders</a>
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
                      {this.state.user.firstName ? (
                        <div>
                          <div>{this.state.user.firstName}</div>
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
                    {this.state.user.firstName ? (
                      <div>
                        <h2>{this.state.user.firstName}</h2>
                        <hr />
                        <div
                          style={{
                            minHeight: "600 px",
                            width: "100%",
                            border: "1px black"
                          }}
                        >
                          {this.props.message.find(
                            message => message.senderId === this.state.user._id
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
    owner: state.userDetails.ownerProfile
  };
}
export default connect(
  mapStoreToProps,
  actionCreators
)(Message);
