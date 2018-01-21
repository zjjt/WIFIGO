import {Meteor} from 'meteor/meteor';
import {Clients} from '../../imports/api/collections.js';

export default ClientsList=()=>{
    Meteor.publish('ClientsList',function(){
        return Clients.find();
    });
}