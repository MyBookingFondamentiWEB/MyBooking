///////REQUIRE TOKEN E COOKIE/////
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');  


const express = require("express");
const app = express();

app.use(cookieParser());


const JWT_SECRET1 = 'segreto-user';                                                                                                     //Firma segreta utenti
const JWT_SECRET2 = 'segreto-host';






const connectDB = require("./server.cjs");
const verificaUser = require('./Logica/Verifiche/verificaUser.cjs')
const verificaHost = require('./Logica/Verifiche/verificaHost.cjs')
const calendarGeneration = require("./Logica/FormattazioneDati/calendarCreation.cjs")
const cors = require("cors");
const port = 3000;
const portFrontend = 5173;


app.use(cors({
    origin: `http://localhost:${portFrontend}`,
    credentials: true  // necessario per inviare cookie dal frontend
}));


app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});










//IMPORT DEI ROUTING 
const routingRecensione = require('./Routing/RoutingRecensione.cjs')              
const routingHotel = require('./Routing/RoutingHotel.cjs')
const routingPrenotazione = require('./Routing/RoutingPrenotazione.cjs')
const routingUtente = require('./Routing/RoutingUtenti.cjs')


////SCHEMI
const userModel = require("./Models/userModel.cjs")
const hotelModel = require("./Models/hotelModel.cjs")
const hostModel = require("./Models/hostModel.cjs")



app.use(express.json());     //mi serve per leggere correttamente il "req.body"

connectDB();




app.use( '/recensione' , routingRecensione)
app.use( '/hotel' , routingHotel)                                                               //Filtraggio degli hotel in base alla ricerca                                                                         
app.use( '/prenotazione' , routingPrenotazione)                                                 //Gestione delle prenotazioni
app.use( '/utente' , routingUtente)














app.get("/gestioneStrutture", async(req, res) => {   //mi permette di visualizzare le strutture dentro a GestioneStruttura.jsx
    const response = await hotelModel.find()
    return res.json({items : response})
})





app.get("/visualizzaRecensioni/:id_hotel", async (req, res) => {
    const id = req.params.id_hotel;

    try {
        
        const hotel = await hotelModel.findById(id);

        if (!hotel) {
            return res.status(404).json({ error: "Hotel non trovato" });
        }

        const recensioni = hotel.recensioni || [];

        res.json({ recensioni });

    } catch (err) {
        console.error("Errore durante la ricerca delle recensioni:", err);
        res.status(500).json({ error: "Errore del server" });
    }
});








app.get("/visualizzaLeTuePrenotazioni/:emailUser", async (req, res) => {
    const emailUtente = req.params.emailUser;

    try {
        const hotelPrenotati = await hotelModel.find({ "prenotazioni.emailUtente": emailUtente });

        const prenotazioniUtente = [];     //istanzio un array vuoto

        hotelPrenotati.forEach(hotel => {                          //scorro i vari hotel
            hotel.prenotazioni.forEach(p => {                       // scorro l'array delle prenotazioni del singolo hotel
                if (p.emailUtente === emailUtente) {                // mi chiedo se la mail della prenotazione che ho trovato corrisponde alla mail dell'utente che ho passato
                    prenotazioniUtente.push({                           //con la push inserisco dentro l'array tutti i parametri trovati
                        nome_hotel: hotel.nome_hotel,
                        img: hotel.img,
                        via: hotel.via,
                        citta: hotel.citta,
                        dataArrivo: p.dataArrivo,
                        dataPartenza: p.dataPartenza,
                        prezzo: p.prezzo,
                        giorniTotali: p.giorniTotali,
                        idHotel: hotel._id
                    });
                }
            });
        });

        res.json({ items: prenotazioniUtente });     //invio l'array che continene gli hotel con i parametri che ho definito

    } catch (err) {
        console.error("Errore durante la ricerca delle prenotazioni:", err);
        res.status(500).json({ error: "Errore del server" });
    }
})






app.get("/visualizzaInfoUtente/:emailUser", async(req, res) => {   //mi permette di visualizzare le strutture dentro a GestioneStruttura.jsx
    const emailUtente = req.params.emailUser;    // recupero l'email dell'utente attualmente loggato
    const response = await userModel.findOne({ email: emailUtente });
    return res.json({oggettoUtente : response})
})






app.delete("/hotel/:id", async (req, res) => {
    const _id = req.params.id;    //recupero l'id dal corpo della richiesta
    try{
        const result = await hotelModel.findByIdAndDelete(_id);
        res.json({message: "Hotel eliminato con successo!"});
    }catch(err){
        res.status(500).json({message: err.message});
    }
})











