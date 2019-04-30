const textMsgs = require('./text');
const imageMsgs = require('./image');
const audioMsgs = require('./audio');
const videoMsgs = require('./video');
const fileMsgs = require('./file');
const richtextMsgs = require('./richtext');
const qaMsgs = require('./qa');
const cardMsgs = require('./card');
const miniProgramCardMsgs = require('./miniProgramCard');
const workflowMsgs = require('./workflow');
const sysMsgs = require('./sys');

const kefu = {
	"id": 90105,
	name: 'sch',
	"username": "sch",
	"realname": "sch",
	"nickname": "sch",
	"role": 1,
	"email": "",
	"theme": 0,
	"pinyin": "sch",
	"portrait": "https://ysf.nosdn.127.net/ec31227429d8535613bbce7a291a38bb",
	"onlineStatus": 0,
	"isformal": 1,
	"status": 1,
	"maxSession": 10,
	"rightStatus": 36015568519692159,
	"skillScoreChat": 5,
	"skillScoreIpcc": 5,
	"callEnable": 1,
	"subRoleId": 345491,
	"userHttps": 0,
	"imtoken": "87b2ec16d1da46a190bdca87c41aab1a",
	"imid": "fcb6a961b9853d2f912734cb1eab@kf@"
};

const user = {
	"id": 6155735,
	name: 'sch',
	"realname": "Guest6155735",
	"mobile": "",
	"email": "",
	"yxId": "a0b594aa121f624ecccd1ba691c3ebb1",
	"foreignId": "",
	"vipLevel": 0,
	"card": 1,
	"crmId": "5c35911cbc3f3bcaa554204a",
	"showInCrm": 1,
	"leadsLevel": ""
};

let initialId = 12345,
	initialTime = + new Date;
let msgList = [];
msgList = msgList.concat(textMsgs).concat(imageMsgs).concat(audioMsgs).concat(videoMsgs).concat(fileMsgs).concat(richtextMsgs).concat(qaMsgs).concat(cardMsgs).concat(miniProgramCardMsgs).concat(workflowMsgs).concat(sysMsgs);
msgList.forEach((msg) => {
	msg.id = initialId++;
	msg.msgIdClient = msg.id;
	msg.time = initialTime++;
	msg.kefu = kefu;
	msg.user = user;
});


module.exports = {
	msgList: msgList
};