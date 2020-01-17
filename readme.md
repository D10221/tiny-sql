tiny ms-sql tools

Install:

    npm i @d10221/tiny-sql

    yarn add @d10221/tiny-sql

Or individual packages

- @d10221/tiny-sql-batch-script  
- @d10221/tiny-sql-connect  
- @d10221/tiny-sql-connection-config  
- @d10221/tiny-sql-connection-factory  
- @d10221/tiny-sql-connection-string-parse  
- @d10221/tiny-sql-exec-sql  
- @d10221/tiny-sql-params  
- @d10221/tiny-sql-scripts  


Usage:  
see tests

Scripts:

set-version:  
| sets packages/**/packkage.json#version from root package.json#version,  
also in lerna.json (just in case)

set-private:  
| sets ./package.json#private=value where value true|false