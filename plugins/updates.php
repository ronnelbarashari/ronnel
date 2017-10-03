<?php

require_once( str_replace("/plugins", "", dirname(__FILE__)) . '/wp-load.php' );

global $wp_version;

function get_plugin_updates() {
    $all_plugins = get_plugins();
    $upgrade_plugins = array();
    $current = get_site_transient( 'update_plugins' );
    foreach ( (array)$all_plugins as $plugin_file => $plugin_data) {
        if ( isset( $current->response[ $plugin_file ] ) ) {
            $upgrade_plugins[ $plugin_file ] = (object) $plugin_data;
            $upgrade_plugins[ $plugin_file ]->update = $current->response[ $plugin_file ];
        }
    }
 
    return $upgrade_plugins;
}

$style = '<style>
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;}
    table{padding:10px;border:solid 1px #ddd;}
</style>';

$prewrapper = "<div>";
$spacer = "<br>";

$wpinfo .= "<h1>WordPress</h1>";
$wpinfo .= site_url() . $spacer;
$cur_wp_version = preg_replace( '/-.*$/', '', $wp_version );
$wpinfo .= $cur_wp_version . $spacer;


$plugininfo .= "<h2>Plugins</h2>";
$plugins = get_plugin_updates();

$pluginprewrapper = "<table>";
foreach ($plugins as $plugin) {
    //if(is_active_plugin($plugin['TextDomain'])) {
        $activeplugins .= "<tr>";
        $activeplugins .= "<td>";
        $activeplugins .= "<p>";
        $activeplugins .=  "<strong>" . $plugin->Name . "</strong>" . $spacer;
        $activeplugins .= $plugin->Description . $spacer;
        $activeplugins .= "You have version ".$plugin->Version . " installed. Update to " . $plugin->update->new_version . ". " . "<a href='" . $plugin->update->url . "'>View version ".$plugin->update->new_version." details</a>". $spacer;

        if(isset($plugin->update->tested) >= $cur_wp_version){
            $activeplugins .= "Compatibility with Wordpress ". $cur_wp_version . ": 100%(according to its author)";
        }else{
            $activeplugins .= "Compatibility with Wordpress ". $cur_wp_version . ": Unknown)";
        }
        
       
        $activeplugins .= "</p>";
        $activeplugins .= "<td>";
    /*} else {
        $inactiveplugins .= "<tr>";
        $inactiveplugins .= "<td>";
        $inactiveplugins .= "<p>";
        $inactiveplugins .=  "<strong>" . $plugin['Name'] . "</strong>" . $spacer;
        $inactiveplugins .= $plugin['Description'] . $spacer;
        $inactiveplugins .= $plugin['Version'] . " | By " . $plugin['AuthorName'] . " | " . '<a href="' . $plugin["PluginURI"] . '">View Details</a>';
        $inactiveplugins .= "</p>";
        $inactiveplugins .= "<td>";
    }*/
}
$pluginpostwrapper = "</table>";

$pluginslist = $plugininfo . $pluginprewrapper . $activeplugins . $pluginpostwrapper;

$postwrapper = "</div>";

$output = $style . $prewrapper . $wpinfo . $pluginslist . $postwrapper;

echo $output;

?>