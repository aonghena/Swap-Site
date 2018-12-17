var OfferDB = require(__dirname+"/../models/OfferDB")
var ItemDB = require(__dirname+"/../models/ItemDB")
var mongoose = require('mongoose'); 

mongoose.connect('mongodb://localhost:27017/swaps');
var Schema = mongoose.Schema;
/**
 * Instead of having another file I chose to put the feeback class within FeedbackDB
 * This is used for the object feedback
 */
class feedback{
  constructor(offerID, userID1, userID2, rating){
      this.offerID = offerID;
      this.userID1 = userID1;
      this.userID2 = userID2;
      this.rating = rating;
    };
};
/**
 * Instead of having another file I chose to put the feeback class within FeedbackDB
 * This is used for the individual item feedback
 */
class itemFeedback{
  constructor(offerID, userID, rating){
      this.offerID = offerID;
      this.userID = userID;
      this.rating = rating;
    };
};

/**
 * There are twoDataSchemas for feedbacks depending on what type of feedback 
 * individual item, vs exchange feedback 
 */

/**
 * feedbackDataSchema for user Feedback
 */
var feedbackDataSchema = new Schema({
    offerID: {type: String, required: true},
    userID1: {type: String, required: true},
    userID2: {type: String, required: true},
    rating: {type: String, required: true}
  },{collection: 'Feedback'});
  /**
 * feedbackDataSchema for user item
 */
  var feedbackDataSchema2 = new Schema({
    itemCode: {type: String, required: true},
    userID: {type: String, required: true},
    rating: {type: String, required: true}
  },{collection: 'Feedback'});
  
 var feedbackData = mongoose.model('Feedback', feedbackDataSchema);
 var feedbackData2 = mongoose.model('Feedback2', feedbackDataSchema2);

 /**
  * Function to add offer Feedback
  */
 module.exports.addOfferFeedback = async function(offerID, userID1, userID2, rating){
  //checks if valid offerID
  var t = await OfferDB.getOffer(offerID);
  if(t != null){
  var x = new feedback(offerID, userID1, userID2, rating);
  var data = new feedbackData(x);
  data.save();
  }else{
    console.log("error invalid offerID \n feedback not given")
  }
}

/**
 * Function to add Item Feedback to database
 */
module.exports.addItemFeedback = async function(itemCode, userID, rating) {
  //checks if valid item
  var t = await ItemDB.getItem(itemCode);
  if(t != null){
  var x = new itemFeedback(itemCode, userID, rating);
  var data = new feedbackData2(x);
  data.save();
  }else{
    console.log("error invalid itemCode\n Feedback not given")
  }
 }