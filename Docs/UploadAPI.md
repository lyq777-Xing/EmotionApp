# 腾讯云COS文件上传API文档

## 概述

本文档描述了基于腾讯云COS（Cloud Object Storage）的文件上传API接口，支持图片和视频文件的上传，采用临时密钥方式确保安全性。

## 技术架构

- **后端框架**: ASP.NET Core 9.0
- **云存储**: 腾讯云COS
- **安全机制**: STS临时密钥
- **存储桶**: `image-1310707740`
- **地域**: `ap-shanghai`

## 文件存储规则

文件按照以下路径结构存储：
```
emotion_app/{年}/{月}/{日}/{文件类型}/{随机文件名}
```

示例：
- 图片: `/emotion_app/2025/6/22/image/a1b2c3d4-e5f6-7890-1234-567890abcdef.jpg`
- 视频: `/emotion_app/2025/6/22/video/a1b2c3d4-e5f6-7890-1234-567890abcdef.mp4`

## 支持的文件格式

### 图片格式
- `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.svg`, `.webp`, `.tiff`, `.ico`
- 最大文件大小: 100MB

### 视频格式
- `.mp4`, `.avi`, `.mov`, `.wmv`, `.flv`, `.mkv`, `.webm`, `.m4v`, `.3gp`, `.ts`
- 最大文件大小: 500MB

## API接口

### 1. 获取临时密钥

**接口地址**: `GET /api/upload/credentials`

**描述**: 获取腾讯云COS的临时访问凭证，用于客户端直接上传文件到COS。

**响应示例**:
```json
{
  "tmpSecretId": "AKIDxxxxxxxxxxxxxxxxxxx",
  "tmpSecretKey": "xxxxxxxxxxxxxxxxxxxx",
  "sessionToken": "xxxxxxxxxxxxxxxxxxxx",
  "startTime": "2025-06-22T10:00:00Z",
  "expiredTime": "2025-06-22T10:30:00Z",
  "bucket": "image-1310707740",
  "region": "ap-shanghai"
}
```

**字段说明**:
- `tmpSecretId`: 临时访问密钥ID
- `tmpSecretKey`: 临时访问密钥Key
- `sessionToken`: 会话令牌
- `startTime`: 凭证生效时间
- `expiredTime`: 凭证过期时间（30分钟有效期）
- `bucket`: 存储桶名称
- `region`: 存储区域

### 2. 获取上传配置

**接口地址**: `GET /api/upload/config`

**描述**: 获取完整的上传配置信息，包含临时密钥和文件限制信息。

**响应示例**:
```json
{
  "credentials": {
    "tmpSecretId": "AKIDxxxxxxxxxxxxxxxxxxx",
    "tmpSecretKey": "xxxxxxxxxxxxxxxxxxxx",
    "sessionToken": "xxxxxxxxxxxxxxxxxxxx",
    "startTime": "2025-06-22T10:00:00Z",
    "expiredTime": "2025-06-22T10:30:00Z",
    "bucket": "image-1310707740",
    "region": "ap-shanghai"
  },
  "uploadPath": "emotion_app/2025/6/22",
  "allowedImageFormats": [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp", ".tiff", ".ico"],
  "allowedVideoFormats": [".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv", ".webm", ".m4v", ".3gp", ".ts"],
  "maxFileSize": 524288000
}
```

### 3. 上传图片

**接口地址**: `POST /api/upload/image`

**请求类型**: `multipart/form-data`

**参数**:
- `file`: 图片文件 (form-data)

**响应示例**:
```json
{
  "success": true,
  "message": "文件上传成功",
  "fileUrl": "https://image-1310707740.cos.ap-shanghai.myqcloud.com/emotion_app/2025/6/22/image/a1b2c3d4-e5f6-7890-1234-567890abcdef.jpg",
  "fileName": "a1b2c3d4-e5f6-7890-1234-567890abcdef.jpg",
  "fileSize": 1024000,
  "fileType": "image",
  "uploadTime": "2025-06-22T10:15:30Z"
}
```

### 4. 上传视频

**接口地址**: `POST /api/upload/video`

**请求类型**: `multipart/form-data`

**参数**:
- `file`: 视频文件 (form-data)

