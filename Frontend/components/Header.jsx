import './Header.css'
import {Link, useNavigate} from "react-router-dom";



////////////////MaterialUI Components//////////////////////

import Button from '@mui/material/Button';

//////////////////////////////////////////////////////////



function  Header() {

    const navigate = useNavigate();


 return (
     <>
         <nav id='headerCompleto'>

                <Link className="link" to="/">
                    <a href="#">
                        <img id="logo-header"
                            src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/dummyLogoWhite.svg"
                            alt="Logo"/>
                    </a>
                </Link>

             
             <ul className="h3">
                 <Button id="login-button-header" type="button"  variant="outlined" onClick={() => navigate("/login")}>Login</Button>
                 <Button id="registrati-button-header" type="button"  variant="outlined" onClick={() => navigate("/registrazione")}>Registrati</Button>
             </ul>
             </nav>

         </>)
         
}

export default Header;