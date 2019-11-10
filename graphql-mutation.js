var express = require("express");
var { buildSchema } = require("graphql");
var graphqlHTTP = require("express-graphql");

var app = express();
var schema = buildSchema(`
    input MessageInput {
        content: String,
        author: String
    }
    type Message {
        id: ID!,
        content: String,
        author: String
    }
    type Query {
        getMessage(id: ID!): Message,
        getMessages(): [Message]
    }
    type Mutation {
        createMessage(input: MessageInput): Message,
        updateMessage(id: ID!, input: MessageInput): Message
    }
`);

class Message {
  constructor(id, { content, author }) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

var fakeDatabase = {};

var root = {
  getMessage: function(id) {
    if (!fakeDatabase[id]) {
      throw new Error("No Message exists");
    }
    return new Message(id, fakeDatabase[id]);
  },
  getMessages: function() {
    if (Object.keys(fakeDatabase).length == 0) {
      throw new Error("No Messages exists");
    }
    return Object.values(fakeDatabase);
  },
  createMessage: function(input) {
    var id = require("crypto")
      .randomBytes(10)
      .toString("hex");
    var latestMsg = new Message(id, input);
    fakeDatabase[id] = latestMsg;
    return latestMsg;
  }
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(6004, () => {
  console.log("server starts");
});
