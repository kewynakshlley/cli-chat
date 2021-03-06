var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

const server = new grpc.Server();
const SERVER_ADDRESS = "0.0.0.0:5001";

let proto = grpc.loadPackageDefinition(
  protoLoader.loadSync("protos/chat.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
);

let users = [];

function join(call, callback) {
  users.push(call);

  notifyChat({ user: "Server", text: "new user joined ..." });
}


function send(call, callback) {


  notifyChat(call.request);
}

function notifyChat(message) {
  console.log(message.grpc_channel)
  users.forEach(user => {
    user.write(message);
  });
}

server.addService(proto.Chat.service, { join: join, send: send });

server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());

console.log("Server running on "+SERVER_ADDRESS)

server.start();