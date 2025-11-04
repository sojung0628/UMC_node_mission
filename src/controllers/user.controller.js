import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handlerUserSignUp = async (req, res, next) => {
    console.log("회원가입을 요청했습니다!");
    
    const user = await userSignUp(bodyToUser(req.body));
    res.status(StatusCodes.OK).json({
        success: true,
        code: StatusCodes.OK,
        message: "회원가입 요청이 완료되었습니다.",
        data: {
            access_token: "Bearer " + user.access_token,
            refresh_token: "Bearer " + user.refresh_token
        }
    });
};