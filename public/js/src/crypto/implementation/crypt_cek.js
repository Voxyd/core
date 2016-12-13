
/*
* @name: cekEncryption()
* @description: encrypt the cek before send it to the server
* @params: passphrase, cek
* @dependencies: base64.js
* @note: the salt used to encrypt is randomly generated by SJCL.
*/
var cekEncryption = function(passphrase, cek)
{
	var cek = base64.decode(cek); //decode it before encrypt it
	var passphrase = base64.decode(passphrase);
	var aDATA = sjcl.random.randomWords(1); //4 bits array <=> 1 byte
	var aDATA = sjcl.codec.base64.fromBits(aDATA); //encode it, that was just to generate a random string for the auth data to check file's integrity
	var encryptedCEK = sjcl.encrypt(passphrase, cek,{
		mode:'gcm', ks:256, ts:128, iter:2000, adata:aDATA
	});
	var encryptedCEK = base64.encode(encryptedCEK); //return base64 encoded json generated by SJCL
	return encryptedCEK;
}

/*
* @name: cekDecryption()
* @description: decrypt the CEK after downloaded the encrypted CEK
* @params: passphrase, cek
* @dependencies: base64.js
*/
var cekDecryption = function(passphrase, cek)
{
	var decryptedCEK = base64.decode(cek); //decode it because the CEK is b64 encoded in a cookie
	var passphrase = base64.decode(passphrase); //same
	var decryptedCEK = sjcl.decrypt(passphrase, decryptedCEK);
	var decryptedCEK = base64.encode(decryptedCEK); //return b64 encoded to store it somewhere (cookie, send it to the servers...)
	return decryptedCEK;
}