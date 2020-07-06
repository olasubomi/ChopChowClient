import React from "react";
import "./AdminPanel.scss";
import { Container, Alert, Card, Col, Row, Button } from "react-bootstrap";
import img_oil from "../../assets/images/ola_ola_palm_oil.jpg";
import img_logo from "../../assets/images/logo2.png";
import { Link } from "react-router-dom";

//////////////////////////////////////////////////////////////////////
class AdminManagement extends React.Component {
 
  render() {
    var localToken = window.localStorage.getItem("userRole");
    console.log("SSSSS,", localToken);
    return (
      <Container className="admin-page">
          <Row>
            <Col md={12} className="admin-title-region">
                  <div className="admin-title"><div style={{width: "100%"}}>Admin Dashboard</div></div>
            </Col>

            <Col md={4} className="admin-item-panel">
                <div className="item-card">
                  <div className="admin-item-title"><div style={{width: "100%"}}>INVENTORY</div></div>
                  <img src={img_oil} className="admin-item-img"/>
                </div>
            </Col> 
            <Col md={4} className="admin-item-panel">
                <div className="item-card">
                  <div className="admin-item-title"><div style={{width: "100%"}}>ORDERS</div></div>
                  <img src={img_oil} className="admin-item-img"/>
                </div>
            </Col> 
            <Col md={4} className="admin-item-panel" >
                
                    <div className="item-card" >

                        <div className="admin-item-title"><div style={{width: "100%"}}>MEAL SUGGESTIONS/SUPPORT</div></div>
                        <Link to="/">
                        <img src={img_logo} className="admin-item-img"/>
                        </Link>
                    </div>

            </Col> 
           </Row>
           <Row className="admin-items-section">                         
           </Row>
      </Container>
    );
  }
}
export default AdminManagement;