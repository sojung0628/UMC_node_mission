import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { sendSuccess } from "../utils/response.js";

export const handlerUserSignUp = asyncHandler(async (req, res) => {
    console.log("회원가입을 요청했습니다!");

    const user = await userSignUp(bodyToUser(req.body));

    sendSuccess(res, {
        message: "회원가입 요청이 완료되었습니다.",
        data: {
            access_token: `Bearer ${user.access_token}`,
            refresh_token: `Bearer ${user.refresh_token}`,
            profile: user.profile,
        },
    });
});
