cài đặt laragon, bật apache và MySQL
mở terminal trong laragon
1: tạo db trong laragon
- trong terminal gõ: mysql -u root -p 
Sau đó enter
- gõ :
CREATE USER 'btl_user'@'localhost'
IDENTIFIED BY 'btl123';
- bấm enter rồi cop tiếp :GRANT ALL PRIVILEGES ON btl.* TO 'btl_user'@'localhost';
FLUSH PRIVILEGES;
- bấm enter, nếu terminal hiện: btl_user | localhost | caching_sha2_password -> thành công
vào vs code bật terminal gõ npm install mysql2


b2: migrate db
1: vào file package.json sửa dòng "type": "module"
thành "type": "commonjs"
2: trong terminal vs code gõ npx sequelize-cli db:migrate
3: chờ migrate xong vào package.json sửa lại về "type": "module"


kiểm tra 
trong laragon vào cơ sở dữ liệu xem đã tạo các bảng chưa 

thử test server:
trong terminal gõ npm start: không hiện lỗi gì là được


