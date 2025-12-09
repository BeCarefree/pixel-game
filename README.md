# Pixel Art Quiz Game (生成式 AI 闖關問答)

這是一個復古像素風格的網頁問答遊戲，前端使用 React + Vite 開發，後端透過 Google Apps Script (GAS) 連結 Google Sheets 作為資料庫與計分系統。

## 🚀 快速開始 (Quick Start)

### 1. 安裝專案
```bash
# 安裝相依套件
npm install

# 啟動開發伺服器
npm run dev
```
打開瀏覽器前往 `http://localhost:5173` 即可看到畫面。
*(備註：若尚未設定後端，遊戲會使用內建的假資料 Mock Data 運作)*

---

## 🛠️ Google Sheets & Apps Script 設定指南

要讓遊戲使用你自己的題目並記錄成績，請依照以下步驟設定：

### 步驟 1：建立 Google Sheet
1. 新增一個 Google Sheet。
2. 建立兩個工作表 (Tabs)：
   - 命名為 **`題目`** (注意繁體中文)
   - 命名為 **`回答`**

### 步驟 2：設定欄位
**「題目」工作表欄位順序：**
| A (題號) | B (題目) | C (選項A) | D (選項B) | E (選項C) | F (選項D) | G (解答) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |

**「回答」工作表欄位順序：**
| A (ID) | B (闖關次數) | C (總分) | D (最高分) | E (第一次通關分數) | F (備註) | G (最近遊玩時間) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
*(請保留第一列作為標題列)*

### 步驟 3：部署後端程式 (GAS)
1. 在 Google Sheet 點選 **「擴充功能」 (Extensions)** > **「Apps Script」**。
2. 將本專案 `scripts/code.gs` 的內容完整複製並貼上，覆蓋原本的內容。
3. 按下 💾 存檔。
4. 點選右上角 **「部署」 (Deploy)** > **「新增部署」 (New deployment)**。
5. 點選「選取類型」齒輪 ⚙️ > **「網頁應用程式」 (Web app)**。
   - **描述**：隨意填寫 (如：Pixel Game API)
   - **執行身分**：**我自己 (Me)**
   - **誰可以存取**：**任何人 (Anyone)** (重要！這樣前端才能呼叫)
6. 點選 **「部署」**。如果是第一次，Google 會要求「授予存取權」，請選擇你的帳號並點選 **「Advanced」 > 「Go to ... (unsafe)」 > 「Allow」**。
7. 複製產生的 **網頁應用程式網址 (Web App URL)**。

### 步驟 4：前端連線
1. 在專案根目錄建立 `.env` 檔案 (參考 `.env` 或下方)。
2. 填入你的 GAS 網址：
   ```env
   VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/你的ID/exec
   VITE_PASS_THRESHOLD=3
   VITE_QUESTION_COUNT=5
   ```
3. 重啟 `npm run dev`。

---

## 📝 測試題庫：生成式 AI 基礎知識 (可以直接複製貼上到「題目」工作表)

請將下表內容複製 (不含標題列)，直接貼上到 Google Sheet 的 **「題目」** 工作表 A2 儲存格開始的位置。

記得第一列 A1~G1 要自己打上標題 (題號, 題目, A, B, C, D, 解答) 以免被程式誤讀。

| 題號 | 題目 | A | B | C | D | 解答 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 下列何者是目前主流的大型語言模型 (LLM) 核心架構？ | RNN | CNN | Transformer | LSTM | Transformer |
| 2 | 在生成式 AI 中，如果模型產生了與事實不符的內容，這個現象通常被稱為什麼？ | 夢遊 (Sleepwalking) | 幻覺 (Hallucination) | 錯誤 (Error) | 偏差 (Bias) | 幻覺 (Hallucination) |
| 3 | ChatGPT 是由哪一家公司開發的？ | Google | Meta | Apple | OpenAI | OpenAI |
| 4 | 在使用 AI 生成圖片時 (如 Midjourney)，我們輸入用來描述圖片內容的文字稱為什麼？ | Keyword | Tag | Prompt (提示詞) | Command | Prompt (提示詞) |
| 5 | LLM 處理文字時，會將文字轉換成最小的運算單位，這個單位稱為什麼？ | Byte | Token | Pixel | Bit | Token |
| 6 | 若要讓 AI 模型學習特定領域的新知識，通常會使用什麼技術？ | RAG (檢索增強生成) | CPU 加速 | 壓縮 (Compression) | 格式化 | RAG (檢索增強生成) |
| 7 | 下列哪一個參數通常用來控制生成式 AI 輸出的「隨機性」或「創意度」？ | Volume | Temperature (溫度) | Speed | Size | Temperature (溫度) |
| 8 | 擴散模型 (Diffusion Model) 最常用於生成哪種媒體？ | 文字 | 試算表 | 圖片 | 程式碼 | 圖片 |
| 9 | GPT-4 中的 "GPT" 代表什麼縮寫？ | General Pre-trained Transformer | Generative Pre-trained Transformer | Google Pre-trained Transformer | Graphic Processing Transformer | Generative Pre-trained Transformer |
| 10 | 哪一種技術可以讓模型針對特定任務進行「微調」以提升表現？ | Pre-training | Fine-tuning | Prompting | Hacking | Fine-tuning |

---

## 🎨 專案結構
- `src/`：React 原始碼
  - `pages/`：頁面元件 (Home, Quiz, Result)
  - `store/`：Zustand 狀態管理
  - `services/`：API 串接邏輯
  - `components/`：UI 元件
- `scripts/`：後端 GAS 程式碼備份

---

## 🚀 部署到 GitHub Pages

本專案已設定好 GitHub Actions 自動部署流程。

### 第一步：設定 Repository Secrets
為了讓 GitHub Action 能夠在打包時讀取到您的環境變數，您需要將變數設定在 GitHub 專案的 Secrets 中。

1. 進入 GitHub Repository 的 **Settings**。
2. 在左側選單點選 **Secrets and variables** > **Actions**。
3. 在 **Repository secrets** 區塊點選 **New repository secret**。
4. 新增以下變數：
    - Name: `VITE_GOOGLE_APP_SCRIPT_URL`
    - Secret: (貼上您的 Google Apps Script 網址)

*(選擇性) 您也可以在 **Repository variables** 新增 `VITE_QUESTION_COUNT` (題目數量) 和 `VITE_PASS_THRESHOLD` (過關門檻)。*

### 第二步：啟用 GitHub Pages
1. 進入 GitHub Repository 的 **Settings**。
2. 在左側選單點選 **Pages**。
3. 在 **Build and deployment** > **Source** 下拉選單中，選擇 **GitHub Actions**。

### 第三步：觸發部署
只要您將程式碼 Push 到 `main` 或 `master` 分支，GitHub Actions 就會自動開始打包並部署到 GitHub Pages。
- 您可以在專案的 **Actions** 分頁查看進度。
- 部署完成後，您的遊戲將會在 `https://<您的帳號>.github.io/<專案名稱>/` 上線。
