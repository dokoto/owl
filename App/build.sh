#!/bin/bash

cd owl ;
rm -rfv www/*
cp -rfv ../../Prototypes/P03/* www/.
cordova build android ;