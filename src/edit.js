/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * Imports the InspectorControls component, which is used to wrap
 * the block's custom controls that will appear in in the Settings
 * Sidebar when the block is selected.
 *
 * Also imports the React hook that is used to mark the block wrapper
 * element. It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#inspectorcontrols
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Imports the necessary components that will be used to create
 * the user interface for the block's settings.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/panel/#panelbody
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/text-control/
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/toggle-control/
 */
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

/**
 * Imports the useEffect React Hook. This is used to set an attribute when the
 * block is loaded in the Editor.
 *
 * @see https://react.dev/reference/react/useEffect
 */
import { useEffect, useState } from 'react';

import { isValidURL } from './utils'; 

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { width, height, url } = attributes;

	const [ showZoom, setShowZoom ] = useState(true);
	const [ showGeolocation, setShowGeolocation ] = useState(true);
	const [ showFullscreen, setShowFullscreen ] = useState(true);
	const [ showBasemapSelector, setShowBasemapSelector ] = useState(true);
	const [ validURL, setValidURL ] = useState(isValidURL(url));

	/**
	 * Creates embed iframe code
	 * 
	 * @returns {string} embed iframe code
	 */
	const createEmbedCode = () => {
		const attributes = [];

		attributes.push('width="' + width.replace(/px$/, "") + '"');
		attributes.push('height="' + height.replace(/px$/, "") + '"');
		attributes.push('style="border:0"');
		attributes.push('frameborder="0"');
		attributes.push('src="' + url + '"');

		return '<iframe ' + attributes.join(' ') + '></iframe>';
	};

	/**
	 * Parses embed code and sets attributes based on the code
	 * 
	 * @param {string} embedCode
	 */
	const parseEmbedCode = (embedCode) => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(embedCode, 'text/html');
		const iframe = doc.querySelector('iframe');
		const url = iframe.getAttribute('src');
		const width = iframe.getAttribute('width');
		const height = iframe.getAttribute('height');

		setAttributes( { url, width, height } );
	};

	/**
	 * Parses URL and sets UI attributes based on the URL
	 */
	useEffect(() => {
		if (isValidURL(url)) {
			const urlParams = new URLSearchParams(url);
			const ui = urlParams.get('ui');
			const uiArray = (ui || "").split('!');

			setShowZoom(uiArray.includes('z'));
			setShowGeolocation(uiArray.includes('g'));
			setShowFullscreen(uiArray.includes('o'));
			setShowBasemapSelector(uiArray.includes('b'));
			setValidURL(true);
		} else {
			setValidURL(false);
		}
	}, [ url ]);

	/**
	 * Updates UI parameters into the URL
	 * 
	 * In the URL, the UI parameter is a string that contains the following characters:
	 * 
	 * z == showzoom
	 * g == showgeolocation
	 * o == showfullscreen
	 * b == showbasemapselector
   */
	useEffect(() => {
		try {
			const updatedURL = new URL(url);
			const uiArray = [];

			if (showZoom) {
				uiArray.push('z');
			}
			
			if (showGeolocation) {
				uiArray.push('g');
			}
			
			if (showFullscreen) {
				uiArray.push('o');
			}

			if (showBasemapSelector) {
				uiArray.push('b');
			}

			updatedURL.searchParams.set('ui', uiArray.join('!'));

			setAttributes( { url: updatedURL.toString() } );
		} catch (error) {
			console.error(error);
		}
	}, [ showZoom, showGeolocation, showFullscreen, showBasemapSelector ]);

	/**
	 * Renders the InspectorControls element
	 * 
	 * @returns {Element} The InspectorControls element
	 */
	const renderInspectorControls = () => {
		return (
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'wordpress-map-embed' ) }>

					<TextControl
						label={ __(
							'Embed code',
							'wordpress-map-embed'
						) }
						value={ createEmbedCode() }
						onChange={ ( value ) => parseEmbedCode(value) }
					/>

					<TextControl
						label={ __(
							'URL',
							'wordpress-map-embed'
						) }
						value={ url }
						onChange={ ( value ) =>
							setAttributes( { url: value } )
						}
					/>

					<TextControl
						label={ __(
							'Width',
							'wordpress-map-embed'
						) }
						value={ width }
						onChange={ ( value ) =>
							setAttributes( { width: value } )
						}
					/>

					<TextControl
						label={ __(
							'Height',
							'wordpress-map-embed'
						) }
						value={ height }
						onChange={ ( value ) =>
							setAttributes( { height: value } )
						}
					/>

					<ToggleControl
						label={ __(
							'Show Zoom',
							'wordpress-map-embed'
						) }
						checked={ showZoom }
						onChange={ ( value ) => setShowZoom(value) }
					/>

					<ToggleControl
						label={ __(
							'Show Geolocation',
							'wordpress-map-embed'
						) }
						checked={ showGeolocation }
						onChange={ ( value ) => setShowGeolocation(value) }
					/>

					<ToggleControl
						label={ __(
							'Show Fullscreen',
							'wordpress-map-embed'
						) }
						checked={ showFullscreen }
						onChange={ ( value ) => setShowFullscreen(value) }
					/>

					<ToggleControl
						label={ __(
							'Show Basemap Selector',
							'wordpress-map-embed'
						) }
						checked={ showBasemapSelector }
						onChange={ ( value ) => setShowBasemapSelector(value) }
					/>
					
				</PanelBody>
			</InspectorControls>
		);
	};

	/**
	 * Renders the embed iframe
	 * 
	 * @returns {Element} The embed iframe
	 */
	const renderEmbed = () => {
		if (!validURL) {
			return <div>Invalid URL</div>;
		}

		return (
			<iframe width={ width } height={ height } style={ { border: 0 } } src={ url }></iframe>
		);
	};

	return (
		<>
			{ renderInspectorControls() }
			<p 
				{ ...useBlockProps() }> 
				<div style={{
					background: "#eee",
					textAlign: "center"
				}}>
					{ __( 'Embedded Map (click here to edit)', 'wordpress-map-embed' ) }
				</div>
				{ renderEmbed() }
			</p>
		</>
	);
}
