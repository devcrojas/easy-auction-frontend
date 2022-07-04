import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap'
import "../nav.css"
import NavBarMenu from './NavBarMenu'
import MenuLateral from './MenuLateral';

function Profile() {
  const navigate = useNavigate();

  useEffect(() => {
    //console.log("Hola");
    let x = async function () {
      let getF = new Promise(async (resolve, reject) => {
        try {
          const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem("token") }
          };
          var loginCheck = await fetch("/books", requestOptions);
          if (loginCheck.ok) {
            resolve(loginCheck.json());
          } else {
            if (loginCheck.status === 403) {
              localStorage.removeItem("token");
              navigate("/")
            }
            resolve({ status: loginCheck.status });
          }
        } catch (e) {
          reject({ status: -1 })
        }
      });
      let resp = await getF;
      console.log(resp);
    }
    x();
  });

  return (
    <>
      <NavBarMenu></NavBarMenu>
      <Container fluid style={{ background: "#F0F2F5" }}>
        <Row>
          <Col xs={3} className="sidebarEasy">
            <MenuLateral></MenuLateral>
          </Col>
          <Col xs={9}>
          </Col>
        </Row>
      </Container>
    </>


  )
}

export default Profile