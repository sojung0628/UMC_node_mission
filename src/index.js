import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { prisma } from "./configs/db.config.js";
import { handlerUserSignUp } from "./controllers/user.controller.js";
import {
  handlerListStoreMissions,
  handlerListStoreReviews,
  handlerStoreAppend,
  handlerMissionAppend,
} from "./controllers/store.controller.js";
import { handlerListMyReviews, handlerReviewAppend } from "./controllers/review.controller.js";
import {
  handlerCompleteMission,
  handlerListActiveMissions,
  handlerMissionChallenge,
} from "./controllers/mission.controller.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { requireAuth } from "./middlewares/auth.middleware.js";
import { sendSuccess } from "./utils/response.js";
import { NotFoundError } from "./utils/errors.js";
import passport from "passport";
import { googleStrategy, jwtStrategy } from "./auth.config.js";

dotenv.config();

passport.use(googleStrategy);
passport.use(jwtStrategy); 

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public")); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.get(
  "/",
  (req, res) => {
    sendSuccess(res, { message: "UMC playground", data: null });
  }
);

app.post("/user/signup", handlerUserSignUp);
app.post("/mypage/addStore",requireAuth,handlerStoreAppend);
app.post("/review/addReview", requireAuth, handlerReviewAppend);
app.post("/store/addMission", requireAuth, handlerMissionAppend);
app.get("/store/:storeId/reviews", handlerListStoreReviews);
app.get("/store/:storeId/missions", handlerListStoreMissions);
app.get("/review/my", requireAuth, handlerListMyReviews);
app.post("/mission/challenge", requireAuth, handlerMissionChallenge);
app.get("/mission/active", requireAuth, handlerListActiveMissions);
app.patch("/mission/active/:assignmentId/complete", requireAuth, handlerCompleteMission);

app.get("/oauth2/login/google", 
  passport.authenticate("google", { 
    session: false 
  })
);
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
	  session: false,
    failureRedirect: "/login-failed",
  }),
  (req, res) => {
    const tokens = req.user; 

    res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: {
          message: "Google 로그인 성공!",
          tokens: tokens, // { "accessToken": "...", "refreshToken": "..." }
      }
    });
  }
);

app.use((req, res, next) => {
  next(new NotFoundError("요청하신 API 엔드포인트를 찾을 수 없습니다."));
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


