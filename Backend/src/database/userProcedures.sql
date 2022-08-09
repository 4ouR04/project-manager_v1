-- Create User  When They Sign Up
CREATE PROCEDURE createUser (@ID VARCHAR(100) , @Email VARCHAR(200) , @Password VARCHAR(200))
AS
BEGIN
INSERT INTO Users(Id,User,Email,Password) VALUES (@Id, @Email, @Password)
END

-- Get All Users
CREATE PROCEDURE getUsers
AS
BEGIN 
SELECT * FROM Users
END

-- Delete User
CREATE PROCEDURE deleteUser(@ID VARCHAR(100))
AS
BEGIN
DELETE FROM Users WHERE Id =@Id
END
