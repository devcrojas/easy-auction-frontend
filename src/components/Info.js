import { AppBar, Avatar, Card, CardContent, Toolbar, Typography, Stack, ListItemText, Link } from '@mui/material';
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import logoAuth from '../images/EasyAuction.gif'

function Info() {
    return (
        <Container fluid>
            <Row>
                <AppBar position="static" color='inherit'>
                    <Toolbar variant="regular">
                        <Avatar variant="square" src={logoAuth} alt="Logo" sx={{ cursor: 'pointer' }} onClick={() => { window.location.href = "/" }} />
                        <Typography variant="h6" color="inherit" component="div" className='ms-3'>
                            Easy Auction
                        </Typography>
                        <Typography sx={{ width: "70%" }} variant="h6" color="inherit" align="center" className='ms-3'>
                            Terminos de uso Generales
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Row>
            <Row style={{ background: "#F0F2F5" }}>
                <Col md='12' className="d-flex justify-content-center">
                    <Card className="my-4 mx-4" sx={{ width: "70%", borderRadius: 5, padding: 2 }} elevation={10}>
                        <CardContent>
                            <Typography variant="subtitle2" className="my-4">Versión vigente: 25 de Julio, 2022</Typography>
                            <Stack spacing={2}>
                                <ListItemText
                                    primaryTypographyProps={{ typography: "h5" }}
                                    primary="1- Easy Auction"
                                    secondaryTypographyProps={{ typography: "body1", component: "div", textAlign: "justify" }}
                                    secondary={
                                        <>
                                            <p>Easy Auction es una compañía de tecnología que ofrece servicios vinculados principalmente al comercio electrónico y a los pagos digitales.</p>
                                            <p>Los servicios que ofrece Easy Auction en los sitios <Link href="/" variant="body2">easysoftauction.southcentralus.cloudapp.azure.com</Link> y sus aplicaciones móviles (de ahora en más:“Sitio”) están diseñados para formar un ecosistema que permita a las personas vender, comprar, pagar, enviar productos y realizar otras actividades comerciales con tecnología aplicada.</p>
                                        </>
                                    }
                                />
                                <ListItemText
                                    primaryTypographyProps={{ typography: "h5" }}
                                    primary="2- Términos y Condiciones"
                                    secondaryTypographyProps={{ typography: "body1", component: "div", textAlign: "justify" }}
                                    secondary={
                                        <>
                                            <p>Estos términos y condiciones y los anexos que explican los servicios, (de ahora en más: “Términos y Condiciones”) regulan la relación entre Easy Auction y las  personas que usan sus servicios (“Personas Usuarias”). </p>
                                            <p>Las Personas Usuarias aceptan estos Términos y Condiciones desde el momento en que se registran en el Sitio.</p>
                                            <p>Cuando debamos hacer cambios importantes en nuestros servicios, publicaremos las modificaciones con 10 días corridos de anticipación para que las Personas Usuarias puedan revisarlas y seguir usando el sistema. En ningún caso afectarán las operaciones que ya hayan finalizado. </p>
                                        </>
                                    }
                                />
                                <ListItemText
                                    primaryTypographyProps={{ typography: "h5" }}
                                    primary="3- Capacidad"
                                    secondaryTypographyProps={{ typography: "body1", component: "div", textAlign: "justify" }}
                                    secondary={
                                        <>
                                            <p>Podrán usar nuestros servicios las personas mayores de edad que tengan capacidad legal para contratar.</p>
                                            <p>Quien use el sistema de Easy Auction en representación de una empresa deberá tener capacidad para contratar a nombre de ella. Además, para poder usar la cuenta, la Persona Usuaria debe encontrarse activa. </p>
                                        </>
                                    }
                                />
                                <ListItemText
                                    primaryTypographyProps={{ typography: "h5" }}
                                    primary="4- Registro y Cuenta"
                                    secondaryTypographyProps={{ typography: "body1", component: "div", textAlign: "justify" }}
                                    secondary={
                                        <>
                                            <p>Quien quiera usar nuestros servicios, deberá completar el formulario de registro con los datos que le sean requeridos. Al completarlo, se compromete a hacerlo de manera exacta, precisa y verdadera y a mantener sus datos siempre actualizados. La Persona Usuaria será la única responsable de la certeza de sus datos de registro. Sin perjuicio de la información brindada en el formulario, podremos solicitar y/o consultar información adicional para corroborar la identidad de la Persona Usuaria. </p>
                                            <p>La cuenta es personal, única e intransferible, es decir que bajo ningún concepto se podrá vender o ceder a otra persona. Se accede a ella con la clave personal de seguridad que haya elegido y que deberá mantener bajo estricta confidencialidad. Por eso, la Persona Usuaria será la única responsable por las operaciones que se realicen en su cuenta. En caso de detectar un uso no autorizado de su cuenta,deberá notificar de forma inmediata y fehaciente a Easy Auction. </p>
                                            <p>Además, en caso de detectar el uso de más de una cuenta, podremos aplicar retenciones, débitos y/o cualquier otra medida si consideramos que ese accionar puede perjudicar al resto de las personas que usan el Sitio o a Easy Auction, más allá de las sanciones que pudieran corresponder. </p>
                                        </>
                                    }
                                />
                                <ListItemText
                                    primaryTypographyProps={{ typography: "h5" }}
                                    primary="5- Privacidad de datos"
                                    secondaryTypographyProps={{ typography: "body1", component: "div", textAlign: "justify" }}
                                    secondary={
                                        <>
                                            <p>En Easy Auction hacemos un uso responsable de la información personal, protegiendo la privacidad de las Personas Usuarias que nos confiaron sus datos y tomando las medidas necesarias para garantizar la seguridad.</p>
                                        </>
                                    }
                                />
                                <ListItemText
                                    primaryTypographyProps={{ typography: "h5" }}
                                    primary="6- Sanciones"
                                    secondaryTypographyProps={{ typography: "body1", component: "div", textAlign: "justify" }}
                                    secondary={
                                        <>
                                            <p>En caso que la Persona Usuaria incumpliera una ley o los Términos y Condiciones, podremos advertir, suspender, restringir o inhabilitar temporal o definitivamente su cuenta, sin perjuicio de otras sanciones que se establezcan en las reglas de uso particulares de los servicios de Easy Auction.</p>
                                        </>
                                    }
                                />
                                <ListItemText
                                    primaryTypographyProps={{ typography: "h5" }}
                                    primary="7- Responsabilidad"
                                    secondaryTypographyProps={{ typography: "body1", component: "div", textAlign: "justify" }}
                                    secondary={
                                        <>
                                            <p>Easy Auction será responsable por cualquier defecto en la prestación de su servicio, en la medida en que le sea imputable y con el alcance previsto en las leyes vigentes.</p>
                                        </>
                                    }
                                />
                                <ListItemText
                                    primaryTypographyProps={{ typography: "h5" }}
                                    primary="8- Tarifas"
                                    secondaryTypographyProps={{ typography: "body1", component: "div", textAlign: "justify" }}
                                    secondary={
                                        <>
                                            <p>Easy Auction podrá cobrar por sus servicios y la Persona Usuaria se compromete a pagarlos a tiempo.</p>
                                            <p>Podremos modificar o eliminar las tarifas en cualquier momento con el debido preaviso establecido en la cláusula 2 de estos Términos y Condiciones. De la misma manera, podremos modificar las tarifas temporalmente por promociones en favor de las Personas Usuarias. </p>
                                            <p>La Persona Usuaria autoriza a Easy Auction a retener y/o debitar los fondos existentes y/o futuros de su cuenta de Mercado Pago y/o de las cuentas bancarias que haya registrado en ella, para saldar las tarifas impagas o cualquier otra deuda que pudiera tener.</p>
                                            <p>Para conocer el detalle de las tarifas de cada servicio, las Personas Usuarias deberán consultar los términos y condiciones correspondientes.</p>
                                            <p>En todos los casos se emitirá la factura de conformidad con los datos fiscales que las personas tengan cargados en su cuenta. </p>
                                        </>
                                    }
                                />
                                <ListItemText
                                    primaryTypographyProps={{ typography: "h5" }}
                                    primary="9- Propiedad Intelectual"
                                    secondaryTypographyProps={{ typography: "body1", component: "div", textAlign: "justify" }}
                                    secondary={
                                        <>
                                            <p>Easy Auction y/o sus sociedades relacionadas son propietarias de todos los derechos de propiedad intelectual sobre sus sitios, todo su contenido, servicios, productos, marcas, nombres comerciales, logos, diseños, imágenes, frases publicitarias, derechos de autor, dominios, programas de computación, códigos, desarrollos, software, bases de datos, información, tecnología, patentes y modelos de utilidad, diseños y modelos industriales, secretos comerciales, entre otros (“Propiedad Intelectual”) y se encuentran protegidos por leyes nacionales e internacionales.</p>
                                            <p>Aunque Easy Auction otorga permiso para usar sus productos y servicios conforme a lo previsto en los Términos y Condiciones, esto no implica una autorización para usar su  Propiedad Intelectual, excepto consentimiento previo y expreso de Easy Auction y/o sus sociedades vinculadas. En cualquier caso, los usuarios vendedores que usen dichos productos y servicios no podrán utilizar la Propiedad Intelectual de Easy Auction de una manera que cause confusión en el público y deberán llevar a cabo su actividad comercial bajo una marca o nombre comercial propio y distintivo, que no resulte confundible con la marca Easy Auction y su familia de marcas “Mercado”.</p>
                                            <p>Está prohibido usar nuestros productos o servicios para fines ilegales, realizar cualquier tipo de ingeniería inversa u obras derivadas, utilizar herramientas de búsqueda o de extracción de datos y contenidos de nuestra plataforma para su reutilización y/o crear bases de datos propias que incluyan en todo o en parte nuestro contenido sin nuestra expresa autorización. Está también prohibido el uso indebido, sin autorización y/o contrario a la normativa vigente y/o que genere confusión o implique uso denigratorio y/o que le cause perjuicio, daños o pérdidas a Easy Auction y/o a sus sociedades relacionadas. La utilización de los productos y servicios de Easy Auction tampoco implica la autorización para usar propiedad intelectual de terceros que pueda estar involucrada, cuyo uso quedará bajo exclusiva responsabilidad del usuario.
                                                En caso que una Persona Usuaria o cualquier publicación infrinja la Propiedad Intelectual de Easy Auction o de terceros, Easy Auction podrá remover dicha publicación total o parcialmente), sancionar al usuario conforme a lo previsto en estos Términos y Condiciones y ejercer las acciones extrajudiciales y/o judiciales correspondientes.</p>
                                        </>
                                    }
                                />
                                <ListItemText
                                    primaryTypographyProps={{ typography: "h5" }}
                                    primary="10- Indemnidad"
                                    secondaryTypographyProps={{ typography: "body1", component: "div", textAlign: "justify" }}
                                    secondary={
                                        <>
                                            <p>La Persona Usuaria mantendrá indemne a Easy Auction y sus sociedades relacionadas, así como a quienes la dirigen, suceden, administran, representan y/o trabajan en ellas, por cualquier reclamo administrativo o judicial iniciado por otras Personas Usuarias, terceros o por cualquier Organismo, relacionado con sus actividades.</p>
                                            <p>En virtud de esa responsabilidad, podrán realizar compensaciones, retenciones u otras medidas necesarias para la reparación de pérdidas, daños y perjuicios, cualquiera sea su naturaleza.</p>
                                        </>
                                    }
                                />
                                <ListItemText
                                    primaryTypographyProps={{ typography: "h5" }}
                                    primary="11- Jurisdicción y Ley Aplicable"
                                    secondaryTypographyProps={{ typography: "body1", component: "div", textAlign: "justify" }}
                                    secondary={
                                        <>
                                            <p>Estos Términos y Condiciones se rigen por la ley local. Toda controversia derivada de su aplicación, interpretación, ejecución o validez será resuelta por los tribunales nacionales ordinarios competentes, con asiento en la capital, salvo disposición específica de normas de orden público, como por ejemplo, legislación relativa al Consumidor. Para todos los efectos relacionados con estos Términos y Condiciones y con el uso del sitio, Easy Auction de Mexico S. de R.L. de C.V. con RFC EA970509JC2, establece como domicilio Av. Insurgentes Sur 1602, piso 9º Col. Crédito Constructor, Ciudad de México, México.</p>
                                        </>
                                    }
                                />


                            </Stack>
                        </CardContent>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Info