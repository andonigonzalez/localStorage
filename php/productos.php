<?php include "db_config.php" ?>

<?php 

$conexion = mysqli_connect($servidor,$usuario,$contrasena,$basededatos);
mysqli_set_charset($conexion, "utf8");


$q=mysqli_query($conexion, "SELECT p.idProducto, nombreProducto, precio, imagen
							FROM productos p JOIN imagenes i
							ON p.idProducto = i.idProducto");
        
            if($q) {
               $datos['productos'] = array();
                while($fila =  mysqli_fetch_array($q)){
                    $aux = array();
                    $aux["idProducto"] = $fila["idProducto"];
                    $aux["nombreProducto"] = $fila["nombreProducto"];
                    $aux["precio"] = $fila["precio"];
                    $aux["imagen"] = $fila["imagen"];                                   
                    array_push($datos['productos'],$aux);
                }
            } else {
                $datos = false;
            }
            
    echo json_encode($datos);
?>