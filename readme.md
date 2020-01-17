Debug:

```bash
$ export DEBUG='D10221/tiny-sql:*' 
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