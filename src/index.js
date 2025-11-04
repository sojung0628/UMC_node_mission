// const express = require('express')  // -> CommonJS
import cors from "cors";
import dotenv from "dotenv";
import express from "express";         // -> ES Module
import { handlerUserSignUp} from "./controllers/user.controller.js";
import { handlerStoreAppend, handlerMissionAppend } from "./controllers/store.controller.js";
import { handlerReviewAppend } from "./controllers/review.controller.js";
import { handlerMissionChallenge } from "./controllers/mission.controller.js";

dotenv.config();

const app = express()
const port = process.env.PORT;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/user/signup', handlerUserSignUp);

app.post("/mypage/addStore", handlerStoreAppend);
app.post("/review/addReview", handlerReviewAppend);
app.post("/store/addMission", handlerMissionAppend);
app.post("/mission/challenge", handlerMissionChallenge);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});