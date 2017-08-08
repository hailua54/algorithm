#OpenGL
	https://github.com/bennyk/SmoothDrawing-x
	cocos2d-x ccShader_PositionColorLengthTexture.frag
		```c
		void main()
		{
		// #if defined GL_OES_standard_derivatives
			gl_FragColor = v_color*smoothstep(0.0, length(fwidth(v_texcoord)), 1.0 - length(v_texcoord));
		// #else
			//gl_FragColor = v_color*step(0.0, 1.0 - length(v_texcoord));
		// #endif
		}
		)";
		```
# WebRTC
	https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling