import express, { Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const port = 8000;
// const router = express.Router();
import authRouter from './routes/authRoutes';

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello, TypeScript !');
});

app.use("/api/v1/auth", authRouter);


console.log("hello typescript!");
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});