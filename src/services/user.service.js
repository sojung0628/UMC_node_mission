import { responseFromUser } from "../dtos/user.dto.js";
import {
  addUser,
  deleteUserPreferences,
  getUser,
  getUserByEmail,
  getUserPreferencesByUserId,
  setPreference,
  updateUser,
} from "../repositories/user.repository.js";
import { generateAccessToken, generateRefreshToken } from "../auth.config.js";

export const userSignUp = async (data) => {
  const existingUser = await getUserByEmail(data.email);
  let userId;

  if (existingUser) {
    await updateUser(existingUser.id, {
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      address: data.address,
      detailAddress: data.detailAddress,
      phoneNumber: data.phoneNumber,
    });
    await deleteUserPreferences(existingUser.id);
    userId = existingUser.id;
  } else {
    userId = await addUser({
      email: data.email,
      name: data.name,
      gender: data.gender,
      birth: data.birth,
      address: data.address,
      detailAddress: data.detailAddress,
      phoneNumber: data.phoneNumber,
    });
  }

  for (const preference of data.preferences) {
    await setPreference(userId, preference);
  }

  const user = await getUser(userId);
  const preferences = await getUserPreferencesByUserId(userId);

  const access_token = generateAccessToken(user);
  const refresh_token = generateRefreshToken(user);

  return responseFromUser({
    user: { ...user, access_token, refresh_token },
    preferences,
  });
};
