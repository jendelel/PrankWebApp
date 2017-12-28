<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>

<t:layout>
    <jsp:attribute name="header_after">
        <link rel="stylesheet"
              href="http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css"/>
        <link rel="stylesheet"
              href="${pageContext.request.contextPath}/css/home.css"/>

        <style type="text/css">
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
        <div class="container jumbotron" style="padding-top: 0px">
            <h1>Welcome to PrankWeb</h1><br/>
            <div class="row">
            <div class="col-sm-6">Prank is a novel machine learning-based method for prediction of
                ligand binding sites from protein structure.</div></div>
            <div>Please upload your pdb protein file or enter PBD ID.</div><br/>
                <div style="display: none;" class="progress">
                    <div role="progressbar" class="progress-bar"></div>
                </div>
                <div style="text-align: center; display: none;" class="spinner"><i
                        style="font-size:48px; color: aqua;"
                        class="fa fa-spinner fa-spin"></i><br/><span>Running analysis...</span>
                </div>

                <div class="form-group">
                    <div class="row">
                        <div class="form-inline col-sm-6">
                        <label for="pdbId">PDB code
                            <a class='tooltip-hint' data-toggle="tooltip" data-placement="top"
                               title="PrankWeb will download the protein file from PDB.">
                                <i class='glyphicon glyphicon-question-sign' style="color:black;"></i>
                            </a>
                            :</label>
                            <input type="text" id="pdbId" placeholder="2SRC"
                                   class="form-control pull-right text-right"/>
                        </div>
                    </div>

                    <div class="row justify-content-center">
                        <div class="col-sm-6">
                            <p class="text-center">OR</p>
                        </div>
                    </div>

                    <div class="row justify-content-center">
                        <div class="col-sm-6">
                            <label>PDB file
                                <a class='tooltip-hint' data-toggle="tooltip" data-placement="top"
                                   title="Protein file to analyze.">
                                    <i class='glyphicon glyphicon-question-sign'
                                       style="color:black;"></i>
                                </a>
                                :</label>
                            <label for="upload-pdb"
                                   class="btn btn-default btn-file pull-right text-right">
                                <input id="upload-pdb" name="pdbFile" accept=".pdb" type="file"/>
                            </label>
                        </div>
                    </div>
                </div>
                    <%--<br>--%>
            <div class="row justify-content-center">
                <div class="col-sm-6">
                    <div class="panel panel-default"
                         style="background-color: transparent; padding: 10px;">
                        <div class="checkbox">
                            <label> <input id="conservation-checkbox" name="doConservation"
                                           type="checkbox" onclick="doConservationClicked()"
                                           checked="checked"
                                           style="margin-right: 4px;">Run conservation analysis
                                <a class='tooltip-hint' data-toggle="tooltip" data-placement="top"
                                   title="If checked, a model that exploits conservation will be used to classify protein binding sites. If neither MSA nor PDB code is provided, PrankWeb will calculate conservation from MSA of similar proteins.">
                                    <i class='glyphicon glyphicon-question-sign'
                                       style="color:black;"></i>
                                </a>
                            </label>
                        </div>
                            <%--<br>--%>
                        <div class="form-group">
                            <div style="padding: 2px;">
                            <label id="pdbId_opt_lbl" for="pdbId_opt">PDB code (optional)
                                <a class='tooltip-hint' data-toggle="tooltip" data-placement="top"
                                   title="If PDB code of the uploaded protein is provided, MSA alignment from HSSP database for this protein will be used to calculate the conservation score.">
                                    <i class='glyphicon glyphicon-question-sign'
                                       style="color:black;"></i>
                                </a>
                                :</label>
                            <input type="text" id="pdbId_opt" class="text-right pull-right"/> <br>
                            </div>
                            <label id="msa_opt_lbl">MSA files (optional)
                                <a class='tooltip-hint' data-toggle="tooltip" data-placement="top"
                               title="Provide your custom MSA file and PrankWeb will calculate the conservation scores from that MSA file.
                               Alignments in FASTA formats are supported.">
                                    <i class='glyphicon glyphicon-question-sign'
                                       style="color:black;"></i>
                                </a>
                                :
                            </label>
                            <label for="upload-msas"
                                   class="btn btn-default btn-file pull-right text-right">
                                <input id="upload-msas" name="msaFiles" type="file"
                                       accept=".fasta, .aln" multiple>
                                </input>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
                    <%--<br>--%>
            <div class="row justify-content-center">
                <div class="col-sm-6 text-center">
                    <button id="pdbUploadSumbit" type="submit"
                            class="btn btn-default text-center" onclick="uploadPdbFile()">Submit
                    </button>
                </div>
            </div>

        </div>
        <script src="${pageContext.request.contextPath}/javascripts/upload.js"></script>
    </jsp:body>
</t:layout>
