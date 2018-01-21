import React,{PropTypes,Component} from 'react';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import LinearProgress from 'material-ui/LinearProgress';
import {connect} from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Field,reduxForm,formValueSelector,submit} from 'redux-form';
import {TextField,SelectField,RadioButtonGroup} from 'redux-form-material-ui';
import {Step,Stepper,StepLabel,StepContent} from 'material-ui/Stepper';
import {RadioButton} from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import {Meteor} from 'meteor/meteor';
import areIntlLocalesSupported from 'intl-locales-supported';
import {validateEmail,transformInFrenchDate,englishToFrenchDate} from '../../utils/utils';
import ModiForm from './ModiForm';
import NonForm from './NonForm';
import {finprocessoui,modiformCanSubmit,modiformCantSubmit,resetProcess,getClient} from '../../redux/actions/processActions';import {$} from 'meteor/jquery';
import { setTimeout } from 'timers';
import _ from 'lodash';
const MobileDetect=require('mobile-detect');

let MD=new MobileDetect(window.navigator.userAgent);
//import {decoupagedone,releverOk} from '../../redux/actions/relever-actions';

let DateTimeFormat;
if(areIntlLocalesSupported(['fr'])){
    DateTimeFormat=global.Intl.DateTimeFormat;
}

let normalStyle={
    uploadInput:{
        cursor:'pointer',
        position:'absolute',
        top:0,
        bottom:0,
        right:0,
        left:0,
        width:'0%',
        opacity:0,
        zIndex:-100000
    },
    floatingLabelStyle:{
        color:'gray'
    },
    underlineStyle:{
        borderColor:'gray'
    },
    underlineFocusStyle:{
        color:'gray',
        borderColor:'gray'
    },
    hintStyle:{
        color:'darkgray'
    },floatingLabelStyle:{
        color:'darkgray'
    },
    dialogContainerStyle:{
        titleStyle:{backgroundColor:'#1f2d67',color:'white'},
        contentStyle:{width:'60%',maxWidth:'none'},
    }
};

