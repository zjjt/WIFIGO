import React,{PropTypes,Component} from 'react';
import AppBar from 'material-ui/AppBar';
import GetIdentiform from '../components/GetIdentiform.jsx';
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
export default class FormulaireHotPage extends Component{
    constructor(){
        super();
        this.state={
            styles:normalStyle
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
        
    }
    componentWillUnmount(){
        window.removeEventListener('resize',this._updateDimensions.bind(this))
    }
    render(){
        return(
           <div className="centeredContent">
                <div className="loginDiv fadeInUp animated">
                    <AppBar
                        title={`Agence ${Meteor.settings.public.AGENCE} de Nsia Vie Assurances`}
                        style={{backgroundColor: '#212f68'}}
                        iconClassNameLeft="none"
                        titleStyle={this.state.styles.appContainerStyle.titleStyle}
                    />
                    <GetIdentiform/>
                </div>
           </div>
        )
    }
}