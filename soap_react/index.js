/* jshint esversion: 6 */
import express from 'express';
import bodyParser from "body-parser";
import soap from "soap";

import {Repo} from './src/DAL/Repo';
const repo = new Repo("localhost", "confident", "******", "fakeNosy");

function mapProductToResult(e){
  return {
      "ErrorCode" :0,
      "ErrorLibelle": "",
      "ArtSKU": e.$value,
      "ArtEAN": e.$value,
      "StockDispo": 0,
      "PrixVte": 0,
      "RemiseMnt": 0
  };
}

function getResultsFromDb(callback, r, code){
  repo.fillResults(r, code, (result)=>{
      //console.log(result);
      callback({"TRetourPrixStockList" : result});
  });
}

var service = {
    "ICrossCanalservice":{
      "ICrossCanalPort":{
        "GetPrixStock":
          (args, callback) => {
              let r = [];
              let entries = args.ListeArticle;
              const code = args.CodeMagasin.$value;
              if(typeof(entries.ListeArticle.map) !== "undefined"){
                 r = entries.ListeArticle.map(mapProductToResult);
              }else{
                r.push(mapProductToResult(entries.ListeArticle));
              }
              getResultsFromDb(callback, r, code);
              console.log("done");
          }
      }
    }
 };

 var xml = require('fs').readFileSync('ICrossCanal.xml', 'utf8');

 //express server example
 var app = express();
 //body parser middleware are supported (optional)
 app.use(bodyParser.raw({type: function(){return true;}, limit: '5mb'}));
 app.listen(3050, function(){
     //Note: /wsdl route will be handled by soap module
     //and all other routes & middleware will continue to work
     const server = soap.listen(app, '/GestionStock/SrvGestionStock.dll/soap/ICrossCanal', service, xml);
     server.log =  (type, data) => {
      console.log(type, data);
    };
 });


 console.log("Server Ready!");

 require('./api');
