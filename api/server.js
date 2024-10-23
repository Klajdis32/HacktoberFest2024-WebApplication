import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";
import authRoute from "./routes/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    charset: 'utf8mb4',
});

// Σύνδεση με MySQL και δημιουργία βάσης και πίνακα αν δεν υπάρχουν
db.connect((err) => {
    if (err) {
        console.error("Database connection failed: ", err.stack);
        return;
    }
    console.log("Connected to database!");

    // Δημιουργία βάσης δεδομένων αν δεν υπάρχει
    const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;
    db.query(createDatabaseQuery, (err) => {
        if (err) {
            console.error("Failed to create database: ", err.stack);
            return;
        }
        console.log(`Database '${process.env.DB_NAME}' checked or created.`);

        // Επιλέγουμε τη βάση δεδομένων
        db.changeUser({ database: process.env.DB_NAME }, (err) => {
            if (err) {
                console.error("Failed to select database: ", err.stack);
                return;
            }

            // Δημιουργία του πίνακα "regist" αν δεν υπάρχει
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS regist (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(50) NOT NULL,
                    lastname VARCHAR(50) NOT NULL,
                    gitlabId VARCHAR(255) NOT NULL,
                    kaggleId VARCHAR(50) NOT NULL,
                    gender ENUM('male', 'female', 'non-binary', 'other') DEFAULT NULL,
                    dateOfBirth DATE DEFAULT NULL,
                    bio TEXT DEFAULT NULL,
                    interest VARCHAR(50) DEFAULT NULL,
                    registerDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;
            db.query(createTableQuery, (err) => {
                if (err) {
                    console.error("Failed to create table 'regist': ", err.stack);
                    return;
                }
                console.log("Table 'regist' checked or created.");
            });
        });
    });
});

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

app.use("/api/auth", authRoute);

app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});

export default db;
