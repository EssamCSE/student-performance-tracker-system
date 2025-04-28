import dotenv from 'dotenv';
dotenv.config();

export default {
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'essam',
    database: process.env.DB_NAME || 'spt'
  },
  jwtSecret: process.env.JWT_SECRET || 'c4c90ac8a69a259cc07ec7f1b5d51758b8c2c6e274c0c21d7f2c2be473e139919a65323fdba8bcd45c33d2f90a427a5bc10580c388acc4fd702870280b1b8759'
};