require('dotenv').config()

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);
const { Firestore } = require('@google-cloud/firestore');

const firestore = new Firestore({
  projectId: "sp24-41200-eshwar-globaljags"
});

exports.helloFirestore = async (event, context) => {
  const resource = context.resource;

  console.log('Function triggered by change to: ' +  resource);
  const locations = event.value.fields.location?.arrayValue.values.map(value => value.stringValue);
  const headline = event.value.fields.headline.stringValue;
  console.log(locations);

  let subscribersQuery = firestore.collection('subscribers'); 
  let subscribers = await subscribersQuery.get();

  subscribers.forEach(subscriberDoc => {
    const subscriberData = subscriberDoc.data();
    const watchRegions = subscriberData.watch_regions;

    for (let i = 0; i < watchRegions.length; i++) {
      for (let j = 0; j < locations.length; j++) {
        if (watchRegions[i] === locations[j]) {

          const phone_number = subscriberData.phone_number || "";
          if (phone_number === "") {
            console.log("No phone number for user : ", subscriberData.email_address);
            continue;
          }
          client.messages
            .create({
              body: `Eshwar Chandra Bandi - ${headline}`,
              to: phone_number,
              from: '+12513877355',
            })
            .then((message) => console.log(message.sid));

          console.log("Matched Location - ", locations[j], "For Phone Number - ", phone_number);
        }
      }
    }
  });
};
