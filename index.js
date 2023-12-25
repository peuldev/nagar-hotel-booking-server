const express = require("express");
var cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.PORJECT_NAME}:${process.env.PORJECT_PASSWORD}@cluster0.hkb71gm.mongodb.net/?retryWrites=true&w=majority`;

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
    const rooms = client.db("Hotel_Rooms").collection("Rooms");
    const specialOffers = client.db("Special_Offers").collection("Offers");
    const featuredRoom = client.db("featured_Room").collection("featured");
    const confirmationroom = client.db("confirmation").collection("room");
    app.get("/rooms", async (req, res) => {
      const cursor = rooms.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/rooms/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await rooms.findOne(query);
      res.send(result);
    });

    app.get("/offers", async (req, res) => {
      const cursor = specialOffers.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/offers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await specialOffers.findOne(query);
      res.send(result);
    });
    app.get("/featured", async (req, res) => {
      const cursor = featuredRoom.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/featured/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await featuredRoom.findOne(query);
      res.send(result);
    });

    app.get("/confirmation", async (req, res) => {
      let query = {};
      if (req.query) {
        query = { email: req.query.email };
      }
      const result = await confirmationroom.find(query).toArray();
      res.send(result);
    });

    // checkout
    app.post("/confirmation", async (req, res) => {
      const confirmation = req.body;
      console.log(confirmation);
      const result = await confirmationroom.insertOne(confirmation);
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
  res.send("Nagar-Hotel-Booking");
});

app.listen(port, () => {
  console.log(`Nagar-Hotel-Booking Runing ${port}`);
});
