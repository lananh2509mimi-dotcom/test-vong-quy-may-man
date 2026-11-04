# QR May Mắn — Bộ giao diện tách file

## Cấu trúc

- `index.html`: giao diện trúng thưởng.
- `truot.html`: giao diện chưa trúng, dùng chung CSS/JS.
- `css/base.css`: biến màu, font, thiết lập nền.
- `css/layout.css`: bố cục và responsive.
- `css/components.css`: form, nút, khu vực kết quả.
- `css/animations.css`: hiệu ứng mở kết quả và pháo giấy.
- `js/config.js`: nội dung trúng/trượt.
- `js/form.js`: chuẩn hóa và kiểm tra tên.
- `js/result.js`: hiển thị kết quả.
- `js/confetti.js`: hiệu ứng pháo giấy.
- `js/main.js`: khởi tạo và kết nối các chức năng.

## Xem thử

Mở `index.html` để xem trang trúng; mở `truot.html` để xem trang chưa trúng. Không cần cài thư viện ngoài.

## Đưa lên GitHub Pages

1. Tạo repository GitHub mới.
2. Tải toàn bộ file và thư mục trong gói này lên repository, giữ nguyên cấu trúc.
3. Vào **Settings → Pages**.
4. Chọn **Deploy from a branch**, nhánh `main`, thư mục `/(root)`, rồi Save.
5. Chờ GitHub Pages xuất bản website.
6. Trang trúng là `.../index.html`; trang trượt là `.../truot.html`.

## Tùy chỉnh nội dung

Sửa `js/config.js`. `index.html` có `data-result="win"`; `truot.html` có `data-result="lose"`. Giữ nguyên các giá trị này để trang hiển thị đúng nội dung.

## Lưu ý về giải thưởng

Đây là **bản giao diện tĩnh để thử nghiệm**, không phải hệ thống xác thực kết quả. Bất kỳ ai có URL trang trúng đều có thể mở trang và nhập tên. Việc nhập tên không xác minh danh tính, không giới hạn số người trúng và không ghi nhận trao quà. Nếu chỉ có đúng 5 người được nhận quà, cần thêm backend (ví dụ Google Apps Script + Google Sheets) để xác thực mã QR riêng, lưu kết quả phía máy chủ và kiểm soát nhận thưởng.


## Kết nối Google Sheets
Trước khi đăng lên GitHub Pages, mở `js/api.js` và thay `PASTE_GOOGLE_APPS_SCRIPT_EXEC_URL_HERE` bằng URL Web App kết thúc bằng `/exec` của bản triển khai hiện tại. Trang `index.html` gọi Apps Script qua JSONP để tránh lỗi CORS. Mỗi tên đã chuẩn hóa nhận một giải duy nhất theo Apps Script. Không thử bằng tên thật trước khi kiểm tra kho quà. Lưu ý: tên không phải định danh an toàn; API công khai có thể bị gọi tự động, vì vậy không phù hợp để bảo vệ quà có giá trị cao.
