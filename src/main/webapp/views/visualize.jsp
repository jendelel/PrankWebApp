<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>

<t:layout>
    <jsp:attribute name="header_before">
            <script src="${pageContext.request.contextPath}/javascripts/LiteMol-plugin.js"></script>
            <script src="${pageContext.request.contextPath}/javascripts/pviz-bundle.min.js"></script>
            <link rel="stylesheet"
                  href="${pageContext.request.contextPath}/css/LiteMol-plugin.css"/>
            <link rel="stylesheet" href="${pageContext.request.contextPath}/css/pviz-core.css"/>
            <link rel="stylesheet" href="${pageContext.request.contextPath}/css/pviz-custom.css"/>
            <link rel="stylesheet"
                  href="${pageContext.request.contextPath}/css/visualizations.css"/>
    </jsp:attribute>
    <jsp:body>
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h2 class="section-heading text-center">Graphical visualization</h2>
                    <div id="app" data-input-type="${inputType}"
                         data-input-id="${inputId}"></div>
                </div>
                <div class="col-md-6">
                    <div class="row">
                        <div class="col-lg-12 text-center">
                            <h2 class="section-heading">Pockets</h2>
                        </div>
                    </div>
                    <div id="pockets" class="row">
                    </div>
                </div>
            </div>
        </div>
        <script>
            var getPviz = function() {
                return this.pviz
            }
        </script>
        <script src="${pageContext.request.contextPath}/javascripts/LiteMol-PrankWeb.js"></script>
    </jsp:body>
</t:layout>
