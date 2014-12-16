var $genuid = (function(){
	return {

		//Obtiene un numero aleatorio de 0 a 9
		getRandNumber: function(){
			return [0,1,2,3,4,5,7,8,9][Math.floor(Math.random()*9)];
		},

		//Obtiene una cadena de numeros aleatorios del largo indicado en el parametro nsize
		getRandNumbers: function(){
			var pos = new Array();
			var seed = "";
			for(var i=0; i<10;i++){
				pos.push(this.getRandNumber());
			}
			for(var j = 0; j < this.nsize ; j++){
				seed += pos[this.getRandNumber()];
			}
			return seed;
		},

		//Obtiene una cadena de letras aleatorias del largo indicado en el parametro ssize
		getRandString: function(){
			var text = "";
		    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		    for( var i=0; i < this.ssize; i++ )
		        text += possible.charAt(Math.floor(Math.random() * possible.length));

		    return text;
		},
		

		/**
		*
		* devuelve un codigo unico concatenando:
		* - una cadena de numeros (de longitud nsize)
		* - una cadena de caracteres (de longitud ssize)
		* - el tiempo en milisegundo tipo unix
		* - una cadena de numeros (de longitud nsize)
		* - una cadena de caracteres  (de longitud ssize)
		*
		*/

		generate: function() {
			var d = new Date();	
			var uuid = this.getRandNumbers() + this.getRandString() + d.getTime() + this.getRandNumbers() + this.getRandString();
			
			return uuid;
		},
		nsize: 3,
		ssize: 7,
	}
})();