**响应示例**:
```json
{
  "success": true,
  "message": "文件上传成功",
  "fileUrl": "https://image-1310707740.cos.ap-shanghai.myqcloud.com/emotion_app/2025/6/22/video/a1b2c3d4-e5f6-7890-1234-567890abcdef.mp4",
  "fileName": "a1b2c3d4-e5f6-7890-1234-567890abcdef.mp4",
  "fileSize": 50240000,
  "fileType": "video",
  "uploadTime": "2025-06-22T10:15:30Z"
}
```

### 5. 通用文件上传

**接口地址**: `POST /api/upload/file`

**请求类型**: `multipart/form-data`

**参数**:
- `file`: 文件 (form-data)

**描述**: 自动检测文件类型（图片或视频）并上传到对应目录。

### 6. 批量文件上传

**接口地址**: `POST /api/upload/batch`

**请求类型**: `multipart/form-data`

**参数**:
- `files`: 文件列表 (form-data)

**响应示例**:
```json
[
  {
    "success": true,
    "message": "文件上传成功",
    "fileUrl": "https://image-1310707740.cos.ap-shanghai.myqcloud.com/emotion_app/2025/6/22/image/file1.jpg",
    "fileName": "file1.jpg",
    "fileSize": 1024000,
    "fileType": "image",
    "uploadTime": "2025-06-22T10:15:30Z"
  },
  {
    "success": false,
    "message": "不支持的文件格式: .txt",
    "fileUrl": "",
    "fileName": "",
    "fileSize": 0,
    "fileType": "",
    "uploadTime": "2025-06-22T10:15:30Z"
  }
]
```

## 错误响应

### 客户端错误 (4xx)

```json
{
  "success": false,
  "message": "错误描述",
  "fileUrl": "",
  "fileName": "",
  "fileSize": 0,
  "fileType": "",
  "uploadTime": "2025-06-22T10:15:30Z"
}
```

**常见错误**:
- `文件不能为空`
- `不支持的图片格式: .xxx`
- `不支持的视频格式: .xxx`
- `文件大小超过限制，最大允许: 100MB`
- `文件类型不匹配，期望: image, 实际: video`

### 服务器错误 (5xx)

```json
{
  "message": "错误描述",
  "error": "详细错误信息"
}
```

## 使用示例

### JavaScript/Fetch示例

```javascript
// 1. 获取上传配置
const configResponse = await fetch('/api/upload/config');
const config = await configResponse.json();

// 2. 上传图片文件
const formData = new FormData();
formData.append('file', imageFile);

const uploadResponse = await fetch('/api/upload/image', {
  method: 'POST',
  body: formData
});

const result = await uploadResponse.json();
if (result.success) {
  console.log('上传成功:', result.fileUrl);
} else {
  console.error('上传失败:', result.message);
}
```

### curl示例

```bash
# 获取临时密钥
curl -X GET "http://localhost:5000/api/upload/credentials"

# 上传图片
curl -X POST "http://localhost:5000/api/upload/image" \
  -F "file=@/path/to/image.jpg"

# 上传视频
curl -X POST "http://localhost:5000/api/upload/video" \
  -F "file=@/path/to/video.mp4"
```

## 安全特性

1. **临时密钥**: 使用STS临时密钥，有效期30分钟，降低密钥泄露风险
2. **路径限制**: 只允许上传到 `emotion_app/*` 路径下
3. **文件格式验证**: 严格验证文件扩展名
4. **文件大小限制**: 图片100MB，视频500MB
5. **权限控制**: 只授予必要的上传权限

## 配置信息

配置文件位置: `appsettings.json`

```json
{
  "TencentCOS": {
    "SecretId": "您的SecretId",
    "SecretKey": "您的SecretKey", 
    "Bucket": "image-1310707740",
    "Region": "ap-shanghai",
    "AllowPrefix": "emotion_app/*",
    "CredentialDurationSeconds": 1800
  }
}
```

## 注意事项

1. 临时密钥有效期为30分钟，到期后需要重新获取
2. 文件名会自动生成UUID，避免重名冲突
3. 上传的文件会按年月日自动分类存储
4. 建议在生产环境中使用HTTPS协议
5. 可以根据需要调整文件大小限制和支持的格式

## 监控与日志

系统会自动记录以下操作日志：
- 临时密钥获取成功/失败
- 文件上传进度
- 文件上传成功/失败
- 错误详情和堆栈跟踪

## 性能优化建议

1. 客户端可以缓存临时密钥直到过期
2. 大文件建议使用分片上传
3. 可以考虑添加文件预处理（如图片压缩）
4. 批量上传时建议控制并发数量
