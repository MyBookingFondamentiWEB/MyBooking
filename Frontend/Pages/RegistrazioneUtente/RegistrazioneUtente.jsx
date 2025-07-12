////////////FRONTEND

import {useState, useEffect} from "react";
import "./registrazioneUtente.css"
import AlertRegistrazione from "../Alert/alertRegistrazione/AlertRegistrazione";
import { useNavigate } from 'react-router-dom';


////////////////MaterialUI Components//////////////////////

import Button from '@mui/material/Button';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { DateTime } from 'luxon';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


//////////////////////////////////////////////////////////






export default function Registrazione(){

    const navigate = useNavigate();

    const port = 3000;

    const [Alert, setAlert] = useState({
        flag: 0,
        bodyError: "",
    })

    const [currentRegistration, setCurrentRegistration] = useState({
        nome: "",
        cognome: "",
        email: "",
        password: "",
        genere: "maschio",
        dataNascita: "",
        confirmPassword: ""
    })



    const [emailUtente, setEmailUtente] = useState(null);
    
    

    useEffect(() => {
            
            fetch('http://localhost:3000/EmailTokenUtente', {     // Recupera email dal token nel cookie
            credentials: 'include',                                     // importantissimo per inviare i cookie
            })
            .then(res => res.json())
            .then(data => {
                if (data.emailUtente) {
                    console.log("Utente già autenticato");
                    navigate("/")
                }
            })
            .catch(err => console.error("Errore nel recupero email dal token:", err));
    }, []);
    



    const registrazione = async (e) => {

        e.preventDefault();

        console.log("Invio i seguenti dati:", currentRegistration);



        if (currentRegistration.nome === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire il Nome"})
            return;
        }

        if (currentRegistration.cognome === "") {     
            setAlert( {...Alert, flag: 1, bodyError: "Inserire il Cognome"})
            return;
        }


        if (currentRegistration.email === "") {   
            setAlert( {...Alert, flag: 1, bodyError: "Inserire l'Email"})  
            return;
        }


        if (currentRegistration.password === "") {  
            setAlert( {...Alert, flag: 1, bodyError: "Inserire la Password"}) 
            return;
        }


        if (currentRegistration.confimPassword === "") {   
            setAlert( {...Alert, flag: 1, bodyError: "Ripetere la Password!"})
            return;
        }

        if (currentRegistration.password.trim() !== currentRegistration.confirmPassword.trim()) {     //rimuovo gli spazi bianchi con trim()
            setAlert( {...Alert, flag: 1, bodyError: "Le password non coincidono"})
            return;
        }

        if (currentRegistration.dataNascita === "") {   
            setAlert( {...Alert, flag: 1, bodyError: "Inserire Data di Nascita"})
            return;
        }



        try{

            const response = await fetch(`http://localhost:${port}/registrazione/utente`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    nome: currentRegistration.nome,
                    cognome: currentRegistration.cognome,
                    email: currentRegistration.email,
                    password: currentRegistration.password,
                    genere: currentRegistration.genere,
                    dataNascita: currentRegistration.dataNascita
                })
            })



            if (!response.ok) {
                const errorData = await response.json();
                setAlert( {...Alert, flag: 1, bodyError: errorData.error})
                return;
            }else{
                console.log("Inserimento eseguito!");
                navigate('/');
            }




            console.log("Dati inviati a indexServer!!!!");

        }catch(err){
            console.error("Errore API: ", err);
        }




    }










    return <>

    <div id="container">
        <div id="registrazione">
            <div className="form-container">
                <form onSubmit={registrazione}>
                <div>
                    <Card sx={{ minWidth: 450} } elevation={8} id="cardBox">    {/*elevation mi crea ombra sotto il box*/}
                        <CardContent id="box">
                            <h2 color="black">Sign up to Booking</h2>
                            <h3 color="black" id="Utenteh3">Utente</h3>

                            <div id="box-input">
                                <TextField id="inputNome" label="Nome" onChange={handleRegistration} name="nome" value={currentRegistration.nome}/>
                                <TextField id="inputCognome" label="Cognome" onChange={handleRegistration} name="cognome" value={currentRegistration.cognome}/>
                                <TextField id="inputEmail" label="Email" onChange={handleRegistration} name="email" value={currentRegistration.email}/>
                                <TextField id="inputPassword" label="Password" type="password" onChange={handleRegistration} name="password" value={currentRegistration.password}/>
                                <TextField id="inputConfirmPassword" label="Conferma Password" type="password" onChange={handleRegistration} name="confirmPassword" value={currentRegistration.confirmPassword}/>

                                <LocalizationProvider id="input" dateAdapter={AdapterLuxon} adapterLocale={"en-us"}>
                                    <DateField
                                        label="Data di Nascita"
                                        name="dataNascita"
                                        value={currentRegistration.dataNascita ? DateTime.fromISO(currentRegistration.dataNascita) : null}

                                        onChange={(newValue) => {     //nuovo valore della data selezionata
                                            if (newValue && newValue.isValid) {
                                                setCurrentRegistration({ ...currentRegistration, dataNascita: newValue.toISODate() }) // salva solo la stringa ISO "YYYY-MM-DD"
                                            }
                                        }}

                                    />
                                </LocalizationProvider>
                            </div>


                            <div id="radioButton">
                                <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" defaultValue="maschio" name="genere" id="genere" onChange={handleRegistration}>  {/* "row" mi serve per allineare i due radio button */}
                                    <FormControlLabel value="maschio" control={<Radio color="black"/>} label="Maschio" />
                                    <FormControlLabel value="femmina" control={<Radio color="black"/>} label="Femmina" />
                                </RadioGroup>
                            </div>



                            <Button id="registrazione-button" type="submit" variant="contained" endIcon={<NavigateNextIcon />}>Registrati</Button>
                        </CardContent>
                    </Card>
                </div>


                </form>
            </div>                            

                <AlertRegistrazione
                    bodyError={Alert.bodyError}
                    flag={Alert.flag}
                    onClose={() => setAlert({ flag: 0, bodyError: "" })}
                >
                </AlertRegistrazione>
            
        </div>
    </div>


    </>



    function handleRegistration(e){   //setto lo stato degli elementi
        setCurrentRegistration({ ...currentRegistration, [e.target.name]: e.target.value });
    }






}