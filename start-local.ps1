$ErrorActionPreference = "Stop"

$port = 5500
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

function Test-PortInUse {
  param([int] $Port)
  try {
    $client = New-Object System.Net.Sockets.TcpClient
    $result = $client.BeginConnect("127.0.0.1", $Port, $null, $null)
    $success = $result.AsyncWaitHandle.WaitOne(200, $false)
    if ($success) {
      $client.EndConnect($result)
      $client.Close()
      return $true
    }
    $client.Close()
    return $false
  } catch {
    return $false
  }
}

while (Test-PortInUse -Port $port) {
  $port++
}

$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
  $python = Get-Command py -ErrorAction SilentlyContinue
}

if (-not $python) {
  Write-Host "Python was not found. Opening index.html directly."
  Start-Process (Join-Path $root "index.html")
  exit 0
}

$exe = $python.Source
if ($python.Name -eq "py.exe") {
  $args = @("-3", "-m", "http.server", $port, "--bind", "127.0.0.1")
} else {
  $args = @("-m", "http.server", $port, "--bind", "127.0.0.1")
}

Start-Process -FilePath $exe -ArgumentList $args -WorkingDirectory $root -WindowStyle Hidden
Start-Sleep -Milliseconds 600

$url = "http://127.0.0.1:$port/"
Write-Host "Local preview started: $url"
Start-Process $url
