---
title: "Retry Logic"
date: 2021-11-04T14:04:32-04:00
description: 
---
# Simple Retry Logic Loop

```powershell
$Stoploop = $false
[int]$Retrycount = "0"

do {
    try {
        Scripts Commands here
        Write-Host "Job completed"
        $Stoploop = $true
    }
    catch {
        if ($Retrycount -gt 3){
            Write-Host "Could not complete after 3 retrys."
            $Stoploop = $true
        }
        else {
            Write-Host "Could not complete retrying in 30 seconds..."
            Start-Sleep -Seconds 30
            $Retrycount = $Retrycount + 1
        }
    }
} While ($Stoploop -eq $false)
```

