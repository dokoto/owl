#!/bin/bash

cd owl ;
rm -rfv www/*
cp -rfv ../../Prototypes/* www/.
cordova build android ;