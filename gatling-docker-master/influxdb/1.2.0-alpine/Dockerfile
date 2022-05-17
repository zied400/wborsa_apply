FROM influxdb:1.2.0-alpine
MAINTAINER  BEN SALEM "zied.salem.m@gmail.com"
ADD influxdb.conf /etc/influxdb/influxdb.conf
ENTRYPOINT ["/entrypoint.sh"]
CMD ["influxd"]
