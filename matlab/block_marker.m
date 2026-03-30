% --------------------------------------------------------------
% file    : block_marker.m
% purpose : Graphical block, useful for animation
%           Unlike Matlab's marker, this has a faceAlpha
%           for fade-ins and -outs.
% --------------------------------------------------------------
%  2025-11-04 PL new
% --------------------------------------------------------------

classdef block_marker < handle
    
    properties
        % declare graphics handles
        hW = gobjects(1);
        % declare numerical arrays
        W, H
    end   % properties

    methods
       % the constructor creates an instance "obj" of the object
       function obj = block_marker( W, H, C )
           % display requirements
           hold on; daspect( [ 1 1 1 ] );
           
           % default color is black
           if ( nargin < 3 ), C = 'k';  end;
           if ( nargin < 2 ),
               obj.H = 1;
           else
               obj.H = H;
           end;
           if ( nargin < 1 ),
               obj.W = 1;
           else
               obj.W = W;
           end;

           % don't show yet
           obj.hW = fill( NaN, NaN, C );
%           set( obj.hW, 'facecolor', C );
           set( obj.hW, 'edgecolor', 'none' );
       end   % constructor
       
       function Pose( obj, x, y, phi )   % internal obj argument is mandatory
          if ( nargin < 4 ), phi = 0; end;
          x__ = 0.5*[ -obj.W  obj.W obj.W -obj.W ];
          y__ = 0.5*[ -obj.H -obj.H obj.H  obj.H ];
          x_  = x__*cos(phi) - y__*sin(phi);
          y_  = x__*sin(phi) + y__*cos(phi);
          x = x + x_;
          y = y + y_;
          set( obj.hW, 'xdata', x, 'ydata', y);
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
clear all;
close all;
set( gca, 'xlim', [ -1 2 ]);
set( gca, 'ylim', [ -1 2 ]);
test = block_marker( 1, 2, [ 0.7 0 0.1 ] );
for k = [ 1:100 100:-1:0 ],
   test.Pose( 0.01*k, 0.01*k, abs(pi/2*0.01*k) );
   %set( test.hW, 'facealpha', 1-rem( k/101, 1) );
   test.SetAlpha( 1-rem( k/101, 1) );
   drawnow;
end;
%}    