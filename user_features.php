<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>User Features</title>
    <?php
        include('templates/requiredscripts.php');
    ?>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script id="features" src="features/assets/best_practice_settings.js?v=<?php echo $GLOBALS['rsn_version'] ?>"></script>
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
        <div id="no_access_user_feature" style="display: none;"><center><h2>Sorry you have no access to this page<br>
        Contact your administrator to access this page</h2></center></div>
            <div id="can_access_user_feature" style="display: none;">
                <ul id="feature-list">
                    <li id="tab-feature"><a href="#tabs-features">Features</a></li>
                </ul>
                <div id="tabs-features" class="features-tab">
                    
                        <h2>User Features</h2>
                        <p>This is where users can manage features.</p>

                        <h3>Features</h3>
                        <fieldset id="fieldset">
                            <legend>Select features you want to enable: </legend>
                            <label class="admin user feature" id="lbl-bestpractice" for="chk-bestpractice">BEST PRACTICE USER STORIES</label>
                            <input class="admin feature" type="checkbox" name="chk-bestpractice" id="chk-bestpractice">
                        </fieldset>
                    </div>
            </div>
        </div>
    </div>
</body>
</html>