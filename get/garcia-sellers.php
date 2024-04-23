<?php 
include "../includes/sdk.php";
$sdk = new SDK($_GET["lang"]);
$sellers = $sdk->getSellers();
echo json_encode($sellers);