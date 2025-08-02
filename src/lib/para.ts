import { Environment } from "@getpara/react-sdk";
import { env } from "~/env";

export const API_KEY = env.NEXT_PUBLIC_PARA_APIKEY ?? "";
export const ENVIRONMENT = Environment.BETA;

if (!API_KEY) {
  throw new Error(
    "API key is not defined. Please set NEXT_PUBLIC_PARA_APIKEY in your environment variables.",
  );
}
