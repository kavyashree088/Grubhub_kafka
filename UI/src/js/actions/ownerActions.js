import axios from "axios";
import { rooturl } from "../../config/constants";

export function createOwner(data, history) {
  console.log("create user");
  return function(dispatch) {
    axios
      .post("http://" + rooturl + ":3001/owner/createOwner", data)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          history.push("/SignIn");
        }
        dispatch({
          type: "CREATE_OWNER",
          payload: {}
        });
      });
  };
}

export function getRestaurantDetails(data) {
  return function(dispatch) {
    axios
      .get("http://" + rooturl + ":3001/owner/restaurant/" + data)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          dispatch({
            type: "RESTAURANT_DETAILS",
            payload: response.data
          });
        }
      });
  };
}

export function getMenu(data) {
  console.log("inside get menu");
  return function(dispatch) {
    axios
      .get("http://" + rooturl + ":3001/owner/menu/" + data)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: "MENU",
            payload: response.data
          });
        }
      });
  };
}

export function addMenuItem(data, id) {
  return function(dispatch) {
    axios
      .post("http://" + rooturl + ":3001/owner/createmenu", data)
      .then(response => {
        if (response.status === 200) {
          dispatch(getMenu(id));
        } else {
          dispatch({
            type: "ADD_MENU",
            payload: "Unable to Update"
          });
        }
      });
  };
}

export function updateMenuItem(data, id) {
  return function(dispatch) {
    axios
      .put("http://" + rooturl + ":3001/owner/updatemenu", data)
      .then(response => {
        if (response.status === 200) {
          dispatch(getMenu(id));
        } else {
          dispatch({
            type: "ADD_MENU",
            payload: "Unable to Update"
          });
        }
      });
  };
}

export function deleteMenuItem(data, id) {
  return function(dispatch) {
    axios
      .delete("http://" + rooturl + ":3001/owner/deletemenu/" + data)
      .then(response => {
        if (response.status === 200) {
          dispatch(getMenu(id));
        } else {
          dispatch({
            type: "DELETE_MENU",
            payload: "Unable to Update"
          });
        }
      });
  };
}
export function getOwnerProfile(data) {
  return function(dispatch) {
    axios
      .get("http://" + rooturl + ":3001/owner/details/" + data)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          dispatch({
            type: "OWNER_PROFILE",
            payload: response.data[0]
          });
        }
      });
  };
}
export function updateOwnerName(data) {
  return function(dispatch) {
    axios
      .put("http://" + rooturl + ":3001/owner/update/name", data)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: "OWNER_NAME_UPDATE",
            payload: "Successfully Updated"
          });
        } else {
          dispatch({
            type: "OWNER_NAME_UPDATE",
            payload: "Unable to Update"
          });
        }
      });
  };
}

export function updateOwnerEmail(data, history) {
  return function(dispatch) {
    axios
      .put("http://" + rooturl + ":3001/owner/update/email", data)
      .then(response => {
        if (response.status === 200) {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("userType");
          history.push("/SignIn");
          dispatch({
            type: "OWNER_EMAIL_UPDATE",
            payload: "Successfully Updated"
          });
        } else {
          dispatch({
            type: "OWNER_EMAIL_UPDATE",
            payload: "Unable to Update"
          });
        }
      });
  };
}
export function updateOwnerPassword(data, history) {
  return function(dispatch) {
    axios
      .put("http://" + rooturl + ":3001/owner/update/password", data)
      .then(response => {
        if (response.status === 200) {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("userType");
          history.push("/SignIn");
          dispatch({
            type: "OWNER_PASSWORD_UPDATE",
            payload: "Successfully Updated"
          });
        } else {
          dispatch({
            type: "OWNER_PASSWORD_UPDATE",
            payload: "Unable to Update"
          });
        }
      });
  };
}

