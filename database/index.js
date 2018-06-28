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
  const { ACCESS_TOKEN } = user;
  const { ITEM_ID } = user;
  const { TRANSACTIONS } = user; 

  const new_user = new User({
    user_id: 1,
    access_token: ACCESS_TOKEN,
    item_id: ITEM_ID,
    transactions: TRANSACTIONS,
  });

  await new_user.save();
  return; 
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
  save_transactions,
  delete_user,
}
