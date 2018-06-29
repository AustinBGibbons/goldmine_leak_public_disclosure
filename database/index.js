const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log("mongo url", process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;

const userSchema = mongoose.Schema({
  user_id: Number,
  access_token: String,
  item_id: String,
  transactions: [],
  account_id: String,
  account_number: String,
  routing_number: String,
});

const User = mongoose.model('User', userSchema);

const create_user = async user => {
  let user_id = 1;
  const num_items = await is_item_linked(user_id);
  if (num_items.length > 0) {
    user_id = 2;
  }

  const {
    access_token,
    item_id,
    transactions,
  } = user;

  const new_user = new User({
    user_id,
    access_token,
    item_id,
    transactions,
  });

  await new_user.save();
  return;
}

/**
 * Retrieves Item from database.
 * @param {Int} user_id
 */
const is_item_linked = (user_id) => {
  return User.find({'user_id': user_id});
}

/**
 * Retrieves a user's access_token given their item_id
 * @param {String} item_id Item's item id
 */
const retrieve_access_token = (item_id) => {
  return User.find({'item_id' : item_id});
}

/**
 * For the purposes of this app, user 1 will be the user
 * that when through Plaid Link with 'Transactions'
 * initialized.
 */
const retrieve_transactions = () => {
  return User.find({'user_id': 1});
}

/**
 * Updates transactions in our database as needed for users
 * @param {String} ACCESS_TOKEN Item's access token
 * @param {Array} transactions  Item's transactions
 */
const save_transactions = async (ACCESS_TOKEN, transactions) => {
  const query = { access_token: ACCESS_TOKEN };
  const update = {$set:{transactions: transactions}};
  return User.findOneAndUpdate(query, update);
}

const delete_user = () => {
  return User.remove({}).exec();
}

module.exports = {
  is_item_linked,
  create_user,
  retrieve_transactions,
  retrieve_access_token,
  save_transactions,
  delete_user,
}
