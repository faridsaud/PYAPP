ALTER TABLE `proyectoIntegrador`.`TEST`
DROP FOREIGN KEY `FK_HAVE_COU_TES`;
ALTER TABLE `proyectoIntegrador`.`TEST`
ADD CONSTRAINT `FK_HAVE_COU_TES`
FOREIGN KEY (`IDCOURSE`)
REFERENCES `proyectoIntegrador`.`COURSE` (`IDCOURSE`)
ON DELETE CASCADE;

ALTER TABLE `proyectoIntegrador`.`USR_COU`
DROP FOREIGN KEY `FK_USR_COU2`;
ALTER TABLE `proyectoIntegrador`.`USR_COU`
ADD CONSTRAINT `FK_USR_COU2`
FOREIGN KEY (`IDCOURSE`)
REFERENCES `proyectoIntegrador`.`COURSE` (`IDCOURSE`)
ON DELETE CASCADE;

ALTER TABLE `proyectoIntegrador`.`USR_TES`
DROP FOREIGN KEY `FK_USR_TES2`;
ALTER TABLE `proyectoIntegrador`.`USR_TES`
ADD CONSTRAINT `FK_USR_TES2`
FOREIGN KEY (`IDTEST`)
REFERENCES `proyectoIntegrador`.`TEST` (`IDTEST`)
ON DELETE CASCADE;

ALTER TABLE `proyectoIntegrador`.`QUESTION`
DROP FOREIGN KEY `FK_HAVE_TES_QUE`;
ALTER TABLE `proyectoIntegrador`.`QUESTION`
ADD CONSTRAINT `FK_HAVE_TES_QUE`
FOREIGN KEY (`IDTEST`)
REFERENCES `proyectoIntegrador`.`TEST` (`IDTEST`)
ON DELETE CASCADE;

ALTER TABLE `proyectoIntegrador`.`OPTIO`
DROP FOREIGN KEY `FK_HAVE_QUE_OPT`;
ALTER TABLE `proyectoIntegrador`.`OPTIO`
ADD CONSTRAINT `FK_HAVE_QUE_OPT`
FOREIGN KEY (`IDQUESTION`)
REFERENCES `proyectoIntegrador`.`QUESTION` (`IDQUESTION`)
ON DELETE CASCADE;

ALTER TABLE `proyectoIntegrador`.`USR_OPT`
DROP FOREIGN KEY `FK_USR_OPT2`;
ALTER TABLE `proyectoIntegrador`.`USR_OPT`
ADD CONSTRAINT `FK_USR_OPT2`
FOREIGN KEY (`IDOPTION`)
REFERENCES `proyectoIntegrador`.`OPTIO` (`IDOPTION`)
ON DELETE CASCADE;
