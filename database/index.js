const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pludget');

const db = mongoose.connection;

// This is the User schema in our Mongo database.
const userSchema = mongoose.Schema({
  user_id: String,
  access_token: String,
  item_id: String,
  transactions: [{
    type: String,
  }]
});

const User = mongoose.model('User', userSchema);

const create_user = async user => {
  const { ACCESS_TOKEN } = user;
  const { ITEM_ID } = user;

  const new_user = new User({
    user_id: 1,
    access_token: ACCESS_TOKEN,
    item_id: ITEM_ID,
    transactions: [],
  });

  await new_user.save();
  return; 
}

const retrieve_transactions = async (user_id) => {


}

const delete_user = async access_token => {
  return User
    .findOne({'access_token': access_token})
    .remove()
    .exec();
}

module.exports = {
  create_user,
  retrieve_transactions,
  delete_user
}
