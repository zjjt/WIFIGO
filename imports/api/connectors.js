
import Sequelize from 'sequelize';
import {Meteor} from 'meteor/meteor';

const DBSQLSERVER= new Sequelize(Meteor.settings.DBSQLSERVER_DATABASE,Meteor.settings.DBSQLSERVER_USER, Meteor.settings.DBSQLSERVER_PASSWORD, {
    host:Meteor.settings.DBSQLSERVER_HOST,
    port:57055,//Meteor.settings.DBSQLSERVER_PORT,
    dialect: 'mssql',
    dialectOptions:{
      requestTimeout:1625000
    },
    //storage: './DB/moduleRGT.db',
});

const DBSQLSERVERBCIVIE= new Sequelize(Meteor.settings.DBSQLSERVER_BCIVIE_DATABASE,Meteor.settings.DBSQLSERVER_BCIVIE_USER, Meteor.settings.DBSQLSERVER_BCIVIE_PASSWORD, {
  host:Meteor.settings.DBSQLSERVER_BCIVIE_HOST,
  port:56778,//57055,//Meteor.settings.DBSQLSERVER_PORT,
  dialect: 'mssql',
  dialectOptions:{
    requestTimeout:1625000
  },
  //storage: './DB/moduleRGT.db',
});

//modelisation de la table temporaire wifigo
const BCIVIE_WIFIGO = DBSQLSERVERBCIVIE.define('TEMP_WIFIGO', {
  IDSOUSCRIPTEUR : Sequelize.STRING,
  EMAIL : Sequelize.STRING,
  ADRESSE  : Sequelize.STRING,
  PROFESSION  : Sequelize.STRING,
  SIT_MATRIMONIALE  : Sequelize.STRING,
  LIEU_NAISS  : Sequelize.STRING,
  TEL1  : Sequelize.STRING,
  TEL2  : Sequelize.STRING,
  DATE_MODIF : Sequelize.STRING,
},{
  timestamps:false,
  freezeTableName: true//sinon il va ajouter un s derriere le nom de table
});

export {DBSQLSERVER,DBSQLSERVERBCIVIE,BCIVIE_WIFIGO};