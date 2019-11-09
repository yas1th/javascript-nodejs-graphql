var { graphql, buildSchema } = require("graphql");

var schema = buildSchema(`
    type Query{
        hello: String
    }
`);

var root = {
  hello: () => {
    return "Hello World!";
  }
};

graphql(schema, "{hello}", root)
  .then(res => {
    console.log("graphql response is", res);
  })
  .catch(err => {
    console.log("error is", err);
  });
