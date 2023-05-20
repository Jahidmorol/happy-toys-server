const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// midlewere
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.bu34nfl.mongodb.net/?retryWrites=true&w=majority`;

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

    const animalToyCollection = client.db("happyToys").collection("animalToys");

    app.get("/alltoys", async (req, res) => {
      const result = await animalToyCollection.find().limit(20).toArray();
      res.send(result);
    });

    app.get("/toycategory/:category", async (req, res) => {
      const category = req.params.category;
      const query = { subCategory: category };
      const result = await animalToyCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/searchbyname/:toyname", async (req, res) => {
      const toyName = req.params.toyname;
      const filter = { toyName: { $regex: toyName } };
      const result = await animalToyCollection.find(filter).toArray();
      res.send(result);
    });

    app.get("/toydetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await animalToyCollection.findOne(query);
      res.send(result);
    });

    app.post("/addatoy", async (req, res) => {
      const newToy = req.body;
      const result = await animalToyCollection.insertOne(newToy);
      res.send(result);
    });

    // my toys
    app.get("/mytoys", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { sellerEmail: req.query.email };
      }
      const result = await animalToyCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/mytoys/:sortType", async (req, res) => {
      const sortType = req.params.sortType;
      let query = {};
      if (req.query?.email) {
        query = { sellerEmail: req.query.email };
      }
      const result = await animalToyCollection
        .find(query)
        .sort({ price: sortType === "ascending" ? 1 : -1 })
        .toArray();
      res.send(result);
    });

    app.get("/mytoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await animalToyCollection.findOne(query);
      res.send(result);
    });

    app.delete("/mytoys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await animalToyCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/mytoys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const toys = req.body;
      const updateDoc = {
        $set: {
          price: toys.price,
          availableQuantity: toys.availableQuantity,
          description: toys.description,
        },
      };
      const result = await animalToyCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Happy Toys server is Running");
});

app.listen(port, () => {
  console.log(`Happy Toys server is Runnign on port: ${port}`);
});
