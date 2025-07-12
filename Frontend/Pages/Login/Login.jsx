import './login.css'
import { styled } from '@mui/material/styles';
import {useEffect, useState} from "react";
import axios from 'axios';
import AlertMessage from '../AlertMessage/AlertMessage'
import {useNavigate} from "react-router-dom";





function Login( ) {

    const navigate = useNavigate();

    const [ showAlert , setShowAlert ] = useState(0);               //flag per mostrare o meno l'Alert
    const [ errorMessage , setErrorMessage ] = useState('');            //testo del messagio di errore che viene passato




    const SwitchButton = styled('button')(({ theme, active }) => ({
        width: 50,
        height: 24,
        borderRadius: 34,
        border: 'none',
        backgroundColor: active ? '#1976d2' : '#ccc',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        padding: 0,

        '&::before': {
            content: '""',
            position: 'absolute',
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: '#fff',
            top: 4,
            left: active ? 30 : 4,
            transition: 'left 0.3s ease',
        },
    }));





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
    
    









    const [ loginData , setLoginData ] = useState({ emailUtente: "" , passwordUtente: ""});
    const [ profileType , setProfileType] = useState("Utente");







    const handleProfileTypeChange = (event) => {
        if( profileType === "Utente" ){
            setProfileType("Host");
        } else {setProfileType("Utente")}
    }








    const handleSubmitLogin = async (event) => {
        event.preventDefault();                 
        let exitMessage = ""

        console.log(profileType);                   //passo il tipo di Login che è stato eseguito, in base alla scelta del pulsante


        if( event.target.email.value == "" || event.target.password.value == "") {    //se non è stato inserito uno dei due campi esce errore con Alert
            setErrorMessage( "Inserire email e password" )
            return;
        }

        setLoginData( (prev) => ( { ...prev , emailUtente: event.target.email.value , passwordUtente: event.target.password.value } ) );




        if( profileType === 'Utente' || profileType === 'utente'){
            exitMessage = await asynctest03( event.target.email.value , event.target.password.value )
        } else {
            exitMessage  = await asynctest06( event.target.email.value, event.target.password.value )    // altrimenti eseguo quella dell'host
        }





        if( exitMessage !== null){

            if( exitMessage == "UTENTE Loggato" || exitMessage == "HOST Loggato"){
                if(exitMessage == "UTENTE Loggato"){
                    console.log(`Frontend - Log Corretto UTENTE`)
                    navigate("/profiloUtente");
                }else{
                    console.log(`Frontend - Log Corretto HOST`)
                    navigate("/profilo/gestioneStruttura");
                }
            } else {
                setErrorMessage( exitMessage )
            }
        }



        event.target.email.value = ""
        event.target.password.value = ""
    }











    //LOGIN UTENTE
    const asynctest03 = async ( emailUtente , passwordUtente ) =>{
            const request = await axios.post( 'http://localhost:3000/loginUtente' ,
            {
                emailUtente: emailUtente,
                passwordUtente: passwordUtente,
            }, {
                withCredentials: true    // mi serve per rendere compatibile la richiesta di login con il cookie
            });
        return request.data.message
    }







    //LOGIN HOST
    const asynctest06 = async ( emailUtente , passwordUtente ) => {   
        const request = await axios.post( 'http://localhost:3000/loginHost' ,
            {
                emailUtente: emailUtente,
                passwordUtente: passwordUtente,
            }, {
                withCredentials: true     // mi serve per rendere compatibile la richiesta di login con il cookie
            });
        return request.data.message
    }

  









    //METODO CHE RILEVA I CAMBIAMENTI NELLA VARIABILE
    useEffect(() => {
        if( errorMessage !== ""){
            setShowAlert(1)
        }
    }, [errorMessage]);




    const handleRegistration = () => {    //se premuto "Sign Up" mi porta alla pagina di registazione
        navigate('/registrazione')
    }





    return(
        <div id="loginMainContainerLogin">

            <div>
                <form onSubmit={handleSubmitLogin}>

                    <div id="formContainerLogin">

                        <div id="nameSiteContainerLogin">
                            <p id="bookingLogoLogin">MyBooking</p>
                        </div>

                        <div id="signInLabelLogin">
                            <p>Sign In</p>
                        </div>
                        
                        <div id="nameInputContainer">
                            <label htmlFor="email" className="labelFormLogin">Email <br/></label>
                            <input type="text" name="email" id="email" className="inputFormLogin"/>
                            
                        </div>
                        

                        <div id="passwordInputContainer">
                            <label htmlFor="password" className="labelFormLogin">Password <br/></label>
                            <input type="password" name="password" id="password"  className="inputFormLogin"/>
                        </div>

                        <div id="rememberMeContainerLogin">
                            <p>Utente 🔍</p>
                            <SwitchButton
                                onClick={handleProfileTypeChange}
                                active={profileType === "Host" ? 1 : 0}
                            />
                            <p>Host 🏨</p>
                        </div>

                        <div id="signInButtonContainerLogin">
                            <button>Login</button>
                        </div>


                        <div id="registerContainerLogin">
                            <button onClick={handleRegistration}>Sign Up</button>
                        </div>

                    </div>

                </form>

            </div>

            {
                (showAlert === 1) ?
                    <div id="backgroundAlertMessage">
                        <AlertMessage message={ errorMessage } showAlertMethod={setShowAlert} messageErrorMethod={setErrorMessage} mainMessage={"ERRORE LOGIN"}/>
                    </div> : null
            }

        </div>
    )
}




export default Login;
