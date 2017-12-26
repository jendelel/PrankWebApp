<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>

<t:layout>
    <jsp:attribute name="header_after">
        <link rel="stylesheet"
              href="http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css"/>
        <link rel="stylesheet"
              href="${pageContext.request.contextPath}/css/home.css"/>

    </jsp:attribute>
    <jsp:body>
        <div class="jumbotron">
            <h1 class="text-center">Welcome to PrankWeb</h1>
            <p class="text-center">Prank is a novel machine learning-based method for prediction of
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
                    <div class="form-inline text-center" style="margin: 0 auto; width: 350px;">
                        <label for="pdbId">PDB code
                            <a class='tooltip-hint' data-toggle="tooltip" data-placement="top"
                               title="PrankWeb will download the protein file from PDB and calculate conservation using HSSP database (if possible) or from MSA of similar proteins.">
                                <i class='glyphicon glyphicon-question-sign' style="color:black;"></i>
                            </a>
                            :</label>
                        <input type="text" id="pdbId" placeholder="2SRC" class="form-control"/>
                    </div>

                    <p class="text-center">OR</p>

                    <label>PDB file
                        <a class='tooltip-hint' data-toggle="tooltip" data-placement="top"
                                      title="Protein file to analyze.">
                        <i class='glyphicon glyphicon-question-sign' style="color:black;"></i>
                        </a>
                        :</label>
                    <label for="upload-pdb" class="btn btn-default btn-file">
                        <input id="upload-pdb" name="pdbFile" accept=".pdb" type="file"/>
                    </label>
                </div>
                    <%--<br>--%>
                <div class="checkbox">
                    <label> <input id="conservation-checkbox" name="doConservation"
                                   type="checkbox" onclick="doConservationClicked()" checked="checked"
                                   style="margin-right: 4px;">Run conservation analysis
                        <a class='tooltip-hint' data-toggle="tooltip" data-placement="top"
                           title="If checked, a model that exploits conservation will be used to classify protein binding sites. If neither MSA nor PDB code is provided, PrankWeb will calculate conservation from MSA of similar proteins.">
                            <i class='glyphicon glyphicon-question-sign' style="color:black;"></i>
                        </a>
                    </label>
                </div>
                    <%--<br>--%>
                <div class="form-group">
                    <label id="pdbId_opt_lbl" for="pdbId_opt">PDB code (optional)
                        <a class='tooltip-hint' data-toggle="tooltip" data-placement="top"
                           title="If PDB code of the uploaded protein is provided, MSA alignment from HSSP database for this protein will be used to calculate the conservation score.">
                            <i class='glyphicon glyphicon-question-sign' style="color:black;"></i>
                        </a>
                        :</label>
                    <input type="text" id="pdbId_opt"/> <br>
                    <label id="msa_opt_lbl">MSA files (optional)
                        <a class='tooltip-hint' data-toggle="tooltip" data-placement="top"
                               title="Provide your custom MSA file and PrankWeb will calculate the conservation scores from that MSA file.
                               Alignments in FASTA and CLUSTAL formats are supported.">
                            <i class='glyphicon glyphicon-question-sign' style="color:black;"></i>
                        </a>
                        :
                    </label>
                    <label for="upload-msas" class="btn btn-default btn-file">
                        <input id="upload-msas" name="msaFiles" type="file"
                               accept=".fasta, .aln" multiple>
                        </input>
                    </label>
                </div>
                    <%--<br>--%>
                <button id="pdbUploadSumbit" type="submit"
                        class="btn btn-default" onclick="uploadPdbFile()">Submit
                </button>
            </div>

        </div>
        <script src="${pageContext.request.contextPath}/javascripts/upload.js"></script>
    </jsp:body>
</t:layout>
