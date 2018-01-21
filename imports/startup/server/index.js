import {Meteor} from 'meteor/meteor';
//import '../both';
import {DBSQLSERVER} from '../../api/connectors'


Meteor.startup(()=>{
    //variables d'environnement node
    process.env.MAIL_URL=Meteor.settings.MAIL_SETTINGS;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED=0;//a ne pas utiliser pour les appli externes

    DBSQLSERVER.sync();
    DBSQLSERVER.authenticate().then(()=>{
        console.log('Connection MsSql etablie');
    }).catch(()=>{
        console.log('Impossible de se connecter a MsSql,veuillez reverifier');
    });
});