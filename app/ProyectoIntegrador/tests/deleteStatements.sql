DELETE FROM `proyectoIntegrador`.`USER` WHERE `EMAIL`='test@test.com';
DELETE FROM `proyectoIntegrador`.`USER` WHERE `EMAIL`='test2@test.com';
INSERT INTO `proyectoIntegrador`.`USER` (`EMAIL`,`PASSWORD`) VALUES ("test2@test.com","$2a$10$81FrD3YvA1rHVgzzjc8AaeeXFCSuxwI4NNurR0sjFk.3ziczjejWi");
INSERT INTO `proyectoIntegrador`.`USR_ROL` (`EMAIL`, `NAME`) VALUES ('test2@test.com', 'student');
