const envConfig = {
  API_V2_URL: process.env.NEXT_PUBLIC_API_V2_URL || "",
  API_V3_URL: process.env.NEXT_PUBLIC_API_V3_URL || "",
  CHAINLIT_BACKEND_URL: process.env.NEXT_PUBLIC_CHAINLIT_BACKEND_URL || "",
};

export default envConfig;
