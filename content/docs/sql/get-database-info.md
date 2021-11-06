---
title: "Get Database Info"
date: 2021-11-06T15:55:46-04:00
description: 
---

## Get Database Sizes
----
```sql
SELECT [Database Name] = DB_NAME(database_id),
    [Type] = CASE WHEN Type_Desc = 'ROWS' THEN 'Data File(s)'
                    WHEN Type_Desc = 'LOG'  THEN 'Log File(s)'
                    ELSE 'Combined Total' END,
    [Size in MB] = CAST( ((SUM(Size)* 8) / 1024.0) AS DECIMAL(18,2) )
FROM sys.master_files
--WHERE database_id = DB_ID(‘Database Name’)
GROUP BY GROUPING SETS
            (
                (DB_NAME(database_id), Type_Desc),
                (DB_NAME(database_id))
            )
ORDER BY DB_NAME(database_id), Type_Desc DESC
GO
```

## List all Database filenames and locations
----
```sql
SELECT
    db.name AS DBName,
    mf.name AS FileName,
    type_desc AS FileType,
    Physical_Name AS Location
FROM
    sys.master_files mf
INNER JOIN 
    sys.databases db ON db.database_id = mf.database_id
```

## List CLR References
----
```sql
SELECT      so.name AS [ObjectName],
            so.[type],
            SCHEMA_NAME(so.[schema_id]) AS [SchemaName],
            asmbly.name AS [AssemblyName],
            asmbly.permission_set_desc,
            am.assembly_class, 
            am.assembly_method
FROM        sys.assembly_modules am
INNER JOIN  sys.assemblies asmbly
        ON  asmbly.assembly_id = am.assembly_id
        AND asmbly.is_user_defined = 1 -- if using SQL Server 2008 or newer
--      AND asmbly.name NOT LIKE 'Microsoft%' -- if using SQL Server 2005
INNER JOIN  sys.objects so
        ON  so.[object_id] = am.[object_id]
UNION ALL
SELECT      at.name AS [ObjectName],
            'UDT' AS [type],
            SCHEMA_NAME(at.[schema_id]) AS [SchemaName], 
            asmbly.name AS [AssemblyName],
            asmbly.permission_set_desc,
            at.assembly_class,
            NULL AS [assembly_method]
FROM        sys.assembly_types at
INNER JOIN  sys.assemblies asmbly
        ON  asmbly.assembly_id = at.assembly_id
        AND asmbly.is_user_defined = 1 -- if using SQL Server 2008 or newer
--      AND asmbly.name NOT LIKE 'Microsoft%' -- if using SQL Server 2005
ORDER BY    [AssemblyName], [type], [ObjectName]
```

## List User Role Assignments
---
```sql
SELECT DP1.name AS DatabaseRoleName,   
    isnull (DP2.name, 'No members') AS DatabaseUserName   
FROM sys.database_role_members AS DRM  
RIGHT OUTER JOIN sys.database_principals AS DP1  
    ON DRM.role_principal_id = DP1.principal_id  
LEFT OUTER JOIN sys.database_principals AS DP2  
    ON DRM.member_principal_id = DP2.principal_id  
WHERE DP1.type = 'R'
ORDER BY DP1.name;
```

