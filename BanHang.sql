use [master]
go
drop database IF EXISTS BanHang
create database BanHang
go
use BanHang
go

drop table if exists loaimathang
create table loaimathang(
	ma int primary key identity,
	ten nvarchar(100),
	ghichu nvarchar(100),
)

go
drop table if exists gianhang
create table gianhang(
	ma char(4) primary key,
	ten nvarchar(100),
	quay char(2),
	ke char(2)
)
go
insert into gianhang values ('A001','A001','A0','01')
insert into gianhang values ('A002','A002','A0','02')
insert into gianhang values ('A003','A003','A0','03')
drop table if exists mathang
create table mathang(
	
	ten nvarchar(100),
	mavach char(8) primary key,
	donvi nvarchar(50),
	soluong int,
	giaban float,
	lohang varchar(50),
	ngaysanxuat date,
	hansudung date,
	maloaimathang int,
	magianhang char(4),
)
go
drop table if exists khachhang
create table khachhang(
	ma int primary key identity,
	ten nvarchar(100),
	tentienganh varchar(50),
	tendangnhap varchar(50),
	matkhau char(32),
	ngaysinh date,
	nghenghiep nvarchar(50),
	gioitinh bit,
	thanhpho nvarchar(50),
	anh varchar(50)
)
go
drop table if exists hoadon
create table hoadon(
	ma int primary key identity,
	makhachhang int,
	ngay date,
	gio time,
	tongtien float
)
go
drop table if exists chitiethoadon
create table chitiethoadon(
	ma int primary key identity,
	mahoadon int,
	mamathang char(8),
	soluong int,
	thanhtien float
)
go
drop table if exists nhanvien
create table nhanvien(
	ma int primary key identity,
	tendangnhap varchar(50),
	matkhau varchar(32),
	ten nvarchar(50),
	ngaysinh date,
	quequan nvarchar(100),
	chucvu nvarchar(50)
)
go
drop table if exists vitri
create table vitri(
	ma int primary key identity,
	mamathang char(8),
	magianhang char(4),
	soluong int
)
go
drop table if exists khachhangdangky
create table khachhangdangky(
	ma int primary key identity,
	makhachhang int,
	thoigianvao datetime default GETDATE(),
	thoigianra datetime
)
go
drop table if exists vitrikhachhang
create table vitrikhachhang(
	ma int primary key identity,
	makhachhangdangky int,
	makhachhang int,
	thoigian datetime default GETDATE(),
	magianhang char(4)
)
insert into mathang(ten,mavach,soluong) values ('kem','1234QWER',5)
insert into vitri('1234QWER','A001'