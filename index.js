require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//Middleware==================================
app.use(cors());
app.use(express.json());


//DB Connection===============================
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ergjf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//Select Data from DB
async function run(){
    try{
        await client.connect();
        const productCollection = client.db('inventory').collection('product');

        app.get('/product', async(req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.post('/product', async(req, res)=>{
            const newProduct = req.body;
            console.log('adding new product');
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        app.get('/product/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId};
            const product = await productCollection.findOne(query);
            res.send(product);
        })
    }
    finally{

    }

}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Server is Running from 5000 port..');
});

app.get('/other-page', (req, res) => {
    res.send('This is other page from Server');
});

app.listen(port, () =>{
    console.log('Server is Running on port', port);
});