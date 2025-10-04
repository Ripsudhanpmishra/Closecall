import {StreamChat} from "stream-chat";
import dotenv from "dotenv";    

dotenv.config();
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error("Missing Stream API credentials");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try { 
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error upserting Stream user:", error);
        throw new Error("Failed to upsert Stream user");
    }
};

export const generateStreamToken = async (userId) => {
  try {
    const userIdStr = userId.toString();
    const token = streamClient.createToken(userIdStr);
    return token;
  } catch (error) {
    console.error("Error generating Stream token:", error);
  }
};
