<?PHP
require_once __DIR__ . '/vendor/autoload.php';
use \Firebase\JWT\JWT;

// Get your service account's email address and private key from the JSON key file
$service_account_email = "o365auth@scrumnow-5060b.iam.gserviceaccount.com";
$private_key = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC90a0io5TqwMiY\n6TNqw6bOd3csPl7GKpV3iHFqdukt0kL7Ij2zmvBapBclHQLADEc9Zee6utZXmk3V\nx4WtvZUsZ4ad8+28pZjcV1j8r9mNCp+V9y/cyZQsN7bIuxHJEy2bLHwQqA+2ldH/\nCdtKJJC++v3iumKXrJtwDFthfncaZVfadF91x52DeNB7X9cHX1a76kMGaoGvfip+\netSgr4f76g2xUUDQY5g8dANWFGcLKBBcAfif1qG8BjyRTYezzZo746axEJMhu7zE\n+1FatzXdSuLQ0t0B0th5+wZEFOrCoOe3CA7EYR14os2xzM9LO+xFsQX1aw6NFPj5\n6HPg1IMTAgMBAAECggEAM6TE5Kw522bJDOVBonYJv5m8ODLd6S9zy/o41Tz18wwG\nQjpOLDvm0dpcG7JZabPNfBRqKCEmKN5n99ZZdewjFloyQ242y8EIJkazhMg5Ocje\no1gF0x2a7S7ZUaKn05ueqF3BgWygHc6EPE3Ltk/de8Bg69tG8Lo67hDGme9k6y6Y\nAG9XB6eUVB/D3j2CPp27Dygupu0WIroEHE69xGcQ7f9kBy5saz7tKr2mWCYTPdEw\nNGFiCeNFCkKs/lVM6Si1VQCX6He3dg9TJ/Pg8+GC5PHHviGW0htWI5UBC+a/PSX0\ncXbuusmQbCPsUkA6Rzv6rKueSTI4XabtOfe4thx/WQKBgQDwi/syvK6JrnUR82DA\nUEvStm+ioqVGReFV4hlIUO1fmIdcptC7itU+t7Q7bDeo2kC6xKrvz+f4dmr3OS+o\nNjjZpulza0cM0s4bKHHXr4K53U1QVMg3CiW2mFiwYMABimJ5eRIkJ9fWHtF1kbWc\n6CUNA0z9R/OvqI5oEd/+/hXZSwKBgQDKA23rQq0nKVPFy8eTc1wciroNnLy9IJpb\nL31DltKoJ2ygZH67Ta1pyHnJie8vxi3DrPuHT8Qtu6hGaeiTI2wDYk3MMyZEdhHU\nlzeTIL/vHk+WFuriGcmKys+aRD9LPUQkwTX0dvVqcdNY/6gQEsja7a2CNWqoAnpr\n4U6tGPDoWQKBgQC9aw1g87FhW852Vzct2U0L3XtlDzykbKy3q3aLOqbha0PUUsv1\nkqq/W3uCe4IM5eio6etNMmORhPZQPWjoxeHYipY0vBpT38BLJHsZA+0mHT0fb9PF\ne6kc8zSLl3Q7AlTvIMaHUBSnWNdKBHaF20wpxhqfLESZY1rYWpMPwddEpwKBgE1Z\nvs7kOvTRyDfmbUayV0S+gbsQltw8DZ54spgcuhCU9+z6TeReO9ZTYv6eiC1czs0s\nASuwiUeRoT9E8j7Uw1kQXQWhWDfCldU3CZqWYaenjYXExK9KfHdebNt+4lVm4h7I\ntGYk3pehefGMAsgUyT+63kMLPQmT2VhRbxSshiIRAoGAApCzq8P3Ls8ydvDivfe1\nPqwJugXKRunhILu5gzgta44b5m04jzAZpgWfId38jb7WhpxXfG3mkE/nYhmp7P5t\nGRkpx92cG5OsxjLlHROizxLXRt1AkPSNuWR+NMjdRGx0x4PzWxanY+/v1SMguWY7\nMkwcLdS4U7U7zBUCqH2kB8w=\n-----END PRIVATE KEY-----\n";

//$uid = "10037FFE93BADA30";
$uid = $_POST['uid'];
$premium_account = $uid;

$token = create_custom_token($uid, $premium_account);
echo $token;

function create_custom_token($uid, $is_premium_account) {
  global $service_account_email, $private_key;

  $now_seconds = time();
  $payload = array(
    "iss" => $service_account_email,
    "sub" => $service_account_email,
    "aud" => "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
    "iat" => $now_seconds,
    "exp" => $now_seconds+(60*60),  // Maximum expiration time is one hour
    "uid" => $uid,
    "claims" => array(
      "premium_account" => $is_premium_account
    )
  );
  return JWT::encode($payload, $private_key, "RS256");
}

