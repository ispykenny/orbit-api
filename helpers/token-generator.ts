// Generate an Access Token with a short expiration time (e.g., 5 minutes)

import jwt from 'jsonwebtoken';

interface User {
  email: string;
}

const generateAccessToken = (user: User) => {
  return jwt.sign(user, process.env.ACCESS_SECRET || '', {
    expiresIn: '5m',
  });
};

// Generate a Refresh Token with a longer expiration time
const generateRefreshToken = (user: User) => {
  return jwt.sign(user, process.env.REFRESH_SECRET || '', {
    expiresIn: '7d',
  });
};

export { generateAccessToken, generateRefreshToken };
