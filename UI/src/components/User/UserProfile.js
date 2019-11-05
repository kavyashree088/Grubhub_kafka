import React, { Component } from "react";
import Navigation from "../Navbar";
import { connect } from "react-redux";
import * as actionCreators from "../../js/actions/index";
import { Row, Col, Container, Button, Toast, Image } from "react-bootstrap";
import "../../css/sidebar.css";
import Form from "react-bootstrap/Form";
import cookie from "react-cookies";
import { rooturl } from "../../config/constants";

class UserProfile extends Component {
  constructor(props) {
    super();
    this.state = {
      isNameEditable: false,
      isEmailEditable: false,
      isPasswordEditable: false,
      firstName: "",
      lastName: "",
      newEmail: "",
      confirmEmail: "",
      newEmailError: "",
      confirmEmailError: "",
      isUpdated: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      oldPasswordError: "",
      newPasswordError: "",
      confirmPasswordError: "",
      imageFile: []
    };
  }
  componentWillMount() {
    if (!localStorage.getItem("jwtToken")) {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      this.props.history.push("/SignIn");
    }
    this.props.getUserProfile(localStorage.getItem("email"));
    console.log(this.props.profile);
  }
  componentWillReceiveProps(nextProps) {
    const newProfile = nextProps.nameUpdate;
    console.log("here");
    console.log(newProfile);
    if (
      newProfile !== this.props.nameUpdate &&
      newProfile === "Successfully Updated"
    ) {
      console.log("updated");
      this.props.getUserProfile(localStorage.getItem("email"));
      this.setState({
        isUpdated: true
      });
    }
  }
  handleNameEdit = event => {
    this.setState({ isNameEditable: true });
  };
  handleEmailEdit = event => {
    this.setState({ isEmailEditable: true });
  };
  handlePasswordEdit = event => {
    this.setState({ isPasswordEditable: true });
  };
  handleEmailCancel = event => {
    this.setState({ isEmailEditable: false });
  };
  handlePasswordCancel = event => {
    this.setState({ isPasswordEditable: false });
  };
  handleNameCancel = event => {
    this.setState({ isNameEditable: false });
  };
  updateName = () => {
    let fName = "";
    if (this.state.firstName.length === 0) {
      fName = this.props.profile.firstName;
    } else {
      fName = this.state.firstName;
    }
    let lName = "";
    if (this.state.lastName.length === 0) {
      lName = this.props.profile.lastName;
    } else {
      lName = this.state.lastName;
    }
    let data = {
      email: localStorage.getItem("email"),
      firstName: fName,
      lastName: lName
    };
    this.props.updateUserName(data);
    this.setState({
      isNameEditable: false
    });
  };

  validateEmail = () => {
    this.setState({
      newEmailError: "",
      confirmEmailError: ""
    });
    let flag = true;
    if (this.state.newEmail.trim().length === 0) {
      this.setState({
        newEmailError: "*Required"
      });
      flag = false;
    } else if (
      !this.state.newEmail.includes("@") ||
      !this.state.newEmail.includes(".")
    ) {
      this.setState({
        newEmailError: "Inavalid email"
      });
      flag = false;
    }
    if (this.state.confirmEmail.trim().length === 0) {
      this.setState({
        confirmEmailError: "*Required"
      });
      flag = false;
    } else if (this.state.newEmail !== this.state.confirmEmail) {
      this.setState({
        confirmEmailError: "Confirm new email does not match"
      });
      flag = false;
    }
    return flag;
  };

