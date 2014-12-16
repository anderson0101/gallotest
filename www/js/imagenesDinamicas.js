
var imagenes = 
{
  init: function()
  {

    var version = app.verifyVersion(function(result ){

          //alert(result);
          if(result == 1)
          {

          /*
          imagenes.getWebBackgrounds();
          imagenes.getParameters();
          imagenes.showImagesBD();
          imagenes.showVersion();
          */
          }
          else
          {
            /*
            BUSCAR LOS IMAGENES EN EL DISPOSITIVO
            */
            
            var cont = [];
            cont[0] = {"fullPath": "", "name": "splash.jpg", "section":"1"}; //splash
            cont[1] = {"fullPath": "", "name": "bg-home.jpg", "section":"2"}; //bg-home
            cont[2] = {"fullPath": "", "name": "banner.jpg", "section":"3"}; //banner-home

            /*
            imagenes.banner = "";
            imagenes.splash = "";
            imagenes.background = "";
            */


          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function onFileSystemSuccess(fileSystem) {
              var directoryEntry = fileSystem.root; // to get root path to directory
              directoryEntry.getDirectory("Gallo-Resources", {create: true, exclusive: false}, imagenes.onDirectorySuccess, imagenes.onDirectoryFail);
              var rootdir = fileSystem.root.toURL();

              cont.forEach(function(ob) {          
                ob.fullPath = rootdir+ "Gallo-Resources/"+ob.name;

                imagenes.printImage(ob);
              });

          }, imagenes.fileSystemFail.fail);   
        }

      });

    /*
  SINCRONIZANDO LAS IMAGENES, DESCARGARLAS
    */
  },

  /*
  HACE LA DESCARGA DE  BACKGROUND ACTIVO
  */
  getWebBackgrounds: function()
  {
    $.ajax({
        type: 'get',
        url: webServices.getBackgrounds,
        dataType: 'json',
        async: false,
        beforeSend: function (xhr) {                    
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
        },
        success: function (data) {
            var backgrounds = data;
            var active = 0;
            var backgroundImagen = "";
            var idBackground = "";
            var sectionId = 0;
            //alert(JSON.stringify(data));
            backgrounds.forEach(function(ob) {

              database.insertParamImage([2, ob.backgroundImage, 2], function(isOk) 
                {
                  var server = webServices.server;
                  var name = "";
                  name = "bg-home.jpg";
                  imagenes.downloadFile(server+"/"+ob.backgroundImage, name, 2);

                  /*
                  switch(ob.sectionId) {
                      case 1:
                          name = "splash.jpg";
                          imagenes.downloadFile(server+"/"+ob.backgroundImage, name, ob.sectionId);
                          break;
                      case 2:
                          name = "bg-home.jpg";
                          imagenes.downloadFile(server+"/"+ob.backgroundImage, name, ob.sectionId);
                          break;
                  }
                  */
                });
                               
            });
        },
        error: function() {
            console.log("Error obteniendo imagenes.");
        }
    });
  },

  /**
  OBTIENE LOS PARAMETROS NUEVOS, ENTRE ELLOS BANNER ACTIVO
  */
  getParameters: function()
  {

    $.ajax({
        type: 'get',
        url: webServices.getParameters,
        dataType: 'json',
        async: false,
        beforeSend: function (xhr) {                
                    xhr.setRequestHeader("Authorization", app.make_base_auth(webServices.user, webServices.password));
        },
        success: function (data) {
            var banners = data;
            console.log(JSON.stringify(data));

            var active = 0;
            var backgroundImagen = "";
            var idBackground = "";
            var sectionId = 0;


            banners.forEach(function(ob) {
            
            //imagenes.downloadFile(elemento.content, elemento.name+".jpg", 3 );
              
              database.insertParamImage([ob.idAppParameter, ob.content, 3], function(isOk) 
                {
                  var server = webServices.server;
                  var name = "";
                  switch(ob.name) {
                      case 'Slplash':
                          name = "splash.jpg";
                          imagenes.downloadFile(server+"/"+ob.content, name, 1);
                          break;
                      case 'Banner':
                          name = "banner.jpg";
                          imagenes.downloadFile(server+"/"+ob.content, name, 3);
                          break;
                  }

                });          
            });
        },
        error: function() {
            console.log("Error obteniendo imagenes.");
        }
    });
  },

 

  showImagesBD: function()
  {
    database.selectAllImages(function(results){
      if (results != null) 
      {
        var len = results.rows.length;
        //alert("len "+len);

                for (var i = 0; i < len; i++) {
                    var row= results.rows.item(i);
                    //alert(row['idBackground']+" , "+row['url']+" , "+row['sectionId'] );
                    console.log(row['idBackground']+" , "+row['ruta']);
                    //alert(row['idBackground']+" , "+row['ruta']);

                }
      }

    });
  },
  showVersion: function()
  {
    database.selectVersion(function(results){
      if (results != null) 
      {
        var len = results.rows.length;
        //alert("len "+len);

                for (var i = 0; i < len; i++) {
                    var row= results.rows.item(i);
                    //alert(row['idBackground']+" , "+row['url']+" , "+row['sectionId'] );
                    console.log(row['id_db_versioning']+" , "+row['description']);
                    //alert("Show version = "+row['id_db_versioning']+" , "+row['version']);

                }
      }

    });
  },

  showAllPromos: function(idAlero)
  {
    database.selectAllPromos(function(results){
      if (results != null) 
      {
        var len = results.rows.length;
        //alert("total promos para alero *"+idAlero+"*  "+len);

                for (var i = 0; i < len; i++) {
                    var row= results.rows.item(i);
                    //alert(row['idBackground']+" , "+row['url']+" , "+row['sectionId'] );
                   // alert(row['id_alero']+ "- "+row['id_promotion']+" , "+row['description']);
                    //alert("Show version = "+row['id_db_versioning']+" , "+row['version']);

                }
      }

    });
  },

  /**
    HACE LA DESCARGA DE UN ARCHIVO
  */

  downloadFile: function(url, name, section) {

    var params = {}; 
    var fileTransfer = new FileTransfer();
    //var uri = encodeURI("http://websiteguatemala.com/tpp/TERMINOS_MOVIL_GALLO/promo1.jpg");
    var uri = encodeURI(url);
    var fileURL = "";

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function onFileSystemSuccess(fileSystem) {
        var directoryEntry = fileSystem.root; // to get root path to directory
        directoryEntry.getDirectory("Gallo-Resources", {create: true, exclusive: false}, imagenes.onDirectorySuccess, imagenes.onDirectoryFail);
        var rootdir = fileSystem.root.toURL();
        fileURL = rootdir + "Gallo-Resources/"+name;

        fileTransfer.download(
            uri,
            fileURL,
            function(entry) {
                console.log("Download complete: " + entry.fullPath);
                //alert("Descargado en: "+fileURL);
                //alert("Download complete: " + entry.fullPath);
                //params.fullPath = fileURL; //entry.fullPath;
                params.fullPath = fileURL; //entry.fullPath;
                
                params.name =  name;
                params.section = section;
                imagenes.printImage(params);
                /*
                switch(section)
                {
                  case 1:
                    $("#imagen-splash").attr("src", fileURL);
                  break;
                  case 2:
                    $("#imagen-banner-bg").attr("src", fileURL);
                  break;
                  case 3:
                    $("#imagen-banner").attr("src", fileURL);
                  break;

                }
                */

            },
            function(error) {
                console.log("Download error source " + error.source);
                console.log("Download error target " + error.target);
                console.log("Download error code " + error.code);
            },
            false,
            {
                headers: {
                    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                }
            }
        );

    }, imagenes.fileSystemFail.fail);      
  },

  /*
  PINTA LA IMAGEN EN SU RESPECTIVO ELEMENTO
  */

printImage: function(params)
{
  var url = params.fullPath;
  var name = params.name;
  var section = params.section;

  //alert(url+" , "+name+" , "+section);
  section = parseInt(section);
  switch(section)
  {
    case 1:
      $("#imagen-splash").attr("src", url);
    break;
    case 2:
      //$(".imagen-background-bg").css("src", url);
      //$('body.page-container').css('background-image', 'url("' + url + '")');
      $('body .page-container').css('background-image', 'url("'+url+'")');

    break;
    case 3:
      $("#imagen-banner").attr("src", url);

    break;

  }
  app.showLoading('hide');
},



  fail: function(error) {
      console.log(error.code);
  },

  onDirectorySuccess: function(parent) {
      //console.log("Directo " + parent);
  },

  onDirectoryFail: function(error) {
      console.log("Unable to create new directory: " + error.code);
  },
   
  fileSystemFail: function(evt) {
      console.log(evt.target.error.code);
  },
    

};
