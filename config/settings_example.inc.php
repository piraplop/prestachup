<?php
/**
 * Replace the beginning of your settings file.
 * Keep the end of your files.
 */
require_once( __DIR__ . './../_config.php' );

global $_config;

// Database configuration
define('_DB_SERVER_',   $_config['db']['host']);
define('_DB_NAME_',     $_config['db']['name']);
define('_DB_USER_',     $_config['db']['user']);
define('_DB_PASSWD_',   $_config['db']['password']);
define('_DB_PREFIX_',   $_config['db']['prefix']);