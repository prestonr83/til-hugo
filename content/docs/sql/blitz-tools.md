---
title: "Blitz Tools"
date: 2021-11-07T09:14:18-04:00
description: Notes on using Blitz tools
---

## Check Server Health
----
Use sp_Blitz to check the overall server health. This will check configuration issues on the server itself.

```sql
sp_Blitz
	@CheckUserDatabaseObjects = 0,
	@CheckServerInfo = 1
```

Use can log these results to a table and setup a job to execute daily/weekly to monitor configuration over time.

```sql
sp_Blitz @OutputDatabaseName = 'DBAtools',
	@OutputSchemaName = 'dbo',
	@OutputTableName = 'BlitzResults'
```

## Check Active Issues
----

Use sp_BlitzFirst to check for active SQL server issues. This will show active queries, wait types and performance counters and sample over a period. 

```sql
sp_BlitzFirst
	@ExpertMode = 1, --Return additional data
	@Seconds = 60    --Take samples for 60 seconds
```

{{< boxmd >}}
#### You should focus on these top wait types and use the `sp_BlitzIndex` or `sp_BlitzCache` reccomendations below to find causes.

* CXPACKET/CXCONSUMER
    * Set CTFP & MAXDOP to good defaults: [BrentOzar.com/go/cxpacket](http://brentozar.com/go/cxpacket)
    * Look past this wait type for your next wait, tune that
* SOS_SCHEDULER_YIELD
    * Look for queries using high CPU: `sp_BlitzCache @SortOrder = 'cpu'`
* PAGEIOLATCH%
    * Look for queries reading a lot of data: `sp_BlitzCache @SortOrder = 'reads'`
    * Look for high-value missing indexes: `sp_BlitzIndex @GetAllDatabases = 1`
* ASYNC_NETWORK_IO: *MORE INFO NEEDED*
* WRITELOG, HADR_SYNC_COMMIT
  * Queries doing lots of writes: `sp_BlitzCache @SortOrder = 'writes'`
* LCK%:
  * Look for aggressive indexes: `sp_BlitzIndex @GetAllDatabases = 1`

{{< /boxmd >}}

### Setup SQL Job to monitor performance

Setup the following query in a SQL job to execute every 15 minutes to log performance. This will also generate a set of views that can be used to show deltas between executions for waits and perf counters.

{{< alert theme="warning" dir="ltr" >}}
Database must be created first
{{< /alert >}}

```sql
sp_BlitzFirst
    @OutputDatabaseName = typically 'DBAtools'
    ,@OutputSchemaName = 'dbo'
    ,@OutputTableName = 'BlitzFirst' - the quick diagnosis result set goes here
    ,@OutputTableNameFileStats = 'BlitzFirst_FileStats'
    ,@OutputTableNamePerfmonStats = 'BlitzFirst_PerfmonStats'
    ,@OutputTableNameWaitStats = 'BlitzFirst_WaitStats'
    ,@OutputTableNameBlitzCache = 'BlitzCache'
    ,@OutputTableNameBlitzWho = 'BlitzWho'
```

### Find Top waits since boot

You can execute the following query to get the top wait types since server boot

```sql
sp_BlitzFirst @SinceStartup = 1
```
## Checking plan cache
----

You can use `sp_BlitzCache` to investigate the plan cache for different wait types

```sql
sp_BlitzCache @SortOrder = ''
```
Set your sort order based on top waits

- reads - logical reads
- CPU - from total_worker_time in sys.dm_exec_query_stats
- executions - how many times the query ran since the CreationDate
- xpm - executions per minute, derived from the CreationDate and LastExecution
- recent compilations - if you're looking for things that are recompiling a lot
- memory grant - if you're troubleshooting a RESOURCE_SEMAPHORE issue and want to find queries getting a lot of memory
- writes - if you wanna find those pesky ETL processes
- You can also use average or avg for a lot of the sorts, like @SortOrder = 'avg reads'

## Index Tuning
----

You can use `sp_BlitzIndex` to help with Index tuning.

```sql
EXEC sp_BlitzIndex @GetAllDatabases = 1, @Mode = 0; /* Default - Least warnings */
EXEC sp_BlitzIndex @GetAllDatabases = 1, @Mode = 4; /* ALL warnings */
EXEC sp_BlitzIndex @GetAllDatabases = 1, @Mode = 2; /* ALL existing indexes */
EXEC sp_BlitzIndex @GetAllDatabases = 1, @Mode = 3; /* Missing indexes */
```

- Focus on issues 50 through 1
- Lower values are long term goals

Get the database and query out of 'More Info' to focus on a specific Database and Table using the following query.

```sql
EXEC dbo.sp_BlitzIndex @DatabaseName='' /* Database Name */
                    ,@SchemaName=''     /* Schema Name */
                    ,@TableName='';     /* Table Name */
```

For more on Index tuning see [Index Tuning](index-tuning/)