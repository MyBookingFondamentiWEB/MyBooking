import './profiloUtente.css'
import FormRecensione from "./FormRecensione/FormRecensione"
import Header from "../../components/HeaderLogin/HeaderLogin"
import Footer from "../../components/Footer"
import Recensioni from '../Recensioni/Recensioni'

import {useNavigate} from "react-router-dom";

import {useContext, useEffect, useState} from "react";



////////////////MaterialUI Components//////////////////////

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import AlertModifica from "../Alert/AlertModifica/alertModifica";
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import AddIcon from '@mui/icons-material/Add';

//////////////////////////////////////////////////////////




function ProfiloUtente(){

    const navigate = useNavigate();
    
    const [dataPassatiForm, setdataPassatiForm] = useState({
        id: "",
        img: "",
        nomeHotel: "",
        citta: "",
        via: "",
        emailUtente: "",
        nomeUtente: ""
    })  


    
    
    const [emailUtente, setEmailUtente] = useState(null);
    const [UtenteVisulizzante, setUtenteVisualizzante] = useState([]);
    const [listaPrenotazioni, setListaPrenotazioni] = useState([]);
    const[flag, setFlag] = useState(0);
    const[flagRecensione, setFlagRecensione] = useState(0);


    const fetchData = async () => {
            const res = await fetch(`http://localhost:3000/visualizzaLeTuePrenotazioni/${emailUtente}`)
            const data = await res.json()
            console.log("Le prenotazioni trovate sono: ", data)
            setListaPrenotazioni(data.items)
            console.log("ecco cosa ho visualizzato:", data.items)
    }
    

    const fetchDataUtente = async () => {
        const res = await fetch(`http://localhost:3000/visualizzaInfoUtente/${emailUtente}`)
        const data = await res.json()
        setUtenteVisualizzante(data.oggettoUtente)
        console.log("L'utente trovato è:", data.oggettoUtente)
    }
    





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
        if (emailUtente) {   // solo dopo che ho l'email, faccio le fetch per i dati
        fetchData();
        fetchDataUtente();
        }
    }, [emailUtente]);



    


    //FORMATTARE LE DATE - Solo per la stampa
    function formatData( date ) {
        date = new Date(date);

        let stringa = "";
        stringa = date.getFullYear() + "-" + String(Number(date.getMonth() + 1)) + "-" + date.getDate();

        return stringa;
    }











    return <>
    <Header/>
        <div id="divisore-info-prenotazioni">
            <div id="info-utente">

                <CardContent id="box-infoUser">
                    <h1 id="posizioneh1infoUser">Benvenuto nel tuo Profilo</h1>

                    <div id="descrizioneUser">
                        <p>Nome: {UtenteVisulizzante.nome}</p>
                        <p>Cognome {UtenteVisulizzante.cognome}</p>
                        <p>Data di Nascita: {formatData(UtenteVisulizzante.dataNascita)}</p>
                        <p>Email: {UtenteVisulizzante.email}</p>
                        <p>Genere: {UtenteVisulizzante.genere}</p>
                    </div>
                       
                    

                    
                </CardContent>

                <div id='linea-centrale'></div>

            </div>

            

            <div id="mainContainerProfilo">
                <div id="containerPrenotazioniProfilo">
                    <div id="headerPrenotazioniProfilo">
                        {
                                listaPrenotazioni.length == 0 ?
                                <h2>Nessuna Prenotazione</h2> : <h2>Lista Prenotazioni</h2>
                        }
                    </div>

                    <div id="containerListaPrenotazioniProfilo">
                            
                            {listaPrenotazioni.map(i => (
                                
                                
                                <div key={i._id}>
                                    {/* {console.log("id", i.nome_hotel, ": ", i._id, ", email di colui che si è prenotato", emailUtente, "prezzo totale ", i.prezzo)} */}

                                    




                                    <div>
                                        <CardContent id="box-prenotazioni">

                                            <div>
                                                <img
                                                    id="img-prenotazione"
                                                    src={i.img || " "}
                                                    alt={"Hotel " + i.nome_hotel}
                                                />
                                            </div>
                                            <h3>Hotel {i.nome_hotel}</h3>
                                            <ul id="listadescrizione">
                                                <li>Città: {i.citta}, via {i.via}</li>
                                                <li>Prezzo Totale: {i.prezzo}€</li>
                                            </ul>
                                            <div>
                                                <p>Data Partenza: {formatData(i.dataPartenza)}</p>
                                                <p>Data Ritorno: {formatData(i.dataArrivo)}</p>
                                            </div>

                                            <div id="modifica-elimina">
                                                <Button 
                                                    id="recensioni-button-profilo" 
                                                    type="button"  
                                                    variant="outlined" 
                                                    onClick={() => { 
                                                    setdataPassatiForm({ ...dataPassatiForm, img: i.img, nomeHotel: i.nome_hotel, citta: i.citta, via: i.via, emailUtente: emailUtente, nomeUtente: UtenteVisulizzante.nome, id: i.idHotel }); 
                                                    setFlagRecensione(1) 
                                                }}
                                                >
                                                    RECENSIONI
                                                </Button>
                                                <Button 
                                                    id="commenta-button-profilo" 
                                                    type="button"  
                                                    variant="outlined" 
                                                    onClick={() => { 
                                                    setdataPassatiForm({ ...dataPassatiForm, img: i.img, nomeHotel: i.nome_hotel, citta: i.citta, via: i.via, emailUtente: emailUtente, nomeUtente: UtenteVisulizzante.nome, id: i.idHotel }); 
                                                    setFlag(1) 
                                                }}
                                                >
                                                    COMMENTA
                                                </Button>
                                            </div>

                                            
                                        </CardContent>
                                    </div>


          
                                    <FormRecensione 
                                        id_hotel={dataPassatiForm.id}
                                        img={dataPassatiForm.img}
                                        nomeHotel={dataPassatiForm.nomeHotel}
                                        citta={dataPassatiForm.citta}
                                        via={dataPassatiForm.via}
                                        nomeUtente={dataPassatiForm.nomeUtente}  
                                        emailUtente={dataPassatiForm.emailUtente}
                                        flag={flag}
                                        onClose={() => setFlag(0)}
                                        onUpdate={fetchData}
                                    /> 

                                    <Recensioni                     
                                        id_hotel={dataPassatiForm.id}
                                        flag={flagRecensione}
                                        onClose={() => setFlagRecensione(0)}
                                    /> 

                                </div>
                                
                            ))}


                        <div>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    </>





}

export default ProfiloUtente;
