import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import SignIn from "./components/SignIn/SignIn";
import UserSignUp from "./components/User/UserSignUp";
import OwnerSignUp from "./components/Owner/OwnerSignUp";
import UserProfile from "./components/User/UserProfile";
import OwnerProfile from "./components/Owner/OwnerProfile";
import Menu from "./components/Owner/Menu";
import UserHome from "./components/User/UserHome";
import SearchPage from "./components/User/SearchPage";
import DetailsPage from "./components/User/DetailsPage";
import OwnerHome from "./components/Owner/OwnerHome";
import PastOrders from "./components/Owner/PastOrders";
import AddressAndPhone from "./components/User/AddressAndPhone";
import PastOrdersPage from "./components/User/PastOrdersPage";
import UpcomingOrdersPage from "./components/User/UpcomingOrdersPage";
import Message from "./components/User/Message";
import MessagePage from "./components/Owner/Message";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route path="/SignIn" component={SignIn}></Route>
          <Route path="/UserLogin" component={UserSignUp}></Route>
          <Route path="/OwnerLogin" component={OwnerSignUp}></Route>
          <Route path="/Profile" component={UserProfile}></Route>
          <Route path="/Menu" component={Menu}></Route>
          <Route path="/OwnerProfile" component={OwnerProfile}></Route>
          <Route path="/UserHome" component={UserHome}></Route>
          <Route path="/SearchPage" component={SearchPage}></Route>
          <Route path="/DetailsPage" component={DetailsPage}></Route>
          <Route path="/OwnerHome" component={OwnerHome}></Route>
          <Route path="/Owner/PastOrders" component={PastOrders}></Route>
          <Route path="/user/Messages" component={Message}></Route>
          <Route path="/owner/Messages" component={MessagePage}></Route>
          <Route
            path="/user/AddressAndPhone"
            component={AddressAndPhone}
          ></Route>
          <Route path="/user/PastOrders" component={PastOrdersPage}></Route>
          <Route
            path="/user/UpcomingOrders"
            component={UpcomingOrdersPage}
          ></Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
