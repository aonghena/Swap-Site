//Generates User object
module.exports.User = function User(userID, password, firstName, lastName, email, addr1, addr2, city, state, postCode, country) {
    this.userID = userID;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.addr1 = addr1;
    this.addr2 = addr2;
    this.city = city;
    this.state = state;
    this.postCode = postCode;
    this.country = country;
  }