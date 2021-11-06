---
title: "Get Virtual Disks"
date: 2021-11-04T14:03:31-04:00
description: Get Virtual Disks by Failover Node
---

# Get Virtual Disks by Node in Failover cluster

```powershell
$Nodes = get-storagenode
$disks = @()
Foreach($node in $nodes){
    $pools = Get-StoragePool -StorageNode $node 
    Foreach($pool in $pools){
        if($pool.IsPrimordial -eq $true){continue}
        $info = $pool | Get-VirtualDisk
        $disks += [PSCustomObject]@{
            FriendlyName = $info.FriendlyName
            ResiliencySettingName = $info.ResiliencySettingName
            NumberOfColumns = $info.NumberOfColumns
            Interleave = $info.Interleave
            Size = $info.Size / 1GB
            Node = $node.Name
            Pool = $pool.FriendlyName
            OperationalStatus = $info.OperationalStatus
            HealthStatus = $info.HealthStatus
        }
    }
}
$disks | ft
```

