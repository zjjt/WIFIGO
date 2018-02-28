import {Meteor} from 'meteor/mongo';
import {Mongo} from 'meteor/mongo';

let Prospects=new Mongo.Collection('Prospects');
let Clients=new Mongo.Collection('Clients');
let Log=new Mongo.Collection('Log');
export {Prospects,Clients,Log};