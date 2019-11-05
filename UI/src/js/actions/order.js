import axios from "axios";

export function searchByMenu(data) {
  console.log("create user");
  return function(dispatch) {
    axios.get("http://localhost:3001/searchMenu/" + data).then(response => {
      console.log(response);
      dispatch({
        type: "SEARCH_MENU",
        payload: response.data
      });
    });
  };
}
