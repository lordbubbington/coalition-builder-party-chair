# Version 0.4.1 — Map rendering fix

Version 0.4.1 fixes malformed district and state polygons in the national maps.

The map generator encoded each polygon ring with Google polyline characters and separated rings with `|`. That character is also valid inside an encoded coordinate, so some rings were split in the middle and decoded as broken paths. The separator is now `!`, which the coordinate encoder cannot produce. All map paths were regenerated and the Windows executable rebuilt.

The 0.4 interactive tutorial and the 0.3 map data remain in place.
