function listaPrenotazioni ( hotel , emailUtente) {
    let datiFormattati = []

    for(let i = 0 ; i < hotel.length ; i++) {                                                               //SCORRO FRA TUTTI GLI HOTEL CON ALMENO UNA PRENOTAZIONE
                                                                                                            
        for( let j = 0 ; j < hotel[i].prenotazioni.length ; j++){                                           //STO SCORRENDO LE SINGOLE PRENOTAZIONI DEGLI HOTEL
            
            if( hotel[i].prenotazioni[j].emailUtente ==  emailUtente) {                                     //Trovo la corrispondenza con la mail dell'utente

                datiFormattati.push({                                                                       //Inserisco il nuovo elemento prenotazione nell'array
                    nomeHotel: hotel[i].nomeHotel,
                    dataArrivo: hotel[i].prenotazioni[j].dataArrivo,
                    dataPartenza: hotel[i].prenotazioni[j].dataPartenza,
                    mailUtente: hotel[i].prenotazioni[j].emailUtente,
                    prezzoTotale: Number(hotel[i].prezzo * hotel[i].prenotazioni[j].giorniTotali),
                    cittaHotel: hotel[i].citta , 
                    viaHotel: hotel[i].via , 
                    descrizioneHotel: hotel[i].descrizione
                });
            }
        }
    }
    return datiFormattati; }                                                                                  //Ritorno il vettore con le prenotazioni
module.exports = listaPrenotazioni                                                                            //Esporto il metodo