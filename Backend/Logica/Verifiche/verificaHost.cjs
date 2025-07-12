//VERIFICO SOLAMENTE LE INFORMAZIONI RISPETTO A DOCUMENTS SU UTENTI NORMALI
const mongoose = require('mongoose')
const hostSchema = require('../../Models/hostModel.cjs')
const bcrypt = require('bcryptjs')

async function verificaHost (emailUtente , passwordUtente ){

    console.log(`\nInformazioni Ricevute dal Metodo\n-Email: ${emailUtente}\n-Password Host: ${passwordUtente}`)

    if( emailUtente == null || passwordUtente == null){
        console.log(`\nSpecificare Email e Password`)
        return 0;
    }

    const request5 = await hostSchema.findOne( {email: emailUtente})

    if( request5 == null){
        console.log(`\nNon ci sono host con questa mail`)
        return 1;
    } 

    if( !await bcrypt.compare(passwordUtente , request5.password) ){
        console.log(`\nEmail o Password Errati`)
        return 2;
    }

    console.log( `\nBackend - Verifica HOST - HOST Loggato`)       // se nessuna eccezione allora Loggato
    return 3;

}

module.exports = verificaHost