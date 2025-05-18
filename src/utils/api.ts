import axios from "axios";

function snakeToCamel(str: string) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function objectSnakeToCamel<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map(objectSnakeToCamel) as T;
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        snakeToCamel(key),
        objectSnakeToCamel<T>(value),
      ])
    ) as T;
  }
  return obj;
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use((response) => {
  if (response.data) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response.data = objectSnakeToCamel<any>(response.data);
  }
  return response;
});
