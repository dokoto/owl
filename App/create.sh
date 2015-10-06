#!/bin/bash

echo "Eliminando viejas construcciones" ;
rm -rf owl ;
cordova create owl com.dokoto.owl owl ;
cd owl ;
cordova platform add android ;
cordova plugin add https://github.com/dokoto/cordova-plugin-clipboard.git --save ;
cordova plugin add https://github.com/dokoto/cordova-plugin-inappbrowser.git --save ;
echo "Eliminando logica por defecto" ;
rm -rf www/*
echo "Copiando logica propia" ;
cp -rfv ../../Prototypes/P03/* www/.
echo "Copiando assets android"
cp -rfv ../../Documents/assets/android/res/* platforms/android/res/.