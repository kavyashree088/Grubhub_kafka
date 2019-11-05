const initialState = {
  createUser: [],
  loginDetails: [],
  ownerLoginDetails: [],
  ownerProfile: [],
  userProfile: [],
  nameUpdate: "",
  emailUpdate: "",
  passwordlUpdate: "",
  addressUpdate: [],
  phoneNoUpdate: [],
  profilePic: [],
  orderDetails: [],
  itemDetails: [],
  messages: [],
  sendMessages: []
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_USERS":
      return {
        ...state,
        createUser: action.payload
      };
    case "USER_LOGIN":
      return {
        ...state,
        loginDetails: action.payload
      };
    case "OWNER_LOGIN":
      return {
        ...state,
        ownerLoginDetails: action.payload
      };
    case "USER_PROFILE":
      return {
        ...state,
        userProfile: action.payload
      };
    case "OWNER_PROFILE":
      return {
        ...state,
        ownerProfile: action.payload
      };
    case "USER_NAME_UPDATE": {
      return {
        ...state,
        nameUpdate: action.payload
      };
    }
    case "USER_EMAIL_UPDATE": {
      return {
        ...state,
        emailUpdate: action.payload
      };
    }
    case "USER_PASSWORD_UPDATE": {
      return {
        ...state,
        passwordlUpdate: action.payload
      };
    }
    case "USER_ADDRESS_UPDATE": {
      return {
        ...state,
        addressUpdate: action.payload
      };
    }
    case "USER_PHONE_UPDATE": {
      return {
        ...state,
        phoneNoUpdate: action.payload
      };
    }
    case "USER_PROFILE_PIC_UPDATE": {
      return {
        ...state,
        profilePic: action.payload
      };
    }
    case "ORDER_DETAILS": {
      return {
        ...state,
        orderDetails: action.payload
      };
    }
    case "ITEM_DETAILS": {
      return {
        ...state,
        itemDetails: action.payload
      };
    }
    case "MESSAGES": {
      return {
        ...state,
        messages: action.payload
      };
    }
    case "SEND_MESSAGES": {
      return {
        ...state,
        sendMessages: action.payload
      };
    }
    default:
      return state;
  }
};

export default userReducer;
