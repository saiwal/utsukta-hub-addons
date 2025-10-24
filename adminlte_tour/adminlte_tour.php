<?php
/**
 * Name: AdminLTE Tour
 * Description: First-time user tour for AdminLTE theme
 * Version: 1.0
 * Author: Saiwal (@sk@utsukta.org)
 */

use Zotlabs\Extend\Route;

function adminlte_tour_load() {
    // Hook into page_end to inject JS/CSS
    register_hook('page_end', 'addon/adminlte_tour/adminlte_tour.php', 'adminlte_tour_inject');

    // Register endpoint for completion
    Route::register('addon/adminlte_tour/Mod_adminlte_tour.php', 'adminlte_tour');
}

function adminlte_tour_unload() {
    unregister_hook('page_end', 'addon/adminlte_tour/adminlte_tour.php', 'adminlte_tour_inject');

    // Correct way: provide both URL and handler
    Route::unregister('addon/adminlte_tour/Mod_adminlte_tour.php', 'adminlte_tour');
}

// Inject JS/CSS into the page
function adminlte_tour_inject(&$b) {
    $uid = local_channel();
    if (!$uid) return;

    // Check current theme
    $theme = App::$channel['channel_theme'];
    logger('Current theme: ' . $theme);
    if (strpos($theme, 'adminlte') !== 0) {
      return; // exit if theme is not adminlte or a variant
    }
    // Only run tour if not completed
    $done = get_pconfig($uid, 'adminlte', 'tour_done');
    if ($done) return;

    head_add_css('/addon/adminlte_tour/css/shepherd.min.css');
    head_add_css('/addon/adminlte_tour/css/tour.css');

    $current_page = App::$cmd; // e.g., 'hq', 'network', 'connections'
    $b .= "<script>const currentHubzillaPage = '$current_page';</script>";
    $b .= "<script src='/addon/adminlte_tour/js/shepherd.js'></script>";
    $b .= "<script src='/addon/adminlte_tour/js/tour.js'></script>";
}


