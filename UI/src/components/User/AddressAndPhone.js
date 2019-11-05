import React, { Component } from "react";
import Navigation from "../Navbar";
import { connect } from "react-redux";
import * as actionCreators from "../../js/actions/index";
import { Row, Col, Container, Button, Toast } from "react-bootstrap";
import "../../css/sidebar.css";
import Form from "react-bootstrap/Form";
import cookie from "react-cookies";

class AddressAndPhone extends Component {
  constructor(props) {
    super();
    this.state = {
      isAddressEditable: false,
      isPhoneEditable: false,
      address: "",
      addressError: "",
      phoneNo: "",
      phoneNoError: "",
      isUpdated: false
    };
  }
  componentWillMount() {
    if (!localStorage.getItem("jwtToken")) {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      this.props.history.push("/SignIn");
    }
  }
  componentWillReceiveProps(nextProps) {
    const newProfile = nextProps.address;
    const newPhoneNo = nextProps.phone;
    console.log("here");
    console.log(newProfile);
    if (
      newProfile !== this.props.address &&
      newProfile === "Successfully Updated"
    ) {
      console.log("updated");
      this.props.getUserProfile(localStorage.getItem("email"));
      this.setState({
        isUpdated: true
      });
    }
    if (
      newPhoneNo !== this.props.phone &&
      newPhoneNo === "Successfully Updated"
    ) {
      console.log("updated");
      this.props.getUserProfile(localStorage.getItem("email"));
      this.setState({
        isUpdated: true
      });
    }
  }
  handleAddressEdit = event => {
    this.setState({ isAddressEditable: true });
  };
  handlePhoneNoEdit = event => {
    this.setState({ isPhoneEditable: true });
  };
  handleAddressCancel = event => {
    this.setState({ isAddressEditable: false });
  };
  handlePhoneNoCancel = event => {
    this.setState({ isPhoneEditable: false });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  validateAddress = () => {
    this.setState({
      addressError: ""
    });
    if (this.state.address === "") {
      this.setState({
        addressError: "*Required"
      });
      return false;
    }
    return true;
  };
  updateAddress = () => {
    if (this.validateAddress()) {
      let data = {
        email: localStorage.getItem("email"),
        address: this.state.address
      };
      this.props.updateUserAddress(data);
      this.setState({
        isAddressEditable: false
      });
    }
  };

  validatePhoneNo = () => {
    this.setState({
      phoneNoError: ""
    });

    if (this.state.phoneNo === "") {
      this.setState({
        phoneNoError: "*Required"
      });
      return false;
    } else if (
      !/^\d+$/.test(this.state.phoneNo) ||
      this.state.phoneNo.length !== 10
    ) {
      this.setState({
        phoneNoError: "Invalid Phone Number"
      });
      return false;
    }
    return true;
  };

  updatePhoneNo = () => {
    if (this.validatePhoneNo()) {
      let data = {
        email: localStorage.getItem("email"),
        phoneNo: this.state.phoneNo
      };
      this.props.updateUserPhoneNo(data);
      this.setState({
        isPhoneEditable: false
      });
    }
  };
  render() {
    let AddressEdit = null;
    if (this.state.isAddressEditable) {
      AddressEdit = (
        <div>
          <h3>Edit Address</h3>
          <Form className="col-sm-5">
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                name="address"
                onChange={this.handleChange}
                as="textarea"
                defaultValue={this.props.profile.address || ""}
              ></Form.Control>
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.addressError}
              </div>
            </Form.Group>
            <Form.Group>
              <Button onClick={this.updateAddress}>Update Address</Button>
              <Button
                variant="outline-secondary"
                onClick={this.handleAddressCancel}
              >
                Cancel
              </Button>
            </Form.Group>
          </Form>
          <hr></hr>
        </div>
      );
    } else {
      AddressEdit = (
        <div>
          <label className="pt-2">
            <b>Address</b>
          </label>
          <div>
            {this.props.profile.address || ""}
            <div
              class="float-right"
              role="button"
              style={{ color: "blue" }}
              onClick={this.handleAddressEdit}
            >
              Edit
            </div>
          </div>
          <hr></hr>
        </div>
      );
    }
    let phoneNoEdit = null;
    if (this.state.isPhoneEditable) {
      phoneNoEdit = (
        <div>
          <h3>Edit Phone number</h3>
          <Form className="col-sm-5">
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                name="phoneNo"
                defaultValue={this.props.profile.phoneNo}
              ></Form.Control>
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.phoneNoError}
              </div>
            </Form.Group>
            <Form.Group>
              <Button onClick={this.updatePhoneNo}>Update PhoneNo</Button>
              <Button
                variant="outline-secondary"
                onClick={this.handlePhoneNoCancel}
              >
                Cancel
              </Button>
            </Form.Group>
          </Form>
          <hr></hr>
        </div>
      );
    } else {
      phoneNoEdit = (
        <div>
          <label className="pt-2">
            <b>Phone Number</b>
          </label>
          <div>
            {this.props.profile.phoneNo || ""}
            <div
              class="float-right"
              role="button"
              style={{ color: "blue" }}
              onClick={this.handlePhoneNoEdit}
            >
              Edit
            </div>
          </div>
          <hr></hr>
        </div>
      );
    }
    return (
      <div>
        <Navigation></Navigation>
        <div>
          <Row>
            <Col className="col-sm-3">
              <div className="vertical-menu bg-light">
                <a href="/user/AddressAndPhone" className="header">
                  <h2>Your Account</h2>
                </a>
                <a href="/UserHome">Home</a>
                <a href="/user/UpcomingOrders">Upcoming orders</a>
                <a href="/user/Messages">Messages</a>
                <a href="/Profile">Profile</a>
                <a href="/user/AddressAndPhone" className="active">
                  Address and phone
                </a>
                <a href="/user/PastOrders">Past orders</a>
              </div>
            </Col>
            <Col className="col-sm-9">
              <Container>
                <h3 className="pt-5">Your Address and Phone number</h3>
                <Row>
                  <Col>
                    <Toast
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: "#4ede74"
                      }}
                      onClose={() => this.setState({ isUpdated: false })}
                      show={this.state.isUpdated}
                      delay={3000}
                      autohide
                    >
                      <Toast.Body>Successfully Updated!</Toast.Body>
                    </Toast>
                  </Col>
                </Row>
                {AddressEdit}
                {phoneNoEdit}
              </Container>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

function mapStoreToProps(state) {
  return {
    profile: state.userDetails.userProfile,
    address: state.userDetails.addressUpdate,
    phone: state.userDetails.phoneNoUpdate
  };
}
export default connect(
  mapStoreToProps,
  actionCreators
)(AddressAndPhone);
