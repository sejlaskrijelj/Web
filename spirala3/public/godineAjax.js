var GodineAjax = (function(){
    var konstruktor = function(divSadrzaj) {
        
		ajax = new XMLHttpRequest();

		ajax.onreadystatechange = () => {

			if(ajax.readyState == 4 && ajax.status == 200) {
				divSadrzaj.innerHTML = '';

				let godine = JSON.parse(ajax.responseText);
				
				for(let i = 0; i < godine.length; i++) {
					let element = divSadrzaj.appendChild(document.createElement('div'));
					element.className = 'godina';
					
					let naziv = element.appendChild(document.createTextNode(godine[i].nazivGod));
					element.appendChild(document.createElement('br'));
					let repVje = element.appendChild(document.createTextNode(godine[i].nazivRepVje));
					element.appendChild(document.createElement('br'));
					let repSpi = element.appendChild(document.createTextNode(godine[i].nazivRepSpi));
				}
			}

		}
		ajax.open('GET', 'http:localhost:8080/godine', true);
		ajax.send();
		
		return {
            osvjezi: function() {
                ajax = new XMLHttpRequest();

                ajax.onreadystatechange = () => {

                    if(ajax.readyState == 4 && ajax.status == 200) {
                        divSadrzaj.innerHTML = '';

                        let godine = JSON.parse(ajax.responseText);
                        
                        for(let i = 0; i < godine.length; i++) {
                            let element = divSadrzaj.appendChild(document.createElement('div'));
                            element.className = 'godina';
                            
                            let naziv = element.appendChild(document.createTextNode(godine[i].nazivGod));
                            element.appendChild(document.createElement('br'));
                            let repVje = element.appendChild(document.createTextNode(godine[i].nazivRepVje));
                            element.appendChild(document.createElement('br'));
                            let repSpi = element.appendChild(document.createTextNode(godine[i].nazivRepSpi));
                        }
                    }
   
                }
                ajax.open('GET', 'http:localhost:8080/godine', true);
                ajax.send();

            }
        };
    };

    return konstruktor;
}());

module.exports = GodineAjax;