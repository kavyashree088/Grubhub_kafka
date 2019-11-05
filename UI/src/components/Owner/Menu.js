import React, { Component } from "react";
import Navigation from "../Navbar";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Container,
  Button,
  Table,
  Modal,
  Image
} from "react-bootstrap";
import "../../css/sidebar.css";
import "../../css/grubhub.css";
import Form from "react-bootstrap/Form";
import * as actionCreators from "../../js/actions/ownerActions";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddItem: false,
      itemName: "",
      price: "",
      section: "",
      desc: "",
      nameError: "",
      priceError: "",
      descError: "",
      sectionError: "",
      menuImage: "",
      modal: {
        itemName: "",
        price: "",
        section: "",
        desc: "",
        nameError: "",
        priceError: "",
        descError: "",
        sectionError: "",
        id: "",
        image: ""
      },
      show: false,
      deleteItem: "",
      deleteModalShow: false
    };
  }
  async componentWillMount() {
    if (!localStorage.getItem("jwtToken")) {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
      this.props.history.push("/SignIn");
    }
    await this.props.getRestaurantDetails(localStorage.getItem("email"));
  }
  componentWillReceiveProps(nextProps) {
    const newRes = nextProps.restaurant;
    console.log("here");

    if (newRes !== this.props.restaurant && newRes !== undefined) {
      console.log(newRes);
      this.props.getMenu(newRes._id);
    }
  }
  addItemFlag = () => {
    this.setState({
      isAddItem: true
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  validateAddItem = () => {
    this.setState({
      nameError: "",
      priceError: "",
      descError: "",
      sectionError: ""
    });
    let flag = true;
    if (this.state.itemName.trim().length === 0) {
      this.setState({
        nameError: "*Required"
      });
      flag = false;
    }
    if (this.state.desc.trim().length === 0) {
      this.setState({
        descError: "*Required"
      });
      flag = false;
    }
    if (this.state.price.trim().length === 0) {
      this.setState({
        priceError: "*Required"
      });
      flag = false;
    }
    if (this.state.section === "" || this.state.section === "--select--") {
      this.setState({
        sectionError: "*Required"
      });
      flag = false;
    }
    return flag;
  };
  addItem = () => {
    if (this.validateAddItem()) {
      let formData = new FormData();
      formData.append("name", this.state.itemName);
      formData.append("desc", this.state.desc);
      formData.append("price", this.state.price);
      formData.append("section", this.state.section);
      formData.append("restaurantId", this.props.restaurant._id);
      formData.append("image", this.state.menuImage);
      formData.append("email", localStorage.getItem("email"));
      this.props.addMenuItem(formData, this.props.restaurant._id);
      this.setState({
        isAddItem: false
      });
    }
  };
  cancel = () => {
    this.setState({
      isAddItem: false
    });
  };
  update = event => {
    console.log(event.target.value);
    const item = this.props.menus.find(
      menu => menu.name === event.target.value
    );
    console.log(item);

    this.setState(prevState => ({
      modal: {
        ...prevState.modal,
        itemName: item.name,
        price: item.price,
        section: item.section,
        desc: item.description,
        id: item._id,
        image: item.image
      }
    }));
    this.setState({
      show: true
    });
  };
  handleClose = event => {
    this.setState({
      show: false
    });
  };
  handleModalNameChange = event => {
    let s = event.target.value;
    this.setState(prevState => ({
      modal: {
        ...prevState.modal,
        itemName: s
      }
    }));
  };
  handleModalDescChange = event => {
    let s = event.target.value;
    this.setState(prevState => ({
      modal: {
        ...prevState.modal,
        desc: s
      }
    }));
  };
  handleModalPriceChange = event => {
    let s = event.target.value;
    this.setState(prevState => ({
      modal: {
        ...prevState.modal,
        price: s
      }
    }));
  };
  handleModalSectionChange = event => {
    let s = event.target.value;
    this.setState(prevState => ({
      modal: {
        ...prevState.modal,
        section: s
      }
    }));
  };
  validateModalMenu = () => {
    this.setState(prevState => ({
      modal: {
        ...prevState.modal,
        nameError: "",
        priceError: "",
        descError: "",
        sectionError: ""
      }
    }));
    let flag = true;
    if (this.state.modal.itemName.trim().length === 0) {
      this.setState(prevState => ({
        modal: {
          ...prevState.modal,
          nameError: "*Required"
        }
      }));
      flag = false;
    }
    if (this.state.modal.desc.trim().length === 0) {
      this.setState(prevState => ({
        modal: {
          ...prevState.modal,
          descError: "*Required"
        }
      }));
      flag = false;
    }
    if (this.state.modal.price.trim().length === 0) {
      this.setState(prevState => ({
        modal: {
          ...prevState.modal,
          priceError: "*Required"
        }
      }));
      flag = false;
    }
    if (
      this.state.modal.section === "" ||
      this.state.modal.section === "--select--"
    ) {
      this.setState(prevState => ({
        modal: {
          ...prevState.modal,
          sectionError: "*Required"
        }
      }));
      flag = false;
    }
    return flag;
  };
  updateMenu = () => {
    if (this.validateModalMenu()) {
      console.log(this.state.modal);
      let formData = new FormData();
      formData.append("itemName", this.state.modal.itemName);
      formData.append("desc", this.state.modal.desc);
      formData.append("price", this.state.modal.price);
      formData.append("section", this.state.modal.section);
      formData.append("id", this.state.modal.id);
      formData.append("image", this.state.modal.image);
      this.props.updateMenuItem(formData, this.props.restaurant._id);
      this.setState({
        show: false
      });
    }
  };
  handleDelete = event => {
    const item = this.props.menus.find(
      menu => menu.name === event.target.value
    );
    this.setState({
      deleteModalShow: true,
      deleteItem: item.name
    });
  };
  handleDeleteModalClose = () => {
    this.setState({
      deleteModalShow: false
    });
  };
  deleteMenu = () => {
    const item = this.props.menus.find(
      menu => menu.name === this.state.deleteItem
    );
    this.props.deleteMenuItem(item._id, this.props.restaurant._id);
    this.setState({
      deleteModalShow: false
    });
  };
  onFileChange = event => {
    this.setState({
      menuImage: event.target.files[0]
    });
  };

  onFileChangeModal = event => {
    let imageFile = event.target.files[0];
    this.setState(prevState => ({
      modal: {
        ...prevState.modal,
        image: imageFile
      }
    }));
  };
  deleteBreakfastSection = () => {
    this.props.deleteSection("Breakfast", this.props.restaurant._id);
  };
  deleteLunchSection = () => {
    this.props.deleteSection("Lunch", this.props.restaurant._id);
  };
  deleteAppetizersSection = () => {
    this.props.deleteSection("Appetizers", this.props.restaurant._id);
  };
  render() {
    let breakfastList = this.props.menus.map(menu => {
      if (menu.section === "Breakfast") {
        return (
          <tr>
            <td>{menu.name}</td>
            <td>{menu.description}</td>
            <td>
              {menu.image ? (
                <Image
                  src={`http://localhost:3001/uploads/${menu.image}`}
                  style={{
                    height: "100px",
                    width: "100px"
                  }}
                ></Image>
              ) : (
                <div></div>
              )}
            </td>
            <td>{menu.price}</td>
            <td>
              <Button
                value={menu.name}
                onClick={this.update}
                style={{ float: "right" }}
              >
                Update
              </Button>
            </td>
            <td>
              <Button
                value={menu.name}
                onClick={this.handleDelete}
                variant="danger"
                style={{ float: "right" }}
              >
                Delete
              </Button>
            </td>
          </tr>
        );
      }
      return null;
    });
    let lunchList = this.props.menus.map(menu => {
      if (menu.section === "Lunch") {
        return (
          <tr>
            <td>{menu.name}</td>
            <td>{menu.description}</td>
            <td>
              {menu.image ? (
                <Image
                  src={`http://localhost:3001/uploads/${menu.image}`}
                  style={{
                    height: "100px",
                    width: "100px"
                  }}
                ></Image>
              ) : (
                <div></div>
              )}
            </td>
            <td>{menu.price}</td>
            <td>
              <Button
                value={menu.name}
                onClick={this.update}
                style={{ float: "right" }}
              >
                Update
              </Button>
            </td>
            <td>
              <Button
                value={menu.name}
                onClick={this.handleDelete}
                variant="danger"
                style={{ float: "right" }}
              >
                Delete
              </Button>
            </td>
          </tr>
        );
      }
      return null;
    });
    let appetizersList = this.props.menus.map(menu => {
      if (menu.section === "Appetizers") {
        return (
          <tr>
            <td>{menu.name}</td>
            <td>{menu.description}</td>
            <td>
              {menu.image ? (
                <Image
                  src={`http://localhost:3001/uploads/${menu.image}`}
                  style={{
                    height: "100px",
                    width: "100px"
                  }}
                ></Image>
              ) : (
                <div></div>
              )}
            </td>
            <td>{menu.price}</td>
            <td>
              <Button
                value={menu.name}
                onClick={this.update}
                style={{ float: "right" }}
              >
                Update
              </Button>
            </td>
            <td>
              <Button
                value={menu.name}
                onClick={this.handleDelete}
                variant="danger"
                style={{ float: "right" }}
              >
                Delete
              </Button>
            </td>
          </tr>
        );
      }
      return null;
    });
    return (
      <div>
        <Navigation></Navigation>
        <div>
          <Row>
            <Col className="col-sm-3">
              <div className="vertical-menu bg-light">
                <a href="/Menu" className="header">
                  <h2>Menu</h2>
                </a>
                <a href="/OwnerHome">Home</a>
                <a href="/Menu" className="active">
                  Menu
                </a>
                <a href="/Owner/Messages">Messages</a>
                <a href="/OwnerProfile">Profile</a>
                <a href="/owner/PastOrders">Past Orders</a>
              </div>
            </Col>
            <Col className="col-sm-9">
              <Container>
                <h3 className="pt-5">Manage Restaurant Menu</h3>

                <div className="u-dimension-1">
                  <Button onClick={this.addItemFlag}>Add New Item</Button>
                  {this.state.isAddItem ? (
                    <div className="pt-3">
                      <Form>
                        <Row>
                          <Col>
                            <Form.Group>
                              <Form.Label>Item Name</Form.Label>
                              <Form.Control
                                name="itemName"
                                onChange={this.handleChange}
                              ></Form.Control>
                              <div
                                style={{ fontSize: 12, color: "red" }}
                                className="text-center"
                              >
                                {this.state.nameError}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group>
                              <Form.Label>Item Description</Form.Label>
                              <Form.Control
                                name="desc"
                                onChange={this.handleChange}
                              ></Form.Control>
                              <div
                                style={{ fontSize: 12, color: "red" }}
                                className="text-center"
                              >
                                {this.state.descError}
                              </div>
                            </Form.Group>
                          </Col>

                          <Col>
                            <Form.Group>
                              <Form.Label>Price</Form.Label>
                              <Form.Control
                                name="price"
                                onChange={this.handleChange}
                              ></Form.Control>
                              <div
                                style={{ fontSize: 12, color: "red" }}
                                className="text-center"
                              >
                                {this.state.priceError}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group>
                              <Form.Label>Section</Form.Label>
                              <Form.Control
                                as="select"
                                name="section"
                                onChange={this.handleChange}
                              >
                                <option defaultChecked>--select--</option>
                                <option>Breakfast</option>
                                <option>Lunch</option>
                                <option>Appetizers</option>
                              </Form.Control>
                              <div
                                style={{ fontSize: 12, color: "red" }}
                                className="text-center"
                              >
                                {this.state.sectionError}
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group
                              enctype="multipart/form-data"
                              className="pt-3"
                            >
                              <Form.Control
                                type="file"
                                name="menuImage"
                                onChange={this.onFileChange}
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Button onClick={this.addItem}>Add</Button>
                        <Button
                          variant="outline-secondary"
                          onClick={this.cancel}
                        >
                          Cancel
                        </Button>
                      </Form>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <Row className="pt-3">
                    <Col>
                      <h3>Breakfast Menu</h3>
                    </Col>

                    <Col>
                      <Button
                        variant="secondary"
                        style={{ float: "right" }}
                        onClick={this.deleteBreakfastSection}
                      >
                        Delete Section
                      </Button>
                    </Col>
                  </Row>

                  <div className="pt-3">
                    <Table striped bordered hover>
                      <tbody>{breakfastList}</tbody>
                    </Table>
                  </div>
                  <Row className="pt-3">
                    <Col>
                      <h3>Lunch Menu</h3>
                    </Col>

                    <Col>
                      <Button
                        variant="secondary"
                        style={{ float: "right" }}
                        onClick={this.deleteLunchSection}
                      >
                        Delete Section
                      </Button>
                    </Col>
                  </Row>
                  <div className="pt-3">
                    <Table striped bordered hover>
                      <tbody>{lunchList}</tbody>
                    </Table>
                  </div>
                  <Row className="pt-3">
                    <Col>
                      <h3>Appetizers Menu</h3>
                    </Col>

                    <Col>
                      <Button
                        variant="secondary"
                        style={{ float: "right" }}
                        onClick={this.deleteAppetizersSection}
                      >
                        Delete Section
                      </Button>
                    </Col>
                  </Row>
                  <div className="pt-3">
                    <Table striped bordered hover>
                      <tbody>{appetizersList}</tbody>
                    </Table>
                  </div>
                  <Modal
                    show={this.state.show}
                    onHide={this.handleClose}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Update Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form>
                        <Row>
                          <Col>
                            <Form.Group>
                              <Form.Label>Item Name</Form.Label>
                              <Form.Control
                                name="itemName"
                                defaultValue={this.state.modal.itemName}
                                onChange={this.handleModalNameChange}
                              ></Form.Control>
                              <div
                                style={{ fontSize: 12, color: "red" }}
                                className="text-center"
                              >
                                {this.state.modal.nameError}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group>
                              <Form.Label>Description</Form.Label>
                              <Form.Control
                                name="desc"
                                defaultValue={this.state.modal.desc}
                                onChange={this.handleModalDescChange}
                              ></Form.Control>
                              <div
                                style={{ fontSize: 12, color: "red" }}
                                className="text-center"
                              >
                                {this.state.modal.descError}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group>
                              <Form.Label>Price</Form.Label>
                              <Form.Control
                                name="price"
                                defaultValue={this.state.modal.price}
                                onChange={this.handleModalPriceChange}
                              ></Form.Control>
                              <div
                                style={{ fontSize: 12, color: "red" }}
                                className="text-center"
                              >
                                {this.state.modal.priceError}
                              </div>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group>
                              <Form.Label>Section</Form.Label>
                              <Form.Control
                                as="select"
                                name="section"
                                defaultValue={this.state.modal.section}
                                onChange={this.handleModalSectionChange}
                              >
                                <option defaultChecked>--select--</option>
                                <option>Breakfast</option>
                                <option>Lunch</option>
                                <option>Appetizers</option>
                              </Form.Control>
                              <div
                                style={{ fontSize: 12, color: "red" }}
                                className="text-center"
                              >
                                {this.state.modal.sectionError}
                              </div>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            {this.state.modal.image ? (
                              <Image
                                src={`http://localhost:3001/uploads/${this.state.modal.image}`}
                                style={{
                                  height: "100px",
                                  width: "100px"
                                }}
                              ></Image>
                            ) : (
                              <div></div>
                            )}
                          </Col>
                          <Col>
                            <Form.Group
                              enctype="multipart/form-data"
                              className="pt-3"
                            >
                              <Form.Control
                                type="file"
                                name="menuImageModal"
                                onChange={this.onFileChangeModal}
                              ></Form.Control>
                            </Form.Group>
                          </Col>
                        </Row>
                      </Form>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={this.handleClose}>
                        Close
                      </Button>
                      <Button variant="primary" onClick={this.updateMenu}>
                        Update
                      </Button>
                    </Modal.Footer>
                  </Modal>
                  <Modal
                    show={this.state.deleteModalShow}
                    onHide={this.handleDeleteModalClose}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>Delete Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Are you sure to delete item {this.state.deleteItem}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={this.handleDeleteModalClose}
                      >
                        Close
                      </Button>
                      <Button onClick={this.deleteMenu} variant="danger">
                        Delete
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
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
    restaurant: state.ownerDetails.restaurantDetails,
    menus: state.ownerDetails.menu
  };
}
export default connect(
  mapStoreToProps,
  actionCreators
)(Menu);
