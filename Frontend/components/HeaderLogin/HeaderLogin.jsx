import './headerLogin.css'
import {Link, useNavigate} from "react-router-dom";
import axios from 'axios';



////////////////MaterialUI Components//////////////////////

import Button from '@mui/material/Button';

//////////////////////////////////////////////////////////



function  Header() {

    const navigate = useNavigate();




    const handleLogout = async () => {
    try {
        await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
        navigate('/login');
    } catch (error) {
        console.error('Errore durante il logout:', error);
    }
    };


    


 return (
     <>
         <nav id='headerCompleto'>
            <img id="logo-header"
                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/dummyLogoWhite.svg"
                alt="Logo"
                href="./"/>

             <ul className="h3">
                <Button id="ricerca-button-header" type="button"  variant="outlined" onClick={() => navigate("/formRicerca")}>Ricerca</Button>
                 <Button id="login-button-header" type="button"  variant="outlined" onClick={() => navigate("/profiloUtente")}>Profilo</Button>
                 <Button id="registrati-button-header" type="button"  variant="outlined" onClick={handleLogout}>Logout</Button>
             </ul>
             </nav>

         </>)
         
}

export default Header;