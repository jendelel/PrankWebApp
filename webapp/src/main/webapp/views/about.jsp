<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>

<t:layout>
    <jsp:attribute name="header_after">
        <style type="text/css">
            .inline-image {
                height: 1em;
            }

            body::after {
                background-image: url(/images/proteins.png);
                opacity: 0.1;
                top:0;
                bottom:0;
                left: 0;
                right: 0;
                display: block;
                content: "";
                width: 100%;
                height: 100%;
                background-size: cover;
                background-attachment: fixed;
                position: absolute;
                z-index: -1;
            }

            .container {
                background-color: transparent;
            }

            body{
                background-color: transparent;
                /*position: relative;*/
            }
        </style>
    </jsp:attribute>
    <jsp:body>
        <div class="container">
            <h2 id="about"> About </h2>
            <p>Proteins are fundamental building blocks of all living organisms. They perform their function by binding to other molecules. This project deals with interactions
                between proteins and small molecules (so called ligands) because most of the currently used drugs are small molecules.
                While there are several tools that can predict these interactions, they are almost none for their visualization. Thus, we built a new visualization website by combining several protein visualizers together. Since evolutionary homology correlates with binding sites, our web interface also displays homology for comparison. We developed several ways how to calculate homology, and used it to improve detection of protein-ligand binding sites.
                Here we present PrankWeb, a modern web application for structure and sequence visualization of a protein and its protein-ligand binding sites as well as evolutionary homology. We hope that it will provide a quick and convenient way for scientists to analyze proteins.</p>
            <p>The source code of this project can be found at
                <a href="http://github.com/jendelel/PrankWebApp" target="_blank">GitHub</a></p>
            <h2 id="authors">Authors</h2>
            <p>This project was created as bachelor thesis by Lukáš Jendele under supervision of
                RNDr. David Hoksza Ph.D. at Charles University. </p>
            <h2 id="visualization">Used projects</h2>
            <p> PrankWeb utilizes P2Rank for
                pocket detection and LiteMol together with Protael for its visualization.
            </p>
            <ul>
                <li><p><a href="http://siret.ms.mff.cuni.cz/p2rank">P2Rank</a></p></li>
                <li><p><a href="http://webchemdev.ncbr.muni.cz/Litemol/">LiteMol</a> </p></li>
                <li><p><a href="http://proteins.burnham.org:8080/Protael/">Protael</a></p></li>
                <li><p><a href="http://compbio.cs.princeton.edu/conservation/">Jensen-Shannon Diverge method for calculating
                    conservation scores</a></p></li>
                <li><p><a href="http://www.drive5.com/muscle/muscle.html">MUSCLE</a></p></li>
                <li><p><a href="http://weizhong-lab.ucsd.edu/cd-hit/download.php">CD-HIT</a></p></li>
                <li><p><a href="https://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE_TYPE=BlastDocs&DOC_TYPE=Download">PSI-BLAST</a></p></li>
            </ul>
        </div>
    </jsp:body>
</t:layout>