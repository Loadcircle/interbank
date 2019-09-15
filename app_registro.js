let app_id = '6y7462ja663VR8i4';
let subscription_key = 'e18e45bd67f9482f867d65bc3e988059'
let username = '6y7462ja663VR8i4';
let password = '26LG89798A32nx2b';
var DNI;
var access_token;
var kbaId;
var correlation_id = 'PREFIX-'+parseInt(Math.random() *1000000);
let customer_id;
let tipo_operacion;
localStorage.setItem("correlation_id", correlation_id);

let trans_correlation_id = 'PREFIX-'+parseInt(Math.random() *1000000);

var last_data;
var last_headers;
var security_code;
var account_id;
var new_assets_token;

var recipient_id;
var service_id;

$('#account_info').click(function(e){
    e.preventDefault();

    DNI = document.getElementById('DNI').value;
    tipo_operacion = $("input[name='tipo_persona']:checked").val();

    getAccessToken();
});


function getAccessToken(){
    alert('Go')
    console.log('getAccessToken')
    var params = {
        // Request parameters
    };
  
    $.ajax({
        url: "https://apidev.digital.interbank.pe/security/v1/oauth/token?" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Authorization","Basic "+ btoa(username + ':' + password));
            xhrObj.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",subscription_key);
        },
        type: "POST",
        // Request body
        data: {
            "grant_type":'client_credentials',
            'scope': 'token:application'
        },
    })
    .done(function(data) {
        console.log(data)
        access_token = data.access_token;
        getKba();

        'https://securitydev.digital.interbank.pe/oauth/authorize?response_type=code&client_id='+app_id+'&scope=token:subscription&state'

    })
    .fail(function() {
        alert("error");
    });

}

function getKba(){
    console.log('getAccessKba')
    var body = {
                "kba": {
                    "customer": {
                    "identityDocuments": [
                        {
                        "type": "DNI",
                        "number": DNI
                        }
                    ]
                    }
                }
                }
    var params = {
        // Request parameters
    };
    
    $.ajax({
        url: "https://apidev.digital.interbank.pe/onboarding/v1/kba?" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Authorization", 'Bearer '+access_token);
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscription_key);
        },
        type: "POST",
        // Request body
        data: JSON.stringify(body),
    })
    
    .done(function(data) {
        console.log(data)
        kbaId = data.kba.id
        responseKBA();
    })
    .fail(function() {
        alert("error");
    });

}

function responseKBA(){
    console.log('responseKBA')
    var params = {
        // Request parameters
    };

    var body = {
                "kba": {
                    "questions": [{
                        "id": "52",
                        "category": "GHI",
                        "answer": {
                        "id": "1"
                        }
                    },
                    {
                        "id": "8",
                        "category": "ABC",
                        "answer": {
                        "id": "4"
                        }
                    },
                    {
                        "id": "51",
                        "category": "DEF",
                        "answer": {
                        "id": "1"
                        }
                    }

                    ]
                }
                };
    
    $.ajax({
        url: "https://apidev.digital.interbank.pe/onboarding/v1/kba/"+kbaId,
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Authorization", 'Bearer '+access_token);
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscription_key);
        },
        type: "PUT",
        // Request body
        data: JSON.stringify(body),
    })
    .done(function(data) {
        console.log(data)
        if(data.kba.customer){
            customer_id = data.kba.customer.id
        }
        if(tipo_operacion == 1){
            createAccount();
        }else{
            createUser();
        }
    })
    .fail(function() {
        alert("error");
    });
}

let global_obj;
function createAccount(){
    console.log('createAccount')

    if(tipo_operacion == 1){

        var body = {
                "account": {
                    "type": "SAVING",
                    "subType": "CUENTA_SIMPLE",
                    "currency": "PEN",
                    "customer": {
                    "id": '0090787875'
                    }
                }
                }
    }else{
        var body = {
                    "account": {
                        "type": "SAVING",
                        "subType": "CUENTA_SIMPLE",
                        "currency": "PEN",
                        "customer": {
                        "id": customer_id
                        }
                    }
                    }

    }
    
    var params = {
        // Request parameters
    };

    $.ajax({
        url: "https://apidev.digital.interbank.pe/onboarding/v1/accounts?" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Authorization","Bearer " + access_token);
            xhrObj.setRequestHeader("X-Correlation-Id", correlation_id);
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscription_key);
            global_obj = xhrObj;
        },
        type: "POST",
        // Request body
        data: JSON.stringify(body),
        
    })


    .done(function(data, textStatus, xhr) {
        console.log(xhr)
        console.log(textStatus)
        console.log(localStorage.correlation_id)

        correlationSearch();

    })
    .fail(function() {
        alert("error");
    });

    // var xhr = new XMLHttpRequest();
    // xhr.open('POST','https://apidev.digital.interbank.pe/onboarding/v1/accounts');
    // xhr.setRequestHeader("Authorization","Bearer " + access_token);
    // xhr.setRequestHeader("Content-Type","application/json");
    // xhr.setRequestHeader("Ocp-Apim-Subscription-Key", subscription_key);



    // var params = 'grant_type=client_credentials&scope=token%3Aapplication';


    // xhr.onreadystatechange = function(event){
    //     console.log("======")
    //     console.log(xhr.getAllResponseHeaders())
    //     console.log(xhr.getResponseHeader('content-type'))
    //         console.log(xhr.getResponseHeader('x-xss-protection'))
    //         console.log(xhr.getResponseHeader('Location'))
    //         console.log("======")

    // console.log(event.target);
    // }
    // xhr.send(JSON.stringify(body));
    // console.log()

}


