<?php

	$output = "<link rel='stylesheet' type='text/css' href='//fonts.googleapis.com/css?family=Open+Sans' />";
	$output .= "<script type='text/javascript' src='../src/header_scripts.js?v=".$GLOBALS['rsn_version']."'></script>";

	//for o365 signout
    $output .= '<script src="//secure.aadcdn.microsoftonline-p.com/lib/0.1.1/js/msal.min.js"></script>';
    $output .= '<script type="text/javascript" src="/src/msalconfig.js"></script>';
    $output .= '<script src="//cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js"></script>';
    $output .= '<script src="//cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js"></script>';
    $output .= '
    	<script type="text/javascript">
            var graphAPIMeEndpoint = "https://graph.microsoft.com/v1.0/me";
            var graphAPIScopes = ["https://graph.microsoft.com/user.read"];
            // Initialize application
            var userAgentApplication = new Msal.UserAgentApplication(msalconfig.clientID);
            // Set redirect URI
            userAgentApplication.redirectUri = msalconfig.redirectUri;
            function o365signOut() {
                userAgentApplication.logout();
            }
        </script>
    ';

	$output .= '<input id="user_permission" type="hidden" value="" />
	<div id="rs-top-header" class="">
					<div class="rs-container rs-clearfix">
						<div id="rs-et-secondary-menu" class="first-secondary">
							<ul id="rs-et-secondary-nav" class="rs-menu">
								<li class=""><a href="/user_dashboard.php" style="outline:none;text-decoration-line:unset;">Home</a>
								</li>
							</ul>
				        </div>

				        <div id="rs-et-secondary-menu">
				        	<ul id="rs-et-secondary-nav" class="rs-menu">
								<li>
								<span style="padding-right:5px" class="rs-welcome-logout">Welcome, <span id="user_name">User Name! </span>
								<div class="gear_click"><span class="icon icon-gear"></span></div></span>
								<div class="dropdown" style="display:block">
									<ul id="settingsli" style="list-style-type:none;padding-left: 0 !important; transition: 0.5s all cubic-bezier(0, 1.2, 1, 1); display: none;">
										<li class="rs_settings user_settings" id="role_settings" style="width:auto !important;"><a href="/user_settings.php">My Profile</a></li>
										<li class="rs_settings admin_settings" id="admin_settings" style="width:auto !important;"><a href="/admin_settings.php">Admin Settings</a></li>
										<li class="rs_settings user_features" id="user_features" style="width:auto !important;"><a href="/user_features.php">User Features</a></li>
										<li class="rs_settings log_out" style="width: auto !important;"><a href="#" onclick="googleSignout()">Signout</a></li>
									</ul>
								</div>
								</li>
							</ul>
				        </div>
					</div>
				</div>

				<input type="hidden" id="access" value="0">

				<header id="rs-main-header" class="" style="top: 33px;">
					<div class="rs-container rs-clearfix">
						<a href="/user_dashboard.php"><img src="/images/rocketscrum_updatedlogo.png" id="rs-logo" style="width: 90px !important; display: inline-block;float: left;margin-bottom: 0;vertical-align: middle; transition: all 0.4s ease-in-out; position: absolute; top: 50%; -webkit-transform: translateY(-50%);">
						</a>
							<div id="rs-et-top-navigation">
								<nav id="rs-top-menu-nav">
									<ul id="rs-top-menu" class="rs-nav"><li class=""><a href="" style="display:none;"></a></li></ul>				
								</nav>
							</div>
					</div> 
					<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
				</header>';
	$output .='<input id="selected_backlog" type="hidden" value="">';			
	echo $output;
?>