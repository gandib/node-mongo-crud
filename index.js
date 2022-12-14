const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// Use middleware
app.use(cors());
app.use(express.json());

//user: dbuser1
// password: XN1GXsuwEPqKjNwV



const uri = "mongodb+srv://dbuser1:XN1GXsuwEPqKjNwV@cluster0.l6erk8v.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("foodExpress").collection("user");
        // const user = { name: "Tanni Das", email: "tanni@gmail.com" };
        // const result = await userCollection.insertOne(user);
        // console.log(`User inserted with id ${result.insertedId}`)


        // get users
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        // POST user: add a new user
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log(newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });

        // updating user
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                },
            };
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });


        // delete a user
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = userCollection.deleteOne(query);
            res.send(result);
        });


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running node CRUD servere');
});

app.listen(port, () => {
    console.log('CRUD server is running');
});