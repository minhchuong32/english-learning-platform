# FlashLearn FE

Frontend của bài tập được xây dựng bằng React + Vite + Redux Toolkit + Tailwind CSS. Ứng dụng tập trung vào luồng xác thực người dùng và quản lý hồ sơ cá nhân, gồm các màn hình chính: đăng nhập, đăng ký, quên mật khẩu, trang chủ và chỉnh sửa profile.

## 1. Công nghệ sử dụng

- React 19
- Vite
- Redux Toolkit + React Redux
- Axios
- Tailwind CSS

## 2. Cấu trúc thư mục chính

### `src/App.jsx`

Đây là component gốc của ứng dụng FE. App không dùng router riêng mà điều hướng bằng state cục bộ `screen`.

- Khi chưa đăng nhập, app mở màn hình `login`.
- Khi đã đăng nhập, app có thể chuyển sang `home` hoặc `profile`.
- `Navbar` chỉ hiển thị ở màn hình `profile`.

### `src/main.jsx`

File khởi tạo React app, mount `App` vào DOM và import `styles/global.css`.

### `src/store/index.js`

Khởi tạo Redux store. Hiện tại store chỉ có một slice chính là `auth`.

### `src/store/authSlice.js`

Đây là nơi quản lý toàn bộ logic auth của FE:

- trạng thái đăng nhập (`isAuthenticated`)
- thông tin người dùng (`user`)
- trạng thái loading
- thông báo lỗi / thành công
- các async thunk gọi API: login, register, forgot password, fetch profile, update profile

### `src/util/api.js`

Tập trung toàn bộ hàm gọi API đến backend.

- `loginApi`
- `registerApi`
- `forgotPasswordApi`
- `getUserProfileApi`
- `updateProfileApi`

### `src/components/ui/`

Chứa các UI component tái sử dụng:

- `InputField`: input có label, icon, error, hint
- `Button`: nút chính, nút phụ, nút ghost
- `Alert`: hiển thị lỗi hoặc thành công
- `Spinner`: trạng thái loading
- `AuthCard`: khung card dùng cho màn hình auth
- `BrandLogo`: logo của app

### `src/components/layout/`

- `AuthLayout.jsx`: layout nền gradient cho các trang login/register/forgot password
- `Navbar.jsx`: thanh điều hướng cho user đã đăng nhập
- `header.jsx`, `auth-shell.jsx`: các component layout phụ/legacy nếu cần tái sử dụng

### `src/pages/`

- `login.jsx`: màn hình đăng nhập
- `register.jsx`: màn hình đăng ký
- `forgot-password.jsx`: màn hình quên mật khẩu
- `home.jsx`: trang chủ sau khi đăng nhập
- `user.jsx`: trang hồ sơ và chỉnh sửa profile

### `src/styles/global.css`

Khai báo theme, utility class và style dùng chung cho toàn bộ FE.

## 3. Luồng hoạt động tổng quát

### 3.1 Khởi động ứng dụng

1. `main.jsx` render `App`.
2. `App.jsx` bọc toàn bộ ứng dụng bằng `Provider` của Redux.
3. Trạng thái `isAuthenticated` được khởi tạo từ `localStorage` qua `access_token`.
4. Dựa vào state `screen`, app hiển thị màn hình phù hợp.

### 3.2 Luồng đăng nhập

File xử lý chính: `src/pages/login.jsx`

1. Người dùng nhập email/username và mật khẩu.
2. FE kiểm tra validate cơ bản ở phía client.
3. Gọi `dispatch(loginUser({ identifier, password }))`.
4. `loginUser` trong `authSlice` gọi `loginApi()` đến backend.
5. Nếu backend trả về `redirect_url` và `accessToken`, token được lưu vào `localStorage`.
6. Redux cập nhật `isAuthenticated = true`.
7. App chuyển sang `home`.

Lưu ý:

- Checkbox “Ghi nhớ” hiện đang là trạng thái UI, chưa được xử lý riêng ở store.
- Khi có lỗi, thông báo được hiển thị bằng `Alert`.

