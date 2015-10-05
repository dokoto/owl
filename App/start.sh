#!/bin/bash

cd owl ;
adb install -r platforms/android/build/outputs/apk/android-debug.apk
adb shell am start -n com.dokoto.owl/com.dokoto.owl.MainActivity