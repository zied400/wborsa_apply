DROP TABLE if exists fakeNosy.product;
CREATE TABLE fakeNosy.product (
  `store` varchar(45) NOT NULL,
  `SKU` varchar(45) NOT NULL,
  `EAN` varchar(45) DEFAULT NULL,
  `StockDispo` int(11) DEFAULT NULL,
  `PrixVte` float DEFAULT NULL,
  `RemiseMnt` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
