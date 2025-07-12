function dateZeri( data ) {

    let anno = data.slice(0 , 4)

    let mese = data.slice(5 , 7)
    let meseNumero = Number(mese)

    if( meseNumero < 10 ){
        mese = mese.slice(1 , )
    }

    let giorno = data.slice(8 , )
    let giornoNumero = Number(giorno)

    if( giornoNumero < 10){
        giorno = giorno.slice(1 , )
    }

    const nuovaData = anno + "-" + mese + "-" + giorno

    console.log(nuovaData)
    return nuovaData;

}

module.exports = dateZeri;