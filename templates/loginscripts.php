<?php

	$output = "";
	$output .= '
		<script src="https://www.gstatic.com/firebasejs/3.3.2/firebase.js"></script>
	    <script>
	        // Initialize Firebase
	        //Live Firebase
	        var config = {
	            apiKey: "AIzaSyBiI56s1qxAe8YNhEcfUI7ztmZgeQc0HNo",
	            authDomain: "scrumnow-5060b.firebaseapp.com",
	            databaseURL: "https://scrumnow-5060b.firebaseio.com",
	            storageBucket: "scrumnow-5060b.appspot.com",
	        };
	        //Portal Firebase
	        
	        /*var config = {
	            apiKey: "AIzaSyC3z0W-n3gxHHDn23Gak7021MQxvREHe9s",
	            authDomain: "rocketscrum.firebaseapp.com",
	            databaseURL: "https://rocketscrum.firebaseio.com",
	            storageBucket: "rocketscrum.appspot.com",
	        };*/
	        firebase.initializeApp(config);
	    </script>';
	$output .= '
		<script src="https://www.gstatic.com/firebasejs/ui/live/0.5/firebase-ui-auth.js"></script>
	    <link type="text/css" rel="stylesheet" href="https://www.gstatic.com/firebasejs/ui/live/0.5/firebase-ui-auth.css" />
	    <script type="text/javascript">
	        // FirebaseUI config.
	        var uiConfig = {
	            "signInSuccessUrl": "dashboard.php",
	            "signInOptions": [
	                // Leave the lines as is for the providers you want to offer your users.
	                firebase.auth.GoogleAuthProvider.PROVIDER_ID
	                //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
	                //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
	                //firebase.auth.GithubAuthProvider.PROVIDER_ID,
	                //firebase.auth.EmailAuthProvider.PROVIDER_ID
	            ],
	            // Terms of service url.
	            "tosUrl": "<your-tos-url>",
	        };

	        // Initialize the FirebaseUI Widget using Firebase.
	        var ui = new firebaseui.auth.AuthUI(firebase.auth());	
	        //Johann/Japs Sprint 10 keep google signed in and redirect to homepage.
	        console.log(ui);
	        firebase.auth().onAuthStateChanged(function(user) {
	            if (user) {
	                console.log("Signed in.");
	                //added 08032017 to update display name for o365 authentication
	                if($("#userName").val() != "" && $("#userIdentifier").val()) {
	                	user.updateProfile({
                          displayName: $("#userName").val()
                        }).then(function() {
                        	//Update user\'s display name on Firebase node
                        	var database = firebase.database();
							var users = database.ref("user");

							users.once("value").then(function(snapshot) {
						        snapshot.forEach(function(childSnapshot) {
						            var key = childSnapshot.key;
						            var child_data = childSnapshot.val();

						            var dispname = $("#userName").val();
						            var email = $("#emailAddress").val();
						            if(child_data.email == $("#emailAddress").val()) {
						            	var ref = database.ref("user/" + key);
						            	ref.update({
						            		displayname: dispname,
						            		email: email
						            	});
						            }  
						        });
						        // Update successful.
                            	window.location = "/user_dashboard.php";
						    });

                            
                        }, function(error) {
                          // An error happened.
                        });
	                } else {
	                	window.location = "/user_dashboard.php";
	                }
	            } else {
	                console.log("Signed out.");
	                document.getElementById("login_body").style.display="block";
	            }
	        });
	        // The start method will wait until the DOM is loaded.
	        ui.start("#firebaseui-auth-container", uiConfig);
	    </script>';

	echo $output;

?>