
var invitacionesApp = 
{


    getFriendsOnApp: function(getAllUsers)
    {
        app.showLoading("show");
        openFB.api({
            method: 'GET',
            version: '2.1',
            path: '/me/friends',
            success: function(amigos) {

                var data = amigos.data;
                var listado = "";

                
                data.forEach(function(amigo) {
                    var amigoidBD = 0;
                    if (getAllUsers.status == 1) 
                    {
                        getAllUsers.resul.forEach(function(usuariobd){
                            //console.log(usuariobd.idUser+" , "+usuariobd.fbId);
                            console.log("---> Comprobando: "+amigo.id+" == "+usuariobd.fbId+" ?");
                            if(amigo.id == usuariobd.fbId )
                            {
                                console.log("---> Son iguales: "+amigo.id+" == "+usuariobd.fbId);
                                amigoidBD = usuariobd.idUser;
                            }
                            
                        });
                    }
                        listado += "<li>";
                        listado += "<div style='width:60%; margin:auto; overflow:hidden; font-size:12px !important;' class='faceFriend'> <div style='width:33.33%; float:left;'><img src='http://graph.facebook.com/"+amigo.id+"/picture' alt='Smiley face' height='42' width='42'></div><div style=' text-align:left; width:33.33%; float:left;'>"+amigo.name+"</div>";
                        listado += "<div style='width:33.33%; float:left; text-align:center;'><input type='checkbox' style='border: 1px solid white !important; padding:10px; background-color: black !important;' value='"+amigoidBD+"' value2 = '"+amigo.id+"' idFiesta='"+getAllUsers.idFiesta+"' ></div>";
                        listado += "</div>";
                        listado += "</li>";


                });
            console.log(listado);
            $('div#invitadosOnApp ul#lista-amigos-onapp').empty();
            $('div#invitadosOnApp ul#lista-amigos-onapp').append(listado);
 
            $('#invitadosOnApp').on({

              popupbeforeposition: function() {
                $('#invitadosOnApp').css({ 
                        width: $(window).width()-30, 
                        'max-height': $(window).height()-50, 
                        position: 'fixed', top: 25, left: 15 
                    }).children('div.parentlist').children('div').children('ul').css({ 
                            width: '100%',
                            'padding-top:':'10px', 
                            'max-height': $(window).height()-150, 
                            'overflow-y': 'scroll' 
                        });

                $('.parentlist').css({ 
                            'max-height': $(window).height()-150, 
                        });

                /*
                                $('#invitadosOnApp').css({ width: $(window).width()-30, 'max-height': $(window).height()-50, position: 'fixed', top: 25, left: 15 });
                $('.parentlist').css({ width: $(window).width()-30, 'max-height': $(window).height()-100, position: 'fixed', top: 25, left: 15 }).children('ul').css({ width: '100%', 'max-height': $(window).height()-100, 'overflow-y': 'scroll' });

                */
              }
            });
            app.showLoading("hide");
            $("#invitadosOnApp" ).popup( "open" );
         

            },
            error: misFuncionesFB.errorHandler});


    },


    
    sendInvitationsOnApp: function()
    {
        app.showLoading("show");
        var ids = "";
        var idInvitacion = -1;
        var contAmigos = 0;
        $( "div#invitadosOnApp ul#lista-amigos-onapp li input" ).each(function( index , element) {
            
            if($(this).is(":checked"))
            {
                var id = $(this).attr('value2');
                console.log( index + ": " + id );
                ids += id+",";
                idInvitacion = invitacionesApp.saveInvitationOnApp($(this).val(), $(this).attr('idFiesta'));
                contAmigos++;

            }

        });
        /// OBTENER EL IDUSER SEGUN EL FBID

        if(contAmigos >= 1)
        {
           /* app.showLoading("show");

            openFB.api({
                method: 'POST',
                version: '2.1',
                path: '/me/feed',
                params: {
                message: '¡Los eventos más esperados del año, con lo mejor del mundo artístico a nivel nacional he internacional! ¿Qué esperas para ser parte de esta gran experiencia?',
                place: "155021662189",
                tags: ids
            },
            success: function() {
                app.showLoading("hide");
*/               function alertDismissed() { return true; }

                app.showLoading("hide");

                navigator.notification.alert(
                    'Invitaciones Enviadas',     // mensaje (message)
                     alertDismissed,         // función 'callback' (alertCallback)
                    'Invitaciones',            // titulo (title)
                    'OK'                // nombre del botón (buttonName)
                );

                $("#invitadosOnApp").popup( "close" );
                $("#p-customMessageAPP").empty();

          /*  },
            error: misFuncionesFB.errorHandler});
            */


        }
        else
        {
            $("#p-customMessageAPP").html("Agrega amigos para invitar");
        }
    },
    closeShare: function()
    {   
        $("#invitadosOnApp").popup( "close" );
    },


    getAllUsers: function(idFiestaGallo)
    {
       	var ret = {};
    	ret.status = -1;
        ret.resul = "-1";
        ret.idFiesta = -1;

        $.ajax({
            type: 'get',
            url: webServices.listAllUsers,
            dataType: 'json',
            async: false,
            beforeSend: function (xhr) {                    
                xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
            },
            success: function (resul) {
                    console.log("Resul getAllUsers");
                    console.log(JSON.stringify(resul));
                    ret.status = 1;
                    ret.resul = resul;
                    ret.idFiesta = idFiestaGallo;
                    //console.log(JSON.stringify(ret.status));
                    //return r;
                /*
                    if (resul.status == 1)
                    {
                    	app.saveMiFiesta(userId);
                    }
                    else
                    {
                        alert("Error al guardar evento.");                     
                    }
                    */
        			
            },
            error: function() {
                alert("ERROR GET ALL USERS");
                ret.status = 0;
                ret.resul = "";
                ret.idFiesta = 0;
                //return r;
                console.log(JSON.stringify(ret));
        		
            }
        });
        return ret;
        
    },


    saveInvitationOnApp: function(touserid, eventid )
    {
        console.log("parametros:");
        console.log(touserid+" , "+eventid);

    	var nw_id = 0;

        var data =  {
				    	"checkedIn": 0,
				        "confirmed": 0,
				        "idEvent": {
				            "idEvent": eventid
				        },
				        "idUser": {  
				            "idUser": touserid
				        },
				        "status": 0
				    };

        var jdata = JSON.stringify(data);

        $.ajax({
            type: 'post',
            contentType: 'application/json',
            url: webServices.sendInvitation,
            data: jdata,
            dataType: 'json',
            async: false,
            beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
            },
            success: function (result)
             {
                console.log("nw_id");
                console.log(JSON.stringify(result));
                nw_id = result.idEventInvite;
            
                if (nw_id != 0) 
                {
                    console.log("Retornara "+nw_id);
                }
                else 
                {
                    console.log("Retornara cero");
                }
                 
            },
            error: function() {
                console.log("insertUsuario(), error obteniendo");
            }
        });
        return nw_id;
    }



};