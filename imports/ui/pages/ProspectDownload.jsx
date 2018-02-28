import React,{PropTypes,Component} from 'react';
import AppBar from 'material-ui/AppBar';
import {Meteor} from 'meteor/meteor';
import GetIdentiform from '../components/GetIdentiform.jsx';
import {macAdresses} from '../../api/collections';
import { createContainer } from 'meteor/react-meteor-data';
import _ from 'lodash';


let normalStyle={
    appContainerStyle:{
        titleStyle:{textAlign:'center'},
        contentStyle:{width:'60%',maxWidth:'none'},
    }
};

let max500style=_.extend({},normalStyle,{
    appContainerStyle:{
        titleStyle:{textAlign:'center',fontSize:'1.3em'},
    }
});
let max350style=_.extend({},normalStyle,{
    appContainerStyle:{
        titleStyle:{textAlign:'justify',fontSize:'1em',marginLeft:'-25px'},
    }
});

class ProspectDownload extends Component{
    constructor(){
        super();
        this.state={
            styles:normalStyle,
        }
    }
    _updateDimensions(){
        if(window.innerWidth<970 && window.innerWidth>454){
            this.setState({
                styles:max500style
            });
        }else if(window.innerWidth<=400){
            this.setState({
                styles:max350style
            });
        }else{
            this.setState({
                styles:normalStyle
            });
        }
    }

    componentDidMount(){
       
        this._updateDimensions();
        window.addEventListener('resize',this._updateDimensions.bind(this))

        Meteor.call("downloadProspects",(err,res)=>{
           // console.dir(res+" "+err);
            if(res){
                console.dir(res);
               alert("Un fichier excel contenant le total des prospects au "+moment(res.date).format("DD/MM/YYYY")+" sera téléchargé automatiquement...");
               const blob=new Blob([res.blob],{
                   type:'application/octet-stream'
               });
               const a=window.document.createElement('a');
               a.href=window.URL.createObjectURL(blob,{
                   type:'data:attachment/xlsx'
               });
               a.download="PROSPECTS_WIFIGO_"+moment(new Date()).format("DD/MM/YYYY")+".xlsx";
               document.body.appendChild(a);
               a.click();
               document.body.removeChild(a);
            }else{
                alert("téléchargement échoué.");
            }
        })
        
    }
    componentWillUnmount(){
        window.removeEventListener('resize',this._updateDimensions.bind(this))
    }
    render(){
        return(
            <div style={{textAlign:"center",color:"white"}}>
                <marquee>Downloading Prospects...</marquee>
            </div>
        )
    }
}

export default createContainer((props)=>{
    /*const machandle=Meteor.subscribe('MacList');
    const loading=!machandle.ready();
    const macone=macAdresses.findOne();    
    const macExist=!loading && !! macone;
    const adr=props.routerP.mac_esc;
    
    return{
        loading,
        macone,
        macExist,
        macfound:macAdresses.find({mac_adr:adr}).count() 
    };*/
    return{}
},ProspectDownload);