/*insert into fakeNosy.product
SELECT replace(w.p_code,'_','/'), p.code, p.code, min(sl.p_available), min(pr.p_price),0  FROM
XXXXXXXX_18_04.products p
JOIN XXXXXXXX_18_04.catalogversions cv ON  p.p_catalogversion = cv.PK
JOIN XXXXXXXX_18_04.catalogs c ON  cv.p_catalog  =  c.PK
JOIN XXXXXXXX_18_04.productavailabiassign pa ON  pa.p_product  =  p.PK
JOIN XXXXXXXX_18_04.cmssite s ON  s.p_availabilitygroup  =  pa.p_availabilitygroup
join XXXXXXXX_18_04.stocklevels sl on sl.p_productcode = p.code
join XXXXXXXX_18_04.warehouses w on w.pk = sl.p_warehouse
join XXXXXXXX_18_04.pricerows pr on pr.p_product = p.pk
WHERE ( c.p_id ='XXXXXXXXProductCatalog' and  cv.p_version ='Staged' and s.p_uid = 'CLICKANDCOLLECT')
group by w.p_code, p.code;*/
