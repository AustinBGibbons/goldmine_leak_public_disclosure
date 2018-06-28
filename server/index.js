const express = require('express');
const plaid = require('plaid');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const moment = require('moment');

const {
  is_bank_connected,
  create_user,
  retrieve_transactions,
  save_transactions,
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
 * Endpoint for checking whether a user has already connected
 * his/her bank account credentials.
 */
app.post('/get_bank_connected_state', async (req, res) => {
  const bank_connected_state = await is_bank_connected();
  res.send({
    bank_connected_state,
  })
});


/**
 * Endpoint for fetching transactions for a user from our
 * mongo database.
 */
app.post('/get_transactions', async (req, res) => {
  const user_data = await retrieve_transactions();
  const { transactions } = user_data;
  res.send({
    transactions
  })
});

/**
 * Endpoint for webhook notifications.
 * You can then perform actions accordingly (i.e fetching 
 * fresh transactions data from Plaid's servers).
 */
app.post('/webhook', (req, res) => {


});

/**
 * Endpoint for the exchange token process
 */
app.post('/exchange_token', async (req, res) => {

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

      // We make a /transactions/get call to the Plaid API, but we'll
      // sometimes get hit with a PRODUCT_NOT_READY error 
      const now = moment();
      const end_date = now.format('YYYY-MM-DD');
      const start_date = now.subtract(30, 'days').format('YYYY-MM-DD');
      
      plaidClient.getTransactions(
        ACCESS_TOKEN, 
        start_date, 
        end_date, 
      ).then( async (response) => {
        const TRANSACTIONS = response.transactions;
        const user = {
          ACCESS_TOKEN,
          ITEM_ID,
          TRANSACTIONS,
        }
        await create_user(user);
        console.log("Transactions is ", TRANSACTIONS)
        res.send({'error': false});
      }).catch( (error) => {
        console.log(error);
      });

  });
});

/**
 * Endpoint for deleting users from the database
 */
app.post('/delete_user', async (req, res) => {
  const { user_id } = req.body;
  await delete_user(user_id);
  res.send({'error': false});
});

app.listen(port, () => {
  console.log("Listening on port ", port);
});