/*
// Functions to get public keys
function loadKeysFromAzure($string_microsoftPublicKeyURL) {
    $array_keys = array();

    $jsonString_microsoftPublicKeys = file_get_contents($string_microsoftPublicKeyURL);
    $array_microsoftPublicKeys = json_decode($jsonString_microsoftPublicKeys, true);

    foreach($array_microsoftPublicKeys['keys'] as $array_publicKey) {
        $string_certText = "-----BEGIN CERTIFICATE-----\r\n".chunk_split($array_publicKey['x5c'][0],64)."-----END CERTIFICATE-----\r\n";
        $array_keys[$array_publicKey['kid']] = getPublicKeyFromX5C($string_certText);
    }

    return $array_keys;
}

function getPublicKeyFromX5C($string_certText) {
    $object_cert = openssl_x509_read($string_certText);
    $object_pubkey = openssl_pkey_get_public($object_cert);
    $array_publicKey = openssl_pkey_get_details($object_pubkey);
    return $array_publicKey['key'];
}

// JWT Validation
function validateAccessToken() {
	//$clientid = getenv('clientid');
	//$clientid = '5c93e666-fa95-42ec-a5f9-5d197567622c';
	//$clientid =  '106930890879260543899';
	$clientid = 'https://graph.microsoft.com';
	//$headers = getallheaders();
	//$authorization = explode(' ', $headers['Authorization']);
	//$accessToken = $authorization[1];
	$accessToken = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IkFRQUJBQUFBQUFCbmZpRy1tQTZOVGFlN0NkV1c3UWZkektZQXZRYjl2dHZhMVlVWGc1aS1ObVZxdWZHZEVKN3NGZFNWV0NBT01oOFpOVnJZZjF4Zl91a0ZoRXFMYWRPVVY1RXY4dkU3b3VOUTVrbi1CWEZWckNBQSIsImFsZyI6IlJTMjU2IiwieDV0IjoiOUZYRHBiZk1GVDJTdlF1WGg4NDZZVHdFSUJ3Iiwia2lkIjoiOUZYRHBiZk1GVDJTdlF1WGg4NDZZVHdFSUJ3In0.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC84MDA4Mjg1Yi1hM2Y0LTRjMGQtODBhNS0yOGQ2MjYzZjllM2IvIiwiaWF0IjoxNTAwNDczMjc2LCJuYmYiOjE1MDA0NzMyNzYsImV4cCI6MTUwMDQ3NzE3NiwiYWNyIjoiMSIsImFpbyI6IkFTUUEyLzhEQUFBQTMvREdqd2huNk1ETWVleGRIbVRYSmJ6SklweExqb0hmUkl1UGRyTDR0S0U9IiwiYW1yIjpbInB3ZCJdLCJhcHBfZGlzcGxheW5hbWUiOiJPZmZpY2UgMzY1IEF1dGhlbnRpY2F0aW9uIiwiYXBwaWQiOiI1YzkzZTY2Ni1mYTk1LTQyZWMtYTVmOS01ZDE5NzU2NzYyMmMiLCJhcHBpZGFjciI6IjAiLCJlX2V4cCI6MjYyODAwLCJmYW1pbHlfbmFtZSI6IkRldmVsb3BlciIsImdpdmVuX25hbWUiOiJQb3J0YWwiLCJpcGFkZHIiOiIxMTIuMTk4LjEzNC4xNTIiLCJuYW1lIjoiUG9ydGFsIERldmVsb3BlciIsIm9pZCI6IjBjYWI3MzljLWNiZTctNGM1NC05ZWJkLWRlOGEwMTBiMTQ3ZiIsInBsYXRmIjoiNSIsInB1aWQiOiIxMDAzN0ZGRTkzQkFEQTMwIiwic2NwIjoiVXNlci5SZWFkIiwic3ViIjoibU42Z3dIa21zYzAyQ0NQMWUzSDV2VjYxWm1EaWdyT1FtSGM4WTduZkpVcyIsInRpZCI6IjgwMDgyODViLWEzZjQtNGMwZC04MGE1LTI4ZDYyNjNmOWUzYiIsInVuaXF1ZV9uYW1lIjoicG9ydGFsZGV2QG8zNjVmb3JkdW1taWVzLmNvbSIsInVwbiI6InBvcnRhbGRldkBvMzY1Zm9yZHVtbWllcy5jb20iLCJ1dGkiOiJmU0h4WWtIektVdV9YQ2dDV3JRSkFBIiwidmVyIjoiMS4wIn0.aBf7IY1aev_FpgXXgJfRYRAzo0GcJT82f6KPZbTuSKGENHFAx6YFgZS2YxUvtUWC7oXZtIaAyasxjXTI5nf7FcWTvohPFR3z2_35UOhWKDB2EPwnronZ2gox7kMXZQL0f-BzX6QvsN8eJCm6YLHgpbo4WZ0WGVJZb3wP0WPi0NuPwPD4qGtBaOhs0V2-sxgI-Mb1nAySCadiMdSd2MN5MHnRlKIstQ8LqrqLf9VPVd8WVlVaw-PO__LhXuLwniSoQl71IZczQWAYOik_fyEN4zSgT0wtvbPqMpNoJkLP15rkL0cB3ePBdx19EXG-HoZ-NVu8axMKjy6DyZv7o-xFPA';

	if ($accessToken == "") {
		echo "No access token retrieved";
	} else {
		$string_microsoftPublicKeyURL = 'https://login.windows.net/common/discovery/keys';
		$array_publicKeysWithKIDasArrayKey = loadKeysFromAzure($string_microsoftPublicKeyURL);	
		//$array_publicKeysWithKIDasArrayKey = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC90a0io5TqwMiY\n6TNqw6bOd3csPl7GKpV3iHFqdukt0kL7Ij2zmvBapBclHQLADEc9Zee6utZXmk3V\nx4WtvZUsZ4ad8+28pZjcV1j8r9mNCp+V9y/cyZQsN7bIuxHJEy2bLHwQqA+2ldH/\nCdtKJJC++v3iumKXrJtwDFthfncaZVfadF91x52DeNB7X9cHX1a76kMGaoGvfip+\netSgr4f76g2xUUDQY5g8dANWFGcLKBBcAfif1qG8BjyRTYezzZo746axEJMhu7zE\n+1FatzXdSuLQ0t0B0th5+wZEFOrCoOe3CA7EYR14os2xzM9LO+xFsQX1aw6NFPj5\n6HPg1IMTAgMBAAECggEAM6TE5Kw522bJDOVBonYJv5m8ODLd6S9zy/o41Tz18wwG\nQjpOLDvm0dpcG7JZabPNfBRqKCEmKN5n99ZZdewjFloyQ242y8EIJkazhMg5Ocje\no1gF0x2a7S7ZUaKn05ueqF3BgWygHc6EPE3Ltk/de8Bg69tG8Lo67hDGme9k6y6Y\nAG9XB6eUVB/D3j2CPp27Dygupu0WIroEHE69xGcQ7f9kBy5saz7tKr2mWCYTPdEw\nNGFiCeNFCkKs/lVM6Si1VQCX6He3dg9TJ/Pg8+GC5PHHviGW0htWI5UBC+a/PSX0\ncXbuusmQbCPsUkA6Rzv6rKueSTI4XabtOfe4thx/WQKBgQDwi/syvK6JrnUR82DA\nUEvStm+ioqVGReFV4hlIUO1fmIdcptC7itU+t7Q7bDeo2kC6xKrvz+f4dmr3OS+o\nNjjZpulza0cM0s4bKHHXr4K53U1QVMg3CiW2mFiwYMABimJ5eRIkJ9fWHtF1kbWc\n6CUNA0z9R/OvqI5oEd/+/hXZSwKBgQDKA23rQq0nKVPFy8eTc1wciroNnLy9IJpb\nL31DltKoJ2ygZH67Ta1pyHnJie8vxi3DrPuHT8Qtu6hGaeiTI2wDYk3MMyZEdhHU\nlzeTIL/vHk+WFuriGcmKys+aRD9LPUQkwTX0dvVqcdNY/6gQEsja7a2CNWqoAnpr\n4U6tGPDoWQKBgQC9aw1g87FhW852Vzct2U0L3XtlDzykbKy3q3aLOqbha0PUUsv1\nkqq/W3uCe4IM5eio6etNMmORhPZQPWjoxeHYipY0vBpT38BLJHsZA+0mHT0fb9PF\ne6kc8zSLl3Q7AlTvIMaHUBSnWNdKBHaF20wpxhqfLESZY1rYWpMPwddEpwKBgE1Z\nvs7kOvTRyDfmbUayV0S+gbsQltw8DZ54spgcuhCU9+z6TeReO9ZTYv6eiC1czs0s\nASuwiUeRoT9E8j7Uw1kQXQWhWDfCldU3CZqWYaenjYXExK9KfHdebNt+4lVm4h7I\ntGYk3pehefGMAsgUyT+63kMLPQmT2VhRbxSshiIRAoGAApCzq8P3Ls8ydvDivfe1\nPqwJugXKRunhILu5gzgta44b5m04jzAZpgWfId38jb7WhpxXfG3mkE/nYhmp7P5t\nGRkpx92cG5OsxjLlHROizxLXRt1AkPSNuWR+NMjdRGx0x4PzWxanY+/v1SMguWY7\nMkwcLdS4U7U7zBUCqH2kB8w=\n-----END PRIVATE KEY-----\n';
		$token = JWT::decode($accessToken, $array_publicKeysWithKIDasArrayKey, array('RS256'));
		//$token = JWT::decode($accessToken, $array_publicKeysWithKIDasArrayKey, 'RS256');
		if ($token->aud == $clientid) {
			return $token;
		}
	}
}

$token = validateAccessToken();
if ($token <> "") {
	echo '
{
	"0001": {
		"ID": "Mittens",
		"Description": "Mittens - Destroyer of pillows!"
	},
	"0002": {
		"ID": "Buff",
		"Description": "Buff - Lover of cat food..."
	},
	"0003": {
		"ID": "Fluffy",
		"Description": "Fluffy - Where no hair has gone before!"
	}
}
	';
} else {
	die();
}
*/
	
?>