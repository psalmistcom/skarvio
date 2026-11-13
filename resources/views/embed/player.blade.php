<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <title>{{ $title }}</title>
    <style>html,body{margin:0;height:100%;background:#000;overflow:hidden}#p{width:100%;height:100%}</style>
    <script>window.__CFG__ = @json($config, JSON_HEX_TAG | JSON_HEX_AMP);</script>
    @vite('resources/js/embed/embed.js')
</head>
<body>
    <div id="p"></div>
</body>
</html>
