@echo off

call e:\School\MFF\Projects\Prank2Web\webapp\build.cmd

call e:\wildfly-10.1.0.Final\bin\jboss-cli.bat --connect controller=localhost "deploy --force e:\School\MFF\Projects\Prank2Web\webapp\build\libs\ROOT.war"
