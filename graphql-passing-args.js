var express = require("express");
var graphqlHTTP = require("express-graphql");
var { buildSchema } = require("graphql");

var app = express();

var schema = buildSchema(`
    type Query{
        rollThreeDice(numDice: Int!, numSides: Int): [Int]
    }
`);

var root = {
  rollThreeDice: function(args) {
    var output = [];
    for (var i = 0; i < args.numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (args.numSides || 6)));
    }
    return output;
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

app.listen(6003, () => {
  console.log("server starts");
});
