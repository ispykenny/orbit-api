import jwt from 'jsonwebtoken';

interface User {
  email: string;
}

const generateAccessToken = (user: User) => {
  return jwt.sign(user, Bun.env.ACCESS_SECRET || '', {
    expiresIn: '60m',
  });
};

const generateRefreshToken = (user: User) => {
  return jwt.sign(user, Bun.env.REFRESH_SECRET || '', {
    expiresIn: '365d',
  });
};

export { generateAccessToken, generateRefreshToken };
