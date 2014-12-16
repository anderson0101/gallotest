
                // Defaults to sessionStorage for storing the Facebook token

            //  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
            //  openFB.init({appId: 'YOUR_FB_APP_ID', tokenStore: window.localStorage});

var misFuncionesFB =  
{
    iniciar: function()
    {
        openFB.init({appId: '301369663377328'});
        misFuncionesFB.printTextFbLogin ();

        
    },

    login:function () {
        openFB.login(
                function(response) {
                    if(response.status === 'connected') {
                        
                        // alert('Facebook login succeeded, got access token: ' + response.authResponse.token);
                        var info;
                        openFB.api({
                        path: '/me',
                        success: function(data) {
                            info = data;
                            /*
                            alert(data.id);
                            alert(data.first_name + data.last_name);
                            alert(data.email);
                            alert(data.birthday);
                            */
                            //$('span#fb-text-login').text('Log out');
                            //$('button#boton-login').attr('onclick', 'misFuncionesFB.logout()');
                            //alert(JSON.stringify(data));
                            
                            
                            //window.localStorage.setItem('sesionFB',1);
                            //window.localStorage.setItem('sesionFB_user',data.id);
                            app.loginUserMovilFB(data);
                            /*
                            var newid = app.saveUserMovilFB(data);                                        
                            console.log(newid);
                            */
                        },
                        error: misFuncionesFB.errorHandler});


                    } else {
                        navigator.notification.alert(
                                'Facebook login failed: ' + response.error,  
                                alertDismissed,         
                                'Aplicacion gallo',            
                                'OK'                 
                            );
                        function alertDismissed(){}

                    }
                }, {scope: 'email, publish_actions, user_about_me, user_birthday, user_friends'});
    },
    getInfo: function () {
        openFB.api({
            path: '/me',
            success: function(data) {
                /*
                alert(data.id);
                alert(data.email);
                alert(data.first_name + data.last_name);
                alert(data.birthday);
                */
                //console.log(JSON.stringify(data));
                var info = JSON.stringify(data);
                return info;
            },
            error: misFuncionesFB.errorHandler});
    },

    showModalShare: function(val)
    {
        var msg = "";
        switch(val)
        {
            case 1:
                msg = "¡Promociones, ofertas y los mejores eventos con la mejor cerveza!";
            break;

            case 2:
                msg = "¿Qué esperas para vivir lo mejor del mundo artístico a nivel nacional he internacional?";
            break;

        }
        $('textarea#textMessage').text(msg);
        $( "#shareMessage" ).popup( "open" );
    },

    share: function() {
        var texto = $('textarea#textMessage').text();
        openFB.api({
            method: 'POST',
            path: '/me/feed',
            params: {
                message: texto, link: linkSO
            },
            success: function() {
                $("#shareMessage").popup( "close" );

                navigator.notification.alert(
                        'Compartido enFacebook',  
                        alertDismissed,         
                        'Aplicacion gallo',            
                        'OK'                 
                    );
                function alertDismissed(){}

            },
            error: misFuncionesFB.errorHandler});
        
    },

    closeShare: function()
    {
        $("#shareMessage").popup( "close" );
    },
    revoke: function () {
        openFB.revokePermissions(
                function() {
                    alert('Permissions revoked');
                },
                misFuncionesFB.errorHandler);
    },

    logout: function() {
        openFB.logout(
                function() {
                    window.localStorage.setItem('sesionFB',0);
                    console.log("seting java params null");
                    app.printBotonesConexion();
                    $.mobile.changePage($("#home"), "none"); 
                },
                misFuncionesFB.errorHandler);
    },
    errorHandler: function (error) {

        navigator.notification.alert(
                'Error de conexion con facebook',  
                alertDismissed,         
                'Aplicacion gallo',            
                'OK'                 
            );
        function alertDismissed(){}
        app.showLoading("hide");
        //alert("Inicie sesion en facebook para continuar.");
    },

    printTextFbLogin:function()
    {   
        if(misFuncionesFB.getLoginStatus())
        {
            $('span#fb-text-login').text('Cerrar sesion.');
            $('button#boton-login').attr('onclick', 'misFuncionesFB.logout()');
            window.localStorage.setItem('sesionFB',1);
        }
        else
        {
            $('span#fb-text-login').text('Conectarte con Facebook');
            $('button#boton-login').attr('onclick', 'misFuncionesFB.login()');
            window.localStorage.setItem('sesionFB',0);
        }
    },

    getLoginStatus: function()
    {
        var resul = false; 
        openFB.getLoginStatus(
            function(response) {
                if (response.status === 'connected') {
                    resul = true;

                    getUserInfo(); 
                }  else { 
                    resul = false;

                    // openFB.login(function(){},{scope: 'read_stream,email,publish_actions,publish_stream, user_about_me, user_birthday, user_friends' }); 
                }
                 
            }); 
        return resul;
    },

    /// levantar invitar amigos
    getFriendsFB: function()
    {
        
        openFB.api({
            method: 'GET',
            version: '2.1',
            path: '/me/taggable_friends',
            success: function(amigos) {
                var data = amigos.data;
                var listado = "";

                data.forEach(function(amigo) {
                    listado += "<li>";
                    listado += "<div class='facebookFriend'> <img src='"+amigo.picture.data.url+"' height='42' width='42'> <span class='faceName'>"+amigo.name+"</span>";
                    listado += "<input type='checkbox' value='"+amigo.id+"'>";
                    listado += "</div>";
                    listado += "</li>";
                });
            //console.log(listado);
            $('div#positionWindow ul#lista-amigos').empty();
            $('div#positionWindow ul#lista-amigos').append(listado);

            $('#positionWindow').on({
              popupbeforeposition: function() {
                $('#positionWindow').css({ width: $(window).width()-30, 'max-height': $(window).height()-50, position: 'fixed', top: 25, left: 15 }).children('ul').css({ width: '100%', 'max-height': $(window).height()-50, 'overflow-y': 'auto' });
              }
            });
            $("#positionWindow" ).popup( "open" );

            },
            error: misFuncionesFB.errorHandler});
    },


    sendInvitations: function()
    {
        var ids = "";
        var contAmigos = 0;

        $( "div#positionWindow ul#lista-amigos li input" ).each(function( index , element) {
            if($(this).is(":checked"))
            {
                var id = $(this).val();
                console.log( index + ": " + id );
                ids += id+",";
                contAmigos ++;                
            }

            
        });

        if(contAmigos >= 1)
        {
            openFB.api({
                method: 'POST',
                version: '2.1',
                path: '/me/feed',
                params: {
                message: 'Te invito a la fiesta!!!',
                place: "155021662189",
                tags: ids
            },
            success: function() {
                navigator.notification.alert(
                        'Enviado',  
                        alertDismissed,         
                        'Aplicacion gallo',            
                        'OK'                 
                    );
                function alertDismissed(){}

                $("#positionWindow").popup( "close" );
                $("#p-customMessageFB").empty();
            },
            error: misFuncionesFB.errorHandler});
        }
        else
        {   
            $("#p-customMessageFB").html("Agregue amigos para invitar");
        }


    }

};

            /*


            


            



            
            */