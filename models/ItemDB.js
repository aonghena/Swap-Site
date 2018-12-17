var Item = require(__dirname+"/Item");
var mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/swaps');
var Schema = mongoose.Schema;

var itemDataSchema = new Schema({
  itemCode: {type: String, required: true},
  itemName: {type: String, required: true},
  catalogCategory: {type: String, required: true},
  author: {type: String, required: true},
  des: {type: String, required: true},
  rating: {type: String, required: true},
  imageUrl: {type: String, required: true}
},{collection: 'Item'});

var ItemData = mongoose.model('Item', itemDataSchema);

module.exports.addItem =function(itemCode, itemName, catalogCategory, author, description, rating, imageUrl){
  var item = new Item.Book(itemCode, itemName, catalogCategory, author, description, rating,imageUrl);
  addItem(item);
}

function addItem (item){
  var data = new ItemData(item);
  data.save();
}


function getItems(){
    try{
      return ItemData.find({});
    }catch(e){
      console.log(e);
    }
}

function getItem(itemCode){
try{
  return ItemData.findOne({"itemCode": itemCode});
}catch (e){
  return null;
}

}
class UserItem{
  constructor(userID, itemCode, itemName, catalogCategory, author, des, rating, imageUrl, uRating, Status, SwapItem, SwapItemRating, SwapperRating) {
    this.userID = userID
    this.itemCode = itemCode;
    this.itemName = itemName;
    this.catalogCategory = catalogCategory;
    this.author = author;
    this.des = des;
    this.rating = rating;
    this.imageUrl = imageUrl;
    this.uRating = uRating;
    this.Status = Status;
    this.SwapItem = SwapItem;
    this.SwapItemRating = SwapItemRating;
    this.SwapperRating = SwapperRating;
  }
}

var UserItemDataSchema = new Schema({
  userID: {type: String, required: true},
  itemCode: {type: String, required: true},
  itemName: {type: String, required: true},
  catalogCategory: {type: String, required: true},
  author: {type: String, required: true},
  des: {type: String, required: true},
  rating: {type: String, required: true},
  imageUrl: {type: String, required: true},
  uRating: {type: String, required: true},
  Status: {type: String, required: true},
  SwapItem: {type: String, required: true},
  SwapItemRating: {type: String, required: true},
  SwapperRating: {type: String, required: true}
},{collection: 'UserItem'});

var UserItemData = mongoose.model('UserItem', UserItemDataSchema);

function getUserItems(user){
  try{
    return UserItemData.find({userID: user});
  }catch (e){
    console.log("error involving getting User Items");
  }
}

function update(user, item, status){
  try{
  return UserItemData.findOneAndUpdate({userID: user, itemCode: item},{Status: status});

}catch(e){
  console.log("error " + e);
}
}

function userItemRatingUpdate(user ,item, rating){
  try{
    console.log(user + " , " + item + " , " + rating +" ")
    return UserItemData.findOneAndUpdate({userID: user, itemCode: item},{uRating: rating});
  
  }catch(e){
    console.log("error " + e);
  }
}

function getAllItems(){
  return new Promise((resolve, reject) => {
    ItemData.find({}).then(docs => {
   console.log();
        resolve(docs);
    }).catch(err => { return reject(err); })
});
}
async function getAllItemsX(user){
  if(!user){
    return ItemData.find({});
  }else{
  var userItems = await getUserItems(user);
  var n = []
  for(x in userItems){
    n.push(userItems[x].itemCode);
  }
  return ItemData.find({itemCode:{$nin: n}});
  }
}

function deleteItem(item, userID){
  console.log(item + "   delete      " +userID);
  return UserItemData.findOneAndDelete({userID: userID ,itemCode: item});
}

function addItem(item, userID){
  console.log(item + "  " + userID);
  var u = new UserItem(userID, item.itemCode, item.itemName, item.catalogCategory, item.author, item.des, item.rating, item.imageUrl, 
    "***", "available", "***", "***", "***");
  console.log(u);
  var data = new UserItemData(u);
  data.save();
  console.log(item + "     add    " +userID);
}

exports.addItem = addItem;
exports.getAllItems = getAllItems;
exports.update = update;
exports.deleteItem = deleteItem;
exports.getAllItemsX = getAllItemsX;
exports.getUserItems = getUserItems;
exports.getItems = getItems;
exports.getItem = getItem;
exports.userItemRatingUpdate = userItemRatingUpdate;
