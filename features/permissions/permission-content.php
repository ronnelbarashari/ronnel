<?php

	$output = "";
	/*$output = "<h3>View Users<img src='images/plus_icon.png' id='showusers' style='height: 19px;padding-left: 14px;'></h3>";
	$output .= "<div id=view_user_list  style='display: none;'>";
	$output .= "<ul id='users_list' >";
	$output .= "</ul>";
	$output .= "</div>";
	$output .= "</div>";
	$output .= "<h3>Add User Settings Permission<img src='images/plus_icon.png' id='addpermission' style='height: 19px;padding-left: 14px;'></h3>";	
	$output .= "<div id='settingspermission' style='display: none;'>";
	$output .= "<p>Select User : <select id='admin-select'></select></p>";	
	$output .= "<input id='create-recurring-button' type='button' class='add-permission' value='Set Admin Access'>";
	$output .= "<input id='create-recurring-button' type='button' class='remove-permission' value='Remove Access'>";
	$output .= "<h3 id='access_granted' style='visibility: hidden;'>User Access Saved!</h3>";
	$output .= "<h3 id='access_remove' style='visibility: hidden;'>User Access Remove!</h3>";
	$output .= "</div>";*/

	$output .= "<h3>Get Plugin Secret Key<img src='images/plus_icon.png' id='get_key' style='height: 19px;padding-left: 14px;'></h3>";

	$output .= "<div id='plugin_secret_key' style='display: none;'>";
	$output .= "<h6>Note: Entered email address on the Plugin should match the user's email who generated the secret key.</h3>";	
	$output .= "<p>Current Key : <input id='current_key' type='text' class='secret-key' value='' readonly></p>";
	$output .= "<input id='generate-key' type='button' class='rs-button generate-key-button' value='Generate Key'>";
	$output .= "</div>";


	$output .="<div id='secret-key-modal' class='modal-content delete-secret-key-modal' style='visibility: hidden;'>       
	<div class='modal-header'><h2>Generate New Secret Key</h2>       
	</div>		  
	<div class='secret-key-content'>		  
	<h4>Are you sure you want generate new Secret key? This will delete the previous one. All plugins that is using the old key will need to be updated with the new key.</h4>		  
	</div>
	<div class='modal-footer teams-footer'>    
	<div class='confirm-delete-teams'>    	  
	<button id='secret-key-yes' class='rs-button' onclick=''>Yes</button>    	 
	<button id='cancel-secret-key' class='rs-button'>Cancel</button>    </div></div></div>";
	
	echo $output;

?>