//RICHIESTA DEI MODULI 
const express = require('express')
const mongoose = require('mongoose')
const app = express()

//METODI FORMATTAZIONE DATI
const rangeDay = require('../Logica/FormattazioneDati/DifferenzaGiorni.cjs')
const dataSlice = require('../Logica/FormattazioneDati/dataSlice.cjs')
const checkCalendar = require('./ControlloCalendario.cjs')
const cercaData = require('./cercaData.cjs')

//METODI
const listaPrenotazioni = require('../Logica/FormattazioneDati/ListaPrenotazioni.cjs')

//DB SCHEMA 
const hotel = require('../Models/hotelModel.cjs')

//MIDDLEWARE DI APP
app.use(express.json())
app.use(express.urlencoded({extended: false}))









//EFFETTUO LA PRENOTAZIONE NELLA PAGINA /prenotazione
app.post( '/struttura' , async ( req , res ) => {

    if( req.body ){     
        console.log("Sto iniziando la prenotazione");

        let calendario
        const { dataArrivo , dataPartenza , nome_hotel , cittaHotel , emailUtente , giorniTotali } = req.body                      //Prelevo le informazioni dal corpo della richiesta 

        console.log("Ecco cosa ho ricevuto nel Backend: ",  dataArrivo , dataPartenza , nome_hotel , cittaHotel , emailUtente , giorniTotali)

        const dbRequest = await ( hotel.findOne( { $and: [ {nome_hotel: nome_hotel} , {citta: cittaHotel} ] } ) )                                 //Prelevo dal DB qual è l'hotel che mi serve 
        if( dbRequest !== null) {
            //CORRISPONDENZA FRA GLI HOTEL
            calendario = dbRequest.calendario                                                                                                   //Salvo il vecchio calendario dell'hotel
        } else {
            //NESSUNA CORRISPONDENZA FRA GLI HOTEL
            res.status(200).json( {message: "Hotel non trvato"} )
        }

        const dataDifference = rangeDay( dataArrivo , dataPartenza );                                                                           //Differenza giorni fra arrivo e partenza
        let nuovoCalendario = cercaData( dataArrivo , calendario , dataDifference)                                                              //Calendario con le date aggiornate

        

        await hotel.updateOne( {$and: [ {nome_hotel: nome_hotel} , {citta: cittaHotel} ] } , { $set: {calendario : nuovoCalendario}} )            //Reimposto il calendario con le date aggiornate

        const nuovaPrenotazione = {                                                                                                             //Creo il nuovo oggetto 'Prenotazione'
            dataArrivo: dataArrivo , 
            dataPartenza: dataPartenza , 
            emailUtente: emailUtente , 
            prezzo: Number( Number(giorniTotali) * Number( dbRequest.prezzo_a_notte ) ) ,
            giorniTotali: giorniTotali
        }
        await hotel.updateOne( {$and: [ {nome_hotel: nome_hotel} , {citta: cittaHotel} ] } , { $push: {prenotazioni : nuovaPrenotazione}} )       //Associo all'hotel la nuova prenotazione
        console.log("Prenotazione effettuata!")
        res.status(200).json({ message: "Prenotazione riuscita!" });
    }

})











app.post( '/ricerca' , async ( req , res) => {
    const { emailUtente } = req.body 
    let risultato = []

    if( emailUtente !== null ){                                                                                                                 //Esiste una mail utente

        let request1 = await hotel.find( {"prenotazioni.emailUtente": emailUtente} )                                                       //Salvo tutti quegli hotel in cui l'utente ha prenotato
        if( request1.length > 0 ){                                                                                                              //Utente ha effettuato almeno una prenotazione
            risultato = listaPrenotazioni(request1 , emailUtente)                                                                               //Cerco tutte le prenotazioni effettuate
        } else {
            res.status(200).json( {message: "Nessuna Prenotazione"} )
            return
        }
        res.status(200).json( risultato )
    } else {
        res.status(200).json( {message: "Nessuna email inserita"} )
    }

    console.log(risultato)
})









module.exports = app;