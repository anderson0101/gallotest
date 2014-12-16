var db;
var sliderPromos;

/* Calendario */
    var yy;
    var calendarArray =[];
    var monthOffset = [6,7,8,9,10,11,0,1,2,3,4,5];
    var monthArray = [["ENE","Enero"],["FEB","Febrero"],["MAR","Marzo"],["ABR","Abril"],["MAY","Mayo"],["JUN","Junio"],["JUL","Julio"],["AGO","Agosto"],["SEP","Septiembre"],["OCT","Octubre"],["NOV","Noviembre"],["DIC","Diciembre"]];
    var letrasArray = ["LUN","MAR","MIER","JUEV","VIER","SAB","DOM"];
    var dayArray = ["7","1","2","3","4","5","6"];
    var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");

    /*************/

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        FastClick.attach(document.body);
        app.receivedEvent('deviceready');

        // Note: The file system has been prefixed as of Google Chrome 12:

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        //getParametersLinks


        console.log('Received Event: ' + id);       
        app.showLoading('show');

        app.initApp();
    },

    initApp: function() {
        database.initDatabase(function(isOk) {
            if (isOk) {
                app.firstLoadData();
                imagenes.init();
                uniqueid.init();
                


                app.sync("all",function(status) {
                     uniqueid.getUniqueDB(function(unico){
                        window.localStorage.setItem('sesionUnique_user_id', unico );
                        //alert("Hay unico iddb: "+unico);
                        app.usarPlugin(unico, app.make_base_auth(webServices.user, webServices.password), webServices.fiestasNoVistas, webServices.invNoVistas);

                     });

                    if (status)
                    {
                        console.log("Actualizado");
                        //imagenes.init();
                    }
                    else
                    {
                        console.log("No esta actualizado");
                    }
                        
                });
            }
            else {
                console.log("No se creo la base de datos");
            }
        });


    },

    //@return 1: nueva version, 0: misma version

    verifyVersion: function(callback){

        var actualizar=0;

       // console.log("INGRESANDO A VERIFICAR VERSION");
        database.selectVersion(function(results) {
        if (results !== null) {
            console.log("RESULTS NO ES NULO");
            if (results.rows.length == 0){
                console.log("RESULTS NO TRAE RESULTADOS");
                //actualizar = 0;
                //console.log("ACTUALIZAR:"+actualizar);
                app.alterVersion(1);
                app.firstLoadData();
                //app.showLoading("show");

                /*
                app.sync("images",function(status) { 
                    if (status)
                    {
                        app.showLoading("hide");
                        console.log("Actualizado");

                    }

                });
                */

                //app.showLoading("hide");
                callback(1); 
                //}); 
             
            }
            else{
                console.log("RESULTS TRAE RESULTADOS");
                var leng = results.rows.length; 
                var pos = leng-1;

                var row= results.rows.item(pos);
                //alert("row[version] = "+row['version']);
                //alert("ROW: "+JSON.stringify(row));
                console.log("info_version: "+row['id_db_versioning']+" - "+row['release_date']+" - "+row['version']);
                //alert("version param = "+row['id_db_versioning']);
                actualizar = app.verifyVersionWS(parseInt(row['version']));

                //alert(row['version']+"ultima? "+actualizar);
                if(actualizar == 0){
                    console.log("NO DEBO ACTUALIZAR");
                    callback(0);
                    //return actualizar;

                }
                else if(actualizar == 1){
                    console.log("DEBO ACTUALIZAR");
                    //app.firstLoadData();
                    //app.showLoading("show");
                    app.alterVersion(2);

                    /*
                    app.sync("images", function(status){
                        if (status) 
                        {
                             app.showLoading("hide");
                        }

                    });
                    */
                    app.showLoading("hide");
                    callback(1);
                    //return actualizar ;
                    /*
                    app.sync("all",function(status) { 
                        app.showLoading('hide');
                        if (status)
                        {
                            console.log("Actualizado");
                            //imagenes.downloadFile();
                            //imagenes.getWebImages();
                        }
                        else
                        {
                            console.log("No esta actualizado");
                        }
                            
                    }); 
                    */

                }
      
            }
                
        }
        else{
                    console.log("RESULTS ES NULO");
                    callback(1);
        }
    }); 
                    
                
    },

    verifyVersionWS: function(version){

                        var retornar = "";

                        $.ajax({
                        type: 'get',
                        url: webServices.newVersion+version, 
                        dataType: 'json',
                        async: false,
                        beforeSend: function (xhr) {                    
                            xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
                        },
                        success: function(data){
                                var version = data;
                                retornar = version.dbversion;
                                //alert("en verifyws ACTUALIZAR?: "+version.dbversion);
                                //console.log("ACTUALIZAR?: "+version.dbversion);

                        },
                        error: function(){
                            //console.log("ERROR VERIFYVERSIONWS");
                        }


                        });

                    return retornar;

    },
    updateVersion: function(id, fecha, version)
    {
        
        database.updateVersion([fecha,version,id ], function(isOk){});

    },

    insertVersion: function(id, fecha, version )
    {
        database.insertVersion([id, fecha, version], function(isOk){});
    },

    alterVersion: function(task){

                        $.ajax({
                        type: 'get',
                        url: webServices.listversiones,
                        dataType: 'json',
                        async: false,
                        beforeSend: function (xhr) {                    
                            xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
                        },
                        success: function (data) {
                            var versiones = data;

                            var tam = versiones.length;


                            //alert("Total versiones = "+tam);
                            //alert("INSERT DATA : "+versiones[tam-1].releaseDate+" , "+versiones[tam-1].idDbVersioning);
                            
                            switch(task)
                            {
                                case 1:
                                app.insertVersion(1, versiones[tam-1].releaseDate, versiones[tam-1].idDbVersioning );
                                break;

                                case 2:
                                app.updateVersion(1, versiones[tam-1].releaseDate, versiones[tam-1].idDbVersioning);
                                break;
                            }
                            /*
                            version.forEach(function(ob) {
                            alert("LISTVERSIONE = "+ ob.idDbVersioning+" , "+ob.version);
                            database.insertVersion([1, ob.releaseDate, ob.version], function(isOk){});
                            //database.insertVersion([ob.idDbVersioning, ob.releaseDate, ob.version], function(isOk){});
                            });
                            */ 
                    },
                    error: function() {
                        //console.log("getVERSION(), error obteniendo");
                    }
                });


    },



    firstLoadData: function() {
        database.countDepartamentos(  function(results) {
            var row = results.rows.item(0);
            if (parseInt ( row['Total']) <= 0 ) 
                 {
                 app.getDepartamentos();
                 console.log("get Deptos");
                 app.getMunicipios();
                 }  
           }); 
    },

    getDepartamentos: function() {
        $.ajax({
            type: 'get',
            url: webServices.listaDeptos,
            dataType: 'json',
            async: false,
            beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
            },
            success: function (data) {
                console.log("llego depto");
                var deptos = data;

                deptos.forEach(function(ob) {
                    database.selectDepartamento([ob.idDepartamento], function(results) {
                        if (results !== null) {
                            if (results.rows.length == 0)
                                database.insertDepartamento([ob.idDepartamento, ob.name], function(isOk) {});
                        }
                    }); 
                }); 
            },
            error: function() {
                console.log("getDepartamentos(), error obteniendo");
            }
        });
    },

    getMunicipios: function() {
        $.ajax({
            type: 'get',
            url: webServices.listaMuni,
            dataType: 'json',
            async: false,
            beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
            },
            success: function (data) {
                var municipios = data;

                municipios.forEach(function(ob) {
                    database.selectMunicipio([ob.idMunicipio], function(results) {
                        if (results !== null) {
                            if (results.rows.length == 0)
                                database.insertMunicipio([ob.idMunicipio, ob.name, ob.idDepartamento.idDepartamento], function(isOk) {});
                        }
                    });
                });
            },
            error: function() {
                console.log("getMunicipios(), error obteniendo");
            }
        });
    },

    getAleros: function() {
        app.showLoading("show");
        $.ajax({
            type: 'get',
            url: webServices.listaAlerosURL,
            dataType: 'json',
            async: false,
            beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
            },
            success: function (data) {
                aleros = data;
                if (aleros.length > 0) {
                    aleros.forEach(function(ob) {
                        database.selectAlero([ob.idAlero], function(results) {
                            if (results !== null) {
                                if (results.rows.length == 0)
                                    database.insertAlero([ob.idAlero, ob.name,ob.address,ob.phoneNumber,ob.latitude,ob.longitude,ob.photoPath,ob.idMunicipio.idMunicipio], function(isOk) {});
                            }
                        });                        
                    });
                }

                else {
                    console.log("Hay s&oacute:lo un alero");
                }
            },
            error: function() {
                console.log("getAleros(), error obteniendo");
            }
        });
    },

    getEventosGallo: function() {
        $.ajax({
            type: 'get',
            url: webServices.listaEventosGalloURL,
            dataType: 'json',
            async: false,
            beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
            },
            success: function (data) {
                var eventos = data;
                if (eventos.length > 0) {
                    eventos.forEach(function(ob) {
                        database.selectEventoGallo([ob.idEvent], function(results) {
                            if (results !== null) {
                                if (results.rows.length == 0) {
                                    database.insertEventoGallo([ob.idEvent, ob.name,ob.shortDescription,ob.description,ob.startAt,ob.endAt,ob.address,ob.latitude,ob.longitude,ob.idUser.idUser,ob.idEventType.idEventType,ob.status,ob.idMunicipio.idMunicipio, ob.imageEvent], function(isOk) {});    
                                }
                                /*else
                                    console.log("No es necesario insertar");*/
                            }
                        });
                    });
                }

                else {
                    console.log("Hay s&oacute:lo un evento");
                        database.selectEventoGallo([eventos.idEvent], function(results) {
                            if (results !== null) {
                                if (results.rows.length == 0) {
                                    database.insertEventoGallo([ob.idEvent, ob.name,ob.shortDescription,ob.description,ob.startAt,ob.endAt,ob.address,ob.latitude,ob.longitude,ob.idUser.idUser,ob.idEventType.idEventType,ob.status,ob.idMunicipio.idMunicipio, ob.imageEvent], function(isOk) {});    
                                }
                                /*else
                                    console.log("No es necesario insertar");*/
                            }
                        });
                }             
            },
            error: function() {
                console.log("getEventosGallo(), error obteniendo");
            }
        });
    },

    getPromociones: function() {
        //console.log("getPromociones()");
        $.ajax({
            type: 'get',
            url: webServices.listPromociones,
            dataType: 'json',
            async: false,
            beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
            },
            success: function (data) {
                var promociones = data;
                
                promociones.forEach(function(ob) {
                    //alert("Status= "+ob.status+", idPromo="+ob.idPromotion+" Description= "+ob.description+"  idAlero="+ob.idAlero.idAlero);
                    database.selectPromocionExist([ob.idPromotion], function(results) {
                        if (results !== null) {
                            if (results.rows.length == 0) {
                                database.insertPromocion([ob.idPromotion,ob.description,ob.photoPath,ob.startAt,ob.endAt,ob.idAlero.idAlero,ob.status], function(isOk) {});
                            } else {
                            
                            } 

                        }        
                    });
                });                
            },
            error: function() {
                console.log("getPromociones(), error obteniendo");
            }
        });
    },

    //Ver los detalles de Alero
    verDetalleAlero: function(idAlero) {
        if($('.content_prmos').is(':hidden')){
            $('.content_prmos').hide();
            $('.showhidePromos').html('Mostrar Promociones');
        }
        //console.log("verDetalleAlero(" + idAlero + ")");
        database.selectAlero([idAlero], function(results) {
            if (results !== null) {
                var server = webServices.server;
                //$.mobile.loading('show');
                var len = results.rows.length;
                var row= results.rows.item(0);
                

                var html = '';
                html += '<div class="nombre-alero">'+row['name']+'</div>';
                html += '<div class="direccion-alero">Direcci&oacute;n: '+row['address']+'</div>';
                html += '<div class="telefono-alero">Tel&eacute;fono: '+row['phone_number']+'</div>';
                //html += '<div class="descrip-alero">'+row['description']+'</div>'; 
                html += '<a class="showhidePromos typeButton buttonYellowBorder" onclick="app.getPromocionesDB('+ row['id_alero'] + ');">VER PROMOCIONES</a>';

                $(".info-alero").html(html);

                status = navigator.network.connection.type;

                if (navigator.network && status != "none") {   
                    var htmlImg = '<img class = "img-alero" src="' + server + row['photo_path']+'">'
                    //'<a href="#dialog" class="typeButton buttonYellow" data-transition="pop" onclick="slider();">Promociones</a>';    //Esto es de Diego, explicarle
                    $(".foto-alero").html(htmlImg);
                }
                //$.mobile.loading('hide');

                                // set latitude and longitude mapa
                googleMap.verMapa(row['latitude'], row['longitude'], 'map-canvas');
                //console.log(row['latitude'] + "," + row['longitude']);
                //console.log(server + row['photo_path']);

            }

            else {
                console.log("No hay nada que mostrar");
            }
        });

                        
        $.mobile.changePage($("#detallealero"), { transition: "slide" });        
    },

    //Mostrar Crear Evento Usuario
    showCreateEventUser: function() {
        database.selectDepartamentos(function(results) {
            if (results !== null) {
                var departamentos = $("#departamento-user-event");
                departamentos.empty();
                var len = results.rows.length;

                for (var i = 0; i < len; i++) {
                    var row= results.rows.item(i);
                    var htmlData = '';
                    htmlData  = "<option value='" + row["id_departamento"] + "'>" + row["name"] + "</option>";
                    departamentos.append(htmlData);
                }
            }

            else {
                console.log("No hay nada que mostrar");
            }
        });

        googleMap.drawMapCrearEvento(14.6262201, -90.4925604, 'map-event-canvas');
    },

    getMunicipioDB: function(idDepartamento) {
        //console.log("getMunicipioDB");
        database.selectMunicipioByDepartamento([idDepartamento], function(results) {
            if (results !== null) {
                var municipios = $("#municipio-user-event");
                municipios.empty();
                var len = results.rows.length;

                for (var i = 0; i < len; i++) {
                    var row= results.rows.item(i);
                    var htmlData = '';
                    htmlData  = "<option value='" + row["id_municipio"] + "'>" + row["name"] + "</option>";
                    municipios.append(htmlData);
                }
            }

            else {
                console.log("No hay nada que mostrar");
            }
        });
    },

 
    getAlerosDB: function(tx) {
        $.mobile.changePage($("#aleros"), { transition: "slide", allowSamePageTransition: true });
        app.showLoading("show");
        $( "#aleros" ).on( "pageshow", function( event ) {
        app.sync("aleros",function(status) {
            
            if (status)
                console.log("Actualizado");
            else
                console.log("No esta actualizado");

            database.selectAleros(function(results) {
                if (results !== null) {
                    var alerosContainer = $(".alerosContainer");
                    app.showLoading("show");
                    alerosContainer.empty();
                    var len = results.rows.length;

                    for (var i = 0; i < len; i++) {
                        var row= results.rows.item(i);
                        current_class = "";
                        if (i == 0) {
                            current_class = "ui-first-child";
                        }

                        if (i==len-1) {
                            current_class += " ui-last-child";
                        }

                        var htmlData = '';
                        htmlData += '<li class="'+current_class+'">';
                            htmlData += '<a onclick="app.verDetalleAlero('+row['id_alero']+');" href="#" data-idalero="'+row['id_alero']+'" class="ui-btn ui-icon-carat-r content-alero">';
                                htmlData += '<div class="descripcion">';
                                    htmlData += '<div class="nombre">'+row["name"]+'</div>';
                                    htmlData += '<div class="lugar">'+row["municipio"]+', '+row["departamento"]+'</div>';
                                htmlData += '</div>';
                            htmlData += '</a>';
                        htmlData += '</li>';
                        alerosContainer.append(htmlData);
                    }
                    app.showLoading("hide");
                }

                else {
                    console.log("No hay nada que mostrar");
                }
            });
        });
      });

    
    },

    getEventosGalloDB: function(tx) {
        var elements = {};
        var params = [];
        
        $.mobile.changePage($("#quesigalafiesta"), { transition: "slide", allowSamePageTransition: true });
        app.showLoading("show");
        $( "#quesigalafiesta" ).on( "pageshow", function( event ) { 
        app.sync("eventosGallo",function(status) {
            app.showLoading("show");


        var id_user_sesion =  app.getUserLogId();

        app.usarPlugin(id_user_sesion,app.make_base_auth(webServices.user, webServices.password), webServices.fiestasNoVistas, webServices.invNoVistas);
        
            if (status)
                console.log("Actualizado");
            else
                console.log("No esta actualizado");

            database.selectEventosGallo(function(results) {
                if (results !== null) {
                    var eventosGalloContainer = $(".eventosGalloContainer");
                    eventosGalloContainer.empty();                    

                    //$.mobile.loading('show');
                    var len = results.rows.length;
                    if (len > 0)
                        console.log("Hay eventos Gallo en la base de datos")
                    else
                        console.log("No hay eventos Gallo en la base de datos")

                    
                    for (var i = 0; i < len; i++) {
                        var row= results.rows.item(i);
                        current_class = "";
                        if (i == 0) {
                            current_class = "ui-first-child";
                        }

                        if (i == len - 1) {
                            current_class += " ui-last-child";
                        }

                        elements[row["id_event"]] = row["name"];

                        //Obtener fechas
                        var date = app.getDate(row["start_at"]);
                        var time = date[0];;
                        var day = date[1];
                        var month = date[2];
                        var year = date[3];
                        
                        var descripcion = row['description'];
                        var descr = descripcion.substring(0, 26);
                        if (descr.length > 25) 
                        {
                            descr+= "...";
                        }


                        var htmlData = '';
                        htmlData += '<li id="evento-'+row["id_event"]+'" class="'+current_class+'">';
                            htmlData += '<a onclick="app.verDetalleFiestaGallo('+row["id_event"]+')" href="#"  data-idalero="'+row['id_event']+'" class="ui-btn ui-icon-carat-r content-peviewevent">';
                                htmlData += "<div class='parentEventosGallo' >";
                                    htmlData += '<div class="date">';
                                        htmlData += '<div class="diames">' + month + ' '  + day + '</div>';
                                        htmlData += '<div class="hora">' + year + ', ' + time + '</div>';
                                    htmlData += '</div>';
                                    htmlData += '<div class="event">';
                                        htmlData += '<div class="nombre">'+row["name"]+'</div>';
                                        htmlData += '<div class="descripcion">';
                                            htmlData += '<span>' + descr+ '</span>' +  row["municipio"] + ' ' + row["departamento"];
                                        htmlData += '</div>';
                                    htmlData += '</div>';

                                htmlData += "</div>";
                            htmlData += '</a>';
                        htmlData += '</li>';
                        eventosGalloContainer.append(htmlData);                                              
                    }
                    app.getMisFiestasDB();
                    app.getMisInvitacionesDB();
                    app.showLoading('hide');                    
                }

                else {
                    console.log("No hay nada que mostrar");
                }
            });
        });
      });
                 
    },

    imageExists: function(url, callback)
    {

      var img = new Image();
      img.onload = function() { callback(true); };
      img.onerror = function() { callback(false); };
      img.src = url;
    },

   

    getPromocionesDB: function(idAlero) {
        app.showLoading("show");       
        database.selectPromociones([idAlero], function(results) {
            var server = webServices.server;
            if (results !== null) {

                //imagenes.showAllPromos(idAlero);

                var html = "";
                var promos = results.rows.length;
                console.log("NO. Promo:"+results.rows.length);
                html += '<ul class="slide-horizontal clearfix">';

                //alert(promos);
                for (var i = 0; i < promos; i++) {
                    var row= results.rows.item(i);

                    if (row['status'] == 1) 
                    {

                    html += '<li>';
                        html += '<img src="' + server + row['photo_path'] + '" alt="" />';
                        html += "<br/>";
                    html += '</li>';
                    }

                    /* 
                    $.ajax({
                    url: server + row['photo_path'],
                    type:'HEAD',
                    async: false,
                    error: function()
                    { 
                        html += '<img src="' + server + 'img/Promotion/1.jpg" alt="" />';
                    },
                    success: function()
                    {
                       html += '<img src="' + server + row['photo_path'] + '" alt="" />';
                       console.log(server+row['photo_path']);
                    }
                    });
                    */

                    
                }
                html += '</ul>';
                //alert(html);

                if(sliderPromos !== undefined) {
                    sliderPromos.destroySlider();
                    sliderPromos=undefined;
                    
                    $("ul.slide-horizontal").html('');
                }
                
                $(".content_prmos").html('');
                $(".content_prmos").html(html);
                sliderPromos = jQuery('.slide-horizontal').bxSlider({
                    pager: false,
                    auto: true,
                    autoStart: true,
                    mode: 'fade',
                    adaptiveHeight: true,
                    maxSlides: 1,
                    preloadImages: true
                });
            }

            else {
                console.log("No hay nada que mostrar");
            }
            
            $(".content_prmos").slideToggle('slow', function() {
                if($(this).is(':hidden')) {
                    $('.showhidePromos').html('PROMOCIONES');
                } else {
                    $('.showhidePromos').html('OCULTAR PROMOCIONES');
                    sliderPromos.reloadSlider();
                }
                app.showLoading("hide");
            });
        });
    },

    usarPlugin: function(user,token, fiestasView, wsNoInv) {
        var success = function(success) { console.log("Exito " + success); };
        var error = function(error) { console.log("Fracaso " + error); };
        
        //var versionDB = app.verifyVersion();
        /*  if(versionDB==null){
            versionDB = 1;
        }
        */
        app.verifyVersion(function(result){
            console.log("******"+result);
            var params = [user, token, fiestasView, wsNoInv, result];
            fiesta.check(params, success, error);
        });

        
    },

    getDate: function(longDate) {
        var months = new Array();
        months[0] = "Enero";
        months[1] = "Febrero";
        months[2] = "Marzo";
        months[3] = "Abril";
        months[4] = "Mayo";
        months[5] = "Junio";
        months[6] = "Julio";
        months[7] = "Agosto";
        months[8] = "Septiembre";
        months[9] = "Octubre";
        months[10] = "Noviembre";
        months[11] = "Diciembre";

        var date = new Date(longDate);
        var hours = date.getUTCHours();
        var minutes = date.getUTCMinutes();
        var month = months[date.getMonth()];
        var day = date.getDate();
        var year = date.getFullYear();
        var time;

        if (minutes < 10)
            minutes = '0' + minutes;

        if ((hours > 11) && (hours < 24))
            time = hours + ':' + minutes + ' PM';
        else
            time = hours + ':' + minutes + ' AM';
        
        return [time, day, month, year];
    },

    sync: function(type,callback) {
        status = navigator.network.connection.type;
        app.showLoading('show');
        if (navigator.network && status != "none") {          
            
            calendarArray = [];
           
            if ( type == "eventosGallo" ) {
                app.getEventosGallo();
                app.getMisInvitaciones();
                app.getMisFiestas();
                app.getUserEvents();
                console.log("eventos gallo");
            } else if ( type == "aleros" ) {
                app.getAleros();
                app.getPromociones();
                console.log("aleros");
            } else if ( type == "calendario" ) {
                app.getEventosGallo();
                app.getMisInvitaciones();
                app.getMisFiestas();
                app.getUserEvents();
                console.log("calendario");
            } else if ( type == "all" ) {
 
                app.getAleros();
                app.getPromociones();
                app.getEventosGallo();
                app.getMisInvitaciones();
                app.getMisFiestas();
                app.getUserEvents();

                /// sync images
                app.verifyVersion(function(result){
                    if (result == 1) 
                    {    
                        app.showLoading('show');            
                        imagenes.getWebBackgrounds();
                        imagenes.getParameters();

                    }


                });
                
                console.log("all");
            }

            else if (type == "images") 
            {

                /// sync images
                app.showLoading('show'); 
                imagenes.getWebBackgrounds();
                imagenes.getParameters();
                
            }



            
            
            callback(true);
        }

        else {
            //alert("Tiene Problemas de Conexión");
            callback(false);
        }
    },

    showLoading: function(showOrHide) {
        console.log(showOrHide);
        $.mobile.loading( showOrHide, {
            text: 'Loading...',
            textVisible: true,
            theme: 'b',
             html: "<div class='loader-panel'></div>" 
        });
    },

    /// mostrar informacion de FIESTA GALLO
    verDetalleFiestaGallo: function(idFiestaGallo) {
        //console.log("verDetalleAlero(" + idAlero + ")");
        database.selectEventoGallo([idFiestaGallo], function(results) {
            if (results !== null) {
                var server = webServices.server;
                var len = results.rows.length;
                var row= results.rows.item(0);

                app.updateFiestaEventViewUser(idFiestaGallo);

                var det = '';
                det += '<div class="nombre-fiesta-gallo">'+row['name']+'</div>';
                det += '<div class="direccion-fiesta-gallo">Direcci&oacuten: '+row['address']+'</div>';
                det += '<div class="descrip-fiesta-gallo" >'+row['description']+'</div>';  //Aqui tiene que ir la descripci&oacute:n

                //$(".info-fiesta-gallo").html(html);
                //var aqui = $(".info-fiesta-gallo").html();
                
                console.log("ASISTIR:"+row['asistir']); 
                   
                if (row['asistir'] == undefined) {
                    var asis = 0;
                } else {
                    var asis = row['asistir'];
                }

                status = navigator.network.connection.type;

                if (navigator.network && status != "none") {
                        var htmlImg = '<img class = "img-fiesta-gallo" src="' + server + row['image_event']+'">' ;
                        if (app.getUserLogId() > 0) {
                        if ( (asis == 1) || (asis == 2) ) {
                            var conf = '<div class="event_lis"  style="position: relative;">';
                            conf += '<a href="#dialog" data-transition="pop" id="btnAsistirFiesta" onclick="app.confirmarAsistenciaEventoGallo(' + idFiestaGallo + ');" asistir="'+asis+'"><div class="infCenter"><img src="img/icon_eventos3.png" ><span class="noAsistire">CONF. ASISTENCIA</span><img id="txtConfirmar" class="check" src="img/check.png"></div></a>';
                            conf += '</div>';
                        } else if (asis == 0){
                            var conf = '<div class="event_lis"  style="position: relative;">';
                            conf += '<a href="#dialog" data-transition="pop" id="btnAsistirFiesta" onclick="app.confirmarAsistenciaEventoGallo(' + idFiestaGallo + ');" asistir="'+asis+'"><div class="infCenter"><img src="img/icon_eventos3.png" ><span class="noAsistire">CONF.ASISTENCIA</span><img id="txtConfirmar" class="check" src="img/check.png"></div></a>';
                            conf += '</div>';
                        }
                        }
                        
                        
                        twFb = '<a href="#dialog" class="typeButton buttonYellow" data-transition="pop" onclick="window.plugins.socialsharing.shareViaTwitter(\'¡Promociones, ofertas y los mejores eventos con la mejor cerveza!.\', null, linkSO)">Twitter</a>&nbsp;';
                        twFb += '<a class="typeButton buttonYellow" data-rel="popup" data-position-to="window"  onclick="window.plugins.socialsharing.shareViaFacebook(\'¡Promociones, ofertas y los mejores eventos con la mejor cerveza!.\', null, linkSO)">Facebook</a>';
                        //twFb += '<a class="typeButton buttonYellow" data-rel="popup" data-position-to="window"  onclick="misFuncionesFB.showModalShare(1);">Facebook</a>';
                        
                        /*inv  = '<a class="typeButton buttonYellow" data-rel="popup" data-position-to="window" onclick="misFuncionesFB.getFriendsFB();" >Invitar</a>';*/
                        inv = '<a class="typeButton buttonYellow" data-rel="popup" data-position-to="window" onclick="invitacionesApp.getFriendsOnApp(invitacionesApp.getAllUsers('+idFiestaGallo+'));" >Invita a tus amigos</a>';
                    
        
                    
                    $(".foto-fiesta-gallo").html(htmlImg);
                    $("#eveGalloDetalle").html(det).hide();
                    $("#fbTwCompartir").html(twFb).hide();
                    $("#invFiestaBotones").html(inv).hide();
                    $("#confAsistencia").html(conf);

                    if (asis == 0){ 
                        $("#txtConfirmar").hide();    
                    }
                    //$('#boton-redes').html(botones);
                }
                //$.mobile.loading('hide');

                // set latitude and longitude mapa
                googleMap.verMapa(row['latitude'], row['longitude'], 'map-canvas-fiesta-gallo');
                console.log(row['latitude'] + "," + row['longitude']);
            }

            else {
                console.log("No hay nada que mostrar");
            }
        });

                        
        $.mobile.changePage($("#detallefiesta_gallo"), { transition: "slide" });        
    },



    getFechasDB: function(tx) {
        $.mobile.changePage($("#calendario"), { transition: "slide", allowSamePageTransition: true });
        app.showLoading("show");
        $( "#calendario" ).on( "pageshow", function( event ) {  
        

        var elements = {};
        var params = [];

        app.sync("calendario",function(status) {
            if (status)
                console.log("Actualizado");
            else
                console.log("No esta actualizado");

            
/*** Eventos Gallo ***************/

            ///IDUSER = 1
            database.selectEventosGallo(function(results) {
                if (results !== null) {
                 
                    var len = results.rows.length;
                    if (len > 0)
                        console.log("Hay eventos Gallo en la base de datos")
                    else
                        console.log("No hay eventos Gallo en la base de datos")

                    
                    for (var i = 0; i < len; i++) {
                        var row= results.rows.item(i);
                        
                        var ds = new Date(row["start_at"]);
                        var di = new Date(row["end_at"]);

                        var timeDiff = Math.abs(di.getTime() - ds.getTime());
                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                        var diffDays = diffDays - 1; 
                        
                        if (diffDays == 0) {
                            var day   = di.getDate();
                            var month = di.getMonth()+1;
                            var year  = di.getFullYear();
                            var date_end = ""+year+month+day;

                            var tempdayarray = [];
                            var tempeventarray = [];
                            
                            tempeventarray["id"] = row["id_event"];
                            tempeventarray["type"] = row["id_event_type"];
                            tempdayarray.push(tempeventarray);
    
                            calendarArray[date_end] = tempdayarray;
                        } else {
                            var newd = ds;
                            for (var i = 0; i <= diffDays; i++) {
                                var day   = newd.getDate();
                                var month = newd.getMonth()+1;
                                var year  = newd.getFullYear();
                                var date_end = ""+year+month+day;

                                var tempdayarray = [];
                                var tempeventarray = [];
                                
                                tempeventarray["id"] = row["id_event"];
                                tempeventarray["type"] = row["id_event_type"];
                                tempdayarray.push(tempeventarray);
        
                                calendarArray[date_end] = tempdayarray;

                                newd = new Date(newd.getTime() + (1 * 24 * 3600 * 1000));
                            }
                        }   
                    }   
                    calendarSet();
                    app.showLoading("hide");                  
                            
                }

                else {
                    console.log("No hay nada que mostrar");
                }
            });
            
            var user_fb= app.getUserLogId();
            //alert(user_fb);

            /*** Mis Fiestas ***************/
            if(user_fb!=0) {  // Si esta logueado
            app.showLoading("show");         

            ///IDUSER = 1
            database.selectMisEventos(function(results) {
                if (results !== null) {
                    var len = results.rows.length;
                    if (len > 0)
                        console.log("Hay eventos Gallo en la base de datos")
                    else
                        console.log("No hay eventos Gallo en la base de datos")

                    
                    for (var i = 0; i < len; i++) {
                        var row= results.rows.item(i);
                       
                        //llenar
                        if (row['status'] != 0)  {

                        var di = new Date(row["end_at"]);

                        var day   = di.getDate();
                        var month = di.getMonth()+1;
                        var year  = di.getFullYear();
                        var date_end = ""+year+month+day;

                        var tempdayarray = [];
                        var tempeventarray = [];
                        
                        tempeventarray["id"] = row["id_event"];
                        tempeventarray["type"] = row["id_event_type"];
                        tempdayarray.push(tempeventarray);

                        calendarArray[date_end] = tempdayarray;
                        }
                  
                    }   
                    calendarSet();
                    app.showLoading("hide"); 
                               
                }

                else {
                    console.log("No hay nada que mostrar");
                }
            });

        }
           

        });  
        });

    },

    /********** fin calendario *********/


    /// mostrar informacion de MI FIESTA
    verDetalleMiFiesta: function(idMiFiesta) {
        //console.log("verDetalleAlero(" + idAlero + ")");
        database.selectMiEvento([idMiFiesta], function(results) {
            if (results !== null) {
                var server = webServices.server;
                //$.mobile.loading('show');
                var len = results.rows.length;
                var row= results.rows.item(0);

                var html = '';
                html += '<div class="nombre-mifiesta">'+row['name']+'</div>';
                html += '<div class="direccion-mifiesta">Direcci&oacuten: '+row['address']+'</div>';
                html += '<div class="descrip-mifiesta">'+row['description']+'</div>';  //Aqui tiene que ir la descripci&oacute:n

                $(".info-mifiesta").html(html);
                var aqui = $(".info-mifiesta").html();
                console.log("Agregado? " + aqui);

                status = navigator.network.connection.type;

                if (navigator.network && status != "none") {   
                    var botones ='';
                    botones += '<div class="btns_compartir">';
                        botones += '<a href="#dialog" class="typeButton buttonYellow" data-transition="pop" onclick="app.cancelarMiFiesta('+ row['id_event'] + ');">Cancelar Evento</a>&nbsp;';
                        botones += '<a href="#dialog" class="typeButton buttonYellow" data-transition="pop" onclick="window.plugins.socialsharing.shareViaTwitter(\'¿Qué esperas para vivir lo mejor del mundo artístico a nivel nacional e internacional?\', null, linkSO)">Twitter</a>&nbsp;';
                        botones += '<a class="typeButton buttonYellow" data-rel="popup" data-position-to="window"  onclick="window.plugins.socialsharing.shareViaFacebook(\'¿Qué esperas para vivir lo mejor del mundo artístico a nivel nacional e internacional?\', null, linkSO)">Facebook</a>';
                        //botones += '<a class="typeButton buttonYellow" data-rel="popup" data-position-to="window"  onclick="misFuncionesFB.showModalShare(2);">Facebook</a>';
                        
                        /*botones += '<a class="typeButton buttonYellow" data-rel="popup" data-position-to="window" onclick="misFuncionesFB.getFriendsFB();" >Invitar</a>';*/
                        botones += '<a class="typeButton buttonYellow" data-rel="popup" data-position-to="window" onclick="invitacionesApp.getFriendsOnApp(invitacionesApp.getAllUsers('+idMiFiesta+'));" >Invita a tus amigos</a>';
                    botones += '</div>';

                    $('#boton-redes-mifiesta').html(botones);
                }
                //$.mobile.loading('hide');

                // set latitude and longitude mapa
                //
                googleMap.verMapa(row['latitude'], row['longitude'], 'map-canvas-mifiesta');
                console.log(row['latitude'] + "," + row['longitude']);
            }

            else {
                console.log("No hay nada que mostrar");
            }
        });

                        
        $.mobile.changePage($("#detalle_mifiesta"), { transition: "slide" });        
    },

    printBotonesConexion: function()
    {
        //var loginTw = '<a href="#" class="ui-shadow ui-btn ui-corner-all">Conecatar con twitter</a>';
        var loginTw = '<li>';
                loginTw += '<a class="btn_crearperfil btn_twitter" href="#" >';
                    loginTw += '<span id="fb-text-login" >Conectate con twitter</span>';
                    loginTw += '<i class="icon-btn icon-twitter"></i>';
                loginTw += '</a>';
            loginTw += '</li>';
            
        //var loginFb = '<button class="ui-shadow ui-btn ui-corner-all"  id="boton-login" onclick="misFuncionesFB.login()"> <span id="fb-text-login" >Login with Facebook<span></button>';
        var loginFb = '<li>';
                loginFb += '<a class="btn_crearperfil btn_facebook" href="#" onclick="misFuncionesFB.login()" style=" border: 1px solid #3664A2 !important;">';
                    loginFb += '<span id="fb-text-login" >Conectarte con Facebook</span>';
                    loginFb += '<i class="icon-btn icon-facebook"></i>';
                loginFb += '</a>';
            loginFb += '</li>';
            
        //var crearPerfil = '<button class="ui-shadow ui-btn ui-corner-all" onclick="app.gotoInsertUser()" >Crear perfil</button>';
        var crearPerfil = '<li>';
                crearPerfil += '<a class="btn_crearperfil" href="#" onclick="app.gotoInsertUser()">';
                    crearPerfil += 'Crea tu perfil';
                    crearPerfil += '<i class="icon-btn icon-user"></i>';
                crearPerfil += '</a>';
            crearPerfil += '</li>';
            
        //var loginManual = '<button class="ui-shadow ui-btn ui-corner-all" onclick="app.gotoLoginManual()" >Login</button>';
        var loginManual = '<li>';
                loginManual += '<a class="btn_crearperfil" href="#" onclick="app.gotoLoginManual()">';
                    loginManual += 'Iniciar sesi&oacute;n';
                    loginManual += '<i class="icon-btn icon-user"></i>';
                loginManual += '</a>';
            loginManual += '</li>';
        
        //var bugBoton = '<button class="ui-shadow ui-btn ui-corner-all" onclick="app.printAccessToken()" >BOTON X</button>';
        var bugBoton = '';
        
        var botonLogout = '';
        var botones = '';

        /// revisar que conexion esta activa, por las variables de sesion fb y manual
        var sFB = window.localStorage.getItem('sesionFB');
        var sMA = window.localStorage.getItem('sesionM');

        var params = {};

        if(sFB == 1)
        {
            /// hay conexion fb, LogOutFB
            //botones = '<button class="ui-shadow ui-btn ui-corner-all"  id="boton-login" onclick="misFuncionesFB.logout()"> <span id="fb-text-login" >Log out<span></button>';
            botones = '<li>';
                botones += '<a class="btn_crearperfil btn_facebook" href="#" onclick="misFuncionesFB.logout()">';
                    botones += '<span id="fb-text-login" >Cerrar sesi&oacute;n</span>';
                    botones += '<i class="icon-btn icon-facebook"></i>';
                botones += '</a>';
            botones += '</li>';
            
            params.logued = true;
            params.count = 'FB';
            params.user = window.localStorage.getItem('sesionFB_user');


            $('#botones_conexion_invitaciones ul.list_buttons').html("");
            $('#botones_conexion_misfiestas ul.list_buttons').html("");

            app.fillOwnData(params);
        }
        else if (sMA == 1)
        {
            /// hay conexion manual, LogOutM
            //botones = '<button class="ui-shadow ui-btn ui-corner-all"  id="boton-loginM" onclick="app.logoutUserMovilManual()"> <span id="fb-text-loginM" >Log outM<span></button>';
            botones = '<li>';
                botones += '<a class="btn_crearperfil" href="#" onclick="app.logoutUserMovilManual()">';
                    botones += 'Cerrar sesi&oacute;n';
                    botones += '<i class="icon-btn icon-user"></i>';
                botones += '</a>';
            botones += '</li>';
            
            params.logued = true;
            params.count = 'MA';
            params.user = window.localStorage.getItem('sesionM_user');
            app.fillOwnData(params);
        }
        else
        {
            /// imprimir todos los botones de conexion

            botones += loginFb ;// loginTw + loginFb + crearPerfil + loginManual;
            params.logued = false;
            params.count = null;
            params.user = null;
            app.quitOwnData();
            $('#botones_conexion_invitaciones ul.list_buttons').html(loginFb);
            $('#botones_conexion_misfiestas ul.list_buttons').html(loginFb);
        }

        $('#botones-conexion ul.list_buttons').html(botones+bugBoton);
    },

    printAccessToken: function()
    {
        try
        {
            var tokenAcces = window.localStorage.getItem('sesionFB');
        }
        catch(err)
        {
            var tokenAcces = -3;
        }
    },
    
    loginUserMovilFB: function(datafb)
    {
        app.showLoading("show");    
        $.ajax({
            type: 'get',
            url: webServices.validateUserLoginFB+datafb.id,
            dataType: 'json',
            async: false,
            beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
            },
            success: function (resul) {
                    var user_id = parseInt(resul.idUser);
                    console.log(JSON.stringify(resul));
                    console.log(user_id);
                    // EXISTE
                    if (user_id != 0) 
                    {
                        window.localStorage.setItem('sesionFB',1);
                        window.localStorage.setItem('sesionFB_user',datafb.id);
                        ///window.localStorage.setItem('sesionFB_user_id', user_id );
                        var uniqueid = window.localStorage.getItem('sesionUnique_user_id');
                        window.localStorage.setItem('sesionFB_user_id', user_id );
                        
                        app.usarPlugin(user_id,app.make_base_auth(webServices.user, webServices.password), webServices.fiestasNoVistas, webServices.invNoVistas);
                        console.log("setting java params");

                        app.printBotonesConexion();
                        $.mobile.changePage($("#home"), { transition: "slide" });
                        console.log("logueado FB");

                        //app.getEventosGalloDB();
                        //app.getMisInvitacionesDB();
                    }
                    // NO EXISTE
                    else
                    {
                        console.log("En else");
                        var new_user_id = app.saveUserMovilFB(datafb);
                        console.log(new_user_id);
                        //alert("nuevo iduser = "+new_user_id);

                        if (new_user_id != 0)
                        {
                        window.localStorage.setItem('sesionFB',1);
                        window.localStorage.setItem('sesionFB_user',datafb.id);
                        ///window.localStorage.setItem('sesionFB_user_id', new_user_id );
                        var uniqueid = window.localStorage.getItem('sesionUnique_user_id');
                        window.localStorage.setItem('sesionFB_user_id', uniqueid );
                          
                        app.usarPlugin(new_user_id,app.make_base_auth(webServices.user, webServices.password), webServices.fiestasNoVistas, webServices.invNoVistas);
                        console.log("setting java params");

                        app.printBotonesConexion();
                        $.mobile.changePage($("#home"), { transition: "slide" });
                        console.log("NUEVO FB");
                        }
                    }

                

                ///--- END, CONDICION TEMPORAL
            },
            error: function() {
                $('#showLoginErrorRedes').click();
                console.log("loginMovilFB (), error obteniendo");
            }
        });
        app.showLoading("hide");  


    },

    saveUserMovilFB: function(datafb)
    {
        app.showLoading("show");

        try
        {

            var cumple = datafb.birthday; //mm/dd/aaaa
            //necesita aaaa-mm-dd
            var cumple2 = cumple.split('/');
            var a = cumple2[2]; 
            var m = cumple2[0];
            var d = cumple2[1];
            
            var cumple3 = ''+a+'-'+m+'-'+d+'';

        }
        catch (err)
        {
            var cumple3 = ''+'2014'+'-'+'09'+'-'+'28'+'';            
        }

        try
        {
            var nw_id =0;

            var data =   { birth: cumple3+"T00:00:00-06:00",
                           fbEmail: datafb.email,
                           idUser: window.localStorage.getItem('sesionUnique_user_id'),
                           fbId: datafb.id,
                           idUsertype: {
                            idUsertype: 2
                           },
                           name: datafb.first_name+' '+datafb.last_name,
                           registerDate: app.getDateWS(),
                           status: 1,
                           twId: "",
                           uid: " "
                         };

            var jdata = JSON.stringify(data);

            $.ajax({
                type: 'put',
                contentType: 'application/json',
                url: webServices.updateUser+window.localStorage.getItem('sesionUnique_user_id'),  
                data: jdata,
                dataType: 'json',
                async: false,
                beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
                },
                success: function (result)
                 {
                    if (result.existeUnico == 1) {
                        console.log("Update User-> " +result.idUser);
                        nw_id = result.idUser;
                    
                        if (nw_id != 0) 
                        {
                            console.log("Retornara "+nw_id);
                        }
                        else 
                        {
                            console.log("Retornara cero");
                        }
                    }
                     
                },
                error: function() {
                    console.log("insertUsuario(), error obteniendo");
                }
            });
            return nw_id;
    
        }
        catch(e)
        {
            return 0;
        }
        app.showLoading("hide");

        
    },

    saveUserMovilManual: function()
    {
        var name = $('input#addUser-name').val();
        var email = $('input#addUser-email').val();
        var born = $('input#addUser-born').val(); //AAAA-MM-DD
        
        var data =   { birth: born+"T00:00:00-06:00",
                       email: email,
                       idUsertype: {
                       idUsertype: 2
                       },
                       name: name,
                       registerDate: app.getDateWS(),
                       status: 1
                    };

        var jdata = JSON.stringify(data);
        
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: webServices.setUser,
            dataType: 'json',
            data: jdata,
            async: false,
            beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
            },
            success: function (result) {
                //alert(result.idUser);
            },
            error: function() {
                console.log("insertUsuario(), error obteniendo");
            }
        });
        

    },

    loginUserMovilManual: function()
    {
        var name = $('input#loginUser-name').val();
        var email = $('input#loginUser-email').val();

        ///variable temporal simulando la respuesta de xml
        var validUser = false;
        var user = name;
        
        if(name =="a" && email=="a")
            validUser= true;

        if(validUser)
        {
            window.localStorage.setItem('sesionM', 1);
            window.localStorage.setItem('sesionM_user', user);

            app.printBotonesConexion();
            $.mobile.changePage($("#home"), { transition: "slide" }); 
        }
        else
        {
            $('#showLoginError').click();
        }

    },
    logoutUserMovilManual: function()
    {
            window.localStorage.setItem('sesionM', 0);
            window.localStorage.setItem('sesionM_user', null);
            app.printBotonesConexion();

            $.mobile.changePage($("#home"), { transition: "slide" }); 
            
    },

    gotoInsertUser: function()
    {
        $.mobile.changePage($("#forminsertuser"), { transition: "slide" });   
    },
    gotoLoginManual: function()
    {
        $.mobile.changePage($("#viewLoginManual"), { transition: "slide" });  
    },

    
    getMisFiestasDB: function(tx) {
        var elements = {};
        var params = [];

             database.selectMisEventos(function(results) {
                if (results !== null) {
                    var eventosGalloContainer = $(".eventosUsuarioContainer");
                    eventosGalloContainer.empty();                    

                    //$.mobile.loading('show');
                    var len = results.rows.length;
                    if (len > 0)
                        console.log("Hay mis fiestas en la base de datos")
                    else
                        console.log("No hay eventos mios en la base de datos")

                    
                    for (var i = 0; i < len; i++) {
                        var row= results.rows.item(i);
                        current_class = "";
                        if (i == 0) {
                            current_class = "ui-first-child";
                        }

                        if (i == len - 1) {
                            current_class += " ui-last-child";
                        }

                        console.log("Insertando localmente y agregar al servicio")
                        elements[row["id_event"]] = row["name"];

                        //Obtener fechas
                        var date = app.getDate(row["start_at"]);
                        var time = date[0];;
                        var day = date[1];
                        var month = date[2];
                        var year = date[3];
                        
                        var descripcion = row['description'];
                        var descr = descripcion.substring(0, 26);

                        if (descr.length > 25) 
                        {
                            descr+= "...";
                        }


                        var htmlData = '';
                        htmlData += '<li id="evento-'+row["id_event"]+'" class="'+current_class+'">';
                            htmlData += '<a onclick="app.verDetalleMiFiesta('+row["id_event"]+')" href="#"  data-idalero="'+row['id_event']+'" class="ui-btn ui-icon-carat-r content-peviewevent">';
                              htmlData += '<div class="parentEventosUsuario">'
                                htmlData += '<div class="date">';
                                    htmlData += '<div class="diames">' + month + ' '  + day + '</div>';
                                    htmlData += '<div class="hora">' + year + ', ' + time + '</div>';
                                htmlData += '</div>';
                                htmlData += '<div class="event">';
                                    htmlData += '<div class="nombre">'+row["name"]+'</div>';
                                    htmlData += '<div class="descripcion">';
                                        htmlData += '<span>' + descr+ '</span>' +  row["municipio"] + ' ' + row["departamento"];
                                    htmlData += '</div>';
                                htmlData += '</div>';

                              htmlData += '</div>';                                
                            htmlData += '</a>';
                        htmlData += '</li>';
                        eventosGalloContainer.append(htmlData);                                              
                    }  

                                     
                    //params.push(elements);
                    //app.showLoading('hide');                   
                }

                else {
                    console.log("No hay eventos mios que mostrar");
                }
            });
    },

    /// MIS FIESTAS
    fillMisFiestas: function(userToken)
    {
        var idUser =   userToken ;

        $('div#misfiestas #formNuevaFiesta').css('display','inline');
        $('div#misfiestas #msgNuevaFiesta').css('display','none');
        //app.getMisFiestas();

    },
    fillMisFiestasNoLogued: function()
    {
        $('div#misfiestas #formNuevaFiesta').css('display','none');
        $('div#misfiestas #msgNuevaFiesta').css('display','inline');

  
    },
    quitMisFiestas: function()
    {
        $('div#misfiestas #formNuevaFiesta').css('display','none');
        $('div#misfiestas #msgNuevaFiesta').css('display','inline');        
    },

    /*** INVITACIONES ***/
    fillMisInvitaciones: function()
    {
        $('div#invitaciones #invitacionesNoDisponibles').css('display','none');
    },
    fillMisInvitacionesNoLogued: function()
    {
        $('div#invitaciones #invitacionesNoDisponibles').css('display','inline');  
    },
    quitMisInvitaciones: function()
    {
        $('div#invitaciones #invitacionesNoDisponibles').css('display','inline');
    },



   /// CARGAR MIS FIESTAS, de WS a mi BD
    getMisFiestas: function()
    {
        app.showLoading("show");
        var id_user_sesion = app.getUserLogId();
        if (id_user_sesion != 0) {
        $.ajax({
            type: 'get',
            url: webServices.listaMisFiestas+id_user_sesion,
            dataType: 'json',
            async: false,
            beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
            },
            success: function (data) {
                var eventos = data;
                
                if (eventos.length > 0) {
                    eventos.forEach(function(ob) {
                        database.selectMiEvento([ob.idEvent], function(results) {
                            if (results !== null) {
                                if (results.rows.length == 0) {
                                   database.insertMiEvento([ob.idEvent, ob.name,ob.shortDescription,ob.description,ob.startAt,ob.endAt,ob.address,ob.latitude,ob.longitude,ob.idUser.idUser,ob.idEventType.idEventType,ob.status,ob.idMunicipio.idMunicipio], function(isOk) {});    
                                }
                            }
                        });
                    });
                }

                else {
                    /*
                    console.log("Hay sólo un evento");
                        database.selectMiEvento([eventos.idEvent], function(results) {
                            if (results !== null) {
                                if (results.rows.length == 0) {
                                    database.insertMiEvento([eventos.idEvent, eventos.name,eventos.shortDescription, eventos.description, eventos.startAt, eventos.endAt,eventos.address,eventos.latitude,eventos.longitude,eventos.idUser.idUser,eventos.idEventType.idEventType,eventos.status,eventos.idMunicipio.idMunicipio], function(isOk) {});    
                                }
                                /*else
                                    console.log("No es necesario insertar");*/
                            //}
                        //});
                }             
            },
            error: function() {
                console.log("getMisFiestas(), error obteniendo");
            }
        });
        }
        //app.showLoading("hide");
    
    },

    validateUserBlock: function()
    {
        var userId = window.localStorage.getItem('sesionFB_user_id');
        $.ajax({
            type: 'get',
            url: webServices.validateUserBlock+userId,
            dataType: 'json',
            async: false,
            beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
            },
            success: function (resul) {
                
                    console.log("Status: "+resul.status);
                
                    if (resul.status == 1)
                    {
                          app.saveMiFiesta(userId);
                    }
                    else
                    {

                        navigator.notification.alert(
                                'Error al guardar evento',  
                                alertDismissed,         
                                'Aplicacion gallo',            
                                'OK'                 
                            );
                        function alertDismissed(){}

                    }
                //}
            },
            error: function() {
                console.log("insertMiEvento(), error obteniendo");

                navigator.notification.alert(
                        'Intente de nuevo por favor.',  
                        alertDismissed,         
                        'Aplicacion gallo',            
                        'OK'                 
                    );
                function alertDismissed(){}
            }
        });

    },


    /// SAVE MI FIESTA
    saveMiFiesta: function(userId)
    {
        app.showLoading("show");
        var userId = userId; //$("a#btn-guardarMiEvento").attr('uid'); //facebookid o userid
        var myPartyName = $('input#name-event').val();
        var myPartyDate = $('input#date').val();
        var myPartyTime = $('input#hora-evento').val();
        var myPartyDesc = $('textarea#description-event').val();
        var myPartyMuni = $('select#municipio-user-event').val();
        var myPartyAddress = $('input#address-event').val();
        var myPartyLat = $('input#latitude-event').val();  //14.594245671609947
        var myPartyLon = $('input#longitude-event').val(); //-90.517744660246;
        //alert('name:' + myPartyName+ 'short_description: --'+ 'description:'+myPartyDesc + 'start_at'+myPartyDate+'T'+myPartyTime+':00'+ 'end_at:'+myPartyDate+'T'+myPartyTime+':00'+ 'address:'+ myPartyAddress+ 'latitude:'+myPartyLat+ 'longitude:'+myPartyLon+'id_user:'+userId+ 'id_event_type:'+1+ 'id_municipio:'+myPartyMuni);
        var partyStart = myPartyDate+"T"+myPartyTime+":00-06:00";
        var myPartyShortD =  "";
        var myPartyType = 2;
        var myPartyStatus = 1;

        var data = {    address: myPartyAddress,
                        description: myPartyDesc,
                        endAt: partyStart,
                        
                        idEventType: {
                            idEventType: myPartyType
                        },
                        idMunicipio: {
                            idMunicipio: myPartyMuni
                        },
                        idUser: {
                            idUser: userId
                        },
                        latitude: myPartyLat,
                        longitude: myPartyLon,
                        name: myPartyName,
                        shortDescription: myPartyDesc,
                        startAt: partyStart,
                        status: 1
                }; 
         
        var jdata = JSON.stringify(data);
        
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: webServices.setEvento,
            dataType: 'json',
            data: jdata,
            async: false,
            beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
            },
            success: function (resul) {
                
                var idEvent = resul.idEvent;
                
                if(idEvent != 0) 
                {
                    database.insertMiEvento([idEvent, myPartyName, myPartyShortD, myPartyDesc,  partyStart , partyStart, myPartyAddress, myPartyLat, myPartyLon, userId, myPartyType, myPartyStatus, myPartyMuni], function(isOk) {});
                    
                    var current_class = "ui-last-child";
                    var htmlData = '';
                    
                    database.selectMiEventoFullData([idEvent], function(results) {
                            if (results !== null) {
                                if (results.rows.length == 1) {
                                    var row= results.rows.item(0);
                                    //Obtener fechas
                                    var date = app.getDate(row["start_at"]);
                                    var time = date[0];;
                                    var day = date[1];
                                    var month = date[2];
                                    var year = date[3];

                                    var htmlData = '';
                                    htmlData += '<li id="evento-'+row["id_event"]+'" class="'+current_class+'">';
                                        htmlData += '<a onclick="app.verDetalleMiFiesta('+row["id_event"]+')" href="#"  data-idalero="'+row['id_event']+'" class="ui-btn ui-icon-carat-r content-peviewevent">';
                                            htmlData += '<div class="parentEventosUsuario" >';
                                                htmlData += '<div class="date">';
                                                    htmlData += '<div class="diames">' + month + ' '  + day + '</div>';
                                                    htmlData += '<div class="hora">' + year + ', ' + time + '</div>';
                                                htmlData += '</div>';
                                                htmlData += '<div class="event">';
                                                    htmlData += '<div class="nombre">'+row["name"]+'</div>';
                                                    htmlData += '<div class="descripcion">';
                                                        htmlData += ''+row["municipio"] + ' ' + row["departamento"];
                                                    htmlData += '</div>';
                                                htmlData += '</div>';
                                            
                                            htmlData += '</div>';
                                        htmlData += '</a>';
                                    htmlData += '</li>';
                                    // CLEAR
                                    $('.content_form').find("input[type=text], textarea, input[type=time], input[type=date]").val("");
                                    $(".eventosUsuarioContainer").append(htmlData);
                                    app.showLoading("hide");
                                }
                            }
                        });

                    


                    $.mobile.changePage($("#quesigalafiesta"), { transition: "slide" });
                }
                else
                {
                    app.showLoading("hide");
                    navigator.notification.alert(
                    'Intente de nuevo por favor.',  
                    alertDismissed,         
                    'Aplicacion gallo',            
                    'OK'                 
                );
            function alertDismissed(){}

                }
            },
            error: function() {
                console.log("insertMiEvento(), error obteniendo");
                app.showLoading("hide");
                navigator.notification.alert(
                'Intente de nuevo por favor.',  
                alertDismissed,         
                'Aplicacion gallo',            
                'OK'                 
            );
            function alertDismissed(){}
            }
        });
        

    },
    

    /// CARGAR - OMITIR MI DATA AL LOGIN O LOGOUT
    fillOwnData: function(params)
    {
        /// 
        if(params.logued)
        {   
            $("a#btn-guardarMiEvento").attr('uid', params.userToken);
            app.fillMisFiestas(params.userToken);
            app.fillMisInvitaciones();    
        }
        else 
        {
            app.fillMisFiestasNoLogued();
            app.fillMisInvitacionesNoLogued();
        }   
        
    },

    quitOwnData: function()
    {
        app.quitMisFiestas();
        app.quitMisInvitaciones();
    },
    getDateWS: function() {
       var d = new Date();
       var curr_date = d.getDate();
       var dia = (curr_date < 10) ? '0'+curr_date : curr_date;
       
       var curr_month = d.getMonth() + 1;
       var mes = (curr_month < 10) ? '0'+curr_month : curr_month;
    
       var curr_year = d.getFullYear();
       var fecha = (curr_year + "-" + mes + "-" + dia);


       var curr_hour = d.getHours();
       var hora = (curr_hour < 10) ? '0'+curr_hour : curr_hour;
       var curr_minutes = d.getMinutes();
       var minutos = (curr_minutes < 10) ? '0'+curr_minutes : curr_minutes;
       var curr_seconds = d.getSeconds();
       var segundos = (curr_seconds < 10) ? '0'+curr_seconds : curr_seconds;
       var tiempo = (hora + ":" + minutos + ":" + segundos);

       var ahora = (fecha + "T" + tiempo + "-06:00");
       return ahora;
    },

    /// CARGAR MIS INVITACIONES
    getMisInvitaciones: function()
    {
        var id_user_sesion =  app.getUserLogId();

        if (id_user_sesion > 0) { 
        $.ajax({
            type: 'get',
            url: webServices.getInvitaciones+id_user_sesion,
            dataType: 'json',
            async: false,
            beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
            },
            success: function (data) {
                var invitaciones = data;

                if (invitaciones.length > 0) {
                    invitaciones.forEach(function(ob) {
                        database.selectInivitacion([ob.idEventInvite], function(results) {
                             if (results !== null) {
                                if (results.rows.length == 0) {
                                    console.log("status"+ob.status);
                                    database.insertInvitacion([ob.idEventInvite, ob.idUser.idUser ,ob.idEvent.idEvent, ob.idEvent.name,ob.idEvent.shortDescription,ob.idEvent.description,ob.idEvent.startAt,ob.idEvent.endAt,ob.idEvent.address,ob.idEvent.latitude,ob.idEvent.longitude,ob.idEvent.idUser.name,ob.idEvent.idUser.idUser,ob.idEvent.idEventType.idEventType,ob.status,ob.idEvent.idMunicipio.idMunicipio, ob.confirmed, ob.checkedIn], function(isOk) {});    
                                }
                             }
                        });
                    });
                    // UPDATE CONTAINER
                    //app.getMisInvitacionesDB();
                }
                else {
                    console.log("NO HAY INVITACIONES");   
                }             
            },
            error: function() {
                console.log("getMisFiestas(), error obteniendo");
            }
        });
        }
    
    },

    getMisInvitacionesDB: function(tx) {
        var id_user_sesion =  app.getUserLogId();
        var sFB = window.localStorage.getItem('sesionFB');

        var elements = {};
        var params = [];

        if (id_user_sesion > 0 && sFB == 1) {
        $("#invitacionesNoDisponibles").css("display","none");
        $("#invCont").css("display","block");
        $(".invitacionesContainer").html('<div class="loader"><div>');   
        database.selectInvitaciones(function(results) {

                if (results !== null) {
                    var invitacionesContainer = $(".invitacionesContainer");
                    invitacionesContainer.empty();                    

                    //$.mobile.loading('show');
                    var len = results.rows.length;
                    if (len > 0)
                        console.log("Hay invitaciones en la base de datos")
                    else
                        console.log("No hay invitaciones en la base de datos")

                    
                    for (var i = 0; i < len; i++) {
                        var row = results.rows.item(i);
                        current_class = "";
                        if (i == 0) {
                            current_class = "ui-first-child";
                        }

                        if (i == len - 1) {
                            current_class += " ui-last-child";
                        }

                        //console.log("Insertando localmente y agregar al servicio")
                        //elements[row["id_event"]] = row["name"];

                        //Obtener fechas
                        var date = app.getDate(row["start_at"]);
                        var time = date[0];;
                        var day  = date[1];
                        var month = date[2];
                        var year = date[3];
                        
                        var descripcion = row['description'];
                        var descr = descripcion.substring(0, 26);
                        if (descr.length > 25) 
                        {
                            descr+= "...";
                        }

                        var htmlData = '';
                        htmlData += '<li id="evento-'+row["id_event"]+'" class="'+current_class+'">';
                            htmlData += '<a onclick="app.verDetalleInvitacion('+row["id_invitation"]+')" href="#"  data-idalero="'+row['id_event']+'" class="ui-btn ui-icon-carat-r content-peviewevent">';
                            htmlData += "<div class='parent padding5' >";
                                htmlData += '<div class="date">';
                                    htmlData += '<div class="diames">' + month + ' '  + day + '</div>';
                                    htmlData += '<div class="hora">' + year + ', ' + time + '</div>';
                                htmlData += '</div>';
                                htmlData += '<div class="event">';
                                    htmlData += '<div class="nombre">'+row["name"]+'</div>';
                                    htmlData += '<div class="descripcion">';
                                        htmlData += '<span>' +descr+ '</span>' +  row["municipio"] + ' ' + row["departamento"];
                                    htmlData += '</div>';
                                htmlData += '</div>';

                            htmlData += "</div>";
                            htmlData += '</a>';
                        htmlData += '</li>';
                        invitacionesContainer.append(htmlData);                                              
                    }                    
                    //params.push(elements);

                    //app.showLoading('hide');                   
                }

                else {
                    console.log("No hay invitaciones que mostrar");
                }
            });
        } else {
            $("#invitacionesNoDisponibles").css("display","block");
            $("#invCont").css("display","none");
        }        
    },

    /// mostrar informacion de INVITACION
    verDetalleInvitacion: function(idInvitacion) {
        //console.log("verDetalleAlero(" + idAlero + ")");
        database.selectInivitacion([idInvitacion], function(results) {
            if (results !== null) {
                var server = webServices.server;
                //$.mobile.loading('show');
                var len = results.rows.length;
                var row= results.rows.item(0);
                // JORGE: UPDATE ESTATUS INVITACION
                app.updateStatusInvitacion(idInvitacion,row['status'], "status");



                var html = '';
                html += '<div class="nombre-invitacion">'+row['name']+'</div>';
                html += '<div class="by">Organizada por: '+row['invite_by']+'</div>';
                html += '<div class="direccion-invitacion">Direcci&oacuten: '+row['address']+'</div>';
                html += '<div class="descrip-invitacion">'+row['description']+'</div>';  //Aqui tiene que ir la descripci&oacute:n

                $(".info-invitacion").html(html);
                var aqui = $(".info-invitacion").html();
                console.log("Agregado? " + aqui);

                status = navigator.network.connection.type;

                if (navigator.network && status != "none") {   
                    var botones ='';
                    botones += '<div class="btns_compartir">';
                        console.log("confirmed:"+row['confirmed']);
                        if (row['confirmed'] == 1) {
                            botones += '<a href="#dialog" class="typeButton buttonGreen" id = "btnAsistirInv" data-transition="pop" onclick="app.confirmarAsistenciaInv(' + row['id_invitation'] + ');" confirmed="'+row['confirmed']+'">Asistire</a>&nbsp;';
                        } else {
                            botones += '<a href="#dialog" class="typeButton buttonYellow" id = "btnAsistirInv" data-transition="pop" onclick="app.confirmarAsistenciaInv(' + row['id_invitation'] + ');" confirmed="'+row['confirmed']+'">Asistire</a>&nbsp;';
                        }
                        botones += '<a href="#dialog" class="typeButton buttonYellow" data-transition="pop" onclick="window.plugins.socialsharing.shareViaTwitter(\'¡Promociones, ofertas y los mejores eventos con la mejor cerveza!.\', null, linkSO)">Twitter</a>&nbsp;';
                        botones += '<a class="typeButton buttonYellow" data-rel="popup" data-position-to="window"  onclick="window.plugins.socialsharing.shareViaFacebook(\'¡Promociones, ofertas y los mejores eventos con la mejor cerveza!.\', null, linkSO)">Facebook</a>';
                        
                        //botones += '<a class="typeButton buttonYellow" data-rel="popup" data-position-to="window"  onclick="misFuncionesFB.showModalShare(1);">Facebook</a>';
                    botones += '</div>';
                    

                    $('#boton-redes-invitacion').html(botones);
                }
                //$.mobile.loading('hide');

                // set latitude and longitude mapa
                //
                googleMap.verMapa(row['latitude'], row['longitude'], 'map-canvas-invitacion');
                console.log(row['latitude'] + "," + row['longitude']);
            }

            else {
                console.log("No hay nada que mostrar");
            }
        });

                        
        $.mobile.changePage($("#detalle_invitacion"), { transition: "slide" });        
    },

    /// mostrar informacion de INVITACION
    updateStatusInvitacion: function(idInvitacion, status, type) {
        var success = "";
        if (status == "0") {
            $.ajax({
                type: 'get',
                url: webServices.updateStatusInvitacion+type+"/"+idInvitacion+"/1",
                dataType: 'json',
                async: false,
                beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
                },
                success: function (data) {
                    if (data.updated == "1") {
                            database.updateInvitacion([ type, idInvitacion, 1], function(isOk) {}); 
                            success = true;
                    }

                },
                error: function() {
                    console.log("UPDATE INVITACION "+type+", error obteniendo");
                    success = false;
                }
                });
        } else if ( (status == "1") && (type == "confirmed")) {
            $.ajax({
                type: 'get',
                url: webServices.updateStatusInvitacion+type+"/"+idInvitacion+"/0",
                dataType: 'json',
                async: false,
                beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
                },
                success: function (data) {
                    if (data.updated == "1") {
                            database.updateInvitacion([ type, idInvitacion, 0], function(isOk) {}); 
                            success = true;
                    }

                },
                error: function() {
                    console.log("UPDATE INVITACION "+type+", error obteniendo");
                    success = false;
                }
                });
        }
        return success;
    },

     /// mostrar informacion de INVITACION
    confirmarAsistenciaInv: function(idInvitacion) {
        app.showLoading("show");
        confirmed = $("#btnAsistirInv").attr("confirmed");

        console.log(confirmed);
        var update = app.updateStatusInvitacion(idInvitacion, confirmed ,"confirmed");
        console.log("update:"+update);
        if ( (update) && (confirmed == 0) ) {
            $("#btnAsistirInv").removeClass("buttonYellow");
            $("#btnAsistirInv").addClass("buttonGreen");
            $("#btnAsistirInv").attr("confirmed","1");
            app.showLoading("hide");
        } else if ( (update) && (confirmed == 1) ) {
            $("#btnAsistirInv").removeClass("buttonGreen");
            $("#btnAsistirInv").addClass("buttonYellow");
            $("#btnAsistirInv").attr("confirmed","0");
            app.showLoading("hide");
        }
        
    },

    getUserEvents: function() {
        var id_user_sesion =  app.getUserLogId();
        
        if (id_user_sesion > 0) {   
        
        $.ajax({
            type: 'get',
            url: webServices.getUserEventsUrl+id_user_sesion,
            dataType: 'json',
            async: false,
            beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
            },
            success: function (data) {
                var events = data;
                console.log("getting user events:"+events.length);
        
                if (events.length > 0) {
                    events.forEach(function(ob) {
                        
                        database.getUserEvent([id_user_sesion, ob.userEventGalloPK.idEvent],function(results) {
                        if (results !== null) {
                            if (results.rows.length == 0) {
                                console.log(ob.userEventGalloPK.idUser+"-"+ob.userEventGalloPK.idEvent+"-"+ ob.status);
                                database.insertUserEvent([ob.userEventGalloPK.idUser, ob.userEventGalloPK.idEvent, ob.status], function(isOk) {});
                            }
                        }
                        });     
                    });
                }
            },
            error: function() {
                console.log("getEventosGallo(), error obteniendo");
            }
        });
     }
    },

    updateFiestaEventViewUser: function(id_fiestaGallo) {
        var id_user_sesion =  app.getUserLogId();

        if (id_user_sesion > 0) {

        
        console.log("ready for view");
        database.getUserEvent([id_user_sesion, id_fiestaGallo],function(results) {
    
            if (results !== null) {
                   if (results.rows.length == 0) {

                        data = { status: 0,
                                 userEventGalloPK: {
                                    idEvent: id_fiestaGallo,
                                    idUser: id_user_sesion
                                 }
                               };

                        var jdata = JSON.stringify(data);
                        
                        console.log("user:"+id_user_sesion);
                        console.log("fiesta:"+id_fiestaGallo);

                        $.ajax({
                            type: 'POST',
                            contentType: 'application/json',
                            url: webServices.userEventGallo,
                            dataType: 'json',
                            data: jdata,
                            async: false,
                            beforeSend: function (xhr) {                    
                                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
                            },
                            success: function (data) {
                                console.log("NEW VIEW");
                                database.insertUserEvent([id_user_sesion, id_fiestaGallo, 0], function(isOk) {}); 
                            },
                            error: function() {
                                console.log("updateFiestaEventUser(), error obteniendo");
                            }
                        });  
                }
            }
        });   
        
        }
    },

     /// mostrar informacion de INVITACION
    confirmarAsistenciaEventoGallo: function(idFiesta) {
        var id_user_sesion =  app.getUserLogId();
        
        asistir = $("#btnAsistirFiesta").attr("asistir");

        if ((asistir == 0) || (asistir == 1)) {
        app.showLoading("show");
        var update = app.updateStatusEventFiestaGallo(idFiesta, id_user_sesion ,asistir );
        
        if ( (update) && (asistir == 0) ) {
            $("#txtConfirmar").show();
            $("#btnAsistirFiesta").attr("asistir","1");
             navigator.notification.alert(
                'Asistencia Confirmada',  
                alertDismissed,         
                'Eventos Gallo',            
                'OK'                 
            );
            app.showLoading("hide");
        } else if ( (update) && (asistir == 1) ) {
            $("#txtConfirmar").hide();
            $("#btnAsistirFiesta").attr("asistir","0");
            app.showLoading("hide");
        }
        }
        function alertDismissed() {

        }
    },

    /// mostrar informacion de INVITACION
    updateStatusEventFiestaGallo: function(idEvent, idUser, status) {
        var success = "";
        if (status == "0") {
            $.ajax({
                type: 'get',
                url: webServices.updateUEventGallo+idUser+"/"+idEvent+"/1",
                dataType: 'json',
                async: false,
                beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
                },
                success: function (data) {
                    if (data.updated == "1") {
                            database.updateUserEvent([ 1, idEvent, idUser], function(isOk) {}); 
                            success = true;
                    }

                },
                error: function() {
                    console.log("UPDATE statusEventFiestaGallo, error obteniendo");
                    success = false;
                }
                });
        } else if (status == "1") {
            $.ajax({
                type: 'get',
                url: webServices.updateUEventGallo+idUser+"/"+idEvent+"/0",
                dataType: 'json',
                async: false,
                beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
                },
                success: function (data) {
                    if (data.updated == "1") {
                            database.updateUserEvent([ 0, idEvent, idUser], function(isOk) {}); 
                            success = true;
                    }

                },
                error: function() {
                    console.log("UPDATE statusEventFiestaGallo, error obteniendo");
                    success = false;
                }
                });
        }
        return success;
    },

    /// mostrar informacion de INVITACION
    cancelarMiFiesta: function(idEvent) {
       
        function onConfirm(buttonIndex) {
            if (buttonIndex == 1) {
                $.ajax({
                type: 'get',
                url: webServices.updateUserEventGallo+idEvent+"/0",
                dataType: 'json',
                async: false,
                beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
                },
                success: function (data) {
                    if (data.updated == "1") {
                            database.cancelarMiFiesta([ 0, idEvent], function(isOk) {});
                            app.getMisFiestasDB(); 
                            $.mobile.changePage($('#quesigalafiesta'), { transition: 'slide' }); 
                            $('.page_homefista .misfiestas').click();
                            success = true;
                    }

                },
                error: function() {
                    console.log("UPDATE cancelarMiFiesta, error obteniendo");
                    success = false;
                }
                });
            }
        }

        navigator.notification.confirm(
            '¿Esta seguro de eliminar el evento?', 
             onConfirm,            
            'Eliminar Evento',           
            ['Si','No']             
        );
    },

     /// make_base_auth
    make_base_auth: function(user, password) {
           var tok = user + ':' + password;
           var hash = btoa(tok);
           return "Basic " + hash;
    },

    // OBTIENE USER ID
    getUserLogId: function()
    {
        var sFB = window.localStorage.getItem('sesionFB');
        var sMA = window.localStorage.getItem('sesionM');
        var id_user_sesion =  0;
        
        if(sFB == 1) { 
            id_user_sesion = window.localStorage.getItem('sesionFB_user_id'); 
        }
        else if (sMA == 1) { 
            id_user_sesion = window.localStorage.getItem('sesionM_user_id'); 
        }
        else
        {
            id_user_sesion = window.localStorage.getItem('sesionUnique_user_id');
        }

        return id_user_sesion;
    },

     /**
  OBTIENE LOS LINKS PARA DESCARGAS ENTRE LOS PARAMETROS 
  */
  getParametersLinks: function(callback)
  {
    var linksDescargas = {};
    $.ajax({
        type: 'get',
        url: webServices.getParameters,
        dataType: 'json',
        async: false,
        beforeSend: function (xhr) {                
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
        },
        success: function (data) {
            var links = data;
           

            var active = 0;
            var backgroundImagen = "";
            var idBackground = "";
            var sectionId = 0;


            links.forEach(function(ob) {
            
            //imagenes.downloadFile(elemento.content, elemento.name+".jpg", 3 );

            var server = webServices.server;
            var name = "";
            switch(ob.name) {
                case 'LinkAndroid':
                    link = ob.content;
                    linksDescargas.android = link;
                    break;
                case 'LinkIOS':
                    link = ob.content;
                    linksDescargas.ios = link;
                    break;
            }

            });
            callback(linksDescargas);
            //return linksDescargas;
        },
        error: function() {
            console.log("Error obteniendo links.");
        }
    });
  },

  
};
