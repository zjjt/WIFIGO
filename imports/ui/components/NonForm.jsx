import React,{PropTypes,Component} from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
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
import {submitNon} from './submits';
import {finprocessnon} from '../../redux/actions/processActions';
import {Random} from 'meteor/random';
import _ from 'lodash';
import {validateEmail} from '../../utils/utils';

let DateTimeFormat;
if(areIntlLocalesSupported(['fr'])){
    DateTimeFormat=global.Intl.DateTimeFormat;
}

 class NonForm extends Component{
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
       
        const {handleSubmit,pristine,submitting,dispatch,reset}=this.props;
        

        const maxLength = max => value =>(value && value.length > max)||(value && value.length < max) ? `ce champs doit être de ${max} caractères` : undefined;
        const minforage = min => value =>(value && value.length < min)||(value && value.length > 3) ? `ce champs doit avoir ${min} caractères minimum` : undefined;
        const maxminage =value =>value  < 18||value > 110 ? `Loool...soyez sérieux` : undefined;
        const maxLength3=maxLength(3);
        const maxLength8=maxLength(8);
        const minforage2=minforage(2);
        const required = value => value ? undefined : 'Requis';
        const number = value => value && isNaN(Number(value)) ?"Ce champs n'accepte que des nombres":undefined;
        const email = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?'Adresse e-mail invalide' : undefined
       
        return(
               <form onSubmit={handleSubmit} autocomplete="off" >
               <Field
                    name="nom" 
                    component={TextField}
                    hintText="Entrez votre nom de famille"
                    floatingLabelText="Nom de famille"
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    floatingLabelFixed={true}
                    validate={[ required ]}
                />
                <Field
                    name="prenom" 
                    component={TextField}
                    hintText="Entrez votre/vos prénoms"
                    floatingLabelText="Prénoms"
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    floatingLabelFixed={true}
                    validate={[ required ]}
                />
                <Field
                    name="age" 
                    component={TextField}
                    hintText="Entrez votre age"
                    floatingLabelText="age"
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    floatingLabelFixed={true}
                    validate={[ required,minforage2,maxminage,number]}
                />
                <Field
                    name="telephone" 
                    component={TextField}
                    hintText="Entrez votre numéro de téléphone"
                    floatingLabelText="Contact"
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    floatingLabelFixed={true}
                    validate={[ required,maxLength8,number]}
                />
                <Field
                    name="email" 
                    component={TextField}
                    hintText="Entrer votre email"
                    floatingLabelText="Email"
                    fullWidth={true}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    hintStyle={styles.hintStyle}
                    type="mail"
                    floatingLabelFixed={true}
                    validate={[ required,email ]}
                />
                  
              
                
               </form>
        );
    }
}
NonForm=reduxForm({
    form:'nonform',
    onSubmit:submitNon
})(NonForm);

const selector = formValueSelector('CreateEvent');



 export default NonForm = connect(
  state => {
    // or together as a group
    const { nom, prenom  } = selector(state, 'nom', 'prenom');

    return {
    }
  },null,null,{withRef:true}
)(NonForm)





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