let max500style=_.extend({},normalStyle,{
    dialogContainerStyle:{
        titleStyle:{backgroundColor:'#1f2d67',color:'white',fontSize:'1em'},
        contentStyle:{width:'100%',margin:'0 !important'},
    }
});

 class GetIdentiform extends Component{
    constructor(){
        super();
        this.state={
            dialogIsOpen:false,
            dialogFIsOpen:false,
            dialogTIsOpen:false,
            errorMsg:'',
            styles:normalStyle,
            IsTable:false,
            showLoader:false,
            showTable:false,
            error:false,
            checking:false,//server side check flag for showing loaders
            stepperFinished:false,
            stepIndex:0,
            lastIndex:5,
            alreadyOp:false,
            stepData:{
                step1_isClient:null,
                numpolice:'',
                currentRoute:'',
                clearedStepOui1:false,
                choixModification:null,//MOD//CONF
                clientData:null,
                dateNaissance:null,
                modifs:{
                    modnom:false,
                    moddatenaissance:false,
                    modlieu:false,
                    modsexe:false,
                    modmatrimo:false,
                    modtel:false,
                    modmail:false,
                    modadresse:false
                },
            },
            decoupage:[],
            currentFile:false,
            progress:null,

        }
        
    }

    _updateDimensions(){
        if(window.innerWidth<970){
            this.setState({
                styles:max500style
            });
        }else{
            this.setState({
                styles:normalStyle
            });
        }
    }
    /*onSubmit = (fields) => {
        console.log('submit', fields)
    }*/
    
    handleNext=(r)=>{
        console.log(r);
        const {stepIndex,stepData}=this.state;
        if(stepData.currentRoute==="numpolice"){
            if(typeof stepData.clientData!=="object"){
                this.setState({
                    error:true,
                    stepData:Object.assign({},this.state.stepData,{
                        numpolice:'',
                        dateNaissance:null,
                        clientData:null
                    }),
                    errorMsg:"Veuillez entrer des informations valides"
                    });
                this._dialogOpen();
            }else{
                this._dialogTOpen();
                  
            }
        }else if(r==="prospectForm"){
            this.props.dispatch(submit('nonform'));
        }else if(r==="modiform"){
            //alert("modiform");
            this.props.dispatch(submit('modiform'))
        }else{
            this.setState({
                stepIndex:stepIndex+1,
            });
        }
        
    };
    handlePrev=()=>{
        const {stepIndex,stepData}=this.state;
        this.props.reset();
        if(stepIndex>0){
            this.props.reset();
            this.setState({
                stepIndex: stepIndex-1,
            });
        }
        if(stepIndex===1){
            this.props.reset();
            console.log("ca doit passer normalement");
            this.setState({
                stepData:Object.assign({},this.state.stepData,{
                    step1_isClient:null,
                    modifs:Object.assign({},this.state.stepData.modifs,{
                        modlieu:false,
                        modsexe:false,
                        modmatrimo:false,
                        modtel:false,
                        modmail:false,
                        modadresse:false
                    }),
                })
            }); 
        }
        if(stepData.currentRoute=="numpolice"){
            this.props.reset();
            this.setState({
                stepData:Object.assign({},this.state.stepData,{
                    numpolice:'',
                    dateNaissance:null,
                    clientData:null,
                    modifs:Object.assign({},this.state.stepData.modifs,{
                        modlieu:false,
                        modsexe:false,
                        modmatrimo:false,
                        modtel:false,
                        modmail:false,
                        modadresse:false
                    }),
                    step1_isClient:null
                })
            });
            //this.forceUpdate();
        }else if(stepData.currentRoute=="modiform"){
            this.props.reset();
            this.props.dispatch(modiformCantSubmit())
            this.setState({
                stepData:Object.assign({},this.state.stepData,{
                    numpolice:'',
                    dateNaissance:null,
                    clientData:null,
                    currentRoute:"numpolice",
                    choixModification:"",
                    clearedStepOui1:false,
                    modifs:Object.assign({},this.state.stepData.modifs,{
                        modlieu:false,
                        modsexe:false,
                        modmatrimo:false,
                        modtel:false,
                        modmail:false,
                        modadresse:false
                    }),
                    step1_isClient:"oui"
                })
            });
        }
    };

    componentDidMount(){
        if(!this.state.stepData.dateNaissance)
        $('[name^=birthDateForChecking]').val("");
        this._updateDimensions();
        window.addEventListener('resize',this._updateDimensions.bind(this))
        
    }
    componentWillUnmount(){
        window.removeEventListener('resize',this._updateDimensions.bind(this))
    }
    componentWillUpdate(){
        if(this.state.stepIndex==0 && this.state.stepData.currentRoute=="numpolice"){
           
        }
        if(this.state.stepData.currentRoute!=="prospectForm" && this.state.stepData.step1_isClient==="Non"){
            this.setState({
                stepData:Object.assign({},this.state.stepData,{
                    currentRoute:"prospectForm"
                }),
            })
        }
    }
    renderStepRetourOnly(step){
        const {stepIndex,lastIndex} =this.state;
        return(<div className="loadmoreDiv">
        {
            step>0 && (
                <FlatButton
                    label="Retour"
                    disabled={stepIndex===0}
                    onClick={this.handlePrev}
                />
            )
        }</div>);
    }
    renderStepActions(step,route){
        
        const {stepIndex,lastIndex} =this.state;
        if(route==="numpolice" ){
           if(this.state.stepData.clearedStepOui1){
                
                return(
                    <div className="loadmoreDiv">
                        {
                            step>0 && (
                                <FlatButton
                                    label="Retour"
                                    disabled={stepIndex===0}
                                    onClick={this.handlePrev}
                                />
                            )
                        }
                        <div style={{width:'3%'}}></div>
                        <RaisedButton
                            label={stepIndex===lastIndex ? 'Terminer' : 'Suivant'}
                            backgroundColor="#cd9a2e"
                            onClick={this.handleNext}
                        />   
                    </div>
                );
            }
            if(this.state.stepData.clientData){
                if(this.state.stepData.numpolice.length>8 && this.state.stepData.dateNaissance){
                    this.setState({
                        error:true,
                        stepData:Object.assign({},this.state.stepData,{
                            numpolice:'',
                            clientData:null
                        }),
                        errorMsg:"Veuillez entrer un numéro de police valide"
                        });
                    this._dialogOpen();
                    return ;
                }
                
            }
            console.log("in here");
            if(isNaN(Number(this.state.stepData.numpolice))){
                this.setState({
                    error:true,
                    stepData:Object.assign({},this.state.stepData,{
                        numpolice:'',
                        dateNaissance:null
                    }),
                    errorMsg:"Veuillez entrer un numéro de police valide"
                    });
                    this._dialogOpen();
                return ;
            }else if(this.state.stepData.numpolice.length<8 ||this.state.stepData.numpolice.length>8){
                this.setState({
                    error:true,
                    stepData:Object.assign({},this.state.stepData,{
                        numpolice:'',
                        clientData:null,
                        dateNaissance:null
                    }),
                    errorMsg:"Veuillez entrer un numéro de police valide. 8 Chiffres maximums"
                    });
                    this._dialogOpen();
                return ; 
            }
            else if(this.state.stepData.dateNaissance==="" || !this.state.stepData.dateNaissance){
                console.log("in date check");
                this.setState({
                    error:true,
                    stepData:Object.assign({},this.state.stepData,{
                        clientData:null,
                        dateNaissance:null
                    }),
                    errorMsg:"Veuillez entrer une date de naissance valide"
                    });
                this._dialogOpen();
                return ; 
            }else{
                //On fait un meteor.call pour récupérer les infos du client de notre base de prod
                //et on les affiche au client
                !this.state.checking?this.setState({checking:true}):null;
                Meteor.call("getClientInfos",this.state.stepData.numpolice,parseInt(moment(this.state.stepData.dateNaissance).format("YYYYMMDD"),10),(err,res)=>{
                    if(res && typeof res[0] !="undefined"){
                        console.log("in meteor call route numpolice for OUI res="+res);
                        if(typeof res=="string"){//le server renvoie C quand il y a une erreur ou qu4il ne retrouve pas les donnees ceci est a ameliorer
                            this.setState({
                                error:true,
                                checking:false,
                                stepData:Object.assign({},this.state.stepData,{
                                    numpolice:'',
                                    clientData:null,
                                    dateNaissance:null,
                                    currentRoute:route
                                }),
                                errorMsg:"Nous n'arrivons pas à vous identifier dans notre base de données.Veuillez vérifiez les informations fournies"
                                });
                            this._dialogOpen();
                            return;
                        }else{
                            console.log("la route est alors "+route);
                            
                            this.setState({
                                error:false,
                                checking:false,
                                stepData:Object.assign({},this.state.stepData,{
                                    clientData:res[0],
                                    currentRoute:route,
                                    clearedStepOui1:true
                                })
                            });
                            this.props.dispatch(getClient(res[0]));
                            return(
                                <div className="loadmoreDiv">
                                    {
                                        step>0 && (
                                            <FlatButton
                                                label="Retour"
                                                disabled={stepIndex===0}
                                                onClick={this.handlePrev}
                                            />
                                        )
                                    }
                                    <div style={{width:'3%'}}></div>
                                    <RaisedButton
                                        label={stepIndex===lastIndex ? 'Terminer' : 'Suivant'}
                                        backgroundColor="#cd9a2e"
                                        onClick={this.handleNext}
                                    />   
                                </div>
                            );
                        }   
                    }else if(err){
                        console.log(err);
                    }
                });
                
            }
        }else if(route==="prospectForm" ||route==="modiform"){
            console.log("la route du "+route)
            return(
                <div className="loadmoreDiv">
                    {
                        step>0 && (
                            <FlatButton
                                label="Retour"
                                disabled={stepIndex===0}
                                onClick={this.handlePrev}
                            />
                        )
                    }
                    <div style={{width:'3%'}}></div>
                    <RaisedButton
                        label={stepIndex===lastIndex ? 'Terminer' : 'Suivant'}
                        backgroundColor="#cd9a2e"
                        onClick={()=>this.handleNext(route)}
                        type="submit"
                        form="nonForm"
                    />   
                </div>
            );
        }else{
            return(
                <div className="loadmoreDiv">
                    {
                        step>0 && (
                            <FlatButton
                                label="Retour"
                                disabled={stepIndex===0}
                                onClick={this.handlePrev}
                            />
                        )
                    }
                    <div style={{width:'3%'}}></div>
                    <RaisedButton
                        label={stepIndex===lastIndex ? 'Terminer' : 'Suivant'}
                        backgroundColor="#cd9a2e"
                        onClick={this.handleNext}
                    />   
                </div>
            );
        }
        
        
    }
    handlePolice=(e)=>{
        e.stopPropagation();
        console.log(e.target.value);
        
        this.setState({
            error:false,
            stepData:Object.assign({},this.state.stepData,{
                numpolice:e.target.value
            }),
            lastIndex:5
        });
    
    };
   _dialogOpen(){
       this.setState({dialogIsOpen: true});
   }
   _dialogClose(){
    this.props.reset();
       this.setState({dialogIsOpen: false});
   }
  
    _dialogTOpen(){
        this.setState({dialogTIsOpen: true,alreadyOp:true});
    }

    _dialogTClose(){
        this.props.reset();
        this.setState({
            dialogTIsOpen: false,
            alreadyOp:true,
            stepData:Object.assign({},this.state.stepData,{
                clearedStepOui1:false,
                numpolice:'',
                dateNaissance:null
            }),
        });
    }
    _dialogTCloseConf(){
        //on check pour voir effectivement aue l'on a pas des valeurs non communiquees
        const {clientData}=this.state.stepData;
        const {dispatch}=this.props;
        let found=false;
        Object.keys(clientData).forEach((e,i,arr)=>{
            //console.log(clientData[e]);
            if(clientData[e]=="(non communiquée)"||clientData[e]=="{non communiquée}"){
                let nomDuChamps="";
                found=true;
                switch(e){
                    case"date_naissance":
                    nomDuChamps="date de naissance"
                    break;
                    case"lieu_naissance":
                    nomDuChamps="lieu de naissance"
                    break;
                    case"sexe_assure":
                    nomDuChamps="sexe(M ou F)"
                    break;
                    case"situation_matrimoniale":
                    nomDuChamps="situation matrimoniale"
                    break;
                    case"contact":
                    nomDuChamps="contact(s) téléphonique"
                    break;
                    case"email":
                    nomDuChamps="email"
                    break;
                    case"adresse":
                    nomDuChamps="adresse"
                    break;
                }
                let c=confirm("Nous constatons que votre "+nomDuChamps+" n'est pas renseigné.Voulez vous quand même continuez ?");
               console.log("value of c "+c);
                if(c===true){
                    
                    this.setState({
                        dialogTIsOpen: false,
                        alreadyOp:true,
                        stepData:Object.assign({},this.state.stepData,{
                            choixModification:"CONF"
                        }),
                        stepIndex:this.state.stepIndex+1
                    });
                    dispatch(finprocessoui());
                }else{
                    return;
                }
            }
        });
        /**
         * else{
               
                this.setState({
                    dialogTIsOpen: false,
                    alreadyOp:true,
                    stepData:Object.assign({},this.state.stepData,{
                        choixModification:"CONF"
                    }),
                    stepIndex:this.state.stepIndex+1
                });
                dispatch(finprocessoui());
                //alert("stepIndex "+this.state.stepIndex);
            }
         */
    }
    _dialogTCloseMod(){
        let truelength=0;
        if(typeof this.state.stepData.modifs!="undefined"){
            Object.keys(this.state.stepData.modifs).map((e,i,a)=>{
                if(this.state.stepData.modifs[e]){
                    truelength++;
                }
            });
            if(!truelength){
                this.setState({
                    error:true,
                    errorMsg:"Veuillez choisir des valeurs à modifier en cochant au moins une des cases"
                    });
                    this._dialogOpen();
                return;
            }else{
                //alert("stepIndex "+this.state.stepIndex);
                
                this.setState({
                    dialogTIsOpen: false,
                    alreadyOp:true,
                    stepData:Object.assign({},this.state.stepData,{
                        choixModification:"MOD",
                        currentRoute:"modiform"
                    }),
                    stepIndex:this.state.stepIndex+1
                });
              //  alert("stepIndex "+this.state.stepIndex);
            }
        }else{
            this.setState({
                error:true,
                errorMsg:"Veuillez choisir des valeurs à modifier en cochant au moins une des cases"
                });
                this._dialogOpen();
            return;
        }
        
        
    }
   componentWillUpdate(){
       const {dispatch}=this.props; 
       
   }
  componentDidUpdate(){
      const{dispatch,reduxState}=this.props;
      if(MD.mobile() && this.stepData.step1_isClient=="non" && this.state.stepIndex===3){
        //prevention pour gerer les vilain bugs sur le mobile
        console.log("non choix"+MD.mobile())
        this.setState({
            stepIndex:this.state.stepIndex-1
        })
    }
    if(MD.mobile() && this.state.stepData.step1_isClient=="oui" && this.state.stepIndex===4){
        //prevention pour gerer les vilain bugs sur le mobile
        console.log("oui choix"+MD.mobile())
        this.setState({
            stepIndex:this.state.stepIndex-1
        })
    }
      console.dir(reduxState.flowProcess.canBrowse+"..."+reduxState.flowProcess.processCompleted);
      if(reduxState.flowProcess.canBrowse && reduxState.flowProcess.processCompleted==="OUI"){
        console.log("redirection Client")
        if(this.state.stepData.choixModification=="MOD"){
            this.setState({
                stepIndex:this.state.stepIndex+1
            })
        }else{
            this.setState({
                stepIndex:this.state.stepIndex-1+1
            })  
        }
        dispatch(resetProcess());

      }else if(reduxState.flowProcess.canBrowse && reduxState.flowProcess.processCompleted==="NON"){
        console.log("redirection Prospects");
        this.setState({
            stepIndex:this.state.stepIndex+1
        });
        dispatch(resetProcess());
      }
  }
    render(){
         const {handleSubmit,pristine,submitting,dispatch,sendermail,message,nom,prenom,birthDate,numpolice,reduxState}=this.props;
         const {stepIndex,lastIndex,stepperFinished}=this.state;
         if(this.state.stepData.choixModification==="CONF"){
            
            /*setTimeout(()=>{
                location.href="https://www.google.com";
            },5000);*/
        }else if(this.state.stepData.choixModification==="MOD"){
            
        }
         const dialogTActions = [
            <FlatButton
                label="RETOUR"
                primary={true}
                onTouchTap={this._dialogTClose.bind(this)}
            />,
            <FlatButton
                label="TOUT EST CONFORME"
                primary={true}
                onTouchTap={this._dialogTCloseConf.bind(this)}
            />,
            <FlatButton
                label="METTRE A JOUR"
                primary={true}
                onTouchTap={this._dialogTCloseMod.bind(this)}
            />
            ];
         const dialogActions = [
        <FlatButton
            label="OK"
            primary={true}
            onTouchTap={this._dialogClose.bind(this)}
        />,
        ];

        const dialogFActions = [
            <FlatButton
                label="OK"
                primary={true}
                onTouchTap={this._dialogClose.bind(this)}
            />,
            ];
        
        let detailsClient=(
                            <div>
                                <div >
                                    <p><b>Nom du client: </b> {typeof this.state.stepData.clientData =="object" &&  this.state.stepData.clientData  ?this.state.stepData.clientData.nom_total:null}</p>
                                    <p><b>Né(e) le: </b> {typeof this.state.stepData.clientData =="object" && this.state.stepData.clientData ?transformInFrenchDate(this.state.stepData.clientData.date_naissance.toString()):null}</p>
                                    <p><b>&Agrave;: </b> {typeof this.state.stepData.clientData =="object" && this.state.stepData.clientData ?this.state.stepData.clientData.lieu_naissance:null}</p>
                                    <p><b>De sexe: </b> {typeof this.state.stepData.clientData =="object" && this.state.stepData.clientData ?this.state.stepData.clientData.sexe_assure:null}</p>
                                    <p><b>Situation matrimoniale: </b> {typeof this.state.stepData.clientData =="object" && this.state.stepData.clientData ?this.state.stepData.clientData.situation_matrimoniale:null}</p>
                                    <p><b>Contacts téléphoniques: </b> {typeof this.state.stepData.clientData =="object" &&  this.state.stepData.clientData ?this.state.stepData.clientData.contact:null}</p>
                                    <p><b>Email: </b> {typeof this.state.stepData.clientData =="object" &&  this.state.stepData.clientData ?this.state.stepData.clientData.email:null}</p>
                                    <p><b>Adresse: </b> {typeof this.state.stepData.clientData =="object" &&  this.state.stepData.clientData ?this.state.stepData.clientData.adresse:null}</p><br/><br/>
                                </div>
                                <div >
                                    <Divider/>
                                <p>Veuillez cocher la case selon l'information que vous souhaitez modifier:</p>
                                    <div style={{display:'flex',width:'100%'}}>
                                        <div style={{width:'50%'}}>
                                            
    
                                        <Checkbox
                                                label="Lieu de naissance"
                                                checked={typeof this.state.stepData.modifs!="undefined"?this.state.stepData.modifs.modlieu:false}
                                                onCheck={()=>{
                                                    this.setState({
                                                        stepData:Object.assign({},this.state.stepData,{
                                                            modifs:Object.assign({},this.state.stepData.modifs,{
                                                                modlieu:typeof this.state.stepData.modifs!="undefined"?!this.state.stepData.modifs.modlieu:true,
                                                            } )       
                                                        })
                                                    });
                                                    
                                                }}
                                            />
                                            <Checkbox
                                                label="Sexe"
                                                checked={typeof this.state.stepData.modifs!="undefined"?this.state.stepData.modifs.modsexe:false}
                                                onCheck={()=>{
                                                    this.setState({
                                                        stepData:Object.assign({},this.state.stepData,{
                                                            modifs:Object.assign({},this.state.stepData.modifs,{
                                                                modsexe:typeof this.state.stepData.modifs!="undefined"?!this.state.stepData.modifs.modsexe:true,
                                                            } )       
                                                        })
                                                    });
                                                    
                                                }}
                                            />
                                            <Checkbox
                                                label="Situation matrimoniale"
                                                checked={typeof this.state.stepData.modifs!="undefined"?this.state.stepData.modifs.modmatrimo:false}
                                                onCheck={()=>{
                                                    this.setState({
                                                        stepData:Object.assign({},this.state.stepData,{
                                                            modifs:Object.assign({},this.state.stepData.modifs,{
                                                                modmatrimo:typeof this.state.stepData.modifs!="undefined"?!this.state.stepData.modifs.modmatrimo:true,
                                                            } )       
                                                        })
                                                    });
                                                    
                                                }}
                                            />
                                        </div>
                                        <div style={{width:'50%'}}>
                                        
                                        
                                        <Checkbox
                                                label="Contacts"
                                                checked={typeof this.state.stepData.modifs!="undefined"?this.state.stepData.modifs.modtel:false}
                                                onCheck={()=>{
                                                    this.setState({
                                                        stepData:Object.assign({},this.state.stepData,{
                                                            modifs:Object.assign({},this.state.stepData.modifs,{
                                                                modtel:typeof this.state.stepData.modifs!="undefined"?!this.state.stepData.modifs.modtel:true,
                                                            } )       
                                                        })
                                                    });
                                                }}
                                            />
                                        
                                        <Checkbox
                                                label="Email"
                                                checked={typeof this.state.stepData.modifs!="undefined"?this.state.stepData.modifs.modmail:false}
                                                onCheck={()=>{
                                                    this.setState({
                                                        stepData:Object.assign({},this.state.stepData,{
                                                            modifs:Object.assign({},this.state.stepData.modifs,{
                                                                modmail:typeof this.state.stepData.modifs!="undefined"?!this.state.stepData.modifs.modmail:true,
                                                            } )       
                                                        })
                                                    });
                                                }}
                                            />
                                            <Checkbox
                                                label="Adresse postale"
                                                checked={typeof this.state.stepData.modifs!="undefined"?this.state.stepData.modifs.modadresse:false}
                                                onCheck={()=>{
                                                    this.setState({
                                                        stepData:Object.assign({},this.state.stepData,{
                                                            modifs:Object.assign({},this.state.stepData.modifs,{
                                                                modadresse:typeof this.state.stepData.modifs!="undefined"?!this.state.stepData.modifs.modadresse:true,
                                                            } )       
                                                        })
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    
                                </div>
                                <p>Nous vous invitons à vérifier vos informations personelles. N'hésitez surtout pas à faire une mise à jour de celles ci si vous pensez que certaines informations ne réfletent pas la réalité.<br/>Cliquez sur le bouton <b>Tout est conforme</b> si vous n'avez pas besoin de mettre vos données à jour.<br/>Cliquez sur le bouton <b>Retour</b> pour modifier les données précédemment entrées.<br/>Cliquez sur le bouton <b>Mettre à jour</b> pour mettre à jour vos infos.</p>
                            </div>
            
                            ); 

        let routeOui=[<Step key="A">
            <StepLabel>Cher client,</StepLabel>
            <StepContent>
                <h1>Identifiez vous ci dessous</h1>
                <div>
                <TextField
                    floatingLabelText="Veuillez entrer un numero de police"
                    hintText="Exemple:12345678"
                    fullWidth={true}
                    autocomplete="off"
                    floatingLabelStyle={this.state.styles.floatingLabelStyle}
                    hintStyle={this.state.styles.hintStyle}
                    onChange={this.handlePolice}
                    value={this.state.stepData.numpolice}
                />
                <DatePicker
                    name="birthDateForChecking" 
                    DateTimeFormat={DateTimeFormat}
                    openToYearSelection={true}
                    className="datepicker"
                    style={{flexGrow:'1'}}
                    hintText="Entrez votre date de naissance"
                    floatingLabelText="Votre date de naissancer"
                    fullWidth={true}
                    ref={(birthDateForChecking) => { this.birthDateForChecking = birthDateForChecking; }}
                    okLabel="OK"
                    cancelLabel="Annuler"
                    locale="fr"
                    onChange={(event, date) => {
                        this.setState({
                            error:false,
                            stepData:Object.assign({},this.state.stepData,{
                                dateNaissance:date
                            })
                        });
                      }}
                    format={(value)=>{
                        return value===''?null:value;
                    }}
                    floatingLabelStyle={this.state.styles.floatingLabelStyle}
                    hintStyle={this.state.styles.hintStyle}
                    floatingLabelFixed={true}
                />
                </div>
                {this.state.checking?<center><CircularProgress /></center>:null}
                {typeof this.state.stepData.numpolice != "undefined" && this.state.stepData.numpolice.length>=8 && this.state.stepData.dateNaissance ?this.renderStepActions(1,"numpolice"):this.renderStepRetourOnly(1)}
            </StepContent>
        </Step>,
        <Step key="B">
            <StepLabel>{this.state.stepData.choixModification && this.state.stepData.choixModification==="CONF"?"Bonne navigation !":this.state.stepData.choixModification && this.state.stepData.choixModification==="MOD"?"Modifiez vos informations":"..."}</StepLabel>
            <StepContent>
                    {this.state.stepData.choixModification && this.state.stepData.choixModification=="CONF"?(
                        <div>
                        <h1>Cher client, Nsia Vie Assurances vous remercie</h1>
                        <br/>
                        <p style={{textAlign:"center"}}>Nous vous remercions d'avoir pris le temps de vérifier vos informations.Nous vous souhaitons une bonne navigation pendant que vous patientez dans nos locaux.</p>
                        <center><CircularProgress/></center>
                        <p style={{textAlign:"center"}}>Veuillez patientez pendant que nous vous redirigons...</p>
                        </div>
                    ):(
                        <div>
                        <h1>Cher client, Veuillez modifier vos informations via le formulaire ci-dessous</h1>
                       <ModiForm nom={this.state.stepData.clientData?this.state.stepData.clientData.nom:null} prenom={this.state.stepData.clientData?this.state.stepData.clientData.prenoms:null} dateNaissance={this.state.stepData.dateNaissance} modifs={this.state.stepData.modifs} ref="modiform"/>
                       { reduxState.flowProcess.modiformCanSubmit?this.renderStepActions(2,"modiform"):this.renderStepRetourOnly(2)}                      
                        </div>
                    )}
            </StepContent>
        </Step>,
        <Step key="C">
            <StepContent>
            <div>
            <h1>Cher client, Nsia Vie Assurances vous remercie</h1>
            <br/>
            <p style={{textAlign:"center"}}>Nous vous remercions d'avoir pris le temps de vérifier vos informations.Nous vous souhaitons une bonne navigation pendant que vous patientez dans nos locaux.</p>
            <center><CircularProgress/></center>
            <p style={{textAlign:"center"}}>Veuillez patientez pendant que nous vous redirigons...</p>
            </div>
            </StepContent>
        </Step>    
                ];
     
      let routeNon=[<Step key="A">
      <StepLabel>Cher invité</StepLabel>
        <StepContent>
            <h1>Identifiez vous ci dessous</h1>
            <NonForm ref="NonForm" />
            {this.state.stepData.step1_isClient==="non"?this.renderStepActions(1,"prospectForm"):null}
        </StepContent>
      </Step>,
        <Step key="B">
        <StepLabel>Bonne navigation !</StepLabel>
        <StepContent>
                    <div>
                    <h1>Cher invité, Nsia Vie Assurances vous remercie</h1>
                    <br/>
                    <p style={{textAlign:"center"}}>Nous vous remercions d'avoir pris le temps de renseigner vos informations.Nous vous souhaitons une bonne navigation pendant que vous patientez dans nos locaux.</p>
                    <center><CircularProgress/></center>
                    <p style={{textAlign:"center"}}>Veuillez patientez pendant que nous vous redirigons...</p>
                    </div>
                
        </StepContent>
    </Step>  
    ];
      
      
        console.log(this.state);
        return(
            <div className="loginformCont">
                <Dialog
                    title={`Veuillez vérifier que vos informations sont correctes`}
                    actions={dialogTActions}
                    modal={false}
                    className="displayDialog"
                    open={this.state.dialogTIsOpen}
                    onRequestClose={this._dialogTClose}
                    titleStyle={this.state.styles.dialogContainerStyle.titleStyle}
                    contentStyle={this.state.styles.dialogContainerStyle.contentStyle}
                    autoScrollBodyContent={true}
                    >
                        {detailsClient}
                    </Dialog>
                <Dialog
                actions={dialogActions}
                modal={false}
                open={this.state.dialogIsOpen}
                onRequestClose={this._dialogClose}
                style={{color:this.state.error?'red':'green'}}
                autoDetectWindowHeight={true}
                >
                    <span style={{color:this.state.error?'red':'green'}}>{this.state.errorMsg}</span>
                </Dialog>

                <Dialog
                actions={dialogFActions}
                modal={false}
                title={this.state.stepData.choixModification==="CONF"?"Vos informations sont conformes.":null}
                open={this.state.dialogFIsOpen}
                onRequestClose={this._dialogFClose}
                autoDetectWindowHeight={true}
                >
                    <span style={{color:this.state.error?'red':'green'}}>{this.state.errorMsg}</span>
                </Dialog>      
                    <div className="cDiv">
                        <Stepper activeStep={stepIndex} orientation="vertical">
                            <Step>
                                <StepLabel>Bienvenue.</StepLabel>
                                <StepContent>
                                    <h1>êtes vous client à Nsia Vie Assurances ?</h1>
                                    <Field name="isClient" component={RadioButtonGroup} onChange={(e,value)=>{
                                        this.setState({
                                            stepData:{
                                                step1_isClient:value
                                            }
                                        })
                                    }}>
                                        <RadioButton value="oui" label="Oui"/>
                                        <RadioButton value="non" label="Non"/>
                                    </Field>
                                    {this.state.stepData.step1_isClient?this.renderStepActions(0):null}
                                </StepContent>
                            </Step>
                            {this.state.stepData.step1_isClient==="oui"?routeOui:routeNon}
                        </Stepper>
                        
                        <div style={{height:'10px'}}></div>        
                    </div>
            </div>
        );
    }

}

GetIdentiform=reduxForm({
    form:'getInfoClientform',
})(GetIdentiform);

const selector = formValueSelector('getInfoClientform');
const mapDispatchToProps=(state,dispatch)=>{
    let reduxState=state;
    const { nom, prenom,birthDate,numpolice } = selector(state, 'nom', 'prenom','birthDate','numpolice');
    return{
        dispatch,
        reduxState,
        nom,
        prenom,
        birthDate,
        numpolice,
    };
}
GetIdentiform=connect(mapDispatchToProps)(GetIdentiform);
//decorate with connect to read form values
export default GetIdentiform;



