import serverless from "serverless-http";
import express from "express";

const app = express();

app.get("/hello", (req, res) => res.send("hello"));

const handler = serverless(app);
export { handler };