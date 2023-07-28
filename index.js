const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require('dotenv').config();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


const uri =
  `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster2.y3njyog.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log("database connection established");
    // Send a ping to confirm a successful connection
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });

    const productCollection = client.db("PcBuilder").collection("products");

    app.get("/products", async (req, res) => {
      try {
        const category = req.query.category; // Get the 'category' query parameter from the URL

        // If the 'category' query parameter is provided, use it to filter the data
        const query = category ? { category } : {}; // /products?category=CPU

        const result = productCollection.find(query);
        const products = await result.toArray();
        res.send(products);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
      }
    });

    app.get("/products/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await productCollection.findOne(query);

        if (result) {
          res.send(result);
        } else {
          res.status(404).send({ error: "Product not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
      }
    });
  } finally {
  }
}
run().catch((err) => console.log(err));
