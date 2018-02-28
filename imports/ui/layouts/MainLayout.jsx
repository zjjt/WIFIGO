import React,{PropTypes,Component} from 'react';
import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import {connect} from 'react-redux';
import {blue900} from 'material-ui/styles/colors';
import {Meteor} from 'meteor/meteor';
import store from '../../redux/store';
import {Provider} from 'react-redux';
import Divider from 'material-ui/MenuItem';



//pour desactiver METEOR_OFFLINE_CATALOG=1 meteor
const muiTheme= getMuiTheme({
	appBar:{
		backgroundColor: blue900
	},
	
});





//Logged.muiName='IconMenu';

export default class MainLayout extends Component{
	constructor(){
		super();
		this.state={
			loggedIn:false,
			drawerOpen:false
		};
	}
	componentWillMount() {

	}

	handleToggle(){
		this.setState({
			drawerOpen:!this.state.drawerOpen
		});
		
	}
	handleClose(){
		this.setState({drawerOpen:false});
	}

	componentDidUpdate(){
		
	}
	componentDidMount(){
	}
	render(){
		const {content}=this.props;
		//{content()}
			//console.dir(store.getState());
		
			return(
			
				<Provider store={store} >
                    <MuiThemeProvider muiTheme={muiTheme} >
                        <div className="masterContainer">
                            <header>
                            </header>
                            <section className="generalSection">
                            {content()}
                            </section>
                            <footer>
                                WIFIGO Internet Access Portal v.0.1.0 &copy; tous droits réservés. 
                            </footer>
                        </div>
				    </MuiThemeProvider>
                </Provider>	
			
		);
	}
	

}




