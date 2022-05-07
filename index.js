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

        // Insert Product =====================================================
        app.post('/product', async(req, res)=>{
            const newProduct = req.body;
            // console.log('adding new product');
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        // Delete Product =====================================================
        app.delete('/product/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);

        } )
        // Display Update a Product =============================
        app.get('/edit/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = productCollection.findOne(query);
            res.send(result);
        })

        // Update a Product =============================
        app.put('/product/:id', async(req,res) =>{
            const id = req.params.id;
            const editedProduct = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updatedDoc = {
                $set:{
                    name: editedProduct.name,
                    img: editedProduct.img,
                    description: editedProduct.description,
                    quantity: editedProduct.quantity,
                    supplier: editedProduct.supplier,
                    email: editedProduct.email
                }
            }
            const result = await productCollection.updateOne(filter, updatedDoc, options)
            res.send(result);
        })

        // Delivery a Product==================================
        app.patch('/product/:id', async(req,res)=>{
            const id = req.params.id;
            const updateData = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updateData.productQuantity
                }
            }
            const result = await productCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        });


        app.get('/product/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        })
// My Items=============================================
        app.get('/my-items', async(req, res) => {
            const email = req.query.email;
            // console.log(email);
            const query = {email: email};
            const cursor = productCollection.find(query);
            const myItems = await cursor.toArray();
            res.send(myItems);
        })

     // Delete Product on My Item =====================================================
     app.delete('/my-items/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await productCollection.deleteOne(query);
        res.send(result);

    } )
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