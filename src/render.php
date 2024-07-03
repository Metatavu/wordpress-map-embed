<?php

/**
 * Server rendering for the iframe block.
 *
 * @param array $attributes The block attributes.
 *
 * @return string Returns the iframe HTML.
 */

if (isset($attributes['url'])) {
	$url = $attributes['url'];
	$width = $attributes['width'];
	$height = $attributes['height'];
	$fullWidth = $attributes['fullWidth'] ?? false;

	echo sprintf(
		'<iframe width="%s" height="%s" style="border: 0" src="%s"></iframe>',
		$fullWidth ? '100%' : $width,
		$height,
		esc_url($url)
	);
};