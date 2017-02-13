@echo off

pushd e:\School\MFF\Projects\Prank2Web\pranklib
call gradle jar
popd

pushd e:\School\MFF\Projects\Prank2Web\webapp
call installPrank.cmd
call gradlew.bat war
