% --------------------------------------------------------------
% file    : circle_marker.m
% purpose : Graphical circle marker, useful for animation
%           Unlike Matlab's marker, this has a faceAlpha
%           for fade-ins and -outs.
% --------------------------------------------------------------
%  2025-11-04 PL new
% --------------------------------------------------------------

classdef circle_marker < handle
    
    properties
        % declare graphics handles
        hF = gobjects(1);
        hR = gobjects(1);
        % declare numerical arrays
        xR, yR, xF, yF, C, Cf
    end   % properties

    methods
       % the constructor creates an instance "obj" of the object
       function obj = circle_marker( R, t, C, Cf )
           % display requirements
           hold on; daspect( [ 1 1 1 ] );
           
           if ( nargin < 2 ), t  = 0.25*R; end;

           % default rim and field colors are black and white
           if ( nargin < 3 ), C  = 'k'; end;
           obj.C = C;
           if ( nargin < 4 ), Cf = 'w'; end;
           obj.Cf = Cf;
           
           % XY data for the circles
           phi = [0:5:360] * pi/180;
           % native object properties must always be prefixed by "obj."
           % rim must not cover center because of fading
           obj.xR = [ R*cos(phi) (R-t)*fliplr(cos(phi)) ];
           obj.yR = [ R*sin(phi) (R-t)*fliplr(sin(phi)) ];
           obj.xF = (R-t)*cos(phi);
           obj.yF = (R-t)*sin(phi);

           % non-overlapping inner area and rim, order not important
           obj.hR = fill( NaN, NaN, C );
           set( obj.hR, 'edgecolor', 'none' );
           obj.hF = fill( NaN, NaN, Cf );
           set( obj.hF, 'edgecolor', 'none' );
       end   % constructor
       
       function Pose( obj, x, y )   % internal obj argument is mandatory
          % make object visible
          set( obj.hR, 'xdata', x+obj.xR, 'ydata', y+obj.yR);
          set( obj.hF, 'xdata', x+obj.xF, 'ydata', y+obj.yF);
       end  % Pose
       
       function SetAlpha( obj, alfa )
          % use an alfa from 0 (washed white) to 1 (full color)
          % note : the square value f^2 of a "fader"
          %          will fade smoother than linear 
          set( obj.hR, 'facealpha', alfa );
          set( obj.hF, 'facealpha', alfa );
       end  % SetAlpha

    end  % methods
end  % object                  ( *no* semicolons on the ends! )

%{
% ==============================================================
% TEST CODE
clear all;
close all;
set( gca, 'xlim', [ -1 2 ]);
set( gca, 'ylim', [ -1 2 ]);
test = circle_marker( 1, 0.1, [ 0.6 0 0.1 ] );
for k = [ 1:100 100:-1:0 ],
    test.Pose( 0.01*k, 0.01*k );
    test.SetAlpha( 1-rem( k/101, 1)); 
   drawnow;
end;
%}    