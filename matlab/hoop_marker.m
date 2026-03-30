% --------------------------------------------------------------
% file    : hoop_marker.m
% purpose : Graphical hoop (wheel), useful for animation
%           Unlike Matlab's marker, this has a faceAlpha
%           for fade-ins and -outs.
% --------------------------------------------------------------
%  2025-11-04 PL new
% --------------------------------------------------------------

classdef hoop_marker < handle
    
    properties
        % declare graphics handles
        hW = gobjects(1);
        % declare numerical arrays
        xW, yW
    end   % properties

    methods
       % the constructor creates an instance "obj" of the object
       function obj = hoop_marker( R, t, C )
           % display requirements
           hold on; daspect( [ 1 1 1 ] );
           
           % default color is black
           if ( nargin < 3 ), C = 'k';    end;
           if ( nargin < 1 ), R = 1;      end;
           if ( nargin < 2 ), t = 0.25*R; end;

           % circles
           phi = [0:5:360] * pi/180;
           % native object properties must always be prefixed by "obj."
           obj.xW = [ R*cos(phi) (R-t)*fliplr(cos(phi)) ];
           obj.yW = [ R*sin(phi) (R-t)*fliplr(sin(phi)) ];

           % don't show yet
           obj.hW = fill( NaN, NaN, C );
           set( obj.hW, 'edgecolor', 'none' );
       end   % constructor
       
       function Pose( obj, x, y )   % internal obj argument is mandatory
          set( obj.hW, 'xdata', x+obj.xW, 'ydata', y+obj.yW);
       end  % Pose

       function SetAlpha( obj, alfa )
          % use and alfa from 0 (washed white) to 1 (full color)
          % the square value f^2 of a "fader" scale looks better than linear 
          set( obj.hW, 'facealpha', alfa );
       end  % SetAlpha
    end  % methods
end  % object                  ( *no* semicolons on the ends! )

%{
% ==============================================================
% TEST CODE
close all;
set( gca, 'xlim', [ -1 2 ]);
set( gca, 'ylim', [ -1 2 ]);
test = hoop_marker( 1, 0.1, [ 0.7 0 0.1 ] );
for k = [ 1:100 100:-1:0 ],
    test.Pose( 0.01*k, 0.01*k );
    set( test.hW, 'facealpha', 1-rem( k/101, 1) ); 
   drawnow;
end;
%}    