app.post('/registrazione/proprietarioStruttura', async (req, res) => {
    try {

        const email = req.body.email;

        const esisteUtente = await hostModel.findOne({ email });
        if (esisteUtente) {
            return res.status(400).json({ error: 'Email già registrata' });
        }
        const form = req.body;

        // Crea nuova Proprietrario di Struttura con password hashata
        const newHost = new hostModel({
            nome: form.nome,
            email: form.email,
            telefono: form.telefono,
            password: form.password,
        });


        await newHost.save();

        res.status(201).json({ message: 'Proprietario registrato con successo!', });


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Errore nella registrazione' });
    }
})










app.post('/profilo/aggiungiStruttura', async (req, res) => {
    try {

        const form = req.body;

        // Crea nuova Proprietrario di Struttura con password hashata
        const newStruttura = new hotelModel({
            nome_hotel: form.nomeStruttura,
            citta: form.citta,
            via: form.via,
            descrizione: form.descrizione,
            prezzo_a_notte: form.prezzo_a_notte,
            n_ospiti: form.n_ospiti,
            calendario: calendarGeneration , 
            recensioni: [] , 
            prenotazioni: []

        });


        await newStruttura.save();

        res.status(201).json({ message: 'Struttura registrata con successo!', });


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore nell'inserimento della Struttura" });
    }
})










app.post("/registrazione/utente", async (req, res) => {            //per REGISTRARE l'utente
    try{

        console.log("Dati ricevuti dal client:", req.body); 

        const {nome, cognome, email, password, genere, dataNascita} = req.body;
        

        if(!dataNascita){
            return res.status(400).json({ error: "Data di nascita mancante" });    
        }

        const newUser = new userModel({ nome, cognome, email, password, genere, dataNascita });
        await newUser.save();


        console.log("Utente creato!");
        res.status(200).json({ message: "Utente creato!"});
        




    }catch(err){

        if (err.name === "ValidationError") {
            return res.status(400).json({ error: "Email non valida, insierirne una appropriata!" });
        }

        if (err.code === 11000) {
            return res.status(400).json({ error: "Email già registrata!" });
        }



        console.error("Errore nel server, Errore 500:", err);
        res.status(500).json({ error: "Errore del server, Errore 500" });
    }
})







app.put("/modifica_hotel/:id", async (req, res) => {            //per MODIFICARE l'utente
    try{
        const _id = req.params.id;

        const {nome_hotel, citta, via, descrizione, prezzo_a_notte, n_ospiti, img} = req.body;
        
        

        const updateHotel = await hotelModel.findByIdAndUpdate(
            _id,
            {nome_hotel, citta, via, descrizione, prezzo_a_notte, n_ospiti, img},
            {new: true} //mi restituisce il documento con la modifica effettuata da MongoDB
        )


        console.log("Modifica effettuata!");
        res.status(200).json({ message: "Modifica effettuata!"});
        




    }catch(err){
        console.error("Errore nel server, Errore 500:", err);
        res.status(500).json({ error: "Errore del server, Errore 500" });
    }
})






app.put("/aggiungiFeedback", async (req, res) => {                                  // Aggiungo la Rercensione
    try {
        const { _id, voto, corpoRecensione, nomeUtente, emailUtente } = req.body;

        const hotel = await hotelModel.findById(_id);

        const recensioneEsistente = hotel.recensioni.find(
            (rec) => rec.emailUtente === emailUtente
        );

        if (recensioneEsistente) {
            return res.status(400).json({
                error: "Hai già recensito questa struttura!",
            });
        }

        const nuovaRecensione = {
            nomeUtente,
            voto,
            corpoRecensione,
            emailUtente
        };

        const updateHotelRecensione = await hotelModel.findByIdAndUpdate(
            _id,
            { $push: { recensioni: nuovaRecensione } },   // utilizzo la push perché si tratta di un array annidato dentro hotel
            { new: true }
        );

        if (!updateHotelRecensione) {
            return res.status(404).json({ error: "Hotel non trovato" });
        }

        console.log("Recensione aggiunta!");
        res.status(200).json({ message: "Recensione aggiunta con successo", hotel: updateHotelRecensione });
        
    } catch (err) {
        console.error("Errore nel server, Errore 500:", err);
        res.status(500).json({ error: "Errore del server, Errore 500" });
    }
});



























///////////////////////LOGIN//////////////////////////////////////////////////






