<?php 
include "../includes/sdk.php";
$sdk = new SDK($_GET["lang"]);
$prices = $sdk->getPrices(isset($_GET['idPrice']) ? $_GET['idPrice'] : "");
echo json_encode($prices);