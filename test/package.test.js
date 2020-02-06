const { execSql, connect, config, using, withTransaction } = require("../");

process.env.DB =
  `Data Source=${process.env.SQL_SERVER_DATA_SOURCE};` +
  `Initial Catalog=${process.env.SQL_SERVER_DATABASE};` +
  `user=${process.env.SQL_SERVER_USER};` +
  `password=${process.env.SQL_SERVER_PASSWORD};` +
  `encrypt=false;`;

const getName = name => execSql("select @name as name", { name });
const getConnection = () => connect(config.from("DB", process.env));

describe("js-package", () => {
  it("works", async () => {
    const { values } = await using(getConnection)(
      withTransaction(getName("me")),
    );
    expect(values[0].name).toBe("me");
  });
});
