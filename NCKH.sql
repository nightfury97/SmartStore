use [master]
go
drop database IF EXISTS NCKH
create database NCKH
go
use NCKH
go
-- create table

drop table if exists Customer
create table Customer
(
	ID int primary key identity,
	[Name] nvarchar(50),
	[EngName] varchar(50),
	UserName varchar(20),
	ImgPath varchar(50),
	Pass varchar(20),

)
drop table if exists Expression
create table Expression
(
	ID int primary key,
	EngName varchar(10),
	VieName varchar(15)
	
)
drop table if exists CustomerCheckIn
create table CustomerCheckIn
(
	[No] int primary key identity,
	CusId int REFERENCES Customer(ID),
	Clothes varchar(100),
	Expression int REFERENCES Expression(ID),
	Age int,
	CheckInTime datetime default GETDATE(),
	CheckOutTime datetime
)
drop table if exists CustomerPos
create table CustomerPos
(
	[No] int primary key identity,
	CheckInNo int REFERENCES CustomerCheckIn(No),
	CusId int REFERENCES Customer(ID),
	[Time] datetime default GETDATE(),
	ShelvesID char(4)
)
drop table if exists TypeProduct
create table TypeProduct(
	ID int primary key identity,
	[Name] nvarchar(100),
	Note nvarchar(300)
)
go
drop table if exists LogCustomer
create table LogCustomer(
	ID int primary key identity,
	CusID int REFERENCES Customer(ID),
	ProID int REFERENCES TypeProduct(ID),
	[Type] int, --1 lay 2 tra 3 xem
	Expression int REFERENCES Expression(ID)
)
drop table if exists Batch 
create table Batch(
	BatchNumber int primary key identity,
	[Name] nvarchar(100),
	TypeID int REFERENCES TypeProduct(ID),
	Producer varchar(40),
	DoI date, -- Day of import
	DoM date,
	DoE date,
	Amount int default 0,
	Price int,
	ShelvesDefault char(4),
	Unit nvarchar(50)
	
)
drop table if exists Product
create table Product(	
	ProID char(8) primary key,
	BatchNumber int REFERENCES Batch(BatchNumber),
	ShelvesNow char(4),
	Sold int default 1 --1 chua ban 0 ban roi
)
go

drop table if exists Cart
create table Cart		
(
	[No] int primary key identity,
	CusId int REFERENCES Customer(ID),
	InvoiceDate datetime default null,
	Total float default 0.0
)
drop table if exists CartDetail
create table CartDetail
(
	[No] int primary key identity,
	NoCart int REFERENCES Cart(No),
	BatchNumber int REFERENCES Batch(BatchNumber),
	Quantity int default 1
)
go
drop table if exists Staf
create table Staf(
	ID int primary key identity,
	UserName varchar(50),
	Pass varchar(32),
	Name nvarchar(50),
	DoB date,
	Position nvarchar(50)
)
go


--#region [Funcion]

drop PROCEDURE if exists addCart
go
CREATE PROCEDURE addCart  @pos char(4),@pro char(8),@out int out
as
begin	
	declare @cus int, @flat int, @no int, @quan int, @count int,@batchNumber int
	select @flat=Sold,@batchNumber=BatchNumber from Product where ProID=@pro
	select top(1) @cus=CusId from CustomerPos where ShelvesID=@pos and [Time]=(select max([Time]) from CustomerPos where ShelvesID=@pos )
	select @no=[No] from Cart where CusId=@cus and InvoiceDate is null
	IF @flat=1
		begin				
			select @count=count([No]) from CartDetail where NoCart=@no and BatchNumber=@batchNumber 
			if @count=0
				begin
					insert into CartDetail(NoCart,BatchNumber) values (@no,@batchNumber)
				end
			else
				begin
					select @quan=quantity from CartDetail where NoCart=@no and BatchNumber=@batchNumber 
					update CartDetail set Quantity=@quan+1 where NoCart=@no and BatchNumber=@batchNumber 				
				end
			update Product set Sold=0 where ProID=@pro
			update Batch set Amount=(select Amount-1 from Batch where BatchNumber = @batchNumber) where BatchNumber=@batchNumber
		end
	else
	begin
		select @quan=quantity from CartDetail where NoCart=@no and BatchNumber=@batchNumber
		update Product set Sold=1,ShelvesNow=@pos where ProID=@pro		
		if @quan = 1
			begin
				delete from CartDetail where NoCart=@no and BatchNumber=@batchNumber
			end
		else
			begin
				update CartDetail set Quantity=@quan-1 where BatchNumber=@batchNumber
				update Batch set Amount=(select Amount+1 from Batch where BatchNumber = @batchNumber) where BatchNumber=@batchNumber
			end	
	end
