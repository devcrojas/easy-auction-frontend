import React from 'react'
import { Button, Container, Image, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Logo from '../images/logoSub.svg'
function NavBarMenu() {
    return (
        <>
            <Navbar bg="dark" variant="dark" hidden>
                <Container>
                    <Navbar.Brand href="#home">
                        <img
                            alt=""
                            src={Logo}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        React Bootstrap
                    </Navbar.Brand>
                </Container>
            </Navbar>
            <Navbar collapseOnSelect expand="lg" bg="dark" style={{display: "none"}}>
                <Container>
                    <Navbar.Brand className='text-white'>
                        <Image src={Logo} className="imageLogo"></Image>
                        Easy Auction
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Link className='linkPages' to={{ pathname: "/" }}><Button variant="light" size="sm" className="m-1">Home</Button></Link>
                            <Link className='linkPages' to={{ pathname: "/productos" }}><Button variant="light" size="sm" className="m-1">Productos</Button></Link>
                            <Link className='linkPages' to={{ pathname: "/resenas" }}><Button variant="light" size="sm" className="m-1">Reseñas</Button></Link>
                        </Nav>
                        <Nav>
                            <Link className='link' to={{ pathname: "/register" }}><Button type="button" variant="success" size="sm" className="m-1">Registrate</Button></Link>
                            <Link className='link' to={{ pathname: "/auth" }}><Button type="button" variant="primary" size="sm" className="m-1">Inicia sesión</Button></Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar >
        </>

    )
}

export default NavBarMenu