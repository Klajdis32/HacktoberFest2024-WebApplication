import express from "express";
import {  register } from "../controllers/auth.js";
import { getAllColumnsFromRegist } from "../controllers/auth.js";

const router = express.Router();

router.post("/register", register);
router.get("/getparticipants", getAllColumnsFromRegist);

export default router;