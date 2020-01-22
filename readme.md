Familiar usage interface, Promise only, composable, easy to use, mssql query utility.  

Designed to be use with RAW MS-SQL dialect ONLY.
And named parameters like "`{ name: 'me'}`"

Is NOT: Full featured, NOT prod ready, NOT finished, you probably want to use knex instead.

Depends on:
```json
"tedious": "8.0.1"
```

Debug:

```bash
$ export DEBUG='d10221/tiny-sql:*' 
```

Build:  
```bash
$ yarn test && yarn build
```

Connection string: 

```bash
$export DB="server=localhost;database=testdb;user=test;password=test;encrypt=false"    
```

Connection Config: 

```json
{ 
    "server": "localhost",
    "authentication" :{
        "type": "default",
        "options": {
            "userName": "sa",
            "password": "supersecret",
        }
    },
    "options": {
        "database": "testdb",
        "encrypt": false
    }
}
```

Usage: 

```typescript
import { Exec, connect, config } from "../src";
import { Connection } from "tedious";

process.env.DB = "Data Source=localhost;Initial Catalog=testdb;user=test;password=test;encrypt=false";

const getName = (name: string) => Exec<{ name: string }>("select @name as name", { name });

describe("usage", () => {
    it("works", async () => {
        let connection: Connection;
        try {
            connection = await connect(config("DB"));
            const { values } = await getName("me")(connection);
            expect(values[0].name).toBe("me");
        } finally {
            connection && connection.close();
        }
    })
})
```
API (unstable):

Exports
```typescript
import { 
    config,  
    connect, 
    connectFty, 
    Exec,
    ExecSql, 
    useConnection 
    } from "d10221/tiny-sql";
```

type: `config (key = "DB"): ConnectionConfig`  

type: `connect (args: ConnectionConfig | Connection) -> Promise<Connection>`  

type: `connectFty: (envKey = "DB") -> Promise<Connection>`

type: `Result<T> = { values?: T[]; rowCount?: number, rows?: any[]     };`

type: `ExecParams = TediousParameter[] | {}[] | {};`

type: `Exec <T>(sqlTxt: string, args?: ExecParams) -> (connection: Connection) -> Result<T>`

type: `using(getConnection: () => Promise<Connection>) -> <T>(callback: (connection: Connection) => T)-> Promise<T>`

Notes:   

𐄂 It always returns a collection.  
𐄂 There is no single exec or query  
𐄂 ExecParams dot not map all possible types

Query re-use:

```typescript
// mini middleware signature
const exec = <ParameterType, ResultType>(query: string) => 
        (p: ParameterType | undefined = undefined) => 
            (connection: Connection) => 
                ExecSql<ResultType>(query, p)(connection);
// expected parameter type: (Typescript only)
type ParameterType = { date: any };
// expected return type
type ResultType = { date: any };
// Declare query
const dateQuery = exec<ParameterType, >(`
create table #temp (date DATE not null)
insert into #temp (date) VALUES (@date);
select * from #temp
`);
// Exec query 
const result = await dateQuery({ date: "2020-01-01" })( await connect());
```

