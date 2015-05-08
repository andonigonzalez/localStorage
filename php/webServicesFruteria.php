<?php

/*
 * Clase webServices. 
 * 
 * 
 */
class webServices {

    private $conexion;
    //Constructor
    function __construct($con) {
		//Se asigna a conexion lo recibido al crear el objeto en funciones.php
         $this->conexion = $con;
    }
    
    function __destruct() {
     
    }

    function recuperarProductos(){

    	$q=mysqli_query($this->conexion, "SELECT p.idProducto, nombreProducto, precio, imagen
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

        return $datos;
    }



    function insertarPedido($carrito){
    	//Inicializamos $datos para comprobación en commit
    	$datos = 1;
		//Iniciamos transacción
		$this->conexion->autocommit(FALSE);
		//El id de cabpedidos es autoincrement, así que no pasamos datos. En un caso real la tabla tendría más campos
	    $q = mysqli_query($this->conexion, "INSERT INTO cabpedidos () VALUES ()");
	    if($q){
			//Recuperamos el idPedido que acabamos de insertar
	        $x = mysqli_query($this->conexion, "SELECT idPedido FROM cabpedidos order by idPedido desc LIMIT 1");	        
	        if($x){	            
	            while($res = mysqli_fetch_assoc($x)){ 
	            $idPedido = $res['idPedido'];
	            }         
	            if($carrito){
					//Hacemos una insert por cada producto del carrito
	                foreach($carrito as $producto){	                            
	                    $idProducto = $producto['idProducto'];
	                    $cantidad = $producto['cantidad'];
	                    $totalLinea = $producto['cantidad']*$producto['precioVenta'];
	                    $q = mysqli_query($this->conexion, "INSERT INTO lineaspedidos (idPedido, idProducto, cantidad, totalLinea) 
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
	    //Si todo ha ido bien, hacemos commit()
	    if ($datos == 1){   
	        $this->conexion->commit();
	    }
		//Si no, deshacemos lo hecho
	    else{
	        $this->conexion->rollback();
	    }

	return $datos;
	}

	   
}

?>