const express = require('express');
const plaid = require('plaid');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const {
  create_user,
  retrieve_transactions,
  delete_user
} = require('../database/index');

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client/dist'));

/** 
 * Initializes a new Plaid Client using your public_key,
 * client_id, and secret_key. These are all found on your
 * Plaid Dashboard
 * @returns initialized plaid client 
 */
const initPlaidClient = () => {
  const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
  const PLAID_SECRET = process.env.PLAID_SECRET;
  const PLAID_PUBLIC_KEY = process.env.PLAID_PUBLIC_KEY;
  const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

  const plaidClient = new plaid.Client(
    PLAID_CLIENT_ID,
    PLAID_SECRET,
    PLAID_PUBLIC_KEY,
    plaid.environments[PLAID_ENV]
  );

  return plaidClient;
}

const plaidClient = initPlaidClient();

/**
 * 
 */


/**
 * Endpoint for webhook notifications
 */
app.post('/webhook', (req, res) => {


});

/**
 * Endpoint for the exchange token process
 */
app.post('/exchange_token', (req, res) => {

  console.log("metadata is ", req.body.metadata)

  const PUBLIC_TOKEN = req.body.public_token;

  plaidClient.exchangePublicToken(
    PUBLIC_TOKEN, 
    async (error, tokenResponse) => {
      if (error != null) {
        const msg = 'Could not exchange public_token!';
        console.log(msg + '\n' + error);
        return res.json({error: msg});
      }

      const ACCESS_TOKEN = tokenResponse.access_token;
      const ITEM_ID = tokenResponse.item_id;
      console.log('Access Token:' , ACCESS_TOKEN);
      console.log('Item ID:', ITEM_ID);

      const user = {
        ACCESS_TOKEN,
        ITEM_ID,
      }

      await create_user(user);

      res.send({'error': false});
  });
});


app.listen(port, () => {
  console.log("Listening on port ", port);
});
