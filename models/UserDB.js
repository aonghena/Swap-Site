//User
function User(userID, firstName, lastName, email, addr1, addr2, city, state, postCode, country) {
    this.userID = userID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.addr1 = addr1;
    this.addr2 = addr2;
    this.state = state;
    this.postCode = postCode;
    this.country = country;
  }

  function UserItem(Item, Rating, Status, SwapItem, SwapItemRating, SwapperRating) {
    this.Item = Item;
    this.Rating = Rating;
    this.Status = Status;
    this.SwapItem = SwapItem;
    this.SwapItemRating = SwapItemRating;
    this.SwapperRating = SwapperRating;
  }

  function UserProfile(UserID, UserItems) {
    this.UserID = UserID;
    this.UserItems = UserItems;
  }

  function setUserProfile(UserItems){
    this.UserItem = UserItems;
  }
  UserProfile.prototype.emptyProfile = function(){
    this.UserProfile.setUserProfile("");
  }

  UserProfile.prototype.getUserItem = function(Item){
    return this.Items;
  }

  var Sara = new User("S1", "Sarah", "Smith", "Sara@gmail.com", "12 UNCC", "13 UNCC", "North Carolina", "28223", "USA");
  var book  =  new UserItem(getItems()[1],"2", "s", "no", "3", "4");
  var SaraProfile = new UserProfile(Sara, book);
  