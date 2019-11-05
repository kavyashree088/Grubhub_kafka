import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Container, Tabs, Tab, Form } from "react-bootstrap";
import * as actionCreator from "../../js/actions/index";
import "../../css/grubhub.css";
import Navigation from "../Navbar";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: props.activeTab || 1,
      email: "",
      password: "",
      emailRequired: "",
      passwordRequired: "",
      ownerEmail: "",
      ownerPassword: "",
      ownerEmailRequire: "",
      ownerPasswordRequired: ""
    };
  }

  handleSelect = selectedTab => {
    this.setState({
      activeTab: selectedTab
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleUserLogin = event => {
    event.preventDefault();
    let data = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    };
    if (this.validateUser()) {
      this.props.userLogin(data, this.props.history);
    }
  };

  validateUser = () => {
    let flag = true;
    this.setState({
      emailRequired: "",
      passwordRequired: ""
    });
    if (this.state.email.trim().length === 0) {
      this.setState({ emailRequired: "*Required" });
      flag = false;
    }
    if (this.state.password.length === 0) {
      this.setState({ passwordRequired: "*Required" });
      flag = false;
    }
    console.log(flag);
    return flag;
  };
  validateOwner = () => {
    let flag = true;
    this.setState({
      ownerEmailRequire: "",
      ownerPasswordRequired: ""
    });
    console.log(this.state.ownerEmail);
    if (this.state.ownerEmail.trim().length === 0) {
      this.setState({ ownerEmailRequire: "*Required" });
      flag = false;
    }
    if (this.state.ownerPassword.length === 0) {
      this.setState({ ownerPasswordRequired: "*Required" });
      flag = false;
    }
    console.log(flag);
    return flag;
  };
  handleOwnerLogin = event => {
    event.preventDefault();
    let data = {
      email: this.state.ownerEmail,
      password: this.state.ownerPassword
    };
    if (this.validateOwner()) {
      this.props.ownerLogin(data, this.props.history);
    }
  };
  render() {
    let invalid = null;
    if (this.props.login.length === 0) {
      invalid = null;
    } else {
      console.log(this.props.login.authflag);
      if (!this.props.login.authflag) {
        invalid = (
          <div className="text-center" style={{ fontSize: 14, color: "red" }}>
            Invalid Login
          </div>
        );
      }
    }
    let invalidOwner = null;
    if (this.props.loginOwner.length === 0) {
      invalidOwner = null;
    } else {
      console.log(this.props.loginOwner.authflag);
      if (!this.props.loginOwner.authflag) {
        invalidOwner = (
          <div className="text-center" style={{ fontSize: 14, color: "red" }}>
            Invalid Login
          </div>
        );
      }
    }
    return (
      <div>
        <Navigation></Navigation>
        <Container>
          <div className="login u-dimension-1">
            <Tabs activeKey={this.state.activeTab} onSelect={this.handleSelect}>
              <Tab eventKey={1} title="Sign In as Customer">
                <h3 className="pt-5">Sign In with your GrubHub Account</h3>
                <Form className="pt-2">
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name="email"
                      onChange={this.handleChange}
                    ></Form.Control>
                    <div style={{ fontSize: 12, color: "red" }}>
                      {this.state.emailRequired}
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      name="password"
                      type="password"
                      onChange={this.handleChange}
                    ></Form.Control>
                    <div style={{ fontSize: 12, color: "red" }}>
                      {this.state.passwordRequired}
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Button
                      variant="primary"
                      type="submit"
                      className="btn-block"
                      onClick={this.handleUserLogin}
                    >
                      Sign In
                    </Button>
                  </Form.Group>
                  {invalid}
                </Form>
                <div className="text-center">
                  <a href="/UserLogin">Create your Account</a>
                </div>
              </Tab>
              <Tab eventKey={2} title="Sign In as Owner">
                <h3 className="pt-5">Sign In with your GrubHub Account</h3>
                <Form className="pt-2">
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name="ownerEmail"
                      onChange={this.handleChange}
                    ></Form.Control>
                    <div style={{ fontSize: 12, color: "red" }}>
                      {this.state.ownerEmailRequire}
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      name="ownerPassword"
                      type="password"
                      onChange={this.handleChange}
                    ></Form.Control>
                    <div style={{ fontSize: 12, color: "red" }}>
                      {this.state.ownerPasswordRequired}
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <Button
                      variant="primary"
                      type="submit"
                      className="btn-block"
                      onClick={this.handleOwnerLogin}
                    >
                      Sign In
                    </Button>
                  </Form.Group>
                  {invalidOwner}
                </Form>
                <div className="text-center">
                  <a href="/OwnerLogin">Create your Account</a>
                </div>
              </Tab>
            </Tabs>
          </div>
        </Container>
      </div>
    );
  }
}
function mapStoreToProps(state) {
  return {
    login: state.userDetails.loginDetails,
    loginOwner: state.userDetails.ownerLoginDetails
  };
}
export default connect(
  mapStoreToProps,
  actionCreator
)(SignIn);
