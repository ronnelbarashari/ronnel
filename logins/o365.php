<?php
	//add o365 login button
	$output = '
		<!-- 08022017 load jquery -->
        <style>
            #firebaseui-auth-container > div > div > form > ul > li:nth-child(5) > .firebaseui-idp-password[disabled] {
                background-color: #db4437;
            }
        </style>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<script src="//secure.aadcdn.microsoftonline-p.com/lib/0.1.1/js/msal.min.js"></script>
		<script type="text/javascript" src="/src/msalconfig.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js"></script>
		<script type="text/javascript">
			/*var config = {
                apiKey: "AIzaSyBiI56s1qxAe8YNhEcfUI7ztmZgeQc0HNo",
                authDomain: "scrumnow-5060b.firebaseapp.com",
                databaseURL: "https://scrumnow-5060b.firebaseio.com",
                projectId: "scrumnow-5060b",
                storageBucket: "scrumnow-5060b.appspot.com",
                messagingSenderId: "728443483960"
            };
            firebase.initializeApp(config);*/

			//08012017 - append login with office 365 button
			$(document).ready(function() {
				var o365button = \'<li class="firebaseui-list-item"><button id="login-office365" class="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-idp-password firebaseui-id-idp-button " style="background-color: #2872dd;" onclick="callGraphAPI()"><img class="firebaseui-idp-icon" src="/images/o365_logo.png"><span class="firebaseui-idp-text firebaseui-idp-text-long">Sign in with Office 365</span><span class="firebaseui-idp-text firebaseui-idp-text-short">Office365</span></button></li>\';
                //Junna logo coming soon
                var comSoonLogo=\'<li class="firebaseui-list-item"><div id="divComSoon">(Coming Soon)<br><img src="images/icon-login/fb-icon.png"><img src="images/icon-login/twitter-icon.png"><img src="images/icon-login/github-icon.png"><img src="images/icon-login/mail-icon.png"></div>\';
                var hiddeninputs = \'<input type="hidden" id="userIdentifier" value="" /><input type="hidden" id="emailAddress" value="" /><input type="hidden" id="userName" value="" /><input type="hidden" id="identityProvider" value="" /></li>\';
               
                    var checkExist = setInterval(function() {
                        if ($("ul.firebaseui-idp-list").length) {
                            console.log("Exists!");
                            $("ul.firebaseui-idp-list").append(o365button);
                            $("ul.firebaseui-idp-list").append(comSoonLogo);

                            $("#firebaseui-auth-container > div > div > form > ul > li:nth-child(5) > button").attr("disabled", true);
                            $("#login_body").after(hiddeninputs);

                            clearInterval(checkExist);
                        }
                    }, 100);
			});
		</script>';

	//azure ad authentication
	$output .= '
		<script type="text/javascript">

            var graphAPIMeEndpoint = "https://graph.microsoft.com/v1.0/me";
            var graphAPIScopes = ["https://graph.microsoft.com/user.read"];

            // Initialize application
            var userAgentApplication = new Msal.UserAgentApplication(msalconfig.clientID);

            // Set redirect URI
            userAgentApplication.redirectUri = msalconfig.redirectUri;

            displayUserInfo();

            function displayUserInfo() {
                var user = userAgentApplication.getUser();
                if (user) {
                    $("#emailAddress").val(user.displayableId);
                    $("#userName").val(user.name);
                    $("#identityProvider").val(user.identityProvider);
                    $("#userIdentifier").val(user.userIdentifier.substring(0, 36));

                    if($("#userIdentifier").val() != "" && $("#userIdentifier").val() !== undefined) {
                        var a = 1;
                        console.log("Office 365 authentication");
                        //create custom Firebase token
                        $.ajax({
                            type: "POST",
                            url: "createcustomtoken.php",
                            data: {uid : $("#userIdentifier").val() },
                            success: function(result){
                                if(result != "") {
                                    // Display the user info
                                    console.log("Custom Token: " + result);
                                    var token = result;
                                    var backlogs = "";

                                    firebase.auth().signInWithCustomToken(token)
                                        .then(function(token) {
                                            var user = firebase.auth().currentUser;
                                            user.updateEmail($("#emailAddress").val()).then(function() {
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
                                            }, function(error) {
                                              // An error happened.
                                              console.log("Error: " + error);
                                            });
                                         })
                                        .catch(function(error) {
                                            var errorCode = error.code;
                                            var errorMessage = error.message;
                                            console.log(errorCode + ": " + errorMessage);
                                    });
                                }           
                            }
                        });
                    }
                }
            }

            function callGraphAPI() {
                if (userAgentApplication.getAllUsers().length === 0) {
                    userAgentApplication.loginPopup()
                        .then(function (token) {
                            console.log(token);
                            displayUserInfo();
                            callGraphAPI();
                        }, function (error) {
                            showError("login", error, document.getElementById("errorMessage"));
                        });
                } else {
                    //no need for further authentication since we are not accessing Microsoft APIs
                    displayUserInfo();
                }
            }

            function callWebApiWithScope(endpoint, scope, responseElement, errorElement, showTokenElement) {
                userAgentApplication.acquireTokenSilent(scope)
                    .then(function (token) {
                        callWebApiWithToken(endpoint, token, responseElement, errorElement, showTokenElement);
                    }, function (error) {
                        if (error.indexOf("interaction_required" !== -1)) {
                            userAgentApplication.acquireTokenPopup(scope).then(function(token) {
                                    callWebApiWithToken(endpoint, token, responseElement, errorElement, showTokenElement);
                                },
                                function(error) {
                                    showError(endpoint, error, errorElement);
                                });
                        } else {
                            showError(endpoint, error, errorElement);
                        }
                    });
            }

            function showAPIResponse(data, token, responseElement, showTokenElement) {
                console.log(data);
            }

            function showError(endpoint, error, errorElement) {
                console.error(error);
                var formattedError = JSON.stringify(error, null, 4);
                if (formattedError.length < 3) {
                    formattedError = error;
                }
                //errorElement.innerHTML = "Error calling " + endpoint + ": " + formattedError;
            }

            function callWebApiWithToken(endpoint, token, responseElement, errorElement, showTokenElement) {
                var headers = new Headers();
                console.log("Token: " + token);
                var bearer = "Bearer " + token;
                headers.append("Authorization", bearer);
                var options = {
                    method: "GET",
                    headers: headers
                };

                // Note that fetch API is not available in all browsers
                fetch(endpoint, options)
                    .then(function (response) {
                        var contentType = response.headers.get("content-type");
                        if (response.status === 200 && contentType && contentType.indexOf("application/json") !== -1) {
                            response.json()
                                .then(function (data) {
                                    // Display response in the page
                                    showAPIResponse(data, token, responseElement, showTokenElement);
                                })
                                .catch(function (error) {
                                    showError(endpoint, error, errorElement);
                                });
                        } else {
                            response.json()
                                .then(function (data) {
                                    // Display response in the page
                                    showError(endpoint, data, errorElement);
                                })
                                .catch(function (error) {
                                    showError(endpoint, error, errorElement);
                                });
                        }
                    })
                    .catch(function (error) {
                        showError(endpoint, error, errorElement);
                    });
            }

            function signOut() {
                userAgentApplication.logout();
            }
        </script>';

	echo $output;
?>