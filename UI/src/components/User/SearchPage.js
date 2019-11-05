import React, { Component } from "react";
import Navigation from "../Navbar";
import { connect } from "react-redux";
import * as actionCreators from "../../js/actions/order";
import {
  Card,
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Col
} from "react-bootstrap";

class SearchPage extends Component {
  constructor(props) {
    super();
    this.state = {
      restaurantSearch: [],
      cuisine: ""
    };
  }
  componentWillMount() {
    if (!localStorage.getItem("jwtToken")) {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      this.props.history.push("/SignIn");
    }
    console.log(this.props.location.state);
    if (this.props.location.state.menu.trim().length !== 0) {
      this.props.searchByMenu(this.props.location.state.menu.trim());
    }
  }
  componentWillReceiveProps(nextProps) {
    const newSearchMenu = nextProps.searchMenu;
    if (newSearchMenu !== this.props.searchMenu) {
      this.setState({
        restaurantSearch: newSearchMenu
      });
    }
  }
  handleCardClick = id => event => {
    this.props.history.push({
      pathname: "/DetailsPage",
      state: { id: id }
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  filter = event => {
    this.setState(
      {
        restaurantSearch: []
      },
      () => {
        this.props.searchMenu.map(restaurant => {
          if (
            restaurant.restaurant.cuisine
              .toLowerCase()
              .includes(this.state.cuisine.toLowerCase())
          ) {
            this.setState({
              restaurantSearch: this.state.restaurantSearch.concat(restaurant)
            });
          }
          return null;
        });
      }
    );
  };
  render() {
    let searchByMenuList = this.state.restaurantSearch.map(restaurant => {
      return (
        <div className="pt-3">
          <Card
            style={{
              cursor: "pointer"
            }}
          >
            <div onClick={this.handleCardClick(restaurant.restaurant._id)}>
              <Card.Body>
                <Card.Title>{restaurant.restaurant.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {restaurant.restaurant.cuisine}
                </Card.Subtitle>
                <Card.Text>
                  <i class="address card outline icon"></i>
                  {restaurant.restaurant.address}
                </Card.Text>
                <Card.Text>
                  <i class="phone icon"></i>
                  {restaurant.restaurant.phoneNo}
                </Card.Text>
              </Card.Body>
            </div>
          </Card>
        </div>
      );
    });
    return (
      <div>
        <Navigation></Navigation>
        <div>
          <Row>
            <Col className="col-sm-3">
              <div className="vertical-menu bg-light">
                <a href="/SearchPage" className="header">
                  <h2>Search</h2>
                </a>
                <a href="/UserHome">Home</a>
                <a href="/SearchPage" className="active">
                  Search Page
                </a>
                <a href="/Profile">Profile</a>
                <a href="/user/AddressAndPhone">Address and phone</a>
                <a href="/user/PastOrders">Past orders</a>
                <a href="/user/UpcomingOrder">Upcoming orders</a>
              </div>
            </Col>
            <Col className="col-sm-9">
              <Container className="pt-5">
                <div>
                  <h3>
                    Best bets for{" "}
                    <div
                      style={{
                        color: "#0070eb"
                      }}
                    >
                      {this.props.location.state.menu}
                    </div>
                  </h3>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6b6b83"
                    }}
                  >
                    {this.state.restaurantSearch.length || 0} Restaurants
                  </div>
                  <hr></hr>
                </div>
                <div className="d-flex justify-content-center">
                  <InputGroup className="col-sm-6">
                    <FormControl
                      aria-label="Large"
                      placeholder="Filter By Cuisine"
                      name="cuisine"
                      aria-describedby="inputGroup-sizing-sm"
                      onChange={this.handleChange}
                    ></FormControl>

                    <InputGroup.Append>
                      <Button variant="primary" onClick={this.filter}>
                        Filter
                      </Button>
                    </InputGroup.Append>
                  </InputGroup>
                </div>
                <hr></hr>
                <div>{searchByMenuList}</div>
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
    searchMenu: state.orderDetails.searchMenu
  };
}
export default connect(
  mapStoreToProps,
  actionCreators
)(SearchPage);
