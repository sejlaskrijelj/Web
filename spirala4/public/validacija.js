var Validacija=(function(){
    //lokalne variable idu ovdje
    var mojDivId='';
    var mojDiv='';
    //nizovi za poruke koje se trebaju ispisati u div-u
    var porukeZaIspis=[];
    var mogucePoruke=["ime","godina","repozitorij","index","naziv","password","url"];


    var konstruktor=function(divElementPoruke){


            mojDivId=divElementPoruke;
            mojDiv=document.getElementById(mojDivId);
            var pomocni=[];
        
            var ispisiGreske=function(){
                pomocni=[];
                for(var i=0;i<porukeZaIspis.length;i++){
                          if(i===porukeZaIspis.length-1) pomocni+="<p>" + porukeZaIspis[i] + "!" +"</p>"
                          else pomocni+="<p>"+ porukeZaIspis[i]+","+"</p>";
        
                }
                if(porukeZaIspis.length!=0) {
                document.getElementById(mojDivId).innerHTML="<p>Sljedeća polja nisu validna: </p>"+pomocni;
                }
                else document.getElementById(mojDivId).innerHTML="";
            }
            var ocistiGresku=function(broj) {
                var brisi=mogucePoruke[broj];
                var nadji=false;
                var brisiIzNiza;
                for(var i=0;i<porukeZaIspis.length;i++) {
                    //trazimo koja greska je ispravljena i brisemo je iz niza za ispisivanje poruka
                    if(porukeZaIspis[i]===brisi) { nadji=true; brisiIzNiza=i;  break; }
                }
                if(nadji) {
                    //ako je greska vec posojala i sada je ispravljena a nadjena je u nizu izbrisi je iz niza jer vise nije greska
                    porukeZaIspis.splice(brisiIzNiza,1);
                }

            }
             

        return{


                ime:function(inputElement){ 
                            var imee = document.getElementById(inputElement).value;
                            if ( imee.match(/^[A-ZČĆŠĐŽ][a-zčćđšž']{2,11}(\s+[A-ZČĆŠĐŽ][a-zčćđšž']{2,11}|\s{0})?(\s+[A-ZČĆŠĐŽ][a-zčćđšž']{2,11}|\s{0})?(\s+[A-ZČĆŠĐŽ][a-zčćđšž']{2,11}|\s{0})?$/g)) {
                                ocistiGresku(0);
                                document.getElementById(inputElement).style.backgroundColor="white";
                                ispisiGreske(); 
                            }
                            else {
                                //provjeravanje da li smo vec jednom ispisivali ovu poruku, ako jesmo necemo je opet dodati u niz za ispis poruka
                                var trazi=mogucePoruke[0];
                                var nadjen=false;
                                for(var i=0;i<porukeZaIspis.length;i++) {
                                    if(porukeZaIspis[i]===trazi) {  nadjen=true; break; }
                                }
                                if(nadjen) {
                                    document.getElementById(inputElement).style.backgroundColor="orangered";
                                }
                                else {
                                    //ako nismo nijednom ispisivali, onda poruku dodaj u niz za poruke i ispisi
                                    porukeZaIspis.push(mogucePoruke[0]);
                                    document.getElementById(inputElement).style.backgroundColor="orangered";
                                    ispisiGreske();
                                }
                                
                            }
                },


                godina:function(inputElement){
                            var godinaa=document.getElementById(inputElement).value;
                            var patern=/^(20[0-9]{2})\/(20[0-9]{2})$/;
                            if(patern.test(godinaa)) {
                            //uzimamo obje godine, konvertujemo i broj, i gledamo razliku koja ne moze biti veca od 1
                            var razlika=godinaa.match(/20\d\d/g);
                            var ab=parseInt(razlika[0]);
                            var cd=parseInt(razlika[1]);
                                if(cd-ab!==1) { 
                                    //trazimo da li smo vec jednom ispsisivali ovu gresku, ako nismo mozemo gresku dodati u niz za ispisivanje poruka
                                    var trazi=mogucePoruke[1];
                                    var nadjen=false;
                                    for(var i=0;i<porukeZaIspis.length;i++) {
                                        if(porukeZaIspis[i]===trazi) {  nadjen=true; break; }
                                    }
                                    if(nadjen) {
                                        document.getElementById(inputElement).style.backgroundColor="orangered";
                                    }
                                    else{
                                        //dodajemo u niz za ispisivanje jer je nismo nijednom dosad ispisivali
                                        porukeZaIspis.push(mogucePoruke[1]);
                                        document.getElementById(inputElement).style.backgroundColor="orangered";
                                        ispisiGreske();
                                    }
                                    
                                
                                }
                            
                                    else{
                                        ocistiGresku(1);
                                        document.getElementById(inputElement).style.backgroundColor="white"; 
                                        ispisiGreske();
                                    }
                                }
                                //ako nikako ne zadovoljava paterrn onda opet treba ispisati gresku
                                else {
                                    var trazi=mogucePoruke[1];
                                    var nadjen=false;
                                    for(var i=0;i<porukeZaIspis.length;i++) {
                                        if(porukeZaIspis[i]===trazi) {  nadjen=true; break; }
                                    }
                                    if(nadjen) {
                                        document.getElementById(inputElement).style.backgroundColor="orangered";
                                    }
                                    else{
                                        //dodajemo u niz za ispisivanje jer je nismo nijednom dosad ispisivali
                                        porukeZaIspis.push(mogucePoruke[1]);
                                        document.getElementById(inputElement).style.backgroundColor="orangered";
                                        ispisiGreske();
                                    }
                                    
                                }
                },


                repozitorij:function(inputElement,regex){
                            var naziv=document.getElementById(inputElement).value;
                            if(regex==null) regex=/^wt18[A-Z][A-Z](1|2)(4|0)[0-9]{3}$/;
                            if(naziv.match(regex)) {
                                ocistiGresku(2);
                                document.getElementById(inputElement).style.backgroundColor="white";
                                ispisiGreske();
                            }
                            else {
                                //trazimo da li smo vec jednom ispsisivali ovu gresku, ako nismo mozemo gresku dodati u niz za ispisivanje poruka
                                var trazi=mogucePoruke[2];
                                var nadjen=false;
                                for(var i=0;i<porukeZaIspis.length;i++) {
                                    if(porukeZaIspis[i]===trazi) {  nadjen=true; break; }
                                }
                                if(nadjen) {
                                    document.getElementById(inputElement).style.backgroundColor="orangered";
                                }
                                else{
                                    //dodajemo u niz za ispisivanje jer je nismo nijednom dosad ispisivali
                                    porukeZaIspis.push(mogucePoruke[2]);
                                    document.getElementById(inputElement).style.backgroundColor="orangered";
                                    ispisiGreske();
                                }
                                
                            
                            }
                },


                index:function(inputElement){
                            var iindex=document.getElementById(inputElement).value;
                            var jeBroj = /^\d+$/.test(iindex);
                            var broj1=parseInt(iindex.charAt(0));
                            var broj2=parseInt(iindex.charAt(1));
                            var rezz=broj1 + broj2;
                            if(iindex.length==5 && (rezz>=14 && rezz<=20) && jeBroj) {
                                ocistiGresku(3);
                                document.getElementById(inputElement).style.backgroundColor = "white";
                                ispisiGreske();
                            }
                            else {
                                //trazimo da li smo vec jednom ispsisivali ovu gresku, ako nismo mozemo gresku dodati u niz za ispisivanje poruka
                                var trazi=mogucePoruke[3];
                                var nadjen=false;
                                for(var i=0;i<porukeZaIspis.length;i++) {
                                    if(porukeZaIspis[i]===trazi) {  nadjen=true; break; }
                                }
                                if(nadjen) {
                                    document.getElementById(inputElement).style.backgroundColor="orangered";
                                }
                                else{
                                    //dodajemo u niz za ispisivanje jer je nismo nijednom dosad ispisivali
                                    porukeZaIspis.push(mogucePoruke[3]);
                                    document.getElementById(inputElement).style.backgroundColor="orangered";
                                    ispisiGreske();
                                }
                                
                                
                            }
                        
                },


                naziv:function(inputElement){
                            var nazivv=document.getElementById(inputElement).value;
                            
                            if (nazivv.match(/^[a-zA-Z][a-zA-Z0-9\/"\\!?':;,-]+[a-z0-9]$/)) {
                                ocistiGresku(4);
                                document.getElementById(inputElement).style.backgroundColor = "white";
                                ispisiGreske();
                            }
                            else {
                                
                                //trazimo da li smo vec jednom ispsisivali ovu gresku, ako nismo mozemo gresku dodati u niz za ispisivanje poruka
                                var trazi=mogucePoruke[4];
                                var nadjen=false;
                                for(var i=0;i<porukeZaIspis.length;i++) {
                                    if(porukeZaIspis[i]===trazi) {  nadjen=true; break; }
                                }
                                if(nadjen) {
                                    document.getElementById(inputElement).style.backgroundColor="orangered";
                                }
                                else{
                                    //dodajemo u niz za ispisivanje jer je nismo nijednom dosad ispisivali
                                    porukeZaIspis.push(mogucePoruke[4]);
                                    document.getElementById(inputElement).style.backgroundColor="orangered";
                                    ispisiGreske();
                                }
                                
                            
                            }
                },


                password:function(inputElement){
                            var pass=document.getElementById(inputElement).value;
                            if (pass.length>=8 && pass.match(/[a-z]{2,}/) && pass.match(/[A-Z]{2,}/) && pass.match(/[0-9]{2,}/)) {
                            if(pass.match(/\w*/)  ) {
                                ocistiGresku(5);
                                document.getElementById(inputElement).style.backgroundColor="white";
                                ispisiGreske();
                            }
                            else {
                                var trazi=mogucePoruke[5];
                                var nadjen=false;
                                for(var i=0;i<porukeZaIspis.length;i++) {
                                    if(porukeZaIspis[i]===trazi) {  nadjen=true; break; }
                                }
                                if(nadjen) {
                                    document.getElementById(inputElement).style.backgroundColor="orangered";
                                }
                                else {
                                    //dodajemo u niz za ispisivanje jer je nismo nijednom dosad ispisivali
                                    porukeZaIspis.push(mogucePoruke[5]);
                                    document.getElementById(inputElement).style.backgroundColor="orangered";
                                    ispisiGreske();
                                }
                                
                            }
                }
            },


                url:function(inputElement){
                            var link=document.getElementById(inputElement).value;
                            if(link.match(/^(http|https|ftp|ssh):\/\/(\w+(\.\w+)*)\/(\w+(\/\w+)*)?(\?[a-z0-9]+(\-[a-z0-9]+)*\=[a-z0-9]+(\-[a-z0-9]+)*)?$/)) {
                                ocistiGresku(6);
                                document.getElementById(inputElement).style.backgroundColor = "white";
                                ispisiGreske();
                            }
                            else {
                                //trazimo da li smo vec jednom ispsisivali ovu gresku, ako nismo mozemo gresku dodati u niz za ispisivanje poruka
                                var trazi=mogucePoruke[6];
                                var nadjen=false;
                                for(var i=0;i<porukeZaIspis.length;i++) {
                                    if(porukeZaIspis[i]===trazi) {  nadjen=true; break; }
                                }
                                if(nadjen) {
                                    document.getElementById(inputElement).style.backgroundColor="orangered";
                                }
                                else{
                                    //dodajemo u niz za ispisivanje jer je nismo nijednom dosad ispisivali
                                    porukeZaIspis.push(mogucePoruke[6]);
                                    document.getElementById(inputElement).style.backgroundColor="orangered";
                                    ispisiGreske();
                                }
                                
                            
                            
                            }


        
                }    
        }
    }
    
    return konstruktor;
    
    }());