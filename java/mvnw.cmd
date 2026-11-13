@echo off
setlocal
set MV=3.9.9
set DIR=%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MV%
if not exist "%DIR%\bin\mvn.cmd" (
  echo Downloading Apache Maven %MV%...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$u='https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MV%/apache-maven-%MV%-bin.zip'; $z=Join-Path $env:TEMP 'apache-maven.zip'; Invoke-WebRequest $u -OutFile $z; New-Item -ItemType Directory -Force '%USERPROFILE%\.m2\wrapper\dists' ^| Out-Null; Expand-Archive -Force $z '%USERPROFILE%\.m2\wrapper\dists'; if(Test-Path '%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MV%') { }"
)
if not exist "%DIR%\bin\mvn.cmd" (echo Maven download failed. Check internet connection.& exit /b 1)
call "%DIR%\bin\mvn.cmd" %*
endlocal
