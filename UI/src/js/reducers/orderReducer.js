const initialState = {
  searchMenu: []
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SEARCH_MENU":
      return {
        ...state,
        searchMenu: action.payload
      };
    default:
      return state;
  }
};

export default orderReducer;
