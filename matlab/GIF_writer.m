% --------------------------------------------------------------
% file    : GIF_writer.m
% purpose : Encapsulate writing to an animated GIF file
% --------------------------------------------------------------
%  2025-11-09 PL new
% --------------------------------------------------------------

classdef GIF_writer < handle
    
    properties
        % declare graphics handles
        hFrame = gobjects(1);
        % declare numerical arrays
        fileName, repeats, isOpen, Duration
    end   % properties

   methods
       function obj = GIF_writer( fileName, repeats )
         obj.fileName = fileName;
         obj.isOpen = false;
         if ( nargin < 2 )
            obj.repeats = Inf;
         else
            obj.repeats = repeats;
         end
         obj.Duration = 0;
      end
    
      function writeFrame( obj, dT )
          % default shortest animation step
         if ( nargin < 2 ), dT = 0.02; end;
         
         frame = getframe(gca);
         im = frame2im( frame);
         [ A, map] = rgb2ind( im, 256);     % or 8 ??
         if ( ~obj.isOpen )
            % open file and overwrite with first image
            % - loopCount (repeats) is *not* Inf by default
            % - every frame has its own delay (display) time
            imwrite( A, map, obj.fileName, 'gif', ...
               'LoopCount', obj.repeats, 'DelayTime', dT );
            obj.isOpen = true;
         else
            % *append* an image to the file
            imwrite( A, map, obj.fileName, 'gif', ...
                'WriteMode', 'append', 'DelayTime', dT )
         end
         obj.Duration = obj.Duration + dT;
      end % writeFrame
   
      function smallerWindow( obj)       % method could be static
         % Attempt to make the GIF smaller.
         % Needs development for hitting the exact pixel sizes.
         scaledDPI   = get( groot, 'screenpixelsperinch');
         unscaledDPI = get( gcf,   'screenpixelsperinch');
         %factor = unscaledDPI/scaledDPI;         % like, 1.25 in my Windows settings
         scaledSize   = get( groot, 'screensize');
         %unscaledSize = factor * scaledSize;
         xFactor = 640/scaledSize(3);
         yFactor = 480/scaledSize(4);
         set( gca, 'pos', [ 0.2 0.2 xFactor yFactor ]);
         %set( gca, 'units', 'pixel');
         %get( gca, 'pos')
         duration = obj.Duration
      end;

      function Info( obj )      
         gifInfo        = imfinfo( obj.fileName );
         disp( ' ');
         width  = gifInfo(1).Width
         height = gifInfo(1).Height
         disp( 'Delays are in 1/100 seconds');
         disp( 'Values less than 2 are not reliable');
         delayTimes     = [gifInfo.DelayTime];
         shortest_delay = min( delayTimes )
         longest_delay  = max( delayTimes )
         N_frames       = length( delayTimes )
         duration_sec   = sum( delayTimes )/100
         file_Mb        = gifInfo(end).FileSize/1e6
      end;  % Info

   end  % methods
end  % object                  ( *no* semicolons on the ends! )

%{
% ==============================================================
% TEST CODE
clear all;
close all;
h = plot( NaN, NaN, 'k');
set( gca, 'xlim', [ -1 2 ]);
set( gca, 'ylim', [ -1 2 ]);

test = GIF_writer( 'c:\Memo\test.gif' );

dT = 0.02; % 100 frames should take 2 seconds,
           % but they seem to take only 1.
for k = [ 1:100 99:-1:0 ]/100,
   set( h, 'xdata', [ 0 k ], 'ydata', [ 0 k ] );
   drawnow;
%   test.writeFrame( gca, dT );
   test.writeFrame( dT );
   if ( k == 1 ),
      disp( 'writing a freeze frame');
      test.writeFrame( 5 );     % seconds, display much faster
   end
end;

test.Info;




gifinfo = imfinfo('c:\Memo\test.gif');
DelayTimes = [gifinfo.DelayTime];
% GIF only ? The info structure includes a DelayTime field
%             that contains a value in hundredths of seconds.

% Use this or similar for counting simultaneously with playing.
% One second equals saying "eenentwintig" quickly.
%   https://www.timeanddate.com/stopwatch/

% example for rewriting a file with different delay
[I map]=imread('a.gif');
delay=0.03;
frame=size(I,4);
for i = 1:frame
    if i==1
        imwrite(I(:,:,:,i),map,'b.gif','gif', 'DelayTime', delay,'LoopCount',inf); %save file output
    else
        imwrite(I(:,:,:,i),'b.gif','gif','WriteMode', 'append', 'DelayTime', delay); %save file output
    end
end
%}    