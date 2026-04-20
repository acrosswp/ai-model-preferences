<?php
namespace AcrossAI_Model_Manager\Includes;

// Exit if accessed directly
defined( 'ABSPATH' ) || exit;

/**
 * Define the internationalization functionality
 *
 * @package    AcrossAI_Model_Manager
 * @subpackage AcrossAI_Model_Manager/includes
 */
class I18n {

	/**
	 * Load the plugin textdomain.
	 *
	 * Since WordPress 4.6, translations are loaded automatically for plugins
	 * hosted on WordPress.org. This method is kept for local/custom translation
	 * file overrides placed in wp-content/languages/plugins/.
	 */
	public function do_load_textdomain() {
		// WordPress 4.6+ auto-loads translations from WordPress.org.
		// No manual load_plugin_textdomain() call is required.
	}
}
