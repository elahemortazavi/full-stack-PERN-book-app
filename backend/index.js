import express from "express";
// const { Pool } = require("pg"); // PostgreSQL client library
// const dotenv = require("dotenv"); // Module for loading environment variables from a .env file
import pg from "pg";
const { Pool } = pg;

// import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = process.env.PORT || 8800;

// Database configuration
const pool = new Pool({
  connectionString: process.env.DB_URL, // Connection URL for connecting to the PostgreSQL database
  ssl: {
    rejectUnauthorized: true, 
  },
});

// app.get("/", (req, res) => {
//   res.json("hello");
// });

// GET root
app.get("/", (req, res) => {
  // Delete this line after you've confirmed your server is running
  res.send({ express: "Your Backend Service is Running" });
});



  // GET 
app.get("/books", async (req, res) => {
  try {
    const query = `SELECT * FROM books`;
    const result = await pool.query(query);
    const books = result.rows;
    res.json(books);
  } catch (error) {
    res.status(500).json({err: "fetching error"})
  }
  
});

app.listen (port, () => {
    console.log(`connected to ${port}`)
})