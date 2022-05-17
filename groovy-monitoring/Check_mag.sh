#! /bin/bash

WAIT_TIME="15";
FILE_MAGS="mag.txt"
COUNTER=0;
GOOD=0;
COUNTER_FILE="/tmp/counter";
IPS="10.1.15.1 192.168.170.212 10.52.4.21 172.16.1.187";
#IPS="10.1.15.1 192.168.170.212 172.24.4.21 172.19.1.187";

echo "" > $COUNTER_FILE;


function testIP
{

#  RESULT=`ping $1 -c 1 -t $WAIT_TIME | grep -Eo "([0-9]) received"`;

#  if [[ $RESULT == "0 received" ]]; then

#    echo -e "\e[1;31mPING CLOSE !\e[0;0m";

#  else

#    echo -e "\e[1;32mPING OPEN\e[0;0m";

#    GOOD=`echo $GOOD+1|bc`;

#  fi
echo "--connect-timeout $WAIT_TIME -I $1 2>/dev/null"
  RESULT=`curl --connect-timeout $WAIT_TIME -I $1 2>/dev/null | grep -Eo "HTTP/1.1 200 OK"`;

  if [[ $RESULT == "" ]]; then

    #echo -e "\e[1;31mHTTP CLOSE !\e[0;0m";

    echo "$1 $2 $3 -> 0" >> $COUNTER_FILE;

  else

#    echo -e "\e[1;32mHTTP OPEN\e[0;0m";

    echo "$1 $2 $3 -> 1" >> $COUNTER_FILE;

  fi

#  RESULT=`echo "plop"| telnet $1 3050  2>/dev/null | grep -Eo "Connected"`;

#  if [[ $RESULT == "" ]]; then

#    echo -e "\e[1;31mBDD CLOSE !\e[0;0m";

#  else

#    echo -e "\e[1;32mBDD OPEN\e[0;0m";

#  fi
}

for IP in $IPS; do

  echo "$COUNTER - TEST BASIQUE $IP";

  COUNTER=`echo $COUNTER+1|bc`;

  testIP $IP &

done;

old_IFS=$IFS     # sauvegarde du séparateur de champ
IFS=$'\n'     # nouveau séparateur de champ, le caractère fin de ligne

for MAG in $(cat $FILE_MAGS);  do

  IP=`echo $MAG | awk -F "\t" '{print $15}'`;
  COLDPOS=`echo $MAG | awk -F "\t" '{print $3}'`;
  LIB_CPOS=`echo $MAG | awk -F "\t" '{print $4}'`;
  ENSEIGNE=`echo $MAG | awk -F "\t" '{print $5}'`;

  if [[ $ENSEIGNE == "IFR" ]]; then

    echo "$COUNTER - CHECK $IP $COLDPOS $LIB_CPOS";

    COUNTER=`echo $COUNTER+1|bc`;

    testIP $IP $COLDPOS $LIB_CPOS &

  fi

done;

IFS=$old_IFS;

echo "";

while [[ `cat $COUNTER_FILE | wc -l` < $COUNTER ]]; do


#       echo "`cat $COUNTER_FILE | wc -l` != $COUNTER";

  GOOD=`cat /tmp/counter  | grep " -> 1" | wc -l`;
  echo -ne "\e[1mTEST OK $GOOD/$COUNTER\e[0m \r";

        sleep 2;

done;

  #cat /tmp/counter  | grep " -> 0" | wc -l


  echo -e "\nEND";
