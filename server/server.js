require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const
{
    StreamChat
} = require('stream-chat');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
{
    extended: true
}));

const apiPort = process.env.API_PORT;
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_APP_SECRET;

// Initialize a Server Client
const serverClient = StreamChat.getInstance(apiKey, apiSecret);

app.post('/token', (req, res) =>
{
    // Create User Token
    var user_id = req.body.username;
    const userToken = serverClient.createToken(user_id);
    var maskedToken = userToken.replace(/^(ey)(.{100})(.*)$/,
        (_, a, b, c) => a + b.replace(/./g, '*') + c);

    console.log("/=================================")
    console.log("Requested on", Date(Date.now()))
    console.log("Identified user is", req.body.username)
    console.log("Generated unique token is", maskedToken) // eyJ...
    console.log("=================================/")
    return res.status(200).json(
    {
        "token": userToken
    });
})


app.listen(apiPort, () =>
{
    console.log(`Server running on PORT`, apiPort);
});