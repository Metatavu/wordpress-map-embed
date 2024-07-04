<?php
/**
 * Plugin Name:       Map Embed
 * Description:       Map embed component.
 * Version:           1.0.0
 * Requires at least: 6.2
 * Requires PHP:      7.0
 * Author:            Metatavu Oy
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wordpress-map-embed
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

add_action('plugins_loaded', function () {
	load_plugin_textdomain( 'wordpress-map-embed', false, basename(dirname( __FILE__ ) ) . '/languages');
});

add_filter('load_script_translation_file', function (string $file, string $handle, string $domain ) {
	if ( strpos( $handle, 'block-wordpress-map-embed-editor-script' ) !== false && 'wordpress-map-embed' === $domain ) {
		$file = str_replace( WP_LANG_DIR . '/plugins', plugin_dir_path( __FILE__ ) . 'languages', $file );
	}

	return $file;
}, 10, 3 );

add_action('init', function () {
	register_block_type( __DIR__ . '/build', [
		'title' => __('Map Embed', 'wordpress-map-embed' ),
		'description' => __('Map embed component.', 'wordpress-map-embed' )
	]);
});