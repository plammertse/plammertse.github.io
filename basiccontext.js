var canvas;
var context;
var mousePos = {x:0,y:0};
var mouseIsDown = false;
var IsSlide = false;
function OnLoad()
{
	canvas = document.getElementById("myCanvas");
	context = canvas.getContext("2d");
	
	canvas.addEventListener('mousemove', function(evt) {
        var rect = canvas.getBoundingClientRect();
        mousePos = {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }, false);
	canvas.addEventListener('mousedown', function(evt) {
        mouseIsDown = true
    }, false);
	canvas.addEventListener('mouseup', function(evt) {
        mouseIsDown = false
    }, false);
	
	
	canvas.addEventListener('touchmove', function(evt) {
        var rect = canvas.getBoundingClientRect();
        mousePos = {
            x: evt.touches[0].clientX - rect.left,
            y: evt.touches[0].clientY - rect.top
        };
		if (evt.target == canvas) evt.preventDefault();
    }, false);
	canvas.addEventListener('touchstart', function(evt) {
        mouseIsDown = true;
        var rect = canvas.getBoundingClientRect();
        mousePos = {
            x: evt.touches[0].clientX - rect.left,
            y: evt.touches[0].clientY - rect.top
        };
		if (evt.target == canvas) evt.preventDefault();
    }, false);
	canvas.addEventListener('touchend', function(evt) {
        mouseIsDown = false;
		if (evt.target == canvas) evt.preventDefault();
    }, false);
	
	
	
     
	var url = new URL(window.location.href);
	IsSlide = (url.searchParams.get("IsSlide") == "1") ? true : false;
}
var isActive = true;
window.addEventListener("message", function(evt) {
	isActive = evt.data;
});

var Color = function(R,G,B,A) { return{r:R,g:G,b:B,a:A}; };
var vec2 = function(X,Y) { return{x:X,y:Y}; };
var vec3 = function(X,Y,Z) { return{x:X,y:Y,z:Z}; };
var vec4 = function(X,Y,Z,W) { return{x:X,y:Y,z:Z,w:W}; };
var cos = function ( x ) { return Math.cos(x/180*Math.PI); }
var sin = function ( x ) { return Math.sin(x/180*Math.PI); }
var Lerp = function ( t, a, b ) { return a*(1-t) + b*t; }
var lerpVec = function ( t, a, b ) { return plus( timesSc(a,1-t) , timesSc(b,t) ); }
var ToChar = function (s) { return s.charCodeAt(0); }
var mat3 = function(v0a,v1a,v2a) { return{v0:v0a,v1:v1a,v2:v2a}; };
var PI = Math.PI;
var cos = Math.cos;
var sin = Math.sin;
var rotor3 = function(pa,pb01,pb02,pb12) { return{a:pa,b01:pb01,b02:pb02,b12:pb12}; };
var bv3 = function(pb01,pb02,pb12) { return{b01:pb01,b02:pb02,b12:pb12}; };
var ray3 = function(o,d) { return{origin:o,direction:d}; };
var plane3 = function(n,p) { return{normal:n,d:-dot(n,p)}; };
var bv2 = function(pb01) { return{b01:pb01}; };
var DefFont = "Helvetica, Arial";

function copy( v0 )
{
    if ( v0.z == null )
        return { x: v0.x, y: v0.y };
    else
        return { x: v0.x, y: v0.y, z: v0.z };
}

function plus( v0, v1 )
{
    if ( v0.z == null )
        return { x: v0.x + v1.x, y: v0.y + v1.y };
    else
        return { x: v0.x + v1.x, y: v0.y + v1.y, z: v0.z + v1.z };
}
function minus( v0, v1 )
{
    if ( v0.z == null )
        return { x: v0.x - v1.x, y: v0.y - v1.y };
    else
        return { x: v0.x - v1.x, y: v0.y - v1.y, z: v0.z - v1.z };
}

function dot( v0, v1 )
{
    if ( v0.z == null )
        return v0.x*v1.x + v0.y*v1.y;
    else
        return v0.x*v1.x + v0.y*v1.y + v0.z*v1.z;
}


function times( v, p )
{
    if ( v.z == null )
        return {
        x: v.x * p.x,
        y: v.y * p.y };
    else
        return {
        x: v.x * p.x,
        y: v.y * p.y,
        z: v.z * p.z };
}

function timesSc( v, a )
{
    if ( v.z == null )
        return {
        x: v.x * a,
        y: v.y * a };
    else
        return {
        x: v.x * a,
        y: v.y * a,
        z: v.z * a };
}


function length_sqrd( v )
{
    var len = 0;
    if ( v.z == null )
    {
        len = v.x*v.x + v.y*v.y;
    }
    else
    {
        len = v.x*v.x + v.y*v.y + v.z*v.z;
    }
    return len;
}

function length( v )
{
    var len = length_sqrd( v );
    if (len < 0.0001*0.0001) 
		return 0;
    else
		return Math.sqrt(len);
}

function normalize( v )
{
    if ( v.z == null )
    {
        var len = length( v );
        return { x: v.x / len, y: v.y / len };
    }
    else
    {
        var len = length( v );
        return { x: v.x / len, y: v.y / len, z: v.z / len };
    }
}

function around( v0, v1, radius )
{
    if ( length( minus(v0,v1) ) < radius * 2 ) // hack for mobile
        return true;
    else
        return false;
}

function transpose( m )
{
	return mat3(
		vec3(m.v0.x,m.v1.x,m.v2.x),
		vec3(m.v0.y,m.v1.y,m.v2.y),
		vec3(m.v0.z,m.v1.z,m.v2.z)
	);
}

function mvMult( m, v )
{
	return vec3(
		dot( m.v0, v ),
		dot( m.v1, v ),
		dot( m.v2, v ) 
	);
}

function cross( v1, v2 )
{
	return vec3( 
		v1.y*v2.z - v1.z*v2.y,
		v1.z*v2.x - v1.x*v2.z,
		v1.x*v2.y - v1.y*v2.x 
	);
}

function LookAt( cameraView )
{
	var cameraRight = normalize(cross( cameraView, vec3(0,0,1) ));
	var cameraUp = normalize(cross( cameraRight, cameraView ));
	return mat3( cameraRight, cameraUp, timesSc(cameraView,-1) );
}

function PerspectiveData( fovy,
					      aspect,
					      zNear,
					      zFar )
{
	var f = 1/Math.tan(fovy/(2*360) * 2*Math.PI);
	var za = (zFar+zNear)/(zNear-zFar);
	var zb = (2*zFar*zNear)/(zNear-zFar);
	return { fx:f/aspect, fy:f, zA:za, zB:zb };
}


function Perspective( v, pf, csize )
{
	var q = vec4( v.x * pf.fx, v.y * pf.fy, v.z * pf.zA + pf.zB, -v.z );
	q = vec3( q.x / q.w, q.y / q.w, q.z / q.w );
	return vec3( (q.x + 1) * csize.x / 2, (-q.y + 1) * csize.y / 2, q.z );
}

function UnPerspective( q, pf, csize )
{
	var w = vec3( q.x / (csize.x / 2) - 1, 1 - q.y / (csize.y / 2), q.z );
	
	var v = vec3(0,0,0);
	v.z = - pf.zB / ( w.z + pf.zA );
	v.x = - w.x * v.z / pf.fx;
	v.y = - w.y * v.z / pf.fy;
	
	return v;
}

function RotateBasisXY( angleRad )
{
	return mat3(
		vec3(cos(angleRad),-sin(angleRad),0),
		vec3(sin(angleRad),cos(angleRad),0),
		vec3(0,0,1),
	);
}
function RotateBasisXZ( angleRad )
{
	return mat3(
		vec3(cos(angleRad),0,-sin(angleRad)),
		vec3(0,1,0),
		vec3(sin(angleRad),0,cos(angleRad)),
	);
}

function wedge( u, v )
{
	return bv3(
		u.x*v.y - u.y*v.x, 
		u.x*v.z - u.z*v.x, 
		u.y*v.z - u.z*v.y  
	);
}

function rotate( r, v )
{
	var q = vec3(
		r.a * v.x - ( v.y * -r.b01 + v.z * -r.b02 ),
		r.a * v.y - ( v.x *  r.b01 + v.z * -r.b12 ),
		r.a * v.z - ( v.x *  r.b02 + v.y *  r.b12 ) 
	);

	var p012 = - v.x * r.b12 + v.y * r.b02 - v.z * r.b01;

	return vec3( 
		r.a * q.x + q.y  * r.b01 + q.z  * r.b02 - p012 * r.b12,
		r.a * q.y - q.x  * r.b01 + p012 * r.b02 + q.z  * r.b12,
		r.a * q.z - p012 * r.b01 - q.x  * r.b02 - q.y  * r.b12
	);
}

function RotorFromTo( vFrom, vTo )
{
	var a = 1 + dot(vTo,vFrom);
	var b = wedge( vFrom, vTo );
	var len = Math.sqrt( a*a + b.b01*b.b01 + b.b02*b.b02 + b.b12*b.b12 );
	return rotor3( a / len, -b.b01 / len, -b.b02 / len, -b.b12 / len );
}

function RotorScaled( rotor, scaleAmount )
{
	// take log
	var alphaover2 = Math.acos( rotor.a );
	var sinalphaover2 = Math.sin( alphaover2 ); 

	var axis = {b01:rotor.b01 / -sinalphaover2, b02:rotor.b02 / -sinalphaover2, b12:rotor.b12 / -sinalphaover2 };
	
	// scale
	alphaover2 *= scaleAmount;

	// take exp
	var sina = Math.sin(alphaover2);
	var cosa = Math.cos(alphaover2);
	return rotor3( cosa, axis.b01 * -sina, axis.b02 * -sina, axis.b12 * -sina );
}

function dotBv( v, B )
{
	return vec3(
		0		   - B.b01*v.y   - B.b02*v.z,
		+B.b01*v.x + 0		     - B.b12*v.z,
		+B.b02*v.x + B.b12*v.y + 0
		);
}


function intersectRayPlane( r, p )
{
    var dotp = dot( r.direction, p.normal );
	
    if ( dotp )
    {
        var t = -( dot( p.normal, r.origin ) + p.d ) / dotp;
		if ( t >= 0 )
		{
			var m = plus( r.origin , timesSc( r.direction, t ) );
			return {result:true,point:m,time:t};
		}
    }

	return {result:false,point:null,time:null};
}


function safeParseFloat( val )
{
	var num = parseFloat( val )
	if ( isNaN(num) )
		num = 0;
	return num;
}


function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}
function clampLow(number, min) {
  return Math.max(min, number);
}
function clampHigh(number, max) {
  return Math.min(number, max);
}


