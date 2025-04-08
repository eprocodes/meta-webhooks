const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const VERIFY_TOKEN = 'EAAGXvVicjR4BO2NPx0ZABtUbdzJHWZAf0Ud47kXzgkZBPbZClaqYEz19o1XjggIQgjWIpbm9HIAchPXWwhwaZAX2JyE72NJa2wqqKY45soZBtOFfgj4dPVwKvVO3WW3IFP8VVH5aDfvHMlj8PGabgAFEUNBIM6EA6SUAKUNGQ3twpKOEsZAI0gpdsFZCL0zjZCcMqUAZDZD';
let latestMessage = null; // Store latest webhook message

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Node.js app!');
});

// For verification
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified!');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// For receiving messages
app.post('/webhook', (req, res) => {
  const body = req.body;
  latestMessage = req.body; // Save to memory (or DB if needed)
  if (body.object === 'page') {
    body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message && event.message.text) {
          console.log("✅ Received message:", event.message.text);
          latestMessage = event.message.text;
        } else {
          console.log("ℹ️ Non-message event:", event);
        }
      });
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Angular frontend fetches latest message
app.get('/latest-message', (req, res) => {
  res.json({ message: latestMessage });
});

app.listen(3000, () => console.log('Webhook server running on port 3000'));
