const {Firestore} = require('@google-cloud/firestore');

async function writeToFS(dataObject) {
    const firestore = new Firestore({
        projectId: "sp24-41200-eshwar-globaljags",
    });

    console.log(`The dataobject: `);
    console.log(dataObject);

    let collectionRef = firestore.collection('subscribers');
    let documentRef = await collectionRef.add(dataObject);
    console.log(`Document created: ${documentRef.id}`);
}

exports.helloPubSub = (message, context) => {
  console.log(`Encoded message: ${message.data}`);

  const incomingMessage = Buffer.from(message.data, 'base64').toString('utf-8');

  const parsedMessage = JSON.parse(incomingMessage);

  console.log(`Decoded message: ${JSON.stringify(parsedMessage)}`);
  console.log(`Email address: ${parsedMessage.email_address}`);
  console.log(`Watch regions: ${parsedMessage.watch_regions}`);

  const phoneNumber = parsedMessage.phone_number || '';
  console.log(`Phone Number: ${phoneNumber}`);

  let dataObject = {};
  dataObject.email_address = parsedMessage.email_address;
  dataObject.watch_regions = parsedMessage.watch_regions;
  dataObject.phone_number = phoneNumber;

  writeToFS(dataObject);
}
