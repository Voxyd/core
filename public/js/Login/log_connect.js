/**
** @name        : connect.js
** @authors     : Romain Claveau <romain.claveau@protonmail.ch>, ...
** @description : Méthode permettant la connexion à l'application
**/


/*
* @name         : sendConnectionRequest()
* @description  : Permet l'envoi de la requête de connexion avec les identifiants
*/
var sendConnectionRequest = function()
{
    var field_mail = document.querySelector("#field_mail").value;
    var field_password = document.querySelector("#field_password").value;
    var field_passphrase = document.querySelector("#field_passphrase").value;

    var returnArea = document.querySelector("#return");

    returnArea.innerHTML = "<img src='./public/pictures/index/loader.gif' style='height: 3vh;' />";

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "Connexion/Login", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function()
    {
        if(xhr.status == 200 && xhr.readyState == 4)
        {

            console.log(xhr.responseText);

            switch(xhr.responseText)
            {
                case "ok":
                        getKey(field_passphrase);
                    break;

                case "errorForm":
                    returnArea.innerHTML = "<p class='warning'>Tous les champs doivent être remplis</p>";
                    break;

                case "errorID":
                    returnArea.innerHTML = "<p class='error'>Le couple identifiant/mot de passe n'est pas reconnu</p>";
                    break;

                case "errorSession":
                    returnArea.innerHTML = "<p class='error'>Impossible d'ouvrir cette session, celle-ci est déjà ouverte par quelqu'un d'autre</p>";
                    break;

                default:
                    returnArea.innerHTML = "<p class='error'>Erreur inconnue</p>";
                    break;
            }
        }
    }
    xhr.send("mail="+encodeURIComponent(field_mail)+"&pass="+sha512(field_password)+"&passphrase="+sha512(field_passphrase));
}
/*
* @name         : getKeys(string passphrase)
* @description  : Permet la récupération des clés privée et publique
*/
var getKey = function(passphrase)
{
    var returnArea = document.querySelector("#return");
    var status_key;
    var xhr_private_key = new XMLHttpRequest();
    xhr_public.open("POST", "Connexion/getPrivateKey", true);
    //xhr_public.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr_public.onreadystatechange = function()
    {
        if(xhr_private_key.status == 200 && xhr_public.readyState == 4)
        {

            if(xhr_private_key.responseText == "")
            {
              alert("Private key cannot be recieved");
                status_key = 0;
            }
            else
            {
                sessionStorage.setItem("privateKey", xhr_private_key.responseText);

                status_key = 1;
            }
        }
    }

    xhr_private_key.send(null);

    var checkKeysStatus = setInterval(function(){
        if(statusPublicKey == 1 && statusPrivateKey == 1)
        {
            clearInterval(checkKeysStatus);
            encryptPassphrase(passphrase);
        }
    }, 500);
}

/*
* @name         : encryptPassphrase(string passphrase)
* @description  : Permet de chiffrer le mot de passe de la clé privée et de le stocker en local
*/
var encryptPassphrase = function(passphrase)
{
    var returnArea = document.querySelector("#return");

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "Connexion/getToken", true);

    xhr.onreadystatechange = function()
    {
        if(xhr.status == 200 && xhr.readyState == 4)
        {
            if((xhr.responseText).length == 128)
            {
                sessionStorage.setItem("token", CryptoJS.AES.encrypt(passphrase, xhr.responseText));

                returnArea.innerHTML = "<p class='success'>Authentification terminée. Redirection en cours...</p>";

                setTimeout(function(){
                    openSession();
                }, 1000);
            }
            else
            {
                returnArea.innerHTML = "<p class='error'>Erreur lors de l'authentification. Veuillez réessayer ultérieurement</p>";

                setTimeout(function(){
                    destroySession();
                }, 1000);
            }
        }
    }

    xhr.send(null);
}

/*
* @name         : openSession()
* @description  : Ouverture de la session
*/
var openSession = function()
{
    document.location.href = "Accueil";
}

/*
* @name         : destroySession()
* @description  : Destruction de la session
*/
var destroySession = function()
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "Connexion/destroySession", true);

    xhr.onreadystatechange = function()
    {
        if(xhr.status == 200 && xhr.readyState == 4)
        {
            document.location.href = "Accueil";
        }
    }

    xhr.send(null);
}
