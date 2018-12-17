var mongoose = require('mongoose'); 

mongoose.connect('mongodb://localhost:27017/swaps');
var Schema = mongoose.Schema;

var userDataSchema = new Schema({
  userID: {type: String, required: true},
  password: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  email: {type: String, required: true},
  addr1: {type: String, required: true},
  addr2: {type: String, required: true},
  state: {type: String, required: true},
  city: {type: String, required: true},
  postCode: {type: String, required: true},
  country: {type: String, required: true}
  
},{collection: 'User'});

var UserData = mongoose.model('User', userDataSchema);

var ItemDB = require("./../models/ItemDB")
//User
var UserC = require("./../models/User");




module.exports.addUser = async function (password, firstName, lastName, email, address1, address2, city, state, zipcode, country){
  var count = 0;
  count = await UserData.find({}).count();
  var id = "C"+count;
  console.log(id);
  var user = new UserC.User(id, password, firstName, lastName, email, address1, address2, city, state, zipcode, country);
  addUser(user);
}

function addUser(user){
  var data = new UserData(user);
  data.save();
}

function getAllUsers(){
try{
  return UserData.find({});
} catch(e){
  console.log(e);
}
}
function getUser(user){
  try{
    return  UserData.findOne({userID: user});
         
  }catch(e){
    console.log("error " + e);
  }
}

function getUserEmail(email){
try{
  return UserData.findOne({email, email});
}catch(e){
  console.log("error User not found");
}
}







exports.getUserEmail = getUserEmail;
exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
