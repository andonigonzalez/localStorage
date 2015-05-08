<?php include "db_config.php" ?>

<?php 

    $conexion = mysqli_connect($servidor,$usuario,$contrasena,$basededatos);
    mysqli_set_charset($conexion, "utf8");

    $carrito = $_POST['carrito'];

    $datos = 1;

    $this->conexion->autocommit(FALSE);
    $q = mysqli_query($conexion, "INSERT INTO cabpedidos () VALUES ()");
           
    if($q){

        $x = mysqli_query($conexion, "SELECT idPedido FROM cabpedidos order by idPedido desc LIMIT 1");
        
        if($x){
            
            while($res = mysqli_fetch_assoc($x)){ 
            $idPedido = $res['idPedido'];
            }
         
            if($carrito){
                foreach($carrito as $producto){
                            
                    $idProducto = $producto['idProducto'];
                    $cantidad = $producto['cantidad'];
                    $totalLinea = $producto['cantidad']*$producto['precioVenta'];

                    $q = mysqli_query($conexion, "INSERT INTO lineaspedidos (idPedido, idProducto, cantidad, totalLinea) 
                                                VALUES ({$idPedido},{$idProducto},{$cantidad},{$totalLinea})");

                    if(!$q) {
                        $datos = 0;
                    }
                }
            }
            else{
                 $datos = 0;
            }
        }
        else{
            $datos = 0;
        }
    }
    else{
        $datos = 0;
    } 
                      
    if ($datos == 1){   
        $conexion->commit();
    }
    else{
        $conexion->rollback();
    }

    echo json_encode($datos);
?>