import express from "express";
import connectDB from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import { errorHandler } from "./middleware/errorHandler.middlewares.js";

// Routes import
import userRouter from "./routes/users.routes.js";
import todoRouter from "./routes/todos.routes.js";
import categoryRouter from "./routes/category.routes.js";
import itemRouter from "./routes/items.routers.js";
import transactionRouter from "./routes/newTransaction.routers.js";

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// For production
const allowedOrigins = ["https://myapp.com", "http://localhost:3000"]; // add both local & prod

// app.use(
//   cors({
//     origin: allowedOrigins,
//     Credential: true,
//   })
// );

app.use(cors({ Credential: true }));

// Routes
app.use("/api/v1/users", userRouter); // Users route
app.use("/api/v1/todos", todoRouter); //Todos route
app.use("/api/v1/categories", categoryRouter); //Categories route
app.use("/api/v1/items", itemRouter); // items route
app.use("/api/v1/transactions", transactionRouter); // items route

app.use(errorHandler);
connectDB()
  .then(() => {
    app.listen(PORT, (req, res) => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("MongoDB connection error: ", error));
