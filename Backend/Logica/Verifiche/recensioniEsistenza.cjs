//MODULI NECESSARI
const mongoose = require('mongoose')
const express = require('express')

//SCHEMA HOTEL
const hotelModel = require('../../Models/hotelModel.cjs')

async function recensioniEsistenti(nomeHotel , cittaHotel , emailUtente) {

    let verifica = 0                                                                                                                                        //Contatore delle recensioni 
    const dbRequest = await( hotelModel.find( {$and: [ {nomeHotel: nomeHotel} , {citta: cittaHotel} , {"recensioni.emailUtente": emailUtente}] } ) )        //Prelevo dal db le informazioni sull'hotel

    for( let i = 0 ; i < dbRequest.length ; i++){
        for( let j = 0 ; j < dbRequest[i].recensioni.length ; j++){                                                                                         //Conto il numero di prenotazioni fatte dall'utente
            if(dbRequest[i].recensioni[j].emailUtente == emailUtente){
                verifica += 1 
            }
        }
    }
    return verifica;
} 
module.exports = recensioniEsistenti;