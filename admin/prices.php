<?php include 'includes/head.php'; ?>
<h1 class="uppercase">Cotizaciones</h1>
<div class="search">
    <span>
        <input type="search" name="search" id="search" placeholder="Busca por cliente o número de cotizacion" autocomplete="off">
    </span>
</div>
<div class="table-container">
    <table id="prices">
        <thead>
            <tr>
                <th># Cotización</th>
                <th>Cliente</th>
                <th>Desde - hasta</th>
                <th>Precio</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th></th>
            </tr>
        </thead>
        <tbody class="loading">
    
        </tbody>
    </table>
</div>
<?php include 'includes/footer.php'; ?>