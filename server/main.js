import { Meteor } from 'meteor/meteor';
import {moment} from 'meteor/momentjs:moment';
import '../imports/startup/server/index';
import methods from './methods';
import ClientsList from './publications/ClientsPub';
import ProspectsList from './publications/ProspectsPub'; 
import LogList from './publications/LogPub';
import {Clients,Prospects} from '../imports/api/collections';
import {DBSQLSERVERBCIVIE,DBSQLSERVER,BCIVIE_WIFIGO} from '../imports/api/connectors';
var schedule = require('node-schedule');

Meteor.startup(() => {
  // code to run on server at startup
  //MacList();
  ClientsList();
  LogList();
  ProspectsList();
  methods();
});


//planification du deversement dans B_CIVIE
var j = schedule.scheduleJob('05 16 * * *', async function(){
  if(Meteor.isServer){
    let errors=false;
  let allModifsDoneToday=await Clients.find().fetch();
  if(allModifsDoneToday.length){
    console.dir(allModifsDoneToday)
    allModifsDoneToday.map((e,i,arr)=>{
      BCIVIE_WIFIGO.build({
        IDSOUSCRIPTEUR : e.idSouscripteur?e.idSouscripteur:null,
        EMAIL : e.email?e.email:null,
        ADRESSE  : e.adresse?e.adresse:null,
        PROFESSION  : e.profession?e.profession:null,
        SIT_MATRIMONIALE  : e.situation_matrimoniale?e.situation_matrimoniale:null,
        LIEU_NAISS  : e.lieuNaissance?e.lieuNaissance:null,
        TEL1  : e.telephone1?e.telephone1:null,
        TEL2  : e.telephone2?e.telephone2:null,
        DATE_MODIF : e.dateConnexion?moment(e.dateConnexion).format("YYYYMMDD"):null,
      }).save().catch(error => {
        errors=true;
        console.log(error);
      });
    });
    console.log(errors)
    /*if(!errors){
      let query="exec dbo.UPDATE_WIFIGO ";
      DBSQLSERVER.query(query);
      Clients.rawCollection().drop();
      console.log("done saving")
    }*/
  }
  }
  
});

var w = schedule.scheduleJob('28 18 * * *',function(){
 
      console.log("done extracting and sending mails");
});
/*
var w = schedule.scheduleJob('28 18 * * *',function(){
  let query="exec dbo.UPDATE_WIFIGO ";
      DBSQLSERVER.query(query);
      Clients.rawCollection().drop();
      console.log("done saving");
}); */