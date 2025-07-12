import './ListaStrutture.css'
import Context from "../../Store/Context";
import { useState , useEffect , useContext } from "react";
import {useNavigate} from "react-router-dom";
import HotelCardList from "../HotelCardList/HotelCardList";
import Header from "../../../components/HeaderLogin/HeaderLogin";
import Footer from '../../../components/Footer';



////////////////MaterialUI Components//////////////////////

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';


//////////////////////////////////////////////////////////




function ListaStrutture() {

    const { dayRange , setDayRange } = useContext(Context)
    const { structureList , setStructureList} = useContext(Context)
    const [ loadFlag , setLoadFlag ] = useState(false);


    const [emailUtente, setEmailUtente] = useState(null);


    
    const navigate = useNavigate();
    const backForm = () => { navigate("/formRicerca") }




    //VERIFICA ARRIVO DATI
    useEffect(() => {
        if(emailUtente){
            console.log("structureList - Strutture trovate:", structureList)
            if (!loadFlag) setLoadFlag(true)
        }
    }, [structureList, emailUtente])




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

    

    return(
        <>
            <Header/>
                <div id="containerListaStruttura">
                    <div id="titolo-risultato">
                        {
                            loadFlag === true ? 
                                (
                                    Array.isArray( structureList ) ? (
                                        <h1>La tua Ricerca <SearchIcon/></h1> ) : <h1>Nessuna Struttura Trovata</h1>
                                    
                                ) 
                                : null
                        }
                    </div>

                    <div>

                        {
                            loadFlag === true && Array.isArray( structureList ) ? (
                            
                                structureList.map( (element , index) => {
                                    return <HotelCardList key={index} structure={element} dayRange={dayRange} />
                                })

                            ):(
                                <div id="alertNessunaStrutture">
                                    <p id="testo-ritorna">Per tornare alla ricerca clicca qui</p>
                                    <Button id="button-ritorno-ricerca" onClick={backForm}>
                                        RITORNA
                                        <RestartAltIcon />
                                    </Button>
                                </div>
                                )
                                
                        }

                    </div>
                    
                    

                </div>
                <Footer />
        </>
    )
}

export default ListaStrutture;
