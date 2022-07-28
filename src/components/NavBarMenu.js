import React, { useEffect, useState } from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { useNavigate } from 'react-router';
import { ReactComponent as EasyicoNavBar } from "../images/ico-navbar.svg"
import authService from '../services/auth.service'
function NavBarMenu(params) {
    const navigate = useNavigate();
    const [view] = useState(params.view);
    const [user] = useState(authService.getCurrentUser());
    const [isAdmin] = useState(user.isAdmin);
    const [pointsUser, setPointsUser] = useState(0);
    useEffect(() => {
        let x = async function () {
            let getF = new Promise(async (resolve, reject) => {
                try {
                    const requestOptions = {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json', "Authorization": "Bearer " + localStorage.getItem("token") }
                    };
                    var loginCheck = await fetch("/api/books", requestOptions);
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
            await getF;
        }
        x();
        //console.log(params);
        if(typeof params.pointsUser !== "undefined")
            setPointsUser(params.pointsUser.pts)
    }, [params]); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <>
            <Navbar sticky="top" fixed="top" collapseOnSelect expand="lg" style={{ borderBottom: "1px solid black", background: "white" }} >
                <Container fluid>
                    <Navbar.Brand href="#home"><EasyicoNavBar className="profilePicture-sidebar"></EasyicoNavBar></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/productos" className={(view === "Products") ? 'nav-activate' : ''}>Productos</Nav.Link>
                            <Nav.Link href="pricing" className={(view === "Vendors") ? 'nav-activate' : ''}>Vendedores</Nav.Link>
                        </Nav>
                        <Nav>
                            
                                <Navbar.Text>
                                    Puntos: <a href="#login">{pointsUser}</a>
                                </Navbar.Text>
                            
                            <NavDropdown title={user.profile.firstName + " " + user.profile.lastName} id="collasible-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Reiniciar Password</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={event => authService.logout(navigate)}>
                                    Cerrar Sesión
                                </NavDropdown.Item>
                            </NavDropdown>
                            {
                                (isAdmin) ? <Nav.Link eventKey={2} href="/admin" className={(view === "Admin") ? 'nav-activate' : ''}>
                                    Administrador
                                </Nav.Link>
                                    : ""
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>

    )
}

export default NavBarMenu