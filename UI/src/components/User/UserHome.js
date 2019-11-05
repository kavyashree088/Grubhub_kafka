import React, { Component } from "react";
import Navigation from "../Navbar";
import {
  Jumbotron,
  InputGroup,
  Button,
  FormControl,
  Card,
  Col,
  Row,
  Container
} from "react-bootstrap";
import image from "../../images/pizza.webp";
import { connect } from "react-redux";
import * as actionCreators from "../../js/actions/index";

class UserHome extends Component {
  constructor(props) {
    super();
    this.state = {
      menu: ""
    };
  }
  componentWillMount() {
    if (!localStorage.getItem("jwtToken")) {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      this.props.history.push("/SignIn");
    }
    this.props.getUserProfile(localStorage.getItem("email"));
  }
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  findFood = () => {
    this.props.history.push({
      pathname: "/SearchPage",
      state: { menu: this.state.menu }
    });
  };

  render() {
    return (
      <div>
        <Navigation></Navigation>
        <Jumbotron
          style={{
            backgroundImage: `url(${image})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover"
          }}
        >
          <h1
            className="d-flex justify-content-center"
            style={{
              color: "white"
            }}
          >
            Who delivers your favourite food?
          </h1>
          <div className="d-flex justify-content-center">
            <InputGroup
              size="lg"
              className="d-flex justify-content-center col-sm-8"
            >
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-lg">
                  <i className="search icon"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>

              <FormControl
                aria-label="Large"
                placeholder="Search with item"
                name="menu"
                aria-describedby="inputGroup-sizing-sm"
                onChange={this.handleChange}
              ></FormControl>

              <InputGroup.Append>
                <Button variant="primary" onClick={this.findFood}>
                  Find Food
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
        </Jumbotron>
        <Container>
          <Row className="d-flex justify-content-center">
            <Card
              as={Col}
              md={3}
              style={{
                margin: " 8px 0 0 8px",
                cursor: "pointer"
              }}
              className="d-flex justify-content-center"
              bg="info"
              text="white"
              onClick={e => {
                this.props.history.push("/user/UpcomingOrders");
              }}
            >
              <Card.Header>
                <i className="calendar alternate icon"></i>Upcoming Orders
              </Card.Header>
              <Card.Body>
                <Card.Title>View Upcoming orders</Card.Title>
                <Card.Text>
                  <b>0 upcoming orders</b>
                </Card.Text>
              </Card.Body>
            </Card>
            <Card
              as={Col}
              md={3}
              style={{
                margin: " 8px 0 0 8px",
                cursor: "pointer"
              }}
              className="d-flex justify-content-center"
              bg="info"
              text="white"
              onClick={e => {
                this.props.history.push("/user/pastOrders");
              }}
            >
              <Card.Header>
                <i className="clock icon"></i>Past Orders
              </Card.Header>
              <Card.Body>
                <Card.Title>View Past orders</Card.Title>
                <Card.Text>
                  <b>0 Past orders</b>
                </Card.Text>
              </Card.Body>
            </Card>
            <Card
              as={Col}
              md={3}
              style={{
                margin: " 8px 0 0 8px",
                cursor: "pointer"
              }}
              className="d-flex justify-content-center"
              bg="info"
              text="white"
              onClick={e => {
                this.props.history.push("/Profile");
              }}
            >
              <Card.Header>
                <i className="cog icon"></i>Account Settings
              </Card.Header>
              <Card.Body>
                <Card.Title>Manage your account</Card.Title>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </div>
    );
  }
}
function mapStoreToProps(state) {
  return {
    profile: state.userDetails.userProfile
  };
}
export default connect(
  mapStoreToProps,
  actionCreators
)(UserHome);
