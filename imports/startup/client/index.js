require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'raf/polyfill';
import './routes';
import {meteor} from 'meteor/meteor';

//import '../both';

Meteor.startup(()=>{
    WebFontConfig={
        google:{families:['Roboto:400,300,500:latin']}
    };
 
    
    (()=>{
        const wf=document.createElement('script');
        wf.src=('https:'==document.location.protocol?'https':'http')+'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type='text/javascript';
        wf.async='true';
        const s=document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf,s);
        console.log("async font loaded",WebFontConfig);
    })();
   
});

