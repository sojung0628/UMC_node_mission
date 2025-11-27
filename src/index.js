import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { handlerUserSignUp } from "./controllers/user.controller.js";
import { handlerListStoreMissions, handlerListStoreReviews, handlerStoreAppend, handlerMissionAppend } from "./controllers/store.controller.js";
import { handlerListMyReviews, handlerReviewAppend } from "./controllers/review.controller.js";
import { handlerCompleteMission, handlerListActiveMissions, handlerMissionChallenge } from "./controllers/mission.controller.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { sendSuccess } from "./utils/response.js";
import { NotFoundError } from "./utils/errors.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.get('/', (req, res) => {
  sendSuccess(res, { message: "UMC 플레이그라운드 API 입니다.", data: null });
});

app.post('/user/signup', handlerUserSignUp);

app.post("/mypage/addStore", handlerStoreAppend);
app.post("/review/addReview", handlerReviewAppend);
app.post("/store/addMission", handlerMissionAppend);
app.get("/store/:storeId/reviews", handlerListStoreReviews);
app.get("/store/:storeId/missions", handlerListStoreMissions);
app.get("/review/my", handlerListMyReviews);
app.post("/mission/challenge", handlerMissionChallenge);
app.get("/mission/active", handlerListActiveMissions);
app.patch("/mission/active/:assignmentId/complete", handlerCompleteMission);

app.use((req, res, next) => {
  next(new NotFoundError("요청한 API 엔드포인트를 찾을 수 없습니다."));
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
