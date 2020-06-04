var files = [];

document.getElementById('filepicker').onchange = function(event) {
    files = inputElement.files;
    console.log(inputElement.files);
 }

function klik() {
    var validacija=new Validacija('poruke');
    validacija.naziv('naziv');

    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = () => {
        if(ajax.readyState == 4) {
            if(ajax.status != 200) 
                alert(JSON.parse(ajax.responseText).error.message);
            
            else {
                document.getElementById('glavniSadrzaj').innerHTML = ajax.responseText;
            }
        }
    };
    ajax.open('POST', '/addZadatak', true);
    ajax.setRequestHeader('Accept', 'multipart/form-data');
    ajax.send(JSON.stringify({
        naziv: new FormData(document.querySelector('form')).get('naziv'),
        postavka: document.querySelector('Postavka').files[0]
    }));
}