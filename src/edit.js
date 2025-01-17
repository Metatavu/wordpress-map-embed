import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { useEffect, useState } from 'react';
import { isValidURL } from './utils';

/**
 * The edit function for the WordPress Map Embed block.
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { width, height, url, fullWidth } = attributes;

	const [ showZoom, setShowZoom ] = useState( false );
	const [ showGeolocation, setShowGeolocation ] = useState( false );
	const [ showFullscreen, setShowFullscreen ] = useState( false );
	const [ showBasemapSelector, setShowBasemapSelector ] = useState( false );
	const [ validURL, setValidURL ] = useState( isValidURL( url ) );

	/**
	 * Creates embed iframe code
	 *
	 * @return {string} embed iframe code
	 */
	const createEmbedCode = () => {
		if (!width || !height || !url) {
			return '';
		}

		const attrs = [];

		attrs.push( 'width="' + width.replace( /px$/, '' ) + '"' );
		attrs.push( 'height="' + height.replace( /px$/, '' ) + '"' );
		attrs.push( 'style="border:0"' );
		attrs.push( 'frameborder="0"' );
		attrs.push( 'src="' + url + '"' );

		return '<iframe ' + attrs.join( ' ' ) + '></iframe>';
	};

	/**
	 * Parses embed code and sets attributes based on the code
	 *
	 * @param {string} embedCode
	 */
	const parseEmbedCode = ( embedCode ) => {
		const parser = new DOMParser();
		const doc = parser.parseFromString( embedCode, 'text/html' );
		const iframe = doc.querySelector( 'iframe' );
		const parsedUrl = iframe.getAttribute( 'src' );
		const parsedWidth = iframe.getAttribute( 'width' );
		const parsedHeight = iframe.getAttribute( 'height' );

		setAttributes( {
			url: parsedUrl,
			width: parsedWidth,
			height: parsedHeight,
		} );
	};

	/**
	 * Parses URL and sets UI attributes based on the URL
	 */
	useEffect( () => {
		if ( isValidURL( url ) ) {
			const urlParams = new URLSearchParams( url );
			const ui = urlParams.get( 'ui' );
			const uiArray = ( ui || '' ).split( '!' );

			setShowZoom( uiArray.includes( 'z' ) );
			setShowGeolocation( uiArray.includes( 'g' ) );
			setShowFullscreen( uiArray.includes( 'o' ) );
			setShowBasemapSelector( uiArray.includes( 'b' ) );
			setValidURL( true );
		} else {
			setValidURL( false );
		}
	}, [ url ] );

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
	useEffect( () => {
		try {
			const updatedURL = new URL( url );
			const uiArray = [];

			if ( showZoom ) {
				uiArray.push( 'z' );
			}

			if ( showGeolocation ) {
				uiArray.push( 'g' );
			}

			if ( showFullscreen ) {
				uiArray.push( 'o' );
			}

			if ( showBasemapSelector ) {
				uiArray.push( 'b' );
			}

			updatedURL.searchParams.set( 'ui', uiArray.join( '!' ) );

			setAttributes( { url: updatedURL.toString() } );
		} catch ( error ) {}
	}, [
		showZoom,
		showGeolocation,
		showFullscreen,
		showBasemapSelector
	] );

	/**
	 * Renders the InspectorControls element
	 *
	 * @return {Element} The InspectorControls element
	 */
	const renderInspectorControls = () => {
		return (
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'wordpress-map-embed' ) }>
					<TextControl
						label={ __( 'Embed code', 'wordpress-map-embed' ) }
						value={ createEmbedCode() }
						onChange={ ( value ) => parseEmbedCode( value ) }
					/>

					<TextControl
						label={ __( 'URL', 'wordpress-map-embed' ) }
						value={ url }
						onChange={ ( value ) =>
							setAttributes( { url: value } )
						}
					/>

					<ToggleControl
						label={ __( 'Show Zoom', 'wordpress-map-embed' ) }
						checked={ showZoom }
						onChange={ ( value ) => setShowZoom( value ) }
					/>

					<ToggleControl
						label={ __(
							'Show Geolocation',
							'wordpress-map-embed'
						) }
						checked={ showGeolocation }
						onChange={ ( value ) => setShowGeolocation( value ) }
					/>

					<ToggleControl
						label={ __( 'Show Fullscreen', 'wordpress-map-embed' ) }
						checked={ showFullscreen }
						onChange={ ( value ) => setShowFullscreen( value ) }
					/>

					<ToggleControl
						label={ __(
							'Show Basemap Selector',
							'wordpress-map-embed'
						) }
						checked={ showBasemapSelector }
						onChange={ ( value ) =>
							setShowBasemapSelector( value )
						}
					/>

					<ToggleControl
						label={ __( 'Full Width', 'wordpress-map-embed' ) }
						checked={ fullWidth }
						onChange={ ( value ) =>
							setAttributes( { fullWidth: value } )
						}
					/>

					<TextControl
						label={ __( 'Width', 'wordpress-map-embed' ) }
						disabled={ fullWidth }
						value={ fullWidth ? '100%' : width }
						onChange={ ( value ) =>
							setAttributes( { width: value } )
						}
					/>

					<TextControl
						label={ __( 'Height', 'wordpress-map-embed' ) }
						value={ height }
						onChange={ ( value ) =>
							setAttributes( { height: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>
		);
	};

	/**
	 * Renders the embed iframe
	 *
	 * @return {Element} The embed iframe
	 */
	const renderEmbed = () => {
		if (!url) {
			return (
				<div style={{
					textAlign: 'center',
					padding: '20px',
					fontStyle: 'italic'
				}}>
					{ __( 'Add an embed code to display a map', 'wordpress-map-embed' ) }
				</div>
			);
		}

		if (!validURL) {
			return (
				<div style={{
					textAlign: 'center',
					padding: '20px',
					fontStyle: 'italic'
				}}>
					{ __( 'Provided URL is not valid', 'wordpress-map-embed' ) }
				</div>
			);
		}

		return (
			<iframe
				title="Embedded Map"
				width={ fullWidth ? '100%' : width }
				height={ height }
				style={ { border: 0 } }
				src={ url }
			></iframe>
		);
	};

	return (
		<>
			{ renderInspectorControls() }
			<p { ...useBlockProps() }>
				<div
					style={ {
						background: '#eee',
						textAlign: 'center',
					} }
				>
					{ __(
						'Embedded Map (click here to edit)',
						'wordpress-map-embed'
					) }
				</div>
				{ renderEmbed() }
			</p>
		</>
	);
}
