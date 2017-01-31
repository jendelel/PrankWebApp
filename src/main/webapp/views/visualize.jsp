<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>

<t:layout>
    <jsp:attribute name="header">
            <script src="/javascripts/LiteMol-plugin.js"></script>

            <link rel="stylesheet" href="/css/LiteMol-plugin.css"/>
            <link rel="stylesheet" href="/css/pviz-core.css"/>
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
                    <div class="row">
                        <div class="col-lg-12 text-center">
                            <h2 class="section-heading">Pockets</h2>
                            <h3 class="section-subheading text-muted">Detailed information
                                about each pocket. TODO add what each column means and
                                interaction with visualization</h3>
                        </div>
                    </div>
                    <div id="pockets" class="row">
                    </div>
                </div>
            </div>
            <div class="row">
                <div id="pviz"></div>
            </div>
        </div>
        <script src="/javascripts/pviz-bundle.min.js"></script>
        <script>
            var getPviz = function() {
                return this.pviz
            }   
        </script>
        <script src="/javascripts/LiteMol-PrankWeb.js"></script>

    </jsp:body>
</t:layout>