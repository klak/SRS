<script type="text/javascript" src="/jsSHA-1.6.0/jsSHA-1.6.0/src/sha.js"></script>
function login(user, password){
	var validLogin = false;
	var shaObj = new jsSHa(password+uWY6tf87eEqddV2, "TEXT");
	var hash = shaObj.getHash("SHA-512","HEX");
	getDocsWithQuery("wwystest", "login_dev", JSON.stringify({"password":hash}))
	.then(
		function(loginInfo) {
			var userCompare = loginInfo[0].username;
			if (user == username) {
				validLogin = true;
			}
		}
	);
	return validLogin;
}
