CREATE PROCEDURE insertProjects(@Id VARCHAR(100) , @ProjectName VARCHAR(200) , @Due_date DATE, @Description VARCHAR(200),@Status VARCHAR(100))
AS
BEGIN
INSERT INTO Projects(Id,ProjectName,Due_date,Description,Status) VALUES (@Id, @ProjectName, @Due_date,  @Description, "Pending")
END

CREATE PROCEDURE getProjects
AS
BEGIN
SELECT * FROM Projects
END

CREATE PROCEDURE getProject(@Id VARCHAR(100))
AS
BEGIN
SELECT * FROM Projects WHERE Id =@Id
END

CREATE PROCEDURE deleteProject(@Id VARCHAR(100))
AS
BEGIN
DELETE FROM Projects WHERE Id =@Id
END



CREATE PROCEDURE updateProject(@Id VARCHAR(100))
AS
BEGIN 
UPDATE Projects SET Status="Completed" WHERE Id =@Id

END

--Completed Projects
CREATE PROCEDURE getCompletedProjects
AS
BEGIN
SELECT * FROM Projects WHERE Status = "Completed"
END