set @out = @no
end
go
--drop TRIGGER if exists LogAction
--go
--CREATE TRIGGER LogAction ON CartDetail AFTER INSERT,UPDATE,DELETE 
--AS
--BEGIN
--	declare @cus int,@pos int,@pro int,@expression int,@nocart int,@type int,@checkin int
--	select @pro=BatchNumber,@nocart=NoCart,@type=1 from inserted
--	select @cus=CusId from Cart where [No]=@nocart
--	select @expression=Expression from CustomerCheckIn where CusId=@cus and CheckOutTime is null

--	insert into LogCustomer(CusID,Expression,ProID,[Type]) values (@cus,@expression,@pro,@type)
--END
--go
drop PROCEDURE if exists CheckIn
go
CREATE PROCEDURE CheckIn  @username varchar(20), @out int out
as
begin
	declare @nocart int,@cusid int,@flat int,@count int
	select @cusid=ID from Customer where UserName=@username
	select @count=COUNT(*) from CustomerCheckIn where CusId=@cusid and CheckOutTime is null
	if @count = 0
		begin			
			insert into Cart(CusId) values (@cusid)
			SELECT @nocart=SCOPE_IDENTITY()
			insert into CustomerCheckIn(CusId) values (@cusid)
		end
	else
		begin
			select @nocart=[No] from Cart where CusId=@cusid
		end
	set @out=@nocart
end
go

drop PROCEDURE if exists CheckOut
go
CREATE PROCEDURE CheckOut  @cartid int,@out int out
as
begin	
	declare @ngay datetime,@nocart int,@sum float,@pro char(8),@quan int,@no int,@price int,@total int=0,@batchNumber int,@cusid int
	select @cusid = CusId from Cart where No=@cartid
	select @ngay=GETDATE()
	select @nocart=[No] from Cart where CusId=@cusid and InvoiceDate is null

	DECLARE cursorWork CURSOR FOR  -- khai báo con trỏ cursorWork
	SELECT BatchNumber,Quantity FROM CartDetail WHERE NoCart=@nocart -- dữ liệu trỏ tới

OPEN cursorWork                -- Mở con trỏ

FETCH NEXT FROM cursorWork     -- Đọc dòng đầu tiên
      INTO @batchNumber,@quan

WHILE @@FETCH_STATUS = 0          --vòng lặp WHILE khi đọc Cursor thành công
BEGIN
	select @batchNumber=BatchNumber from Product where ProID=@pro
	select @price = Price from Batch where BatchNumber=@batchNumber
	set @total= @total + (@price * @quan)

    FETCH NEXT FROM cursorWork -- Đọc dòng tiếp
          INTO @batchNumber,@quan

END

CLOSE cursorWork           -- Đóng Cursor
DEALLOCATE cursorWork      -- Giải phóng tài nguyên
	update Cart set InvoiceDate = @ngay,Total=@total where [No]=@nocart
	update CustomerCheckIn set CheckOutTime=GETDATE() where CusId=@cusid and CheckOutTime is null
	set @out=@total
end
go

drop PROCEDURE if exists CusPos
go
CREATE PROCEDURE CusPos  @cusid int, @pos char(4), @expression int
as
begin	
	declare @flag int,@checkin int,@count int
	select @flag=COUNT(*) from CustomerCheckIn where CusId=@cusid and CheckOutTime is null
	if @flag = 0
	 begin
		print 'nobody'
	 end
	if @flag = 1
	select @checkin=[No] from CustomerCheckIn where CusId=@cusid and CheckOutTime is null
	select @count=count(*) from CustomerPos where CusId=@cusid and CheckInNo=@checkin
	update CustomerCheckIn set Expression = @expression where [No] = @checkin
		if @count = 0
		begin
			insert into CustomerPos(CusId,ShelvesID,CheckInNo) values (@cusid,@pos,@checkin)
		end
		else
		begin
			update CustomerPos set ShelvesID = @pos where CusId=@cusid and CheckInNo=@checkin
		end
end
go

