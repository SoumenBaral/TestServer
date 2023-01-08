const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000
require('dotenv').config()
const http = require('http')
const server = http.createServer(app)

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://dbJohn1:pAseCqEhWdUhLDsE@cluster0.feltfbk.mongodb.net/?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.feltfbk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const ProductCollection = client.db("Ema-john").collection("Products");
        app.get('/products', async (req, res) => {
            console.log('query', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = ProductCollection.find(query)

            let products;
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray()

            }
            else {
                products = await cursor.toArray()

            }
            res.send(products)


        })
        app.get('/productCount', async (req, res) => {

            const count = await ProductCollection.estimatedDocumentCount()
            res.send({ count })
        })

        //Use post to Get Products By Id 

        app.post('/productByKeys', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id))
            const query = { _id: { $in: ids } }
            const cursor = ProductCollection.find(query)
            const products = await cursor.toArray()
            console.log(keys);
            res.send(products)
        })
    }
    finally { }
}
run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send('I am from Express')
})
app.listen(port, () => {
    console.log('John is running on Port', port)
})