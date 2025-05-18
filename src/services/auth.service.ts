import { apiClient } from "@/utils/api";
import { AxiosError } from "axios";

export type LoginResponse = {
  accessToken: string;
};

export async function login(username: string, password: string) {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      formData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.detail);
    }
    throw new Error("Unknown error");
  }
}
