<?php

global $_config;

/* ======================================================
*  Config
*  =====================================================*/

$_config = array(

    'project' => array(
        'title'     => 'Prestachup',
        'author'    => array(
            'Your name' => 'name@prestachup.com',
        ),
    ),

    'envs' => array(
        'development' => 'http://loc.prestachup.com',       //  Your local environment - Ex: MAMP
        'staging'     => 'http://staging.prestachup.be',    //  Your demonstration environment to show on your client / team
        'production'  => 'http://prestachup.com',           //  The production environment
    ),

    'db' => array(
        'charset'   => 'utf8',
        'collate'   => '',
        'driver'    => 'mysql',
        'prefix'    => 'chup_',         // Database prefix

        'name'      => 'prestachup',    // Database name
        'user'      => 'root',          // Database username
        'password'  => 'root',          // Database password
        'host'      => 'localhost',     // Database host
    ),
);


/* ======================================================
*  Environment
*  =====================================================*/

function _env_match($env) {
    global $_config;
    $url = $_config['envs'][$env];
    if ($url) return preg_match('/' . preg_quote($url, '/') . '/', 'http://' . $_SERVER['SERVER_NAME']);
    return 0;
}

if (_env_match('development')) {

    define('PS_ENV', 'development');
    define('_PS_MODE_DEV_', true);

} elseif (_env_match('staging')) {

    define('PS_ENV', 'staging');
    define('_PS_MODE_DEV_', false);

    $_config['db']['user']      = 'staging_user';       // Database STAGING username
    $_config['db']['password']  = 'staging_password';   // Database STAGING password


    ini_set('max_input_vars', 3000);

    ini_set('display_errors', 0);
    ini_set('log_errors', 1);

} elseif (_env_match('dist')) {

    define('PS_ENV', 'development');
    define('_PS_MODE_DEV_', true);

} else {

    define('PS_ENV', 'production');
    define('_PS_MODE_DEV_', true);

    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
}


/* ======================================================
*  Constant
*  =====================================================*/
$_config['env'] = PS_ENV;


/* ======================================================
*  Error
*  =====================================================*/
define('_PS_DISPLAY_COMPATIBILITY_WARNING_', false);


/* ======================================================
*  Server
*  =====================================================*/
// some stuff as ini_set, set_time_limit, etc


/* ======================================================
*  Load libs
*  =====================================================*/
if( file_exists(__DIR__.'/vendor/autoload.php') ){
    require_once( __DIR__.'/vendor/autoload.php');
}
