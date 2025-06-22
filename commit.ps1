# Git Commit Helper Script for Windows
# 使用方法: .\commit.ps1

Write-Host "🚀 启动交互式 Git 提交工具..." -ForegroundColor Green

# 检查是否有暂存的文件
$stagedFiles = git diff --cached --name-only
if ($stagedFiles.Count -eq 0) {
    Write-Host "⚠️  没有暂存的文件。请先使用 'git add' 添加要提交的文件。" -ForegroundColor Yellow
    Write-Host "💡 提示：使用 'git add .' 添加所有更改的文件" -ForegroundColor Cyan
    exit 1
}

Write-Host "📝 即将提交的文件：" -ForegroundColor Cyan
git diff --cached --name-only | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
Write-Host ""

# 运行交互式提交工具
pnpm run commit
