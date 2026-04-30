# Hotel Recommendation Dashboard (Neo4j + React)

Một hệ thống gợi ý khách sạn thông minh sử dụng đồ thị tri thức (Knowledge Graph) Neo4j, tích hợp dữ liệu thực từ Google Maps và thuật toán gợi ý theo vùng miền.

## 🚀 Tính năng nổi bật
- **Graph Mining**: Phân tích mối quan hệ giữa User và Hotel thông qua Neo4j.
- **Smart Recommendation**: Gợi ý khách sạn dựa trên sở thích và vị trí địa lý.
- **Premium UI**: Giao diện Dashboard hiện đại, hỗ trợ chế độ tối (Dark Mode) và Modal chi tiết 5 sao.
- **Data Integration**: Tích hợp ảnh chất lượng cao và chỉ đường trực tiếp trên Google Maps.

## 🛠️ Cấu trúc dự án
- `/backend`: FastAPI (Python) xử lý logic và kết nối Neo4j.
- `/frontend`: React + TailwindCSS hiển thị giao diện Dashboard.

## ⚙️ Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
- Python 3.9+
- Node.js 16+
- Một cơ sở dữ liệu Neo4j (Local hoặc Aura Cloud)

### 2. Cài đặt Backend
1. Di chuyển vào thư mục backend: `cd backend`
2. Cài đặt các thư viện cần thiết:
   ```bash
   pip install -r requirements.txt
   ```
3. Tạo file `.env` và điền thông tin kết nối Neo4j:
   ```env
   NEO4J_URI=bolt://...
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=...
   ```
4. Khởi tạo dữ liệu: `python init_db.py`
5. Chạy server: `python main.py`

### 3. Cài đặt Frontend
1. Di chuyển vào thư mục frontend: `cd frontend`
2. Cài đặt các module (Chỉ cần chạy 1 lần, máy sẽ tự tải về):
   ```bash
   npm install
   ```
3. Khởi chạy giao diện:
   ```bash
   npm run dev
   ```

## 📸 Ảnh chụp màn hình
*(Bạn có thể thêm ảnh chụp màn hình Dashboard của mình vào đây)*

## 📄 Giấy phép
Dự án được phát triển cho mục đích học tập và nghiên cứu về Graph Mining.
