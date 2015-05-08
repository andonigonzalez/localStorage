<?php
/*
 *Script web service 
 * 
 * TAGS: recuperarProductos // insertarPedido
 */
include_once "webServicesFruteria.php";
include_once "db_config.php";
//Configuración
$con = mysqli_connect($servidor,$usuario,$contrasena,$basededatos);
mysqli_set_charset($con, "utf8");

 //Evaluamos si ha recibido el tag      
if (isset($_POST["tag"]) && $_POST["tag"]!="") {
    $tag = $_POST["tag"];
	//Creamos un nuevo objeto de la clase webservice pasando parámetro de config
    $ws = new webServices($con);
	//Evaluamos el valor de tag
    switch ($tag){

        case "recuperarProductos":
			//Guardamos en datos lo que nos devuelve la función recuperarProductos del webservices			
            $datos = $ws->recuperarProductos();
            break;
       
        case "insertarPedido":
			//Evaluamos si se ha recibido por POST el carrito
            if(isset($_POST['carrito'])){
				//Guardamos en datos lo que nos devuelve la función insertarPedido del webservices pasando el carrito
                $datos = $ws->insertarPedido($_POST['carrito']);
            }           
            break;

        default:		
            $datos=false;
            break;        
    }
	//Codificamos a JSON $datos
	echo json_encode($datos);

}else {
	$datos=false;
    echo json_encode($datos);
}

?>