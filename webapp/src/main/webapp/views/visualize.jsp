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
        <div id="sequence-view" class="sequence-view"/>
        <div id="app" class="app" data-input-type="${inputType}" data-input-id="${inputId}"></div>
        <div id="pocket-list" class="pocket-list"/>
        <script>
            var getPviz = function () {
                return this.pviz
            }
        </script>
        <script src="${pageContext.request.contextPath}/javascripts/LiteMol-PrankWeb.js"></script>
    </jsp:body>
</t:layout>
