import express from "express";
import cors from "cors";
import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";
dotenv.config();

// const { Pool } = require("pg"); // PostgreSQL client library
// const dotenv = require("dotenv"); // Module for loading environment variables from a .env file
// import { Pool } from "pg";



const app = express();
app.use(cors());
app.use(express.json());

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

// app.get("/books", async (req, res) => {
//   try {
//     const client = await pool.connect();
//     const result = await client.query("SELECT * FROM books");
//     client.release();
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


//POST 
app.post("/books", async(req, res) => {
  try {
    const { title, description } = req.body;
    const query ="INSERT INTO books (title, description) VALUES ($1, $2) RETURNING *";
    const values = [title, description]; 
    const result = await pool.query(query, values); 
    const newBook = result.rows[0]; 

    res.status(201).json(newBook); 
  } catch (error) {
    console.error("Error creating book:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the book" }); 
  
  }
  
});



app.listen (port, () => {
    console.log(`connected to ${port}`)
})