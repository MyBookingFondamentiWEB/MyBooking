//CREO LA DATA
function dateJS ( date ) {                                                                                              //Passo un valore e creo una variabile di tipo data 

    //PRELEVO ANNO - MESE - GIORNO DA 'date'
    let year = Number(date.slice( 0 , 4))
    let month = Number(date.slice( 5 , 7))
    let day = Number(date.slice( 8 , ))

    let newDate = new Date(year , month - 1, day)                                                                       //Creo una data con quelle informazioni

    return newDate;
}
module.exports = dateJS