import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// step 1: create express app
const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

mongoose.connect(
  "mongodb://localhost:27017/loginRegisterDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to mongodb");
  }
);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

//creating a model
const User = mongoose.model("User", userSchema);

// step 2: import routes
// app.get("/", (req, res) => {
//   res.send("Hello World from BackEnd");
// });
//post request for login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email, password: password })
    .then((user) => {
      if (user) {
        res.send(user);
        if (password === user.password) {
          res.send({ message: "password is correct", user: user });
        } else {
          res.send({ message: "password is incorrect" });
        }
      } else {
        res.send("User not found");
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

// post request signup
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User already registered" });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send({ message: "user created" });
        }
      });
    }
  });
});

app.listen(4000, () => {
  console.log("server is running on port 4000");
});
