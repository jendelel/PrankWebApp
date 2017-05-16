<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>

<t:layout>
    <jsp:attribute name="header_after">
        <script src="htps://npmcdn.com/babel-core@5.8.38/browser.min.js"></script>
    </jsp:attribute>
    <jsp:body>
        <div class="jumbotron">
            <div style="text-align: center;" class="spinner">
                <p class="text-center">We are sorry. An error occurred.</p>
                <p class="text-center">Please try again or contact us.</p>
                <div class="row">
                    <code class="col-xs-6 col-xs-offset-3" style="text-align: left">
                            ${msg}
                    </code>
                </div>
            </div>
        </div>
    </jsp:body>
</t:layout>
