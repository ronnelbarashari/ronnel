<script type="text/javascript">
    /*var ua = navigator.userAgent;

//for detection of devices

    if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
       if (/OS [6-10.3](.*) like Mac OS X/i.test(navigator.userAgent)) {
          window.location.href = '../not_supported.php';
        } else{
            console.log("high version");
        }
      }else{
        console.log("you are using a desktop");
      }


    if( ua.indexOf("Android") >= 0 )
    {
      var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8)); 
      if (androidversion <= 2.3)
      {
          window.location.href = '../not_supported.php';
      }else{
        console.log("high version");
      }
    }else{
        console.log("you are using a desktop");
    }*/
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/iemobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }

    };
        if(isMobile.Windows())
        {
        window.location.href = '/not_supported.php';
        }

    function iOSversion() {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
      }
      console.log("My Version:", v);
      
    }

    ver = iOSversion();
    console.log("My Version Outside:", ver);
    if(ver == undefined){
    }
    else{
        if (ver[0] < 6) {
          window.location.href = '/not_supported.php';
        }
    }

</script>


<?php
    $GLOBALS['rsn_version'] = '136';
    $output = '
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <!-- Firebase libraries. -->
        <script src="https://www.gstatic.com/firebasejs/3.2.1/firebase.js"></script>
        <script src="https://www.gstatic.com/firebasejs/3.1.0/firebase-app.js"></script>
        <script src="https://www.gstatic.com/firebasejs/3.1.0/firebase-auth.js"></script>
        <script src="https://www.gstatic.com/firebasejs/3.1.0/firebase-database.js"></script>
        <!--Whole Draggable TR-->
        <style>
            td.dt-center-1 { position: absolute; text-align: left !important; width: 100%; padding-left: 38px !important; }
        </style>
        <!-- Our own libraries for the app.  -->
        <script id="misc" src="src/misc.js?v='.$GLOBALS['rsn_version'].'"></script>
        <script id="currentuser_team" src="src/currentuser_team.js?v='.$GLOBALS['rsn_version'].'"></script>
        <script id="global_vars" src="src/global_vars.js?v='.$GLOBALS['rsn_version'].'"></script>
        <script id="sprint_plannings" src="src/sprint_planning.js?v='.$GLOBALS['rsn_version'].'"></script>
        <script id="sprint_info" src="src/sprint_info.js?v='.$GLOBALS['rsn_version'].'"></script>
        <script id="user_settings" src="src/user_settings.js?v='.$GLOBALS['rsn_version'].'"></script>
        <!-- Datatables libraries and JQuery. Built with their single string tool for imports. -->
        <script type="text/javascript" src="https://cdn.datatables.net/v/dt/jq-2.2.3/jszip-2.5.0/pdfmake-0.1.18/dt-1.10.12/af-2.1.2/b-1.2.2/b-colvis-1.2.2/b-html5-1.2.2/b-print-1.2.2/r-2.1.0/rr-1.1.2/sc-1.4.2/se-1.2.0/datatables.min.js"></script>
        <script id="datatables" type="text/javascript" src="js/dataTables.editor.js"></script>
        <script src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js" integrity="sha256-eGE6blurk5sHj+rmkfsGYeKyZx3M4bG+ZlFyA7Kns7E=" crossorigin="anonymous"></script>
        <!-- The Cascading Style Sheets (CSS) that we need -->
        <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/jq-2.2.3/jszip-2.5.0/pdfmake-0.1.18/dt-1.10.12/af-2.1.2/b-1.2.2/b-colvis-1.2.2/b-html5-1.2.2/b-print-1.2.2/r-2.1.0/rr-1.1.2/sc-1.4.2/se-1.2.0/datatables.min.css" />
        <link rel="stylesheet" type="text/css" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" />


        <link id="" rel="stylesheet" type="text/css" href="css/my_styles.css?v='.$GLOBALS['rsn_version'].'" />
        <link id="" rel="stylesheet" type="text/css" href="css/recurring_stories.css?v='.$GLOBALS['rsn_version'].'" />
                <link id="" rel="stylesheet" type="text/css" href="css/bestpractice.css?v='.$GLOBALS['rsn_version'].'" />
        <link id="" rel="stylesheet" type="text/css" href="css/scenarios.css?v='.$GLOBALS['rsn_version'].'" />
        <link id="" rel="stylesheet" type="text/css" href="css/backlog_status.css?v='.$GLOBALS['rsn_version'].'" />
        <link id="" rel="stylesheet" type="text/css" href="css/backlog_summary.css?v='.$GLOBALS['rsn_version'].'" />
        <link id="" rel="stylesheet" type="text/css" href="css/sprint_status.css?v='.$GLOBALS['rsn_version'].'" />
        <link id="" rel="stylesheet" type="text/css" href="css/editor.dataTables.css?v='.$GLOBALS['rsn_version'].'" />

        <link id="mystyle" rel="stylesheet" type="text/css" href="css/my_styles.css?v='.$GLOBALS['rsn_version'].'" />
        <link id="recurringstyle" rel="stylesheet" type="text/css" href="css/recurring_stories.css?v='.$GLOBALS['rsn_version'].'" />
        <link id="scenariostyle" rel="stylesheet" type="text/css" href="css/scenarios.css?v='.$GLOBALS['rsn_version'].'" />
        <link id="backlogstatusstyle" rel="stylesheet" type="text/css" href="css/backlog_status.css?v='.$GLOBALS['rsn_version'].'" />
        <link id="backlogsummarystyle" rel="stylesheet" type="text/css" href="css/backlog_summary.css?v='.$GLOBALS['rsn_version'].'" />
        <link id="sprintstatusstyle" rel="stylesheet" type="text/css" href="css/sprint_status.css?v='.$GLOBALS['rsn_version'].'" />
        <link id="editor" rel="stylesheet" type="text/css" href="css/editor.dataTables.css" />

        
		<script>
        // Initialize Firebase
        //Portal Firebase
        //live
        var config = {
            apiKey: "AIzaSyBiI56s1qxAe8YNhEcfUI7ztmZgeQc0HNo",
            authDomain: "scrumnow-5060b.firebaseapp.com",
            databaseURL: "https://scrumnow-5060b.firebaseio.com",
            storageBucket: "scrumnow-5060b.appspot.com",
        };
        //staging

        /*var config = {
            apiKey: "AIzaSyC3z0W-n3gxHHDn23Gak7021MQxvREHe9s",
            authDomain: "rocketscrum.firebaseapp.com",
            databaseURL: "https://rocketscrum.firebaseio.com",
            storageBucket: "rocketscrum.appspot.com",
        };*/
        firebase.initializeApp(config);';
    /*$output .= "
        // Firebase variables to point to the database, a reference, and provider for auth.
        var database = firebase.database();
        var ref = database.ref('user_stories/');
        var maxref = database.ref('max');
        var userref = database.ref('user');
        //PJ/Benjoe 04102017 - Retrieving version of css
        var v_controller = database.ref('controller');
        var provider = new firebase.auth.GoogleAuthProvider();
        var results = [];
        var table;
        var editor;
        var user_name;";
	*/
    $output .= "
        $(document).ready(function(){
  			$(\"#loading-container\").css(\"display\", \"block\").css(\"margin-top\", \"100px\");
            firebase.auth().onAuthStateChanged(function(user)
            {
                if (user)
                {
                	var user_name = user.displayName + '! ';
                    $(\"#user_name\").html(user_name);
                }
            });
			$('.showDropdown').click( function(event){
                event.stopPropagation();
                $('#myDropdown').toggle(); 
                /*if($('#myDropdown').is(':visible')) {
                	$('#myDropdown').css('display', 'none');
                } else {
                	$('#myDropdown').css('display', 'block');
                }*/
            });
            $(document).click( function(){
                $('#myDropdown').hide();
                /*if($('#myDropdown').is(':visible')) {
                	$('#myDropdown').css('display', 'none');
                } else {
                	$('#myDropdown').css('display', 'block');
                }*/
            });
    	});";

	$output .= "</script>";
	echo $output;

?>