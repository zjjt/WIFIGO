import {FlowRouter} from 'meteor/kadira:flow-router';
import {Meteor} from 'meteor/meteor';
import {mount} from 'react-mounter';
import React from 'react';
import store from '../../redux/store.js'
import MainLayout from '../../ui/layouts/MainLayout.jsx';
import FormulaireHotPage from '../../ui/pages/FormulaireHotPage.jsx';
//import {Events} from '../../api/collections.js';

import injectTapEventPlugin from 'react-tap-event-plugin';
import {Session} from 'meteor/session';

injectTapEventPlugin();
FlowRouter.route('/',{
	name:'home',
	triggersEnter:[(context,redirect)=>{
		
	}],
	action(){
		mount(MainLayout,
			{content:()=><FormulaireHotPage/>})
	}
});


