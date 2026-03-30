% --------------------------------------------------------------
% file    : arrow.m
% purpose : Graphical arrow with shaft and arrowhead
% --------------------------------------------------------------
%  2025-11-15 PL added shortened tip if L<H
%  2025-11-11 PL new, uses existing arrowhead.m code
% --------------------------------------------------------------

classdef arrow < handle
    
   properties
      % graphics handle for the shape
      hA = gobjects(1);
      % declare numerical arrays for the shape
      H, W, t
   end   % properties

   methods
      % the constructor creates an instance "obj" of the object
      function obj = arrow( H, W, t, C )   % add crossDir later ?
         % display requirements
         hold on; 
         % daspect( [ 1 1 1 ] );
          
         % default sizes and colors
         % arrow head length, H
         if ( nargin < 1 ), H =  1;  end;
         obj.H = H;
         % arrow head width, W
         if ( ( nargin < 2 ) || isempty(W) ), ...
            W = 0.5*H;
         end;
         obj.W = W;
         if ( ( nargin < 3 ) || isempty(t) ), ...
            t = 0.3*W;
         end;
         obj.t = t;
         if ( nargin < 4 ), C = 'k'; end;
%{           
         % TODO
         % Default orthogonal cross bar
% Possibly rehash this for the whole arrow,
% and/or allow an absolute crossbar direction input.
           if ( nargin < 4 ),
              a  = daspect;   % for axes which are not scaled square
              ba = a(2)/a(1);
              ab = 1/ba;
              crossDir = 0.5 * [ ab*direct(2) -ba*direct(1) ];
           end;
%}
           % create a single graphics patch for the whole arrow
           obj.hA = fill( NaN, NaN, 'k' );
           set( obj.hA, 'facecolor', C );
           set( obj.hA, 'edgecolor', 'none' );
       end   % constructor

       function Pose( obj, xo, x1 )   % internal obj argument is mandatory
          % The xo and yo are 2D position vectors
          
          % build up arrow outline horizontally
          % distance between base and point
          L   = norm(  x1 - xo )
          % shaft length LH
          LH = max( 0, L-obj.H);
          % arrow length LH
          t2 = obj.t/2
          W2 = obj.W/2;
          % cut the point short from behind if L < H
          if ( L < obj.H ),
             t2 = L/obj.H*t2
             W2 = L/obj.H*W2;
          end;

          xA_ = [ 0 LH LH L LH LH 0 ];
          yA_ = [ t2 t2 W2 0 -W2 -t2 -t2 ]

          % rotate to proper angle
          phi = atan2( x1(2)-xo(2), x1(1)-xo(1) );
          xA  = xA_*cos(phi) - yA_*sin(phi);
          yA  = xA_*sin(phi) + yA_*cos(phi);

          % shift to proper base point
          xA  = xo(1) + xA;
          yA  = xo(2) + yA;
          set( obj.hA,'xdata', xA, 'ydata', yA);
      end  % Pose
    end  % methods
end  % object                  ( *no* semicolons on the ends! )

%{
% ==============================================================
% TEST CODE
clear all;
close all;
set( gca, 'xlim', [ -2.5 1.5 ]);
set( gca, 'ylim', [ -2 2 ]);
grid on;
test = arrow( 0.3, [], [], [ 0.9 0 0.1 ] );
daspect( [ 1 1 1 ]);
phi = [ 0:0.002:1 ] * 2*pi;
x = -0.85+1.5*cos(phi);
y =       1.5*sin(phi);
for k = 1:length(phi),
   test.Pose( [ 0.5 0 ], [ x(k) y(k) ] );
   drawnow;
end;
pause(1);
for kk =  [ 0:100 99:-1:0 ],
   test.Pose( [ 0.5-kk/100 0 ], [ x(k) y(k) ] );
   drawnow;
end;
%}    