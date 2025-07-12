const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, "Nome obbligatorio!"],
        trim: true
    },
    cognome: {
        type: String,
        required: [true, "Cognome obbligatorio!"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email obbligatoria!"],
        unique: true,    //valore unico nel DB
        trim: true,   //rimozione spazi a inizio e fine del campo
        lowercase: true,  //conversione di tutti i valori inseriti in minuscolo
        match: [/\S+@\S+\.\S+/, "L'email non è valida"]
    },
    password: {
        type: String,
        required: [true, "Password obbligatoria!"]
    },
    dataNascita: {
        type: Date,
        required: [true, "Inserire data di nascita!"]
    },
    genere: {
        type: String,
        trim: true
    }
});



userSchema.pre("save", async function (next) {
    if(!this.isModified("password")){
        return next();
    }

    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }catch(err){
        next(err);
    }
})





module.exports = mongoose.model("User", userSchema);