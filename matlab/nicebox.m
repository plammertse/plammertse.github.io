% --------------------------------------------------------------
% file    : nicebox.m
% purpose : Format a graphics text box to be centered etc.
% --------------------------------------------------------------
% history :
%   2023-02-21 PL nicebox.m, added optional arguments
%   2021-12-14 PL moved to separate function nice_box.m
% --------------------------------------------------------------

function [] = nicebox( hTxt, fs, w, c )

if ( nargin < 4 ), c  = 'k'; end;
if ( nargin < 3 ), w  = 0.5; end;   % Matlab default
if ( nargin < 2 ), fs =  16; end;

set( hTxt, 'fontsize',  fs  );
set( hTxt, 'linewidth', w   );
set( hTxt, 'hor', 'cen' );
set( hTxt, 'ver', 'mid' );
set( hTxt, 'back', 'w');
set( hTxt, 'edgecolor', [ 0 0 0 ] );
%%% 1.5 wide and dark grey is also nice
%%% set( hTxt, 'edgecolor', [ 0.3 0.3 0.3 ]);

% Note : 'w' background paints over earlier fills,
%       but not over grid if set( 'layer... )
%       in that case, make grid "by hand" with gridlines.m
