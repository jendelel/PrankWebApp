@echo off

call mvn install:install-file -Dfile="libs\p2rank_slim.jar" -DgroupId="cz.siret.prank" -DartifactId="program" -Dversion="2.0-rc.3_JAVAAPI.1" -Dpackaging="jar" -DgeneratePom=true
call mvn install:install-file -Dfile="..\pranklib\build\libs\pranklib-1.0.0.jar" -DgroupId="cz.siret.prank" -DartifactId="pranklib" -Dversion="1.0.0" -Dpackaging="jar" -DgeneratePom=true
call mvn install:install-file -Dfile="libs\FastRandomForest_0.99.jar" -DgroupId="hr.irb" -DartifactId="fastrandomforest" -Dversion="0.9" -Dpackaging="jar" -DgeneratePom=true