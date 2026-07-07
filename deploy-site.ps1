$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)

$repoPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoPath

function Get-GitExecutable {
    $gitCommand = Get-Command git -ErrorAction SilentlyContinue
    if ($gitCommand) {
        return $gitCommand.Source
    }

    $fallbackGit = "C:\Users\lxd_g\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd\git.exe"
    if (Test-Path $fallbackGit) {
        return $fallbackGit
    }

    return $null
}

$gitExe = Get-GitExecutable

Write-Host ""
Write-Host "=========================================="
Write-Host "巡花问柳大世界 - 一键更新网站"
Write-Host "=========================================="
Write-Host ""

if (-not $gitExe) {
    Write-Host "[错误] 没找到 Git。"
    Write-Host "你可以先安装 Git，或者先在 PowerShell 里确认 git 命令可用。"
    Write-Host ""
    Read-Host "按回车关闭窗口"
    exit 1
}

& $gitExe config --global --add safe.directory $repoPath *> $null

$statusLines = & $gitExe status --short
if ($LASTEXITCODE -ne 0) {
    Write-Host "[错误] 无法读取仓库状态。"
    Write-Host "请确认当前文件夹里包含 .git 文件夹，并且这是完整项目。"
    Write-Host ""
    Read-Host "按回车关闭窗口"
    exit 1
}

if (-not $statusLines) {
    Write-Host "没有检测到新的改动。"
    Write-Host "如果你刚改过内容，请先确认文件已经保存。"
    Write-Host ""
    Read-Host "按回车关闭窗口"
    exit 0
}

Write-Host "检测到以下改动："
$statusLines | ForEach-Object { Write-Host $_ }
Write-Host ""

$commitMessage = "更新网站内容 $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

Write-Host "[1/3] 正在保存改动..."
& $gitExe add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "[错误] git add 失败。"
    Write-Host ""
    Read-Host "按回车关闭窗口"
    exit 1
}

Write-Host "[2/3] 正在提交改动..."
& $gitExe commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "[错误] git commit 失败。"
    Write-Host ""
    Read-Host "按回车关闭窗口"
    exit 1
}

Write-Host "[3/3] 正在上传到 GitHub..."
& $gitExe push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "[错误] git push 失败。"
    Write-Host "常见原因：网络异常、没有登录 GitHub，或者远程仓库权限失效。"
    Write-Host ""
    Read-Host "按回车关闭窗口"
    exit 1
}

Write-Host ""
Write-Host "上传成功。"
Write-Host "GitHub Pages 会自动重新发布网站。"
Write-Host "一般等待 1 到 3 分钟后刷新下面这个地址即可："
Write-Host "https://lixundaigiotto-dot.github.io/Giotto-Ziehl/"
Write-Host ""
Write-Host "本次提交说明：$commitMessage"
Write-Host ""
Read-Host "按回车关闭窗口"
