<?php 
include "../includes/sdk.php";
$sdk = new SDK($_GET["lang"]);
$data = file_get_contents('php://input');
$price = $sdk->setPrice($data);
echo json_encode($price);