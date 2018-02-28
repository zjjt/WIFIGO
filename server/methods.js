import {moment} from 'meteor/momentjs:moment';
//import {Email} from 'meteor/email';
import Sequelize from 'sequelize';
import {Meteor} from 'meteor/meteor';
import{Promise} from 'meteor/promise';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {check} from 'meteor/check';
import {DBSQLSERVER} from '../imports/api/connectors';
import {convertInDateObjFromFrenchDate} from '../imports/utils/utils';
import Future from 'fibers/future';
import {Prospects,Clients,Log} from '../imports/api/collections';
let Excel=require('exceljs');

export default ()=>{
    let getMikrotikData=new ValidatedMethod({
        name:'existInDB',
        validate:new SimpleSchema({
            mac:{type:String},
           /* ip:{type:String},
            rid:{type:String},
            username:{type:String},
            url:{type:String},
            linkorigin:{type:String},
            error:{type:String},
            chapid:{type:String},
            chapChallenge:{type:String},
            linkloginonly:{type:String},
            linkorigesc:{type:String},
            macesc:{type:String},*/
        }).validator(),
        mixins:[RestMethodMixin],
        restOptions:{
            url:'/routing',
        },
        run({mac/*,ip,rif,username,url,linkorigin,error,chapid,chapChallenge,linkloginonly,linkorigesc,macesc*/}){
            //corps de la methode
            return "le post marche "+mac;
            
        }
    });
    Meteor.methods({
        /*sendEmail(to,from,subject,text){
            check([to],[Array]);
            check([from,subject,text],[String]);
            this.unblock();
            Email.send({to,from,subject,html:text});
        },*/
        downloadProspects(){
            let fut=new Future();
            let workbook=new Excel.Workbook();
            workbook.creator='WIFIGO';
                workbook.lastModifierdBy='WIFIGO';
                workbook.created=new Date();
                workbook.modified = new Date();
                workbook.properties.date1904=true;
                workbook.views=[{
                    x:0,y:0,width:10000,height:20000,firstSheet:0,activeTab:1,visibility:'visible'
                }];
                let sheet=workbook.addWorksheet("Prospects WIFIGO "+moment(new Date()).format("DD-MM-YYYY"));
                sheet.columns=[{
                        header:'NOM',
                        key:'N',
                        width:20
                    },{
                        header:'PRENOM',
                        key:'P',
                        width:20 
                    },{
                        header:'DATE_NAISSANCE',
                        key:'D',
                        width:20 
                    },{
                        header:'TELEPHONE',
                        key:'T',
                        width:20 
                    },{
                        header:'EMAIL',
                        key:'E',
                        width:20 
                    },{
                        header:'DATE CONNEXION',
                        key:'DC',
                        width:20 
                    },{
                        header:'HEURE CONNEXION',
                        key:'H',
                        width:20 
                    }];

                Prospects.find({}).fetch().map((e,i,arr)=>{
                    sheet.addRow({
                        N:e.nom,
                        P:e.prenom,
                        D:e.datenaissance,
                        T:e.telephone,
                        E:e.email,
                        DC:moment(e.dateConnexion).format("DD/MM/YYYY"),
                        H:moment(e.dateConnexion).format("HH:mm"),
                        });
                });
                 workbook.xlsx.writeBuffer()//on transforme le tout en un blob que lon renverra au client pour telecharger via filesaver
                    .then(function(e){
                        //console.dir(e);
                        console.log("xls prospects file is written.");
                        let o={blob:e,date:new Date()};
                        //return o;
                        //console.dir(o);
                        fut['return'](o);   
                        //return buffer.getContents();
                    });
                    return fut.wait();
        },
         downloadLog(){
            let fut=new Future();
            let workbook=new Excel.Workbook();
            workbook.creator='WIFIGO';
                workbook.lastModifierdBy='WIFIGO';
                workbook.created=new Date();
                workbook.modified = new Date();
                workbook.properties.date1904=true;
                workbook.views=[{
                    x:0,y:0,width:10000,height:20000,firstSheet:0,activeTab:1,visibility:'visible'
                }];
                let sheet=workbook.addWorksheet("Log de connexion au "+moment(new Date()).format("DD-MM-YYYY"));
                sheet.columns=[{
                        header:'IDENTITE',
                        key:'I',
                        width:20
                    },{
                        header:'NOM TOTAL',
                        key:'N',
                        width:20 
                    },{
                        header:'CATEGORIE',
                        key:'C',
                        width:20 
                    },{
                        header:'DATE CONNEXION',
                        key:'D',
                        width:20 
                    },{
                        header:'HEURE CONNEXION',
                        key:'H',
                        width:20 
                    }];

                Log.find({}).fetch().map((e,i,arr)=>{
                    sheet.addRow({
                        I:e.identite,
                        N:e.nomTotal,
                        C:e.type==="C"?"client":"prospect",
                        D:moment(e.dateConnexion).format("DD/MM/YYYY"),
                        H:moment(e.dateConnexion).format("HH:mm"),
                        });
                });
                 workbook.xlsx.writeBuffer()//on transforme le tout en un blob que lon renverra au client pour telecharger via filesaver
                    .then(function(e){
                        //console.dir(e);
                        console.log("xls log file is written.");
                        let o={blob:e,date:new Date()};
                        //return o;
                        //console.dir(o);
                        fut['return'](o);   
                        //return buffer.getContents();
                    });
                    return fut.wait();
        },
        saveLog(values,type){
            //console.log("values====");
            //console.dir(values);
            //console.log("type=="+type)
            if(type==="clients"){
                Log.insert({
                    nomTotal:values.nom+" "+values.prenoms,
                    identite:values.idSouscripteur,
                    dateConnexion:new Date(),
                    type:"C"
                });
                console.log("saving client log");
            }else if(type==="prospects"){
                Log.insert({
                    nomTotal:values.nom+" "+values.prenom,
                    identite:"none",
                    dateConnexion:new Date(),
                    type:"P"
                });
            }
        },
        saveProspect(values){
            console.dir(values);
            
                console.log("storing prospects");
                let found=Prospects.findOne({nom:{$regex:values.nom,$options: 'i'},prenom:{$regex:values.prenom,$options: 'i'}});
                if(found){
                    //update
                    Prospects.update(found._id,{
                        $set:{
                            nom:values.nom,
                            prenom:values.prenom,
                            datenaissance:convertInDateObjFromFrenchDate(values.datenaissance),
                            telephone:values.telephone,
                            email:values.email,
                            dateConnexion:new Date()
                        }
                    });
                    //stockage de l'adresse mac utilisée
                   /* macAdresses.insert({
                        mac_adr:values.macAdr,
                        dateConnexion:new Date()
                    })*/
                    //return true;
                }else{
                    //insert
                    Prospects.insert({
                        nom:values.nom,
                        prenom:values.prenom,
                        datenaissance:convertInDateObjFromFrenchDate(values.datenaissance),
                        telephone:values.telephone,
                        email:values.email,
                        dateConnexion:new Date()
                    });

                    //stockage de l'adresse mac utilisée
                    /*macAdresses.insert({
                        mac_adr:values.macAdr,
                        dateConnexion:new Date()
                    })*/
                    //return true;
                }
               
        },
        saveClientMods(values){
            console.dir(values);
            
            console.log("storing Clients");
            let found=Clients.findOne({nom:values.nom,dateNaissance:values.dateNaissance});
            if(found){
                //update
                Clients.update(found._id,{
                    $set:{
                        idSouscripteur:values.idSous,
                        nom:values.nom,
                        dateNaissance:values.dateNaissance,
                        telephone1:typeof values.telephone1!="undefined"?values.telephone1:found?found.telephone1:null,
                        telephone2:typeof values.telephone2!="undefined"?values.telephone2:found?found.telephone2:null,
                        lieuNaissance:typeof values.lieuNaissance!="undefined"?values.lieuNaissance:found?found.lieuNaissance:null,
                        sexe:typeof values.sexe!="undefined"?values.sexe:found?found.sexe:null,
                        situation_matrimoniale:typeof values.matrimoniale!="undefined"?values.matrimoniale:found?found.situation_matrimoniale:null,
                        email:typeof values.email!="undefined"?values.email:found?found.email:null,
                        adresse:typeof values.adresse!="undefined"?values.adresse:found?found.adresse:null,
                        profession:typeof values.profession!="undefined"?values.profession:found?found.profession:null,
                        dateConnexion:new Date()
                    }
                });
                //stockage de l'adresse mac utilisée
                /*macAdresses.insert({
                    mac_adr:values.macAdr,
                    dateConnexion:new Date()
                })*/
                //return true;
            }else{
                //insert
                Clients.insert({
                    idSouscripteur:values.idSous,
                    nom:values.nom,
                    dateNaissance:values.dateNaissance,
                    telephone1:values.telephone1,
                    telephone2:values.telephone2,
                    lieuNaissance:values.lieu,
                    sexe:values.sexe,
                    situation_matrimoniale:values.matrimoniale,
                    email:values.email,
                    adresse:values.adresse,
                    profession:values.profession,
                    dateConnexion:new Date()
                });
                //stockage de l'adresse mac utilisée
               /* macAdresses.insert({
                    mac_adr:values.macAdr,
                    dateConnexion:new Date()
                })*/
                //return true;
            }
        },
        getClientInfos(police,datenaissance){
            console.log("police "+police+"---datenaissance "+datenaissance)
            let query=`SELECT JAPOLIP_WNUPO AS police
                    ,JAIDENP_NOMTOT AS nom_total, 
                    JAPOLIP_WUCLI AS idSouscripteur,
                    JAIDENP_NOMAD AS nom,
                    JAIDENP_PREAD AS prenoms,
                    JAIDENP_DNAAD AS date_naissance,
                    DBO.EMAIL_ID(JAPOLIP_WUCLI) AS email, 
                    DBO.ADRESSE_ID(JAPOLIP_WUCLI) AS adresse,
                    DBO.CONTACT_ID(JAPOLIP_WUCLI) AS contact,
                    [dbo].[lieunaissance_id](japolip_wucli) as lieu_naissance
                    ,(CASE WHEN v.X.value('SFAAD[1]','varchar(5)')='CC' THEN 'CONCUBINAGE' 
                           WHEN v.X.value('SFAAD[1]','varchar(5)')='CE' THEN 'CELIBATAIRE' 
                           WHEN v.X.value('SFAAD[1]','varchar(5)')='DI' THEN 'DIVORCE' 
                           WHEN v.X.value('SFAAD[1]','varchar(5)')='MA' THEN 'MARIE' 
                           WHEN v.X.value('SFAAD[1]','varchar(5)')='PA' THEN 'PACSE' 
                           WHEN v.X.value('SFAAD[1]','varchar(5)')='SE' THEN 'SEPARE' 
                           WHEN v.X.value('SFAAD[1]','varchar(5)')='VE' THEN 'VEUF' ELSE
                           v.X.value('SFAAD[1]','varchar(5)') END ) situation_matrimoniale
                           ,v.X.value('SEXAD[1]','VARCHAR(2)')sexe_assure
                           ,v.X.value('AD0AD[1]','VARCHAR(MAX)')profession
FROM NSIACIF.JAPOLIP A JOIN NSIACIF.JAIDENP B ON JAPOLIP_WUCLI = JAIDENP_WNUAD
                                     JOIN (SELECT JAIDENP_WNUAD,CONVERT(XML,FICXML) FICXML FROM NSIACIF.JAIDENP) T ON T.JAIDENP_WNUAD=JAPOLIP_WUCLI
                                     
                                   CROSS APPLY T.FICXML.nodes('//JAIDENP') v(X) 
WHERE JAPOLIP_WNUPO = :p and JAIDENP_DNAAD = :d and JAPOLIP_WNUPO > 0
`;
            return DBSQLSERVER.query(query,{
                replacements:{
                    p:police,
                    d:datenaissance
                },
                type:DBSQLSERVER.QueryTypes.SELECT
            }).then(user=>{
                if(user.length){
                    console.dir(user);
                    return user;
                }else{
                    throw new Meteor.Error("error","Cet utilisateur est inexistant dans la base de données.Veuillez vous diriger vers le service clientèle.");  
                }
                
            }).catch((err)=>{
                //console.log(err);
               return err.reason;
            });
        }
    });
}