import React,{PropTypes,Component} from 'react';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import {Toolbar,ToolbarSeparator,ToolbarTitle,ToolbarGroup} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import {Field,reduxForm,formValueSelector} from 'redux-form';
import areIntlLocalesSupported from 'intl-locales-supported';
import MenuItem from 'material-ui/MenuItem';
import {TextField,DatePicker,SelectField,TimePicker} from 'redux-form-material-ui';
import Home from 'material-ui/svg-icons/action/home';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';
import Slider from 'material-ui/Slider';
import {Meteor} from 'meteor/meteor';
import {finprocessnon,modiformCanSubmit,modiformCantSubmit} from '../../redux/actions/processActions';
import {Random} from 'meteor/random';
import _ from 'lodash';
import {validateEmail} from '../../utils/utils';
import {submitYes} from './submits';

let DateTimeFormat;
if(areIntlLocalesSupported(['fr'])){
    DateTimeFormat=global.Intl.DateTimeFormat;
}

 class ModiForm extends Component{
    constructor(props){
        super(props);
        this.state={
            dialogIsOpen:false,
            errorMsg:'',
            eventId:null,
            eventIndex:null,
            snackOpen:false,
            snackMsg:'',
            
            
        };
    }
    _dialogOpen(){
        this.setState({dialogIsOpen: true});
    }

   _dialogClose(){
       this.setState({dialogIsOpen: false});
   }

   _snackClose(){
       this.setState({
           snackOpen:false
       });
   }

   componentDidUpdate(){
      
   }


   handleChangeS=(event,value)=>{
       console.log(value);
       this.setState({slider:value});
   };


    render(){
        
        //console.log(REDAC);
        const dialogActions = [
        <FlatButton
            label="OK"
            primary={true}
            onTouchTap={this._dialogClose.bind(this)}
        />,
        ];
       

        const {handleSubmit,pristine,submitting,dispatch,reset,modifs}=this.props;
        const lesModifs=Object.keys(modifs).filter((key)=>modifs[key]);
        console.dir(lesModifs);

        

        const maxLength = max => value =>(value && value.length > max)||(value && value.length < max) ? `ce champs doit être de ${max} caractères` : undefined;
        const maxLength3=maxLength(3);
        const maxLength1=maxLength(1);
        const maxLength8=maxLength(8);
        const required = value => value ? undefined : 'Requis';
        const number = value => value && isNaN(Number(value)) ?"Ce champs n'accepte que des nombres":undefined;
        const email = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?'Adresse e-mail invalide' : undefined
        //on cree dynamiquement le formulaire avec un map
        let leFormulaire=lesModifs.map((e,i,arr)=>{
            if(e=="modlieu"){
                return(
                    <Field
                        name="lieu" 
                        component={TextField}
                        hintText="Entrez votre lieu de naissance"
                        floatingLabelText="Lieu de naissance"
                        fullWidth={true}
                        key={i}
                        onChange={(e)=>{
                            if(e.target.value!==""){
                                dispatch(modiformCanSubmit())
                            }else{
                                dispatch(modiformCantSubmit())
                            }
                        }}
                        floatingLabelStyle={styles.floatingLabelStyle}
                        hintStyle={styles.hintStyle}
                        floatingLabelFixed={true}
                        validate={[ required ]}
                    />
                );
            }
            if(e=="modprof"){
                return(
                    <Field
                        name="profession" 
                        component={TextField}
                        hintText="Entrez votre profession"
                        floatingLabelText="Profession"
                        fullWidth={true}
                        key={i}
                        onChange={(e)=>{
                            if(e.target.value!==""){
                                dispatch(modiformCanSubmit())
                            }else{
                                dispatch(modiformCantSubmit())
                            }
                        }}
                        floatingLabelStyle={styles.floatingLabelStyle}
                        hintStyle={styles.hintStyle}
                        floatingLabelFixed={true}
                        validate={[ required ]}
                    />
                );
            }
            if(e=="modsexe"){
                return(
                    <Field
                        name="sexe" 
                        component={SelectField}
                        floatingLabelText="Votre sexe"
                        hintText="De quel sexe êtes vous ?"
                        floatingLabelFixed={true}
                        floatingLabelStyle={styles.floatingLabelStyle}
                        hintStyle={styles.hintStyle}
                        validate={[required]}
                        key={i}
                        onChange={(e,i,value)=>{
                            if(value!==""){
                                dispatch(modiformCanSubmit())
                            }else{
                                dispatch(modiformCantSubmit())
                            }
                        }}
                        value={this.props.sexe?this.props.sexe:''}
                    >
                        <MenuItem value="M" primaryText="HOMME"/>
                        <MenuItem value="F" primaryText="FEMME"/>
                    </Field>
                );
            }
            if(e=="modmatrimo"){
                return(
                    <Field
                        name="matrimoniale" 
                        component={SelectField}
                        floatingLabelText="Situation Matrimoniale"
                        hintText="Situation matrimoniale"
                        floatingLabelFixed={true}
                        floatingLabelStyle={styles.floatingLabelStyle}
                        hintStyle={styles.hintStyle}
                        validate={[required]}
                        key={i}
                        onChange={(e,i,value)=>{
                            if(value!==""){
                                dispatch(modiformCanSubmit())
                            }else{
                                dispatch(modiformCantSubmit())
                            }
                        }}
                        value={this.props.matrimoniale?this.props.matrimoniale:''}
                    >
                        <MenuItem value="CE" primaryText="CELIBATAIRE"/>
                        <MenuItem value="CC" primaryText="CONCUBINAGE"/>
                        <MenuItem value="MA" primaryText="MARIE(E)"/>
                        <MenuItem value="DI" primaryText="DIVORCE(E)"/>
                        <MenuItem value="SE" primaryText="SEPARE(E)"/>
                        <MenuItem value="PA" primaryText="PACSE(E)"/>
                        <MenuItem value="VE" primaryText="VEUF / VEUVE"/>
                    </Field>
                );
            }
            if(e=="modtel"){
                return(
                    <fieldset>
                        <Field
                            name="telephone1" 
                            component={TextField}
                            hintText="Entrez un numéro de téléphone 1"
                            floatingLabelText="Contact 1"
                            fullWidth={true}
                            floatingLabelStyle={styles.floatingLabelStyle}
                            hintStyle={styles.hintStyle}
                            floatingLabelFixed={true}
                            key={i}
                            onChange={(e)=>{
                                if(e.target.value!==""){
                                    dispatch(modiformCanSubmit())
                                }else{
                                    dispatch(modiformCantSubmit())
                                }
                            }}
                            validate={[ required,maxLength8,number]}
                          
                        />
                        <Field
                            name="telephone2" 
                            component={TextField}
                            hintText="Entrez un numéro de téléphone 2"
                            floatingLabelText="Contact 2"
                            fullWidth={true}
                            floatingLabelStyle={styles.floatingLabelStyle}
                            hintStyle={styles.hintStyle}
                            floatingLabelFixed={true}
                            key={"IB"}
                            onChange={(e)=>{
                                if(e.target.value!==""){
                                    dispatch(modiformCanSubmit())
                                }else{
                                    dispatch(modiformCantSubmit())
                                }
                            }}
                            validate={[maxLength8,number]}
                            
                        />
                    </fieldset>
                );
            }
            if(e=="modmail"){
                return(
                    <Field
                        name="email" 
                        component={TextField}
                        hintText="Entrer votre email"
                        floatingLabelText="Email"
                        fullWidth={true}
                        floatingLabelStyle={styles.floatingLabelStyle}
                        hintStyle={styles.hintStyle}
                        type="mail"
                        key={i}
                        onChange={(e)=>{
                            if(e.target.value!==""){
                                dispatch(modiformCanSubmit())
                            }else{
                                dispatch(modiformCantSubmit())
                            }
                        }}
                        floatingLabelFixed={true}
                        validate={[ required,email ]}
                        
                    />
                );
            }
            if(e=="modadresse"){
                return(
                    <Field
                        name="adresse" 
                        component={TextField}
                        hintText="Entrer votre adresse postale"
                        floatingLabelText="Adresse"
                        fullWidth={true}
                        floatingLabelStyle={styles.floatingLabelStyle}
                        hintStyle={styles.hintStyle}
                        floatingLabelFixed={true}
                        key={i}
                        onChange={(e)=>{
                            if(e.target.value!==""){
                                dispatch(modiformCanSubmit())
                            }else{
                                dispatch(modiformCantSubmit())
                            }
                        }}
                        validate={[ required ]}
                        
                    />
                );
            }
        });
        console.dir(leFormulaire);
        return(
            <form onSubmit={handleSubmit} autoComplete="off">
            {leFormulaire}
            </form>
        );
      
        
    }
}
ModiForm=reduxForm({
    form:'modiform',
    onSubmit:submitYes
})(ModiForm);

const selector = formValueSelector('modiform');



 export default ModiForm = connect(
  state => {
    // or together as a group
    const { nomtot, dateNaissance,lieu,sexe,matrimoniale,telephone1,telephone2,email,adresse } = selector(state, 'nomtot', 'dateNaissance','lieu','sexe','matrimoniale','telephone1','telephone2','email','adresse')

    return {
        nomtot,
        dateNaissance,
        lieu,
        sexe,
        matrimoniale,
        telephone1,
        telephone2,
        email,
        adresse
    }
  },null,null,{withRef:true}
)(ModiForm)





const styles={
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
        
    }
}