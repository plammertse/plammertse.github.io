% --------------------------------------------------------------
% file    : CG_marker.m
% purpose : Graphical CG symbol, useful for animation
% --------------------------------------------------------------
%  2025-11-04 PL new
% --------------------------------------------------------------

classdef CG_marker < handle
    
    properties
        % declare graphics handles
        hC = gobjects(1);
        hQ = gobjects(1);
        % declare numerical arrays
        xR, yR, xQ, yQ
    end   % properties

    methods
       % the constructor creates an instance "obj" of the object
       function obj = CG_marker( R, C )
           % display requirements
           hold on; daspect( [ 1 1 1 ] );
           
           % default face color is black
           if ( nargin < 2 ), C = 'k'; end;

           % establish painter's order for black and white areas
           obj.hC = fill( NaN, NaN, C );
           set( obj.hC, 'edgecolor', 'none' );
           
           obj.hQ = fill( NaN, NaN, 'w');  % a fill color is mandatory
           set( obj.hQ, 'edgecolor', 'none' );
           
           % XY data for the circle outline
           phi = [0:5:360] * pi/180;
           % native object properties must always be prefixed by "obj."
           obj.xR  = R*cos(phi);
           obj.yR  = R*sin(phi);

          % XY data for the white quarter circles
          % ( both are filled in a single contour )
          phiQ = [0:10:90] * pi/180;
          t = 0.07*R;    % rim width independent of any "linewidth"
          RQ = R-t;
          obj.xQ = [ 0 -RQ*cos(phiQ) 0 RQ*cos(phiQ) 0 ];
          obj.yQ = [ 0 -RQ*sin(phiQ) 0 RQ*sin(phiQ) 0 ];
       end   % constructor
       
       function Pose( obj, x, y, phi )   % internal obj argument is mandatory
          % show black disk
          if ( nargin < 4 ), phi = 0; end;      % nargin includes obj
          set( obj.hC, 'xdata', x + obj.xR);
          set( obj.hC, 'ydata', y + obj.yR);

          % show white quadrants
          % note : xQ, yQ are local to this function and temporary,
          %        obj.xQ and obj.yQ are persistent object properties
          xQ = cos(phi)*obj.xQ - sin(phi)*obj.yQ;
          yQ = sin(phi)*obj.xQ + cos(phi)*obj.yQ;
          set( obj.hQ, 'xdata', x + xQ);
          set( obj.hQ, 'ydata', y + yQ);
       end  % Pose
    end  % methods
end  % object                  ( *no* semicolons on the ends! )

%{
% ==============================================================
% TEST CODE
close all;
set( gca, 'xlim', [ -1 2 ]);
set( gca, 'ylim', [ -1 2 ]);
test = CG_marker( 1, [ 0.6 0 0.1 ] );
for k = [ 1:100 100:-1:0 ],
    test.Pose( 0.01*k, 0.01*k );
   drawnow;
end;
N = 100;
for k = [ 0:N N:-1:0 ],
    test.Pose( 0, 0, 0.5*pi*k/N );
   drawnow;
end;
%}    