function swap(x,y){
 var t = x;
 x = y;
 y = t;
}

function strVec( v )
{
    if ( v.z == null )
		return "(" + v.x.toFixed(3) + ", " + v.y.toFixed(3) + ")";
    else if ( v.w == null )
		return "(" + v.x.toFixed(3) + ", " + v.y.toFixed(3) + ", " + v.z.toFixed(3) + ")";
	else
		return "(" + v.x.toFixed(3) + ", " + v.y.toFixed(3) + ", " + v.z.toFixed(3) + ", " + v.w.toFixed(3) + ")";
}
function strMat( m )
{
	return "(" + strVec(m.v0) + ",\n" + strVec(m.v1) + ",\n" + strVec(m.v2) + ")";
}

function DrawDisc( center, radius, color )
{
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
}

function DrawCircle( center, radius, color, width )
{
    context.beginPath();
    context.arc(center.x, center.y, radius, 0, 2 * Math.PI, false);
    context.lineWidth = width;
    context.strokeStyle = color;
    context.stroke();
}

function DrawLine( p0, p1, color, width )
{
    context.beginPath();
    context.lineWidth = width;
    context.strokeStyle = color;
    context.moveTo( p0.x, p0.y );
    context.lineTo( p1.x, p1.y );
    context.stroke();
}

