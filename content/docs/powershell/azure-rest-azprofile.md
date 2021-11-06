---
title: "Azure Rest API"
date: 2021-11-04T13:59:56-04:00
description: Using Azure Rest API with AZ Profile
---

#### Azure Rest API Authentication Using AZ Profile Credentials

[Rest API References](https://docs.microsoft.com/en-us/rest/api/azure/)

```powershell
Add-Type -AssemblyName System.Web
$resource = "https://management.azure.com" #Set to the root of the API Call. 
$context = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile.DefaultContext
$Token = [Microsoft.Azure.Commands.Common.Authentication.AzureSession]::Instance.AuthenticationFactory.Authenticate($context.Account, $context.Environment, $context.Tenant.Id.ToString(), $null, [Microsoft.Azure.Commands.Common.Authentication.ShowDialog]::Never, $null, $resource).AccessToken
$header = @{Authorization = "Bearer " + $token }

$results = Invoke-RestMethod -Method Get -Headers $header -uri "<AZURE REST URL>"
```

