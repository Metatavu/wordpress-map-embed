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
 *
 * @package           create-block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

function create_block_wordpress_map_embed_init() {
	register_block_type( __DIR__ . '/build' );
}

add_action( 'init', 'create_block_wordpress_map_embed_init' );