// require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const CryptoJS = require('crypto-js');
const dotenv = require("dotenv");
const path=require('path');

const app=express();
const PORT= 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

// add api

app.get('/api/comics', async(req,res) =>{
    try{

        const publickey = process.env.MARVEL_PUBLIC_KEY;
        const privatekey = process.env.MARVEL_PRIVATE_KEY;
        
        if(!publickey || !privatekey){
            return res.status(500).json({ error: 'API keys are not set in .env file'});
        }

        const ts = new Date().getTime().toString();
        const hash = CryptoJS.MD5(ts + privatekey + publickey).toString();

        const marvelApiUrl = `https://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${publickey}&hash=${hash}`;

        const response = await axios.get(marvelApiUrl);

        
        
        res.json(response.data);
        
    } catch(error){
        console.error("Error fetching from Marvel API:", error.message);
        res.status(500).json({error: 'Failed to fetch data from Marvel APi'})
    }
});

//  database connect and storing 

mongoose.connect('mongodb://127.0.0.1:27017/students');
const db = mongoose.connection;
db.once('open',()=>{
    console.log('Mongodb connection  succesfull');
});

// hash user password
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema({
    fullname:String,
    email:String,
    username:String,
    password:String,
    confirm_password:String

});

const Users = mongoose.model("data",userSchema);



app.post('/post',async(req,res)=>{
    
    try{
        const{fullname,email,username,password,confirm_password} = req.body;
        const saltrounds = 10;
        const hashpassword = (await bcrypt.hash(password,saltrounds)).toString();
    const user = new Users({
        fullname,
        email,
        username,
        password:hashpassword,
        confirm_password
    })
    await user.save();

    console.log(user);

    res.send('signup succesfull');
    } catch(error){
        console.error("Error saving user:", error.message);
        res.status(500).send('Error while signing up ');

    }
});


app.listen(PORT,()=>{
    console.log(`app is listening on http://localhost:${PORT}`);
});


app.use((req,res)=>{
    res.status(404);
    res.send(`<h2>Page is not found</h2>`);
});