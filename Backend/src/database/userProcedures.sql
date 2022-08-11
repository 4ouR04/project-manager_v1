-- Create User  When They Sign Up
CREATE PROCEDURE createUser (@ID VARCHAR(100) ,@Name VARCHAR(200), @Email VARCHAR(200) , @Password VARCHAR(200))
AS
BEGIN
INSERT INTO Users(Id, Name, Email, Password) VALUES (@Id, @Name, @Email, @Password)
END

-- Get one User
CREATE PROCEDURE getUser(@Email VARCHAR(200))
AS
BEGIN
SELECT * FROM Users WHERE Email =@Email
END

-- Get All Users
CREATE PROCEDURE getUsers
AS
BEGIN 
SELECT * FROM Users
END

-- Check user role
CREATE PROCEDURE checkUserRole
AS
BEGIN 
SELECT * FROM Users WHERE Role ="Admin"
END

-- Delete User
CREATE PROCEDURE deleteUser(@ID VARCHAR(100))
AS
BEGIN
DELETE FROM Users WHERE Id =@Id
END
