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
    rejectUnauthorized: true, // Disabling SSL/TLS certificate verification (for development purposes only)
  },
});


app.listen (port, () => {
    console.log(`connected to ${port}`)
})