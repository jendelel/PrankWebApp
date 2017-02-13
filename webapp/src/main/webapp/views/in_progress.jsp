<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>

<t:layout>
    <jsp:attribute name="header_after">
        <meta http-equiv="refresh" content="5;">
        <script src="htps://npmcdn.com/babel-core@5.8.38/browser.min.js"></script>
        <link rel="stylesheet"
              href="http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css"/>
    </jsp:attribute>
    <jsp:body>
        <div class="jumbotron">
            <div style="text-align: center;" class="spinner"><i
                    style="font-size:48px; color: aqua;"
                    class="fa fa-spinner fa-spin"></i><br/>
                <p class="text-center">Please wait, running analysis...</p>
                <p class="text-center">This page refreshes every 5 seconds.</p>
            </div>
        </div>
    </jsp:body>
</t:layout>
