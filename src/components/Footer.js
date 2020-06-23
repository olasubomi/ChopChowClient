import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import { Form, Button, Container, Modal, Row, Col, Card } from "react-bootstrap";
import img_logo from "../assets/images/logo2.png";
import './Footer.scss';

const FooterPagePro = () => {
  return (
    <Container className="footer-wraper" >      
      <Row style={{ width: "100%" }}>
        <hr
          className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto"
          style={{ width: "100%" }}
        />
          <Col md={3} className="footer-colmun">
            <h6 className="text-uppercase font-weight-bold"  style={{ color: "gray" }}>
                <strong>Services</strong>
            </h6>
            <hr
              className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto"
              style={{ width: "100px" }}
            />
            <p><a href="#!">Recipes</a></p>
            <p><a href="#!">GroceryList</a></p>
            <p><a href="#!">Food Products</a></p>
            <p><a href="#!">Kitchen Products</a></p>
            <p><a href="#!">Household Products</a></p>
          </Col>
          <Col md={3} className="footer-colmun">
              <h6 className="text-uppercase font-weight-bold"  style={{ color: "gray" }}>
                  <strong>Resources</strong>
              </h6>
              <hr
                className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto"
                style={{ width: "100px" }}
              />
              <p><a href="#!">Login/ My Account</a></p>
              <p><a href="#!">Sign Up</a></p>
              <p><a href="#!">Supplier Home</a></p>
              <p><a href="#!">Shipping + Returns</a></p>
              <p><a href="#!">FAQ + Support</a></p>
              <p><a href="#!">Contact</a></p>
          </Col>
          <Col md={3} className="footer-colmun">
            <h6 className="text-uppercase font-weight-bold"  style={{ color: "gray" }}>
                <strong>Company</strong>
            </h6>
            <hr
              className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto"
              style={{ width: "100px" }}
            />
            <p><a className="fa mr-3" /> About Us</p>
            <p><a className="fa mr-3" /> Careers</p>
            <p><a className="fa mr-3" /> Partner</p>
            <p><a className="fa mr-3" /> Terms of Service</p>
            <p><a className="fa mr-3" /> Privacy Policy</p>
          </Col>
          <Col md={3} className="footer-colmun" style={{ textAlign: "center" }}>
            <img src={img_logo} width="100px" />
            <div className="logo-text">Adding convenience to home made mealsTM</div>
            <div style={{ marginTop: "20px" }}>  
              <i className="fa fa-facebook-square m-2" aria-hidden="true"  style={{ fontSize: "30px" }}></i>
              <i className="fa fa-instagram m-2" aria-hidden="true" style={{ fontSize: "30px" }}></i>
            </div>
            <div className=""> &copy; {new Date().getFullYear()} Copyright:{" "}
             <a href="https://www.awokorpenterprises.com"> ChopChowSD </a></div>
          </Col>
        </Row>
    </Container>


    // <MDBFooter
    //   // color="unique-color-dark"
    //   className="page-footer font-small pt-0"
    // >
    //   <div style={{ backgroundColor: "orange" }}>
    //     <MDBContainer fluid className="text-center text-md-left">
    //       <MDBRow className="py-4 d-flex align-items-center">
    //         <MDBCol
    //           md="6"
    //           lg="5"
    //           className="text-center text-md-left mb-4 mb-md-0"
    //         >
    //           <h6 className="mb-0 white-text">ChopChow </h6>
    //         </MDBCol>
    //         <MDBCol md="6" lg="7" className="text-center text-md-right">
    //           <i className="fa fa-facebook-square m-2" aria-hidden="true"></i>
    //           {/* <i className="fa fa-twitter m-2" aria-hidden="true"></i> */}
    //           <i className="fa fa-instagram m-2" aria-hidden="true"></i>
    //         </MDBCol>
    //       </MDBRow>
    //     </MDBContainer>
    //   </div>
    //   <MDBContainer className="mt-5 mb-4 text-center text-md-left">
    //     <MDBRow className="mt-3">
    //       <MDBCol md="4" lg="4" xl="4" className="mb-4">
    //         <h6 className="text-uppercase font-weight-bold">
    //           <strong>Services</strong>
    //         </h6>
    //         <hr
    //           className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto"
    //           style={{ width: "60px" }}
    //         />
    //         <p><a href="#!">Recipes</a></p>
    //         <p><a href="#!">GroceryList</a></p>
    //         <p><a href="#!">Food Products</a></p>
    //         <p><a href="#!">Kitchen Products</a></p>
    //         <p><a href="#!">Household Products</a></p>
    //       </MDBCol>

    //       <MDBCol md="4" lg="4" xl="4" className="mb-4">
    //         <h6 className="text-uppercase font-weight-bold">
    //           <strong>Resources</strong>
    //         </h6>
    //         <hr
    //           className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto"
    //           style={{ width: "60px" }}
    //         />
    //         <p><a href="#!">Login/ My Account</a></p>
    //         <p><a href="#!">Sign Up</a></p>
    //         <p><a href="#!">Supplier Home</a></p>
    //         <p><a href="#!">Shipping + Returns</a></p>
    //         <p><a href="#!">FAQ + Support</a></p>
    //         <p><a href="#!">Contact</a></p>
    //       </MDBCol>
    //       <MDBCol md="4" lg="4" xl="4" className="mb-4">
    //         <h6 className="text-uppercase font-weight-bold">
    //           <strong>Company</strong>
    //         </h6>
    //         <hr
    //           className="deep-purple accent-2 mb-4 mt-0 d-inline-block mx-auto"
    //           style={{ width: "60px" }}
    //         />
    //         <p><i className="fa mr-3" /> About Us</p>
    //         <p><i className="fa mr-3" /> Careers</p>
    //         <p><i className="fa mr-3" /> Partner</p>
    //         <p><i className="fa mr-3" /> Terms of Service</p>
    //         <p><i className="fa mr-3" /> Privacy Policy</p>
    //       </MDBCol>
    //     </MDBRow>
    //   </MDBContainer>
    //   <div className="footer-copyright text-center py-3">
    //     <MDBContainer fluid>
    //       &copy; {new Date().getFullYear()} Copyright:{" "}
    //       <a href="https://www.awokorpenterprises.com"> ChopChowSD </a>
    //     </MDBContainer>
    //   </div>
    // </MDBFooter>
  );
};

export default FooterPagePro;
