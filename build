#!/bin/bash

APP=`python -c 'from config import *; print app'`

./install.rdf.build
./chrome.manifest.build
./goldorank.build
./content-contents.rdf.build
./locale-contents.rdf.build
./skin-contents.rdf.build
rm -f $APP.xpi
./xpi.build
