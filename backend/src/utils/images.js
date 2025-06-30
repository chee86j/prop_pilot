import axios from "axios";
import logger from "./logger.js";

export const urlToBase64 = async (url) => {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data, "binary");
    const base64 = buffer.toString("base64");
    const contentType = response.headers["content-type"];

    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    logger.error("Error converting image URL to base64:", error);
    return null;
  }
};
