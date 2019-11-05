import React, { Component } from "react";
import { connect } from "react-redux";
import Navigation from "../Navbar";
import { Button, Container, Form, Row, Col, FormGroup } from "react-bootstrap";
import * as actionCreators from "../../js/actions/ownerActions";
import "../../css/sidebar.css";

class OwnerSignUp extends Component {
  constructor(props) {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
      restaurantName: "",
      zipCode: "",
      restaurantNameError: "",
      zipCodeError: "",
      firstNameError: "",
      lastNameError: ""
    };
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleClick = event => {
    event.preventDefault();
    console.log("click");
    if (this.validate()) {
      let data = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
        restaurantName: this.state.restaurantName,
        zipCode: this.state.zipCode
      };
      this.props.createOwner(data, this.props.history);
    }
  };
  validate = () => {
    this.setState({
      emailError: "",
      passwordError: "",
      zipCodeError: "",
      restaurantNameError: ""
    });
    console.log("validate");
    let flag = true;
    console.log(this.state.email);
    if (!this.state.email.includes("@") || !this.state.email.includes(".")) {
      this.setState({
        emailError: "Inavalid email"
      });
      flag = false;
    }
    if (this.state.password.length < 8) {
      this.setState({
        passwordError: "Insufficient password length"
      });
      flag = false;
    }
    if (this.state.restaurantName.trim().length === 0) {
      this.setState({
        restaurantNameError: "*Required"
      });
      flag = false;
    }
    if (this.state.zipCode.trim().length === 0) {
      this.setState({
        zipCodeError: "*Required"
      });
      flag = false;
    }
    if (this.state.firstName.trim().length === 0) {
      this.setState({
        firstNameError: "*Required"
      });
      flag = false;
    }
    if (this.state.lastName.trim().length === 0) {
      this.setState({
        lastNameError: "*Required"
      });
      flag = false;
    }
    return flag;
  };

  render() {
    return (
      <div>
        <Navigation></Navigation>
        <Container>
          <div className="login u-dimension-1">
            <h3>Creae your GrubHub Account</h3>
            <Form className="pt-3" data-toggle="validator">
              <Row>
                <Col>
                  <FormGroup>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      onChange={this.handleChange}
                      name="firstName"
                    ></Form.Control>
                    <div
                      style={{ fontSize: 12, color: "red" }}
                      className="text-center"
                    >
                      {this.state.firstNameError}
                    </div>
                  </FormGroup>
                </Col>
                <Col>
                  <FormGroup>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      onChange={this.handleChange}
                      name="lastName"
                    ></Form.Control>
                    <div
                      style={{ fontSize: 12, color: "red" }}
                      className="text-center"
                    >
                      {this.state.lastNameError}
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      onChange={this.handleChange}
                      name="email"
                    ></Form.Control>
                    <div
                      style={{ fontSize: 12, color: "red" }}
                      className="text-center"
                    >
                      {this.state.emailError}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Restaurant Name</Form.Label>
                    <Form.Control
                      onChange={this.handleChange}
                      name="restaurantName"
                    ></Form.Control>
                    <div
                      style={{ fontSize: 12, color: "red" }}
                      className="text-center"
                    >
                      {this.state.restaurantNameError}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>ZipCode</Form.Label>
                    <Form.Control
                      onChange={this.handleChange}
                      name="zipCode"
                    ></Form.Control>
                    <div
                      style={{ fontSize: 12, color: "red" }}
                      className="text-center"
                    >
                      {this.state.zipCodeError}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      name="password"
                      onChange={this.handleChange}
                      type="password"
                    ></Form.Control>
                    <div
                      style={{ fontSize: 12, color: "red" }}
                      className="text-center"
                    >
                      {this.state.passwordError}
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={this.handleClick}
                      className="btn-block"
                    >
                      Create Account
                    </Button>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
            <div className="text-center">
              <p>
                Have an ccount? <a href="/SignIn">Sign In</a>
              </p>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}
function mapStoreToProps(state) {
  return state;
}
export default connect(
  mapStoreToProps,
  actionCreators
)(OwnerSignUp);
