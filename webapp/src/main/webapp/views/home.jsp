<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>

<t:layout>
    <jsp:attribute name="header_after">
        <script src="htps://npmcdn.com/babel-core@5.8.38/browser.min.js"></script>
        <link rel="stylesheet"
              href="http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css"/>
    </jsp:attribute>
    <jsp:body>
        <div class="jumbotron">
            <h1 class="text-center">Welcome to PRANK</h1>
            <p class="text-center">PRANK is a novel machine learning-based method for prediction of
                ligand binding sites from protein structure.</p>
            <p class="text-center">Please upload your pdb protein file or enter PBD ID.</p>

            <div class="text-center">
                <div style="display: none;" class="progress">
                    <div role="progressbar" class="progress-bar"></div>
                </div>
                <div style="text-align: center; display: none;" class="spinner"><i
                        style="font-size:48px; color: aqua;"
                        class="fa fa-spinner fa-spin"></i><br/><span>Running analysis...</span>
                </div>

                <div class="form-group">
                    <label>PDB file:</label>
                    <label for="upload-pdb" class="btn btn-default btn-file">
                        <input id="upload-pdb" name="pdbFile" accept=".pdb" type="file"/>
                    </label>
                </div>
                    <%--<br>--%>
                <div class="checkbox">
                    <label> <input id="conservation-checkbox" name="doConservation"
                                   type="checkbox" onclick="doConservationClicked()"
                                   value="1" style="margin-right: 4px;">Run conservation
                        analysis </label>
                </div>
                    <%--<br>--%>
                <div class="form-group">
                    <label for="pdbId_opt">PDB code (optinal):</label>
                    <input type="text" id="pdbId_opt"/> <br>
                    <label>MSA files (optional):</label>
                    <label for="upload-msas" class="btn btn-default btn-file">
                        <input id="upload-msas" name="msaFiles" type="file"
                               accept=".fasta, .aln" multiple/>
                    </label>
                </div>
                    <%--<br>--%>
                <button id="pdbUploadSumbit" type="submit"
                        class="btn btn-default" onclick="uploadPdbFile()">Submit
                </button>
            </div>

            <p class="text-center">OR</p>

            <div class="form-group form-inline" style="margin: 0 auto; width: 350px;">
                <label for="pdbId">PDB code:</label>
                <input type="text" id="pdbId" placeholder="4X09" class="form-control"/>
                <button id="pdbIdSumbit" type="submit" class="btn btn-default"
                        onclick="submitPdbId()">Submit
                </button>
            </div>
        </div>
        <script src="${pageContext.request.contextPath}/javascripts/upload.js"></script>
    </jsp:body>
</t:layout>
