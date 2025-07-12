const convertData = require('../Logica/FormattazioneDati/convertData.cjs')                                                                                         //Conversione delle date
const dateZeri = require('../Logica/FormattazioneDati/dateZeri.cjs')                                                                                               //Metodo per rimuovere gli zeri dalle date

function cercaData (dataArrivo , mappa , differenzaGiorni){

    let dataArrivoConvertita = dateZeri(dataArrivo)                                                                                                     //Data per accedere alla mappa
    let dataArrivoDate = new Date( Number(dataArrivo.slice(0 , 4)) , (Number(dataArrivo.slice(5 , 7 )) - 1) , (Number(dataArrivo.slice(8 , )))   )      //Data utile per creare la chiave 

    mappa.forEach( function (value , key) {                                                                                                             //Scorro gli elementi della mappa

        if(dataArrivoConvertita === key){
            for(let i = 0 ; i < differenzaGiorni ;  i++){                                                                                               //Genero dinamicamente la chiave di accesso e modifico a true
                
                let tempData = new Date( dataArrivoDate )
                let chiaveDinamicaGenerata = new Date(tempData.setDate(tempData.getDate() + i))                                                         //Genero la chiave per accedere alla mappa
                let c1 = convertData(chiaveDinamicaGenerata)                                                                                            //Converto la chiave per usarla 

                mappa.set(c1 , true)                                                                                                                    //Imposto le prenotazioni
            }
        }
    })
    return mappa;
}

module.exports = cercaData