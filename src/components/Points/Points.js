import React, { useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import "../../nav.css"
import NavBarMenu from '../NavBarMenu'
import MenuLateral from '../MenuLateral';
import { styled } from '@mui/material/styles';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    PayPalScriptProvider,
    PayPalButtons,
    BraintreePayPalButtons
} from "@paypal/react-paypal-js";


const paypalScriptOptions = {
    "client-id": "AZXrjdT9OpCmjWo-0NPJkcsUHUlOS6-cK9HcDzXee0qHuIqNMf8D9xgwJ2G-tbnrenjaHgAyBTz6zamX",
    currency: "USD"
};
function Home() {





    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    function createData(
        name,
        calories,
   
    ) {
        return { name, calories };
    }

    const rows = [
        createData('50 Pts', 159),
        createData('100 Pts', 237),
        createData('300 Pts', 262),
        createData('500 Pts', 305),
        createData('1000 Pts', 356),
    ];

    return (
        <>
            <NavBarMenu view={""} user={"Perfil Facke"}></NavBarMenu>

            <Container fluid style={{ background: "#F0F2F5" }}>
                <Row>
                    <Col xs={3} className="sidebarEasy">
                        <MenuLateral view={"Points"} profileImg={"imageProfile"}></MenuLateral>
                    </Col>
                    <Col xs={9}>
                        <Row className='mt-2' style={{ background: "white", boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)" }}>
                            <Col xs={12} sm={6} md={8} className="mt-2">
                                <h2>Mis puntos Easy</h2>
                                <hr></hr>
                                <h5>Bienvenido Cesar Rojas</h5>
                            </Col>
                            <Col className='border d-flex align-items-center justify-content-center' xs={12} sm={6} md={4} >
                                <label>Puntos Easy: 0 pts</label>
                            </Col>
                            <Col xs={12}>
                                <h6 className='mt-2'>Tabla de precios</h6>

                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="center">Puntos</StyledTableCell>
                                                <StyledTableCell align="center">Precio</StyledTableCell>
                                                <StyledTableCell align="center">Comprar</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.map((row) => (
                                                <StyledTableRow key={row.name}>
                                                    <StyledTableCell component="th" scope="row">
                                                        {row.name}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">${row.calories}</StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <PayPalScriptProvider options={{ "client-id": "AZXrjdT9OpCmjWo-0NPJkcsUHUlOS6-cK9HcDzXee0qHuIqNMf8D9xgwJ2G-tbnrenjaHgAyBTz6zamX", currency: "MXN" }}>
                                                            <PayPalButtons

                                                                style={{ layout: "horizontal", tagline: false, width: "50%" }}
                                                                createOrder={(data, actions) => {
                                                                    return actions.order.create({
                                                                        purchase_units: [
                                                                            {
                                                                                amount: {
                                                                                    value: row.calories,
                                                                                },
                                                                            },
                                                                        ],
                                                                    });
                                                                }}
                                                                onApprove={(data, actions) => {
                                                                    //console.log(data);
                                                                    //console.log(actions);
                                                                    actions.order.capture().then((details) => {
                                                                        const name = details.payer.name.given_name;
                                                                        console.log(`Transaction completed by ${name}`);
                                                                        console.log(details);
                                                                    })
                                                                    /*/return actions.order.capture().then((details) => {
                                                                        const name = details.payer.name.given_name;
                                                                        alert(`Transaction completed by ${name}`);
                                                                    });/*/
                                                                }}
                                                                onError={(err) => {
                                                                    // For example, redirect to a specific error page
                                                                    console.log("Error al pagar");
                                                                    console.log(err);
                                                                }
                                                                }
                                                            />
                                                        </PayPalScriptProvider>
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Col>
                            <Col className='text-center'>
                                <br></br>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>


    )
}

export default Home