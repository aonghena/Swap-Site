var mongoose = require('mongoose'); 

mongoose.connect('mongodb://localhost:27017/swaps');
var Schema = mongoose.Schema;
/**
 * Offer Class
 * Used to generate the offer object
 */
class Offer{
    constructor(offerID, userID, itemCodeOwn, itemCodeWant, itemStatus){
        this.offerID = offerID;
        this.userID = userID;
        this.itemCodeOwn = itemCodeOwn;
        this.itemCodeWant = itemCodeWant;
        this.itemStatus = itemStatus;
      };
};
/**
 * Offer Data Schema
 */
var offerDataSchema = new Schema({
    offerID: {type: String, required: true},
    userID: {type: String, required: true},
    itemCodeOwn: {type: String, required: true},
    itemCodeWant: {type: String, required: true},
    itemStatus: {type: String, required: true}
  },{collection: 'Offer'});
  
 var offerData = mongoose.model('offer', offerDataSchema);

/**
 * Creates and adds offer to the database while creating unique id
 * @param {*} userID 
 * @param {*} itemCodeOwn 
 * @param {*} itemCodeWant 
 * @param {*} itemStatus 
 */
async function addOffer(userID, itemCodeOwn, itemCodeWant, itemStatus){
    try{
    var id = await offerData.find({}).count();
    id = id+1;
    var u = new Offer(id,userID, itemCodeOwn, itemCodeWant,itemStatus);
    var data = new offerData(u);
    data.save();
    } catch (e){
        console.log(e);
    }
}
/**
 * Deltes offer, either after offer is complete or offer is declined
 * @param {*} userID 
 * @param {*} itemCodeOwn 
 */
async function deleteOffer(userID, itemCodeOwn){
    try{
        console.log(userID + "  " + itemCodeOwn);
        var t = await offerData.find({})
        console.log(t[0]);
        return offerData.findOneAndDelete({userID: userID, itemCodeOwn: itemCodeOwn});
    }catch(e){
        console.log(e);
    }
}
/**
 * Updates offer information
 * @param {*} offerID 
 * @param {*} itemStatus 
 */
function updateOffer(offerID, itemStatus){
    try{
    return offerData.findOneAndUpdate({ offerID: offerID},{itemStatus: itemStatus});
    } catch (e){
        console.log(e);
    }
}
/**
 * Gets Offer information
 * @param {*} offerID 
 */
function getOffer(offerID){
    try{
        return offerData.findOne({ offerID: offerID});
    } catch (e){
        console.log(e);
    }
}
/**
 * Gets the offer ID
 * @param {*} userID 
 * @param {*} itemCodeOwn 
 */
function getOfferID(userID, itemCodeOwn){
    return offerData.findOne({ userID: userID, itemCodeOwn: itemCodeOwn, itemStatus: "pending"});
}

exports.getOfferID = getOfferID;
exports.getOffer = getOffer;
exports.deleteOffer = deleteOffer;
exports.updateOffer = updateOffer;
exports.addOffer = addOffer;