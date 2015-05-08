$(document).ready(inicio);

function inicio(){


/*****************************************************************************************************/
/******************************************** PRODUCTOS **********************************************/
/*****************************************************************************************************/

    //Si ya tenemos los productos guardados, los mostramos, si no, los recuperamos.
    if(localStorage.getItem('productos') == null){
        recuperarProductos();
    }
    else{
        mostrarProductos();
    }

    /*Recuperar los productos*/
    function recuperarProductos(){
        //tag que vamos a pasar
        var tag = 'recuperarProductos';

        //recupero los productos mediante ajax
        $.ajax({
            type: "POST",
            datatype: "json",
            url : 'php/funciones.php',
            data: {'tag':tag},
            beforeSend: inicioProductos,
            success: guardarProductos,
            timeout: 4000,
            error: errorProductos                 
        });
    }

    function inicioProductos(){
        $("#listadoProductos").hide().html("Buscando...").fadeIn(200); 
    }

    function errorProductos(){
        $("#listadoProductos").hide().html("Error recuperando productos").fadeIn(200); 
    }

    function guardarProductos(datos){
        console.log(datos);
		//Comprobamos que nos ha devuelto algo válido
		if(datos!="false"){
			var json_datos = $.parseJSON(datos);
			//Guardamos en localStorage lo recibido de la base de datos          
			localStorage.setItem('productos', JSON.stringify(json_datos));
			mostrarProductos();
		}
		else{
			alert("Error");
            $("#listadoProductos").hide().html("Error recuperando productos").fadeIn(200); 
		}
    }

    function mostrarProductos(){
        var json_datos = JSON.parse(localStorage.getItem('productos'));

        var idProducto;
        var nombreProducto;
        var imagen;
        var precio;

        var html="";
            for($i=0;$i<json_datos['productos'].length;$i++){

                idProducto = json_datos['productos'][$i].idProducto;
                nombreProducto = json_datos['productos'][$i].nombreProducto;
                imagen = json_datos['productos'][$i].imagen;
                precio = json_datos['productos'][$i].precio;

                html += '<a data-role="button" data-inline="true" id="'+idProducto+'" data-nombre="'+nombreProducto+'" data-precio="'+precio+'" class="tpv ui-link ui-btn ui-btn-inline ui-shadow ui-corner-all" >' ;              
                html += '<img src="data:image/jpg;base64,'+ imagen +'" alt="'+nombreProducto+'" width="110px" height="75px" />' ;
                html += '<br /><br />' ;
                html += '<label>'+nombreProducto.toUpperCase()+' '+precio+'€</label>' ;
                html += '</a>' ;
            }
        $("#listadoProductos").hide().html(html).fadeIn(200);  
    }


/*****************************************************************************************************/
/********************************************* CARRITO ***********************************************/
/*****************************************************************************************************/

	/***** Si no existe el carrito se inicializa , si existe se muestra*/
    if( sessionStorage.getItem( 'carrito' ) == null ) {
        creaCarrito();
		
    }else{
		displayCart();
	}
	
	 
	//Al pulsar el botón
	$("a").click(onRecuperarValores);
	
	
	function creaCarrito() { 
		//Creamos un array de productos vacío
        var productos =[];
		//SessionStorage almacena en formato string
		//Guardamos en una variable el array convertido a string
        var stringCarro = JSON.stringify(productos);
		//Asignamos lo guardado en esa variable a la variable carrito del sessionStorage
        sessionStorage.setItem('carrito',stringCarro);
		//Mostramos el carrito
		displayCart();	
    }
	
	
	//Función mostrar carrito
    function displayCart() {
			//Evaluación de seguridad.
			//Si el carrito del sessionStorage existe , si no es null
            if( sessionStorage.getItem( 'carrito' ) != null ) {
				//Convertimos a JSON el contenido y lo guardamos en una variable
                var cart = JSON.parse( sessionStorage.getItem( 'carrito' ) );				
                //Inicializamos el total del carrito a cero      
                var total = 0;
                var html = "";
                html += '<ul data-role="listview" data-inset="true" class="classListViewCarrito ui-listview ui-listview-inset ui-corner-all ui-shadow">';
                //Si el carrito está vacío
				if(cart.length == 0){
                    html += '<li class="ui-li-static ui-body-inherit ui-li-has-thumb ui-first-child ui-last-child">';                    
                    html += '<img src="img/IconoCarrito.png">';
                    html += '<h5>EL CARRITO ESTÁ VACÍO</h5>';
                    html += '</li>';
				// y si no lo recorremos
                }else{
                    for( var i = 0; i < cart.length; i++ ) {
						//Guardamos la posicion para asignar un identificador al botón de eliminar producto
                        var posicion = i;
						//Calculamos el total del producto
                        var totalProducto = (cart[i].cantidad * cart[i].precioVenta);
                        html += '<li class="ui-li-static ui-body-inherit ui-li-has-thumb ui-first-child ui-last-child">';
                        html += '<img src="'+cart[i].imagen +'">';
                        html += '<h5>'+cart[i].nombreProducto+'</h5>';
                        html += '<p>Precio: '+cart[i].precioVenta+'€</p>';
                        html += '<p>Cant.';
                        html += '<span><button class="inlineIcon ui-btn ui-icon-minus ui-btn-icon-notext ui-shadow ui-corner-all" id="btnMinus" data-icon="minus" data-iconpos="notext" onclick="sessionStorage.posicion='+posicion+'"></button></span>';
                        html += '<label>'+cart[i].cantidad+'</label>';
                        html += '<span><button class="inlineIcon ui-btn ui-icon-plus ui-btn-icon-notext ui-shadow ui-corner-all" id="btnPlus" data-icon="plus" data-iconpos="notext" onclick="sessionStorage.posicion='+posicion+'"></button></span></p>';                       
                        html += '<strong>Total: '+totalProducto.toFixed(2)+'€</strong>';
						// En el evento onclick guardamos la posición en la sessionStorage y la sobreescribimos según vamos pulsando
                        html += '<span><button class="ui-li-aside ui-btn ui-icon-delete ui-btn-icon-notext ui-shadow ui-corner-all" id="btnDel" data-icon="delete" data-iconpos="notext" onclick="sessionStorage.posicion='+posicion+'"></button></span>';
                        html += '</li>';
						//Sumamos al total del carrito el total del producto
                        total += parseFloat(totalProducto);     
                    } 
                }
                html += '</ul>';                
                $("#shopping-cart").html(html);
				//Formateamos a 2 decimales
                $("#totalCompra").html('TOTAL: '+total.toFixed(2)+' €');
                //Unbind para cortar los eventos sino se acumulan los clicks
                $(document).off('click.myNamespace');
                 $(document).on('click.myNamespace','#btnMinus',{param : -1},modificaCart);
                $(document).on('click.myNamespace','#btnPlus',{param : 1},modificaCart);               
                $(document).on('click.myNamespace','#btnDel',{param : 0},modificaCart);           
            } 
    }
	
	
	
	function onRecuperarValores(){
		var idProducto = $(this).attr("id");
		var nombreProducto = $(this).data("nombre");
		var imagen = $(this).children("img").attr("src");
		var precioVenta = $(this).data("precio");
		var cantidad = 1;
		//Llamamos a la función para insertar el producto
		addItem (idProducto,nombreProducto,imagen,precioVenta,cantidad);
	}
	
	
	//Función añadir producto
    function addItem (idProducto,nombreProducto,imagen,precioVenta,cantidad) {
		//Creamos la variable duplicado para evaluar si ya existe en el carrito
        var duplicado = false;
		//Creamos un nuevo objeto js con los parámetros recibidos
        var nuevoObjeto = {
            "idProducto": idProducto,
            "nombreProducto": nombreProducto, 
			"imagen" : imagen,
            "precioVenta": precioVenta,           
            "cantidad": cantidad
        };
		//Recuperamos el contenido del carrito el formato JSON
        var carrito = JSON.parse( sessionStorage.getItem( 'carrito' ) ); 
		//Recorremos
        for ( var i = 0; i < carrito.length; i++ ) {

            // Si existe
            if ( carrito[i].idProducto  == nuevoObjeto.idProducto  ) {

              //Modificamos cantidad
              carrito[i].cantidad += nuevoObjeto.cantidad;

              //Hay duplicados
              duplicado = true;
            }
        };
          // Si no hay duplicados se añade el objeto al carrito
        if ( !duplicado ) {
            carrito.push( nuevoObjeto );
        }
		//Guardamos el JSON convertido a string en una variable
        var stringCarro = JSON.stringify(carrito);
		//Guardamos esa variable en la sessionStorage
        sessionStorage.setItem('carrito',stringCarro);
		//Mostramos carrito
        displayCart();   
    }
	
	function modificaCart(event){
        //Recuperamos parámetro
        var x = event.data.param;
        var cart = JSON.parse( sessionStorage.getItem( 'carrito' ) );
        var pos = sessionStorage.getItem('posicion');
        var cantidad = cart[pos].cantidad;
        
        switch(x){
            case -1:
                
                cart[pos].cantidad = cantidad - 1;
                //Si el producto tiene cantidad 0 se borra
                if(cart[pos].cantidad == 0)cart.splice(pos,1);
                   
                
                break;

            case 1:
                //Incrementamos cantidad
                cart[pos].cantidad = cantidad + 1;
                
                break;

            case 0:
                //Eliminamos una posicion
                cart.splice(pos,1);                
                break;
        }
        
        sessionStorage.setItem('carrito',JSON.stringify(cart));
        displayCart();
        
    }
	
	
	

/*****************************************************************************************************/
/************************************ FINALIZAR COMPRA ***********************************************/
/*****************************************************************************************************/

    $("#btnFinalizarCompra").click(onFinalizarCompra);

    function onFinalizarCompra(){
        //Inhabilitamos el botón para evitar hacer doble click y hacer dos veces el mismo pedido
        $('#btnFinalizarCompra').prop('disabled', true);
        var tag = 'insertarPedido';
        var carrito = JSON.parse( sessionStorage.getItem( 'carrito' ) );

        if(carrito.length>0){
            $.ajax({
                type: "POST",
                datatype: "json",
                url : 'php/funciones.php',
                data : {'tag': tag,'carrito': carrito},
                success: guardarFinalizarCompra,
                timeout: 4000,
                error: errorFinalizarCompra                
            });
        }
        else{
            alert("No tiene ningún producto en su carrito.");

            //Habilitamos el botón
            $('#btnFinalizarCompra').prop('disabled', false);
        }
    }

    function errorFinalizarCompra(){
       alert("No se ha podido finalizar la compra.");
       $('#btnFinalizarCompra').prop('disabled', false);
    }

    function guardarFinalizarCompra(datos){
		if(datos!="false"){
			if(datos==1){
				alert("Pedido realizado correctamente. Gracias.");
				sessionStorage.removeItem('carrito');
				$('#shopping-cart').empty();
				creaCarrito();
			}
			else{
				alert("No se ha podido finalizar la compra.");
			}
		}
		else{
			alert("Error");
		}
        $('#btnFinalizarCompra').prop('disabled', false);
    }
 }   
    