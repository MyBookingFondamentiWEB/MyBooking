const mongoose = require('mongoose')
const userModel = require('../../Models/userModel.cjs')

async function ricercaInformazioniUtente ( emailUtente )  {

    const DBRequest = await userModel.findOne( {email: emailUtente})

    let informazioniUtente

    if( DBRequest == null){                                                                                     //Trovato nessun utente con quella mail
        informazioniUtente = null
    } else {
        const nomeCompleto = DBRequest.nome + " " + DBRequest.cognome                                           //Salvo il nome completo
        const immagineProfilo = DBRequest.immagineProfilo                                                       //Salvo la sua foto profilo

        informazioniUtente = {                                                                                  //Creo l'oggetto con le informazioni trovate
            nomeCompleto: nomeCompleto , 
            immagineProfilo: immagineProfilo
        }
    }
    return informazioniUtente;
}

module.exports = ricercaInformazioniUtente