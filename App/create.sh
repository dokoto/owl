#!/bin/bash

rm -rfv owl ;
cordova create owl com.dokoto.owl owl ;
cd owl ;
cordova platform add android ;
cordova plugin add https://github.com/dokoto/cordova-plugin-clipboard.git --save ;
cordova plugin add cordova-plugin-inappbrowser --save ;
rm -rfv www/*
cp -rfv ../../Prototypes/* www/.