  updateEmail = () => {
    if (this.validateEmail()) {
      console.log("update Email");
      let data = {
        email: localStorage.getItem("email"),
        newEmail: this.state.newEmail
      };
      this.props.updateUserEmail(data, this.props.history);
      this.setState({
        isEmailEditable: false
      });
    }
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  validatePassword = () => {
    this.setState({
      oldPasswordError: "",
      newPasswordError: "",
      confirmPasswordError: ""
    });
    console.log(localStorage.getItem("password"));
    let flag = true;
    if (this.state.oldPassword !== localStorage.getItem("password")) {
      this.setState({
        oldPasswordError: "Invalid Password"
      });
      flag = false;
    } else if (this.state.newPassword.length < 8) {
      this.setState({
        newPasswordError: "Insufficient Password length"
      });
      flag = false;
    } else if (this.state.newPassword !== this.state.confirmPassword) {
      this.setState({
        confirmPasswordError: "Password Doesn't Match"
      });
      flag = false;
    }
    return flag;
  };
  updatePassword = event => {
    if (this.validatePassword()) {
      console.log("update Password");
      let data = {
        email: localStorage.getItem("email"),
        newPassword: this.state.newPassword
      };
      this.props.updateUserPassword(data, this.props.history);
      this.setState({
        isPasswordEditable: false
      });
    }
  };
  onFileChange = event => {
    this.setState({
      imageFile: event.target.files[0]
    });
  };

  uploadImage = event => {
    event.preventDefault();
    if (this.state.imageFile !== "") {
      console.log(this.state.imageFile);
      let formData = new FormData();
      formData.append("email", localStorage.getItem("email"));
      formData.append("imageFile", this.state.imageFile);
      this.props.uploadUserProfile(formData, localStorage.getItem("email"));
    }
  };
  render() {
    let nameEdit = null;
    if (this.state.isNameEditable) {
      nameEdit = (
        <div>
          <h3>Edit Name</h3>
          <Form className="col-sm-5">
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                name="firstName"
                onChange={this.handleChange}
                defaultValue={this.props.profile.firstName || ""}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                name="lastName"
                onChange={this.handleChange}
                defaultValue={this.props.profile.lastName || ""}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Button onClick={this.updateName}>Update Name</Button>
              <Button
                variant="outline-secondary"
                onClick={this.handleNameCancel}
              >
                Cancel
              </Button>
            </Form.Group>
          </Form>
          <hr></hr>
        </div>
      );
    } else {
      nameEdit = (
        <div>
          <label className="pt-2">
            <b>Name</b>
          </label>
          <div>
            {this.props.profile.firstName || ""}{" "}
            {this.props.profile.lastName || ""}
            <div
              class="float-right"
              role="button"
              style={{ color: "blue" }}
              onClick={this.handleNameEdit}
            >
              Edit
            </div>
          </div>
          <hr></hr>
        </div>
      );
    }
    let emailEdit = null;
    if (this.state.isEmailEditable) {
      emailEdit = (
        <div>
          <h3>Edit Email</h3>
          <Form className="col-sm-5">
            <Form.Group>
              <Form.Label>New Email</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                name="newEmail"
              ></Form.Control>
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.newEmailError}
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm email</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                name="confirmEmail"
              ></Form.Control>
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.confirmEmailError}
              </div>
            </Form.Group>
            <Form.Group>
              <Button onClick={this.updateEmail}>Update Email</Button>
              <Button
                variant="outline-secondary"
                onClick={this.handleEmailCancel}
              >
                Cancel
              </Button>
            </Form.Group>
          </Form>
          <hr></hr>
        </div>
      );
    } else {
      emailEdit = (
        <div>
          <label className="pt-2">
            <b>Email</b>
          </label>
          <div>
            {this.props.profile.email || ""}
            <div
              class="float-right"
              role="button"
              style={{ color: "blue" }}
              onClick={this.handleEmailEdit}
            >
              Edit
            </div>
          </div>
          <hr></hr>
        </div>
      );
    }
    let passwordEdit = null;
    if (this.state.isPasswordEditable) {
      passwordEdit = (
        <div>
          <h3>Edit Password</h3>
          <Form className="col-sm-5">
            <Form.Group>
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                name="oldPassword"
                type="password"
              ></Form.Control>
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.oldPasswordError}
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                name="newPassword"
                type="password"
              ></Form.Control>
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.newPasswordError}
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                name="confirmPassword"
                type="password"
              ></Form.Control>
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.confirmPasswordError}
              </div>
            </Form.Group>
            <Form.Group>
              <Button onClick={this.updatePassword}>Update Password</Button>
              <Button
                variant="outline-secondary"
                onClick={this.handlePasswordCancel}
              >
                Cancel
              </Button>
            </Form.Group>
          </Form>
          <hr></hr>
        </div>
      );
    } else {
      passwordEdit = (
        <div>
          <label className="pt-2">
            <b>Password</b>
          </label>
          <div>
            *************
            <div
              class="float-right"
              role="button"
              style={{ color: "blue" }}
              onClick={this.handlePasswordEdit}
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
                <a href="/Profile" className="header">
                  <h2>Your Account</h2>
                </a>
                <a href="/UserHome">Home</a>
                <a href="/user/upcomingOrders">Upcoming orders</a>
                <a href="/user/Messages">Messages</a>
                <a href="/Profile" className="active">
                  Profile
                </a>
                <a href="/user/AddressAndPhone">Address and phone</a>
                <a href="/user/PastOrders">Past orders</a>
              </div>
            </Col>
            <Col className="col-sm-9">
              <Container>
                <h3 className="pt-5">Your Account</h3>
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
                <div>
                  <Image
                    src={`http://${rooturl}:3001/uploads/${this.props.profile.profilePic}`}
                    style={{
                      height: "200px",
                      width: "200px"
                    }}
                  ></Image>
                  <form enctype="multipart/form-data" className="pt-3">
                    <input
                      type="file"
                      name="imageFile"
                      onChange={this.onFileChange}
                    ></input>
                    <input
                      type="submit"
                      value="Upload a file"
                      name="uploadImage"
                      onClick={this.uploadImage}
                    />
                  </form>
                </div>
                <hr></hr>
                {nameEdit}
                {emailEdit}
                {passwordEdit}
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
    nameUpdate: state.userDetails.nameUpdate
  };
}
export default connect(
  mapStoreToProps,
  actionCreators
)(UserProfile);
