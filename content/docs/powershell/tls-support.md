---
title: "Enable TLS 1.2 PWSH"
date: 2021-11-04T14:05:01-04:00
description: Enabling TLS 1.2 for Powershell
---
# Enable TLS 1.2 Support in Powershell script

```powershell
[Net.ServicePointManager]::SecurityProtocol = "tls12, tls11, tls"
```

