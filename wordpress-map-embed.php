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

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_wordpress_map_embed_init() {
	register_block_type( __DIR__ . '/build' );
}

add_action( 'init', 'create_block_wordpress_map_embed_init' );
