import User from "../models/User.js";
import { clerkClient } from "@clerk/express";

export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const image = clerkUser.imageUrl;
    const username =
      `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
      clerkUser.username ||
      "User";

    let user = await User.findById(userId);

    if (!user) {
      user = await User.create({
        _id: userId,
        username,
        email,
        image,
        role: "user",
        recentSearchedCities: [],
      });

      console.log("New user created:", user.username);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