function DrawDashedLine( p0, p1, color, width )
{
    context.beginPath();
    context.lineWidth = width;
    context.strokeStyle = color;
    context.moveTo( p0.x, p0.y );
    var p = vec2(p0.x,p0.y);
    var diff = minus( p1, p0 );
    var dist = length(diff) / 5;
    for ( var i = 0; i < Math.floor(dist / 2); ++i )
    {
        context.lineTo( p.x + diff.x / dist, p.y + diff.y / dist );
        context.moveTo( p.x + diff.x / dist * 2, p.y + diff.y / dist * 2 );
        p.x = p.x + diff.x / dist * 2
        p.y = p.y + diff.y / dist * 2
    }
    context.lineTo( p1.x, p1.y );
    context.stroke();
}


function DrawQuad( p0, p1, p2, p3, color )
{
    context.beginPath();
    context.moveTo( p0.x, p0.y );
    context.lineTo( p1.x, p1.y );
    context.lineTo( p2.x, p2.y );
    context.lineTo( p3.x, p3.y );
    context.lineTo( p0.x, p0.y );
    context.fillStyle = color;
    context.fill();
}

function WriteText( message, pos, font, color ) 
{
    context.font = font;
    context.fillStyle = color;
    context.fillText(message, pos.x, pos.y );
}


