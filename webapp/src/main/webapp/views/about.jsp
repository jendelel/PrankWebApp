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
            <h2 id="authors">Authors</h2>
            <div class="row pt-md">
                <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12 profile">
                    <div class="img-box">
                        <img src="/images/jendelel.jpg">
                    </div>
                    <h3>Bc. Lukas Jendele</h3>
                    <p>Faculty of Mathematics and Physics, Charles University</p>
                    <p><span class="glyphicon glyphicon-envelope"></span> lukas.jendele (at)
                        gmail.com</p>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12 profile">
                    <div class="img-box">
                        <img src="/images/hokszad.jpg">
                    </div>
                    <h3>RNDr. David Hoksza, PhD</h3>
                    <p>Faculty of Mathematics and Physics, Charles University</p>
                    <p><span class="glyphicon glyphicon-envelope"></span> david.hoksza (at)
                        mff.cuni.cz </p>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12 profile">
                    <div class="img-box">
                        <img src="/images/krivakr.jpg">
                    </div>
                    <h3>Mgr. Radoslav Krivák</h3>
                    <p>Faculty of Mathematics and Physics, Charles University</p>
                    <p><span class="glyphicon glyphicon-envelope"></span> rkrivak (at)
                        gmail.com </p>
                </div>
                <div class="col-lg-3 col-md-3 col-sm-4 col-xs-12 profile">
                    <div class="img-box">
                        <img src="/images/novotnym.jpg">
                    </div>
                    <h3>Mgr. Marian Novotný, Ph.D.</h3>
                    <p>Faculty of Science, Charles University</p>
                    <p><span class="glyphicon glyphicon-envelope"></span> marian.novotny (at)
                        natur.cuni.cz </p>
                </div>
            </div>
        </div>
    </jsp:body>
</t:layout>