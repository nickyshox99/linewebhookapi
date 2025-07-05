const dotenv = require('dotenv');
dotenv.config();

const oSecretkey = { 
    SecretKey: process.env.SECRET_KEY?process.env.SECRET_KEY:'AAABBBCCCDDDEEEF',
    ExpiresIn: process.env.EXPIRE_IN?process.env.EXPIRE_IN:86400,
    ExpiresLabel: process.env.EXPIRE_LABEL?process.env.EXPIRE_LABEL:'86400s',    
    apiDomain:process.env.API_DOMAIN?process.env.API_DOMAIN:'http://localhost:9500/',
};

module.exports = oSecretkey;