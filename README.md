# PrankWeb
This repositary contains PrankWeb web application. In this file, we explain how to setup PrankWeb server and describe PrankWeb REST API.

## Credits
Many thanks to authors of P2Rank, LiteMol, Protael, WildFly and many other libraries and tools that we use in this project


## How to run PrankWeb
### Building PrankWeb
Install Node.js and Gradle (you will also need Java).

Clone this repository including all submodules:

```shell
git clone --recursive https://github.com/jendelel/PrankWebApp.git
```

Now, you build PrankWeb using this command:

```shell
./gradlew clean war
```

This will compile all submodules and create ROOT.war file in build/libs directory.

### Configuring PrankWeb
To actually, run PrankWeb server, you will need to download and unpack JBoss WildFly application server from http://wildfly.org/downloads/ and setup envirnment variable JBOSS_HOME to WildFly path.

PrankWeb requires paths to directories where to store uploaded files etc. Everything is stored in of directory, we will call it `PrankData`. This directory contains `prankweb.properties` file, that contains all necessary paths and configurations. The file contains pairs (key and value).
You must setup the following properties:
* **prank.installdir** Path to P2Rank distro directory (needed for running P2Rank).
* **database.pdb** Path to local PDB database (see http://www.rcsb.org/pdb/static.do?p=download/ftp/index.html how to download).
* **database.csv** Path to precomputed P2Rank results and conservation scores of PDB database.
* **uploads.pdb**  Path to directory where to store uploaded user PDB files.
* **uploads.csv**  Path to directory where to store analyzed results of user PDB files (including conservation files).
* **conservation.hssp** Path to local HSSP database (see http://swift.cmbi.ru.nl/gv/hssp/ how to download).
* **conservation.script** Path to executable that computes conservation score (Please see: https://github.com/jendelel/calc_protein_conservation ).

You can also specify:
* **queue.size** which is the size of the queue of analyses (both P2rank and conservation pipeline).
* **pool.coresize** which is the number of analyses that can run simultaneously.
* **pool.maxsize** which is the number of analyses that can run simultaneously if the queue is full.

We recommend to store all the data in `PrankData` directory. Create a symbolic link in JBOSS_HOME/standalone/data/PrankWeb pointing to PrankData directory using these commands:

Windows:

```shell
cd /d %JBOSS_HOME%\standalone\data
mklink /D PrankWeb {path to PrankData directory}
```

Linux:

```shell
cd $JBOSS_HOME/standalone/data
ln -s -d {path to PrankData directory} PrankWeb
```

Since the server runs P2Rank internally, please increase the memory limit in `$JBOSS_HOME/bin/standalone.conf` on Linux or `%JBOSS_HOME%/bin/standalone.conf.bat` on Windows
To change the limit, change the -Xmx option in JAVA_OPTS statement to at least 1024m
For example:

```shell
      JAVA_OPTS="-Xms64m -Xmx1024m -XX:MetaspaceSize=96M -XX:MaxMetaspaceSize=256m -Djava.net.preferIPv4Stack=true"
```

#### Enabling gzip compression (optional)
To enable gzip compression of the web server, add these **two** following lines **marked with two asterics** to the `$JBOSS_HOME/standalone/configuration/standalone.xml` file:

```xml
        ...
        <subsystem xmlns="urn:jboss:domain:undertow:3.1">
            <buffer-cache name="default"/>
            <server name="default-server">
                <http-listener name="default" socket-binding="http" redirect-socket="https" enable-http2="true"/>
                <https-listener name="https" socket-binding="https" security-realm="ApplicationRealm" enable-http2="true"/>
                <host name="default-host" alias="localhost">
                    <location name="/" handler="welcome-content"/>
                    <filter-ref name="server-header"/>
                    <filter-ref name="x-powered-by-header"/>
                    **<filter-ref name="gzipFilter" predicate="regex[pattern='(?:application/javascript|text/css|text/html|text/plain)(;.*)?', value=%{o,Content-Type}, full-match=true]"/>**
                </host>
            </server>
            <servlet-container name="default">
                <jsp-config/>
                <websockets/>
            </servlet-container>
            <handlers>
                <file name="welcome-content" path="${jboss.home.dir}/welcome-content"/>
            </handlers>
            <filters>
                <response-header name="server-header" header-name="Server" header-value="WildFly/10"/>
                <response-header name="x-powered-by-header" header-name="X-Powered-By" header-value="Undertow/1"/>
                **<gzip name="gzipFilter"/>**
            </filters>
        </subsystem>
        ...
```

### Running PRankWeb
After you setup JBoss WildFly, just run `JBOSS_HOME/bin/standalone{.sh|.bat}` and copy the `ROOT.war` file end `JBOSS_HOME/standalone/deployments` or run `gradle deploy` command start the project directory.

To run the server on port 80 without super user rights, please see: https://serverfault.com/questions/112795/how-end-run-a-server-on-port-80-as-a-normal-user-on-linux  
Brifly: run this command end reroute port 8080 end 80: `sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080`


## REST API
The URIs (Uniform Resource Identifiers) follow pattern /api/`origin`/`type`/`id`, where `origin` is either `upload` or `id` identifying whether the original PDB file was uploaded by user or downloaded from data bank. The `type` indicates type of file requested by user. Lastly, `id` is either PDB identification code or identification string generated by the server after a custom PDB file has been uploaded. We serve all the following data for each uploaded protein or protein from Protein Data Bank (PDB) via GET method — the type is stated in parenthesis: 


* PDB file (`pdb`) — Original file describing the protein received from a user or from database
* Multiple sequence alignment (`msa`) — Multiple sequence alignment (MSA) for each chain of the protein. 
* Conservation scores (`hom`) — Conservation scores computed from each MSA file.
* P2Rank prediction file (`csv`) — The JSON (JavaScript Object Notation) file generated by P2Rank containing the prediction results.
* Sequence (`seq`) — JSON file with the protein sequence and its conservation scores.
* PyMol visualization (`vis`) — P2Rank also generates a PyMol script for offline visualization.
* Package file (`all`) — A ZIP file containing all files listed above. Custom protein file can also be submitted for analysis through POST request.


The URI is: `/analyze/file_upload`. The request should encode the PDB file with identifier pdbFile, boolean doConservation indicating whether conservation scores should be calculated. Optionally, pdbId or MSA files ending with .fasta can be included to speed up the analysis. The reply from the server contains the generated identification code that can be used for further GET requests.
