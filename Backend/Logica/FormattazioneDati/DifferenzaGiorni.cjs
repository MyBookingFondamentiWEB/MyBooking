//CALCOLO LA DIFFERENZA DI GIORNI 
function differenzaGiorni( dataArrivo , dataPartenza ) {

    //CALCOLO IL VALORE NUMERICO DELLE DATE 
    let val1 = Number(dataArrivo.slice(0 , 4)) * 365 + Number(dataArrivo.slice(5 , 7)) * 31 + Number(dataArrivo.slice(8 , ))
    let val2 = Number(dataPartenza.slice(0 , 4)) * 365 + Number(dataPartenza.slice(5 , 7)) * 31 + Number(dataPartenza.slice(8 , ))

    let rangeDay = val2 - val1                                                                                                          //Differenza numerica fra le date 
    return rangeDay;
}
module.exports = differenzaGiorni;