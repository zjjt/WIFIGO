import {Meteor} from 'meteor/mongo';
import {Mongo} from 'meteor/mongo';

let Prospects=new Mongo.Collection('Prospects');
let Clients=new Mongo.Collection('Clients');
export {Prospects,Clients};