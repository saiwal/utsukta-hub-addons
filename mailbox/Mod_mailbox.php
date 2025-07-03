<?php

namespace Zotlabs\Module;

use App;
use Zotlabs\Lib\Apps;

class Mailbox extends \Zotlabs\Web\Controller {

  function get() {

    $tpl = get_markup_template('mailbox.tpl', 'addon/mailbox/');

    $o = replace_macros($tpl, [
			'$title' => t('Mailbox'),
			'$descr' => t('A description'),
		]);

    return $o;
  }
}
