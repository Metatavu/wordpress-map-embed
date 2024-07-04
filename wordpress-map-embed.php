<?php
/**
 * Plugin Name:       Wordpress Map Embed
 * Description:       Map embed component for Wordpress Gutenberg editor.
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

function create_block_wordpress_map_embed_init() {
	register_block_type( __DIR__ . '/build' );
}

add_action( 'init', 'create_block_wordpress_map_embed_init' );

add_filter( 'load_script_translation_file', 'wordpress_map_embed_fix_translation_location', 10, 3 );
function wordpress_map_embed_fix_translation_location( string $file, string $handle, string $domain ): string {
	if ( strpos( $handle, 'block-wordpress-map-embed-editor-script' ) !== false && 'wordpress-map-embed' === $domain ) {
		$file = str_replace( WP_LANG_DIR . '/plugins', plugin_dir_path( __FILE__ ) . 'languages', $file );
	}

	return $file;
}