function WriteFormattedText( message, pos, font, fontsize, color ) 
{
	
	ctx = context;
	x0 = pos.x;
	y0 = pos.y;
	s = message;
	align = 'left';
	col = color;
	
    // 2d canvas context, string, pos.x, pos.y, left/right/center, font, font height, color
    // Convert html code to a series of individual strings, each displayable by fillText().
    font = 'px '+font
    var lines = []
    var line = [0]
    var part = '' // the text element preceding a '<'
    var cmd = ''
    var bold = false
    var italic = false
    var sup = false
    var sub = false
    var x = 0, y = 0
    var dx, start
    var legal = ['b', 'strong', 'i', 'em', 'sup', 'sub']

    function add_part() {
        var style = ''
        var fs = fontsize
        if (bold) style += 'bold '
        if (italic) style += 'italic '
        if (sup || sub) {
            fs = 0.8*fontsize
            if (sup) y -= 0.3*fontsize // y increases downward in 2D canvas
            else y += 0.3*fontsize
        }
        ctx.font = style+fs+font
        dx = ctx.measureText(part).width
        line.push([x, y, ctx.font, part])
        part = ''
        x += dx
    }

    function end_line() {
        if (part !== '') add_part()
        line[0] = x
        lines.push(line)
        line = [0]
        x = y = 0
    }

    for (var i=0; i<s.length; i++) {
        var c = s[i]
        if (c == '\n') {
            end_line()
        } else if (c != '<') {
            part += c // a part of the text
        } else { // encountered '<'
            //if (part !== '') add_part()
            start = i+1
            i++
            cmd = s[i]
            var end = false
            if (cmd == '/') {
                cmd = ''
                end = true
            }
            var ok = true
            for (i=i+1; i<s.length; i++) {
                if (s[i] == '<') { // This means that the intial '<' did not start a command
                    i = i-1 // back up
                    part += '<'+cmd
                    add_part()
                    ok = false // signal that we encountered '<'
                    break
                }
                if (s[i] == '>') break
                cmd += s[i]
            }
            if (!ok) continue
            if (cmd == 'br' || cmd == 'br/') {
                end_line()
            } else {
                if (legal.indexOf(cmd) >= 0 && part !== '') add_part()
                switch (cmd) {
                    case 'b':
                    case 'strong':
                        bold = !end
                        break
                    case 'i':
                    case 'em':
                        italic = !end
                        break
                    case 'sup':
                        sup = !end
                        if (end) y = 0
                        break
                    case 'sub':
                        sub = !end
                        if (end) y = 0
                        break
                    default:
                        part += '<'+cmd+'>'
                }
            }
        }
    }
    if (part.length > 0) line.push([x, y, fontsize+font, part])
    ctx.font = fontsize+font
    line[0] = x + ctx.measureText(part).width
    lines.push(line)

    var width, L
    var nline = 0
    // Each line in lines starts with the total width of the line, followed by
    // elements of the form {x, y, font, text}, where x and y start at zero.
    var maxwidth = -1
    for (L in lines) {
        if (lines[L][0] > maxwidth) maxwidth = lines[L][0]
    }
    for (L in lines) {
        y0 += nline*1.2*fontsize
        nline++
        for (var p in lines[L]) {
            var k = lines[L][p]
            if (k[1] === undefined) {
                width = k
                continue
            }
            ctx.font = k[2]
            ctx.fillStyle = col
            switch (align) {
                case 'left':
                    x = x0 + k[0]
                    y = y0 + k[1]
                    break
                case 'center':
                    x = x0 + k[0] - width/2
                    y = y0 + k[1]
                    break
                case 'right':
                    x = x0 + k[0] - maxwidth
                    y = y0 + k[1]
                    break
                default:
                    throw new Error(align+' is not a possible alignment option.')
            }
            ctx.fillText(k[3], x, y)
        }
    }
}


function DrawArcSimple( vecA, vecB, colorArc, dist, text, textColor, amount, startAmount )
{
	var INCS = 300;
	var vecAn = normalize(vecA);
	var vecBn = normalize(vecB);
	//var vecAl = length(vecA);
	//var vecBl = length(vecB);
	var vecAs = timesSc(vecAn,dist);
	
	var pr = 0;
	var v0Half;
	var rotor = RotorFromTo( vecAn, vecBn );
	for ( var i = 0; i <= INCS;  )
	{
		if ( !startAmount || pr > startAmount )
		{
			var rot0 = RotorScaled( rotor, pr );
			var rot1 = RotorScaled( rotor, pr + 1 / INCS );
			
			var v0 = rotate( rot0, vecAs );
			var v1 = rotate( rot1, vecAs );
			
			DrawLine( project(v0), project(v1), colorArc, 2 * pr + 2 );
			//DrawLine( project(v0), project(v1), colorArc, 3 );
			
			if ( i == INCS/2 )
				v0Half = v0;
		}
			
		++i; pr += 1 / INCS;
		if ( pr > amount ) {
			DrawDisc( project(v1), 4, colorArc );
			break;
		}
	}
	
	if ( text && v0Half )
		WriteText( text, plus(project(v0Half), vec2(0,-10)), '15pt '+DefFont, textColor )
}




