# 多診所管理中心 (Multi-Clinic Management Hub)

## 📋 專案簡介

多診所管理中心是一個用於管理多個診所訂閱服務的統一管理平台，提供診所列表管理、預約數據統計、訂閱狀態管理等功能。

## 🚀 功能特色

### 1. 管理員登入系統
- 安全的密碼驗證（SHA-256 加密）
- Session 管理（24小時有效期）
- 預設管理員密碼：`admin123`

### 2. 儀表板功能
- **統計概覽**
  - 訂閱診所總數
  - 啟用中診所數量
  - 總預約數
  - 待處理預約數

- **診所列表管理**
  - 顯示所有訂閱診所
  - 診所狀態標示（啟用/過期）
  - 快速進入各診所後台
  - 查看診所詳細資訊

### 3. 付款方式頁面
- 中國信託銀行轉帳（含複製帳號功能）
- Richart 數位銀行（快速跳轉）
- 街口支付（App 深層連結）

## 🗄️ 資料庫結構

### Supabase 配置
- **Project ID**: `pizzpwesrbulfjylejlu`
- **URL**: `https://pizzpwesrbulfjylejlu.supabase.co`

### 資料表

#### clinics（診所資料表）
```sql
- id: 診所唯一識別碼
- clinicName: 診所名稱
- lineBotId: LINE Bot ID
- adminUrl: 診所後台網址
- subscriptionStatus: 訂閱狀態（active/expired）
- subscriptionExpiry: 訂閱到期日
- createdAt: 建立時間
- updatedAt: 更新時間
```

#### yuemeiBookings（預約資料表）
```sql
- id: 預約唯一識別碼
- lineUserId: LINE 用戶 ID
- customerName: 顧客姓名
- customerPhone: 顧客電話
- treatmentName: 療程名稱
- preferredDate: 偏好日期
- preferredTime: 偏好時間
- doctorPreference: 推薦人
- status: 預約狀態（pending/confirmed/cancelled）
- createdAt: 建立時間
- updatedAt: 更新時間
```

## 📁 檔案結構

```
clinic-management-hub/
├── index.html                      # 首頁（自動跳轉到登入頁）
├── multi-clinic-login.html         # 管理員登入頁面
├── multi-clinic-dashboard.html     # 管理中心儀表板
├── payment-methods.html            # 付款方式頁面
└── README.md                       # 專案說明文件
```

## 🔐 安全性

- 使用 SHA-256 加密儲存管理員密碼
- Session 管理確保登入狀態安全
- 24 小時自動登出機制
- Supabase Row Level Security (RLS) 保護資料

## 🌐 部署資訊

- **部署平台**: Netlify
- **部署網址**: `splendid-chimera-d2bee1.netlify.app`
- **GitHub Repository**: `https://github.com/CHiLL106699/clinic-management-hub`

## 📝 使用說明

### 登入系統
1. 訪問網站首頁
2. 輸入管理員密碼（預設：`admin123`）
3. 成功登入後進入儀表板

### 管理診所
1. 在儀表板查看所有診所列表
2. 點擊「進入後台」按鈕可直接訪問診所後台
3. 點擊「查看詳情」查看診所完整資訊

### 查看統計
- 儀表板頂部顯示即時統計數據
- 包含診所數量、預約數量等關鍵指標

### 付款方式
1. 點擊右上角「💳 付款方式」按鈕
2. 選擇適合的付款方式
3. 使用「複製」或「前往」按鈕完成付款

## 🛠️ 技術棧

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **資料庫**: Supabase (PostgreSQL)
- **部署**: Netlify
- **版本控制**: Git / GitHub

## 📞 聯絡資訊

- **客服信箱**: support@clinic-hub.com
- **技術支援**: 請透過 GitHub Issues 提出

## 📄 授權

© 2025 多診所管理中心 | Powered by CHiLL106699

---

**交接時間**: 2025-11-17 19:30 GMT+8
**最後更新**: 2025-11-17
