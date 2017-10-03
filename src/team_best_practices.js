$(document).ready(function() {
	var checkExist = setInterval(function() {
        if ($(".dashboard-role").length) {
            var user_key = $("#user_key").val();
			var user_role = $("#user_role" + user_key);
			$('.dashboard-role').each(function() {
				var role = $(this).val();
				var team = $(this).attr("id").replace("user_role", "");
				console.log("role: " + role + " team: " + team);
				//if(role == "Product Owner") {
					var addBestPracticesStories = '&nbsp;<a onclick="addBestPracticesStories(\'' + team + '\')" href="#">Add Best Practices Stories</a>';
					setTimeout(function() {
						if($("#best-practice-" + team).val() == 1) {
							$('span.user-backlog-' + team).append(addBestPracticesStories);
						}
					}, 2000);
				//}
			});

            clearInterval(checkExist);
        }
    }, 100);
});