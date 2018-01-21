import {Meteor} from 'meteor/meteor';
import {Prospects} from '../../imports/api/collections.js';

export default ProspectsList=()=>{
    Meteor.publish('ProspectsList',function(){
        return Prospects.find();
    });
}