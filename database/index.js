const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/boilerplate');

const db = mongoose.connection;

// This is the User schema in our Mongo database.
const userSchema = mongoose.Schema({
  user_id: Number,
  access_token: String,
  item_id: String,
  transactions: [],
});

const User = mongoose.model('User', userSchema);

const is_bank_connected = () => {
  return User.find({'user_id': 1}).count();
}

const create_user = async user => {
  // TODO: make sure we don't insert a user_id multiple times
  if (await is_bank_connected() > 0) {
    return;
  }

  const { access_token } = user;
  const { item_id } = user;
  const { transactions } = user;

  const new_user = new User({
    user_id: 1,
    access_token,
    item_id,
    transactions: transactions,
  });

  await new_user.save();
  return;
}

/**
 * Retrieves a user's access_token given their item_id
 * 
 * @param {String} item_id 
 */
const retrieve_access_token = (item_id) => {
  return User.find({'item_id' : item_id});
}

const retrieve_transactions = () => {
  return User.find({'user_id': 1});
}

/**
 * Updates transactions in our database as needed for users
 *
 * @param {Array} transactions
 */
const save_transactions = async (ACCESS_TOKEN, transactions) => {
  const query = { access_token: ACCESS_TOKEN };
  const update = {$set:{transactions: transactions}}
  return User.findOneAndUpdate(query, update);
}

const delete_user = async user_id => {
  return User
    .findOne({'user_id': user_id})
    .remove()
    .exec();
}

module.exports = {
  is_bank_connected,
  create_user,
  retrieve_transactions,
  retrieve_access_token,
  save_transactions,
  delete_user,
}
