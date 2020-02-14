import {
  beginTransaction,
  commit,
  config,
  connect,
  ExecParams,
  execSql,
  query,
  Result,
  rollback,
  using,
  withTransaction,
} from "../";

describe("typescript packagee", () => {
  it("exports", () => {
    let x: ExecParams | Result | undefined = undefined;
    expect(typeof x).toBe("undefined");
    expect(
      [
        config,
        connect,
        execSql,
        query,
        beginTransaction,
        commit,
        rollback,
        withTransaction,
        using,
      ].reduce((prev, next) => prev && typeof next === "function", true),
    );
  });
});
