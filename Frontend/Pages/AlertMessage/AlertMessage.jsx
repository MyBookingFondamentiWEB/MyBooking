import './alertMessage.css'

function AlertMessage( { message , showAlertMethod , messageErrorMethod , mainMessage } ) {

    const handleClose = () => {
        messageErrorMethod('')
        showAlertMethod(0)
    }

    return (
        <div id="mainContainerAlertMessage">

            <div id="messageContainerAlertMessage">
                <h3>{mainMessage}</h3>
                <p>{message}</p>
            </div>

            <div id="buttonContainerAlertMessage">
                <button id="ContainerButtonAlert" onClick={ handleClose }>Chiudi</button>
            </div>

        </div>
    )
}

export default AlertMessage;
