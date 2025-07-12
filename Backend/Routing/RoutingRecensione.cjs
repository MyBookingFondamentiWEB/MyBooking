//MODULI NECESSARI
const express = require('express')
const mongoose = require('mongoose')

//SCHEMI DB 
const hotel = require('../Models/hotelModel.cjs')
const user = require('../Models/userModel.cjs')

//METODI
const prenotazioneEsistente = require('../Logica/Verifiche/prenotazioneEsistente.cjs')
const recensioniEsistenza = require('../Logica/Verifiche/RecensioniEsistenza.cjs')
const ricercaInformazioniUtente = require('../Logica/FormattazioneDati/RicercaInformazioniUtente.cjs')

//MIDDLEWARE DI APP 
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//METODO CHE MI PERMETTE DI INSERIRE LE RECENSIONI - MIO Task
app.post( '/verifica' , async ( req , res ) => {

    const { emailUtente , nomeHotel , cittaHotel } = req.body;                                                                              //Prelevo i dati dal body
    const numeroPrenotazioni = await prenotazioneEsistente( emailUtente , nomeHotel , cittaHotel)                                           //Cerco il numero di prenotazioni  (modulo esterno)

    if( numeroPrenotazioni === 0 ){
        //Non ci sono prenotazioni a carico dell'utente
        res.status(500).json( {message: "Errore lato server"} )
    } else {
        //Ci sono prenotazioni a carico dell'utente
        const numeroRecensioni = await recensioniEsistenza(nomeHotel , cittaHotel , emailUtente)                                            //Conto il numero di prenotazioni effettuate 

        if( numeroRecensioni === numeroPrenotazioni){                                                                                       //Confronto il numero di recensioni con quello di prenotazioni
            //Utente ha effettuato tutte le recensioni possibili
            res.status(200).json( {exitCode: 0} )
        } else {
            //Ci sono altre recensioni effettuabili
            res.status(200).json( {exitCode: 1} )
        }
    }
})










app.post( '/inserimento' , async ( req , res ) => {                                                                                       //Metodo per inserire la recensione
    const { voto , corpoRecensione , emailUtente , nomeHotel , cittaHotel} = req.body
    const numeroPrenotazioni = await prenotazioneEsistente( emailUtente , nomeHotel , cittaHotel)

    if( numeroPrenotazioni === 0){
        res.status(200).json( {message: "Nessuna Prenotazione Effettuata"})                                                                         //Si possono effettuare delle prenotazioni => Mostro il form recensione
    } else {
        let numeroRecensioni = await recensioniEsistenza(nomeHotel , cittaHotel , emailUtente)

        if( numeroRecensioni == numeroPrenotazioni) {                                                                                               //EFFETTUATE TUTTE LE RECENSIONI POSSIBILI
            res.status(200).json({message: "Impossibile Effettuare Altre Recensioni"})
        } else {                                                                                                                                    //SI PUO' INSERIRE LA RECENSIONE
        
            const informazioniUtenteRecensione = await ricercaInformazioniUtente(emailUtente)                                                       //Ricerco nomeUtente e immagineProfilo 

            if( informazioniUtenteRecensione == null){                                                                                               //ERRORE NELL'INSERIMENTO DELLA MAIL UTENTE 
                res.status(400).json( {message: "Errore nell'inserimento della mail utente o utente non esistente"})
            } else {

                //UTENTE CORRETTAMENTE CERCATO
                const nuovaRecensione = {                                                                                                           //Creo l'oggetto recensione
                    emailUtente: emailUtente ,
                    voto: voto , 
                    corpoRecensione: corpoRecensione , 
                    nomeUtente: informazioniUtenteRecensione.nomeCompleto , 
                    immagineProfilo: informazioniUtenteRecensione.immagineProfilo
                }
                await hotel.updateOne( {$and: [ {nomeHotel: nomeHotel} , { citta: cittaHotel } ] } , { $push: { recensioni: nuovaRecensione}})  //Inserisco la recensione nel DB
                res.status(200).json( {message: "Utente Correttamente Inserito"})
            }
        }
    }
})

module.exports = app;