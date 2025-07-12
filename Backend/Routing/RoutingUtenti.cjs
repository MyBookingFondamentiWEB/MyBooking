//RICHIESTA DEI MODULI 
const express = require('express')
const mongoose = require('mongoose')
const app = express()

//METODI NECESSARI
const verificaUser = require('../Logica/Verifiche/verificaUser.cjs')
const verificaHost = require('../Logica/Verifiche/verificaHost.cjs')
const ricercaInformazioniUtente = require('../Logica/FormattazioneDati/RicercaInformazioniUtente.cjs')

//MIDDLEWARE DI APP
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//ROTTE
app.post( '/loginUtente' , async ( req , res )=> {                                                                                          //Login Utente normale 

    const { emailUtente , passwordUtente } = req.body
    const exitCode = await verificaUser(emailUtente , passwordUtente)

    switch ( exitCode ) {
        case 0:
            res.status(200).json( {message: "Specificare Email e Password"} );
            return;

        case 1: 
            res.status(200).json( {message:"Email non esistente" } );
            return;

        case 2: 
            res.status(200).json( {message: "Email o Password errati"} );
            return;

        case 3: 
            res.status(200).json( {message: "Utente Loggato"} );
            return;

        default: 
            res.status(500)
    }
})

app.post( '/loginHost' , async ( req , res ) => {                                                                                           //Login Host
    const { emailUtente , passwordUtente } = req.body                                                                                           //Prelevo i dati del login 
    const exitCode = await verificaHost ( emailUtente , passwordUtente)

    switch ( exitCode) {
        case 0:
            res.status(200).json( {message: "Specificare Email e Password"} );
            return;

        case 1: 
            res.status(200).json( {message:"Email non esistente" } );
            return;

        case 2: 
            res.status(200).json( {message: "Email o Password errati"} );
            return;

        case 3: 
            res.status(200).json( {message: "Host Loggato"} );
            return;

        default: 
            res.status(500)
    }
})







app.post( '/informazioniUtente' , async ( req , res ) => {                                                                                  //Prelevo informazioni aggiuntive sull'utente
    const {emailUtente} = req.body  

    if( emailUtente ){
        let informazioni = await ricercaInformazioniUtente(emailUtente)                                                                     //Ricerco le informazioni dell'utente in base alla mail
        res.status(200).json( informazioni )                                                                                                //Invio oggetto informazioni
    } else {
        res.status(200).json( {message: "Email non esistente"} )
    }
})

module.exports = app