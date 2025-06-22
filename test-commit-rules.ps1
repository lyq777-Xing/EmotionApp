# Git Commit 规范验证脚本
Write-Host "🧪 测试 Git Commit 规范..." -ForegroundColor Green

# 测试用例
$testCases = @(
    @{ message = "feat: 添加新功能"; expected = $true },
    @{ message = "fix: 修复Bug"; expected = $true },
    @{ message = "docs: 更新文档"; expected = $true },
    @{ message = "添加功能"; expected = $false },
    @{ message = "fix bug"; expected = $false },
    @{ message = "update code"; expected = $false }
)

Write-Host "📝 测试提交信息验证..." -ForegroundColor Cyan

foreach ($test in $testCases) {
    $message = $test.message
    $expected = $test.expected
    
    # 使用 commitlint 验证消息
    $result = echo $message | npx commitlint
    $isValid = $LASTEXITCODE -eq 0
    
    if ($isValid -eq $expected) {
        $status = "✅ 通过"
        $color = "Green"
    } else {
        $status = "❌ 失败"
        $color = "Red"
    }
    
    Write-Host "  '$message' -> $status" -ForegroundColor $color
}

Write-Host "`n🎉 验证完成!" -ForegroundColor Green
Write-Host "💡 现在可以使用 '.\commit.ps1' 开始规范化提交" -ForegroundColor Cyan
