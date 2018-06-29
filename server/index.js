const express = require('express');
const plaid = require('plaid');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const moment = require('moment');

const {
  is_item_linked,
  create_user,
  retrieve_transactions,
  retrieve_access_token,
  save_transactions,
  delete_user
} = require('../database/index');

dotenv.config();

const app = express();
const port = process.env.PORT || 80;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client/dist'));

const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_PUBLIC_KEY = process.env.PLAID_PUBLIC_KEY;
const TRANSACTION_WEBHOOK_URL = process.env.TRANSACTION_WEBHOOK_URL

/**
 * Initializes a new Plaid Client using your public_key,
 * client_id, and secret_key. These are all found on your
 * Plaid Dashboard
 * @returns initialized plaid client
 */
const initPlaidClient = () => {

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
app.post('/get_item_linked_state', async (req, res) => {
  const item = await is_item_linked();
  res.send({
    item,
    webhook: TRANSACTION_WEBHOOK_URL,
    public_key: PLAID_PUBLIC_KEY,
  })
});

/**
 * Endpoint for fetching transactions for a user from our
 * mongo database.
 */
app.post('/get_transactions', async (req, res) => {
  const user_data = await retrieve_transactions();
  console.log("user_data", user_data);
  const { transactions } = user_data[0];
  res.send({
    transactions
  })
});

/**
 * Endpoint for receiving webhook requests from Plaid.
 * You can then perform actions accordingly. This app
 * only handles TRANSACTIONS update webhooks, but the
 * concept is similar for other types of webhook requests.
 */
app.post('/webhook', async (req, res) => {
  const { item_id } = req.body;
  const { webhook_code } = req.body;

  const data = await retrieve_access_token(item_id);
  console.log("webhook callback, access_token = ", data)
  const { access_token } = data[0];

  const now = moment();
  const end_date = now.format('YYYY-MM-DD');
  let start_date;

  // The following are recommended date ranges when pulling
  // transactions data for each update type.
  if (webhook_code === 'INITIAL_UPDATE') {
    start_date = now.subtract(30, 'days').format('YYYY-MM-DD');
  } else if (webhook_code === 'HISTORICAL_UPDATE') {
    start_date = now.subtract(2, 'years').format('YYYY-MM-DD');
  } else if (webhook_code === 'DEFAULT_UPDATE') {
    start_date = now.subtract(90, 'days').format('YYYY-MM-DD');
  }

  plaidClient.getTransactions(
    access_token,
    start_date,
    end_date
  ).then( async (response) => {
    const { transactions } = response;
    await save_transactions(access_token, transactions);
    res.send({'error': false});
  }).catch( (error) => {
    console.log(error);
  });
});

/**
 * Endpoint for calling get auth
 */
app.post('/get_auth', async (req, res) => {
  const { user_id } = req.body;
  const item = await is_item_linked(user_id);
  const { access_token } = item[0];

  plaidClient.getAuth(
    access_token,
  ).then( async (authResponse) => {
    res.json({
      error: false,
    });
  }).catch( error => {
    const msg = 'Could not get Auth data!';
    console.log(msg, error);
    res.json({
      error: true,
      message: msg
    });
  });
});

/**
 * Endpoint for the exchange token process
 */
app.post('/exchange_token', async (req, res) => {

  const PUBLIC_TOKEN = req.body.public_token;

  plaidClient.exchangePublicToken(
    PUBLIC_TOKEN
  ).then( async (tokenResponse) => {

    const { access_token } = tokenResponse;
    const { item_id } = tokenResponse;

    const user = {
      access_token,
      item_id,
      transactions: [],
    }
    await create_user(user);
    res.send({'error': false});

  }).catch( error => {
    const msg = 'Could not exchange public_token!';
    console.log(msg, error);
    return res.json({error: msg});
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
