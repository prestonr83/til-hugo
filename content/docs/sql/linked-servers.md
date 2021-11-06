---
title: "Linked Servers"
date: 2021-11-04T16:41:09-04:00
description: Script for Linked Servers
---
## Add Login Mapping to Linked Server
----
### Mapped Login to Remote SQL Login

```sql
USE [master]
GO
EXEC master.dbo.sp_addlinkedsrvlogin 
    @rmtsrvname = N'<SERVER NAME>'
    ,@locallogin = N'<LOCAL LOGIN>'
    ,@useself = N'False'
    ,@rmtuser = N'<REMOTE LOGIN>'
    ,@rmtpassword = N'<REMOTE PASSWORD>'
```

### User Impersonation

```sql
USE [master]
GO
EXEC master.dbo.sp_addlinkedsrvlogin 
    @rmtsrvname = N'<SERVER NAME>'
    ,@locallogin = N'<LOCAL LOGIN>'
    ,@useself = N'True'
```

## Detailed Linked Server Report
----
```sql
SELECT *
FROM sys.Servers a
LEFT OUTER JOIN sys.linked_logins b ON b.server_id = a.server_id
LEFT OUTER JOIN sys.server_principals c ON c.principal_id = b.local_principal_id
```

## Find SQL Linked Server Depdendencies
---
```sql
SELECT 
    Distinct 
    referenced_Server_name As LinkedServerName,
    referenced_schema_name AS LinkedServerSchema,
    referenced_database_name AS LinkedServerDB,
    referenced_entity_name As LinkedServerTable,
    OBJECT_NAME (referencing_id) AS ObjectUsingLinkedServer
FROM sys.sql_expression_dependencies
JOIN sys.objects o on o.object_id = referencing_id
-- WHERE o.name = '<VIEW / SPROC NAME>' --UNCOMMENT TO FILTER ON SPECIFIC VIEW OR SPROC
```
