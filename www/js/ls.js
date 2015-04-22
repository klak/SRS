function login(user, password){
	var validLogin = false;
	var shaObj = new jsSHA(password+"uWY6tf87eEqddV2", "TEXT");
	var hash = shaObj.getHash("SHA-512","HEX");
	getDocsWithQuery("wwystest", "login_dev", JSON.stringify({"password":hash}))
	.success(
		function(loginInfo) {
			if (loginInfo.length > 0 && user == loginInfo[0].username) {
				validLogin = true;
			}
		}
	);
	return validLogin;
}
