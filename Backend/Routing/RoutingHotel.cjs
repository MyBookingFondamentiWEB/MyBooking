//MODULI NECESSARI
const express = require('express')
const mongoose = require('mongoose')
const app = express()

//HOTEL SCHEMA
const hotel = require('../Models/hotelModel.cjs')

//METODI FORMATTAZIONE DATI
const rangeDay = require('../Logica/FormattazioneDati/DifferenzaGiorni.cjs')
const dataSlice = require('../Logica/FormattazioneDati/dataSlice.cjs')

//GESTIONE DEL CALENDARIO
const calendar = require('../Logica/FormattazioneDati/calendarCreation.cjs')
const checkCalendar = require('./ControlloCalendario.cjs')

//MIDDLEWARE DI APP 
app.use(express.json())
app.use(express.urlencoded({extended: false}))







//CERCO GLI HOTEL CHE CORRISPONDONO ALLA MIA RICERCA - Miei compiti
app.post( '/ricerca' , async ( req , res ) => {
    if( req.body ){                                                                                                                                     //Esiste il corpo del messaggio
        
        if( (req.body.dataArrivo !== null) && (req.body.dataPartenza !== null) && (req.body.citta !== null) && (req.body.numeroOspiti !== null) ){      //Verifica Ulteriore del mio Body
            //Salvo i dati della richiesta
            const dataArrivo = String( req.body.dataArrivo )
            const dataPartenza = String ( req.body.dataPartenza )
            const numeroOspiti = Number( req.body.numeroOspiti )
            const citta = String( req.body.citta )

            const dbRequest = await ( hotel.find( { $and: [ {citta: citta} , {n_ospiti: {$gte: numeroOspiti}} ] } ) )                               //Ricerco nel mio DB gli hotel che sono affini ai miei criteri di ricerca
                                                                                                                                                    // "gte- great then equal" Cerca solo gli hotel dove il campo n_ospiti è maggiore o uguale a "numeroOspiti"
            let hotelResult = []                                                                                                                        //Vettore che stampa gli hotel che vanno bene
            let indexHotelResult = 0    
            let dayRange = 0
            
            if( dbRequest.length > 0 ){                                                                                                                 //Verifico se ho trovato degli hotel
                //HOTEL TROVATI
                dayRange = rangeDay( dataArrivo , dataPartenza )                                                                                        //Differenza giorni fra le prenotazioni

                //VERIFICA DISPONIBILITA DATE
                for( let i = 0 ; i < dbRequest.length ; i++ ){                                                                                          

                    let tempCalendar = dbRequest[i].calendario;                                                                                         //Prelevo volta per volta i calendari dei singoli hotel
                    let flag = checkCalendar(tempCalendar , dataArrivo , dataPartenza , dayRange)                                                       //Ritorna un flag di verifica

                    if( flag === 0){
                        //HOTEL VISUALIZZABILE
                        hotelResult[ indexHotelResult ] = dbRequest[i]                                                                                  //Aggiungo gli hotel al mio vettore risultato
                        indexHotelResult += 1
                    }
                    flag = 0;
                }
            res.status(200).json( {lista: hotelResult , dayRange: dayRange} )                                                                           //Invio il mio array in front-end

            } else {
                //Hotel non Trovati
                res.status(200).json( {message: "Nessuna struttura affine ai criteri di ricerca impostati"} )                                           //Messaggio per gli alert
            }
            
        } else {
            res.status(400).json( {message: "Errore nella richiesta, riprovare "} )                                                                     //Messaggio per gli alert
        }
    } else {
        //Non Esiste il corpo del messaggio
        res.status(200).json( {message: "Nessun Corpo"} )                                                                                               //Messaggio per gli alert
    }  
})

module.exports = app