Query:

```bash
$ docker exec -t $SQL_CONTAINER 'bash'
# once in
$/opt/mssql-tools/bin/sqlcmd -S $SQL_SERVER_DATA_SOURCE -U SA -P $SQL_SERVER_PASSWORD -d $SQL_SERVER_DATABASE
```

... Or ...

```bash
docker exec -it $SQL_CONTAINER "/opt/mssql-tools/bin/sqlcmd" -S $SQL_SERVER_DATA_SOURCE -U SA -P $SQL_SERVER_PASSWORD -d $SQL_SERVER_DATABASE
```