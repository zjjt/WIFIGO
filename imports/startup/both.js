//This file will hold both the connection and the ddp protocol explicitely

import {DDP} from 'meteor/ddp-client';
import {meteor} from 'meteor/meteor';

const DDPConnection=(Meteor.isClient)?DDP.connect('http://localhost:3000'):{};
export {DDPConnection};