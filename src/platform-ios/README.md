# platform-ios

This folder is reserved for the iOS packaging layer.

Planned approach (Path A): wrap the web build in an iOS container (e.g., Capacitor or similar) and add a thin bridge for native sharing if Web Share is insufficient.

V1 ships web-first; do not add native code here until Milestone 3.
