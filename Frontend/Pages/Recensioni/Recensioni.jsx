import {useState, useEffect} from "react";
import "./recensioni.css"


////////////////MaterialUI Components//////////////////////

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import RecensioniCard from "./RecensioniCard";
import Box from '@mui/material/Box';

//////////////////////////////////////////////////////////


export default function Recensioni({id_hotel, flag, onClose}){

    const[flagModifica, setFlagModifica] = useState(0);     //uso questo flag per attivare/disattivare la finestra delle modifiche quando mi trovo nel SINGOLO hotel
    const [listaCommenti, setListaCommenti] = useState([]);
    
    const fetchData = async () => {
        const res = await fetch(`http://localhost:3000/visualizzaRecensioni/${id_hotel}`)
        const data = await res.json()
        console.log("L'id hotel è: ", id_hotel)
        console.log("Le recensioni trovate sono: ", data)
        setListaCommenti(Array.isArray(data.recensioni) ? data.recensioni : []);   //controllo per evitare che mi risulti undefined
        console.log("ecco cosa ho visualizzato:", data.items)
    }


    useEffect(() => {
        if (id_hotel) {     //uso if perché l'id potrebbe non essere pronto e risultare undefined
            fetchData();
        }
    }, [id_hotel]);



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
                <Card id="card-recensioni" sx={{ width: 900, height: 500 }} >
                    <div id="posizione-chiudi-button-recensioni">

                        <h2 id="posizione-scritta-recensioni">Recensioni</h2>
                        <Button id="chiudi-button-recensioni" type="button"  variant="outlined" onClick={onClose}><CloseIcon /></Button>
                    
                    </div>

                    {console.log("ID HOTEL - dentro recensioni: ", id_hotel)}

                    <div id="contenitore-recensioni">
                        {listaCommenti.length > 0 ? (
                            listaCommenti.map(i => (
                                <RecensioniCard key={i.emailUtente} nome={i.nomeUtente} punteggio={i.voto} commento={i.corpoRecensione} />
                            ))
                        ) : (
                            <p style={{ padding: "1rem", fontStyle: "italic" }}>Nessuna recensione disponibile.</p>
                        )}
                    </div>

                        

                </Card>

            </div>


        ) : (
        null
        )
    ): null
    }


    </>





}