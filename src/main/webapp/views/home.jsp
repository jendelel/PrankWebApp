<%@page contentType="text/html" pageEncoding="UTF-8" %>
<%@taglib prefix="t" tagdir="/WEB-INF/tags" %>

<t:layout>
    <jsp:attribute name="header">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.1/react-dom.min.js"></script>
        <script src="htps://npmcdn.com/babel-core@5.8.38/browser.min.js"></script>
        <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css"/>
    </jsp:attribute>
    <jsp:body>
        <div class="container">
           <div class="row">
             <div class="box">
               <div class="col-lg-12 text-center">
                 <div id="carousel-example-generic" class="carousel slide">
                   <!-- Indicators-->
                   <ol class="carousel-indicators hidden-xs">
                     <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
                     <li data-target="#carousel-example-generic" data-slide-to="1"></li>
                     <li data-target="#carousel-example-generic" data-slide-to="2"></li>
                   </ol>
                   <!-- Wrapper for slides-->
                   <div class="carousel-inner">
                     <div class="item active"><img src="/images/slide-1.png" alt="" class="img-responsive img-full"/></div>
                     <div class="item"><img src="/images/slide-2.png" alt="" class="img-responsive img-full"/></div>
                     <div class="item"><img src="/images/slide-3.png" alt="" class="img-responsive img-full"/></div>
                   </div>
                   <!-- Controls--><a href="#carousel-example-generic" data-slide="prev" class="left carousel-control"><span class="icon-prev"></span></a><a href="#carousel-example-generic" data-slide="next" class="right carousel-control"><span class="icon-next"></span></a>
                 </div>
                 <h2 class="brand-before"><small>Welcome to</small></h2>
                 <h1 class="brand-name">Prank WebApp</h1>
                 <hr class="tagline-divider"/>
                 <h2><small>By <strong>SIRET Research Group At Charles University</strong></small></h2>
               </div>
             </div>
           </div>
           <div class="row">
             <div class="box">
               <div class="col-lg-12">
                 <hr/>
                 <h2 class="intro-text text-center">Predict ligand binding sites of your protein structure</h2>
                 <hr/>
                 <p class="lead">Please upload your pdb protein file or enter PDB ID:</p>
                 <div id="tab" data-toggle="buttons-radio" class="btn-group"><a href="#uploadFile" data-toggle="tab" class="btn btn-large btn-info active">Upload file</a><a href="#enterId" data-toggle="tab" class="btn btn-large btn-info">Enter PDB code</a></div>
                 <div class="tab-content">
                   <div id="uploadFile" class="tab-pane active">
                     <div class="bs-example">
                       <div style="display: none;" class="progress">
                         <div role="progressbar" class="progress-bar"></div>
                       </div>
                       <div style="text-align: center; display: none;" class="spinner"><i style="font-size:48px; color: aqua;" class="fa fa-spinner fa-spin"></i><br/><span>Running analysis...</span></div>
                       <label class="btn btn-default btn-file">
                         <input id="upload-pdb" name="pdbFile" type="file"/>
                       </label>
                     </div>
                   </div>
                   <div id="enterId" class="tab-pane">
                     <div class="form-group form-inline">
                       <label for="pdbId">PDB code</label>
                       <input type="text" id="pdbId" placeholder="4X09" class="form-control"/>
                       <label for="pdbChain">Chain</label>
                       <input type="text" id="pdbChain" placeholder="A" class="form-control"/>
                       <button id="pdbIdSumbit" type="submit" class="btn btn-default">Submit</button>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>
        <script src="/javascripts/upload.js"></script>
    </jsp:body>
</t:layout>
