import React from 'react';
import NavBarMenu from './NavBarMenu';
import ProductsList from './ProductsList';
import { Col, Container, Row } from 'react-bootstrap';
import MenuLateral from './MenuLateral';
import AuthService from '../services/auth.service';
import PointsService from '../services/points.service';
import { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";
const ENDPOINT = "/";

function Productos() {
  const [profile] = useState(AuthService.getCurrentUser().profile);
  const [user] = useState(AuthService.getCurrentUser());
  const [products, setProducts] = useState(null);
  const [productListX, setproductListX] = useState("");
  const [pointsUser, setPointsUser] = useState();

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT ,{'connect timeout': 1000});

    const getPoints = async function () {
      //console.log("Hola");
      let data = await PointsService.getPointsByUserId(user.id);
      setPointsUser(data[0])
    }
    getPoints();
    console.log("useEffect");
    var handlePoints = (data) => {
      console.log("socket send ...");  
      //console.log(data);
      setPointsUser(data);
    }
    socket.on("points-" + user.id, handlePoints);
    return () => {
      socket.off("points-" + user.id, handlePoints)
    }
  },[user]);


  return (
    <>
      <NavBarMenu view={"Products"} user={user.profile} pointsUser={pointsUser}></NavBarMenu>
      <Container fluid style={{ background: "#F0F2F5", minHeight: "100vh" }}>
        <Row>
          <Col id="sidebarEasy" xs={3} style={{ position: "fixed", width: "25%", overflowY:"scroll" }} className="sidebarEasy">
            <MenuLateral view={""} imgProfile={profile.file}></MenuLateral>
          </Col>
          <Col xs={9} style={{ width: "75%", marginLeft: "25%" }}>
            <ProductsList setPointsUser={setPointsUser} pointsUser={pointsUser} filter={true} filterField={'status'} filterValue={'active'} actualView='productsList' ></ProductsList>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Productos;