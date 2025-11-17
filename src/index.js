import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
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

app.post(
  "/user/signup",
  /* 
    #swagger.tags = ['User']
    #swagger.summary = '회원가입'
    #swagger.description = '필수 정보와 선호 카테고리를 받아 신규 회원을 생성합니다.'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "password", "name", "gender", "birth", "phoneNumber", "preferences"],
            properties: {
              email: { type: "string", format: "email", example: "user@example.com" },
              password: { type: "string", example: "P@ssw0rd!" },
              name: { type: "string", example: "홍길동" },
              gender: { type: "string", example: "MALE" },
              birth: { type: "string", format: "date", example: "1999-01-01" },
              address: { type: "string", example: "서울시 강남구" },
              detailAddress: { type: "string", example: "101-202" },
              phoneNumber: { type: "string", example: "010-1234-5678" },
              preferences: {
                type: "array",
                items: { type: "integer", example: 1 },
                description: "선호 음식 카테고리 ID 배열"
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: "회원가입 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: { type: "boolean", example: true },
              code: { type: "integer", example: 200 },
              message: { type: "string", example: "회원가입이 완료되었습니다." },
              data: {
                type: "object",
                properties: {
                  access_token: { type: "string", example: "Bearer access-token" },
                  refresh_token: { type: "string", example: "Bearer refresh-token" },
                  profile: {
                    type: "object",
                    properties: {
                      email: { type: "string", example: "user@example.com" },
                      name: { type: "string", example: "홍길동" },
                      preferCategory: {
                        type: "array",
                        items: { type: "string" },
                        example: ["한식", "중식"]
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  */
  handlerUserSignUp
);

app.post("/mypage/addStore", handlerStoreAppend);
app.post("/review/addReview", handlerReviewAppend);
app.post("/store/addMission", handlerMissionAppend);
app.get("/store/:storeId/reviews", handlerListStoreReviews);
app.get("/store/:storeId/missions", handlerListStoreMissions);
app.get("/review/my", handlerListMyReviews);
app.post("/mission/challenge", handlerMissionChallenge);
app.get("/mission/active", handlerListActiveMissions);
app.patch("/mission/active/:assignmentId/complete", handlerCompleteMission);

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 9th",
      description: "UMC 9th Node.js 테스트 프로젝트입니다.",
    },
    host: "localhost:3000",
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});


app.use((req, res, next) => {
  next(new NotFoundError("요청한 API 엔드포인트를 찾을 수 없습니다."));
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
