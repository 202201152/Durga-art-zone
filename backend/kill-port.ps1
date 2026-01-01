# PowerShell script to kill process on port 5000
# Usage: .\kill-port.ps1

$port = 5000
$processId = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue).OwningProcess

if ($processId) {
    Write-Host "Found process $processId using port $port"
    Stop-Process -Id $processId -Force
    Write-Host "✅ Process killed. Port $port is now free."
} else {
    Write-Host "✅ Port $port is already free."
}


