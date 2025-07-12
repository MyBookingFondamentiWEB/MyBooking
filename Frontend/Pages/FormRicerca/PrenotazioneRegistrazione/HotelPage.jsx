    import './hotelPage.css'
    import Context from '../../Store/Context'
    import {useContext, useEffect, useState} from "react";
    import axios from "axios"
    import {useNavigate} from "react-router-dom";
    import Header from "../../../components/HeaderLogin/HeaderLogin";
    import Footer from "../../../components/Footer"
    import Recensioni from '../../Recensioni/Recensioni';




    ////////////////MaterialUI Components//////////////////////

    import Card from '@mui/material/Card';
    import Button from '@mui/material/Button';
    import CardContent from '@mui/material/CardContent';
    import TextField from '@mui/material/TextField';
    import DeleteIcon from '@mui/icons-material/Delete';
    import CloseIcon from '@mui/icons-material/Close';
    import NavigateNextIcon from '@mui/icons-material/NavigateNext';

    //////////////////////////////////////////////////////////



    function HotelPage() {

        const navigate = useNavigate();                                                                     //Metodo per navigare fra le pagine

        /* DATI PRELEVATI DAL CONTEXT */
        const { prenotationDate } = useContext(Context);                                                                    //Data Arrivo - Data Partenza
        const { userData } = useContext(Context);                                                                           //Informazioni sull'utente
        const { dayRange } = useContext(Context);                                                                           //Numero di giorni per cui si vuole prenotare
        const { hotelPrenotation , setHotelPrenotation } = useContext( Context )                                            //Informazioni su hotel da prenotare

        const [ loadFlag , setLoadFlag ] = useState(false)                                               //Flag per controllare aggiornamento dei dati

        const [emailUtente, setEmailUtente] = useState(null);









            const [dataHotelRecensioni, setdataHotelRecensioni] = useState({
                idHotel: ""
            })  
            const[flag, setFlag] = useState(0);




            


        /* VERIFICO L'AGGIORNAMENTO DEI DATI */
        useEffect(() => {
            if(emailUtente){
                if( loadFlag === false ){
                    console.log("hotelPrenotation - Dati prenotazione: ", hotelPrenotation)
                    console.log("prenotationDate - Dati prenotazione: ", prenotationDate)
                    console.log("dayRange:", dayRange);
                    setLoadFlag(true)
                    console.log("ID HOTEL: ", hotelPrenotation._id)
                }
            }
            
        }, [ hotelPrenotation,  emailUtente]);                                                                                     //Quando lo state ha i dati renderizzo la pagina



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






        /* METODO PER PRENOTARE */
        const handlePrenotation = async (e) => {



            try{
                const dbRequest = await axios.post('http://localhost:3000/prenotazione/struttura',{        //Richiesta al DB
                    dataArrivo: prenotationDate.dataArrivo,
                    dataPartenza: prenotationDate.dataPartenza,
                    nome_hotel: hotelPrenotation.nome_hotel,
                    cittaHotel: hotelPrenotation.citta,
                    emailUtente: emailUtente ,
                    giorniTotali: dayRange
                })
                console.log("Sono fuori la request!")
                setHotelPrenotation( null )                                                                                     //Azzero le informazioni su un hotel specifico
                navigate( '/profiloUtente')
            } catch (error){
                console.log("Errore nella prenotazione: ", error.message || error);
            }
        }









        return(
            <>
                {
                    loadFlag === true ?
                        <div>

                            

                            <Header />
                            

                            <div id="posizione-prenotazione-box">
                                <Card id="box-hotelcardlist" sx={{ width: 900, height: 500 }} key={hotelPrenotation.id}>
                   
                                    <div id="container-hotel">

                                        <div id="immagine-hoterlcardlist">
                                            <img
                                                id="img-modifica"
                                                src={hotelPrenotation.img || " "}
                                                alt={"Hotel " + hotelPrenotation.nome_hotel}
                                            />
                                        </div>


                                        <div id="descrizione-hotelcardlist">
                                            <div id="contenitore-descrizione-hotelcardlist">
                                                <ul id="listadescrizione">
                                                    <li key={hotelPrenotation.id}><h3>Hotel {hotelPrenotation.nome_hotel}</h3></li>
                                                    <li>Città: {hotelPrenotation.citta}, via {hotelPrenotation.via}</li>
                                                    <li>Descrizione: {hotelPrenotation.descrizione}</li>
                                                    <li>Numero Giorni Scelti: {dayRange}</li>
                                                    <li>Prezzo a Notte: {hotelPrenotation.prezzo_a_notte} €</li>
                                                    <li>Prezzo Totale: {Number(hotelPrenotation.prezzo_a_notte) * Number(dayRange)} €</li>
                                                </ul>
                                            </div>

                                            <div id="posizione-scopridipiu">
                                                <Button 
                                                    id="button-hotelcardlist-recensione" 
                                                    type="button"  
                                                    variant="outlined" 
                                                    onClick={() => { 
                                                        setdataHotelRecensioni({ ...dataHotelRecensioni, idHotel: hotelPrenotation._id}); 
                                                        setFlag(1) 
                                                    }}
                                                >
                                                    RECENSIONI
                                                </Button>
                                                <Button id="button-hotelcardlist-prenotazione" type="button"  variant="outlined" onClick={handlePrenotation}>PRENOTA</Button>
                                            </div>
                                            
                                        </div>


                                    </div>



                                    
                                </Card>
                            </div>
                            

                            <Recensioni 
                               
                                id_hotel={dataHotelRecensioni.idHotel}
                                flag={flag}
                                onClose={() => setFlag(0)}
                            /> 


                        </div>
                        : null
                }
                <Footer/>
            </>
        )
    }
    export default HotelPage;
