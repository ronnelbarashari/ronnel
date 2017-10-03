<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>ScrumNow</title>
    <?php
        include('templates/requiredscripts.php');
    ?>
    <script id="dashboard" src="src/dashboard.js?v=<?php echo $GLOBALS['rsn_version'] ?>"></script>

      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <!--Import materialize.css-->
      <link type="text/css" rel="stylesheet" href="css/materialize.min.css"  media="screen,projection"/>

      <!--Let browser know website is optimized for mobile-->
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

      <!--<link rel="stylesheet" type="text/css" href="css/style4.css" />
      <script src="js/modernizr.custom.63321.js"></script>
      <script type="text/javascript" src="js/jquery.dropdown.js"></script>!-->

</head>

<body class='home'>    
      <script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
      <script type="text/javascript" src="js/materialize.min.js"></script>
<div id="main-loading-container">
            <div id="loading-container" style="z-index: 111111 !important">
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
    <div id="main_screen" class="main_screen" style="display:none">
        <?php
            include('templates/header.php');
        ?>
    </div>

    <div class="container dashboard_no_access" style="display: none;">

        <center><h4 id="no_backlog">Sorry you have no access to this page<br>
        Please sign in or contact the Administrator to have permission.</h4><br>
        <a href="#" onclick="returntologin()" style="color:white"><button class="btn waves-effect waves-light" type="submit" name="action" style="background-color: #c86e1c;">Sign in to Rocket Scrum
          <i class="material-icons right">send</i></a>
        </button></center>

    </div>

<div class="container container-dashboard" style="width: 45% !important;">
<h2 class="header">Rocket Scrum Dashboard</h2>
<ul class="collection">

              <li class="collection-item avatar">
                <a href="#" onclick="viewbacklogs()"><i class="material-icons circle orange">folder_open</i>
                <span class="title">Open Backlogs</span>
                <p>Open backlogs modal and choose backlog to be open<br>
                </p>

              </a></li>
              <li class="collection-item avatar">
                <a href="#" onclick="viewmonitor()"><i class="material-icons circle green">computer</i>
                <span class="title">Wall Monitor View</span>
                <p>Open the wall monitor view page to see all backlogs and current sprint<br>
                </p>

              </a></li>
              <li class="collection-item avatar">
                <a href="#" onclick="viewsummary()"><i class="material-icons circle red">content_paste</i>
                <span class="title">Backlog Summary</span>
                <p>Open Backlog Summary page to see on going stories<br>
                </p>

              </a></li>
              <li class="collection-item avatar">
                <a href="#" onclick="viewmyteams()"><i class="material-icons circle medium">group</i>
                <span class="title">View Teams</span>
                <p>Open teams modal to view current team<br>
                </p>

              </a></li>
            </ul>


</div>

    <div id="modal1" class="modal" style="background-color: rgba(0, 0, 0, 0.42); width: 100% !important; padding-bottom: 100%;" >
        <div class="modal-content" style="margin-top: 12%">
          

             <nav>
                <div class="nav-wrapper" style="background-color: #c66c1b;padding: 0 20px 0 20px;">
                  <a class="brand-logo" style="width: 79% !important; font-size: 1.9vw;">Select a backlog</a>
                  <ul class="right hide-on-med-and-down">
                    <li></li>
                    <li><a href="#" onclick="close_this_modal()"><i class="material-icons">close</i></a></li>
                  </ul>
                </div>
              </nav>  


          <p>Please Select a backlog: </p>
          <p><select id="user-backlogs" style="display: block;"></select></p>
          <button class="btn waves-effect waves-light" type="submit" name="action" onclick="proceed()" style="background-color: #c66d1b;">Proceed
            <i class="material-icons right">send</i>
          </button>
        </div>
    </div>

    <div id="modal2" class="modal" style="background-color: rgba(0, 0, 0, 0.42); width: 100% !important; padding-bottom: 100%;" >
        <div class="modal-content" style="margin-top: 12%">

               <nav>
                <div class="nav-wrapper" style="background-color: #c66c1b;padding: 0 20px 0 20px;">
                  <a class="brand-logo" style="width: 79% !important; font-size: 1.9vw;">Team</a>
                  <ul class="right hide-on-med-and-down">
                    <li></li>
                    <li><a href="#" onclick="close_dashboard_team()"><i class="material-icons">close</i></a></li>
                  </ul>
                </div>
              </nav>  

          <p>You are currently member of this team/s</p>
          <p><table id='dashboard_teams'>
                <tr>
                    <h3>
                        <center>
                            <td id='heads'></td>
                        </center>
                    </h3>
                </tr>
            </table>
          </p>
        </div>
    </div>
<!--<div class="container">
<div class="first" onclick="viewmyteams()"><img src = "/rocketscrum/images/myteam-icon.png" style="height: 100%; width: 100%;" class="teams-view">
    <div class="middle">
       <div class="view-team-text">View Teams</div>
    </div>
</div>
<div class="third" onclick="viewmonitor()"><img src = "/rocketscrum/images/wall-icon.png" style="height: 100%; width: 100%;" class="wall-view">
    <div class="wall">
       <div class="view-wall-text">Wall Monitor View</div>
    </div>
</div>
<div class="second" onclick="viewbacklogs()"><img src = "/rocketscrum/images/backlogs-icon.png" style="height: 100%; width: 100%;" class="backlog-view">
    <div class="backlog">
       <div class="view-backlog-text">Open Backlogs</div>
    </div>
</div>
<div class="fourth" onclick="viewsummary()"><img src = "/rocketscrum/images/summary-icon.png" style="height: 100%; width: 100%;" class="summary-view">
    <div class="summary">
       <div class="view-summary-text">Backlog Summary</div>
    </div>
</div>
<div class="last" onclick="viewsettings()"><img src = "/rocketscrum/images/dashboardsettings-icon.png" style="height: 100%; width: 100%;" class="settings-view">
    <div class="settings">
       <div class="view-settings-text">Settings</div>
    </div>   
</div>

<div class="dashboardtext"><span>Rocket Scrum Dashboard</span></div>
</div>!-->




<input type="hidden" id="user_key" value="">

</body>

</html>
