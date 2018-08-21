<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>

<t:layout>
    <jsp:attribute name="header_after">
        <style type="text/css">
            code {
                white-space: pre;
            }

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

            body{
                background-color: transparent;
                position: relative;
            }
        </style>
    </jsp:attribute>
    <jsp:body>
        <div class="container">


    <h2 id="privacy">Privacy</h2>
    <h3 id="">Data processed</h3>
    <div>
        When you use PrankWeb, we collect the following information:
        <ul>
            <li>IP address</li>
            <li>browser</li>
            <li>which of our pages you visit</li>
            <li>date and time of website visit</li>
            <li>type of your operating system</li>
        </ul>
    </div>

    <h3 id="">Data controller</h3>
    <div class="contentBox">
        The controller of the above listed data is Charles University, Ovocny trh 5, 116 36 Prague 1, Czech Republic (further in this text referred to as "UK").
    </div>

    <h3 id="">Reason for personal data processing</h3>
    <div class="contentBox">
        Personal data relating to usage of the website (traffic and location) are being processed for the purpose of:
        <ul>
            <li>statistics</li>
            <li>service monitoring</li>
            <li>optimisation of partial tasks</li>
            <li>security</li>
            <li>drafting annual reports, monitoring reports, project result summaries and other similar documents</li>
        </ul>
    </div>

    <h3 id="">Third party disclosure</h3>
    <div class="contentBox">
        We do not disclose any parsonal data about our website users to third parties.
    </div>

    <h3 id="">Data retention</h3>
    <div class="contentBox">
        Personal data are stored for the period of 5 years after the projects had been terminated. If you do not wish UK to process your data related to this website, PrankWeb, please do not visit this internet page or use online instances of those services.
    </div>

    <h3 id="">Cookies</h3>
    <div class="contentBox">
        We do not store any cookies for the website prank.projekty.ms.mff.cuni.cz.
    </div>



        </div>
    </jsp:body>
</t:layout>
