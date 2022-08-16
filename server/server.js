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

const apiPort = process.env.API_PORT || 5000;
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_APP_SECRET;

// Initialize a Server Client
const serverClient = StreamChat.getInstance(apiKey, apiSecret);

const defaultChannel = serverClient.channel('messaging', 'talk_about_anything', {
    // add as many custom fields as you'd like
    image: 'https://www.drupal.org/files/project-images/react.png',
    name: 'Talk about Anything',
    created_by_id: 'cajenizod_robot-mail_com_62f50b'
});

async function createDefaultChannel() {
    try {
        await defaultChannel.create();
        console.log("Default channel created.")
    }
    catch (error) {
        console.error(`Details: ${error}`);
    }
}
createDefaultChannel();

app.post('/token', (req, res) =>
{
    // Create User Token
    var userId = req.body.username;
    const userToken = serverClient.createToken(userId);

    async function addToChannel() {
        try {
          await defaultChannel.addMembers([userId]);
          console.log("Added to the default channel.");
        }
        catch (error) {
          console.error(`Details: ${error}`);
        }
    }
    addToChannel();

    var maskedToken = userToken.replace(/^(ey)(.{100})(.*)$/,
        (_, a, b, c) => a + b.replace(/./g, '*') + c);

    console.log("/=================================")
    console.log("Requested on", Date(Date.now()))
    console.log("Identified user is", userId)
    console.log("Generated unique token is", maskedToken) // eyJ...
    console.log("=================================/")
    return res.status(200).json(
    {
        "token": userToken
    });
})

app.get('/', (req, res) => {
    res.send("Hello world!")
})

app.listen(apiPort, () =>
{
    console.log(`Server running on PORT`, apiPort);
});