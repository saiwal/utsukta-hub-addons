<?php

/**
 *   * Name: Inbox Label list
 *   * Description: Display a menu with different inbox folders
 */

namespace Zotlabs\Widget;

class inbox_header {

	function widget($arr) {
    return "hello";
		return replace_macros(get_markup_template('inbox_header.tpl', 'addon/mailbox'), [
				'$header' => t('Wikis'),
				'$channel' => $channel['channel_address'],
				'$wikis' => $wikis['wikis']
    ]);
	}
}
