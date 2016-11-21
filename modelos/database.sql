/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     11/20/2016 9:25:37 PM                        */
/*==============================================================*/


drop table if exists COURSE;

drop table if exists INSTITUTION;

drop table if exists OPTIO;

drop table if exists QUESTION;

drop table if exists ROLE;

drop table if exists TEST;

drop table if exists USER;

drop table if exists USR_COU;

drop table if exists USR_ROL;

drop table if exists USR_TES;

/*==============================================================*/
/* Table: COURSE                                                */
/*==============================================================*/
create table COURSE
(
   IDCOURSE             bigint not null auto_increment,
   DESCRIPTIONCOURSE    text,
   CREATEDBYCOURSE      varchar(254),
   NAMECOURSE           varchar(40),
   primary key (IDCOURSE)
);

/*==============================================================*/
/* Table: INSTITUTION                                           */
/*==============================================================*/
create table INSTITUTION
(
   IDINSTITUTION        int not null,
   EMAIL                varchar(254),
   NAMEINSTITUTION      varchar(30),
   CREATEDBYINSTITUTION char(10),
   primary key (IDINSTITUTION)
);

/*==============================================================*/
/* Table: OPTIO                                                 */
/*==============================================================*/
create table OPTIO
(
   IDOPTION             bigint not null auto_increment,
   IDQUESTION           bigint,
   EMAIL                varchar(254),
   JUSTIFICATION        text,
   ISCORRECT            bool,
   TYPEOPTION           varchar(10),
   TEXTOPTION           text,
   ISSELECTED           bool,
   primary key (IDOPTION)
);

/*==============================================================*/
/* Table: QUESTION                                              */
/*==============================================================*/
create table QUESTION
(
   IDQUESTION           bigint not null auto_increment,
   IDTEST               bigint,
   TYPEQUESTION         varchar(10),
   TEXTQUESTION         text,
   WEIGHT               int,
   primary key (IDQUESTION)
);

/*==============================================================*/
/* Table: ROLE                                                  */
/*==============================================================*/
create table ROLE
(
   NAME                 varchar(10) not null,
   primary key (NAME)
);

/*==============================================================*/
/* Table: TEST                                                  */
/*==============================================================*/
create table TEST
(
   IDTEST               bigint not null auto_increment,
   IDCOURSE             bigint,
   TITLE                text,
   DESCRIPTIONTEST      text,
   CREATEDBYTEST        varchar(254),
   STATUS               varchar(10),
   STARTDATETIME        varchar(24),
   FINISHDATETIME       varchar(24),
   AVERAGESCORE         decimal(4,2),
   primary key (IDTEST)
);

/*==============================================================*/
/* Table: USER                                                  */
/*==============================================================*/
create table USER
(
   EMAIL                varchar(254) not null,
   PASSWORD             varchar(60),
   FIRSTNAME            varchar(30),
   LASTNAME             varchar(30),
   IDPASSPORT           varchar(15),
   COUNTRY              varchar(30),
   USERNAME             varchar(40),
   primary key (EMAIL)
);

/*==============================================================*/
/* Table: USR_COU                                               */
/*==============================================================*/
create table USR_COU
(
   EMAIL                varchar(254) not null,
   IDCOURSE             bigint not null,
   STATUSUSRCOU         varchar(1) not null,
   primary key (EMAIL, IDCOURSE, STATUSUSRCOU)
);

/*==============================================================*/
/* Table: USR_ROL                                               */
/*==============================================================*/
create table USR_ROL
(
   EMAIL                varchar(254) not null,
   NAME                 varchar(10) not null,
   primary key (EMAIL, NAME)
);

/*==============================================================*/
/* Table: USR_TES                                               */
/*==============================================================*/
create table USR_TES
(
   EMAIL                varchar(254) not null,
   IDTEST               bigint not null,
   SCORE                decimal(4,2),
   STATUSUSRTES         varchar(1) not null,
   primary key (EMAIL, IDTEST, STATUSUSRTES)
);

alter table INSTITUTION add constraint FK_USR_INS foreign key (EMAIL)
      references USER (EMAIL) on delete restrict on update restrict;

alter table OPTIO add constraint FK_POSEE foreign key (IDQUESTION)
      references QUESTION (IDQUESTION) on delete restrict on update restrict;

alter table OPTIO add constraint FK_USR_OPC foreign key (EMAIL)
      references USER (EMAIL) on delete restrict on update restrict;

alter table QUESTION add constraint FK_CONTIENE foreign key (IDTEST)
      references TEST (IDTEST) on delete restrict on update restrict;

alter table TEST add constraint FK_TIENE_CUR_PRU foreign key (IDCOURSE)
      references COURSE (IDCOURSE) on delete restrict on update restrict;

alter table USR_COU add constraint FK_USR_COU foreign key (EMAIL)
      references USER (EMAIL) on delete restrict on update restrict;

alter table USR_COU add constraint FK_USR_COU2 foreign key (IDCOURSE)
      references COURSE (IDCOURSE) on delete restrict on update restrict;

alter table USR_ROL add constraint FK_USR_ROL foreign key (EMAIL)
      references USER (EMAIL) on delete restrict on update restrict;

alter table USR_ROL add constraint FK_USR_ROL2 foreign key (NAME)
      references ROLE (NAME) on delete restrict on update restrict;

alter table USR_TES add constraint FK_USR_TES foreign key (EMAIL)
      references USER (EMAIL) on delete restrict on update restrict;

alter table USR_TES add constraint FK_USR_TES2 foreign key (IDTEST)
      references TEST (IDTEST) on delete restrict on update restrict;

