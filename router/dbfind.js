const User = require("../model/user");

function dbfind(id) {
  return new Promise((resolve, reject) => {
    User.findOne({
        id
    })
  });
}
