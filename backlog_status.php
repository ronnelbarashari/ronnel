<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Sprint Summary</title>
    <?php
        include('templates/requiredscripts.php');
    ?>
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link id="backlogstatus_style" rel="stylesheet" type="text/css" href="css/backlog_status.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script id="backlog_status" src="src/backlog_status.js"></script>
</head>
<body>      
    <?php
        $key = $_REQUEST['key'];
    ?>
    <input id='contact' type='button' class='messagebtn' value='Send a message to your Product Owner'>
    <input type="hidden" id="selected_backlog" value="<?php echo $key; ?>">
    <input type="hidden" id="user_email" value="">
    <input type="hidden" id="current_version" value="">
    <div id="backlog_status" class="main_screen">
        <?php
            include('templates/header.php');
        ?>

        <div id="summary_title"><h1>Sprint Summary</h1></div>
         <div id='modal-body'>
            <div class="messagepop pop">
            <form method="POST">
                  <div><label id="messagepop_label">Subject</label><input type="text" name="subject" id="subject" onfocus="blankMessages()" /><div class="notif-subject">Subject is Required</div></div>
                  <div><label id="messagepop_label">Message</label><textarea id="message-content" onfocus="blankMessages()"></textarea><div class="notif-message">Message is Required</div><div class="notif-submit">Message Sent</div></div>
                  <input type="submit" value="Send Message" onclick="sendEmail()" id="send-message"/><input type="submit" value="Cancel" class="close-message" id="send-message"/>
              </form>
            </div>
        <div id="accordion">
          <h3>Product Backlog</h3>
          <div id="product_backlog">
          </div>
        </div>
        <div class="backlog_in_progress">
            <h2>In Progress</h2>
            <div id="accordion">
            <div id="summary_stories_in_progress" style="padding-left:0px !important;">
            </div>
            </div>
        </div>

        <div class="backlog_completed">
            <h2>Sprint Done</h2>
            <div id="summary_stories" style="padding-left:0px !important;">
            </div>
        </div>
            
    </div>
                      
    <div class="summary_footer">&nbsp;</div>
</body>
</html>