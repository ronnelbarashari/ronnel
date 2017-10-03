<!DOCTYPE html>
<html>
    <head>
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
        <title>Office 365 Authentication</title>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    </head>
    <body style="margin: 40px">
        <input type="hidden" id="userIdentifier" value="" />
        <input type="hidden" id="emailAddress" value="" />
        <input type="hidden" id="userName" value="" />
        <input type="hidden" id="identityProvider" value="" />
        <button id="callGraphButton" type="button" class="btn btn-primary" onclick="callGraphAPI()">Login with Office 365</button>
        <div id="errorMessage" class="text-danger"></div>
        <div class="hidden">
            <h3>Graph API Call Response</h3>
            <pre class="well" id="graphResponse"></pre>
        </div>
        <div class="hidden">
            <h3>Access Token</h3>
            <pre class="well" id="accessToken"></pre>
        </div>
        <div class="hidden">
            <h3>Office 365 ID Token Claims</h3>
            <pre class="well" id="userInfo"></pre>
        </div>

        <div class="hidden">
            <h3>Firebase Backlogs</h3>
            <pre class="well" id="firebaseInfo"></pre>
        </div>

        <button id="signOutButton" type="button" class="btn btn-primary hidden" onclick="signOut()">Sign out</button>

        <script src="//secure.aadcdn.microsoftonline-p.com/lib/0.1.1/js/msal.min.js"></script>
        <script type="text/javascript" src="msalconfig.js"></script>

        <!-- The 'bluebird' and 'fetch' references below are required if you need to run this application on Internet Explorer -->
        <script src="//cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js"></script>

        <script src="https://www.gstatic.com/firebasejs/4.1.3/firebase.js"></script>
        <script>
            // Initialize Firebase
            var config = {
                apiKey: "AIzaSyBiI56s1qxAe8YNhEcfUI7ztmZgeQc0HNo",
                authDomain: "scrumnow-5060b.firebaseapp.com",
                databaseURL: "https://scrumnow-5060b.firebaseio.com",
                projectId: "scrumnow-5060b",
                storageBucket: "scrumnow-5060b.appspot.com",
                messagingSenderId: "728443483960"
            };
            firebase.initializeApp(config);
        </script>
        
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
                    // Display the user info
                    var userInfoElement = document.getElementById("userInfo");
                    userInfoElement.parentElement.classList.remove("hidden");
                    userInfoElement.innerHTML = JSON.stringify(user, null, 4);

                    $("#callGraphButton").html("Logged In... Getting backlog data from Firebase...");
                    $("#callGraphButton").prop('disabled', 'true');

                    $("#emailAddress").val(user.displayableId);
                    $("#userName").val(user.name);
                    $("#identityProvider").val(user.identityProvider);
                    $("#userIdentifier").val(user.userIdentifier.substring(0, 36));

                    if($("#userIdentifier").val() != "" && $("#userIdentifier").val() !== undefined) {
                        //create custom Firebase token
                        $.ajax({
                            type: "POST",
                            url: "createcustomtoken.php",
                            data: {uid : $("#userIdentifier").val() },
                            success: function(result){
                                if(result != "") {
                                    // Display the user info
                                    console.log('Custom Token: ' + result);
                                    var token = result;
                                    var backlogs = "";

                                    firebase.auth().signInWithCustomToken(token)
                                        .then(function(token) {
                                            var user = firebase.auth().currentUser;
                                            user.updateEmail($("#emailAddress").val()).then(function() {
                                                user.updateProfile({
                                                  displayName: $("#userName").val()
                                                }).then(function() {
                                                    // Update successful.
                                                    var database = firebase.database();
                                                    var ref = database.ref('backlogs/');
                                                    ref.once('value').then(function(snapshot) {
                                                        snapshot.forEach(function(childSnapshot) {
                                                            var key = childSnapshot.key;
                                                            var child_data = childSnapshot.val();
                                                            if(child_data.status != "archive") {
                                                                if(backlogs == "") {
                                                                    backlogs = child_data.title;
                                                                } else {
                                                                    backlogs += '<br/>' + child_data.title;
                                                                }
                                                            }
                                                        });

                                                        var firebaseInfoElement = document.getElementById("firebaseInfo");
                                                        firebaseInfoElement.parentElement.classList.remove("hidden");
                                                        firebaseInfoElement.innerHTML = backlogs;

                                                        $("#callGraphButton").html("Logged In");
                                                    });
                                                }, function(error) {
                                                  // An error happened.
                                                });
                                            }, function(error) {
                                              // An error happened.
                                              console.log('Error: ' + error);
                                            });
                                         })
                                        .catch(function(error) {
                                            var errorCode = error.code;
                                            var errorMessage = error.message;
                                            console.log(errorCode + ': ' + errorMessage);
                                    });
                                }           
                            }
                        });
                    }

                    // Show Sign-Out button
                    document.getElementById("signOutButton").classList.remove("hidden");
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
                    //no need for further authentication since we're not accessing Microsoft APIs
                    /*
                    var responseElement = document.getElementById("graphResponse");
                    responseElement.parentElement.classList.remove("hidden");
                    responseElement.innerText = "Calling Graph ...";
                    callWebApiWithScope(graphAPIMeEndpoint,
                        graphAPIScopes,
                        responseElement,
                        document.getElementById("errorMessage"),
                        document.getElementById("accessToken"));
                    */
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
                responseElement.innerHTML = JSON.stringify(data, null, 4);
                if (showTokenElement) {
                    showTokenElement.parentElement.classList.remove("hidden");
                    showTokenElement.innerHTML = token;
                }
            }

            function showError(endpoint, error, errorElement) {
                console.error(error);
                var formattedError = JSON.stringify(error, null, 4);
                if (formattedError.length < 3) {
                    formattedError = error;
                }
                errorElement.innerHTML = "Error calling " + endpoint + ": " + formattedError;
            }

            function callWebApiWithToken(endpoint, token, responseElement, errorElement, showTokenElement) {
                var headers = new Headers();
                console.log('Token: ' + token);
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
        </script>
    </body>
</html>