drop FUNCTION if exists dbo.GetCart
go
CREATE FUNCTION dbo.GetCart 
(@cusid int)
RETURNS nvarchar(max)
AS
	begin	
		declare @nocart int,@out nvarchar(max),@count int
		declare @tmpTable table ([key] int,[Name] nvarchar(50),Price int, Quantity int)
		select @nocart=[No] from dbo.Cart where CusId=@cusid and InvoiceDate is null
		insert into @tmpTable
		select CONVERT(varchar, a.No) as [key],c.[Name],c.Price,a.Quantity as Quantity from CartDetail as a left join Batch as c on  a.BatchNumber=c.BatchNumber where a.NoCart=@nocart
		set @out = (select * from @tmpTable for json auto)
		select @count=count(*) from CartDetail where NoCart=@nocart 
		if @count = 0
			begin
				
				set @out = ''
				--set @out = '{"key":0,"Name":"Empty","Price":"Empty","Quantity":"Empty"}'
			end
		return (@out)
	end
go

drop FUNCTION if exists dbo.GetCustomers
go
CREATE FUNCTION dbo.GetCustomers()
RETURNS  @rtnTable TABLE 
(
    -- columns returned by the function
    [Name] nvarchar(50),
    NoCart int,
	Pos char(4),
	Emo varchar(14)
)
AS
	begin		
		DECLARE @TempTable table 
		([Name] nvarchar(50),
		NoCart int,
		Pos char(4),
		Emo varchar(14))

		insert into @TempTable
		select a.Name as [Name],b.No as NoCart,c.ShelvesID as Pos,(select e.VieName from Expression as e where ID=d.Expression) as Emo from Customer as a INNER JOIN Cart as b ON a.ID=b.CusId INNER JOIN CustomerPos as c ON c.CusId=a.ID INNER JOIN CustomerCheckIn as d on d.CusId=a.ID where b.InvoiceDate is null group by a.Name,b.No,c.ShelvesID,d.Expression
		
		insert into @rtnTable
			SELECT [Name],NoCart,Pos,Emo FROM @TempTable 
		return
	end
go

drop TRIGGER if exists trg_product
go
CREATE TRIGGER trg_product ON Product AFTER INSERT AS 
BEGIN
	declare @Amount int, @BatchNumber int,@sold int
	select @BatchNumber=BatchNumber,@sold=Sold from inserted where ProID= inserted.ProID
	select @Amount = Amount from Batch where BatchNumber=@BatchNumber
	UPDATE Batch SET Amount = @Amount + @sold where BatchNumber=@BatchNumber
END

drop PROCEDURE if exists GetVip
go
CREATE PROCEDURE GetVip  @num int,@date1 datetime, @date2 datetime,@out int out
as
begin	
	declare @ngay datetime,@nocart int,@sum float,@pro char(8),@quan int,@no int,@price int,@total int=0,@batchNumber int,@cusid int
	--set @out=(select CusID,Max(Sum(total)) from Cart where InvoiceDate between @date1 and @date2 group by CusId for json auto)
	select top(@num) CusID,Sum(total) as sumTotal from Cart where InvoiceDate between @date1 and @date2 group by CusID order by sumTotal
end
go

GO

--#endregion[dbo].[GetCustomers]
--'neutral', 'happy', 'sad', 'surprise', 'anger'
insert into Expression(ID,EngName,VieName) values (0,'neutral','Binh thuong')
insert into Expression(ID,EngName,VieName) values (1,'happy','Vui')
insert into Expression(ID,EngName,VieName) values (2,'sad','Buon')
insert into Expression(ID,EngName,VieName) values (3,'surprise','Ngac nhien')
insert into Expression(ID,EngName,VieName) values (4,'anger','Tuc gian')
-- INSERT PRODUCT
insert into TypeProduct([Name]) values (N'Alcohol')
insert into TypeProduct([Name]) values (N'Soda')
insert into Batch([Name],TypeID,Producer,DoI,DoM,DoE,Price,ShelvesDefault,Unit) values (N'Rượu vodka',1,N'Công ty ABC','20200202','20200102','20210102',200000,'A001','Chai')
insert into Batch([Name],TypeID,Producer,DoI,DoM,DoE,Price,ShelvesDefault,Unit) values (N'Cocacola',2,N'Công ty ABC','20200202','20200102','20210102',130000,'A002','Lon')
insert into Batch([Name],TypeID,Producer,DoI,DoM,DoE,Price,ShelvesDefault,Unit) values (N'Rượu gin',1,N'Công ty ABC','20200202','20200102','20210102',320000,'B001','Chai')
insert into Batch([Name],TypeID,Producer,DoI,DoM,DoE,Price,ShelvesDefault,Unit) values (N'Rượu vang',1,N'Công ty ABC','20200202','20200102','20210102',412000,'C003','Chai')
insert into Batch([Name],TypeID,Producer,DoI,DoM,DoE,Price,ShelvesDefault,Unit) values (N'Pepsi',2,N'Công ty ABC','20200202','20200102','20210102',23100,'D002','Lon')
-- real value
insert into Product(ProID,BatchNumber,ShelvesNow) values ('F5753E2A',1,'A001')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('B2D1C849',2,'A001')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('B5234C2A',1,'A001')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('F29E9F0D',3,'A001')

