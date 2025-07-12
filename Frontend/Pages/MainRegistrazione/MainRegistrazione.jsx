import './mainRegistrazione.css'
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate } from 'react-router-dom';
import {useState, useEffect} from "react";

function MainRegistrazione() {
    const navigate = useNavigate();


    
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
    
    

    return (
        <>
            <Header />

            <div className="register-container">
                <h2 className="register-title">Scegli come registrarti</h2>
                <div className="register-group">
                    <div className="register-c" onClick={() => navigate('/registrazione/proprietarioStruttura')}>
                        <h3>🏨 Proprietario Struttura</h3>
                        <p>Metti la tua struttura sotto i riflettori: accetta prenotazioni in modo facile e veloce.</p>
                    </div>
                    <div className="register-c" onClick={() => navigate('/registrazione/utente')}>
                        <h3>👤 Utente</h3>
                        <p>La tua prossima esperienza di viaggio inizia qui, semplice e veloce.</p>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
export default MainRegistrazione;