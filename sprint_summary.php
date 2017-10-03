<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Backlog Status</title>
    <?php
        include('templates/requiredscripts.php');
    ?>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link id="sprintsummary_style" rel="stylesheet" type="text/css" href="css/sprint_summary.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script id="sprint_summary" src="src/sprint_summary.js"></script>
</head>
<body>      
    <?php
        $key = $_REQUEST['key'];
    ?>
    <input type="hidden" id="selected_backlog" value="<?php echo $key; ?>">
    <div id="sprint_summary" class="main_screen">
        <?php
            include('templates/header.php');
        ?>
        <div id="summary_title"><h1>Backlog Status</h1></div>
        <!--<div id="summary_stories"></div>-->
        <div id="accordion">
          <h3>Product Backlog</h3>
          <div id="product_backlog">
          </div>
          <h3>Stories In Progress</h3>
          <div id="in_progress">
          </div>
          <h3>Completed Stories</h3>
          <div id="done">
          </div>
        </div>
    </div>
    <div class="summary_footer">&nbsp;</div>
</body>
</html>