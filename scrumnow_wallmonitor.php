<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Sprint Summary</title>
    <?php
        include('templates/requiredscripts.php');
    ?>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link id="backlogstatus_style" rel="stylesheet" type="text/css" href="css/wall_monitor.css?v=<?php echo $GLOBALS['rsn_version'] ?>">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script id="backlog_status" src="src/wall_monitor.js?v=<?php echo $GLOBALS['rsn_version'] ?>"></script>
</head>
<body>
    <div id="main-loading-container_wall_monitor" >
            <div id="loading-container" style="z-index: 111111 !important; display: block; margin-top: 100px;">
                <div id="circularG">
                    <div id="circularG_1" class="circularG"></div>
                    <div id="circularG_2" class="circularG"></div>
                    <div id="circularG_3" class="circularG"></div>
                    <div id="circularG_4" class="circularG"></div>
                    <div id="circularG_5" class="circularG"></div>
                    <div id="circularG_6" class="circularG"></div>
                    <div id="circularG_7" class="circularG"></div>
                    <div id="circularG_8" class="circularG"></div>
                </div>
            </div>
        </div>



    <?php
        $key = $_REQUEST['key'];
        $planningday = $_REQUEST['planning_day'];
    ?>

    

    <input type="hidden" id="selected_user" value="<?php echo $key; ?>">
    <input type="hidden" id="current_version" value="">
    <input type="hidden" id="planday" value="<?php echo $planningday; ?>">
    <input type="hidden" id="planday1">
    <div id="wallmonitor_status" class="main_screen">
        <?php
            include('templates/header.php');
        ?>
        <div id="wallmonitor_title"><h1>Wall Monitor</h1></div>
        <div id="wallmonitor_body">
          <div><ul><li><span>SPRINT START DATE:</span></li><li style="text-align: center;"><span class="wm_center"><input type="text" id="sprint_start_date_wallmonitor" ></input></span></li><li><span>SPRINT END DATE:</span></li><li><span class="wm_center"><input type="text" id="sprint_end_date_wallmonitor" readonly></input></span></li></ul></div>
          
          <div><ul><li><span>TODAYS DATE:</span></li><li class="wm_center"><span><input type="text" id="current_date" readonly></input></span></li></ul></div>
          <div id = "header"><ul><li><span>SPRINT TOTAL POINT:</span></li><li class="wm_center"><span id="total_points"></span></li><li class="wm_center"><span>PLANNING</span></li><li class="wm_center"><span>SPRINT</span></li><li class="wm_center"><span>CHECKLIST</span></li><li class="wm_center"><span>WALKTHROUGH</span></li></ul> </div>
          

        </div>
        
    </div>
    <div class="summary_footer">&nbsp;</div>
</body>
</html>