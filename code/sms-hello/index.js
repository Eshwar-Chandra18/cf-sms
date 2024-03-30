require('dotenv').config()

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

exports.helloPubSub = (message, context) => {
  const incomingMessage = Buffer.from(message.data, 'base64').toString('utf-8');

  const parsedMessage = JSON.parse(incomingMessage);

  console.log(`Decoded message: ${JSON.stringify(parsedMessage)}`);
  console.log(`Phone Number : ${parsedMessage.phone_number}`);

  client.messages
  .create({
    body: 'Eshwar Chandra Bandi - Welcome to TravelDeals!',
    to: parsedMessage.phone_number,
    from: '+12513877355',
  })
  .then((message) => console.log(message.sid));
}
