import jwt from "jsonwebtoken"

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })

  // Set JWT as HTTP-Only cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000, // days to ms
    domain: process.env.NODE_ENV === "production" ? ".onrender.com" : "localhost",
  })

  return token
}

export default generateToken

