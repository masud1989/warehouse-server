require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//Middleware==================================
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('Server is Running from 5000 port..');
});

app.get('/other-page', (req, res) => {
    res.send('This is other page from Server');
});

app.listen(port, () =>{
    console.log('Server is Running on port', port);
});