const express = require('express')
const cors = require('cors')
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());









app.get('/', (req, res) => {
    res.send('online group stuhdy server is running')
})

app.listen(port, () => {
    console.log(`online group stuhdy server is running on PORT: ${port}`);
})