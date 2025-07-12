import {useState, useEffect} from "react";
import "./gestioneStruttura.css"
import Header from "../../components/Header";
import AlertRegistrazione from "../Alert/alertRegistrazione/AlertRegistrazione";
import {useNavigate} from "react-router-dom";




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



export default function GestioneStruttura(){


    const port = 3000;
    const [showForm, setshowForm] = useState(false)


    const [Alert, setAlert] = useState({
        flag: 0,
        bodyError: "",
    })

    const navigate = useNavigate();


    const [hotel, setHotel] = useState([])    //vado a creare un array vuoto che poi setto con i parametri che voglio passare
    const[flag, setFlag] = useState(0);


    const [emailUtente, setEmailUtente] = useState(null);

    const [form, setForm] = useState({
        nomeStruttura: "",
        citta: "",
        via: "",
        descrizione: "",
        n_ospiti: "",
        prezzo_a_notte: "",
        img: ""
    })




    const [currentModifica, setCurrentModifica] = useState({
        id: "",
        nome_hotel: "",
        citta: "",
        via: "",
        descrizione: "",
        prezzo_a_notte: "",
        n_ospiti: "",
        immagine_hotel: "",
    })  



    
    const fetchData = async () => {
            const res = await fetch(`http://localhost:${port}/gestioneStrutture`)
            const data = await res.json()
            setHotel(data.items)
            console.log("ecco cosa ho visualizzato:", data.items)
    }
    


    useEffect(() => {
        fetchData();
    }, [])








    

    // useEffect(() => {
        
    //     fetch('http://localhost:3000/EmailTokenUtente', {     // Recupera email dal token nel cookie
    //     credentials: 'include',                                     // importantissimo per inviare i cookie
    //     })
    //     .then(res => res.json())
    //     .then(data => {
    //         if (data.emailUtente) {
    //         setEmailUtente(data.emailUtente);
    //         } else {
    //         console.log("Utente non autenticato");
    //         navigate("/ErroreLogin")
    //         }
    //     })
    //     .catch(err => console.error("Errore nel recupero email dal token:", err));
    // }, []);

    
















////////////////////////////////INSERIMENTO STRUTTURA///////////////////////////////////////

    function handleChange(e){
        setForm({ ...form, [e.target.name]: e.target.value, })
    }



    async function handleSubmit(e){
        e.preventDefault()


        if (form.nomeStruttura === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire il Nome della Struttura"})
            return;
        }

        if (form.citta === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire la Città"})
            return;
        }
        if (form.via === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire la Via"})
            return;
        }
        if (form.descrizione === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire la Descrizione"})
            return;
        }
        if (form.prezzo_a_notte === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire il Prezzo a Notte"})
            return;
        }
        if (form.n_ospiti === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire il Numero di Ospiti"})
            return;
        }


        if (isNaN(form.prezzo_a_notte)) {
            setAlert({...Alert, flag: 1, bodyError: "Prezzo a notte non valido"});
            return;
        }

        if (isNaN(form.n_ospiti)) {
            setAlert({...Alert, flag: 1, bodyError: "Numero di Ospiti non valido"});
            return;
        }



        const nuovo = {
            nomeStruttura: form.nomeStruttura,
            citta: form.citta,
            via: form.via,
            descrizione: form.descrizione,
            n_ospiti: form.n_ospiti,
            prezzo_a_notte: form.prezzo_a_notte,
        }
        try{
            const response = await fetch(`http://localhost:${port}/profilo/aggiungiStruttura`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuovo),
            })
            const result = await response.json();

            if (!response.ok) {
                setAlert( {...Alert, flag: 1, bodyError: result.error})
                return;
            }else{
                console.log("Inserimento eseguito!");
                setshowForm(false);
                fetchData();
            }




        }catch(e){
            console.error(e);
        }
    }
