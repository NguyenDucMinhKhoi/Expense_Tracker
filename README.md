# Expense Tracker CLI

Ứng dụng theo dõi chi tiêu qua dòng lệnh (Command Line Interface).

## Tính năng

- Thêm chi tiêu mới với mô tả và số tiền
- Cập nhật thông tin chi tiêu
- Xóa chi tiêu
- Liệt kê tất cả chi tiêu
- Xem tổng chi tiêu (tổng thể hoặc theo tháng)

## Cài đặt

1. Đảm bảo bạn đã cài đặt Node.js trên máy tính
2. Clone repository này về máy
3. Cấp quyền thực thi cho file:
   - Trên Windows:
   ```bash
   node expense-tracker.js
   ```
   - Trên Linux/macOS:
   ```bash
   chmod +x expense-tracker.js
   ./expense-tracker.js
   ```

## Cách sử dụng

### Thêm chi tiêu mới
```bash
# Windows
node expense-tracker.js add --description "Tiền ăn trưa" --amount 50000

# Linux/macOS
./expense-tracker.js add --description "Tiền ăn trưa" --amount 50000
```

### Cập nhật chi tiêu
```bash
# Windows
node expense-tracker.js update --id 1 --description "Tiền ăn tối" --amount 75000

# Linux/macOS
./expense-tracker.js update --id 1 --description "Tiền ăn tối" --amount 75000
```

### Xóa chi tiêu
```bash
# Windows
node expense-tracker.js delete --id 1

# Linux/macOS
./expense-tracker.js delete --id 1
```

### Liệt kê tất cả chi tiêu
```bash
# Windows
node expense-tracker.js list

# Linux/macOS
./expense-tracker.js list
```

### Xem tổng chi tiêu
```bash
# Windows
# Xem tổng tất cả chi tiêu
node expense-tracker.js summary

# Xem tổng chi tiêu theo tháng (1-12)
node expense-tracker.js summary --month 3

# Linux/macOS
# Xem tổng tất cả chi tiêu
./expense-tracker.js summary

# Xem tổng chi tiêu theo tháng (1-12)
./expense-tracker.js summary --month 3
```

## Cấu trúc dữ liệu

Chi tiêu được lưu trong file `expenses.json` với định dạng JSON. Mỗi chi tiêu bao gồm:
- id: Mã số định danh
- description: Mô tả chi tiêu
- amount: Số tiền
- createdAt: Thời gian tạo
- updatedAt: Thời gian cập nhật gần nhất

## Yêu cầu hệ thống

- Node.js phiên bản 12.0.0 trở lên
- Hệ điều hành: Windows, macOS, hoặc Linux

