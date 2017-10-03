<!DOCTYPE html>
<html>
<head>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js"></script>
<!--<script type='text/javascript' src='src/authentication.js'></script>-->
    <meta charset="utf-8">
    <title>My Profile</title>
    <?php
        include('templates/requiredscripts.php');
    ?>
    <!--<script>
        $(document).ready(function(){
            $("#pobutton").click(function(){
                    $( "#productowner" ).toggle( "slow", function() {
                        if($('#productowner').css('display')=='none'){
                            $("#pobutton").attr('src',"images/plus_icon.png");
                        }else{
                            $("#pobutton").attr('src',"images/minus_icon.png");
                        }
                    });
                    $('#scrummaster').hide(500);
                    $('#devteam').hide(500);
                    $("#pobutton").attr('src',"images/minus_icon.png");
                    $("#smbutton").attr('src',"images/plus_icon.png");
                    $("#tmbutton").attr('src',"images/plus_icon.png");

            });
            $("#smbutton").click(function(){
                    $( "#scrummaster" ).toggle( "slow", function() {
                        if($('#scrummaster').css('display')=='none'){
                            $("#smbutton").attr('src',"images/plus_icon.png");
                        }else{
                            $("#smbutton").attr('src',"images/minus_icon.png");
                        }
                    });
                    $('#productowner').hide(500);
                    $('#devteam').hide(500);
                    $("#smbutton").attr('src',"images/minus_icon.png");
                    $("#pobutton").attr('src',"images/plus_icon.png");
                    $("#tmbutton").attr('src',"images/plus_icon.png");

            });
            $("#tmbutton").click(function(){
                    $( "#devteam" ).toggle( "slow", function() {
                        if($('#devteam').css('display')=='none'){
                            $("#tmbutton").attr('src',"images/plus_icon.png");
                        }else{
                            $("#tmbutton").attr('src',"images/minus_icon.png");
                        }
                    });
                    $('#scrummaster').hide(500);
                    $('#productowner').hide(500);
                    $("#tmbutton").attr('src',"images/minus_icon.png");
                    $("#pobutton").attr('src',"images/plus_icon.png");
                    $("#smbutton").attr('src',"images/plus_icon.png");

            });
        });

    </script>-->
