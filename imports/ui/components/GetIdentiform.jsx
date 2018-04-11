import React,{PropTypes,Component} from 'react';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';
import LinearProgress from 'material-ui/LinearProgress';
import {connect} from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
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
import {validateEmail,transformInFrenchDate,englishToFrenchDate,convertInTextFromFrenchDate} from '../../utils/utils';
import ModiForm from './ModiForm';
import NonForm from './NonForm';
import {finprocessoui,modiformCanSubmit,modiformCantSubmit,resetProcess,getClient} from '../../redux/actions/processActions';import {$} from 'meteor/jquery';
import { setTimeout } from 'timers';
import _ from 'lodash';

window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };

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
            choixOuimodMobile:false,
            showLoader:false,
            showTable:false,
            error:false,
            disableThem:false,
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
                    modprof:false,
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
        //console.log(r);
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
                disableThem:false,
                stepIndex: stepIndex-1,
            });
        }
        if(stepIndex===1){
            this.props.reset();
           // console.log("ca doit passer normalement");
            this.setState({
                disableThem:false,
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
                disableThem:false,
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
                disableThem:false,
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
           // console.log("in here");
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
                //console.log("in date check");
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
                Meteor.call("getClientInfos",this.state.stepData.numpolice,parseInt(moment(convertInTextFromFrenchDate(this.state.stepData.dateNaissance)).format("YYYYMMDD"),10),(err,res)=>{
                    if(res && typeof res[0] !="undefined"){
                        //console.log("in meteor call route numpolice for OUI res="+res);
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
                            //console.log("la route est alors "+route);
                            
                            this.setState({
                                error:false,
                                checking:false,
                                disableThem:true,
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
                        //console.log(err);
                    }
                });
                
            }
        }else if(route==="prospectForm" ||route==="modiform"){
           // console.log("la route du "+route)
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
        //console.log(e.target.value);
        if(typeof this.state.stepData.numpolice!="undefined" && (this.state.stepData.numpolice.length<8 || this.state.stepData.numpolice.length>8)&&this.state.stepData.clientData){
            this.setState({
                error:false,
                stepData:Object.assign({},this.state.stepData,{
                    numpolice:e.target.value,
                    clientData:null
                }),
                lastIndex:5
            });
        }
        else{
            this.setState({
                error:false,
                stepData:Object.assign({},this.state.stepData,{
                    numpolice:e.target.value
                }),
                lastIndex:5
            });
        }
    
    };
    handleDate=(e)=>{
        e.stopPropagation();
       // console.log(e.target.value);
            this.setState({
                error:false,
                stepData:Object.assign({},this.state.stepData,{
                    dateNaissance:e.target.value.length==10?e.target.value:null,
                }),
            });
      
        
    
    };
   _dialogOpen(){
       this.setState({dialogIsOpen: true});
   }
   _dialogClose(){
    this.props.reset();
       this.setState({dialogIsOpen: false,stepData:Object.assign({},this.state.stepData,{
        dateNaissance:null,
    }),});
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
        //alert();
        const {clientData}=this.state.stepData;
        const {dispatch}=this.props;
        let found=false;
        Object.keys(clientData).forEach((e,i,arr)=>{
            //console.log(clientData[e]);
            if(clientData[e]=="(non communiquée)"||clientData[e]=="{non communiquée}"||clientData[e]==""){
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
                    case"profession":
                    nomDuChamps="profession"
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
              // console.log("value of c "+c);
                if(c===true){
                    
                    this.setState({
                        dialogTIsOpen: false,
                        alreadyOp:true,
                        stepData:Object.assign({},this.state.stepData,{
                            choixModification:"CONF"
                        }),
                        stepIndex:this.state.stepIndex+1
                    });
                    Meteor.call("saveLog",clientData,"clients",(err,res)=>{
                        if(err){
                       
                        }else{
                            //alert("dispatching meteor call")
                        //dispatch action afin de rediriger pour 20min
                           store.dispatch(finprocessoui());
                        }
                    });
                   // dispatch(finprocessoui());
                }else{
                    return;
                }
            }
        });
        if(!found){
               
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
      if(window.mobilecheck() && this.state.stepData.step1_isClient=="non" && this.state.stepIndex===3){
        //prevention pour gerer les vilain bugs sur le mobile
      // console.log("non choix"+window.mobilecheck())
        this.setState({
            stepIndex:this.state.stepIndex-1
        })
    }
    if(window.mobilecheck() && this.state.stepData.step1_isClient=="oui" && this.state.stepIndex===3 && !this.state.choixOuimodMobile){
        //prevention pour gerer les vilain bugs sur le mobile hacky solution via state
       //alert("oui choix"+window.mobilecheck())
        this.setState({
            stepIndex:this.state.stepIndex-1,
            choixOuimodMobile:true
        })
    }if(window.mobilecheck() && this.state.stepData.step1_isClient=="oui" && this.state.stepIndex===3 && this.state.choixOuimodMobile){
        //prevention pour gerer les vilain bugs sur le mobile hacky solution via state
      // alert("oui 2choix"+window.mobilecheck())
        
    }
      console.dir(reduxState.flowProcess.canBrowse+"..."+reduxState.flowProcess.processCompleted);
      if(reduxState.flowProcess.canBrowse && reduxState.flowProcess.processCompleted==="OUI"){
        //console.log("redirection Client")
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
        if(this.props.routerParam){
            //console.dir(this.props.routerParam);
            const {routerParam}=this.props;
            console.log(`${routerParam.link_login_only}?username=T-${routerParam.mac_esc}`);

            setTimeout(()=>{
                window.location.assign(`${routerParam.link_login_only}?username=T-${routerParam.mac_esc}`)
                
                console.log(`${routerParam.link_login_only}?username=T-${routerParam.mac_esc}`);
                //window.location.assign(`${routerParam.link_login_only}?dst=http://www.google.com&amp;username=T-${routerParam.mac_esc}`)
            },10000);
        }
        
      }else if(reduxState.flowProcess.canBrowse && reduxState.flowProcess.processCompleted==="NON"){
       // console.log("redirection Prospects");
       //alert(JSON.stringify(this.props.routerParam));
        this.setState({
            stepIndex:this.state.stepIndex+1
        });
        dispatch(resetProcess());
        if(this.props.routerParam){
            //console.dir(this.props.routerParam);
            const {routerParam}=this.props;
            console.log(`${routerParam.link_login_only}?username=T-${routerParam.mac_esc}`);

            setTimeout(()=>{
                window.location.assign(`${routerParam.link_login_only}?username=T-${routerParam.mac_esc}`)
                
                console.log(`${routerParam.link_login_only}?username=T-${routerParam.mac_esc}`);
                //window.location.assign(`${routerParam.link_login_only}?dst=http://www.google.com&amp;username=T-${routerParam.mac_esc}`)
            },10000);
        }
      }
  }
    render(){
         const {handleSubmit,pristine,submitting,dispatch,sendermail,message,nom,prenom,birthDate,numpolice,reduxState}=this.props;
         const {stepIndex,lastIndex,stepperFinished}=this.state;
         if(this.state.stepData.choixModification==="CONF"){
            
            setTimeout(()=>{
                //location.href="https://www.google.com";
                window.open(
                    'https://www.google.com',
                    '_blank' // <- This is what makes it open in a new window.
                  );
            },10000);
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
                                    <p><b>De profession: </b> {typeof this.state.stepData.clientData =="object" && this.state.stepData.clientData ?this.state.stepData.clientData.profession:null}</p>
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
                                                label="Profession"
                                                checked={typeof this.state.stepData.modifs!="undefined"?this.state.stepData.modifs.modprof:false}
                                                onCheck={()=>{
                                                    this.setState({
                                                        stepData:Object.assign({},this.state.stepData,{
                                                            modifs:Object.assign({},this.state.stepData.modifs,{
                                                                modprof:typeof this.state.stepData.modifs!="undefined"?!this.state.stepData.modifs.modprof:true,
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
                                <p>Nous vous invitons à vérifier vos informations personelles. N'hésitez surtout pas à faire une mise à jour de celles-ci si vous pensez que certaines informations ne réfletent pas la réalité.<br/>Cliquez sur le bouton <b>Tout est conforme</b> si vous n'avez pas besoin de mettre vos données à jour.<br/>Cliquez sur le bouton <b>Retour</b> pour modifier les données précédemment entrées.<br/>Cliquez sur le bouton <b>Mettre à jour</b> pour mettre à jour vos informations.</p>
                            </div>
            
                            ); 

        let routeOui=[<Step key="A">
            <StepLabel>Cher client,</StepLabel>
            <StepContent>
                <h1>Identifiez vous ci dessous</h1>
                <div>
                    <form name="Ouiidentif">
                        <TextField
                            floatingLabelText="Veuillez entrer un numero de police"
                            hintText="Exemple:12345678"
                            fullWidth={true}
                            autoComplete="off"
                            floatingLabelStyle={this.state.styles.floatingLabelStyle}
                            hintStyle={this.state.styles.hintStyle}
                            onChange={this.handlePolice}
                            disabled={this.state.disableThem}
                            value={this.state.stepData.numpolice}
                        />
                        <TextField
                            floatingLabelText="Veuillez entrer votre date de naissance"
                            hintText="Exemple:JJ-MM-AAAA"
                            fullWidth={true}
                            autoComplete="off"
                            disabled={this.state.disableThem}
                            floatingLabelStyle={this.state.styles.floatingLabelStyle}
                            hintStyle={this.state.styles.hintStyle}
                            onChange={this.handleDate}
                        />
               </form>
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



