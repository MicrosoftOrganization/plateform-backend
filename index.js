const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

const Instructor = require("./routes/instructor_route");
const Department = require("./routes/department_route");
const chat = require("./routes/chat_route");
const Member = require("./routes/member_route");
const Super_admin = require("./routes/super_admin_route");

const assignment = require("./routes/assignment_route"); 

const session = require("./routes/session_route");
const dotenv = require("dotenv");
const response = require("./routes/response_route");
const attachment = require("./routes/attachment_route");
const user = require("./routes/user_route");
const test = require("./routes/test_route");
const helmet = require("helmet");
const rateLimiter = require("./rateLimiter");

// Intégration de Swagger à l'URL /api-docs
// const swaggerUi = require('swagger-ui-express')
// const swaggerSpec = require('./swagger/swaggerConfig')

dotenv.config();

const app = express();
app.use(helmet());
app.use(rateLimiter);
const PORT = process.env.PORT || 8080;

const url = process.env.MONGODB_URL;





// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// fin Intégration de Swagger


mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error.message);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to the backend deployment!");
});

app.use("/api/instructor", Instructor);
app.use("/api/member", Member);
app.use("/api/super_admin", Super_admin);
app.use("/api/session", session);
app.use("/api/assignment", assignment);
app.use("/api/attachment", attachment);
app.use("/api/response", response);
app.use("/api/user", user);
app.use("/api/department", Department);
app.use("/api/test", test);

//app.use("/api/chats", chat);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
