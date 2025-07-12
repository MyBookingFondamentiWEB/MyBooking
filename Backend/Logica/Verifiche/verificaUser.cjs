//VERIFICO SOLAMENTE LE INFORMAZIONI RISPETTO A DOCUMENTS SU UTENTI NORMALI

const userSchema = require('../../Models/userModel.cjs')
const bcrypt = require('bcryptjs')

async function verificaUser (emailUtente , passwordUtente ){                // ricevo in input email e password dell'utente

    console.log(`\nInformazioni Ricevute dal Metodo\n-Email: ${emailUtente}\n-PasswordUtente: ${passwordUtente}`)     // stampo per essere sicuro delle informazioni ricevute

    if( emailUtente == null || passwordUtente == null){        //se non ricevo nulla, invio messaggio a console per esortare di inserire
        console.log(`\nSpecificare Email e Password`)
        return 0;
    }

    const request5 = await userSchema.findOne( {email: emailUtente})       // ricerco nel DB la mail dell'utente visto che è unica per ognuno

    if( request5 == null){                                                  //mail non è presente
        console.log(`\nNon ci sono utenti con questa mail`)
        return 1;
    } 

    if( !await bcrypt.compare(passwordUtente , request5.password) ){                 //faccio una comparazione tra la pass ricevuta e quella ritrovata tramite la mail da findOne
        console.log(`\nEmail o Password Errati`)                                     //se divera allora PASSWORD ERRATA
        return 2;
    }

    console.log( `\nBackend - Verifica Utente - Utente Loggato`)       // se nessuna eccezione allora Loggato
    return 3;
}

module.exports = verificaUser