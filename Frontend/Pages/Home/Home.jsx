import { TextField, Button, Box } from '@mui/material';
import {useState , useEffect} from "react";
import "./home.css"
import {useNavigate} from "react-router-dom";

function Home () {

    const navigate = useNavigate();


    const [emailUtente, setEmailUtente] = useState(null);
    const [flag, setFleg] = useState(0);


    useEffect(() => {
            
            fetch('http://localhost:3000/EmailTokenUtente', {     // Recupera email dal token nel cookie
            credentials: 'include',                                     // importantissimo per inviare i cookie
            })
            .then(res => res.json())
            .then(data => {
                if (data.emailUtente) {
                    console.log("Utente già autenticato");
                    setFleg(1)
                }
            })
            .catch(err => console.error("Errore nel recupero email dal token:", err));
    }, []);
    
    





    return (
        <>
            <div className="home">
                <div className="home-content">
                    <h1 id='benvenuto'>Benvenuto su MyBooking</h1>
                    <p id='sottotitolo'>Trova la tua prossima avventura, al miglior prezzo</p>

                    {
                        flag === 0 ? (
                            <Button id="bottone-home" variant="contained" onClick={() => navigate('/login')}>
                                Cerca il tuo viaggio
                            </Button>
                        ) : (
                            <Button id="bottone-home" variant="contained" onClick={() => navigate('/formRicerca')}>
                                Cerca il tuo viaggio
                            </Button>
                        )
                    }

                    
                </div>
            </div>
        </>
    )
}
export default Home
