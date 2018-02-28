import {Meteor} from 'meteor/meteor';
import {finprocessnon,finprocessoui} from '../../redux/actions/processActions';
import store from '../../redux/store';
import {SubmissionError} from 'redux-form';
import {validateEmail,isValidDate} from '../../utils/utils';

const submitNon=(values)=>{
    values.macAdr=store.getState().flowProcess.urlParams.mac;

    if(values.nom===''||!values.nom){
        throw new SubmissionError({nom:"Le champs Nom de famille ne peut être vide.",_error:'Echec de la soumission'})   
       }
       else if(values.prenom===''||!values.prenom){
           throw new SubmissionError({prenom:"Le champs Prénom ne peut être vide.",_error:'Echec de la soumission'})    
       }
       else if(values.datenaissance==="" ||values.datenaissance<10||values.datenaissance>10||!isValidDate(values.datenaissance.substring(6),values.datenaissance.substring(3,5),values.datenaissance.substring(0,2))){
         throw new SubmissionError({datenaissance:"Veuillez fournir une date de naissance valide au format JJ-MM-AAAA.",_error:'Echec de la soumission'});
       }
       else if(values.telephone===''||isNaN(Number(values.telephone))||values.telephone.length<8||values.telephone.length>8){
           throw new SubmissionError({telephone:"Veuillez fournir un numéro de téléphone valide.",_error:"Echec de la soumission"});
       }
       else if(values.email===''||!validateEmail(values.email)){
           throw new SubmissionError({email:"Veuillez fournir un email valide.",_error:"Echec de la soumission"});    
       }else{
        Meteor.call("saveProspect",values,(err,res)=>{
            Meteor.call("saveLog",values,"prospects",(err,res)=>{
                if(err){
               
                }else{
                    //alert("dispatching meteor call")
                //dispatch action afin de rediriger pour 20min
                   store.dispatch(finprocessnon());
                }
            });
           
        });
       }
   
};

const submitYes=(values)=>{
    values.nom=store.getState().flowProcess.client.nom_total;
    values.idSous=store.getState().flowProcess.client.idSouscripteur;
    values.dateNaissance=store.getState().flowProcess.client.date_naissance;
    values.lieu=typeof values.lieu=="undefined"?store.getState().flowProcess.client.lieu_naissance=="(non communiquée)"?null:store.getState().flowProcess.client.lieu_naissance:values.lieu;
    values.email=typeof values.email=="undefined"?store.getState().flowProcess.client.email=="(non communiquée)"?null:store.getState().flowProcess.client.email:values.email;
    values.sexe=typeof values.sexe=="undefined"?store.getState().flowProcess.client.sexe_assure=="(non communiquée)"?null:store.getState().flowProcess.client.sexe_assure:values.sexe;
    values.profession=typeof values.profession=="undefined"?store.getState().flowProcess.client.profession=="(non communiquée)"?null:store.getState().flowProcess.client.profession:values.profession;
    values.matrimoniale=typeof values.matrimoniale=="undefined"?store.getState().flowProcess.client.matrimoniale=="(non communiquée)"?null:store.getState().flowProcess.client.matrimoniale:values.matrimoniale;
    values.adresse=typeof values.adresse=="undefined"?store.getState().flowProcess.client.adresse=="(non communiquée)"?null:store.getState().flowProcess.client.adresse:values.adresse;
    values.macAdr=store.getState().flowProcess.urlParams.mac;

    if(typeof values.lieu!="undefined" && values.lieu.length>=255){
            throw new SubmissionError({lieu:"Votre lieu de naissance est trop long.",_error:"Echec de la soumission"}) ;
            return;  
        }
        if(typeof values.profession!="undefined" && values.profession.length>=255){
            throw new SubmissionError({profession:"Votre profession est trop longue.",_error:"Echec de la soumission"}) ;
            return;  
        }
        if(typeof values.telephone1!="undefined" && (isNaN(Number(values.telephone1))||values.telephone1.length<8||values.telephone1.length>8)){
            throw new SubmissionError({telephone1:"Veuillez fournir un numéro de téléphone valide.",_error:"Echec de la soumission"});
            return;
        }
        if(typeof values.telephone2!="undefined" && (isNaN(Number(values.telephone2))||values.telephone2.length<8||values.telephone2.length>8)){
            throw new SubmissionError({telephone2:"Veuillez fournir un numéro de téléphone valide.",_error:"Echec de la soumission"});
            return;
        }
        /*if(typeof values.sexe!="undefined" && (values.sexe!=="F"||values.sexe!=="M")){
            throw new SubmissionError({sexe:"ce type de sexe n'existe pas",_error:"Echec de la soumission"});
            return;
        }*/
       if(typeof values.email!="undefined" && !validateEmail(values.email)){
            throw new SubmissionError({email:"Veuillez fournir un email valide.",_error:"Echec de la soumission"});    
            return;
        }
        /* 
        if(typeof values.matrimoniale!="undefined" && (values.matrimoniale!="C"||values.matrimoniale!="M"||values.matrimoniale!="P"||values.matrimoniale!="V")){
            throw new SubmissionError({matrimoniale:"Toi tu es un alien n'est-ce pas",_error:"Echec de la soumission"});
            return;
        }*/
        if(typeof values.adresse!="undefined" && values.adresse.length>=255){
            throw new SubmissionError({sexe:"Veuillez fournir un adresse postale valide.",_error:"Echec de la soumission"});
            return;
        }
        Meteor.call("saveClientMods",values,(err,res)=>{
            Meteor.call("saveLog",values,"clients",(err,res)=>{
                if(err){
               
                }else{
                    //alert("dispatching meteor call")
                //dispatch action afin de rediriger pour 20min
                   store.dispatch(finprocessoui());
                }
            });
        });
       
   
};

export {submitNon,submitYes};