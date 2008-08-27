#!/bin/bash

ID=`python -c 'from config import *; print uid'`

DIRTESTSPROFILE=`ls ~/.mozilla/firefox | grep tests`

#On tue l'instance precedente de firefox tests
for pid in `ps eax| grep firefox| grep tests | awk '{print $1}'`
do
	kill $pid
done

#On enregistre la référence à l'extension (maj de la date)
pwd > ~/.mozilla/firefox/$DIRTESTSPROFILE/extensions/{$ID}

#Relance de firefox tests
export MOZ_NO_REMOTE=1
firefox -P tests &


