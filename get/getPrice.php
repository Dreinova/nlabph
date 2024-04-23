<?php 
include "../includes/sdk.php";
$sdk = new SDK($_GET["lang"]);
$categoria= $_GET["cat"];
$clientes = $sdk->gClients();
echo json_encode($clientes);