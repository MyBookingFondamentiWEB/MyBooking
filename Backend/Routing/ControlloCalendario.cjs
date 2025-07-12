const formatData = require('../Logica/FormattazioneDati/formatData.cjs');
const dateJS = require('../Logica/FormattazioneDati/dateJS.cjs')
const convertData = require('../Logica/FormattazioneDati/convertData.cjs')

function checkCalendar (map , dataArrivo , dataPartenza , range) {

    let flag = 0;
    let formattedDataArrivo = formatData(dataArrivo)                                                                                            //Elimino gli zeri da dataArrivo
    let formattedDataPartenza = formatData(dataPartenza)                                                                                        //Elimino gli zeri da dataPartenza

    map.forEach( ( value , key) => {

        if( key == formattedDataArrivo ) {                                                                                                      //Trovata la corrispondenza date nel calendario

            let baseDynamicKey = dateJS(dataArrivo)                                                                                             //Creato la base per la chiave dinamica

            for( let i = 0 ; i < range ; i++ ){                                                                                                 //Data trovata -> Inizio a scorrere il calendario

                let dinamicKey = new Date(baseDynamicKey.getFullYear() , baseDynamicKey.getMonth() , baseDynamicKey.getDate() + i)              //Creo la chiave dinamica
                let c1 = convertData(dinamicKey)                                                                                                //Converto la data per il mio calendario

                if( map.get(c1) == true ){                                                                                                      //Data è già bloccata
                    flag++;                                                                                                                     //Modo per visualizzare un errore 
                }

                if(flag > 0){                                                                                                                   //Se ho già una prenotazione è inutile bloccare
                    return flag;
                }
            }
        } 

        if(flag > 0) {
            return flag;                                                                                                                        //Ci sono delle date occupate
        }
    })
    return flag;
}

module.exports = checkCalendar;