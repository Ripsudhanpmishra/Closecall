import { axiosInstances } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstances.post("/auth/signup", signupData);
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstances.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
}

export const completeOnboarding = async (userData) => {
  const response = await axiosInstances.post("/auth/onboarding", userData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstances.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstances.post("/auth/logout");
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstances.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstances.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstances.get("/users/friend-requests/sent");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstances.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstances.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstances.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstances.get("/chat/token");
  return response.data;
}