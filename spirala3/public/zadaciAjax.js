let ZadaciAjax = (function() {

    let openRequests = 0;

    let konstruktor = function(callbackFn) {
        return {
            dajXML: function() {

                if(openRequests !== 0) {
                    return callbackFn({
                        greska: "Već ste uputili zahtjev"
                    });
                }

                let ajax = new XMLHttpRequest();
                ajax.onreadystatechange = () => {

                    if(ajax.readyState == 4 && ajax.status == 200) {
                        openRequests--;
                        callbackFn(ajax.responseText);
                    }

                };

                ajax.open('GET', 'http://localhost:8080/zadaci', true);
                openRequests++;
                ajax.timeout = 2000;
                ajax.setRequestHeader('Accept', 'application/xml');
                ajax.send();

            },
            dajCSV: function() {

                if(openRequests !== 0) {
                    return callbackFn({
                        greska: "Već ste uputili zahtjev"
                    });
                }

                let ajax = new XMLHttpRequest();
                ajax.onreadystatechange = () => {

                    if(ajax.readyState == 4 && ajax.status == 200) {
                        openRequests--;
                        callbackFn(ajax.responseText);
                    }

                }

                ajax.open('GET', 'http://localhost:8080/zadaci', true);
                openRequests++;
                ajax.timeout = 2000;
                ajax.setRequestHeader('Accept', 'text/csv');
                ajax.send();

            },
            dajJSON: function() {

                if(openRequests !== 0) {
                    return callbackFn({
                        greska: "Već ste uputili zahtjev"
                    });
                }

                let ajax = new XMLHttpRequest();
                ajax.onreadystatechange = () => {

                    if(ajax.readyState == 4 && ajax.status == 200) {
                        openRequests--;
                        callbackFn(JSON.parse(ajax.responseText));
                    }

                }

                ajax.open('GET', 'http://localhost:8080/zadaci', true);
                openRequests++;
                ajax.timeout = 2000;
                ajax.setRequestHeader('Accept', 'application/json');
                ajax.send();

            }
        }
    }

    return konstruktor;
}());

module.exports = ZadaciAjax;
