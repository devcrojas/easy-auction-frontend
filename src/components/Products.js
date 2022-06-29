import React, { useState} from 'react'
import { Card, Row, Col, Container, Button, Modal } from 'react-bootstrap'
import CreateProduct from './CreateProduct'
import Const from '../images/construccion.png'



function Productos() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Card className='mt-5'>
                            <Card.Body>
                                <Card.Title>¿Quieres tambien subastar?</Card.Title>
                                <Card.Text>
                                    No pierdas tiempo y realiza una subasta tu tambien que esperas!
                                </Card.Text>
                                <Button variant="primary" onClick={() => setShowModal(true)}>
                                    Solicitar subasta
                                </Button>
                            </Card.Body>                            
                        </Card>

                        <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}
                            aria-labelledby="example-modal-sizes-title-lg">
                            <Modal.Header closeButton>
                            <Modal.Title id="example-modal-sizes-title-lg">
                                Solicitar subasta
                                <h6 className='mandatories'>Los campos con <strong className='text-danger'>*</strong> son obligatorios</h6>
                            </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <CreateProduct modal={setShowModal}/>
                            </Modal.Body>
                        </Modal>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Productos