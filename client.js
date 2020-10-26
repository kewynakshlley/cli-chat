var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
var readline = require("readline");


var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("protos/chat.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

const REMOTE_SERVER = "0.0.0.0:5001";

let username;
let channelNumber;


let client = new proto.Chat(
    REMOTE_SERVER,
    grpc.credentials.createInsecure()
);


function startChat() {
    let channel = client.join({ user: username });

    channel.on("data", onData);

    rl.on("line", function (text) {
        client.send({ user: username, text: text }, res => { });
    });
}


function onData(message) {
    if (message.user == username) {
        return;
    }
    console.log(`${message.user}: ${message.text}`);
}


function question(theQuestion) {
    return new Promise(resolve => rl.question(theQuestion, answ => resolve(answ)))
}

askQuestions()

async function askQuestions(){
    username = await question("What's ur name? ")
    channelNumber = await question("What is the channel? ")
    startChat();

}
