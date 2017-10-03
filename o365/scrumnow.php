<!DOCTYPE html>
<html>
    <head>
        <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
        <title>JavaScript SPA Guided Setup</title>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
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

			var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJvMzY1YXV0aEBzY3J1bW5vdy01MDYwYi5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6Im8zNjVhdXRoQHNjcnVtbm93LTUwNjBiLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwiYXVkIjoiaHR0cHM6XC9cL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbVwvZ29vZ2xlLmlkZW50aXR5LmlkZW50aXR5dG9vbGtpdC52MS5JZGVudGl0eVRvb2xraXQiLCJpYXQiOjE1MDA0ODIzNTgsImV4cCI6MTUwMDQ4NTk1OCwidWlkIjoiMTAwMzdGRkU5M0JBREEzMCIsImNsYWltcyI6eyJwcmVtaXVtX2FjY291bnQiOiIxMDAzN0ZGRTkzQkFEQTMwIn19.ZfyrOabsVwR74PNonGm0w1YWPn9GUGhGDub4zK1CABq61ZM_9TIBi1XnwZjSgNgTCpX-80-JRqnJL0jKLw-4JuWKB8XXNB8qq0p0P-VuR4t4X6YIN1fz60cgqwzrtIJyptSKVgSRYEOzmNgrAaf0l0N92m28hRtFlBnRH5NOV0wwGRhmlBsVpw1C70HWojuW5bZuH-d7DNEglqQvmaIHeOebykNhk53od2tMnruW5xDiBdrim-jZpMtgyLku0cxBFnZ5QDsxn-UW4PN0vT6Zn20LhmvCmYefpwnlCqoRLbwUZ-Jnpc0ZMzowMpHYFzowAD--xJEbiH4K4_o50EzbOQ';
			firebase.auth().signInWithCustomToken(token)
				.then(function(token) {
				    // Send token back to client
				    console.log('Authenticated: ' + token);

				    var user = firebase.auth().currentUser;
				    user.updateEmail("portaldev@o365fordummies.com").then(function() {
					  // Update successful.
					}, function(error) {
					  // An error happened.
					});

					user.updateProfile({
					  provider: "Office 365",
					  displayName: "Portal Developer"
					}).then(function() {
					  // Update successful.
					}, function(error) {
					  // An error happened.
					});

				 })
				.catch(function(error) {
					var errorCode = error.code;
			  		var errorMessage = error.message;
			  		console.log(errorCode + ': ' + errorMessage);
			});
		</script>
    </head>
    <body style="margin: 40px">
    </body>
</html>
