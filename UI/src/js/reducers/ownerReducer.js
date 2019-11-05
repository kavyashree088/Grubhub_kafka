const initialState = {
  createOwner: [],
  restaurantDetails: [],
  menu: [],
  addMenu: [],
  deleteMenuItem: [],
  ownerProfile: [],
  nameUpdate: [],
  emailUpdate: [],
  passwordlUpdate: [],
  restaurantUpdate: [],
  restaurantDetailsID: [],
  addTocart: [],
  cartItems: [],
  orderPlaced: [],
  cartEmptied: [],
  getOrdersRestaurant: [],
  getOrderItems: [],
  updateOrdersRestaurant: [],
  restaurantImage: [],
  deleteSection: []
};

const ownerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_OWNER":
      return {
        ...state,
        createOwner: action.payload
      };
    case "RESTAURANT_DETAILS":
      return {
        ...state,
        restaurantDetails: action.payload
      };
    case "MENU":
      return {
        ...state,
        menu: action.payload
      };
    case "ADD_MENU":
      return {
        ...state,
        addMenu: action.payload
      };
    case "DELETE_MENU":
      return {
        ...state,
        deleteMenuItem: action.payload
      };
    case "OWNER_PROFILE":
      return {
        ...state,
        ownerProfile: action.payload
      };
    case "OWNER_NAME_UPDATE": {
      return {
        ...state,
        nameUpdate: action.payload
      };
    }
    case "OWNER_EMAIL_UPDATE": {
      return {
        ...state,
        emailUpdate: action.payload
      };
    }
    case "OWNER_PASSWORD_UPDATE": {
      return {
        ...state,
        passwordlUpdate: action.payload
      };
    }
    case "RESTAURANT_DETAILS_UPDATE": {
      return {
        ...state,
        restaurantUpdate: action.payload
      };
    }
    case "RESTAURANT_DETAILS_ID":
      return {
        ...state,
        restaurantDetailsID: action.payload
      };
    case "ADD_TO_CART":
      return {
        ...state,
        addTocart: action.payload
      };
    case "CART_ITEMS":
      return {
        ...state,
        cartItems: action.payload
      };
    case "PLACE_ORDER":
      return {
        ...state,
        orderPlaced: action.payload
      };
    case "DELETE_ALL_ITEM":
      return {
        ...state,
        cartEmptied: action.payload
      };
    case "GET_ORDERS_ITEMS":
      return {
        ...state,
        getOrderItems: action.payload
      };
    case "GET_ORDERS_RESTAURANT":
      return {
        ...state,
        getOrdersRestaurant: action.payload
      };
    case "UPDATE_ORDERS_ITEMS":
      return {
        ...state,
        updateOrdersRestaurant: action.payload
      };
    case "RESTAURANT_PIC_UPDATE":
      return {
        ...state,
        restaurantImage: action.payload
      };
    case "DELETE_SECTION":
      return {
        ...state,
        deleteSection: action.payload
      };
    default:
      return state;
  }
};

export default ownerReducer;
