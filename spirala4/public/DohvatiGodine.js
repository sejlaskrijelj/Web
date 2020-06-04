var DohvatiGodine = (function(){
    //var divSadrzaj = document.getElementById('divSadrzaj');
    var konstruktor = function(divSadrzaj){
        //console.log('Usao');
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function(){
            if(ajax.readyState == 4 && ajax.status == 200){
                var pomocni = JSON.parse(this.responseText);
                var tekst = '';
                for(var i = 0; i < pomocni.length; i++) {
                    tekst += '<div class = "a">';
                    tekst += '<p id="prvi">naziv godine:'+ pomocni[i].nazivGod +'</p>';
                    tekst += '<p><b>naziv repozitorija vjezbi:</b>'+ pomocni[i].nazivRepVje +'</p>';
                    tekst += '<p><b>naziv repozitorija spirale:</b>'+ pomocni[i].nazivRepSpi +'</p>';
                    tekst += '</div>';
                }
                document.getElementById(divSadrzaj).innerHTML += tekst;
            }
            if(ajax.readyState == 4 && ajax.status == 404){
                
            }
        }
        ajax.open("GET", "http://localhost:8080/godine", true);
        ajax.send();
        return {
            osvjezi:function(){
                var ajax = new XMLHttpRequest();
                ajax.onreadystatechange = function(){
            if(ajax.readyState == 4 && ajax.status == 200){
                var pomocni = JSON.parse(this.responseText);
                var tekst = '';
                for(var i = 0; i < pomocni.length; i++) {
                    tekst += '<div class = "a">';
                    tekst += '<p id="prvi">naziv godine:'+ pomocni[i].nazivGod +'</p>';
                    tekst += '<p><b>naziv repozitorija vjezbi:</b>'+ pomocni[i].nazivRepVje +'</p>';
                    tekst += '<p><b>naziv repozitorija spirale:</b>'+ pomocni[i].nazivRepSpi +'</p>';
                    tekst += '</div>';
                }
                document.getElementById(divSadrzaj).innerHTML += tekst;
            }
            if(ajax.readyState == 4 && ajax.status == 404){
                
            }
        }
        ajax.open("GET", "http://localhost:8080/godine", true);
        ajax.send();
            }
        }
    } 
    return konstruktor;
}());



module.exports=DohvatiGodine;