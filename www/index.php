<?php
//Detection de la langue du navigateur
$acceptLanguage = explode(',', $_SERVER["HTTP_ACCEPT_LANGUAGE"]);
$lang = $acceptLanguage[0];
switch ($lang){
    case "fr":
        //include_once("langues/fr.php");
        header("Location: index_fr.php");
        break;
    case "en":
    default:
        //include_once("langues/en.php");
        header("Location: index_en.php");
        break;
}
?>