$(function() {	

	var table;
	var tableOrdenada;
	var numRegistros;
	var regPorPagina = 10;
	var numPaginas;

	$.getJSON('json/data_melp.json', function(data) {
		table = data;
		tableOrdenada = ordenarDesc(table, 'rating'); 
		numRegistros = tableOrdenada.length;
		numPaginas = (numRegistros / regPorPagina);

		//iniciando(0);
		iniciando(0,9);
	});

	$('.mapa').click(function() {
		alert("sopa");
	});

/***********************************/
	function iniciando(iInicio, iFin) {
		$("#mi_tabla").empty();

		var tbencabezado = `<thead>
								<tr>
							 		<th>Rating</th>
							 		<th>Nombre</th>
							 		<th>Contacto</th>
							 		<th>Dirección</th>							 		
							 		<th></th>
							 	</tr>
							 </thead><tbody>`;

		$("#mi_tabla").append(tbencabezado);

		$.each(tableOrdenada, function(i,row) {			
			
			var r = "";
			if (i>=iInicio && i<= iFin) {
				
				elid = 'id' + i;
				$.each(row,function(index, valor) {
					
					if (index=="id") {						
						r= r+ "<tr>";					
					}
					else if ( index=="rating" ) {
						r = r + "<td class='name'>" + valor + "</td>";	
					}
					else if ( index=="name" ) {
						r = r + "<td class='name'>" + valor + "</td>";	
					}
					else if ( index == "contact") {
			            r = r + "<td><a target='_blank' href='" + valor.site + "'>" + valor.site + "</a><br>" + valor.email + "<br>" + valor.phone +"</td>";			          
			        }
			        else if ( index == "address") {
			            r = r + "<td>" + valor.street + ", " + valor.city + ", " + valor.state +"</td>";	 	
			        }
				});
				r+=  "<td><input type='button' class='mapa btn btn-primary btn-sm' value='Mapa' id='" + elid + "'></td>";   							 
				//r+= "<td><a href='http://www.google.com' class='mapa' id='" + elid + "'>" + elid+ "</a></td>";
				 r+=  "</tr>";
				
		        $("#mi_tabla").append(r);								
			}			
		});

		rr =  "</tbody>";
		$("#mi_tabla").append(rr);		
	}

/***********************************/
	function ordenarAsc(p_array_json, p_key) {
	   p_array_json.sort(function (a, b) {
	      return a[p_key] > b[p_key];
	   });
	}

	function ordenarDesc(p_array_json, p_key) {
	   ordenarAsc(p_array_json, p_key); 
	   return p_array_json.reverse(); 
	}
/***********************************/
	$(".page-link").click(function(event) {
		event.preventDefault();
		paginaActual = $(this).text();
		pIndex = 0;
		fIndex = pIndex + regPorPagina -1;

		console.log(paginaActual);

		if (paginaActual == '«') {
			$(".page-item").removeClass('active');
			$("li.page-item:nth-of-type(2)").addClass('active');
			$("#primero").addClass('disabled');
			$("#ultimo").removeClass('disabled');

			iniciando(pIndex, fIndex);

		} else if (paginaActual == 1) {
			$(".page-item").removeClass('active');
			$(this).parent().addClass('active');
			$("#primero").addClass('disabled');
			$("#ultimo").removeClass('disabled');

			iniciando(pIndex, fIndex);

		} else if ( paginaActual == '»') {
			$(".page-item").removeClass('active');
			$("li.page-item:nth-last-of-type(2)").addClass('active');		
			$("#primero").removeClass('disabled');
			$("#ultimo").addClass('disabled');

			iniciando(numRegistros-regPorPagina-1, numRegistros-1);

		} else if ( paginaActual == numPaginas) {
			$(".page-item").removeClass('active');
			$(this).parent().addClass('active');			
			$("#primero").removeClass('disabled');
			$("#ultimo").addClass('disabled');

			iniciando(numRegistros-regPorPagina-1, numRegistros-1);

		} else {
			$(".page-item").removeClass('active');
			$(this).parent().addClass('active');			
			$("#primero").removeClass('disabled');
			$("#ultimo").removeClass('disabled');

			iniciando(paginaActual*regPorPagina-regPorPagina, paginaActual*regPorPagina-1);
		}
	});

/***********************************/	
	$(document).on('click', '.mapa', function (event) {
		$("#elmapa").css('min-height', '500px');
	    var elid = $(this).attr('id');
	    var posicion = elid.substr(2);

	    var milat = tableOrdenada[posicion].address.location.lat;
	    var milng = tableOrdenada[posicion].address.location.lng;

	    var divMapa = document.getElementById('elmapa');
		navigator.geolocation.getCurrentPosition( fn_ok, fn_mal);
		function fn_mal() { }
		function fn_ok( rta ) {
			var lat = milat;
			var lon = milng;

			var gLatLon = new google.maps.LatLng( lat, lon );

			var objConfig = {
				zoom: 17,
				center: gLatLon
			}

			var gMapa = new google.maps.Map( divMapa, objConfig);
			var objConfigMarker = {
				position: gLatLon,
				map: gMapa,
				title: "Este es el sitio"
			}

			var gMarker = new google.maps.Marker( objConfigMarker );

		}
	    //alert(milat + '\n' + milng);
	});
});