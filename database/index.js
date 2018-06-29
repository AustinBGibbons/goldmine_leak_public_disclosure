const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log("mongo url", process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

const userSchema = mongoose.Schema({
  user_id: Number,
  access_token: String,
  item_id: String,
  transactions: [],
  account_id: String,
  account_number: String,
  routing_number: String,
  mask: String,
  account_name: String,
});

const User = mongoose.model('User', userSchema);

const create_user = async user => {
  if (await is_item_linked() > 0) {
    return;
  }

  const {
    access_token,
    item_id,
    transactions,
    account_id,
    account_number,
    routing_number,
    mask,
    account_name,
  } = user;

  const new_user = new User({
    user_id: 1,
    access_token,
    item_id,
    transactions,
    account_id,
    account_number,
    routing_number,
    mask,
    account_name,
  });

  await new_user.save();
  return;
}

/**
 * For the purposes of this app, we don't want to have more
 * than one end user. This function checks whether a user
 * has already been created or not.
 */
const is_item_linked = () => {
  return User.find({'user_id': 1});
}

/**
 * Retrieves a user's access_token given their item_id
 * @param {String} item_id Item's item id
 */
const retrieve_access_token = (item_id) => {
  return User.find({'item_id' : item_id});
}

/**
 * For the purposes of this app, our database only has 1 user.
 * This function simply grabs that one user's information.
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
  const update = {$set:{transactions: transactions}}
  return User.findOneAndUpdate(query, update);
}

const delete_user = async user_id => {
  // Ignore user_id, and use hard coded
  return User.remove({'user_id': 1}).exec();
}

module.exports = {
  is_item_linked,
  create_user,
  retrieve_transactions,
  retrieve_access_token,
  save_transactions,
  delete_user,
}
