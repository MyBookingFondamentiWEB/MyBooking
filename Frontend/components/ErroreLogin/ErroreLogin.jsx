import {useNavigate} from "react-router-dom";


export default function ErroreLogin() {

    const navigate = useNavigate();

    return (
        <>
            <h1>ERRORE LOGIN</h1>
            <button onClick={() => {navigate("/")}}>Ritorna all'inizio</button>
        </>
    );
}
