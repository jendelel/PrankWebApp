pushd e:\School\MFF\Projects\Prank2Web\webapp
call gradlew.bat war
copy /Y e:\School\MFF\Projects\Prank2Web\webapp\build\libs\ROOT.war e:\wildfly-10.1.0.Final\standalone\deployments\ROOT.war
popd