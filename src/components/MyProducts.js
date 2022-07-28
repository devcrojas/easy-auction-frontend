import React, { useState, Fragment, useEffect } from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import '@sweetalert2/theme-material-ui/material-ui.css'
import { Button, Card, CardContent } from '@mui/material';
import AuthService from '../services/auth.service'
import MenuLateral from './MenuLateral';
import NavBarMenu from './NavBarMenu';
import ProductsList from './ProductsList';
import PointsService from '../services/points.service';


const MyProducts = () => {
    const [user, setUser] = useState(AuthService.getCurrentUser());
    const [pointsUser, setPointsUser] = useState();

    useEffect(() => {
        const getPoints = async function () {
          //console.log("Hola");
          let data = await PointsService.getPointsByUserId(user.id);
          setPointsUser(data[0])
        }
        getPoints();
      },[user]);
return (
<Fragment>
    <NavBarMenu view={"Reviews"}></NavBarMenu>
    <Container style={{ background: "#F0F2F5" }} fluid>
        <Row>
            <Col xs={3} id="sidebarEasy" className="sidebarEasy">
                <MenuLateral view={"MyProducts"}></MenuLateral>
            </Col>
            <Col xs={9}>
                <Row>
                    <Card sx={{ width:'95%', borderRadius: 5, marginTop: 5 }} elevation={10}>
                        <CardContent className='text-center'>
                            <h1>¿Quieres tambien subastar?</h1>
                            <p>No pierdas tiempo y realiza una subasta tu tambien que esperas!</p>
                            <Button variant="contained" color="primary" onClick={() => {window.location.href = "/createProducts"}}>
                                Solicitar subasta
                            </Button>
                        </CardContent>
                    </Card>
                </Row>
                <Row>
                    <ProductsList filter={true}
                                  filterField={'_id'}
                                  filterValue={user.id}
                                  isSubObject={true}
                                  subObject={'email'}
                                  actualView={'myProducts'}
                                  setPointsUser={setPointsUser} pointsUser={pointsUser} 
                                  />

                </Row>
            </Col>
        </Row>
    </Container>
</Fragment>
)
}

export default MyProducts