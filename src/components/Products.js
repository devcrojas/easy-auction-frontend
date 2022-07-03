import React from 'react';
import NavBarMenu from './NavBarMenu';
import ProductsCards from './ProductsCards';
import CreateProduct from './CreateProduct';
import { Col, Container, Row } from 'react-bootstrap';

function Productos() {

  return (
    <>
      <NavBarMenu></NavBarMenu>
      <Container fluid style={{ background: "#F0F2F5" }}>
        <Row>
          <Col xs={3} className="sidebarEasy">
          </Col>
          <Col xs={9}>    
            <CreateProduct></CreateProduct>
            <ProductsCards></ProductsCards>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Productos;


