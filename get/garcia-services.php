<?php 
include "../includes/sdk.php";
$sdk = new SDK($_GET["lang"]);
$prices = $sdk->getServices(isset($_GET['idService']) ? $_GET['idService'] : "",isset($_GET['search']) ? $_GET['search'] : "");
echo json_encode($prices);