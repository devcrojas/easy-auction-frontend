import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

import Swal from 'sweetalert2/dist/sweetalert2.js'
import '@sweetalert2/theme-material-ui/material-ui.css'

import offersService from '../services/offers.service';

export default function KeepMountedModal(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [offerSelect, setOfferSelect] = useState(0);
    const [offerNow, setOfferNow] = useState(0);
    const [offerMin, setOfferMin] = useState(0);
    const [pointsUser, setPointsUser] = useState(0);
    const [maxOffered, setMaxOffered] = useState(0);
    const [disabledButtons, setDisabledButtons] = useState(null);

    useEffect(() => {
        //console.log("iniciando por producto...");
        //console.log(props);
        //Se valida la cantidad de puntos que tiene para ser el tope en la subasta o permitir el max de la subasta
        setMaxOffered( (props.product.price.buyNow < props.pointsUser.pts) ? props.product.price.buyNow - (props.product.price.buyNow * .2) : props.pointsUser.pts);
        let offered = (typeof props.product.price.offered !== "undefined") ? props.product.price.offered : props.product.price.initialP;
        //Valida, si ya hay una oferta, la oferta + 50 se vuelve el valor offermin ya que seria el mas bajo
        setOfferMin(offered);
        //Valida, si ya hay una oferta, la oferta + 50 se vuelve el valor select ya que seria el mas bajo
        setOfferSelect(offered);
        //Se muestran los puntos del usuario
        setPointsUser(props.pointsUser.pts)
        //Valida si se puede participar, si no bloquea los botones.
        setDisabledButtons((props.pointsUser.pts >=  props.product.price.initialP) ? false: true);
        //console.log(props);
    }, [props]);

    //slider numerico config
    const handleSliderChange = (event, newValue) => {
        setOfferSelect(newValue);
    };


    //Estilos modal
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    //Estilos swal
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success m-2',
          cancelButton: 'btn btn-danger m-2'
        },
        buttonsStyling: false
    });

    //OfferrNow
    function offerNowTransaction(event) {
        //console.log(event);
        //Se modifica el valor de los puntos con el set que se traslado desde la clase padre.
        //props.pointsUser.pts = 100;
        //props.setPoints([props.pointsUser])
          swalWithBootstrapButtons.fire({
            title: '¿Estas seguro que quieres ofertar?',
            text: "Se descontarán " + offerSelect + " puntos de tu saldo." ,
            showCancelButton: true,
            confirmButtonText: 'Ofertar!!',
          }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                swalWithBootstrapButtons.fire('Ofertado!', '', 'success');
                let body = {offered: offerSelect, product: props.product};
                let resp = await offersService.offerApply(body);
                console.log(resp);
                //props.product.price.offered = offerSelect;
                props.setOffered(offerSelect);
                setOfferNow(offerSelect);
                console.log(props.product);
              //Se realiza oferta, insertando atrobuto en producto.price.offered y un log de oferta del producto.
            }
          })
    }

    return (
        <div>
            <Button onClick={handleOpen} style={{ width: "100%", borderRadius: "0" }} variant="contained" color="success">Ofertar</Button>
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>
                    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                        La oferta actual es: <strong className='text-success'>${offerNow}</strong>
                    </Typography>
                    <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                        Selecciona tu oferta
                        <Slider
                            aria-label="Offers"
                            value={offerSelect}
                            step={1}
                            min={offerMin}
                            max={maxOffered}
                            valueLabelDisplay="auto"
                            onChange={handleSliderChange}
                            color="primary"
                            disabled={disabledButtons}
                        />
                        <label>Tu oferta: <strong className='text-primary'>$ {offerSelect}</strong></label>
                    </Typography>
                    <hr></hr>
                    <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                        Tu saldo es: <strong className="text-success">${pointsUser}</strong>
                    </Typography>
                    <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }} className="text-center">
                        <Button disabled={disabledButtons} style={{ width: "100%" }} variant="contained" color="info" onClick={(e) => offerNowTransaction(e)}>Ofertar ahora</Button>
                        <label className={(disabledButtons === true) ? "text-danger" : "d-none"} >No tienes fondos suficientes.</label>
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}