export function updateRestaurantDetails(data) {
  return function(dispatch) {
    axios
      .put("http://" + rooturl + ":3001/owner/update/restaurantdetails", data)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: "RESTAURANT_DETAILS_UPDATE",
            payload: "Successfully Updated"
          });
        } else {
          dispatch({
            type: "RESTAURANT_DETAILS_UPDATE",
            payload: "Unable to Update"
          });
        }
      });
  };
}
export function getRestaurantDetailsById(data) {
  return function(dispatch) {
    axios
      .get("http://" + rooturl + ":3001/owner/restaurantById/" + data)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: "RESTAURANT_DETAILS_ID",
            payload: response.data
          });
        }
      });
  };
}
export function addToCart(data, id) {
  return function(dispatch) {
    axios
      .post("http://" + rooturl + ":3001/user/addToCart", data)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: "ADD_TO_CART",
            payload: "Successfully added to cart"
          });
        } else {
          dispatch({
            type: "ADD_TO_CART",
            payload: "Unable to add to cart"
          });
        }
      })
      .then(response => {
        dispatch(getCartItems(id));
      });
  };
}
export function getCartItems(data) {
  return function(dispatch) {
    axios.get("http://" + rooturl + ":3001/cart/" + data).then(response => {
      if (response.status === 200) {
        dispatch({
          type: "CART_ITEMS",
          payload: response.data
        });
      }
    });
  };
}
export function deleteCartItem(data, id) {
  return function(dispatch) {
    axios
      .delete("http://" + rooturl + ":3001/deletecart/" + data)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: "DELETE_ITEM",
            payload: "Successfully  Updated"
          });
        } else {
          dispatch({
            type: "DELETE_ITEM",
            payload: "Unable to Update"
          });
        }
      })
      .then(response => {
        dispatch(getCartItems(id));
      });
  };
}
export function placeOrder(data) {
  return function(dispatch) {
    axios
      .post("http://" + rooturl + ":3001/placeOrder", data)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: "PLACE_ORDER",
            payload: "Successfully order placed"
          });
        } else {
          dispatch({
            type: "PLACE_ORDER",
            payload: "Unable to place the Order"
          });
        }
      });
  };
}
export function deleteAllCartItems(data) {
  console.log(data);
  return function(dispatch) {
    axios
      .delete("http://" + rooturl + ":3001/deletecartall/" + data)
      .then(response => {
        console.log(data);
        if (response.status === 200) {
          dispatch({
            type: "DELETE_ALL_ITEM",
            payload: "Successfully deleted"
          });
        } else {
          dispatch({
            type: "DELETE_ALL_ITEM",
            payload: "Unable to Update"
          });
        }
      });
  };
}

export function getOrdersforRestaurant(data) {
  return function(dispatch) {
    axios
      .get("http://" + rooturl + ":3001/getOrders/" + data)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: "GET_ORDERS_RESTAURANT",
            payload: response.data
          });
        } else {
          dispatch({
            type: "GET_ORDERS_RESTAURANT",
            payload: "Unable to get orders"
          });
        }
      })
      .catch(err => {
        dispatch({
          type: "GET_ORDERS_RESTAURANT",
          payload: err
        });
      });
  };
}

export function getOrdersItems(data) {
  return function(dispatch) {
    axios
      .get("http://localhost:3001/owner/orderItems/" + data)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: "GET_ORDERS_ITEMS",
            payload: response.data
          });
        } else {
          dispatch({
            type: "GET_ORDERS_ITEMS",
            payload: "Unable to get orders"
          });
        }
      })
      .catch(err => {
        dispatch({
          type: "GET_ORDERS_ITEMS",
          payload: err
        });
      });
  };
}

export function updateItemStatus(data, id) {
  return function(dispatch) {
    axios
      .put("http://" + rooturl + ":3001/updateOrderStatus", data)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: "UPDATE_ORDERS_ITEMS",
            payload: "Sucessfully Updated"
          });
        } else {
          dispatch({
            type: "UPDATE_ORDERS_ITEMS",
            payload: "Unable to get orders"
          });
        }
      })
      .then(response => {
        console.log("here");
        dispatch(getOrdersforRestaurant(id));
      })
      .catch(err => {
        dispatch({
          type: "UPDATE_ORDERS_ITEMS",
          payload: err
        });
      });
  };
}

export function uploadRestaurantImage(data) {
  return function(dispatch) {
    axios
      .post("http://" + rooturl + ":3001/owner/update/restaurant/image", data)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          dispatch({
            type: "RESTAURANT_PIC_UPDATE",
            payload: "Successfully Updated"
          });
        } else {
          dispatch({
            type: "RESTAURANT_PIC_UPDATE",
            payload: "Unable to Update"
          });
        }
      })
      .then(respons => {
        dispatch(getRestaurantDetails(localStorage.getItem("email")));
      });
  };
}

export function deleteSection(name, id) {
  return function(dispatch) {
    axios
      .delete(
        "http://" + rooturl + ":3001/owner/deleteSection/" + name + "/" + id
      )
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          dispatch({
            type: "DELETE_SECTION",
            payload: "Successfully Updated"
          });
        } else {
          dispatch({
            type: "DELETE_SECTION",
            payload: "Unable to Update"
          });
        }
      })
      .then(response => {
        dispatch(getMenu(id));
      });
  };
}
