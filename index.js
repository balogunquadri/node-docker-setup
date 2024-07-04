const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
 const redis = require("redis");
 const cors = require("cors")

let RedisStore = require("connect-redis").default; 

const { createClient } = require("redis");

const { MONGO_USER } = require("./config/config");
const { MONGO_PASSWORD } = require("./config/config");
const { MONGO_PORT } = require("./config/config");
const { MONGO_IP } = require("./config/config");


const { REDIS_URL } = require("./config/config");
const { SESSION_SECRET } = require("./config/config");
const { REDIS_PORT } = require("./config/config ");



let redisClient = createClient({
    host: REDIS_URL,
    port: REDIS_PORT, 

})

//  redisClient.connect().catch(console.error)

const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes");

const app = (express());

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose.connect(mongoURL, {})
    .then(() => console.log("Successfully connected"))
    .catch((e) => {
    console.log(e)
    setTimeout(connectWithRetry, 5000)
 });
};

connectWithRetry();


app.enable("trust proxy");
app.use(cors)
app.use
   (session({
    store: new RedisStore({ client: redisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 30000,
    },
})
);

app.use(express.json())

 
app.get("/api/v1", (req, res) => {
    res.send("<h2> Hi There </h2>")
});


app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users  ", userRouter)

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`))