-- fake value
insert into Product(ProID,BatchNumber,ShelvesNow) values ('B1D1C849',1,'A003')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('A1D1C849',2,'A001')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('B1D1CE49',2,'A003')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('B1D1C812',1,'A001')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('B1D1F849',1,'A002')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('BGD1C8VS',2,'A001')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('B1E1C842',1,'A001')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('B1D1C329',1,'C001')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('B1SDAAX2',1,'A001')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('B1DAXCX2',1,'A001')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('G1DAXAX2',2,'A001')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('C1DAX4X2',3,'A001')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('B1DAXAX2',3,'A001')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('BSDASAX2',5,'A001')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('B1DAXJK2',2,'A001')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('BRD3XAX2',2,'A001')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('B1D5XAX2',5,'A001')
insert into Product(ProID,BatchNumber,ShelvesNow) values ('B1DAX2X2',2,'A001')

insert into Customer([Name],EngName,UserName,Pass) values (N'Hoàng Hiệp','HoangHiep','Cus1','1')
insert into CustomerCheckIn(CusId,Expression) values (1,0)
insert into Cart(CusId) values (1)
insert into CustomerPos(CheckInNo,CusId,ShelvesID) values (1,1,'A001')

insert into Customer([Name],EngName,UserName,Pass) values (N'Lê Thảo','LeThao','Cus2','1')
--insert into CustomerCheckIn(CusId,Expression) values (2,0)
--insert into Cart(CusId) values (2)
--insert into CustomerPos(CheckInNo,CusId,ShelvesID) values (2,2,'A001')

insert into Customer([Name],EngName,UserName,Pass) values (N'Đinh Phương','DinhPhuong','Cus3','1')
--insert into CustomerCheckIn(CusId,Expression) values (3,0)
--insert into Cart(CusId) values (3)
--insert into CustomerPos(CheckInNo,CusId,ShelvesID) values (3,3,'A003')
go

--go
--declare @out1 int exec addCart @pos='A001',@pro='B1DAXAX2',@out= @out1 output
--go
--declare @out1 int exec addCart @pos='A001',@pro='B2D1C849',@out= @out1 output
go

	insert into Cart(CusId,InvoiceDate,Total) values (1,'2020-03-03 10:00:00',10000)
	insert into Cart(CusId,InvoiceDate,Total) values (1,'2020-03-04 10:00:00',10000)
	insert into Cart(CusId,InvoiceDate,Total) values (2,'2020-03-05 10:00:00',40000)
	insert into Cart(CusId,InvoiceDate,Total) values (3,'2020-03-06 10:00:00',60000)
	insert into Cart(CusId,InvoiceDate,Total) values (2,'2020-03-07 10:00:00',10000)
	insert into CartDetail(NoCart,BatchNumber,Quantity) values (2,2,4)
	insert into CartDetail(NoCart,BatchNumber,Quantity) values (2,4,2)
	insert into CartDetail(NoCart,BatchNumber,Quantity) values (1,2,1)
	insert into CartDetail(NoCart,BatchNumber,Quantity) values (2,1,2)
	insert into CartDetail(NoCart,BatchNumber,Quantity) values (1,2,4)
	insert into CartDetail(NoCart,BatchNumber,Quantity) values (1,1,3)
	insert into CartDetail(NoCart,BatchNumber,Quantity) values (2,2,3)
	insert into CartDetail(NoCart,BatchNumber,Quantity) values (1,5,1)


	select * from Cart
	select top(2) CusID,Sum(total) as sumTotal from Cart where InvoiceDate between '2020-03-01' and '2020-03-30' group by CusID order by sumTotal

	