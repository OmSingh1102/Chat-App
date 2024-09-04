//used for JWT tokens
//jwt token is used to authorize the user in backend
//suppose user wants to excess an data that only belongs to him,so by JWT we can tell yes the user is authorize


const jwt = require("jsonwebtoken");


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;