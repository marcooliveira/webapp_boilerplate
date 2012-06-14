set OLDDIR=%CD%
cd "%~dp0..\src"
compass watch . sass\main.scss
cd "%OLDDIR%"