var express = require("express");
var graphqlHTTP = require("express-graphql");
var { buildSchema } = require("graphql");

var app = express();

var schema = buildSchema(`
    type Query{
        quoteOfTheDay: String,
        random: Float!,
        rollThreeDice: [Int]
    }
`);

var root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? "Javascript world" : "Php world";
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(function(x) {
      return 1 + Math.floor(Math.random() * 6);
    });
  }
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(6002, () => {
  console.log("server starts");
});
