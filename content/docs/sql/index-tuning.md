---
title: "Index Tuning"
date: 2021-11-07T09:41:50-04:00
description: Notes of Index Tuning
---

Use `sp_BlitzIndex` to find problem queries and stats on existing indexes. [Info Here](blitz-tools/#Index-Tuning)

## Includes vs Index Column
----
Includes do not sort. Examples

This index 

```sql
Create Index IX_DisplayName_Include_Location
  ON dbo.Users(DisplayName) Include (Location);
```

Is equivalent to this query

```sql
Select Id, DisplayName, Location
  FROM dbo.Users
  ORDER By DisplayName;
```

This index 

```sql
Create Index IX_DisplayName_Location
  ON dbo.Users(DisplayName, Location);
```

Is equivalent to this query

```sql
Select Id, DisplayName, Location
  FROM dbo.Users
  ORDER By DisplayName, Location;
```

## Enable Statistics when testing

Always enable IO Statistics and CPU Statistics when testing to see the impact your changes are making.

```sql
SET STATISTICS IO ON
SET STATISTICS TIME ON 
```

Use [Statistics Parser](http://statisticsparser.com/) to parse the output for better formatting if creating reports.