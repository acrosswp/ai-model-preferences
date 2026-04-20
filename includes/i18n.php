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
	 * Actually load the plugin textdomain on `init`
	 */
	public function do_load_textdomain() {
		load_plugin_textdomain(
			'acrossai-model-manager',
			false,
			plugin_basename( dirname( \ACAI_MODEL_MANAGER_PLUGIN_FILE ) ) . '/languages/'
		);
	}
}
