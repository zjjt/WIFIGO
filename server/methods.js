import {moment} from 'meteor/momentjs:moment';
import {Email} from 'meteor/email';
import Sequelize from 'sequelize';
import {Meteor} from 'meteor/meteor';
import{Promise} from 'meteor/promise';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {check} from 'meteor/check';
import {DBSQLSERVER} from '../imports/api/connectors';
import {Prospects,Clients} from '../imports/api/collections';

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
        sendEmail(to,from,subject,text){
            check([to],[Array]);
            check([from,subject,text],[String]);
            this.unblock();
            Email.send({to,from,subject,html:text});
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
                            age:values.age,
                            telephone:values.telephone,
                            email:values.email,
                            dateConnexion:new Date()
                        }
                    });
                    //return true;
                }else{
                    //insert
                    Prospects.insert({
                        nom:values.nom,
                        prenom:values.prenom,
                        age:values.age,
                        telephone:values.telephone,
                        email:values.email,
                        dateConnexion:new Date()
                    });
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
                        nom:values.nom,
                        dateNaissance:values.dateNaissance,
                        telephone1:typeof values.telephone1!="undefined"?values.telephone1:found?found.telephone1:null,
                        telephone2:typeof values.telephone2!="undefined"?values.telephone2:found?found.telephone2:null,
                        lieuNaissance:typeof values.lieuNaissance!="undefined"?values.lieuNaissance:found?found.lieuNaissance:null,
                        sexe:typeof values.sexe!="undefined"?values.sexe:found?found.sexe:null,
                        situation_matrimoniale:typeof values.matrimoniale!="undefined"?values.matrimoniale:found?found.situation_matrimoniale:null,
                        email:typeof values.email!="undefined"?values.email:found?found.email:null,
                        adresse:typeof values.adresse!="undefined"?values.adresse:found?found.adresse:null,
                        dateConnexion:new Date()
                    }
                });
                //return true;
            }else{
                //insert
                Clients.insert({
                    nom:values.nom,
                    dateNaissance:values.dateNaissance,
                    telephone1:values.telephone1,
                    telephone2:values.telephone2,
                    lieuNaissance:values.lieu,
                    sexe:values.sexe,
                    situation_matrimoniale:values.matrimoniale,
                    email:values.email,
                    adresse:values.adresse,
                    dateConnexion:new Date()
                });
                //return true;
            }
        },
        getClientInfos(police,datenaissance){
            let query=`SELECT JAPOLIP_WNUPO AS police
                    ,JAIDENP_NOMTOT AS nom_total, 
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
                           ,E.X.value('SEXAD[1]','VARCHAR(2)')sexe_assure
FROM NSIACIF.JAPOLIP A JOIN NSIACIF.JAIDENP B ON JAPOLIP_WUCLI = JAIDENP_WNUAD
                                     JOIN (SELECT JAIDENP_WNUAD,CONVERT(XML,FICXML) FICXML FROM NSIACIF.JAIDENP) T ON T.JAIDENP_WNUAD=JAPOLIP_JAASSUP_WNUAD
                                     
                                   CROSS APPLY T.FICXML.nodes('//JAIDENP') v(X) 
                                   CROSS APPLY T.FICXML.nodes('//JAIDENP') E(X) 
WHERE JAPOLIP_WNUPO = :p and JAIDENP_DNAAD = :d
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