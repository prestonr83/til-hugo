---
title: "Reset DSC"
date: 2021-11-04T16:32:45-04:00
description: Reset DSC Configuration
---

# Reset DSC Local Configuration Manager

```powershell
[DscLocalConfigurationManager()]
Configuration ResetLCM {
    Node localhost {
        Settings {
            RebootNodeIfNeeded = $True
            ConfigurationMode = 'ApplyAndMonitor'
            RefreshMode = 'Push'
            ActionAfterReboot = 'ContinueConfiguration'
        }
    }
}

ResetLCM -out c:\$env:temp\resetLCM
Set-DscLocalConfigurationManager -Path C:\$env:temp\resetLCM -Verbose
```
