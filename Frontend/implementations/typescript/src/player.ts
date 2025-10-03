// Copyright Epic Games, Inc. All Rights Reserved.

// export * from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.5';
// export * from '@epicgames-ps/lib-pixelstreamingfrontend-ui-ue5.5';
import { Config, PixelStreaming, Flags } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.4';
import { Application, PixelStreamingApplicationStyle } from '@epicgames-ps/lib-pixelstreamingfrontend-ui-ue5.4';
const PixelStreamingApplicationStyles =
    new PixelStreamingApplicationStyle();
PixelStreamingApplicationStyles.applyStyleSheet();

// expose the pixel streaming object for hooking into. tests etc.
declare global {
    interface Window { pixelStreaming: PixelStreaming; }
}

document.body.onload = function() {
	const config = new Config({ useUrlParams: true });
	config.setFlagEnabled(Flags.HoveringMouseMode, true);
	config.setFlagEnabled(Flags.FakeMouseWithTouches, true);
	
	const stream = new PixelStreaming(config);

	const application = new Application({
		stream,
		onColorModeChanged: (isLightMode) => PixelStreamingApplicationStyles.setColorMode(isLightMode)
	});
	
	document.body.appendChild(application.rootElement);
	
	// Listen for messages from the Unreal Engine server
	stream.addResponseEventListener('add_response', (message: any) => {
		console.log('Received message from server:', message);
		
		// The message structure typically contains:
		// - message.data: the actual data sent from UE
		
		// If it's a string message
		if (typeof message.data === 'string') {
			console.log('String message:', message.data);
			// Parse JSON if needed
			try {
				const jsonData = JSON.parse(message.data);
				console.log('Parsed JSON:', jsonData);
			} catch (e) {
				// Not JSON, just a plain string
			}
		}
		// If it's binary data
		else if (message.data instanceof ArrayBuffer) {
			console.log('Binary message received');
		}
	});

	// You can also listen for specific response types if you're using the emitUIInteraction pattern
	
	window.pixelStreaming = stream;
}
