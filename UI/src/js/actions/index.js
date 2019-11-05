import axios from "axios";
import { rooturl } from "../../config/constants";

export function createUser(data, history) {
  console.log("create user");
  return function(dispatch) {
    axios
      .post("http://" + rooturl + ":3001/user/createUser", data)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          history.push("/SignIn");
        }
        dispatch({
          type: "CREATE_USERS",
          users: {}
        });
      });
  };
}

export function userLogin(data, history) {
  console.log("user login");
  return function(dispatch) {
    axios.defaults.withCredentials = true;
    axios
      .post("http://" + rooturl + ":3001/user/loginUser", data)
      .then(response => {
        if (response.status === 200) {
          localStorage.setItem("jwtToken", response.data.token);
          localStorage.setItem("userType", response.data.userType);
          localStorage.setItem("email", data.email);
          localStorage.setItem("password", data.password);
          history.push("/UserHome");
          dispatch({
            type: "USER_LOGIN",
            payload: {
              authflag: true,
              firstName: response.data.user[0].firstName,
              email: data.email,
              password: data.password
            }
          });
        } else {
          history.push("/SignIn");
          dispatch({
            type: "USER_LOGIN",
            payload: {
              authflag: false
            }
          });
        }
      })
      .catch(error => {
        console.log("in catch");
        console.log(error);
        history.push("/SignIn");
        dispatch({
          type: "USER_LOGIN",
          payload: {
            authflag: false
          }
        });
      });
  };
}

export function getUserProfile(data) {
  return function(dispatch) {
    console.log("profile");
    console.log(data);
    axios
      .get("http://" + rooturl + ":3001/user/userdetails/" + data)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          dispatch({
            type: "USER_PROFILE",
            payload: response.data[0]
          });
        }
      });
  };
}

export function updateUserName(data) {
  return function(dispatch) {
    axios
      .put("http://" + rooturl + ":3001/user/update/name", data)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: "USER_NAME_UPDATE",
            payload: "Successfully Updated"
          });
        } else {
          dispatch({
            type: "USER_NAME_UPDATE",
            payload: "Unable to Update"
          });
        }
      });
  };
}

export function updateUserEmail(data, history) {
  return function(dispatch) {
    axios
      .put("http://" + rooturl + ":3001/user/update/email", data)
      .then(response => {
        if (response.status === 200) {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
          history.push("/SignIn");
          dispatch({
            type: "USER_EMAIL_UPDATE",
            payload: "Successfully Updated"
          });
        } else {
          dispatch({
            type: "USER_EMAIL_UPDATE",
            payload: "Unable to Update"
          });
        }
      });
  };
}
export function updateUserPassword(data, history) {
  return function(dispatch) {
    axios
      .put("http://" + rooturl + ":3001/user/update/password", data)
      .then(response => {
        if (response.status === 200) {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
          history.push("/SignIn");
          dispatch({
            type: "USER_PASSWORD_UPDATE",
            payload: "Successfully Updated"
          });
        } else {
          dispatch({
            type: "USER_PASSWORD_UPDATE",
            payload: "Unable to Update"
          });
        }
      });
  };
}

export function ownerLogin(data, history) {
  console.log("owner login");
  return function(dispatch) {
    axios.defaults.withCredentials = true;
    axios
      .post("http://" + rooturl + ":3001/owner/login", data)
      .then(response => {
        if (response.status === 200) {
          console.log("200");
          console.log(data.email);
          localStorage.setItem("jwtToken", response.data.token);
          localStorage.setItem("userType", response.data.userType);
          localStorage.setItem("email", data.email);
          localStorage.setItem("password", data.password);
          console.log(localStorage.getItem("email"));
          history.push("/OwnerHome");
          dispatch({
            type: "OWNER_LOGIN",
            payload: {
              authflag: true,
              firstName: response.data.user[0].firstName,
              email: data.email,
              password: data.password
            }
          });
        } else {
          history.push("/SignIn");
          dispatch({
            type: "OWNER_LOGIN",
            payload: {
              authflag: false
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
        history.push("/SignIn");
        dispatch({
          type: "OWNER_LOGIN",
          payload: {
            authflag: false
          }
        });
      });
  };
}

export function getOwnerProfile(data) {
  return function(dispatch) {
    console.log("profile");
    console.log(data);
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

export function updateUserAddress(data) {
  return function(dispatch) {
    axios
      .put("http://" + rooturl + ":3001/user/update/address", data)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: "USER_ADDRESS_UPDATE",
            payload: "Successfully Updated"
          });
        } else {
          dispatch({
            type: "USER_ADDRESS_UPDATE",
            payload: "Unable to Update"
          });
        }
      });
  };
}

export function updateUserPhoneNo(data) {
  return function(dispatch) {
    axios
      .put("http://" + rooturl + ":3001/user/update/phoneNo", data)
      .then(response => {
        if (response.status === 200) {
          dispatch({
            type: "USER_PHONE_UPDATE",
            payload: "Successfully Updated"
          });
        } else {
          dispatch({
            type: "USER_PHONE_UPDATE",
            payload: "Unable to Update"
          });
        }
      });
  };
}

export function uploadUserProfile(data, email) {
  return function(dispatch) {
    axios
      .post("http://" + rooturl + ":3001/user/update/profilePhoto", data)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          dispatch({
            type: "USER_PROFILE_PIC_UPDATE",
            payload: "Successfully Updated"
          });
        } else {
          dispatch({
            type: "USER_PROFILE_PIC_UPDATE",
            payload: "Unable to Update"
          });
        }
      })
      .then(result => {
        dispatch(getUserProfile(email));
      });
  };
}

export function getOrderDetails(data) {
  return function(dispatch) {
    axios
      .get("http://" + rooturl + ":3001/getUserOrders/" + data)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          dispatch({
            type: "ORDER_DETAILS",
            payload: response.data
          });
        } else {
          dispatch({
            type: "ORDER_DETAILS",
            payload: "Unable to Update"
          });
        }
      })
      .catch(err => {
        dispatch({
          type: "ORDER_DETAILS",
          payload: err
        });
      });
  };
}
export function getItemDetails(data) {
  return function(dispatch) {
    axios
      .get("http://localhost:3001/user/getItems/" + data)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          dispatch({
            type: "ITEM_DETAILS",
            payload: response.data
          });
        } else {
          dispatch({
            type: "ITEM_DETAILS",
            payload: "Unable to Update"
          });
        }
      })
      .catch(err => {
        dispatch({
          type: "ITEM_DETAILS",
          payload: err
        });
      });
  };
}

export function getMessages(data) {
  return function(dispatch) {
    console.log(data);
    axios
      .get("http://" + rooturl + ":3001/message/getMessages/" + data)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          dispatch({
            type: "MESSAGES",
            payload: response.data
          });
        } else {
          dispatch({
            type: "MESSAGES",
            payload: "Unable to Update"
          });
        }
      })
      .catch(err => {
        dispatch({
          type: "MESSAGES",
          payload: err
        });
      });
  };
}
export function sendMessages(data, senderId) {
  return function(dispatch) {
    axios
      .post("http://" + rooturl + ":3001/message/postMessages", data)
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          dispatch({
            type: "SEND_MESSAGES",
            payload: response
          });
        } else {
          dispatch({
            type: "SEND_MESSAGES",
            payload: "Unable to Send"
          });
        }
      })
      .then(response => {
        dispatch(getMessages(senderId));
      })
      .catch(err => {
        dispatch({
          type: "SEND_MESSAGES",
          payload: err
        });
      });
  };
}