</head>
<body>      
    <div id="main_screen" class="main_screen">
        <?php
            include('templates/header.php');
        ?>


        <div id="userSettings" style="padding:130px;">
        <div id="no_access" style="display: none;"><center><h2>Sorry you have no access to this page<br>
        Contact your administrator to access this page</h2></center></div>

        <div id="can_access" style="">
            <h2>My Profile</h2>
            <h4 style="color: blue">Profile Picture (coming soon)</h4>

            <!--<div class="settings_label">User role: </div>

            <div class="settings_options">
                <input type="checkbox" name="user_role" value="Product Owner" class="po" id="checkboxId"> Product Owner<br>
                <input type="checkbox" name="user_role" value="Scrum Master" class="sm" id="checkboxId"> Scrum Master<br>
                <input type="checkbox" name="user_role" value="Team Member" class="tm" id="checkboxId"> Team Member<br>
            </div>-->

            <!--<div>
                <div>
                    <div class="roundedOne" id="po_box">
                      <input type="checkbox" name="user_role" value="Product Owner" class="po" />
                      <label for="roundedOne"></label>
                    </div>
                    <div class="p_position"><p>Product Owner<img src="images/plus_icon.png" style="height: 20px; padding-left: 20px; transform: translateY(5px);" id="pobutton"></p></div>
                    <div style="display: none;" id="productowner">
                    <p>The Product Owner is responsible for maximizing the value of the product and the work of the Development Team. How this is done may vary widely across organizations, Scrum Teams, and individuals.</p>
                    <p>The Product Owner is the sole person responsible for managing the Product Backlog. Product Backlog management includes:</p>
                    <ul>
                        <li>Clearly expressing Product Backlog items;</li>
                        <li>Ordering the items in the Product Backlog to best achieve goals and missions;</li>
                        <li>Optimizing the value of the work the Development Team performs;</li>
                        <li>Ensuring that the Product Backlog is visible, transparent, and clear to all, and shows what the Scrum Team will work on next; and,</li>
                        <li>Ensuring the Development Team understands items in the Product Backlog to the level needed.</li>
                    </ul>
                    <p>The Product Owner may do the above work, or have the Development Team do it. However, the Product Owner remains accountable.</p>
                    <p>The Product Owner is one person, not a committee. The Product Owner may represent the desires of a committee in the Product Backlog, but those wanting to change a Product Backlog item’s priority must address the Product Owner.</p>
                    <p>For the Product Owner to succeed, the entire organization must respect his or her decisions. The Product Owner’s decisions are visible in the content and ordering of the Product Backlog. No one is allowed to tell the Development Team to work from a different set of requirements, and the Development Team isn’t allowed to act on what anyone else says.</p>
                    </div>
                </div>

                <div>
                    <div class="roundedOne" id="sm_box">
                      <input type="checkbox" name="user_role" value="Scrum Master" class="sm" />
                      <label for="roundedOne"></label>
                    </div>
                    <div class="p_position"><p>Scrum Master<img src="images/plus_icon.png" style="height: 20px; padding-left: 20px; transform: translateY(5px);" id="smbutton"></p></div>      
                    <div style="display: none;" id="scrummaster">
                    <p>The Scrum Master is responsible for ensuring Scrum is understood and enacted. Scrum Masters do this by ensuring that the Scrum Team adheres to Scrum theory, practices, and rules.</p>
                    <p>The Scrum Master is a servant-leader for the Scrum Team. The Scrum Master helps those outside the Scrum Team understand which of their interactions with the Scrum Team are helpful and which aren’t. The Scrum Master helps everyone change these interactions to maximize the value created by the Scrum Team.</p><br>
                    <p><b>Scrum Master Service to the Product Owner</b></p>
                    <p>The Scrum Master serves the Product Owner in several ways, including:</p>
                    <ul>
                        <li>Finding techniques for effective Product Backlog management;</li>
                        <li>Helping the Scrum Team understand the need for clear and concise Product Backlog items;</li>
                        <li>Understanding product planning in an empirical environment;</li>
                        <li>Ensuring the Product Owner knows how to arrange the Product Backlog to maximize value;</li>
                        <li>Facilitating Scrum events as requested or needed.</li>     
                    </ul>

                    <p><b>Scrum Master Service to the Development Team</b></p>
                    <p>The Scrum Master serves the Development Team in several ways, including:</p>
                    <ul>
                        <li>Coaching the Development Team in self-organization and cross-functionality;</li>
                        <li>Helping the Development Team to create high-value products;</li>
                        <li>Removing impediments to the Development Team’s progress;</li>
                        <li>Facilitating Scrum events as requested or needed;</li>
                        <li>Coaching the Development Team in organizational environments in which Scrum is not yet fully adopted and understood.</li>     
                    </ul>

                    <p><b>Scrum Master Service to the Organization</b></p>
                    <p>The Scrum Master serves the organization in several ways,</p>
                    <ul>
                        <li>Leading and coaching the organization in its Scrum adoption;</li>
                        <li>Planning Scrum implementations within the organization;</li>
                        <li>Helping employees and stakeholders understand and enact Scrum and empirical product development;</li>
                        <li>Causing change that increases the productivity of the Scrum Team; and,</li>
                        <li>Working with other Scrum Masters to increase the effectiveness of the application of Scrum in the organization.</li>     
                    </ul>
                    </div>
                </div>

                <div>
                    <div class="roundedOne" id="tm_box">
                      <input type="checkbox" name="user_role" value="Team Member" class="tm" />
                      <label for="roundedOne"></label>
                    </div>
                    <div class="p_position"><p>Team Member<img src="images/plus_icon.png" style="height: 20px; padding-left: 20px; transform: translateY(5px);" id="tmbutton"></p></div>
                    <div style="display: none;" id="devteam">
                    <p>The Development Team consists of professionals who do the work of delivering a potentially releasable Increment of “Done” product at the end of each Sprint. Only members of the Development Team create the Increment.</p>
                    <p>Development Teams are structured and empowered by the organization to organize and manage their own work. The resulting synergy optimizes the Development Team’s overall efficiency and effectiveness.</p>
                    <p>Development Teams have the following characteristics:</p>
                    <ul>
                        <li>They are self-organizing. No one (not even the Scrum Master) tells the Development Team how to turn Product Backlog into Increments of potentially releasable functionality;</li>
                        <li>Development Teams are cross-functional, with all of the skills as a team necessary to create a product Increment;</li>
                        <li>Scrum recognizes no titles for Development Team members other than Developer, regardless of the work being performed by the person; there are no exceptions to this rule;</li>
                        <li>Scrum recognizes no sub-teams in the Development Team, regardless of particular domains that need to be addressed like testing or business analysis; there are no exceptions to this rule; and,</li>
                        <li>Individual Development Team members may have specialized skills and areas of focus, but accountability belongs to the Development Team as a whole.</li>     
                    </ul>

                </div>

                <h4>To learn more about Scrum roles you can view this <a href="https://www.scrumalliance.org/why-scrum/scrum-guide">Scrum Guide.</a></h4><br/>

                <h5 class="note_for_sm">Note: A person can have both Team Member and Scrum Master checked. But if a person has Product Owner checked they cannot have checked Scrum Master or Team Member.</h5>
            </div>

            <div class="settings_button">
                <button id="save_settings" class="buttonsave save_user_settings" onclick="save_user_settings()">Save</button>
            </div>
        </div>


        <input type='hidden' id='user_key' value=''>
        <input type='hidden' id='user_role' value=''>
    </div>-->
    </div>



</body>
</html>