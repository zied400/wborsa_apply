/* jshint esversion: 6 */
import express from 'express';
import bodyParser from "body-parser";

import {Repo} from './src/DAL/Repo.js';



const app = express();

const allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8099;
const router = express.Router();
const repo =  new Repo("localhost", "confident", "7fnD35Ew", "fakeNosy");

router.get('/zied', function(req, res){
  //res.render('index', {});
    console.log("OK");

    repo.getStores((stores) => {
       res.json(stores);
    });
});

router.get('/syncdb', function(req, res) {
    repo.syncdb(() => {
       res.json("OK");
    });
});

router.post('/add', function(req, res) {
    const product = req.body.product;
    repo.add(product, ()=>{
      console.log("product : " + product.sku + " added!");
      res.json("OK");
    });
});

router.post('/update', function(req, res) {
    const product = req.body.product;
    repo.update(product, ()=>{
      console.log("product : " + product.sku + " updated!");
      res.json("OK");
    });
});

router.get('/:store/', function(req, res) {
    repo.getProductsByStore(req.params.store.replace("-","/"), (products) => {
       res.json(products);
    });
});

app.use('/stores', router);
app.listen(port);

console.log('Api Server Started at : ' + port);
