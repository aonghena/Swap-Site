
var mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/swaps');
var Schema = mongoose.Schema;

/**
 * User Profile Schema
 */
var UserProfileDataSchema = new Schema({
  UserID: {type: String, required: true},
  UserItems: {type: String, required: true}
},{collection: 'UserProfile'});

var UserProfileData = mongoose.model('UserProfile', UserProfileDataSchema);

/**
 * Creates User Profile
 * @param {*} UserID 
 * @param {*} UserItems 
 */
function UserProfile(UserID, UserItems) {
    this.UserID = UserID;
    this.UserItems = UserItems;
  }

  /**
   * empties User Profile
   */
  UserProfile.prototype.emptyProfile = function(){
    delete this.UserID;
    delete this.UserItems;

  }
  /**
   * Get Users Items
   */
  UserProfile.prototype.getUserItems = function(){
    return this.UserItems;
  }

  /**
   * removes user item
   */
  UserProfile.prototype.removeUserItem = function(Item){
    for(var x in this.UserItems){
      if(Item == this.UserItems[x]){
        delete this.UserItems[x];
      }
    }
  }

  
 
  module.exports = UserProfile;