### 3.3 Luồng đăng ký

File xử lý chính: `src/pages/register.jsx`

1. Người dùng nhập `username`, `email`, `password`, `confirmPassword`.
2. FE kiểm tra các trường bắt buộc và xác nhận mật khẩu.
3. Gọi `dispatch(registerUser({ username, email, password }))`.
4. `registerUser` gọi `registerApi()` lên backend.
5. Nếu thành công, app hiển thị thông báo và chuyển về màn hình `login`.

### 3.4 Luồng quên mật khẩu

File xử lý chính: `src/pages/forgot-password.jsx`

1. Người dùng nhập email.
2. FE kiểm tra email không rỗng.
3. Gọi `dispatch(forgotPassword({ email }))`.
4. Backend xử lý gửi email khôi phục mật khẩu.
5. FE hiển thị thông báo thành công hoặc lỗi.

### 3.5 Luồng xem và chỉnh sửa profile

File xử lý chính: `src/pages/user.jsx`

1. Khi vào màn hình profile, FE kiểm tra `isAuthenticated`.
2. Nếu chưa đăng nhập, app điều hướng về `login`.
3. Nếu đã đăng nhập, FE gọi `dispatch(fetchUserProfile())` để lấy dữ liệu hồ sơ.
4. Dữ liệu trả về được map vào form gồm `fullName`, `bio`, `phoneNumber`.
5. Người dùng bấm nút `Chỉnh sửa` để bật `editMode`.
6. Khi lưu, FE validate `fullName` rồi gọi `dispatch(updateProfile(form))`.
7. Nếu backend trả về thành công, `user` trong Redux được cập nhật và form thoát khỏi chế độ chỉnh sửa.

## 4. Các component quan trọng trong flow

### `AuthLayout`

Bao bọc các màn hình auth bằng một layout riêng, có background gradient và khối giới thiệu thương hiệu FlashLearn.

### `AuthCard`

Khung card trung tâm chứa form login/register/forgot password.

### `InputField`

Component input dùng lại cho nhiều màn hình. Nó hỗ trợ:

- label
- icon ở bên trái
- nút phụ ở bên phải
- hiển thị lỗi validate

### `Button`

Tự động hiển thị spinner khi `loading = true`.

### `Alert`

Hiển thị trạng thái lỗi và thành công từ Redux hoặc validate phía client.

### `Navbar`

Hiển thị khi user đã đăng nhập. Chứa:

- chuyển sang trang chủ
- chuyển sang hồ sơ
- đăng xuất

### `BrandLogo`

Logo nhận diện của ứng dụng, dùng ở cả màn auth và màn chính.

## 5. Trạng thái auth trong Redux

Slice `auth` đang quản lý các trạng thái chính sau:

- `user`: dữ liệu profile của người dùng
- `isAuthenticated`: xác định đã đăng nhập hay chưa
- `loading`: trạng thái đang gọi API
- `error`: thông báo lỗi
- `successMsg`: thông báo thành công

Các hành động chính:

- `loginUser`
- `registerUser`
- `forgotPassword`
- `fetchUserProfile`
- `updateProfile`
- `logout`
- `clearMessages`

## 6. Kết nối backend

FE đang gọi API qua biến môi trường:

```env
VITE_BACKEND_URL=http://localhost:8080
```

Các endpoint được map trong `src/util/api.js` và tương ứng với backend hiện tại.

## 7. Chạy dự án

```bash
npm install
npm run dev
```

Các lệnh khác:

```bash
npm run build
npm run lint
npm run preview
```

## 8. Ghi chú ngắn

- Ứng dụng hiện dùng state cục bộ để điều hướng giữa các màn hình, chưa dùng React Router.
- Token đăng nhập được lưu trong `localStorage` với key `access_token`.
- Luồng edit profile phụ thuộc vào dữ liệu profile lấy từ backend sau khi user đã đăng nhập.
