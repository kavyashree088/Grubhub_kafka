import React, { Component } from "react";
import Navigation from "../Navbar";
import { connect } from "react-redux";
import * as actionCreators from "../../js/actions/ownerActions";
import { Row, Col, Container, Button, Toast, Image } from "react-bootstrap";
import "../../css/sidebar.css";
import Form from "react-bootstrap/Form";
import { rooturl } from "../../config/constants";

class OwnerProfile extends Component {
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
      isRestaurantDetailsUpdate: false,
      restaurantName: "",
      phoneNo: "",
      address: "",
      cuisine: "",
      zipcode: "",
      image: "",
      restaurantNameError: "",
      phoneNoError: "",
      addressError: "",
      cuisineError: "",
      zipcodeError: "",
      imageFile: ""
    };
  }
  componentWil;
  async componentWillMount() {
    if (!localStorage.getItem("jwtToken")) {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      this.props.history.push("/SignIn");
    }
    await this.props.getOwnerProfile(localStorage.getItem("email"));
  }
  componentWillReceiveProps(nextProps) {
    const newProfile = nextProps.nameUpdate;
    const newRestUpdate = nextProps.restaurantUpdate;
    const owner = nextProps.profile;
    console.log("here");
    console.log(newProfile);
    if (
      newProfile !== this.props.nameUpdate &&
      newProfile === "Successfully Updated"
    ) {
      console.log("updated");
      this.props.getOwnerProfile(localStorage.getItem("email"));
      this.setState({
        isUpdated: true
      });
    }
    if (
      newRestUpdate !== this.props.restaurantUpdate &&
      newRestUpdate === "Successfully Updated"
    ) {
      this.setState({
        isUpdated: true
      });
      this.props.getRestaurantDetails(localStorage.getItem("email"));
    }

    if (owner !== this.props.profile && owner !== undefined) {
      this.setState({
        restaurantName: owner.restaurant.name,
        phoneNo: owner.restaurant.phoneNo,
        address: owner.restaurant.address,
        cuisine: owner.restaurant.cuisine,
        zipcode: owner.restaurant.zipcode,
        image: owner.restaurant.image
      });
    }
  }
  handleNameEdit = event => {
    this.setState({ isNameEditable: true });
  };
  handleNameCancel = event => {
    this.setState({ isNameEditable: false });
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

  handleRestaurantCancel = event => {
    this.setState({ isRestaurantDetailsUpdate: false });
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
    this.props.updateOwnerName(data);
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
      this.props.updateOwnerEmail(data, this.props.history);
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
      this.props.updateOwnerPassword(data, this.props.history);
      this.setState({
        isPasswordEditable: false
      });
    }
  };
  handleRestaurantEdit = () => {
    this.setState({
      isRestaurantDetailsUpdate: true
    });
  };
  validateRestaurantDetails = () => {
    this.setState({
      restaurantNameError: "",
      phoneNoError: "",
      addressError: "",
      cuisineError: "",
      zipcodeError: ""
    });

    console.log("validate");
    let flag = true;
    if (
      !this.state.restaurantName ||
      this.state.restaurantName.trim().length === 0
    ) {
      this.setState({
        restaurantNameError: "*Required"
      });
      flag = false;
    }
    if (!this.state.phoneNo || this.state.phoneNo.length === 0) {
      this.setState({
        phoneNoError: "*Required"
      });
      flag = false;
    } else if (
      !/^\d+$/.test(this.state.phoneNo) ||
      this.state.phoneNo.length !== 10
    ) {
      this.setState({
        phoneNoError: "Invalid Phone Number"
      });
      flag = false;
    }
    if (!this.state.address || this.state.address.trim().length === 0) {
      this.setState({
        addressError: "*Required"
      });
      flag = false;
    }
    if (this.state.zipcode.trim().length === 0) {
      this.setState({
        zipcodeError: "*Required"
      });
      flag = false;
    } else if (
      !/^\d+$/.test(this.state.zipcode) ||
      this.state.zipcode.length !== 5
    ) {
      this.setState({
        zipcodeError: "Invalid Zipcode"
      });
      flag = false;
    }
    if (!this.state.cuisine || this.state.cuisine.trim().length === 0) {
      this.setState({
        cuisineError: "*Required"
      });
      flag = false;
    }
    return flag;
  };
  updateRestaurantDetails = () => {
    console.log("inside update");
    if (this.validateRestaurantDetails()) {
      let data = {
        name: this.state.restaurantName,
        phoneNo: this.state.phoneNo,
        address: this.state.address,
        cuisine: this.state.cuisine,
        zipcode: this.state.zipcode,
        id: this.props.profile.restaurant._id
      };
      this.props.updateRestaurantDetails(data);
      this.setState({
        isRestaurantDetailsUpdate: false
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
      let formData = new FormData();
      formData.append("id", this.props.profile.restaurant._id);
      formData.append("imageFile", this.state.imageFile);
      this.props.uploadRestaurantImage(formData);
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
    let restaurantDetailsEdit = null;
    if (this.state.isRestaurantDetailsUpdate) {
      restaurantDetailsEdit = (
        <div>
          <h3>Edit Restaurant Details</h3>
          <Form className="col-sm-5">
            <Form.Group>
              <Form.Label>Restaurant Name</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                name="restaurantName"
                defaultValue={this.state.restaurantName}
              ></Form.Control>
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.restaurantNameError}
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                name="phoneNo"
                defaultValue={this.state.phoneNo}
              ></Form.Control>
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.phoneNoError}
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Cuisine</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                name="cuisine"
                defaultValue={this.state.cuisine}
              ></Form.Control>
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.cuisineError}
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Restaurant Address</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                name="address"
                defaultValue={this.state.address}
              ></Form.Control>
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.addressError}
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Zipcode</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                name="zipcode"
                defaultValue={this.state.zipcode}
              ></Form.Control>
              <div style={{ fontSize: 12, color: "red" }}>
                {this.state.zipcodeError}
              </div>
            </Form.Group>
            <div>
              <Image
                src={`http://${rooturl}:3001/uploads/${this.state.image}`}
              ></Image>
            </div>
            <Form.Group enctype="multipart/form-data" className="pt-3">
              <Form.Control
                type="file"
                name="imageFile"
                onChange={this.onFileChange}
              ></Form.Control>
              <Button
                type="submit"
                value="Upload a file"
                name="uploadImage"
                onClick={this.uploadImage}
              >
                Upload Image
              </Button>
            </Form.Group>
            <Form.Group>
              <Button onClick={this.updateRestaurantDetails}>
                Update Details
              </Button>
              <Button
                variant="outline-secondary"
                onClick={this.handleRestaurantCancel}
              >
                Cancel
              </Button>
            </Form.Group>
          </Form>
          <hr></hr>
        </div>
      );
    } else {
      restaurantDetailsEdit = (
        <div>
          <div>
            <label className="pt-2">
              <b>Restaurant Details</b>
            </label>
            <div>
              <Image
                src={`http://${rooturl}:3001/uploads/${this.state.image}`}
              ></Image>
            </div>
            <label className="pt-2">
              <b>Restaurant Name</b>
            </label>
            <div>{this.state.restaurantName || "NA"}</div>
          </div>
          <div>
            <label className="pt-2">
              <b>Phone Number</b>
            </label>
            <div>{this.state.phoneNo || "NA"}</div>
          </div>
          <div>
            <label className="pt-2">
              <b>Cuisine</b>
            </label>
            <div>{this.state.cuisine || "NA"}</div>
          </div>
          <div>
            <label className="pt-2">
              <b>Address</b>
            </label>
            <div>{this.state.address || "NA"}</div>
          </div>
          <div>
            <label className="pt-2">
              <b>Zipcode</b>
            </label>
            <div>
              {this.state.zipcode || "NA"}
              <div
                class="float-right"
                role="button"
                style={{ color: "blue" }}
                onClick={this.handleRestaurantEdit}
              >
                Edit
              </div>
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
                <a href="/OwnerProfile" className="header">
                  <h2>Your Account</h2>
                </a>
                <a href="/OwnerHome">Home</a>
                <a href="/Menu">Menu</a>
                <a href="/Owner/Messages">Messages</a>
                <a href="/OwnerProfile" className="active">
                  Profile
                </a>
                <a href="/owner/PastOrders">Past Orders</a>
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
                {nameEdit}
                {emailEdit}
                {passwordEdit}
                {restaurantDetailsEdit}
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
    profile: state.ownerDetails.ownerProfile,
    nameUpdate: state.ownerDetails.nameUpdate,
    restaurantUpdate: state.ownerDetails.restaurantUpdate
  };
}
export default connect(
  mapStoreToProps,
  actionCreators
)(OwnerProfile);