function createUser(){

    
    var body = {
                "account": {
                    "type": "SAVING",
                    "subType": "CUENTA_SIMPLE",
                    "currency": "PEN",
                    "customer": {
                        "identityDocuments": [
                        {
                        "type": "DNI",
                        "number": DNI
                        }
                    ],
                    "firstName": "RUBEN",
                    "lastName": "FLOREZ",
                    "motherLastName": "GIRALDO",
                    "gender": "MALE",
                    "birthDate": "1978-12-02",
                    "maritalStatus": "SEPARATED",
                    "birthCountry": "PE",
                    "residenceCountry": "PE",
                    "nationality": "PE",
                    "phones": [
                        {
                        "number": "955650179",
                        "carrier": "MOVISTAR"
                        }
                    ],
                    "addresses": [
                        {
                        "country": "PE",
                        "department": "Lima",
                        "province": "Lima",
                        "district": "San Juan de Miraflores",
                        "streetType": "AVENUE",
                        "streetName": "       $23 lOS",
                        "streetNumber": "        100 $A 20",
                        "block": "        %&/ABC12",
                        "lot": "             #$AB12",
                        "apartment": "        2&%$ABC&%$",
                        "neighborhood": "          12&/(abc/()",
                        "landmark": "           $%&12ABC$"
                        }
                    ],
                    "emails": [{
                    "email":"davg2805@GMAIL.COM"
                    }],
                    "ldpd": {
                        "accepted": true
                    }
                
                    }
                }};

    console.log('createUser')

    
    var params = {
        // Request parameters
    };
  
    $.ajax({
        url: "https://apidev.digital.interbank.pe/onboarding/v1/accounts?" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Authorization","Bearer " + access_token);
            xhrObj.setRequestHeader("X-Correlation-Id", correlation_id);
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscription_key);
        },
        type: "POST",
        // Request body
        data: JSON.stringify(body),
    })
    .done(function(data, textStatus, xhr) {
        console.log(xhr)
        console.log(textStatus)
        console.log(localStorage.correlation_id)

        correlationSearch();

    })
    .fail(function() {
        alert("error");
    });

}

function correlationSearch(){
    console.log('correlationSearch')
    var params = {
        // Request parameters
    };
  
    $.ajax({
        url: "https://apidev.digital.interbank.pe/applications/v1/correlations/"+correlation_id+"?" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Authorization", "Bearer " + access_token);
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscription_key);
        },
        type: "GET",
        // Request body
        data: '',
    })
    .done(function(data) {
        console.log(data)
        if(data.correlation){
            security_code = data.correlation.data.security.code;
            account_id = data.correlation.data.account.id;
        }
        subscription();
    })
    .fail(function() {
        alert("error");
    });
}

function subscription(){
    console.log('subscription')
    var params = {
        // Request parameters
    };
    
  
    $.ajax({
        url: "https://apidev.digital.interbank.pe/security/v1/oauth/token?" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Authorization", "Basic "+ btoa(username + ':' + password));
            xhrObj.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",subscription_key);
        },
        type: "POST",
        // Request body
        data: {
            'code':security_code,
            'grant_type': 'authorization_code',
            'redirect_uri':'https://interbank.pe'
        },
    })
    .done(function(data) {
        console.log(data)
        new_assets_token = data.access_token;
        accountBalance();
    })
    .fail(function() {
        alert("error");
    });

}

function accountBalance(){
    console.log('AccountBalance');
    var params = {
        // Request parameters
    };
    
    $.ajax({
        url: "https://apidev.digital.interbank.pe/trx/v1/accounts/"+account_id+"/balance?" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Authorization","Bearer "+ new_assets_token);
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("X-Application-Id", app_id);
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",subscription_key);
        },
        type: "GET"
        // Request body
    })
    .done(function(data) {
        console.log(data)
        transaction();
    })
    .fail(function(data) {
        alert("error");
        console.log(data)
    });

};

function transaction(){
    var params = {
        // Request parameters
    };
    var body = {
        "transaction": {
            "type": "TRANSFER",
            "destination": {
            "financialInstitution": "INTERBANK",
            "id": "8989900222221"
            },
            "currency": "PEN",
            "amount": "1.00",
            "chargeStatement":	"",
            "depositStatement": ""
        }
    }
    $.ajax({
        url: "https://apidev.digital.interbank.pe/trx/v1/accounts/"+account_id+"/transactions?" + $.param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Authorization","Bearer "+ new_assets_token);
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",subscription_key);
            xhrObj.setRequestHeader("X-Application-Id", app_id);
            xhrObj.setRequestHeader("X-Correlation-Id", trans_correlation_id)
            xhrObj.setRequestHeader("X-Api-Force-Sync","true")
        },
        type: "POST",
        // Request body
        data: JSON.stringify(body),
    })
    .done(function(data) {
        console.log("success");
        console.log(data)
    })
    .fail(function() {
        alert("error");
    });
}