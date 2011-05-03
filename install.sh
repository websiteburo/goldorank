#!/bin/bash

APP=`python -c 'from config import *; print app'`

sudo pkill firefox-bin
sudo -H firefox -install-global-extension $APP.xpi
firefox &

