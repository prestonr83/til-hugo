---
title: "Troubleshooting"
date: 2021-11-06T15:52:52-04:00
description: Troubleshooting Scripts
---
## Find blocking spids/queries
---

Use the following script if not using `sp_blitzwho` or `sp_whoisactive`

```sql
-- List down all the blocking process or root blockers
SELECT  DISTINCT p1.spid  AS [Blocking/Root Blocker SPID]
        , p1.[loginame] AS [RootBlocker_Login]
    , st.text AS [SQL Query Text]
        , p1.[CPU]
        , p1.[Physical_IO]
        , DB_NAME(p1.[dbid]) AS DBName
        , p1.[Program_name]
        , p1.[HostName]
        , p1.[Status]
        , p1.[CMD]
        , p1.[Blocked]
        , p1.[ECID] AS [ExecutionContextID]
FROM  sys.sysprocesses p1
INNER JOIN  sys.sysprocesses p2 ON p1.spid = p2.blocked AND p1.ecid = p2.ecid 
CROSS APPLY sys.dm_exec_sql_text(p1.sql_handle) st
WHERE p1.blocked = 0 
ORDER BY p1.spid, p1.ecid
-- List Down all the blocked processes
SELECT p2.spid AS 'Blocked SPID'
        , p2.blocked AS 'Blocking/Root Blocker SPID'
        , p2.[loginame] AS [BlockedSPID_Login]
        ,  st.text AS [SQL Query Text]
        , p2.[CPU]
        , p2.[Physical_IO]
        , DB_NAME(p2.[dbid]) AS DBName
        , p2.[Program_name]
        , p2.[HostName]
        , p2.[Status]
        , p2.[CMD]
        , p2.ECID AS [ExecutionContextID]
FROM sys.sysprocesses p1 
INNER JOIN sys.sysprocesses p2 ON p1.spid = p2.blocked AND p1.ecid = p2.ecid
CROSS APPLY sys.dm_exec_sql_text(p1.sql_handle) st
```

## Find connections and running queries
---
### List all active connections

* `sp_who2 active` - Bultin not much details
* `sp_whoIsActive` - Much more detailed lots of filtering options [Download Link](http://whoisactive.com/)
* `sp_BlitzWho` - Great Detail takes a bit longer to execute. Part of First responder kit [Download Link](https://www.brentozar.com/first-aid/)

### Get full query text for SPID

Both `sp_whoIsActive` and `sp_BlitzWho` provide the running query. However the following can be used with a SPID without external scripts.

```sql
DBCC INPUTBUFFER(<SPID>)
```

#### Get Just the running portion of multiquery script from SPID.

```sql
DECLARE @SPID int;
SET @SPID = <SPID>

SELECT SDER.[statement_start_offset],  
  SDER.[statement_end_offset], 
  CASE  
     WHEN SDER.[statement_start_offset] > 0 THEN 
        --The start of the active command is not at the beginning of the full command text
        CASE SDER.[statement_end_offset] 
           WHEN -1 THEN 
              --The end of the full command is also the end of the active statement
              SUBSTRING(DEST.TEXT, (SDER.[statement_start_offset]/2) + 1, 2147483647)
           ELSE  
              --The end of the active statement is not at the end of the full command
              SUBSTRING(DEST.TEXT, (SDER.[statement_start_offset]/2) + 1, (SDER.[statement_end_offset] - SDER.[statement_start_offset])/2)  
        END 
     ELSE 
        --1st part of full command is running
        CASE SDER.[statement_end_offset] 
           WHEN -1 THEN 
              --The end of the full command is also the end of the active statement
              RTRIM(LTRIM(DEST.[text])) 
           ELSE 
              --The end of the active statement is not at the end of the full command
              LEFT(DEST.TEXT, (SDER.[statement_end_offset]/2) +1) 
        END 
     END AS [executing statement], 
  DEST.[text] AS [full statement code] 
FROM sys.[dm_exec_requests] SDER CROSS APPLY sys.[dm_exec_sql_text](SDER.[sql_handle]) DEST 
WHERE SDER.session_id = @SPID
ORDER BY SDER.[session_id], SDER.[request_id]
```

## SQL Diagnostic Connection
---
When troubleshooting SQL if the server is unresponsive and you are unable to connect via SSMS then you can use a Diagnostic connection.

Microsoft Documentation Link - [Diagnostic Connection for Database Administrators](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/diagnostic-connection-for-database-administrators?view=sql-server-ver15)

Steps for connection

* Open SSMS
* Close the Login Window
* Click File &gt; New &gt; Database Engine Query
* append `admin:` to the server name and login with valid SA level credentials
