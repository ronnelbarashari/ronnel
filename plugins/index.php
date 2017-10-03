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

function get_all_plugins() {
    $plugins = get_plugins();
    return $plugins;
}

function get_active_plugins() {
	$plugins = get_option ( 'active_plugins', array () );
	return $plugins;
}

function is_active_plugin($plugin_file) {
	$is_active = false;
	$plugins = get_active_plugins();
	foreach ($plugins as $plugin) {
		if(substr($plugin, 0, strrpos($plugin, "/")) == $plugin_file) {
			$is_active = true;
		}
	}	

	return $is_active;
}

$style = '<style>
	body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;}
	table{padding:10px;border:solid 1px #ddd;}
</style>';
$prewrapper = "<div>";
$spacer = "<br>";

//WordPress Site
$wpinfo .= "<h1>WordPress</h1>";
$wpinfo .= site_url() . $spacer;
$cur_wp_version = preg_replace( '/-.*$/', '', $wp_version );
$wpinfo .= $cur_wp_version . $spacer;

//Plugins
$plugininfo .= "<h2>Plugins</h2>";
$plugins = get_all_plugins();

//$activeplugin = "<h3>Active Plugins</h3>";
//$inactiveplugin = "<h3>Inactive Plugins</h3>";
$pluginprewrapper = "<table>";

foreach ($plugins as $plugin) {
	//if(is_active_plugin($plugin['TextDomain'])) {
		$activeplugins .= "<tr>";
		$activeplugins .= "<td>";
		$activeplugins .= "<p>";
		$activeplugins .=  "<strong>" . $plugin['Name'] . "</strong>" . $spacer;
		$activeplugins .= $plugin['Description'] . $spacer;
		$activeplugins .= $plugin['Version'] . " | By " . $plugin['AuthorName'] . " | " . '<a href="' . $plugin["PluginURI"] . '">View Details</a>';
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

//$pluginslist = $plugininfo . $activeplugin . $pluginprewrapper . $activeplugins . $pluginpostwrapper;
//$pluginslist .= $inactiveplugin . $pluginprewrapper . $inactiveplugins . $pluginpostwrapper;

$pluginslist = $plugininfo . $pluginprewrapper . $activeplugins . $pluginpostwrapper;

$postwrapper = "</div>";

$output = $style . $prewrapper . $wpinfo . $pluginslist . $postwrapper;

echo $output;

?>