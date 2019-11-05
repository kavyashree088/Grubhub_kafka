import React, { Component } from "react";
import { connect } from "react-redux";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import * as actionCreators from "../js/actions/index";
class Navigation extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }
  async componentDidMount() {
    console.log(localStorage.getItem("userType"));
    console.log(localStorage.getItem("email"));
    if (localStorage.getItem("userType") === "owner") {
      console.log(localStorage.getItem("email"));
      await this.props.getOwnerProfile(localStorage.getItem("email"));
    } else {
      console.log(localStorage.getItem("email"));
      await this.props.getUserProfile(localStorage.getItem("email"));
    }
  }
  //handle logout to destroy the cookie
  handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    localStorage.removeItem("userType");
  };
  render() {
    let navLogin = null;
    let path = "/";

    if (localStorage.getItem("userType")) {
      let name = "";
      if (localStorage.getItem("userType") === "owner") {
        if (!this.props.owner) {
          name = "";
        } else {
          name = "Hi, " + this.props.owner.firstName + "!";
        }
        navLogin = (
          <Nav className="ml-auto">
            <NavDropdown title={name} id="basic-nav-dropdown">
              <NavDropdown.Item href="#">
                <i className="clock icon"></i>Past Orders
              </NavDropdown.Item>
              <NavDropdown.Item href="/Menu">
                <i className="list ul icon"></i>Menu
              </NavDropdown.Item>
              <NavDropdown.Item href="/OwnerProfile">
                <i className="cog icon"></i>Account Setting
              </NavDropdown.Item>
              <NavDropdown.Item href="#">
                <i className="info circle icon"></i>Help
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/" onClick={this.handleLogout}>
              <i className="sign out alternate icon"></i>Sign Out
            </Nav.Link>
          </Nav>
        );
      } else {
        console.log("cookie");
        path = "/UserHome";
        if (!this.props.user) {
          name = "";
        } else {
          name = "Hi, " + this.props.user.firstName + "!";
        }
        navLogin = (
          <Nav className="ml-auto">
            <NavDropdown title={name} id="basic-nav-dropdown">
              <NavDropdown.Item href="#">
                <i className="clock icon"></i>Past Orders
              </NavDropdown.Item>
              <NavDropdown.Item href="#">
                <i className="calendar alternate icon"></i>Upcoming Orders
              </NavDropdown.Item>
              <NavDropdown.Item href="/Profile">
                <i className="cog icon"></i>Account Setting
              </NavDropdown.Item>
              <NavDropdown.Item href="#">
                <i className="info circle icon"></i>Help
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/" onClick={this.handleLogout}>
              <i className="sign out alternate icon"></i>Sign Out
            </Nav.Link>
          </Nav>
        );
      }
    } else {
      navLogin = (
        <Nav className="ml-auto">
          <Nav.Link href="/SignIn">
            <i className="sign in alternate icon"></i>Sign In
          </Nav.Link>
        </Nav>
      );
    }
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href={path}>
          <h2>GrubHub</h2>
        </Navbar.Brand>
        <Navbar.Collapse>{navLogin}</Navbar.Collapse>
      </Navbar>
    );
  }
}
function mapStoreToProps(state) {
  return {
    user: state.userDetails.userProfile,
    owner: state.userDetails.ownerProfile
  };
}
export default connect(
  mapStoreToProps,
  actionCreators
)(Navigation);
