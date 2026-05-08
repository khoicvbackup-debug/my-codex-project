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

Làm theo các bước dưới đây để push trực tiếp repository này lên GitHub.

### 1. Tạo repository trên GitHub

1. Vào <https://github.com/new>.
2. Nhập tên repository, ví dụ `vietnam-auto-parts-warehouse`.
3. Không chọn **Add a README file** nếu repository local đã có README.
4. Bấm **Create repository**.

### 2. Kiểm tra remote hiện tại

```bash
git remote -v
```

Nếu chưa có remote `origin`, thêm URL repository GitHub của bạn. Chọn một trong hai cách sau.

**Cách A - HTTPS:**

```bash
git remote add origin https://github.com/<ten-nguoi-dung>/<ten-repository>.git
```

Khi GitHub hỏi mật khẩu qua HTTPS, dùng **Personal Access Token (PAT)** thay cho mật khẩu tài khoản.

**Cách B - SSH:**

```bash
git remote add origin git@github.com:<ten-nguoi-dung>/<ten-repository>.git
```

Cách SSH yêu cầu máy của bạn đã thêm SSH key vào GitHub trong **Settings → SSH and GPG keys**.

Nếu đã có `origin` nhưng sai URL, đổi lại bằng lệnh:

```bash
git remote set-url origin https://github.com/<ten-nguoi-dung>/<ten-repository>.git
```

### 3. Push code lần đầu

```bash
git branch -M main
git push -u origin main
```

Sau lệnh này, code sẽ xuất hiện trên GitHub ở nhánh `main`.

### 4. Push các lần sau

Sau khi sửa code và commit, chỉ cần chạy:

```bash
git push
```

### 5. Publish web app bằng GitHub Pages

Sau khi push lên nhánh `main`, GitHub Actions trong `.github/workflows/pages.yml` sẽ tự động publish ứng dụng tĩnh lên GitHub Pages. Trong GitHub, vào **Settings → Pages** và chọn nguồn triển khai **GitHub Actions** nếu repository chưa bật Pages.
