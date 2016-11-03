<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>

<t:layout>
    <jsp:attribute name="header">
            <script src="/javascripts/LiteMol-plugin.js"></script>
            <link rel="stylesheet" href="/css/LiteMol-plugin.css"/>
            <link rel="stylesheet" href="/css/visualizations.css"/>
    </jsp:attribute>
    <jsp:body>
        <div class="box">
            <h2 class="section-heading text-center">Graphical visualization</h2>
            <div id="app" data-pdbid="${pdbId}"></div>
            <section id="portfolio" class="bg-light-gray">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12 text-center">
                            <h2 class="section-heading">Pockets</h2>
                            <h3 class="section-subheading text-muted">Detailed information about each pocket. TODO add what each column means and interaction with visualization</h3>
                        </div>
                    </div>
                    <div class="row">
                        <dl>
                            <dt>Pocket name</dt>
                            <dd></dd>
                            <dt>Pocket rank</dt>
                            <dd></dd>
                            <dt>Pocket score</dt>
                            <dd></dd>
                        </dl>
                    </div>
                </div>
            </section>
        </div>
        <script src="/javascripts/LiteMol-PrankWeb.js"></script>
        <script>function selectPocket(pocketName) { alert(pocketName); }</script>
    </jsp:body>
</t:layout>