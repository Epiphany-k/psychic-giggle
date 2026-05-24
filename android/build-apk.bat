@echo off
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.11.10-hotspot"
set "ANDROID_SDK_ROOT=C:\Users\epiph\Android\Sdk"
set "ANDROID_HOME=C:\Users\epiph\Android\Sdk"
set "PATH=%JAVA_HOME%\bin;%PATH%"
echo Building APK...
call gradlew.bat assembleDebug
echo Exit code: %ERRORLEVEL%
dir /s app\build\outputs\apk\*.apk 2>/dev/null
