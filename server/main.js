import { Meteor } from 'meteor/meteor';
import '../imports/startup/server/index';
import methods from './methods';
import ClientsList from './publications/ClientsPub';
import ProspectsList from './publications/ProspectsPub'; 

Meteor.startup(() => {
  // code to run on server at startup
  ClientsList();
  ProspectsList();
  methods();
});
