dir /b /on /a-d > dir.tmp
sort < dir.tmp > dir.txt
del dir.tmp

REM   Now edit result file,  e.g. by global replace
REM   of full path with nothing.




