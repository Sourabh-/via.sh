// import {firebaseRef} from '../src/firebase'
// require('dotenv').config()

var firebaseRef = require('../src/firebase').firebaseRef;

var updates = {};
updates['/app'] = {
    'isAuthApp': false,
    'hasHeader': true,
    'hasFooter': false,
    'routes': {
        'landing': ''
    }
};

updates['/specifications/header']=[
    {
        'id':1,
        'parentId':'',
        'type':'Row',
        'orderNo':1,
        'uiComponent':'materializecss',
        'className':'row'
    },
    {
        'id':2,
        'parentId':1,
        'type':'Column',
        'orderNo':1,
        'uiComponent':'materializecss',
        'className':'col s12'
    },
    {
        'id':3,
        'parentId':2,
        'type':'Common',
        'orderNo':1,
        'uiComponent':'materializecss',
        'className':'card'
    },
    {
        'id':4,
        'parentId':3,
        'type':'Common',
        'orderNo':1,
        'uiComponent':'materializecss',
        'className':'card-content'
    },
    {
        'id':5,
        'parentId':4,
        'type':'Label',
        'orderNo':1,
        'defaultValue':'UI Components',
        'uiComponent':'materializecss',
        'className':'card-title'
    }
];

updates['/specifications/landing']=[
    {
        'id':1,
        'parentId':'',
        'type':'Row',
        'orderNo':1,
        'uiComponent':'materializecss',
        'className':'row'
    },
    {
        'id':2,
        'parentId':1,
        'type':'Column',
        'orderNo':1,
        'uiComponent':'materializecss',
        'className':'col s3'
    },
    {
        'id':3,
        'parentId':2,
        'type':'Common',
        'orderNo':1,
        'uiComponent':'materializecss',
        'className':'card'
    },
    {
        'id':4,
        'parentId':3,
        'type':'Common',
        'orderNo':1,
        'uiComponent':'materializecss',
        'className':'card-image'
    },
    {
        'id':5,
        'parentId':4,
        'type':'Image',
        'src':'https://firebasestorage.googleapis.com/v0/b/mihy-all.appspot.com/o/download.png?alt=media&token=06225a02-2900-4165-a13c-28e90faa42cf',
        'orderNo':1,
        'uiComponent':'materializecss',
        'className':''
    },
    {
        'id':6,
        'parentId':4,
        'type':'Label',
        'orderNo':2,
        'uiComponent':'materializecss',
        'className':'card-title',
        'defaultValue':'Row'
    },
    {
        'id':7,
        'parentId':3,
        'type':'Common',
        'orderNo':2,
        'uiComponent':'materializecss',
        'className':'card-content'
    },
    {
        'id':8,
        'parentId':7,
        'type':'Paragraph',
        'orderNo':2,
        'uiComponent':'materializecss',
        'className':'',
        'defaultValue':'Row component'
    },
    {
        'id':9,
        'parentId':4,
        'type':'Label',
        'orderNo':2,
        'uiComponent':'materializecss',
        'className':'card-action'
    },
    {
        'id':10,
        'parentId':9,
        'type':'Paragraph',
        'orderNo':2,
        'uiComponent':'materializecss',
        'className':'',
        'defaultValue':'Row component'
    }
];

firebaseRef.update(updates).then((res) => {
    console.log(res);
});

// console.log(process.env);

// {

//     rows:[
//       {
//         cols:[
//           {
//             colWidth:12,
//             textAlign:"center",
//             hasChildren:true,
//           }
//         ]
//       }
//     ]
// }
