import "./alertModifica.css"
import {useState, useEffect} from "react";



////////////////MaterialUI Components//////////////////////

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

//////////////////////////////////////////////////////////





function AlertModifica({id, nome_hotel, citta, via, descrizione, prezzoNotte, nOspiti, immagine, flag, onClose, onUpdate}){


    
    const [selectedHotelId, setSelectedHotelId] = useState(null);
    const[flagModifica, setFlagModifica] = useState(0);     //uso questo flag per attivare/disattivare la finestra delle modifiche quando mi trovo nel SINGOLO hotel

    

    const [currentModifica, setCurrentModifica] = useState({
        nome_hotel: "",
        citta: "",
        via: "",
        descrizione: "",
        prezzo_a_notte: "",
        n_ospiti: "",
        immagine_hotel: "",
    })  



  



    

    const eliminazione = async (e, hotel_id) => {
    const conferma = window.confirm("Sei sicuro di voler eliminare questo hotel?");
    if(!conferma){
        return; 
    }
    e.preventDefault();

    try {
        const response = await fetch(`http://localhost:3000/hotel/${hotel_id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.error);
            return;
        }

        console.log("Eliminazione effettuata con successo!!!!");

        if (onUpdate) {
                setFlagModifica(0);
                onClose();
                onUpdate();
        }

    } catch(err) {
        console.log("Errore API: ", err);
    }
}











    const modificaStruttura = async (e, hotel_id) => {
        console.log("Sto iniziando la modifica!");
        console.log("Modifica con i seguenti dati:", currentModifica);
        try{

            const response = await fetch(`http://localhost:3000/modifica_hotel/${hotel_id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    nome_hotel: currentModifica.nome_hotel,
                    citta: currentModifica.citta,
                    via: currentModifica.via,
                    descrizione: currentModifica.descrizione,
                    prezzo_a_notte: currentModifica.prezzo_a_notte,
                    n_ospiti: currentModifica.n_ospiti,
                    img: currentModifica.immagine_hotel
                })
            })



            if(!response.ok){
                const errorData = await response.json();

                alert(errorData.error);
                return;

            }

            console.log("Modifica effettuata con successo!!!!")
            
            if (onUpdate) {
                setFlagModifica(0);
                onClose();
                onUpdate();
            }

        }catch(err){
            console.log("Errore API: ", err);
        }
    }





































    

    const divStyle = {
        position: "fixed", /* fixed per restare in alto indipendentemente dallo scroll */
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(19, 19, 19, 0.32)",
        zIndex: 1000,  /* per stare sopra tutto */
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };




    return<>

    {flag === 1 ? (
        flagModifica === 0 ? (




            <div style={divStyle}>
                <Card id="card-descr" sx={{ width: 900, height: 500 }} key={id}>
                    <div id="posizione-chiudi-button">
                        <Button id="chiudi-button" type="button"  variant="outlined" onClick={onClose}><CloseIcon /></Button>
                    </div>


                    <div id="container-hotel">

                        <div>
                            <img
                                id="img-modifica"
                                src={immagine}
                                alt={"Hotel " + nome_hotel}
                            />
                        </div>


                        <div id="descrizione-apertura">

                            <ul id="listadescrizione">
                                <li key={id}><h3>Hotel {nome_hotel}</h3></li>
                                <li>Città: {citta}, via {via}</li>
                                <li>Descrizione: {descrizione}</li>
                                <li>Prezzo: {prezzoNotte}€ <br />  Numero Ospiti: {nOspiti}</li>
                            </ul>

                            <div id="modifica-elimina">
                                <Button
                                    id="modifica-pulsante"
                                    variant="contained"
                                    endIcon={<NavigateNextIcon />}
                                    onClick={() => {
                                        setSelectedHotelId(id);
                                        setCurrentModifica({
                                            nome_hotel: nome_hotel || "",
                                            citta: citta || "",
                                            via: via || "",
                                            descrizione: descrizione || "",
                                            prezzo_a_notte: prezzoNotte || "",
                                            n_ospiti: nOspiti || "",
                                            immagine_hotel: immagine || ""
                                        });
                                        setFlagModifica(1);
                                    }}
                                >
                                    Modifica
                                </Button>
                            </div>
                            
                        </div>


                    </div>



                    
                </Card>
            </div>






        ) : (




            <div style={divStyle}>
                <CardContent id="box-modifica-corso">
                    <h2 id="modifica-corso">Modifica in corso</h2>


                    <div id="box-input">
                        <TextField label="Nome Hotel" onChange={handleModifica} name="nome_hotel" value={currentModifica.nome_hotel}/>
                        <TextField label="Città" onChange={handleModifica} name="citta" value={currentModifica.citta}/>
                        <TextField label="Via" onChange={handleModifica} name="via" value={currentModifica.via}/>
                        <TextField label="Descizione" type="text" onChange={handleModifica} name="descrizione" value={currentModifica.descrizione}/>
                        <TextField label="Prezzo a Notte" onChange={handleModifica} name="prezzo_a_notte" value={currentModifica.prezzo_a_notte}/>
                        <TextField label="Numero Ospiti" onChange={handleModifica} name="n_ospiti" value={currentModifica.n_ospiti}/>
                        <TextField label="URL immagine" onChange={handleModifica} name="immagine_hotel" value={currentModifica.immagine_hotel}/>
                    </div>
                    

                    <div id="modifica-elimina">
                        <Button id="cancella-button" type="button"  variant="outlined" onClick={() => {setFlagModifica(0)}}>Cancella</Button>
                        <Button id="elimina-button" type="button" onClick={(e) => eliminazione(e, id)} variant="outlined" endIcon={<DeleteIcon />}>Elimina</Button>
                        <Button id="modifica-button" type="submit" variant="contained" onClick={(e) => {modificaStruttura(e, id)}} endIcon={<NavigateNextIcon />}>Modifica</Button>
                    </div>

                    
                </CardContent>
            </div>



        )
    ) : (
        null
    )
    }


    </>





    function handleModifica(e){   //setto lo stato degli elementi 
            setCurrentModifica({ ...currentModifica, [e.target.name]: e.target.value });
    }



}

export default AlertModifica;