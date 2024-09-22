const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });


module.exports = {
  PREFIX: ".", //set Prefix
  OWNER: "94701197452",//Enter Owner Number
  USER_NAME: "mrhansamala",//Enter Your UserName 
  PASSWORD: "12345678",
  HIRU_GROUP_JID: ["120363307730093301@g.us"],
  DERANA_GROUP_JID: ["120363307730093301@g.us"],
  ESANA_GROUP_JID: ["120363307730093301@g.us"],
  NASA_GROUP_JID: ["120363307730093301@g.us"],
  TECH_GROUP_JID: ["120363307730093301@g.us"],
  NOTICE_GROUP_JID: ["120363307730093301@g.us"]
};