import React, { Component, useState } from "react";
import { Link, Route, Switch } from "react-router-dom";
import HomePage from "../HomePage";
import MealsPage from "../mealsPage/MealsPage";
import ProductsSection from "../productsPage/ProductsPage";
import Login from "../Login";
import GroceryPage from "../GroceryPage";
import ProductFullDetail from "../ProductFullDetail/ProductFullDetail";
import SignUp from "../signup";
import ForgotPassword from "../forgotpassword";
import ResetPassword from "../resetpassword";
import SuggestMeal from "../SuggestMeal";
import ViewSuggestedMeals from "../ViewSuggestedMeals";
import img_logo from "../../assets/images/logo2.png"
import './header.scss';
import Dropdown from 'react-bootstrap/Dropdown'


//////////////////////////////////////////////////////////////////////
class Header extends Component {
  constructor(props) {
    super(props);

    this.updateLogInStatus = this.updateLogInStatus.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    this.state = {
      suggestMealPopOver: false,
      base_index: 0,
      topNav_className: "w3-bar w3-dark-grey w3-green topnav",
      isAuthenticated: false,
      customerId: null,
      username: null,
    };
  }

  //////////////////////////////////////////////////////////////////////
  updateLogInStatus(customerId, username) {
    console.log("updates log in status before");
    this.setState({ isAuthenticated: true });
    this.setState({ customerId: customerId });
    this.setState({ username: username });

    console.log("updates log in status after");
    console.log("customerID is:" + customerId);
  }

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

