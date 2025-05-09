const express = require("express");
const userRouter = require("./routes/users-router");
const errorMiddleware = require("./middlewares/error-middleware");
const authRouter = require("./routes/auth-router");
const dotenv = require("dotenv");
const session = require("express-session");
const SpacesRouter = require("./routes/spaces-router");

const app = express();

app.use(express.json());

// app.use(
//   session({
//     secret: "palavra-chave-secreta",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false },
//   })
// );

app.use("/auth", authRouter);

app.use("/users", userRouter);

app.use("/spaces", SpacesRouter)

app.use(errorMiddleware);

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}.`)
);
