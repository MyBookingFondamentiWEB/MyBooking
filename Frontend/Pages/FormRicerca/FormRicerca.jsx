import React from 'react';
import {useState , useContext , useEffect} from "react";
import { BrowserRouter , Router, Routes, Route, Link , useNavigate} from 'react-router-dom'
import Context from  "../Store/Context";
import './formRicerca.css';
import axios from 'axios'
import Header from "../../components/HeaderLogin/HeaderLogin";
import Footer from "../../components/Footer";
import StrutturaCard from '../../components/Cards/Cards';



////////////////MaterialUI Components//////////////////////

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import AlertModifica from "../Alert/AlertModifica/alertModifica";
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import Slider from "react-slick";
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//////////////////////////////////////////////////////////





export default function FormRicerca() {

    //USATO PER LA NAVIGAZIONE
    const navigate = useNavigate();
    const [card, setCard] = useState([])
    const [loading, setLoading] = useState(true);

    //USE CONTEXT
    const { prenotationDate , setPrenotationDate } = useContext(Context)                                                //Date della prenotazione
    const { structureList , setStructureList } = useContext(Context)                                                    //Lista delle struttura date dalla ricerca
    const { userPrenotation , setUserPrenotation } = useContext(Context)                                                //Dati da salvare sulla prenotazione dell'utente
    const { hotelReviews , setHotelReviews } = useContext(Context)                                                      //Dati per la recensione
    const { dayRange , setDayRange } = useContext(Context)                                                              //Numero di giorni della prenotazione

    const [emailUtente, setEmailUtente] = useState(null);
    

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerPadding: '40px'

    };


    useEffect(() => {
            
            fetch('http://localhost:3000/EmailTokenUtente', {     // Recupera email dal token nel cookie
            credentials: 'include',                                     // importantissimo per inviare i cookie
            })
            .then(res => res.json())
            .then(data => {
                if (data.emailUtente) {
                setEmailUtente(data.emailUtente);
                } else {
                console.log("Utente non autenticato");
                navigate("/ErroreLogin")
                }
            })
            .catch(err => console.error("Errore nel recupero email dal token:", err));
    }, []);





        
    useEffect(() => {
        if(emailUtente){
            console.log('Card state modificato:', card);
            if (card.length === 0) {
                console.trace('Card state è vuoto - stack trace:');
            }
        }
    }, [card, emailUtente]);



    useEffect(()=>{
        if(emailUtente){
            fetch("http://localhost:3000/gestioneStrutture ")
                .then( res => res.json())
            .then(data => {
                setCard(data.items)
            }).catch(error => {
                    console.log(error)
                }
            );
        }
    }, [emailUtente])




    //METODO PER GESTIRE L'INVIO DEL FORM
    const handleSubmitMainForm = (event) => {
        event.preventDefault();

        setPrenotationDate({...prenotationDate, dataArrivo: event.target.dataArrivo.value, dataPartenza: event.target.dataPartenza.value})  //Salvo: dataArrivo - dataPartenza
        
        
        
        const request = {                                                                                         //Costruisco l'oggetto per la richiesta
            ospiti: event.target.numeroOspiti.value ,
            city: event.target.destinazione.value,
            dataArrivo: event.target.dataArrivo.value,
            dataPartenza: event.target.dataPartenza.value
        }
        asyncRicercaStruttura(request)
        navigate( '/visualizzaRicerca')                                                                                         //Dopo la ricerca visualizzo la lista delle strutture trovate
    }




    async function asyncRicercaStruttura(formData) {
        const request = await axios.post ( ' http://localhost:3000/hotel/ricerca' ,
            {
                numeroOspiti: formData.ospiti,
                citta: formData.city,
                dataArrivo: formData.dataArrivo ,
                dataPartenza: formData.dataPartenza
            });
        if( request.data.lista !== null ){
            setStructureList( request.data.lista )                                                                          //Lista delle strutture trovate
        }
        if( request.data.dayRange !== null){
            setDayRange( request.data.dayRange )                                                                            //Giorni fra arrivo e partenza
        }
    }


































  return (
    <>
        <Header/>

        <div id='allineamento-tutto'>
            <div id="posizionamento-elementi">
                <h1 id="titolo-ricerca">
                    Ricerca il tuo Hotel
                    <SearchIcon id="icona-ricerca"/>
                </h1>

                <div>
                    <form onSubmit={handleSubmitMainForm}>
                    
                            <Card sx={{ minWidth: 450} } elevation={8} id="box-ricerca">    {/*elevation mi crea ombra sotto il box*/}
                            
                                    <div id="raggruppamento-ricerca">
                                        <div id="date-ricerca">
                                            <div id="dataPartenzaContainerApp">
                                                <label htmlFor="dataPartenza" className="labelFormStartApp" id='daapartenzascirtta'>Data Partenza: </label>
                                                <input type="date" name="dataPartenza" id="dataPartenza" className="inputFormStartApp" required/>
                                            </div>

                                            <div id="dataArrivoContainerApp">
                                                <label htmlFor="dataArrivo" className="labelFormStartApp">Data Arrivo: </label>
                                                <input type="date" name="dataArrivo" id="dataArrivo" className="inputFormStartApp" required/>
                                            </div>

                                        </div>
                                        

                                        <div id="posto-ricerca">
                                            <TextField id="destinazione-ricerca" label="Destinazione: " name='destinazione' required/>
                                            <TextField id="ospiti-ricerca" label="Numero Ospiti: " name="numeroOspiti" required/>
                                        </div>

                                        
                                    </div>

                                <div id="raggruppamento-button">
                                    <Button id="reset-button-ricerca" type="reset" variant="contained">Reset</Button>
                                    <Button id="cerca-button-ricerca" type="submit" variant="contained">Cerca</Button>
                                </div>

                            </Card>
                    
                    </form>
                </div>
                    
            </div>
                
            



            <div id="insieme-consigliati">
                <Box sx={{mb: 6}}>
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 3}} id="box-struttureconsigliate">

                            <StarIcon sx={{color : '#FFD700', mr: 1, fontSize: 30}} />

                            <div id='posizionescrittaconsigliato'>
                                <Typography variant="h4" component="h2" gutterBottom >
                                    Strutture Consigliate:
                                </Typography>
                            </div>
                            

                            <Chip
                                label="Popolari"
                                color="primary"
                                sx={{ ml: 2 }}
                                icon={<StarIcon />}
                            />

                        </Box>


                        <Box sx={{
                            background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                            borderRadius: 2,
                            p: 3,
                            mb: 2
                        }} id="box-carosello">

                            <Slider {...settings}>
                                {[...card]
                                    .sort(() => Math.random() - 0.5)  // mischia gli elementi
                                    .slice(0, 4)                      // prende solo i primi 4
                                    .map(struttura => (
                                        <div key={struttura._id}>
                                        <StrutturaCard
                                            struttura={struttura}
                                            showModificaButton={false}
                                        />
                                        </div>
                                    ))}

                            </Slider>

                        </Box>
                    </Box>
            </div>
        </div>  
        

            





              <Footer />

    </>
  );
}

