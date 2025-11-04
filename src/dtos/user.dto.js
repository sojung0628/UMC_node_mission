export const bodyToUser = (body) => {
    const birth = new Date(body.birth);
  
    return {
      email: body.email,
      password: body.password,
      name: body.name,
      gender: body.gender,
      birth,
      address: body.address || "",
      detailAddress: body.detailAddress || "",
      phoneNumber: body.phoneNumber,
      preferences: body.preferences,
    };
  };
  
export const responseFromUser = ({ user }) => {
    const targetUser = Array.isArray(user) ? user[0] : user;

    if (!targetUser) {
        throw new Error("사용자 정보를 찾을 수 없습니다.");
    }

    return {
        access_token: `access-token-for-user-${targetUser.id}`,
        refresh_token: `refresh-token-for-user-${targetUser.id}`
    };
};
