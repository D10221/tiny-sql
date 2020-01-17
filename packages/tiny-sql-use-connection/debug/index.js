function getValue() {
    const { default: connect } = require("@d10221/tiny-sql-connect-to-server");
    const { default: execSql } = require("@d10221/tiny-sql-exec-sql");
    const { default: using } = require("../lib");
    const ex = (...args) => (connection) => execSql(connection)(...args)
    return using(connect)(ex("select id=1")).then(x => x.values[0].id);
}
getValue().then(console.log);
