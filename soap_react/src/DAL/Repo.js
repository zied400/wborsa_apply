/* jshint esversion: 6 */

import mysql from "mysql";
import fs from "fs";
import path from "path";

export class Repo {
    constructor(host, user, password, db) {
        this.connection = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: db
        });
        this.connection.connect();
    }


    cleanTable(handler) {
        this.connection.query('truncate table product', function(err, rows, fields) {
            if (err) throw err;
            handler();
        });
    }

    add(product, handler){
      this.connection.query("insert into product values ('"+ product.store +
      "','"+ product.sku + "','"+ product.sku +"','"+ product.stock +
      "','"+ product.prix +"','"+ product.remise +"')", function(e,r,f){
        if (e) throw e;
        handler();
      });
    }

    update(product, handler){
      this.connection.query("update product set StockDispo='"+ product.stock +
      "', PrixVte='" + product.prix + "', RemiseMnt='" + product.remise +
      "' where store='" + product.store + "' and SKU='" + product.sku + "'",
      function(e,r,f){
        if (e) throw e;
        handler();
      });
    }

    syncdb(handler) {
        this.cleanTable(() => {
            fs.readFile(path.resolve(__dirname, '../../scripts/syncdb.sql'), "utf-8",
                (e, data) => {
                    if (e) throw e;
                    this.connection.query(data, function(err) {
                        if (err) throw err;
                        handler();
                    });
                });
        });
    }

    getStores(handler) {
        this.connection.query('select store from product group by store', function(err, rows, fields) {
            if (err) throw err;
            handler(rows.map((r) => r.store));
        });
    }

    getProductsByStore(store, handler) {
        this.connection.query("select * from product where store = '" + store + "'", function(err, rows, fields) {
            if (err) throw err;
            handler(rows.map((r) => r));
        });
    }

    fillResults(result, store, callback){
      this.getProductsByStore(store, (products) => {
        callback(result.map((r)=>{
          const group = products.filter(p => p.SKU === r.ArtSKU);
          if(group[0]){
            const c = group[0];
            r.StockDispo = c.StockDispo;
            r.PrixVte = c.PrixVte;
            r.RemiseMnt = c.RemiseMnt;
          }else{
            r.ErrorCode = 5;
            r.ErrorLibelle = "Article Non Trouvé";
          }
          return r;
        }));
      });
    }
}
