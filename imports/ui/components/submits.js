import {Meteor} from 'meteor/meteor';
import {finprocessnon,finprocessoui} from '../../redux/actions/processActions';
import store from '../../redux/store';
import {SubmissionError} from 'redux-form';
import {validateEmail} from '../../utils/utils';

const submitNon=(values)=>{
    if(values.nom===''||!values.nom){
        throw new SubmissionError({nom:"Le champs Nom de famille ne peut être vide.",_error:'Echec de la soumission'})   
       }
       else if(values.prenom===''||!values.prenom){
           throw new SubmissionError({prenom:"Le champs Prénom ne peut être vide.",_error:'Echec de la soumission'})    
       }
       else if(values.age===''||isNaN(Number(values.age))||(values.age<=0 && values.age<=10)){
         throw new SubmissionError({age:"Veuillez fournir un age valide.",_error:'Echec de la soumission'});
       }
       else if(values.telephone===''||isNaN(Number(values.telephone))||values.telephone.length<8||values.telephone.length>8){
           throw new SubmissionError({telephone:"Veuillez fournir un numéro de téléphone valide.",_error:"Echec de la soumission"});
       }
       else if(values.email===''||!validateEmail(values.email)){
           throw new SubmissionError({email:"Veuillez fournir un email valide.",_error:"Echec de la soumission"});    
       }else{
        Meteor.call("saveProspect",values,(err,res)=>{
        
            if(err){
               
            }else{
                //alert("dispatching meteor call")
            //dispatch action afin de rediriger pour 20min
               store.dispatch(finprocessnon());
            }
        });
       }
   
};

const submitYes=(values)=>{
    values.nom=store.getState().flowProcess.client.nom_total;
    values.dateNaissance=store.getState().flowProcess.client.date_naissance;
    values.lieu=typeof values.lieu=="undefined"?store.getState().flowProcess.client.lieu_naissance:values.lieu;
    values.email=typeof values.email=="undefined"?store.getState().flowProcess.client.email:values.email;
    values.sexe=typeof values.sexe=="undefined"?store.getState().flowProcess.client.sexe_assure:values.sexe;
    values.matrimoniale=typeof values.matrimoniale=="undefined"?store.getState().flowProcess.client.matrimoniale:values.matrimoniale;
    values.adresse=typeof values.adresse=="undefined"?store.getState().flowProcess.client.adresse:values.adresse;

    if(typeof values.lieu!="undefined" && values.lieu.length>=255){
            throw new SubmissionError({lieu:"Votre lieu de naissance est trop long.",_error:"Echec de la soumission"}) ;
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
        
            if(err){
               
            }else{
                //alert("dispatching meteor call")
            //dispatch action afin de rediriger pour 20min
               store.dispatch(finprocessoui());
            }
        });
       
   
};

export {submitNon,submitYes};