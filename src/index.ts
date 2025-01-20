import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRoute.routes";
import { errorHandler } from "./utils/errorhandler.util";
import courseRouter from "./routes/courseRoute.routes";
import authRouter from "./routes/auth.route";
dotenv.config();

const portEnv = process.env.PORT;

if (!portEnv) {
  console.error("Error: PORT IS NOT DEFINED IN .env FILE");
  process.exit(1);
}

const PORT: number = parseInt(portEnv, 10);
if (isNaN(PORT)) {
  console.error("ERROR: PORT IS NOT A NUMBER IN .env file");
  process.exit(1);
}

const app = express();
const corsOption = {
  origin: "*",
  Credentials: true,
  allowedHeaders: "*",
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
};

app.use(cors(corsOption));

app.use(express.json());

// app.use("/api/v1/users", userRouter);
app.use("/api/v1/login", authRouter);
// app.use("/api/v1/courses", courseRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
