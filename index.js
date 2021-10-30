const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gwxst.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();

        const database = client.db('tourism_site');
        const destinationCollection = database.collection('destinations');
        const bookingCollection = database.collection('bookings');

        //GET API
        app.get('/destinations', async(req, res) => {
            const cursor = destinationCollection.find({});
            const destinations = await cursor.toArray();
            res.send(destinations);
        })

        //GET API byId
        app.get('/booking/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const destination = await destinationCollection.findOne(query);
            res.send(destination);
        })

        //GET API byEmail
        app.get('/bookings/:email', async(req, res) => {
            const email = req.params.email;
            const query = {email: email};
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        })

        //GET API for all bookings
        app.get('/bookings', async(req, res) => {
            const cursor = bookingCollection.find({});
            const result = await cursor.toArray();
            res.send(result); 
        })

        //POST API for Add Destination
        app.post('/destinations', async(req, res) => {
            const destination = req.body;
            const result = await destinationCollection.insertOne(destination);
            res.send(result);
        })

        //POST API
        app.post('/bookings', async(req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })

        //UPDATE API
        app.put('/bookings/:id', async(req, res) => {
            const id = req.params.id;
            const filter = {_id:ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  status: 'Approved'
                },
              };
              const result = await bookingCollection.updateOne(filter, updateDoc, options);
              res.send(result)
;        })

        //DELETE API
        app.delete('/bookings/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await bookingCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tour De Server is Running')
})

app.listen(port, () => {
    console.log('Tour De Server Running on Port', port)
})