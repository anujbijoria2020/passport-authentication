const bcrypt = require("bcrypt");

exports.doHash =(password,setValue)=>{
return bcrypt.hash(password,setValue);
}
exports.comparePassword = (password,hashedPassword)=>{
    return bcrypt.compare(password,hashedPassword);
}
