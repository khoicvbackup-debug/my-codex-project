# Kho Phụ Tùng Ô Tô Việt Nam

Ứng dụng web tĩnh quản lý kho phụ tùng ô tô bằng HTML, CSS và JavaScript thuần.

## Chức năng

- Đăng nhập bằng tài khoản mẫu `admin` / `123456`.
- Quản lý tồn kho phụ tùng với mã phụ tùng, danh mục, vị trí kệ, số lượng và giá nhập.
- Tạo phiếu nhập kho hoặc xuất kho, tự động cập nhật số lượng tồn.
- Tìm kiếm nhanh theo mã phụ tùng, tên, danh mục hoặc vị trí.
- Xem báo cáo tồn kho theo danh mục và tải báo cáo CSV.
- Giao diện responsive cho máy tính, tablet và điện thoại.

## Chạy thử

Mở trực tiếp `index.html` trong trình duyệt hoặc chạy một máy chủ tĩnh:

```bash
python3 -m http.server 8000
```

Sau đó truy cập `http://localhost:8000`.

## Đưa code lên GitHub

Nếu repository chưa có remote GitHub, tạo repository mới trên GitHub rồi chạy:

```bash
git remote add origin https://github.com/<ten-nguoi-dung>/<ten-repository>.git
git branch -M main
git push -u origin main
```

Sau khi push lên nhánh `main`, GitHub Actions trong `.github/workflows/pages.yml` sẽ tự động publish ứng dụng tĩnh lên GitHub Pages. Trong GitHub, vào **Settings → Pages** và chọn nguồn triển khai **GitHub Actions** nếu repository chưa bật Pages.
