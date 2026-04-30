# DỰ ÁN: HOTEL RECOMMENDATION SYSTEM (GRAPH MINING)

## 👥 Thành viên nhóm
| MSSV | Họ và tên | Vai trò |
| :--- | :--- | :--- |
| 23676071 | Nguyễn Thị Quỳnh Trang | Data Analyst & Graph Modeling |
| 23670311 | Ngô Phước Thiên | Frontend Developer |
| 23696981 | Vũ Ngọc Thu Phương | Data Processing |
| 23725051 | Trương Thế Hải Thịnh | Backend & Neo4j Integration |

## 🎯 Mục tiêu dự án
Xây dựng một hệ thống gợi ý khách sạn thông minh dựa trên đồ thị tri thức (Knowledge Graph). Dự án tập trung vào việc khai thác các mối quan hệ phức tạp giữa người dùng, vị trí địa lý và sở thích để đưa ra những gợi ý chính xác, mang tính cá nhân hóa cao.

## 💻 Công nghệ sử dụng
- **Cơ sở dữ liệu**: Neo4j (Graph Database) - Phân tích đồ thị và mối quan hệ.
- **Backend**: FastAPI (Python) - Xử lý logic gợi ý và cung cấp API.
- **Frontend**: React + TailwindCSS - Dashboard hiển thị dữ liệu trực quan.
- **Dữ liệu**: Tập dữ liệu Tripadvisor kết hợp với dữ liệu thực từ Google Maps API.

## ✨ Các tính năng chính
1. **Gợi ý theo đồ thị**: Sử dụng thuật toán Graph Mining để tìm kiếm khách sạn tương đồng.
2. **Lọc theo vùng miền**: Tối ưu hóa gợi ý dựa trên vị trí địa lý của khách sạn (Hà Nội, TP.HCM, v.v.).
3. **Dashboard trực quan**: Hiển thị sơ đồ mạng lưới các khách sạn và người dùng.
4. **Thông tin chi tiết**: Tích hợp ảnh thực tế, điểm số Google Maps và chỉ đường trực tiếp.

## 📅 Kế hoạch triển khai
- Thu thập và chuẩn hóa dữ liệu Kaggle/Tripadvisor.
- Thiết kế Schema đồ thị trên Neo4j.
- Xây dựng API gợi ý và logic xử lý Backend.
- Thiết kế giao diện Dashboard và tích hợp Frontend.
- Kiểm thử và tối ưu hóa hiệu năng hệ thống.
