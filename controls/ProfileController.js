var express = require('express');
var app = express();
var path = require("path");;
var ItemDB = require(__dirname+"/../models/ItemDB")
var UserDB = require(__dirname+"/../models/UserDB")
var OfferDB = require(__dirname+"/../models/OfferDB")
var FeedbackDB = require(__dirname+"/../models/FeedbackDB")
var crypto = require('crypto');
var mongoose = require('mongoose'); 
const { check, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var validator = require('validator');

app.set('view engine', 'ejs');
app.use('/resource',express.static('resource'));
app.set('/views', 'views');

var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({extended: false});

//session handling
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(session({secret: "nbad session secret"}));



/**
 * Overview
 * This the profile controller.
 * 
 */




var theUser;
var currentProfile;
var swapBook;




/**
 * update
 * redirects to either swaps or the item depending on the status of the item
 * @param {*} req 
 * @param {*} res 
 */
async function update(req, res){
  var t = await ItemDB.getUserItems(req.session.user.userID);
  var item = null;
  //gets the item from the database
  for(var x in t){
    if(t[x].itemCode == req.query.theItem){
      item = t[x];
    }
  }
 //if item is found
 if(item != null){
      if(item.Status == "pending"){
        res.redirect('/mySwaps?swapItem='+item.itemCode);
      }else{
        res.redirect('/item/'+req.query.theItem+'?userItem='+item.itemCode);
      }
  }else{
     res.redirect('/myItems');
  }
}

/**
 * accept
 * Method used to accept a swap
 * @param {} req 
 * @param {*} res 
 */
async function accept(req, res){
  var t = await ItemDB.getUserItems(req.session.user.userID);
  console.log(req.session.user.userID)
  var item = null;
  //find item
  for(var x in t){
    if(t[x].itemCode == req.query.theItem){
      item = t[x];
    }
  }
  //if there is a item
  if(item != null){
    if(item.Status == "pending"){
      //change status back to avaliable
      var st = "";
      if(req.query.action == "reject" || req.query.action == "withdraw"){
        st = "available";
      }else{
        st = "swapped";
      }
      //updates offers.
      if(st == "available"){
        await ItemDB.update(req.session.user.userID, item.itemCode,  st);
        var t = await OfferDB.deleteOffer(req.session.user.userID, item.itemCode);
      }else if(st == "swapped"){
        /**
         * updates item
         * update offer
         * adds new item to users while removing old item from that users.
         */
        await ItemDB.update(req.session.user.userID, item.itemCode, st);
        var t = await OfferDB.getOfferID(req.session.user.userID, item.itemCode);
        await OfferDB.updateOffer(t.offerID, st);
        var newItem = await ItemDB.getItem(t.itemCodeWant);
        console.log(req.session.user.userID)
        await ItemDB.deleteItem(t.itemCodeOwn, req.session.user.userID);
        await ItemDB.addItem(newItem, req.session.user.userID);
        

      }
    }else{
      console.log("not pending so nothing");
    }
  }else{
    res.redirect('/myItems');
  }
  res.redirect('/mySwaps');     
}

/**
 * delete1
 * method used to delete item from users profile.
 * @param {*} req 
 * @param {*} res 
 */
async function delete1(req, res){
  //delets item from database
  await ItemDB.deleteItem(req.query.theItem, req.session.user.userID);
  res.redirect('/myItems');
  
}

/**
 * redirect to swap if item exists and updates cookies
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function offer(req, res){
  var spot = -1;
  var items = await ItemDB.getUserItems(req.session.user.userID);
  var allItems = await ItemDB.getItems(null);
  //verifies that item exists
  for(var x in allItems){
    if(req.path.includes(allItems[x].itemCode)){
      spot++;
    }
  }   
  //redirects to swap and updates cookies
  if(spot != -1){
    req.session.swapItem = req.query.theItem;
    swapBook = req.session.swapItem;
    res.redirect('/swap');
  }else{
    res.redirect('/mySwaps');
  }
}

/**
 * signout
 * method used to destroy user cookies and log out
 * @param {} req 
 * @param {*} res 
 */
function signout(req,res){
  console.log("logout");
  req.session.destroy();
  res.redirect('/categories');
}

/**
 * swapStart
 * initiates a swap.
 * @param {} req 
 * @param {*} res 
 */
async function swapStart(req,res){
  if(req.query.theItem != req.query.myItem){
    await ItemDB.update(req.session.user.userID, req.query.theItem,"pending");//updates user item
    await OfferDB.addOffer(req.session.user.userID, req.query.theItem, req.query.myItem, "pending");//create offer
    res.redirect('mySwaps');
  }else{
    res.redirect('myItems');
  }
} 



/**
 * Used for registration
 */
app.post('/register', urlencodedParser, [
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({ min: 4 }).trim(),
  check('firstName').isAlpha().trim(),
  check('lastName').isAlpha().trim(),
  check('addr1').isAlphanumeric().isLength({ max: 25 }).trim(),
  check('addr2').isLength({ max: 25 }).escape().trim(),
  check('state').isLength({ max: 20 }).escape().trim(),
  check('city').isAlpha().isLength({ max: 20 }).trim(),
  check('postCode').isNumeric().isLength({ max: 10 }).trim(),
  check('country').isAlpha().isLength({ max: 20 }).trim()
  ], async function(req, res, next){
    const errors = validationResult(req);
    if(req.body.email && !req.session.user && errors.isEmpty()){
      try{
        req.session.user = await UserDB.getUserEmail(req.body.email);
      }catch(e){
        req.session.user == null;
      }
      if(req.session.user == null){
        //creates user and salts password
            UserDB.addUser(sha512(req.body.password, SALT), req.body.firstName, req.body.lastName, req.body.email, req.body.addr1, req.body.addr2, req.body.city,
           req.body.state, req.body.postCode, req.body.country).then(docs => {
            console.log("User successfully created");
            res.redirect('signin');
        }).catch(err => {
            console.error(err);
        });
        
      }else{
        console.log("email exists");
        res.redirect('register');
      }

    }else{
      console.log(errors.array());
      console.log("no email or error with input");
      res.redirect('register');
    }
  });

/**
 * Handles sign in request and validates all information is correct for the login process
 * 
 */
app.post('/signin', urlencodedParser,[
check('email').isEmail().normalizeEmail(),
check('password').trim()
], async function(req, res, next){
  const errors = validationResult(req);
  if(req.body.email && errors.isEmpty()){
    req.session.user = await UserDB.getUserEmail(req.body.email);
    if(req.session.user == null){
      console.log("wrong email");
      res.render('login', {message: "Email does not exist"});
      next();
    }
    if(req.body.password != null|| req.session.user != null){
      if(req.session.user.password == sha512(req.body.password, SALT)){
        theUser = req.session.user;
        currentProfile = await ItemDB.getUserItems(req.session.user.userID);
        console.log("successfully logged in!");
        res.redirect('myItems');
      }else{
        console.log("wrong password");
        res.render('login', {message: "Wrong Password"});
      }
    }else{
      if(!res.headersSent) {  
      console.log("no password");
      res.render('login', {message: "Wrong Password"});
      }
    }
  }else{
    console.log("no email or error with input");
    console.log(errors.array());
    res.render('login', {message: "Bad input"});
  }
});

/**
 * This is used to handle when the user rates an item
 */
app.post('/rateItem', urlencodedParser,[
  check('rating').isIn('*****')
  ], async function(req, res, next){
    const errors = validationResult(req);
    console.log(errors.array())
    if(!errors.isEmpty()){
      console.log("Bad Input///////////////////////")
    }
    var t = await ItemDB.getUserItems(req.session.user.userID);
    var item = null;
    //find item
    for(var x in t){
      if(t[x].itemCode == req.query.theItem){
        item = t[x];
      }
    }
    console.log(item + " this is the item")
    if(!errors.isEmpty() & item != null){
      res.render('rate', {message : "Invalid input, only enter * through *****", Book: item});
    }else if(item != null){
      console.log(await ItemDB.userItemRatingUpdate(theUser.userID ,item.itemCode, req.body.rating));
      res.redirect('myItems');
    }else{
      res.redirect('myItems');
    }
    

  });

/**
 * post body
 * I used helper methods above to make this alot eaiser to read.
 * 
 */
app.post('/*',[
  sanitizeBody('action').toString(),
  sanitizeBody('theItem').toString()
],async function(req,res, next){
  if(req.session.user){
    //get action
    if(req.query.action){
      //check actions
      if(req.query.action == "update"){
        await update(req, res);
      }else if(req.query.action == "accept" || req.query.action == "reject" || req.query.action == "withdraw"){
        await accept(req, res);
      }else if(req.query.action == "delete"){
        await delete1(req, res);
      }else if(req.query.action == "offer"){
        await offer(req,res); 
      }else if(req.query.action == "swapStart"){
        await swapStart(req,res);
      }else if(req.query.action == "signout"){
        signout(req,res);
      }else if(req.query.action == "rate"){
        i =  await ItemDB.getItem(req.query.theItem);
        res.render('rate', {message : "", Book: i});
      }
    }
 }else if(req.query.action == "signin"){
  res.redirect('signin');
}else if(req.query.action =="offer"){
  res.redirect('categories');
}
if(res.headersSent) {  
}else{
  console.log("next");
  next();
}
});

/**
 * get body
 * I used helper methods above to make this alot eaiser to read.
 * 
 */
app.use('/',[
  sanitizeBody('action').toString(),
  sanitizeBody('theItem').toString()
], async function(req, res, next){
  if(req.session.user){
    //get action 
    if(req.query.action){
      //check actions
      if(req.query.action == "update"){
        await update(req, res);
      }else if(req.query.action == "accept" || req.query.action == "reject" || req.query.action == "withdraw"){
        await accept(req, res);
      }else if(req.query.action == "delete"){
        await delete1(req, res);
      }else if(req.query.action == "offer"){
        await offer(req,res); 
      }else if(req.query.action == "swapStart"){
        await swapStart(req,res);
      }else if(req.query.action == "signin"){
        signout(req,res);
      }else if(req.query.action == "rate"){
        i =  await ItemDB.getItem(req.query.theItem);
        res.render('rate', {message : "", Book: i});
      }
    }
    
  }else if(req.query.action == "signin"){
    res.redirect('signin');    
  }
  if(res.headersSent || req.query.action == "signin") {  
  }else{
    next();
  }
});

/**
 * Handles myItems get request to get items if user is logged in
 */
app.get('/myItems', async function(req,res, next){
  
  if(!req.session.user){
    res.render('myItems', {Book : null, loggedin : false});
  }else{
  var items = [];
  items = await ItemDB.getUserItems(req.session.user.userID);
  for(var x in items){
    items[x].id = escape(items[x].id) ;
    items[x].itemCode = escape(items[x].itemCode);
    items[x].catalogCategory = validator.blacklist(items[x].catalogCategory, "<>");
    items[x].author = validator.blacklist(items[x].author, "<>;//");
    items[x].des =  validator.blacklist(items[x].des, "<>");
    items[x].rating = validator.blacklist(items[x].rating, "<>");
  }
  res.render('myItems', {Book : items, loggedin : true});
}
});
/**
 * Handles categores request
 * Displays all the items that the user does not currently own
 * Or all if user is not logged in
 */
app.get('/categories', async function(req,res, next){
  if(req.session.user){
    var items = await ItemDB.getAllItemsX(req.session.user.userID);
  }else{
    var items = await ItemDB.getAllItemsX(null);
  }
  //Output sanitization  
    for(var x in items){
      items[x].id = escape(items[x].id) ;
      items[x].itemCode = escape(items[x].itemCode);
      items[x].catalogCategory = validator.blacklist(items[x].catalogCategory, "<>");
      items[x].author = validator.blacklist(items[x].author, "<>;//");
      items[x].des =  validator.blacklist(items[x].des, "<>");
      items[x].rating = validator.blacklist(items[x].rating, "<>");

    }
    res.render("categories", { books: items});
  
  
});

/**
 * Handles get request to populate mySwaps page
 */
app.get('/mySwaps', async function(req,res, next){
  //if there are no users in session, then output blank page
  if(!req.session.user){
    res.render('mySwaps', {Book : null});
  }else{
    items = await ItemDB.getUserItems(req.session.user.userID);
    var pendingOffers = [];
    for(var x in items){
      if(items[x].Status == "pending"){
        pendingOffers.push(await OfferDB.getOfferID(req.session.user.userID, items[x].itemCode));
      }
    }
    console.log(pendingOffers);
  for(var i in pendingOffers){

    var tempOw = (await ItemDB.getItem( pendingOffers[i].itemCodeWant));

    pendingOffers[i].itemCodeWant = tempOw.itemName;
  }
  res.render('mySwaps', {Book : pendingOffers});}
  });

  /**
   * Handles get request for swap
   * Gets user books for the bswap as well as the item that the user is 
   * swapping for
   */
  app.get('/swap',async function(req,res, next){
    var myBooks
    if(!req.session.user){
      res.render('mySwaps', {Book : null});
    }else{
    myBooks = await ItemDB.getUserItems(req.session.user.userID);
    swapBooks = await ItemDB.getItem(swapBook);
    //Output sanitization  
    items = null;
    for(var x in items){
      items[x].id = escape(items[x].id) ;
      items[x].itemCode = escape(items[x].itemCode);
      items[x].catalogCategory = validator.blacklist(items[x].catalogCategory, "<>");
      items[x].author = validator.blacklist(items[x].author, "<>;//");
      items[x].des =  validator.blacklist(items[x].des, "<>");
      items[x].rating = validator.blacklist(items[x].rating, "<>");
    }
    res.render('swap', {book : (swapBooks), myBooks: (myBooks)});
    }
    });

    var SALT = 'FQ12NSC8DSDN';

    var sha512 = function(password, salt){
      var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
      hash.update(password);
      var value = hash.digest('hex');
      return value;
  };



module.exports = app;