<?php
namespace Zotlabs\Module;

use App;

class Adminlte_tour extends \Zotlabs\Web\Controller {

    function get() {
        $uid = local_channel();
        if (!$uid) killme();

        // /adminlte_tour?tour=hq   -> returns JSON file
        $tour = trim($_GET['tour'] ?? '');

        if ($tour) {
            $path = 'addon/adminlte_tour/steps/' . basename($tour) . '.json';
            if (file_exists($path)) {
                header('Content-Type: application/json');
                echo file_get_contents($path);
                killme();
            }
            http_status_exit(404, 'Tour not found');
        }

        // Default behavior = mark tour complete
        set_pconfig($uid, 'adminlte', 'tour_done', 1);
        header('Content-Type: application/json');
        echo json_encode(['status' => 'ok']);
        killme();
    }
}
