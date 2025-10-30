import { config } from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDb } from "./db.js";
import serverless from "serverless-http";

config();
// console.log(process.env.MONGODB_URI);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uri = process.env.MONGODB_URI;

(async () => {
  let year = new Date().getFullYear();
  const dbName = `halloweenDB_${year}`;
  const collectionName = "families";

  const collection = await connectToDb(uri, dbName, collectionName);

  app.get("/.netlify/functions/index", async (req, res) => {
    try {
      const families = await collection.find({}).toArray();
      res.json(families);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  });

  app.post("/.netlify/functions/submit", async (req, res) => {
    console.log("Received data:", req.body);
    // res.json({ message: 'Data received!', data: req.body });

    const familyData = req.body;
    try {
      await collection.insertOne(familyData); // insert data directly
      res.json({ message: "Family added!", data: familyData });
    } catch (err) {
      res.status(500).json({ error: "Failed to insert data" });
    }
  });
})();

// Wrap the Express app with serverless-http
const handler = serverless(app);

// Export the handler for Netlify
export { handler };
