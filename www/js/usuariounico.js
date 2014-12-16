var  uniqueid= 
{
	init: function()
	{

		uniqueid.getUnique();
	},


    getUnique: function()
    {
        database.selectUniqueId(function(results) {
            if (results !== null) 
            {   
                //alert(JSON.stringify(results));   
                var len = results.rows.length;
                if (len > 0)
                {
                    var ite = results.rows.item(0);
                    //alert("Hay unico: "+ite.unique_id);

                }
                else
                {
                    var uid = uniqueid.generateUnique();
                    uniqueid.setUniqueDB(uid);
                }
            }
            else
            {
                var uid = uniqueid.generateUnique();
                uniqueid.setUniqueDB(uid);
            }
        });

    },   


    getUniqueDB: function(callback)
    {
        var unico = 0;
        database.selectUniqueId(function(results) {
            if (results !== null) 
            {  
                //alert(JSON.stringify(results));   
                var len = results.rows.length;
                if (len > 0)
                {
                    var ite = results.rows.item(0);
                    unico =  ite.iddb;
                    callback(unico);
                }
            }
        });

    },


	setUniqueDB: function(uid)
	{
        var uid2 = uid;
        //alert("setUniqueDB: "+uid);
		uniqueid.checkunique(uid, function(result){
			if (result) 
			{	



				database.insertUniqueId([uid2], function(isOk){
					//alert("isertado? "+isOk);
					if(isOk)
					{
						uniqueid.saveUniqueId(uid2, function(resul){
							if (resul.save) 
							{    
                                var uid = resul.idbd;
                                window.localStorage.setItem('sesionUnique_user_id', uid );
                                //alert("Se guardo!! :D"+uid);
                                database.updateUniqueId([uid, uid2], function(resul){
                                    if (resul) 
                                    {
                                        //alert("SE actualizo");    
                                    }
                                    
                                });
								
                                app.usarPlugin(uid, app.make_base_auth(webServices.user, webServices.password), webServices.fiestasNoVistas, webServices.invNoVistas);

							}
							else
							{
								//alert("No se guardoo!! D:");
							}
						});
					}
				});	




			}
			else
			{
				var uid = uniqueid.generateUnique();
	            uniqueid.setUniqueDB(uid);			
	        }
		});

	},

	generateUnique: function()
	{
		var uid = $genuid.generate();
		return uid;
	},

	checkunique: function(uid, callback)
	{
		   	$.ajax({
            type: 'get',
            url: webServices.checkunique+uid,
            dataType: 'json',
            async: false,
            beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
            },
            success: function (resul) {
                var user_id = parseInt(resul.idUser);
                
                // no existe
                if (resul.existeUnico == 0) 
                {
                	callback(true);
                }
                // si existe
                else
                {
                	callback(false);
                }
              
            },
            error: function() {
                
               callback(false);
            }
        });
	},

	saveUniqueId: function(uid, callback)
	{
        var res= {};
    	var data = 
        {
            birth: "1990-01-02T00:00:00-06:00",
            
            
            idUsertype: {
                "idUsertype": 2
            },
            name: "test",
            registerDate: "2014-08-01T00:00:00-06:00",
            status: 1,
            uid: uid
    };

        var jdata = JSON.stringify(data);

        $.ajax({
            type: 'post',
            contentType: 'application/json',
            url: webServices.setUser,
            data: jdata,
            dataType: 'json',
            async: false,
            beforeSend: function (xhr) {                    
                xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
            },
            success: function (result)
            {
                var idu = result.idUser;
                res.idbd = idu;
                res.save = true; 
             	callback(res); 
            },
            error: function() {
                //alert("ERROR GUARDADNOD USER");
                callback(res);
            }
        });
           
	}


}
