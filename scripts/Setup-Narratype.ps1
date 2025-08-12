<#
.SYNOPSIS
  Local setup for Narratype on Windows PowerShell 7+
.NOTES
  - Idempotent, avoids hard-coded paths
  - Uses [Environment]::SetEnvironmentVariable for user scope when needed
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Assert-Tool {
    param(
        [Parameter(Mandatory)] [string] $Command
    )
    if (-not (Get-Command $Command -ErrorAction SilentlyContinue)) {
        throw "ERROR: Missing required command: $Command"
    }
}

function Get-ProjectRoot {
    param(
        [string] $StartPath = (Get-Location).Path
    )
    $current = $StartPath
    while ($true) {
        if (Test-Path (Join-Path $current 'package.json')) { return $current }
        $parent = Split-Path $current -Parent
        if (-not $parent -or $parent -eq $current) { throw "ERROR: Could not locate project root from $StartPath" }
        $current = $parent
    }
}

function Ensure-Directory {
    param([Parameter(Mandatory)][string] $Path)
    if (-not (Test-Path $Path)) { New-Item -ItemType Directory -Path $Path | Out-Null }
}

try {
    Assert-Tool -Command 'node'
    Assert-Tool -Command 'npm'

    $root = Get-ProjectRoot
    Push-Location $root

    Write-Host 'INFO: Installing dependencies...' -ForegroundColor Cyan
    npm install --no-fund --no-audit | Out-Host

    # Ensure folders for local data
    Ensure-Directory -Path (Join-Path $root 'texts')
    Ensure-Directory -Path (Join-Path $root 'texts\custom')
    Ensure-Directory -Path (Join-Path $root 'texts\technical')
    Ensure-Directory -Path (Join-Path $root 'exercises\generated')
    Ensure-Directory -Path (Join-Path $root 'database')

    # Optional sample text
    $sample = @(
        '# title: Programming Basics',
        '# author: Narratype',
        '# difficulty: Easy',
        '# category: Technical',
        '',
        'Typing improves with consistent practice. Keep your wrists relaxed and eyes on the screen. Practice home row first, then expand.'
    ) -join "`n"
    $samplePath = Join-Path $root 'texts\technical\programming_basics.txt'
    if (-not (Test-Path $samplePath)) {
        $sample | Out-File -FilePath $samplePath -Encoding utf8NoBOM
        Write-Host "INFO: Wrote sample text to $samplePath" -ForegroundColor DarkGray
    }

    Write-Host 'SUCCESS: Setup complete. Start with: npm run dev' -ForegroundColor Green
}
catch {
    Write-Error $_
    exit 1
}
finally {
    Pop-Location
}


