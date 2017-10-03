<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Admin Settings</title>
    <?php
        include('templates/requiredscripts.php');
    ?>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script id="features" src="features/assets/features.js?v=<?php echo $GLOBALS['rsn_version'] ?>"></script>
    <script type='text/javascript' src='src/authentication.js?v=<?php echo $GLOBALS['rsn_version'] ?>'></script>
    <style>
        .features-tab{padding-bottom:50px !important;}
    </style>
</head>
<body>      
    <input type="hidden" id="current_version" value="<?php echo $GLOBALS['rsn_version'] ?>">
    <input type="hidden" id="user_key" value="">
    <div id="main_screen" class="main_screen">
        <?php
            include('templates/header.php');
        ?>
        <div id="script-container">

        </div>

        <div id="tabs" style="display:block;content:'';clear:both;padding-top:120px;">
        <div id="no_access" style="display: none;"><center><h2>Sorry you have no access to this page<br>
        Contact your administrator to access this page</h2></center></div>
            <div id="can_access" style="display: none;">
                <ul id="feature-list">
                    <li id="tab-feature"><a href="#tabs-features">Features</a></li>
                </ul>
                <div id="tabs-features" class="features-tab">
                    
                        <h2>Admin Settings</h2>
                        <p>This is where admins can manage backlogs or add features.</p>

                        <h3>Features</h3>
                        <fieldset id="fieldset">
                            <legend>Select features you want to enable: </legend>
                            <label id="lbl-scenarios" for="chk-scenarios">REUSABLE EPICS</label>
                            <input type="checkbox" name="chk-scenarios" id="chk-scenarios">
                            <label id="lbl-recurring" for="chk-recurring">RECURRING STORIES</label>
                            <input type="checkbox" name="chk-recurring" id="chk-recurring">
                            <label id="lbl-violations" for="chk-violations">SCRUM VIOLATIONS</label>
                            <input type="checkbox" name="chk-violations" id="chk-violations">
                            <label id="lbl-permission" for="chk-permission">PLUGIN PERMISSION</label>
                            <input type="checkbox" name="chk-permission" id="chk-permission">
                            <label id="lbl-backlogs" style="display:none" for="chk-backlogs">BACKLOGS</label>
                            <input type="checkbox" name="chk-backlogs" id="chk-backlogs">
                            <label id="lbl-pointsdefinition" for="chk-pointsdefinition">POINTS DESCRIPTION</label>
                            <input type="checkbox" name="chk-pointsdefinition" id="chk-pointsdefinition">
                           <!-- <label id="lbl-teams" for="chk-teams">MANAGE TEAMS / PERMISSIONS</label>
                            <input type="checkbox" name="chk-teams" id="chk-teams"> -->
                        </fieldset>
                    </div>
            </div>
        </div>
    </div>
</body>
</html>