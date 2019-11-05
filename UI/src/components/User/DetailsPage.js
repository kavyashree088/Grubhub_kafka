import React, { Component } from "react";
import Navigation from "../Navbar";
import { connect } from "react-redux";
import * as actionCreators from "../../js/actions/ownerActions";
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
  FormControl
} from "react-bootstrap";
import "../../css/grubhub.css";
import { rooturl } from "../../config/constants";

class DetailsPage extends Component {
  constructor(props) {
    super();
    this.state = {
      itemModalShow: false,
      item: {},
      count: 1
    };
  }
  componentWillMount() {
    if (!localStorage.getItem("jwtToken")) {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      this.props.history.push("/SignIn");
    }
    this.props.getMenu(this.props.location.state.id);
    this.props.getRestaurantDetailsById(this.props.location.state.id);
  }
  componentWillReceiveProps(nextProps) {
    const newCartStatus = nextProps.addCart;
    if (
      newCartStatus !== this.props.addCart &&
      newCartStatus === "Successfully added to cart"
    ) {
      this.props.getCartItems(this.props.userProfile.id);
    }
  }
  handleCardClick = id => event => {
    const item = this.props.menus.find(menu => menu._id === id);
    this.setState({
      itemModalShow: true,
      item: item
    });

    console.log(item);
  };
  handleItemModalClose = () => {
    this.setState({
      itemModalShow: false,
      item: {},
      count: 1
    });
  };
  increment = () => {
    this.setState({
      count: parseInt(this.state.count) + 1
    });
  };
  decrement = () => {
    this.setState({
      count: parseInt(this.state.count) - 1
    });
  };
  handleChange = event => {
    this.setState({
      count: event.target.value
    });
  };
  addToCart = () => {
    if (this.state.count > 0) {
      let data = {
        itemId: this.state.item._id,
        itemName: this.state.item.name,
        price: this.state.count * parseFloat(this.state.item.price),
        quantity: this.state.count,
        userId: this.props.userProfile._id
      };
      console.log(data);
      this.props.addToCart(data, this.props.userProfile._id);
      this.setState({
        itemModalShow: false,
        item: {},
        count: 1
      });
    }
  };
  render() {
    let breakfastList = this.props.menus.map(menu => {
      if (menu.section === "Breakfast") {
        return (
          <Card
            as={Col}
            md={5}
            style={{
              margin: " 8px 0 0 8px"
            }}
          >
            <div
              onClick={this.handleCardClick(menu._id)}
              style={{
                cursor: "pointer"
              }}
            >
              <Card.Body>
                <Row>
                  <Col>
                    <Card.Title>{menu.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {menu.description}
                    </Card.Subtitle>
                    <Card.Text>
                      <b>{menu.price}$</b>
                    </Card.Text>
                  </Col>
                  <Col>
                    {menu.image ? (
                      <Image
                        src={`http://${rooturl}:3001/uploads/${menu.image}`}
                        style={{
                          height: "100px",
                          width: "100px"
                        }}
                      ></Image>
                    ) : (
                      <div></div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </div>
          </Card>
        );
      }
      return null;
    });
    let lunchList = this.props.menus.map(menu => {
      if (menu.section === "Lunch") {
        return (
          <Card
            as={Col}
            md={5}
            style={{
              margin: " 8px 0 0 8px"
            }}
          >
            <div
              onClick={this.handleCardClick(menu._id)}
              style={{
                cursor: "pointer"
              }}
            >
              <Card.Body>
                <Row>
                  <Col>
                    <Card.Title>{menu.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {menu.description}
                    </Card.Subtitle>
                    <Card.Text>
                      <b>{menu.price}$</b>
                    </Card.Text>
                  </Col>
                  <Col>
                    {menu.image ? (
                      <Image
                        src={`http://${rooturl}:3001/uploads/${menu.image}`}
                        style={{
                          height: "100px",
                          width: "100px"
                        }}
                      ></Image>
                    ) : (
                      <div></div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </div>
          </Card>
        );
      }
      return null;
    });
    let appetizersList = this.props.menus.map(menu => {
      if (menu.section === "Appetizers") {
        return (
          <Card
            as={Col}
            md={5}
            style={{
              margin: " 8px 0 0 8px"
            }}
          >
            <div
              onClick={this.handleCardClick(menu._id)}
              style={{
                cursor: "pointer"
              }}
            >
              <Card.Body>
                <Row>
                  <Col>
                    <Card.Title>{menu.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {menu.description}
                    </Card.Subtitle>
                    <Card.Text>
                      <b>{menu.price}$</b>
                    </Card.Text>
                  </Col>
                  <Col>
                    {menu.image ? (
                      <Image
                        src={`http://${rooturl}:3001/uploads/${menu.image}`}
                        style={{
                          height: "100px",
                          width: "100px"
                        }}
                      ></Image>
                    ) : (
                      <div></div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </div>
          </Card>
        );
      }
      return null;
    });
    return (
      <div>
        <Navigation></Navigation>
        <div>
          <Button
            variant="outline-dark"
            onClick={e => {
              window.history.back();
            }}
          >
            <i class="arrow left icon"></i> Go Back
          </Button>
        </div>
        <div>
          <Row>
            <Col className="col-sm-9">
              <Container className="u-dimension-1">
                <div
                  style={{
                    height: "170px !important",
                    width: "100%",
                    display: "block"
                  }}
                >
                  <Image
                    src={`http://${rooturl}:3001/uploads/${this.props.restaurant.image}`}
                  ></Image>
                </div>
                <h2>{this.props.restaurant.name || ""}</h2>
                <hr></hr>
                <h4>Menu</h4>
                <hr></hr>
                <h3>Breakfast Menu</h3>
                <Row>{breakfastList}</Row>
                <hr></hr>
                <h3>Lunch Menu</h3>
                <Row>{lunchList}</Row>
                <hr></hr>
                <h3>Appetizers Menu</h3>
                <Row>{appetizersList}</Row>
                <Modal
                  show={this.state.itemModalShow}
                  onHide={this.handleItemModalClose}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Add Item to Cart</Modal.Title>
                  </Modal.Header>
                  <Row>
                    <Col>
                      <Modal.Body>
                        <h3 className="text-center">{this.state.item.name}</h3>
                        <p className="text-center">{this.state.item.price} $</p>
                        <div className="d-flex justify-content-center">
                          <InputGroup className="col-sm-5">
                            <InputGroup.Prepend>
                              <Button
                                variant="outline-secondary"
                                onClick={this.decrement}
                                style={{
                                  margin: "0 0 0 0"
                                }}
                              >
                                -
                              </Button>
                            </InputGroup.Prepend>
                            <FormControl
                              aria-label="Large"
                              value={this.state.count}
                              name="cuisine"
                              aria-describedby="inputGroup-sizing-sm"
                              onChange={this.handleChange}
                              style={{
                                MozAppearance: "textfield"
                              }}
                              type="number"
                              min="1"
                              max="1000"
                            ></FormControl>

                            <InputGroup.Append>
                              <Button
                                variant="outline-secondary"
                                onClick={this.increment}
                              >
                                +
                              </Button>
                            </InputGroup.Append>
                          </InputGroup>
                        </div>
                      </Modal.Body>
                    </Col>
                    <Col>
                      <Image
                        src={`http://${rooturl}:3001/uploads/${this.state.item.image}`}
                        thumbnail
                      ></Image>
                    </Col>
                  </Row>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={this.handleItemModalClose}
                    >
                      Close
                    </Button>
                    <Button onClick={this.addToCart} variant="primary">
                      <b>
                        {" "}
                        Add to Cart : {this.state.count *
                          this.state.item.price}{" "}
                        $
                      </b>
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Container>
            </Col>
            <Col className="col-sm-3">
              <div className="vertical-menu u-dimension-1">
                <div className="header">
                  <h2>Your Cart</h2>
                  <Cart></Cart>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

function mapStoreToProps(state) {
  return {
    menus: state.ownerDetails.menu,
    restaurant: state.ownerDetails.restaurantDetailsID,
    userProfile: state.userDetails.userProfile,
    cartItem: state.ownerDetails.cartItems,
    addCart: state.ownerDetails.addTocart
  };
}
export default connect(
  mapStoreToProps,
  actionCreators
)(DetailsPage);
