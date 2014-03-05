#!/bin/bash
#cat banner

if [ "$(id -u)" != "0" ]; then
	echo "SUDO!! Please rerun this script with sudo!"
	exit 1
fi

echo ""
echo "AS A Remind you need to have mondodb up and running !"
echo ""

ulimit -n 2048

#node ./node_modules/geoip-lite/scripts/updatedb.js &
#node ./updater.js &
node ./server.js &
