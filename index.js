const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.98p3czt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        //creat databse file name
        const asignmentsCollection = client.db('asignmentDB').collection('asignments');
        const myAsignmentsCollection = client.db('asignmentDB').collection('myAsignments');




        // get products data to the database
        app.get('/asignments', async (req, res) => {
            const result = await asignmentsCollection.find().toArray();
            res.send(result)
        })

        // find a single data 
        app.get('/asignments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await asignmentsCollection.findOne(query)
            res.send(result)
        })







        // Add product store to the database
        app.post('/asignments', async (req, res) => {
            const newAsignment = req.body;
            // console.log(newAsignment);
            const result = await asignmentsCollection.insertOne(newAsignment)
            res.send(result)
        })


        // updated a document 

        app.put("/asignments/:id", async (req, res) => {
            const id = req.params.id;
            const updatedAsignment = req.body;
            // console.log("id", id, updatedProduct);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            // title, description,email, marks, due, level, photo

            const product = {
                $set: {

                    title: updatedAsignment.title,
                    description: updatedAsignment.description,
                    email: updatedAsignment.email,
                    marks: updatedAsignment.marks,
                    due: updatedAsignment.due,
                    level: updatedAsignment.level,
                    photo: updatedAsignment.photo
                },
            };
            const result = await asignmentsCollection.updateOne(
                filter,
                product,
                options
            );
            res.send(result);
        });

        //handle my asignment data 

        // get data to the database
        app.get('/myAsignments', async (req, res) => {
            // console.log(req.query.email);
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await myAsignmentsCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/myAsignments', async (req, res) => {
            const myAsignments = req.body;
            console.log(myAsignments);
            const result = await myAsignmentsCollection.insertOne(myAsignments)
            res.send(result)
        })

        // delet a asignment by delete operation
        app.delete('/asignments/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(`Deleting item with ID: ${id}`);
            const query = { _id: new ObjectId(id) }
            // const query = {_id: id}
            const result = await asignmentsCollection.deleteOne(query)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('online group stuhdy server is running')
})

app.listen(port, () => {
    console.log(`online group stuhdy server is running on PORT: ${port}`);
})