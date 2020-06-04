var CommitTabela=(function(){
    var mojaTabela='';
    var prviRed='';
    var zadaciCelija='';
    var commitiCelija='';
   
  var konstruktor=function(divElement,brojZadataka){
      if(brojZadataka===-1) return;
  redovi=brojZadataka;
  redovi++;//povecavamo jer se ovdje ne uzima u obzir prvi red sa nazivima kolona
  /*Prvi red u tabeli sa naslovima kolona: Zadaci i Commiti*/
  mojaTabela = document.createElement("table");
  divElement.appendChild(mojaTabela); 
  mojaTabela.setAttribute("id","mojaTabela");
  prviRed = document.createElement("tr");
   mojaTabela.appendChild(prviRed);
   zadaciCelija = document.createElement("td");
   prviRed.appendChild(zadaciCelija);
   commitiCelija = document.createElement("td");
   prviRed.appendChild(commitiCelija);
   commitiCelija.setAttribute("id","glavna");
  zadaciCelija.innerHTML = "Zadaci";
  commitiCelija.innerHTML = "Commiti";
  zadaciCelija.style.border="1px solid black";
  commitiCelija.style.border="1px solid black";
   mojaTabela.style.border="1px solid black";
   var j=1;
   var cell='';
   var prvaCell='';
   var red='';

  /*Sada pravimo trazeni broj zadataka/redova i svakom dodamo po jednu praznu celiju */
 for(var i=1;i<redovi;i++) {
     red=document.createElement("tr");
     red.setAttribute("id","zadatak"+j);
     mojaTabela.appendChild(red);
     cell=red.insertCell(0);
     cell.innerHTML="Zadatak"+j;
     cell.style.border="1px solid black";
     prvaCell=red.insertCell(1);
     prvaCell.style.border="1px solid black";
     j++;
  }
  
  return{
  dodajCommit:function(rbZadatka,url){
      //trazimo maksimalnu duzinu u tabeli
     var max=0;
      var a=0;
      var sirenje=1;
      var novaCelija;
      var brojUbacenih=0;
     for(var i=1;i<redovi;i++) {
           a=mojaTabela.rows[i].cells.length;
           if(a>max) { max=a;}
      }
      var zadID = rbZadatka + 1;  //id odredjenog reda
      var zad=document.getElementById('zadatak'+zadID); //uzimamo taj red u koji se treba ubaciti coomit
      var cellNum = zad.cells.length-1; //odredimo duzinu tog reda
     
      if(cellNum===max-1) { //znaci da je duzina reda jednaka maksimumu,pa cemo imati dva slucaja
                  if(zad.cells.item(cellNum).innerHTML=="") { //slucaj1; ako je zadnja celija u tom redu prazna samo upisemo commit
                      zad.cells.item(cellNum).innerHTML='<a href="'+ url +'">' + cellNum + '</a>';
                  }
                  else {
                      //slucaj2:zadnja celija nije prazna i moramo dodati jednu novu celiju i proci kroz sve redove da colspan-amo zadnje celije tih redova(ako su one prazne
                      cellNum++;
                      novaCelija=zad.insertCell(-1); //dodajemo novu celiju i upisujemo u nju 
                      novaCelija.innerHTML='<a href="'+ url +'">' + cellNum + '</a>';
                      novaCelija.style.border="1px solid black";
                      for(var i=1;i<redovi;i++) { //pretrazujemo sve ostale redove 
                          var red=document.getElementById('zadatak'+i);
                          x=red.cells.length-1;
                              if(i!==zadID) { //sirimo prazne celije svih redova osim onog u kojeg smo upravo dodali commit
                             if(red.cells.item(x).innerHTML==""){ red.cells.item(x).colSpan=max-red.cells.length+2; red.cells.item(x).setAttribute("id","celijaReda"+i); }//ako je zadnja celija prazna samo je prosiri i postavi id toj celiji
                              else { //ako nije prazna celija dodaj novu, i prosiri je da se izjednaci sa maks redom
                                      novaCelija=red.insertCell(-1);
                                      novaCelija=red.cells.item(red.cells.length-1);
                                      novaCelija.colSpan=max-red.cells.length;
                                      novaCelija.style.border="1px solid black";
                                     }
                            }
                         }
                        //prosirimo glavnu celiju za jedan vise
                      document.getElementById('glavna').colSpan=max; 
                      var drugi =document.getElementById('zadatak2'); 
                      console.log("max za drugi red je:"+drugi.cells,length);
                       }
                  }
 
      else {  //ako red u koji se ubacuje commit nije maksimalni, onda samo pisi u prazan prostor
          novaCelija=zad.insertCell(zad.cells.length-1);
          brojUbacenih=zad.cells.length;
          var ispis=brojUbacenih-2;
          novaCelija.innerHTML='<a href="'+ url +'">' + ispis + '</a>';
          novaCelija.style.border="1px solid black";
          var novi=zad.cells.item(zad.length);
          var smanji=document.getElementById('celijaReda'+zadID);
          smanji.colSpan=max-zad.cells.length+1;
          
      }
},
  
  editujCommit:function(rbZadatka,rbCommita,url){
               
               if(rbZadatka>redovi || rbCommita>mojaTabela.rows[rbZadatka+1].cells.length-1 ) return -1;
               else {
                   mojaTabela.rows[rbZadatka+1].cells.item(rbCommita).innerHTML='<a href="'+ url +'">' + rbCommita+ '</a>';
               }
  }
  /*obrisiCommit:function(rbZadatka,rbCommita){...}
  */

  }
}
  return konstruktor;
  }());
  