  //////////////////////////////////////////////////////////////////////
  CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#x25bc;
    </a>
  ));

  //////////////////////////////////////////////////////////////////////
  handleLogout(e) {
    if(e === "5")
    {
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
  }

  //////////////////////////////////////////////////////////////////////
  render() {
    // Render your page inside
    // the layout provider
    //const elements = ['one', 'two', 'three'];
    //const popOverInfo = []
    const {
      itemTypeahead,
      // valueAllDataLists,
      isAuthenticated,
      customerId,
      username,
    } = this.state;

    const items = [];
    /* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
    function myFunction() {
      var x = document.getElementById("mobileNavbar");
      console.log(x);
      // console.log({this.state.topNav_className});
      if (x.className === "mobileNavbar") {
        x.className += " visible";
      } else {
        x.className = "mobileNavbar";
      }

      // var y = document.getElementById("myTopnav2");
      // if (y.className === "topnav"){
      //     y.className += " responsive";
      //   }
      //   else{
      //       //sync test nav bar as well
      //       y.className = "topnav";
      //   }
    }

    var login_on_desktop_navbar;
    var login_on_burger_navbar;

    console.log("sssss,", isAuthenticated);


    if (isAuthenticated) {
      login_on_desktop_navbar = (
        <li className="nav-item">
          <Dropdown alignRight>
          <Dropdown.Toggle as={this.CustomToggle} id="dropdown-custom-components">
              {username}
          </Dropdown.Toggle>
          <Dropdown.Menu >
            <Dropdown.Item eventKey="1" onSelect={(ev, obj)=>this.handleLogout(ev)}>Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="2" onSelect={(ev, obj)=>this.handleLogout(ev)}>Dashboard/orders</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="3" onSelect={(ev, obj)=>this.handleLogout(ev)}>Support</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4" onSelect={(ev, obj)=>this.handleLogout(ev)}>Switch to driver mode</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="5" onSelect={(ev, obj)=>this.handleLogout(ev)}>Log out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </li>
      );

      login_on_burger_navbar = (
        // <li className="nav-item" style={{ padding: "14px 16px" }}>
        //   <button
        //     to="/login"
        //     className="nav-link px-2"
        //     style={{ color: "#FFFFFF" }}
        //     onClick={this.handleLogout}
        //   >
        //     Logout
        //   </button>
        // </li>
        <li className="nav-item">
          <Dropdown>
          <Dropdown.Toggle className="user-item" as={this.CustomToggle} id="dropdown-custom-components">
              {username}
          </Dropdown.Toggle>
          <Dropdown.Menu >
            <Dropdown.Item eventKey="1" onSelect={(ev, obj)=>this.handleLogout(ev)}>Profile</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="2" onSelect={(ev, obj)=>this.handleLogout(ev)}>Dashboard/orders</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="3" onSelect={(ev, obj)=>this.handleLogout(ev)}>Support</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="4" onSelect={(ev, obj)=>this.handleLogout(ev)}>Switch to driver mode</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item eventKey="5" onSelect={(ev, obj)=>this.handleLogout(ev)}>Log out</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </li>
      );

    } else {
      login_on_desktop_navbar = (
        <li className="nav-item">
          <Link to="/login" className="nav-link px-2">
            Log In / Register
          </Link>
        </li>
      );
      login_on_burger_navbar = (
        <li className="nav-item" style={{ padding: "14px 16px" }}>
          <Link
            to="/login"
            className="nav-link px-2"
            style={{ color: "#FFFFFF" }}
          >
            Log In / Register
          </Link>
        </li>
      );
    }

    return (
      <div className="header-wraper">
        <nav
          className="navbar navbar-expand-md fixed-top-sm justify-content-start flex-nowrap navbar-light"
          style={{
            backgroundColor: "#FFFFFF", borderBottom: "1px solid #fd7e14"
          }}
        >
          {/* Desktop Navbar */}
          <div className="header-panel w-100">
            <div className="header-left ">
              <Link to="/" className="logo_tag navbar-brand ">
                <img src={img_logo} width="60px" />
              </Link>
              <div className=" form-inline navbar-first" style={{ padding: "14px 16px"}}>
                <div className="input-group " >
                  <input
                    className="form-control "
                    placeholder="Search meal or category"
                  />
                  <span className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      style={{
                        backgroundColor: "#fd7e14",
                        borderColor: "#fd7e14",
                      }}
                    >
                      <i className="fa fa-search" style={{ color: "#FFFFFF" }}></i>
                    </button>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="header-right navbar-first">
              <ul className="navbar-nav flex-row">
                <li className="nav-item">
                  <Link to="/grocery" className="nav-link px-3">
                    Grocery List
                    </Link>
                </li>
                <li className="nav-item">
                  <Link to="/products" className="nav-link px-3">
                    Shoping Cart
                    </Link>
                </li>
                {login_on_desktop_navbar}                
              </ul>              
            </div>
          </div>

          <Link to="#" className="icon navbar-toggle" onClick={() => { console.log("Comes thru here"); myFunction(); }}  >
            <i className="fa fa-bars" style={{ color: "#AAAAAA", right: "1%" }}></i>
          </Link>          
        </nav>


        {/* Burger navbar */}
        <div className="mobileNavbar" id="mobileNavbar" style={{ display: "none" }} >
          <div className="mobileNavbar-menu">
            <span className="input-group-append" style={{ marginTop:"23px",  marginRight:"15px"  , justifyContent:"flex-end"}}> 
              <Link to="#" className="icon navbar-toggle" onClick={() => { console.log("Comes thru here"); myFunction(); }}  >
                  <i className="fa fa-bars" style={{ color: "white", marginLeft:"10px", padding: "10px 17px" }}></i>
              </Link>
            </span>

            <ul className="navbar-nav">
              <li style={{ padding: "5px 16px", borderBottom: "1px solid #FFFFFF" }}>
              
              <div className='search_bar'>
                <form >
                  <input
                    className='form-control'
                    placeholder='Search meal or category'
                    style={{
                      backgroundColor: "#fd7e14",
                      border: "1px solid #FFFFFF",
                    }}
                  />
                   <span className="search_bar__icon">
                        <div className="btn btn-outline-secondary" style={{
                          backgroundColor: "#FFFFFF",
                          borderColor: "#fd7e14",
                        }}>
                        <i className="fa fa-search " style={{ color: "#fd7e14"}} ></i>
                        </div>
                    </span>
                </form>
              </div>

              {/* <form className="form-inline" style={{ padding: "14px 0px" }}>
                <div className="input-group">
                  <input
                    className="form-control"
                    placeholder="Search meal or category"
                    style={{
                      backgroundColor: "#fd7e14",
                      border: "1px solid #FFFFFF",
                      width: "150px",
                    }}
                  />
                  <span className="input-group-append">
                      <div className="btn btn-outline-secondary" style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: "#fd7e14",
                      }}>
                      <i className="fa fa-search " style={{ color: "#fd7e14"}} ></i>
                      </div>
                  </span>
                </div>                  
              </form> */}
              </li>
              {login_on_burger_navbar}

              {/* <li className="nav-item" style={{ padding: "14px 16px" }}>
                <button className="nav-link px-2" style={{ color: "#FFFFFF" }}>
                  Cart Page
                  </button>
              </li> */}

              <li className="nav-item" style={{ padding: "14px 16px" }}>
                <Link
                  to="/grocery"
                  className="nav-link px-2"
                  style={{ color: "#FFFFFF" }}
                >
                  Grocery List
                  </Link>
              </li>

              <li
                className="nav-item"
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid #FFFFFF",
                }}
              >
                <Link
                  to="/products"
                  className="nav-link px-2"
                  style={{ color: "#FFFFFF" }}
                >
                  Shoping Cart
                  </Link>
              </li>
              <li className="nav-item" style={{ padding: "14px 16px" }}>
                <Link
                  to="/v2"
                  className="nav-link px-2"
                  style={{ color: "#FFFFFF" }}
                >
                    Home
                  </Link>
              </li>              
              <li className="nav-item" style={{ padding: "14px 16px" }}>
                <Link
                  to="/products"
                  className="nav-link px-2"
                  style={{ color: "#FFFFFF" }}
                >
                  Products
                  </Link>
              </li>
              <li className="nav-item" style={{ padding: "14px 16px" }}>
                <Link
                  to="/products"
                  className="nav-link px-2"
                  style={{ color: "#FFFFFF" }}
                >
                  Receipes
                  </Link>
              </li>
              {/* <li
                className="nav-item"
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid #FFFFFF",
                }}
              >
                <button className="nav-link px-2" style={{ color: "#FFFFFF" }}>
                  Stats
                  </button>
              </li> */}
            </ul>
          </div>
        </div>
        <nav
          className="navbar navbar-expand-md  navbar-light navbar-second"
          style={{ backgroundColor: "#EEEEEE" }}
        >
          <div className="navbar-collapse collapse pt-2 pt-md-0" id="navbar2">
            <ul className="navbar-nav">
              <li className="nav-item active" style={{ marginRight: "50%" }}>
                <Link to="/v2" className="nav-link px-2">
                  Home
                  </Link>
              </li>
              <li className="nav-item" style={{ marginRight: "50%" }}>
                <Link to="/products" className="nav-link px-2">
                  Products
                  </Link>
              </li>
              <li className="nav-item" style={{ marginRight: "50%" }}>
                <Link to="/v2" className="nav-link px-2">
                  Receipes
                  </Link>
              </li>
            </ul>
          </div>
        </nav>

        <Switch>
          <Route exact path="/login"  
            render={() => (
              <Login updateLogInStatus={this.updateLogInStatus}/>
            )}
          />

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

          <Route path="/home" render={() => <HomePage />} />
          <Route path="/v2" render={() => <MealsPage />} />
          <Route exact path="/grocery"
            render={() => (
              <GroceryPage
                auth={isAuthenticated}
                dataTypeaheadProps={itemTypeahead}
                customerId={customerId}
              />
            )}
          />

          <Route path="/products" render={(props) => <ProductsSection />} />
          <Route exact path="/SuggestMeal" render={(props) => <SuggestMeal />}/>
          <Route exact path="/ViewSuggestedMeals" render={(props) => <ViewSuggestedMeals />}/>
          <Route path="/product-detail/:customerId/:productId" component={ProductFullDetail} />

        </Switch>
      </div>
    );
  }
}


export default Header;
