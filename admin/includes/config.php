<?php
    session_start();
    include "../includes/sdk.php";
    $lang = isset($_GET['lang']) ? $_GET['lang'] : 'es';
    $sdk = new SDK($lang);