app.post( '/loginUtente' , async ( req , res )=> {               //Login Utente normale 
    const { emailUtente , passwordUtente } = req.body                   // recupero i valori inviati da axios di email e password dell'utente

    console.log(`\Backend - Informazioni Login UTENTE:\n-Email: ${emailUtente}\n-Password: ${passwordUtente}`)      // li stampo per essere sicuro che siano quelli

    const exitCode = await verificaUser(emailUtente , passwordUtente)          //eseguo la verifica dell'utente tramite modulo js esterno

    switch ( exitCode ) {
        case 0:
            console.log(`\nSpecificare Email e Password`)
            res.status(200).json( {message: "Specificare Email e Password"} );
            return;

        case 1: 
            console.log(`\nEmail non esistente`)
            res.status(200).json( {message:"Email non esistente" } );
            return;

        case 2: 
            console.log(`\nEmail o Password errati`)
            res.status(200).json( {message: "Email o Password errati"} );
            return;

        case 3: 

            const token = jwt.sign({emailUtente: emailUtente}, JWT_SECRET1, {expiresIn: "1h"})
            res.cookie("token", token, 
                        {                                          //Invio il token nel cookie
                            httpOnly: true,  
                            secure: false,                         // true in produzione con HTTPS
                            sameSite: 'lax',
                            maxAge: 3600000
                        }
            )
            console.log("COOKIE TOKEN RICEVUTO:", token);


            console.log(`\nBackend - Utente Loggato UTENTE`)
            res.status(200).json( {message: "UTENTE Loggato"} );
            return;

        default: 
            res.status(500)
    }
})




app.post( '/loginHost' , async ( req , res ) => {                                                                               //Login Host
    const { emailUtente , passwordUtente } = req.body                                                                           //Prelevo i dati del login 

    console.log(`\Backend - Informazioni Login HOST:\n-Email: ${emailUtente}\n-Password: ${passwordUtente}`)      // li stampo per essere sicuro che siano quelli

    const exitCode = await verificaHost ( emailUtente , passwordUtente)

    switch ( exitCode) {
        case 0:
            console.log(`\nSpecificare Email e Password`)
            res.status(200).json( {message: "Specificare Email e Password"} );
            return;

        case 1: 
            console.log(`\nEmail non esistente`)
            res.status(200).json( {message:"Email non esistente" } );
            return;

        case 2: 
            console.log(`\nEmail o Password errati`)
            res.status(200).json( {message: "Email o Password errati"} );
            return;

        case 3: 
            
            const token = jwt.sign({emailUtente: emailUtente}, JWT_SECRET2, {expiresIn: "1h"})
            res.cookie("token", token, 
                        {                                          //Invio il token nel cookie
                            httpOnly: true,  
                            secure: false,                         // true in produzione con HTTPS
                            sameSite: 'lax',
                            maxAge: 3600000
                        }
            )
            console.log("COOKIE TOKEN RICEVUTO:", token);


            console.log(`\nBackend - Utente Loggato HOST`)
            res.status(200).json( {message: "HOST Loggato"} );
            return;

        default: 
            res.status(500)
    }
})





/////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////GESTIONE TOKEN E COOKIE///////////////////////////////////////


app.get('/EmailTokenUtente', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Token non trovato' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET1);  // Prova come utente
    return res.status(200).json({ emailUtente: payload.emailUtente, ruolo: "utente" });
  } catch (err1) {
    try {
      const payload = jwt.verify(token, JWT_SECRET2);  // Prova come host
      return res.status(200).json({ emailUtente: payload.emailUtente, ruolo: "host" });
    } catch (err2) {
      return res.status(401).json({ error: 'Token non valido o scaduto' });
    }
  }
});





app.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,     
        sameSite: 'lax'
    });
    res.status(200).json({ message: 'Logout effettuato con successo' });
});






app.post('/firstRenderAuthentication' , ( req , res ) => {

    const token = req.cookies.token;

    console.log("Mi trovo qui!!!!")

    if( !token ){
        //TOKEN NON ANCORA CREATO
        res.status(200).json({message: "Nessun Token Esistente"})
        return;
    }
    try{
        const User = jwt.verify( token , JWT_SECRET1 )
        if(User){
            //LOGGATO COME UTENTE
            res.status(200).json( {message: "TOKEN - Loggato come Utente" , User: User} )
            return;
        }
    } catch(error1){
        try{
            const Host = jwt.verify( token , JWT_SECRET2 )
            if(Host){
                //LOGGATO COME HOST
                res.status(200).json( {message: "TOKEN - Loggato come Host" , Host: Host} )
                return;
            }
        } catch(error2){
            res.status(200).json( {message: "Errore nella fase di autenticazione"} )
            return;
        }
    }
})










//////////////////////////////////////////////////////////////////////////////



app.listen(port, () => {
    console.log("Sito in esecuzione!");
})




