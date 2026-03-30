% --------------------------------------------------------------
% file    : schematic_zig-zag_spring.m
% purpose : Zig-zag spring, useful for animation
% --------------------------------------------------------------
%  2025-11-05 PL new, cloned from CG_marker
% --------------------------------------------------------------

% TODO
%   Try more tricks to indicate tension or compression.
%   Maybe a gradual color change ? But what is zero ?
%   Negative background field ?
% See also the schematic_block_spring variants.

classdef schematic_zig_zag_spring < handle
    
    properties
        % graphics handle for the shape
        hS = gobjects(1);
        % declare numerical arrays for the outline
        So, Sa, Sb, Lo, Po, Do, xL1, yL1
    end   % properties

    methods
       % the constructor creates an instance "obj" of the object
       function obj = schematic_zig_zag_spring( So, n, a, b )
           hold on; daspect( [ 1 1 1 ] );

           % handle inputs
           if ( ( nargin < 2 ) || isempty(n) ), n =  6;  end;
           if ( nargin < 3 ), a = 0.2; end;
           if ( nargin < 4 ), b =  a;  end;

           obj.So = So;
           obj.Sa = a*So;
           obj.Sb = b*So;
           
           % define coil spring length and zig-zag angle
           obj.Lo = So * (1-a-b);
           obj.Po = 2/n*obj.Lo; 
%           alpha_o = 60/180*pi;
           alpha_o = 45/180*pi;
           aa = tan(alpha_o);
%           obj.Do = 0.5 * aa/obj.Po;
           obj.Do = 0.5 * aa*obj.Po;

           % create zig-zag line with n peaks
           xL1  = [ 0 0.5+[0:n-1] n ];   % [   0  ..   1  ]
           yL1  = 1-rem(xL1,2);            % [ -0.5 .. +0.5 ]
           yL1(1)   = 0;
           yL1(end) = 0;
           xL1 = xL1/n;

           % save normalized coil spring x and y
           obj.xL1  = xL1;           % normalized xL for spring only
           obj.yL1  = yL1;           % normalized yL fro spring

           % create single graphics object, black default
           obj.hS = plot( NaN, NaN, 'k' );
           set( obj.hS, 'linewidth', 2 );
       end   % constructor

       function Pose( obj, A, B )   % internal obj argument is mandatory
          % find L
          S  = norm( B-A );
          L  = S - obj.Sa - obj.Sb;
          L  = max( 0, L);       % do not allow negative L ?

          % size spring to D and L
          xL = obj.Sa + obj.xL1*L;
          yL = obj.Do  * obj.yL1;      % scale yL1 to +-0.5*Do
          
          % scale diameter to keep diagonal length sqrt(2)
          % when compressed, an a bit more when extended
          if ( L < obj.Lo ),
              yL = sqrt(2-(L/obj.Lo)^2) * yL;
              f  = sqrt(2-(L/obj.Lo)^2);
              yL = f * yL;
          else
              % f = max( 0, 2-L/obj.Lo );
              f = max( 0, 1.5-0.5*L/obj.Lo );
              yL = f * yL;
          end;
          
          % add straight ends
          xL = [ 0  xL  S ];
          yL = [ 0  yL  0 ];
          
          %{
          % add optional cup for zero stretch reference
          xCup = obj.Sa + [ obj.Lo -obj.Po/3 -obj.Po/3 obj.Lo ];
          yCup = 0.75*obj.Do * [ 1 1 -1 -1 ];
          xL = [ xL NaN xCup ];
          yL = [ yL NaN yCup ];
          %}
   
          %{
          % add optional colour change when compressed
          if ( S >= obj.So ), set( obj.hS, 'color', 'k'); end;
          if ( S <  obj.So ), set( obj.hS, 'color', 'r'); end;
          %}

          % rotate to proper angle
          phi = atan2( B(2)-A(2), B(1)-A(1) );
          xS = cos(phi)*xL - sin(phi)*yL;
          yS = sin(phi)*xL + cos(phi)*yL;

          % translate to position A
          xS = xS + A(1);
          yS = yS + A(2);
          
          set( obj.hS, 'xdata', xS);
          set( obj.hS, 'ydata', yS);
       end  % Pose
    end  % methods
end  % object                  ( *no* semicolons on the ends! )

%{
% ==============================================================
% TEST CODE
clear all;
close all;
set( gca, 'xlim', [ -5 15 ]);
set( gca, 'ylim', [ -5 15 ]);
daspect( [ 1 1 1 ] );
So = 10;
%test = schematic_zig_zag_spring( So );
test = schematic_zig_zag_spring( So, 5 );
grid on;
for k = [ 0:100 99:-1:-99 -100:100 99:-1:0 ]/100,
   A = [ 0, 0 ];
%   B = [ So+0.5*So*k, 0 ]; 
   B = [ So+0.5*So*k, 0 ]; 
   test.Pose( A, B);
   drawnow;
end;

for k = [ 0:100 99:-1:-99 -100:100 99:-1:0 ]/100,
   A = [ 0, 0 ];
   B = [ 0, So+0.5*So*k ];
   test.Pose( A, B);
   drawnow;
end;

%}    