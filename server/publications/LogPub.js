import {Meteor} from 'meteor/meteor';
import {Log} from '../../imports/api/collections.js';

export default LogList=()=>{
    Meteor.publish('LogList',function(){
        return Log.find();
    });
}