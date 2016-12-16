/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     12/15/2016 9:53:54 PM                        */
/*==============================================================*/


drop table if exists COURSE;

drop table if exists OPTIO;

drop table if exists QUESTION;

drop table if exists ROLE;

drop table if exists SECURITYQUESTION;

drop table if exists TEST;

drop table if exists USER;

drop table if exists USR_COU;

drop table if exists USR_OPT;

drop table if exists USR_ROL;

drop table if exists USR_SQU;

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
/* Table: OPTIO                                                 */
/*==============================================================*/
create table OPTIO
(
   IDOPTION             bigint not null auto_increment,
   IDQUESTION           bigint,
   JUSTIFICATION        text,
   ISCORRECT            bool,
   TEXTOPTION           text,
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
/* Table: SECURITYQUESTION                                      */
/*==============================================================*/
create table SECURITYQUESTION
(
   TEXTSECURITYQUESTION varchar(300),
   IDSECURITYQUESTION   int not null auto_increment,
   primary key (IDSECURITYQUESTION)
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
   STATUS               char(1),
   STARTDATETIME        varchar(24),
   FINISHDATETIME       varchar(24),
   AVERAGESCORE         decimal(4,2),
   INTENTS              int,
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
   PIN                  varchar(60),
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
/* Table: USR_OPT                                               */
/*==============================================================*/
create table USR_OPT
(
   EMAIL                varchar(254) not null,
   IDOPTION             bigint not null,
   primary key (EMAIL, IDOPTION)
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
/* Table: USR_SQU                                               */
/*==============================================================*/
create table USR_SQU
(
   EMAIL                varchar(254) not null,
   IDSECURITYQUESTION   int not null,
   ANSWERSELECTED       varchar(300),
   primary key (EMAIL, IDSECURITYQUESTION)
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
   INTENTLEFT           int,
   primary key (EMAIL, IDTEST, STATUSUSRTES)
);

alter table OPTIO add constraint FK_HAVE_QUE_OPT foreign key (IDQUESTION)
      references QUESTION (IDQUESTION) on delete restrict on update restrict;

alter table QUESTION add constraint FK_HAVE_TES_QUE foreign key (IDTEST)
      references TEST (IDTEST) on delete restrict on update restrict;

alter table TEST add constraint FK_HAVE_COU_TES foreign key (IDCOURSE)
      references COURSE (IDCOURSE) on delete restrict on update restrict;

alter table USR_COU add constraint FK_USR_COU foreign key (EMAIL)
      references USER (EMAIL) on delete restrict on update restrict;

alter table USR_COU add constraint FK_USR_COU2 foreign key (IDCOURSE)
      references COURSE (IDCOURSE) on delete restrict on update restrict;

alter table USR_OPT add constraint FK_USR_OPT foreign key (EMAIL)
      references USER (EMAIL) on delete restrict on update restrict;

alter table USR_OPT add constraint FK_USR_OPT2 foreign key (IDOPTION)
      references OPTIO (IDOPTION) on delete restrict on update restrict;

alter table USR_ROL add constraint FK_USR_ROL foreign key (EMAIL)
      references USER (EMAIL) on delete restrict on update restrict;

alter table USR_ROL add constraint FK_USR_ROL2 foreign key (NAME)
      references ROLE (NAME) on delete restrict on update restrict;

alter table USR_SQU add constraint FK_USR_SQU foreign key (EMAIL)
      references USER (EMAIL) on delete restrict on update restrict;

alter table USR_SQU add constraint FK_USR_SQU2 foreign key (IDSECURITYQUESTION)
      references SECURITYQUESTION (IDSECURITYQUESTION) on delete restrict on update restrict;

alter table USR_TES add constraint FK_USR_TES foreign key (EMAIL)
      references USER (EMAIL) on delete restrict on update restrict;

alter table USR_TES add constraint FK_USR_TES2 foreign key (IDTEST)
      references TEST (IDTEST) on delete restrict on update restrict;

