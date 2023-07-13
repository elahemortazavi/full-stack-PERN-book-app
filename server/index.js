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

// Handling DELETE request for the "/books/:id" path
app.delete("/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id; // Extracting the value of the "id" path parameter from the request URL

    const query = "DELETE FROM books WHERE id = $1 RETURNING *"; // Constructing the SQL query with parameter placeholders
    const values = [bookId]; // Binding the parameter value to be used in the query
    const result = await pool.query(query, values); // Executing the query with the provided value
    const deletedBook = result.rows[0]; // Extracting the deleted book from the query result

    if (deletedBook) {
      res.json(deletedBook); // Sending the deleted book as a JSON response
    } else {
      res.status(404).json({ message: "Book not found" }); // Sending a 404 (Not Found) response if the book was not found
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the book" }); // Sending an error response if an exception occurs
  }
});

// Handling PUT request for the "/books/:id" path

app.put("/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, description } = req.body;
    const query = "UPDATE books SET title = $1, description = $2 WHERE id = $3";
    const values = [title, description, bookId];
    await pool.query(query, values);

    res.json({ message: "Book updated successfully" });
  } catch (error) {
    console.error("Error updating book:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the book" });
  }
});



app.listen (port, () => {
    console.log(`connected to ${port}`)
})