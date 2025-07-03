<?php

/**
 *
 * Name: Mailbox
 * Description: Manage posts in an inbox layout
 * Version: 1.0
 * Author: SK <sk@utsukta.org>
 *
 */ 

use Zotlabs\Lib\Apps;
use Zotlabs\Extend\Hook;

require_once('addon/mailbox/Mod_mailbox.php');

function mailbox_load() {
	Hook::register('channel_apps', 'addon/mailbox/mailbox.php', 'mailbox_channel_apps');
  Widget::register('addon/mailbox/Widget/inbox_header.php', 'inbox_header');
}

function mailbox_unload() {
	Hook::unregister('channel_apps', 'addon/mailbox/mailbox.php', 'mailbox_channel_apps');
  Widget::unregister('addon/mailbox/Widget/inbox_header.php', 'inbox_header');
}


