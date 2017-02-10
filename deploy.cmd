@echo off

pushd e:\School\MFF\Projects\Prank2Web\webapp
call gradlew.bat war

call e:\wildfly-10.1.0.Final\bin\jboss-cli.bat --connect controller=localhost "deploy --force e:\School\MFF\Projects\Prank2Web\webapp\build\libs\ROOT.war"
