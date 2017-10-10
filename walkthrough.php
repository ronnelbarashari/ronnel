<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Sprint Walkthrough</title>
    <?php
        include('templates/requiredscripts.php');
    ?>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link id="mystyle" rel="stylesheet" type="text/css" href="css/walkthrough.css?v=<?php echo $GLOBALS['rsn_version'] ?>">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script type='text/javascript' src='src/authentication.js?v=<?php echo $GLOBALS['rsn_version'] ?>'></script>
    <script id="walkthrough" src="src/walkthrough.js?v=<?php echo $GLOBALS['rsn_version'] ?>"></script>
  
<script src="ForTemplates/FileSaver.js"></script>
<script src="ForTemplates/html-docx.js"></script>

<script src="ForTemplates/docxtemplater-latest.js"></script>
<script src="ForTemplates/jszip.js"></script>
<script src="ForTemplates/file-saver.min.js"></script>
<script src="ForTemplates/jszip-utils.js"></script>

</head>
<body>      
    <?php
        include('templates/header.php');
    ?>
    <center><h2 id="no_access" style="display:none;padding-top:147px !important;width:90% !important;margin:0 auto !important;">Sorry you have no access to this page<br>
        Contact your administrator to access this page</h2></center>
        <div id="can_access" style="display:none">
        <div id="walkthrough" class="main_screen" style="padding-top:147px !important;width:90% !important;margin:0 auto !important;">
            <div id="summary_title" style="padding-left:0px !important;"><h1>Sprint Walkthrough</h1></div>
            <input type="hidden" id="sprintwalkthrough" value="">
            <input type="hidden" id="user_key" value="">
            <div id="summary_stories" style="padding-left:0px !important;">
            </div>
        </div>
        <div class="summary_footer">&nbsp;</div>
    </div>
</body>
</html>dsfgdfgsdfg