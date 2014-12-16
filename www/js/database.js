var db = window.openDatabase("Database", "1.0", "Gallo App", 200000);

var database = {

	initDatabase: function(callback) {
		db.transaction(
			database.populateDB,
			function(error) {
				console.log("Error processing SQL: "+error.message);
        		callback(false);
			},
			function() {
				callback(true);
			}
		);
	},

	populateDB: function(tx) {
        // departamento table
        //tx.executeSql('DROP TABLE IF EXISTS DEPARTAMENTO');
        //tx.executeSql('CREATE TABLE IF NOT EXISTS DEPARTAMENTO (id_departamento INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS DEPARTAMENTO (id_departamento INTEGER PRIMARY KEY, name TEXT)');

        // municipio table
        //tx.executeSql('DROP TABLE IF EXISTS MUNICIPIO');
        //tx.executeSql('CREATE TABLE IF NOT EXISTS MUNICIPIO (id_municipio INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, id_departamento INTEGER)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS MUNICIPIO (id_municipio INTEGER PRIMARY KEY, name TEXT, id_departamento INTEGER)');

        // dbversioning
        tx.executeSql('CREATE TABLE IF NOT EXISTS DBVERSIONING (id_db_versioning INTEGER PRIMARY KEY, release_date DATETIME, version INTEGER)');

        // usertype table
        tx.executeSql('DROP TABLE IF EXISTS USERTYPE');
        tx.executeSql('CREATE TABLE IF NOT EXISTS USERTYPE (id_usertype INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');

        // user table
        tx.executeSql('DROP TABLE IF EXISTS USER');
        tx.executeSql('CREATE TABLE IF NOT EXISTS USER (id_user INTEGER PRIMARY KEY AUTOINCREMENT, fb_id TEXT, fb_email TEXT, tw_id TEXT, id_usertype INTEGER, name TEXT, email TEXT, birth DATE, register_date DATETIME, status INTEGER)');


        // event_type table
        tx.executeSql('DROP TABLE IF EXISTS EVENT_TYPE');
        tx.executeSql('CREATE TABLE IF NOT EXISTS EVENT_TYPE (id_event_type INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');

        // event table
        tx.executeSql('DROP TABLE IF EXISTS EVENT');
        //tx.executeSql('CREATE TABLE IF NOT EXISTS EVENT (id_event INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, short_description TEXT, description TEXT, start_at DATETIME, end_at DATETIME, address TEXT, latitude TEXT, longitude TEXT, id_user INTEGER, id_event_type INTEGER, status INTEGER, id_municipio INTEGER)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS EVENT (id_event INTEGER PRIMARY KEY, name TEXT, short_description TEXT, description TEXT, start_at DATETIME, end_at DATETIME, address TEXT, latitude TEXT, longitude TEXT, id_user INTEGER, id_event_type INTEGER, status INTEGER, id_municipio INTEGER, image_event TEXT)');

        // event_invite table
        tx.executeSql('DROP TABLE IF EXISTS EVENTE_INVITE');
        tx.executeSql('CREATE TABLE IF NOT EXISTS EVENTE_INVITE (id_user INTEGER, id_event INTEGER, confirmed INTEGER, checked_in INTEGER)');

        // event_comment table
        tx.executeSql('DROP TABLE IF EXISTS EVENT_COMMENT');
        tx.executeSql('CREATE TABLE IF NOT EXISTS EVENT_COMMENT (id_event_comment INTEGER PRIMARY KEY AUTOINCREMENT, id_user INTEGER, id_event INTEGER, date DATETIME, comment TEXT, status INTEGER)');

        // aleros table
        tx.executeSql('DROP TABLE IF EXISTS ALERO');
        //tx.executeSql('CREATE TABLE IF NOT EXISTS ALERO (id_alero INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, address TEXT, phone_number TEXT, latitude TEXT, longitude TEXT, photo_path TEXT, id_municipio INTEGER)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS ALERO (id_alero INTEGER PRIMARY KEY, name TEXT, address TEXT, phone_number TEXT, latitude TEXT, longitude TEXT, photo_path TEXT, id_municipio INTEGER)');

        // promotions table
        tx.executeSql('DROP TABLE IF EXISTS PROMOTION');
		tx.executeSql('CREATE TABLE IF NOT EXISTS PROMOTION (id_promotion INTEGER PRIMARY KEY, description TEXT, photo_path TEXT, start_at DATETIME, end_at DATETIME, id_alero INTEGER, status INTEGER)');
        // menu table
        tx.executeSql('DROP TABLE IF EXISTS MENU');
        tx.executeSql('CREATE TABLE IF NOT EXISTS MENU (id_menu INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');

        // menu_item table
        tx.executeSql('DROP TABLE IF EXISTS MENU_ITEM');
        tx.executeSql('CREATE TABLE IF NOT EXISTS MENU_ITEM (id_menu_item INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT, href TEXT, icon TEXT, id_parent INTEGER, id_menu INTEGER)');

        // resource table
        tx.executeSql('CREATE TABLE IF NOT EXISTS RESOURCE (id_resource INTEGER PRIMARY KEY AUTOINCREMENT, src TEXT)');        // event table
        tx.executeSql('DROP TABLE IF EXISTS EVENT');
        //tx.executeSql('CREATE TABLE IF NOT EXISTS EVENT (id_event INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, short_description TEXT, description TEXT, start_at DATETIME, end_at DATETIME, address TEXT, latitude TEXT, longitude TEXT, id_user INTEGER, id_event_type INTEGER, status INTEGER, id_municipio INTEGER)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS EVENT (id_event INTEGER PRIMARY KEY, name TEXT, short_description TEXT, description TEXT, start_at DATETIME, end_at DATETIME, address TEXT, latitude TEXT, longitude TEXT, id_user INTEGER, id_event_type INTEGER, status INTEGER, id_municipio INTEGER, image_event TEXT)');


        // event table (MIS EVENTOS)
        tx.executeSql('DROP TABLE IF EXISTS MY_EVENT');
        //tx.executeSql('CREATE TABLE IF NOT EXISTS EVENT (id_event INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, short_description TEXT, description TEXT, start_at DATETIME, end_at DATETIME, address TEXT, latitude TEXT, longitude TEXT, id_user INTEGER, id_event_type INTEGER, status INTEGER, id_municipio INTEGER)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS MY_EVENT (id_event INTEGER PRIMARY KEY, name TEXT, short_description TEXT, description TEXT, start_at DATETIME, end_at DATETIME, address TEXT, latitude TEXT, longitude TEXT, id_user INTEGER, id_event_type INTEGER, status INTEGER, id_municipio INTEGER)');

    	// event table (MIS EVENTOS)
        tx.executeSql('DROP TABLE IF EXISTS INVITATION');
        tx.executeSql('CREATE TABLE IF NOT EXISTS INVITATION (id_invitation INTEGER PRIMARY KEY,id_user INTEGER,id_event INTEGER, name TEXT, short_description TEXT, description TEXT, start_at DATETIME, end_at DATETIME, address TEXT, latitude TEXT, longitude TEXT, invite_by TEXT,id_user_guest INTEGER,id_event_type INTEGER, status INTEGER, id_municipio INTEGER, confirmed INTEGER, checkin INTEGER)');
        
        tx.executeSql('DROP TABLE IF EXISTS USER_EVENTS');
        tx.executeSql('CREATE TABLE IF NOT EXISTS USER_EVENTS (id_user_event INTEGER PRIMARY KEY AUTOINCREMENT, id_user INTEGER,id_event INTEGER, status INTEGER)'); 
    	
    	///
   		tx.executeSql('CREATE TABLE IF NOT EXISTS PARAM_IMAGE (idBackground INTEGER PRIMARY KEY , ruta TEXT, sectionId INTEGER)');
   		
   		tx.executeSql('CREATE TABLE IF NOT EXISTS UNIQUE_ID (unique_id TEXT , iddb INTEGER)');
   		/*
   		tx.executeSql("INSERT INTO PARAM_IMAGE(idBackground, url_image, sectionId) values (4, 'IMG/TESTIMAGES/IMG1.png', 2 )");
   		tx.executeSql("INSERT INTO PARAM_IMAGE(idBackground, url_image, sectionId) values (5, 'IMG/TESTIMAGES/IMG5.png', 2 )");
   		*/
    },

	insertParamImage: function(params, callback)
	{
		db.transaction(
			function(tx) {
				tx.executeSql("INSERT INTO PARAM_IMAGE (idBackground, ruta, sectionId) values (?,?,?)", params);
			},
			function(error) {
				console.log("Error processing PARAM_IMAGE SQL: "+error.message);
        		callback(false);
			},
			function() {
				callback(true);
			}
		);
	},
	selectAllImages: function(callback)
	{

		db.transaction(
			function(tx) {
				tx.executeSql("SELECT * FROM PARAM_IMAGE", [], function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error SELECT IMAGES SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);	
	},



	insertDepartamento: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("insert into DEPARTAMENTO(id_departamento, name) values(?, ?)", params);
			},
			function(error) {
				console.log("Error processing SQL: "+error.message);
        		callback(false);
			},
			function() {
				callback(true);
			}
		);
	},

	countDepartamentos: function(callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("SELECT count(*) as Total FROM DEPARTAMENTO", [], function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},


	insertMunicipio: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("insert into MUNICIPIO(id_municipio, name, id_departamento) values(?, ?, ?)", params);
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(false);
			},
			function() {
				callback(true);
			}
		);
	},

	insertAlero: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("insert into ALERO(id_alero, name, address, phone_number, latitude, longitude, photo_path, id_municipio) values(?, ?,?,?,?,?,?,?)", params);
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(false);
			},
			function() {
				callback(true);
			}
		);
	},

	insertEventoGallo: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("insert into EVENT(id_event, name, short_description, description, start_at, end_at, address, latitude, longitude, id_user, id_event_type, status, id_municipio, image_event) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", params);
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(false);
			},
			function() {
				callback(true);
			}
		);
	},

	insertPromocion: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("insert into PROMOTION(id_promotion, description, photo_path, start_at, end_at, id_alero, status) values(?,?,?,?,?,?,?)", params);
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(false);
			},
			function() {
				callback(true);
			}
		);
	},

	selectDepartamentos: function(callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("SELECT * FROM DEPARTAMENTO", [], function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},

	selectMunicipios: function(callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("SELECT * FROM MUNICIPIO", [], function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},

	selectAleros: function(callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("SELECT a.*,  m.name as municipio, d.name as departamento  FROM ALERO a, DEPARTAMENTO d, MUNICIPIO m where a.id_municipio = m.id_municipio and m.id_departamento = d.id_departamento ", [], function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},

	selectEventosGallo: function(callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("SELECT e.*, m.name as municipio, d.name as departamento FROM EVENT e, DEPARTAMENTO d, MUNICIPIO m where e.id_municipio = m.id_municipio and m.id_departamento = d.id_departamento", [], function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},

	selectPromociones: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("select * from PROMOTION where id_alero = ?", params, function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},

	selectDepartamento: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("select * from DEPARTAMENTO where id_departamento = ?", params, function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},

	selectMunicipio: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("select * from MUNICIPIO where id_municipio = ?", params, function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},

	selectMunicipioByDepartamento: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("select * from MUNICIPIO where id_departamento = ?", params, function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},

	selectAlero: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("select * from ALERO where id_alero = ?", params, function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},

	selectEventoGallo: function(params, callback) {
		db.transaction(
			function(tx) {
				console.log(params);
                tx.executeSql("select EVENT.*, USER_EVENTS.status AS asistir  from EVENT LEFT JOIN USER_EVENTS ON EVENT.id_event =  USER_EVENTS.id_event where EVENT.id_event = ?", params, function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},

	//Por el momento no uso esta función, tengo que ver si se usa cuando ocurran errores de SQL.
	errorCB: function(err) {
        console.log("errorCB()");
        alert("error");
        console.log("Error processing SQL: "+err.message);
    },

    ///*** PARA MIS EVENTOS


    selectMiEvento: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("select * from MY_EVENT where id_event = ?", params, function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},

	selectMiEventoFullData: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("SELECT e.*, m.name as municipio, d.name as departamento FROM MY_EVENT e, DEPARTAMENTO d, MUNICIPIO m where e.id_event = ? and e.id_municipio = m.id_municipio and m.id_departamento = d.id_departamento", params, function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},

	selectMisEventos: function(callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("SELECT e.*, m.name as municipio, d.name as departamento FROM MY_EVENT e, DEPARTAMENTO d, MUNICIPIO m where e.id_municipio = m.id_municipio and m.id_departamento = d.id_departamento and e.status = 1", [], function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},


	// de WS a BD local
	insertMiEvento: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("insert into MY_EVENT(id_event, name, short_description, description, start_at, end_at, address, latitude, longitude, id_user, id_event_type, status, id_municipio) values(?,?,?,?,?,?,?,?,?,?,?,?,?)", params);
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(false);
			},
			function() {
				callback(true);
			}
		);
	},
	selectPromocionExist: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("select * from PROMOTION where id_promotion = ?", params, function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},
    // JORGE
	selectInivitacion: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("select * from INVITATION where id_invitation = ?", params, function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing INVITATION SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},

	selectInvitaciones: function(callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("SELECT i.*, m.name as municipio, d.name as departamento FROM INVITATION i, DEPARTAMENTO d, MUNICIPIO m where i.id_municipio = m.id_municipio and m.id_departamento = d.id_departamento", [], function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing INVITATION SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},

	insertInvitacion: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("insert into INVITATION(id_invitation, id_user, id_event, name, short_description, description, start_at, end_at, address, latitude, longitude, invite_by,id_user_guest,id_event_type, status, id_municipio,confirmed,checkin) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", params);
			},
			function(error) {
				console.log("Error processing INSERT INVITATION SQL: " + error.message);
        		callback(false);
			},
			function() {
				callback(true);
				console.log("INVITATION INSERTED");
			}
		);
	},

	updateInvitacion: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("UPDATE INVITATION SET "+params[0]+" = "+params[2]+" WHERE id_invitation = "+params[1], []);
			},
			function(error) {
				console.log("Error processing UPDATE INVITATION SQL: " + error.message);
        		callback(false);
			},
			function() {
				callback(true);
				console.log("INVITATION UPDATED");
			}
		);
	},

	countUserEvents: function(params,callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("SELECT count(*) as Total FROM USER_EVENTS WHERE id_user = ?", params , function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},

	insertUserEvent: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("insert into USER_EVENTS (id_user, id_event, status) values(?, ?, ?)", params);
			},
			function(error) {
				console.log("Error processing SQL: "+error.message);
        		callback(false);
			},
			function() {
				callback(true);
			}
		);
	},

	getUserEvent: function(params,callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("SELECT * FROM USER_EVENTS WHERE id_user = ? AND id_event = ?", params, function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error processing getUserEvent SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},

	updateUserEvent: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("UPDATE USER_EVENTS SET status = ? WHERE id_event = ? AND id_user = ?", params);
			},
			function(error) {
				console.log("Error processing updateUserEvent SQL: " + error.message);
        		callback(false);
			},
			function() {
				callback(true);
				console.log("UserEvent UPDATED");
			}
		);
	},

	cancelarMiFiesta: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("UPDATE MY_EVENT SET status = ? WHERE id_event = ?", params);
			},
			function(error) {
				console.log("Error processing cancelarMiFiesta SQL: " + error.message);
        		callback(false);
			},
			function() {
				callback(true);
				console.log("cancelarMiFiesta UPDATED");
			}
		);
	},

	insertVersion: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("insert into DBVERSIONING(id_db_versioning, release_date, version) values(?,?,?)", params);
			},
			function(error) {
				console.log("Error processing INSERT VERSION SQL: " + error.message);
        		callback(false);
			},
			function() {
				callback(true);
				console.log("VERSION INSERTED");
			}
		);
	},

	
	selectVersion: function(callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("SELECT * FROM DBVERSIONING", [], function(tx, results) {
					if(results!=null){
					callback(results);	
					}
					
				});
			},
			function(error) {
				console.log("Error processing SELECT_DBVERSIONING SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);
	},	
	
	updateVersion: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("UPDATE DBVERSIONING SET release_date = ?,  version= ? WHERE id_db_versioning = ?", params);
			},
			function(error) {
				console.log("Error processing UPDATE_DBVERSIONING SQL: " + error.message);
        		callback(false);
			},
			function() {
				callback(true);
			}
		);
	},
	

	selectAllPromos: function(callback)
	{

		db.transaction(
			function(tx) {
				tx.executeSql("SELECT * FROM PROMOTION", [], function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error SELECT ALL RPOMOS SQL: " + error.message);
        		callback(null);
			},
			function() {
			}
		);	
	},


	selectUniqueId: function(callback)
	{

		db.transaction(
			function(tx) {
				tx.executeSql("SELECT * FROM UNIQUE_ID", [], function(tx, results) {
					callback(results);
				});
			},
			function(error) {
				console.log("Error SELECT UNIQUE_ID: " + error.message);
        		callback(null);
			},
			function() {
			}
		);	
	},


	insertUniqueId: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("insert into UNIQUE_ID(unique_id) values(?)", params);
			},
			function(error) {
				console.log("Error processing INSERT UNIQUE_ID: " + error.message);
        		callback(false);
			},
			function() {
				callback(true);
				console.log("unique_id INSERTED");
			}
		);
	},


	updateUniqueId: function(params, callback) {
		db.transaction(
			function(tx) {
				tx.executeSql("UPDATE UNIQUE_ID SET iddb = ? WHERE unique_id = ?", params);
			},
			function(error) {
				console.log("Error processing  SQL: " + error.message);
        		callback(false);
			},
			function() {
				callback(true);
			}
		);
	},


};