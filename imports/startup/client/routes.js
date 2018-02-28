import {FlowRouter} from 'meteor/ostrio:flow-router-extra';
import {Meteor} from 'meteor/meteor';
import {mount} from 'react-mounter';
import React from 'react';
import store from '../../redux/store.js'
import MainLayout from '../../ui/layouts/MainLayout.jsx';
import FormulaireHotPage from '../../ui/pages/FormulaireHotPage.jsx';
//import {macAdresses} from '../../api/collections.js';
import {getParams} from '../../redux/actions/processActions';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Session} from 'meteor/session';
import LogDownload from '../../ui/pages/LogDownload';
import ProspectDownload from '../../ui/pages/ProspectDownload';



injectTapEventPlugin();

FlowRouter.route('/',{
	name:'home',
	action(){
		mount(MainLayout,
			{content:()=><FormulaireHotPage/>});	
	}
});

FlowRouter.route('/getLog',{
	name:'getLog',
	action(){
		mount(MainLayout,
			{content:()=><LogDownload/>});	
	}
});

FlowRouter.route('/getProspects',{
	name:'geteProspects',
	action(){
		mount(MainLayout,
			{content:()=><ProspectDownload/>});	
	}
});

FlowRouter.route('/captivegate',{
	name:'captivegate',
	action(params,queryParams){
		//alert(JSON.stringify(queryParams));
		//let res=macAdresses.findOne({mac_adr:queryParams.mac_esc});
			store.dispatch(getParams(queryParams));
			mount(MainLayout,
				{content:()=><FormulaireHotPage routerP={queryParams}/>})
		
	}
});




