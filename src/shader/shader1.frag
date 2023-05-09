// Source: http://glslsandbox.com/e#39712.0
// Source: https://stackoverflow.com/questions/48731374/world-to-screenspace-for-mode7-effect-fragment-shader
// Combination of both the above

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	//vec2 pos1=gl_FragCoord.xy/resolution.x-vec2(0.50,resolution.y/resolution.x/2.0);
	//float horizon = resolution.y/2.0;
	vec2 horizon = resolution.xy/2.0;
	vec2 pos = gl_FragCoord.xy - vec2(horizon.x,horizon.y);
	vec3 p = vec3(pos.x, pos.y, pos.y + 1.4);
	vec2 s = vec2(p.x/p.z, p.y/p.z) * 0.8;
	s.x += 0.5;
	s.y += 2.0;
	
	vec2 pos1=pos;
	float l1=length(pos1);
	float l2=step(0.5,fract(1.0/l1+time/1.8));
	float a=step(0.5,fract(0.1*sin(20.*l1+time*1.)/l1+atan(pos1.x,pos1.y)*3.));
	if(a!=l2 && l1>0.05){
		gl_FragColor=vec4(1.0,1.0,1.0,1.0);
	}
}