<?php

?>

<input type="hidden" id="team_edit_key" />
<div class="dashboard-section-title">
    MY SCRUM TEAMS &nbsp;&nbsp;
	<a class="dashboard-new" href="#" onclick="createNewTeam()">&lt;Create New&gt;</a>
</div>
<hr/>
<div class="dashboard-team-wrapper">
    <div class="dashboard-loading-animation" style="display:none;">
		<span>Loading teams...</span>
		<div id="loader">
		    <div id="loader_1" class="loader"></div>
		    <div id="loader_2" class="loader"></div>
		    <div id="loader_3" class="loader"></div>
		    <div id="loader_4" class="loader"></div>
		    <div id="loader_5" class="loader"></div>
		</div>
	</div>
	<div class="dashboard-team-single">
	</div>
</div>