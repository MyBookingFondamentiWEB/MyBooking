import "./formRecensione.css"
import {useState, useEffect} from "react";
import AlertRegistrazione from "../../Alert/alertRegistrazione/AlertRegistrazione";


////////////////MaterialUI Components//////////////////////

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


//////////////////////////////////////////////////////////



function AlertModifica({id_hotel, img, nomeHotel, citta, via, nomeUtente, emailUtente, flag, onClose, onUpdate}){

    const port = 3000;
    
    const[flagModifica, setFlagModifica] = useState(0);     //uso questo flag per attivare/disattivare la finestra delle modifiche quando mi trovo nel SINGOLO hotel

    

    const [feedback, setFeedback] = useState({
        voto: "",
        corpoRecensione: ""
    })  



    const [Alert, setAlert] = useState({
        flag: 0,
        bodyError: "",
    })





////////////////////////////////INSERIMENTO RECENSIONE///////////////////////////////////////





    async function handleSubmit(e){
        e.preventDefault()

        console.log("ID HOTEL: ", id_hotel);

        if (feedback.voto === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire la Voto"})
            return;
        }

        if (isNaN(feedback.voto)) {
            setAlert({ ...Alert, flag: 1, bodyError: "Il voto deve essere un numero" });
            return;
        }

        if (feedback.voto < 0 || feedback.voto > 5) {
            setAlert({ ...Alert, flag: 1, bodyError: "Il voto può andare a 0 a 5" });
            return;
        }

        if (feedback.corpoRecensione === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire la Recenione"})
            return;
        }
        


        const nuovoFeedback = {
            _id: id_hotel,
            voto: feedback.voto,
            corpoRecensione: feedback.corpoRecensione,
            nomeUtente: nomeUtente,
            emailUtente: emailUtente
        }
        try{
            const response = await fetch(`http://localhost:${port}/aggiungiFeedback`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuovoFeedback),
            })
            const result = await response.json();

            if (!response.ok) {
                setAlert( {...Alert, flag: 1, bodyError: result.error})
                return;
            }else{
                console.log("Inserimento Recesione eseguita!");
                onClose();
            }




        }catch(e){
            console.error(e);
        }
    }
///////////////////////////////////////////////////////////////////////////////////////////






    

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
                
                <Card id="card-recensione" sx={{ width: 900, height: 500 }} >
                    <form onSubmit={handleSubmit}>
                    <div id="posizione-chiudi-button-recensione">

                        <h2 id="posizione-scritta">INSERISCI RECENSIONE</h2>
                        <Button 
                            id="chiudi-button-recensione" 
                            type="reset"  
                            variant="outlined" 
                            onClick={() => {
                                    setFeedback({ voto: "", corpoRecensione: "" }); // reset dei campi
                                    onClose(); // chiusura popup
                            }}
                        ><CloseIcon /></Button>
                    
                    </div>


                    <div id="recensione-dentro">
                        <div id="descrizione-recensione">
                            <img
                                id="img-prenotazione"
                                src={img || " "}
                                alt={"Hotel " + nomeHotel}
                            />
                            <h3>Hotel {nomeHotel}</h3>
                            <p>{citta}, Via {via}</p>
                        </div>
                        
                            <div id="padding-cornice">
                                <div id="inserimoento-cornice-recensione">

                                    <div id="votoLabelForm" className="labelFormRecensione">
                                        <label htmlFor="voto">Voto: </label>
                                        <input 
                                            type="text" 
                                            name="voto" 
                                            className="formatInputFormRecensione" 
                                            value={feedback.voto} 
                                            onChange={(e) => setFeedback({ ...feedback, voto: e.target.value})}
                                        />
                                    </div>

                                    <div id="corpoRecensioneInputForm" className="inputFormRecensione">
                                        <textarea 
                                            name="corpoRecensione" 
                                            rows="5" 
                                            cols="40"
                                            value={feedback.corpoRecensione} 
                                            onChange={(e) => setFeedback({ ...feedback, corpoRecensione: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div id="posizione-button-commenta">
                                    <Button id="button-hotelcardlist-prenotazione" type="submit"  variant="outlined" >COMMENTA</Button>
                                </div>
                                
                                
                            </div>
                        
                        

                    </div>

                    

                    
                    </form>
                </Card>

                

                <AlertRegistrazione
                    bodyError={Alert.bodyError}
                    flag={Alert.flag}
                    onClose={() => setAlert({ flag: 0, bodyError: "" })}
                >
                </AlertRegistrazione>

            </div>

            


        ) : (
        null
        )
    ): null
    }


    </>





    function handleModifica(e){   //setto lo stato degli elementi 
            setCurrentModifica({ ...currentModifica, [e.target.name]: e.target.value });
    }



}

export default AlertModifica;