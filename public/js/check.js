var cek = sessionStorage.getItem("cek");
var kek = sessionStorage.getItem("kek");
if (cek == null || kek == null) {
	window.location.href = "Logout";
}else {
	var cek = sjcl.codec.hex.toBits(cek);
}
