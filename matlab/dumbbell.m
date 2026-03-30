% --------------------------------------------------------------
% file    : dumbbell.m
% purpose : Graphical dumbbell, useful for animation
% --------------------------------------------------------------
%  2025-11-05 PL new, cloned from CG_marker
% --------------------------------------------------------------

classdef dumbbell < handle
    
    properties
        % graphics handle for the shape
        hD = gobjects(1);
        % declare numerical arrays for the outline
        xD, yD
    end   % properties

    methods
       % the constructor creates an instance "obj" of the object
       function obj = dumbbell( L, D, dD, C )
           % display requirements
           hold on; daspect( [ 1 1 1 ] );
           
           % reasonable shape defaults
           if ( nargin < 1 ), L  = 1; end;
           if ( nargin < 2 ) || isempty(D),
               D  = L/15;
           end;
           if ( nargin < 3 ) || isempty(dD),
               dD = 0.3;
           end;     % dD == d/D
           % default face color is black
           if ( nargin < 4 ), C = 'k'; end;

           % single graphics object, black default
           obj.hD = fill( NaN, NaN, C );
           set( obj.hD, 'edgecolor', 'none' );
           
           % XY outline data
           % define partial circles
           phiJoin = asin( dD);
           phiSpan = 2*pi-2*phiJoin;
           phi = phiJoin + [0:0.02:1]*phiSpan;
           xD = D*cos(phi);
           yD = D*sin(phi);

           % connect two partial circles by a stick
           xD  = [ xD-L/2 -xD+L/2 ];
           yD  = [ yD     -yD ];

           % close the line (not needed for fill)
           xD( end+1) = xD(1);
           yD( end+1) = yD(1);
           
           % copy local outline to object properties
           obj.xD = xD;
           obj.yD = yD;
       end   % constructor

       function Pose( obj, x, y, phi )   % internal obj argument is mandatory
          % angle is optional
          if ( nargin < 4 ), phi = 0; end;      % nargin includes obj

          % show dumbbell
          % note : xD, yD are local to this function and temporary,
          %        obj.xD and obj.yD are persistent object properties
          xD = cos(phi)*obj.xD - sin(phi)*obj.yD;
          yD = sin(phi)*obj.xD + cos(phi)*obj.yD;
          set( obj.hD, 'xdata', x + xD);
          set( obj.hD, 'ydata', y + yD);
       end  % Pose
       
       function SetAlpha( obj, alfa )
          % use and alfa from 0 (washed white) to 1 (full color)
          % the square value f^2 of a "fader" scale looks better than linear 
          set( obj.hD, 'facealpha', alfa );
       end  % SetAlpha

    end  % methods
end  % object                  ( *no* semicolons on the ends! )

%{
% ==============================================================
% TEST CODE
clear all;
close all;
set( gca, 'xlim', [ -10 10 ]);
set( gca, 'ylim', [ -10 10 ]);
test = dumbbell( 10 );
%test = dumbbell;
%%%test = dumbbell( 5, 2, 0.5 );
for k = [ 1:100 100:-1:0 ],
    test.Pose( 0.04*k, 0.04*k );
   drawnow;
end;
N = 100;
for k = [ 0:N N:-1:0 ],
    test.Pose( 0, 0, 0.5*pi*k/N );
   drawnow;
end;
%}    