///////////////////////////////////////////////////////////////////////////////////////////
































    return <>

            {/* <Header/> */}
            <div id="posizione-griglia">

            
                <h1 id="h1-benvenuto">Benvenuto nel tuo Profilo!</h1>




                <div>
                    {!showForm && (
                            <Button id="button-inserisci-struttura" type="submit" variant="contained" onClick = {() => setshowForm(true)}>       
                                <div id="icona-add">
                                    <AddIcon />
                                </div>
                            </Button>
                        )}
                        {showForm && (


                            <div>
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <Card sx={{ minWidth: 450} } elevation={8} id="cardBox-inserimento">    {/*elevation mi crea ombra sotto il box*/}
                                            <CardContent id="box">
                                                <h2 color="black">Dati per la struttura</h2>
                                                <div id="raggruppamento">
                                                    <TextField id="inputNomeStruttura" label="Nome Struttura" name='nomeStruttura' value={form.nomeStruttura} onChange={handleChange}/>
                                                    <TextField id="inputcitta" label="Città" name="citta" value={form.citta} onChange={handleChange}/>
                                                    <TextField id="inputVia" label="Via" name="via" value={form.via} onChange={handleChange}/>
                                                    <TextField id="inputdescrizione" label="Descrizione" name="descrizione" value={form.descrizione} onChange={handleChange}/>
                                                    <TextField id="inputPrezzo" label="Prezzo a Notte" name='prezzo_a_notte' value={form.prezzo_a_notte} onChange={handleChange}/>
                                                    <TextField id="inputOspiti" label="Numero Ospiti" name="n_ospiti" value={form.n_ospiti} onChange={handleChange}/>
                                                    <TextField id="inputimg" label="URL immagine" name="img" onChange={handleChange}/>
                                                </div>
                                            </CardContent>
                                            <div id="raggruppamento-button">
                                                <Button id="modifica-button" type="submit" variant="contained">Aggiungi</Button>
                                                <Button id="modifica-button" type="submit" variant="contained" onClick={() => setshowForm(false)}>Annulla</Button>
                                            </div>
                                        </Card>
                                    </div>
                                </form>
                      
                            </div>

                        )}
                </div>







                <h3 id="scritta-strutture">Le tue strutture</h3>        






                <div id="griglia">

                <Grid container spacing={5}>               {/* Elemento che si occupa della gestione della griglia */}
                    {hotel.map(i => (
                        <div key={i._id}>
                            <Grid>   
                                <div className="fade-in-up">
                                    <Card sx={{ width: 390, height: 300 }} id="box">
                                        <div id="posizione-bottone">
                                            <Button
                                                id="visualizzaButton"
                                                type="submit"
                                                variant="contained"
                                                onClick={() => { 
                                                    setCurrentModifica({ ...currentModifica, id: i._id, nome_hotel: i.nome_hotel, citta: i.citta, via: i.via, descrizione: i.descrizione, prezzo_a_notte: i.prezzo_a_notte, n_ospiti: i.n_ospiti, immagine_hotel: i.img}); 
                                                    setFlag(1) 
                                                }}
                                            >
                                            </Button>
                                        </div>

                                        <div>
                                            <img
                                                id="img"
                                                src={i.img}
                                                alt={"Hotel " + i.nome_hotel}
                                            />

                                            <ImageListItemBar id="descrizioneHotel"
                                                title={"Hotel " + i.nome_hotel}
                                                subtitle={i.citta + ", Via " + i.via}
                                            />
                                        </div>
                                        
                                        
                                    </Card>
                                </div>  
                                
                            </Grid>


                            <AlertModifica 
                                        id={currentModifica.id}
                                        nome_hotel={currentModifica.nome_hotel}
                                        citta={currentModifica.citta}
                                        via={currentModifica.via}
                                        descrizione={currentModifica.descrizione}
                                        prezzoNotte={currentModifica.prezzo_a_notte}
                                        nOspiti={currentModifica.n_ospiti}
                                        immagine={currentModifica.immagine_hotel}
                                        flag={flag}
                                        onClose={() => setFlag(0)}
                                        onUpdate={fetchData}
                            />
                        </div>
                        
                        
                    ))}
                </Grid>

                
                </div>

                <AlertRegistrazione
                    bodyError={Alert.bodyError}
                    flag={Alert.flag}
                    onClose={() => setAlert({ flag: 0, bodyError: "" })}
                >
                </AlertRegistrazione>
            
            </div>
        


    </>



}