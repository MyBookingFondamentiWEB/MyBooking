//MODULI NECESSARI
const mongoose = require('mongoose')
const express = require('express')

//SCHEMA HOTEL
const hotelModel = require('../../Models/hotelModel.cjs')

async function prenotazioneEsistente ( emailUtente , nomeHotel , cittaHotel ) {

    let verifica = 0                                                                                                                                        //Conto le prenotazioni
    const request2 = await hotelModel.find( {$and: [ {nomeHotel: nomeHotel} , {citta: cittaHotel} , {"prenotazioni.emailUtente": emailUtente} ]} )          //Richiesta al db

    if( request2.length == 0 ){
        //NON CI SONO PRENOTAZIONI ASSOCIATE
        return verifica;                                                            
    } else {
        for( let i = 0 ; i < request2.length ; i++){
            for( let j = 0 ; j < request2[i].prenotazioni.length ; j++){                                                                                    //Scorro l'array prenotazione di ogni hotel
                if(request2[i].prenotazioni[j].emailUtente == emailUtente){                                                                                 //Scorre le singole prenotazioni
                    verifica += 1
                }
            }
        }   
    }
    return verifica;
}

module.exports = prenotazioneEsistente