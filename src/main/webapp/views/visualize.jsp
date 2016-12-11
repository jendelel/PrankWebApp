<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>

<t:layout>
    <jsp:attribute name="header">
            <script src="/javascripts/LiteMol-plugin.js"></script>
            <link rel="stylesheet" href="/css/LiteMol-plugin.css"/>
            <link rel="stylesheet" href="/css/visualizations.css"/>
    </jsp:attribute>
    <jsp:body>
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h2 class="section-heading text-center">Graphical visualization</h2>
                    <div id="app" data-pdbid="${pdbId}"></div>
                </div>
                <div class="col-md-6">
                    <%--<section id="portfolio" class="bg-light-gray .col-md-4">--%>
                        <div class="row">
                            <div class="col-lg-12 text-center">
                                <h2 class="section-heading">Pockets</h2>
                                <h3 class="section-subheading text-muted">Detailed information
                                    about each pocket. TODO add what each column means and
                                    interaction with visualization</h3>
                            </div>
                        </div>
                        <div id="pockets" class="row">
                            <dl class="pocket-list">
                                <dt>Pocket name</dt>
                                <dd></dd>
                                <dt>Pocket rank</dt>
                                <dd></dd>
                                <dt>Pocket score</dt>
                                <dd></dd>
                            </dl>
                        </div>
                    <%--</section>--%>
                </div>
            </div>
        </div>
        <script src="/javascripts/LiteMol-PrankWeb.js"></script>
        <script>function selectPocket(pocketName) {
            alert(pocketName);
        }</script>
    </jsp:body>
</t:layout>