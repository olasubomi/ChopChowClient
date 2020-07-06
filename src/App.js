import React, { Component } from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";

import { Link, Route, Switch, Redirect } from "react-router-dom";
import HomePage from "./components/HomePage";
import MealsPage from "./components/mealsPage/MealsPage";
import ProductsSection from "./components/productsPage/ProductsPage";
import Login from "./components/Login";
import GroceryPage from "./components/GroceryPage";
import ProductFullDetail from "./components/ProductFullDetail/ProductFullDetail";
import SignUp from "./components/signup";
import ForgotPassword from "./components/forgotpassword";
import ResetPassword from "./components/resetpassword";
import SuggestMeal from "./components/SuggestMeal";
import ViewSuggestedMeals from "./components/ViewSuggestedMeals";
import AdminPanel from "./components/AdminPanel/AdminPanel";

class App extends Component {
  constructor(props) {
    super(props);
    this.updateLogInStatus = this.updateLogInStatus.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    this.state = {
      suggestMealPopOver: false,
      isAuthenticated: false,
      customerId: null,
    };
  }

 
  updateLogInStatus(customerId) {
    console.log("updates log in status before");
    this.setState({ isAuthenticated: true });
    this.setState({ customerId: customerId });

    console.log("updates log in status after");
    console.log("customerID is:" + customerId);
  }

  // componentDidMount() {
  //   console.log("Comes in app.js's component did mount");
  //   this.authenticateUser();
  //   console.log("customerID is:" + this.state.customerId);
  // }

  // authenticateUser() {
  //   var localToken = window.localStorage.getItem("userToken");
  //   // api authenticate user calls authenticationVerify,isAuthenticated

  //   // var url = `https://chopchowdev.herokuapp.com/api/authenticate-grocery-page`;
  //   var url = `/api/authenticate-app-page`;
  //   // var url = `http://localhost:5000/api/authenticate-grocery-page`
  //   fetch(url, {
  //     method: "GET",
  //     credentials: "same-origin",
  //     headers: {
  //       "Content-type": "application/json",
  //       Authorization: "Bearer " + localToken,
  //     },
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((response) => {
  //       console.log("api/ authenticate (app page) response:");
  //       console.log(response);

  //       if (response.success && response.data) {
  //         this.setState({ isAuthenticated: true });
  //       } else {
  //         this.setState({ isAuthenticated: false });
  //       }

  //       this.setState({ customerId: response.data });
  //       const { customerId } = this.state;
  //       console.log("customer id iis: " + customerId);
  //     })
  //     .catch((err) => {
  //       console.log("fails to authenticate app page");
  //       console.log(err);
  //     });
  // }

  //////////////////////////////////////////////////////////////////////
  componentDidMount() {
    console.log("Comes in app.js's component did mount");
    this.authenticateUser();
    console.log("customerID is:" + this.state.customerId);
  }

  //////////////////////////////////////////////////////////////////////
  authenticateUser() {
    var localToken = window.localStorage.getItem("userToken");
    // api authenticate user calls authenticationVerify,isAuthenticated
    // var url = `https://chopchowdev.herokuapp.com/api/authenticate-grocery-page`;
    var url = `/api/authenticate-app-page`;
    // var url = `http://localhost:5000/api/authenticate-grocery-page`
    fetch(url, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localToken,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        console.log("api/ authenticate (app page) response:");
        console.log(response);

        if (response.success && response.data) {
          this.setState({ isAuthenticated: true });
        } else { this.setState({ isAuthenticated: false }); }

        this.setState({ customerId: response.data, username: response.username });
        const { customerId, username } = this.state;
        console.log("customer id iis: " + customerId);
        console.log("username iis: " + username);
      })
      .catch((err) => {
        console.log("fails to authenticate app page");
        console.log(err);
      });
  }

  handleLogout() {
    //clear cookie cache
    window.localStorage.setItem("userToken", null);

    var url = "/api/logout";

    fetch(url, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        response.json().then((res) => {
          console.log("logout response is:");
          console.log(res);
          console.log("should print body");
          // var bodyResponse = JSON.parse(res.body);
          console.log(res.data);
          if (res.data === "success") {
            console.log("comes to turn off authentication state");
            this.setState({ isAuthenticated: false });
          }
        });
      })
      .catch((err) => {
        console.log("fails to authenticate app page");
        console.log(err);
      });

    this.setState({ isAuthenticated: false });
    window.location.reload(false);
  }

  render() {
    // Render your page inside
    // the layout provider
    const { itemTypeahead, isAuthenticated,  customerId,  username,  } = this.state;
    const items = [];
    var userRole = window.localStorage.getItem("userRole");
    var userToken = window.localStorage.getItem("userToken");

    return (
      <div>        
        <Header data = {this.state}/>    
        <Switch>
            <Route exact path="/login"  
              render={() => (
                <Login updateLogInStatus={this.updateLogInStatus}/>
              )}
            />
            <Route exact path="/admin" render={(props) => <AdminPanel {...props} />} />
            <Route exact path="/signup" render={(props) => <SignUp {...props} />} />
            <Route exact path="/resetpass" render={(props) => <ResetPassword {...props} />} />
            <Route exact path="/forgotpass" render={(props) => <ForgotPassword {...props} />}/>
            <Route exact path="/" render={(props) => (
                <div>
                  <div id="title"><b>Meals</b></div>
                  <div className="container">
                    <div className="row">{items}</div>
                  </div>
                </div>
              )}
            />

            <Route path="/home" render={() => (userToken!=="null")?<HomePage />:(<Redirect to={{pathname:"#"}}/>)} />
            <Route path="/v2" render={() =>  (userToken!=="null")?<MealsPage />: (<Redirect to={{pathname:"#"}}/>)}/>
            <Route exact path="/grocery"
              render={() => (userToken!=="null")?(
                <GroceryPage
                  auth={userToken}
                  dataTypeaheadProps={itemTypeahead}
                  customerId={customerId}
                />):(<Redirect to={{pathname:"#"}}/>)
              }
            />
            <Route path="/products" render={(props) => {
              return (userToken !== "null")? (<ProductsSection/>):(<Redirect to={{pathname:"/"}}/>)
            }} />
            <Route exact path="/SuggestMeal" render={(props) => (userToken!=="null")? (<SuggestMeal />):(<Redirect to={{pathname:"/"}}/>)}/>
            <Route exact path="/ViewSuggestedMeals" render={(props) => ( (userToken!=="null") && (userRole==="admin"))? <ViewSuggestedMeals/> :(<Redirect to={{pathname:"#"}}/>)}/>
            <Route path="/product-detail/:customerId/:productId" render={(props) => (userToken!=="null")? <ProductFullDetail/>:(<Redirect to={{pathname:"#"}}/>)}/>
            {/* <Route path="/product-detail/:customerId/:productId" component={ProductFullDetail} /> */}
          </Switch>    
        <Footer />
      </div>
    );
  }
}
export default App;
