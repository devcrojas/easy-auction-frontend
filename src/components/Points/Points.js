import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Badge } from 'react-bootstrap'
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
} from "@paypal/react-paypal-js";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'
import AuthService from '../../services/auth.service'
import PointsService from '../../services/points.service'


function Points() {

    const [user, setUser] = useState(AuthService.getCurrentUser());
    const [pts, setPts] = useState();

    useEffect(()=>{
        //console.log(user);
        getPoints();
        //updatePts(50);
    },[]);

    const getPoints = async function(){
        let pointsCurrent = await PointsService.getPointsByUserId(user.id);
        //console.log(pointsCurrent[0]);
        setPts(pointsCurrent[0].pts);
    }

    const updatePts = async function(pts, details){
        let pointsUpdate = await PointsService.updatePointsByUserId({userId: user.id, pts: parseInt(pts), details: details});
        setPts(parseInt(pointsUpdate.pts))
        //console.log(pointsUpdate);
    }

    const message = () => {
        Swal.fire(
            'Transacción Exitosa!',
            'Se abonarán los puntos a tu cuenta.',
            'success'
        );
    };

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
        createData(50, 50),
        createData(100, 100),
        createData(300, 300),
        createData(500, 500),
        createData(1000, 1000),
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
                        <Row className='mt-3' style={{ background: "white", boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)" }}>
                            <Col xs={12} sm={6} md={8} className="mt-2">
                                <h2>Zona de compra</h2>
                                <hr></hr>
                                <h5>Bienvenido {user.profile.firstName + " " + user.profile.lastName}</h5>
                            </Col>
                            <Col className='border d-flex align-items-center justify-content-center' xs={12} sm={6} md={4} style={{boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset"}}>
                                <label>Puntos Easy: <Badge bg="info">{pts} pts</Badge></label>
                            </Col>
                            <Col xs={12} className="mt-2">
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
                                                        {String(row.name) + " Pts"}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">${row.calories}</StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <PayPalScriptProvider options={{ "client-id": "AZXrjdT9OpCmjWo-0NPJkcsUHUlOS6-cK9HcDzXee0qHuIqNMf8D9xgwJ2G-tbnrenjaHgAyBTz6zamX", currency: "MXN" }}>
                                                            <PayPalButtons
                                                                style={{ layout: "horizontal", tagline: false }}
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
                                                                        updatePts(row.calories, details);
                                                                        const name = details.payer.name.given_name;
                                                                        //console.log(`Transaction completed by ${name}`);
                                                                        message();                                                                        
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

export default Points