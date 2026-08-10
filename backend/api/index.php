<?php

/**
 * ============================================================
 * PORTFOLIO CMS REST API
 * Main API Router
 * ============================================================
 *
 * Production URL:
 * http://emmanuelortfolio.infinityfree.me/backend/api/
 *
 * Examples:
 * GET    /backend/api/settings
 * GET    /backend/api/navbar
 * GET    /backend/api/hero
 * GET    /backend/api/about
 * GET    /backend/api/services
 * GET    /backend/api/projects
 * GET    /backend/api/experience
 * GET    /backend/api/certifications
 * GET    /backend/api/testimonials
 * GET    /backend/api/contact
 * GET    /backend/api/social-links
 * GET    /backend/api/cv/info
 * GET    /backend/api/cv/download
 *
 * ============================================================
 */


/*
|--------------------------------------------------------------------------
| ERROR REPORTING
|--------------------------------------------------------------------------
|
| Do not display PHP errors directly in production.
| They can expose sensitive server information.
|
*/

ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);


/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
|
| Allows your React frontend hosted on Netlify to communicate
| with this PHP API.
|
*/

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');


/*
|--------------------------------------------------------------------------
| OPTIONS / PREFLIGHT
|--------------------------------------------------------------------------
*/

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}


/*
|--------------------------------------------------------------------------
| LOAD CONFIGURATION
|--------------------------------------------------------------------------
|
| __DIR__ makes the paths work regardless of the current working
| directory used by Apache/PHP.
|
*/

require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../config/database.php';

require_once __DIR__ . '/../helpers/Response.php';
require_once __DIR__ . '/../helpers/Validator.php';
require_once __DIR__ . '/../helpers/FileUpload.php';

require_once __DIR__ . '/../middleware/AuthMiddleware.php';


/*
|--------------------------------------------------------------------------
| LOAD CONTROLLERS
|--------------------------------------------------------------------------
*/

$controllerFiles = glob(__DIR__ . '/../controllers/*.php');

if ($controllerFiles !== false) {
    foreach ($controllerFiles as $controller) {
        require_once $controller;
    }
}


/*
|--------------------------------------------------------------------------
| DATABASE CONNECTION
|--------------------------------------------------------------------------
*/

$db = (new Database())->getConnection();


/*
|--------------------------------------------------------------------------
| GET REQUEST URI
|--------------------------------------------------------------------------
*/

$rawUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($rawUri === false || $rawUri === null) {
    $rawUri = '/';
}


/*
|--------------------------------------------------------------------------
| NORMALIZE API BASE PATH
|--------------------------------------------------------------------------
|
| Your InfinityFree backend is located at:
|
| /backend/api/
|
| Therefore:
|
| /backend/api/projects
|
| becomes:
|
| /projects
|
*/

$basePath = '/backend/api';


if (strpos($rawUri, $basePath) === 0) {

    $uri = substr($rawUri, strlen($basePath));

} else {

    /*
    |--------------------------------------------------------------------------
    | Local development compatibility
    |--------------------------------------------------------------------------
    |
    | Supports:
    | /portfolio/backend/api
    | /api
    |
    */

    $uri = preg_replace(
        '#^/portfolio/backend/api#',
        '',
        $rawUri
    );

    $uri = preg_replace(
        '#^/api#',
        '',
        $uri
    );
}


/*
|--------------------------------------------------------------------------
| NORMALIZE URI
|--------------------------------------------------------------------------
*/

if ($uri === '' || $uri === false) {
    $uri = '/';
}


/*
|--------------------------------------------------------------------------
| Remove trailing slash
|--------------------------------------------------------------------------
|
| /projects/
| becomes
| /projects
|
| But keep "/" unchanged.
|
*/

if ($uri !== '/' && substr($uri, -1) === '/') {
    $uri = rtrim($uri, '/');
}


/*
|--------------------------------------------------------------------------
| HTTP METHOD
|--------------------------------------------------------------------------
*/

$method = strtoupper($_SERVER['REQUEST_METHOD']);


/*
|--------------------------------------------------------------------------
| ROUTE HELPER
|--------------------------------------------------------------------------
*/

function matchRoute($method, $uri, $pattern)
{
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        return false;
    }

    $regex = '#^' .
        preg_replace(
            '#\{([a-zA-Z0-9_]+)\}#',
            '(?P<$1>[^/]+)',
            $pattern
        ) .
        '$#';

    if (preg_match($regex, $uri, $matches)) {
        return $matches;
    }

    return false;
}


/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| SETTINGS
|--------------------------------------------------------------------------
*/

if (
    $method === 'GET' &&
    $uri === '/settings'
) {
    (new SettingsController($db))->getPublic();
    exit;
}


/*
|--------------------------------------------------------------------------
| NAVBAR
|--------------------------------------------------------------------------
*/

if (
    $method === 'GET' &&
    $uri === '/navbar'
) {
    (new SettingsController($db))->getNavbar();
    exit;
}


/*
|--------------------------------------------------------------------------
| HERO
|--------------------------------------------------------------------------
*/

if (
    $method === 'GET' &&
    $uri === '/hero'
) {
    (new HeroController($db))->getPublic();
    exit;
}


/*
|--------------------------------------------------------------------------
| ABOUT
|--------------------------------------------------------------------------
*/

if (
    $method === 'GET' &&
    $uri === '/about'
) {
    (new AboutController($db))->getPublic();
    exit;
}


/*
|--------------------------------------------------------------------------
| ABOUT STATS
|--------------------------------------------------------------------------
*/

if (
    $method === 'GET' &&
    $uri === '/about/stats'
) {
    (new AboutController($db))->getStatsPublic();
    exit;
}


/*
|--------------------------------------------------------------------------
| SERVICES
|--------------------------------------------------------------------------
*/

if (
    $method === 'GET' &&
    $uri === '/services'
) {
    (new ServicesController($db))->getPublic();
    exit;
}


/*
|--------------------------------------------------------------------------
| TECHNOLOGIES
|--------------------------------------------------------------------------
*/

if (
    $method === 'GET' &&
    $uri === '/technologies'
) {
    (new TechnologiesController($db))->getPublic();
    exit;
}


/*
|--------------------------------------------------------------------------
| PROJECTS
|--------------------------------------------------------------------------
*/

if (
    $method === 'GET' &&
    $uri === '/projects'
) {
    (new ProjectsController($db))->getPublic();
    exit;
}


/*
|--------------------------------------------------------------------------
| SINGLE PROJECT
|--------------------------------------------------------------------------
*/

if (
    $m = matchRoute(
        'GET',
        $uri,
        '/projects/{slug}'
    )
) {
    (new ProjectsController($db))->getBySlug($m['slug']);
    exit;
}


/*
|--------------------------------------------------------------------------
| EXPERIENCE
|--------------------------------------------------------------------------
*/

if (
    $method === 'GET' &&
    $uri === '/experience'
) {
    (new ExperienceController($db))->getPublic();
    exit;
}


/*
|--------------------------------------------------------------------------
| CERTIFICATIONS
|--------------------------------------------------------------------------
*/

if (
    $method === 'GET' &&
    $uri === '/certifications'
) {
    (new CertificationsController($db))->getPublic();
    exit;
}


/*
|--------------------------------------------------------------------------
| TESTIMONIALS
|--------------------------------------------------------------------------
*/

if (
    $method === 'GET' &&
    $uri === '/testimonials'
) {
    (new TestimonialsController($db))->getPublic();
    exit;
}


/*
|--------------------------------------------------------------------------
| CONTACT
|--------------------------------------------------------------------------
*/

if (
    $method === 'GET' &&
    $uri === '/contact'
) {
    (new ContactController($db))->getPublic();
    exit;
}


/*
|--------------------------------------------------------------------------
| SOCIAL LINKS
|--------------------------------------------------------------------------
*/

if (
    $method === 'GET' &&
    $uri === '/social-links'
) {
    (new SocialController($db))->getPublic();
    exit;
}


/*
|--------------------------------------------------------------------------
| CV INFORMATION
|--------------------------------------------------------------------------
*/

if (
    $method === 'GET' &&
    $uri === '/cv/info'
) {
    (new CvController($db))->getInfo();
    exit;
}


/*
|--------------------------------------------------------------------------
| CV DOWNLOAD
|--------------------------------------------------------------------------
*/

if (
    $method === 'GET' &&
    $uri === '/cv/download'
) {
    (new CvController($db))->download();
    exit;
}


/*
|--------------------------------------------------------------------------
| CONTACT MESSAGE
|--------------------------------------------------------------------------
*/

if (
    $method === 'POST' &&
    $uri === '/contact/message'
) {
    (new ContactController($db))->postMessage();
    exit;
}


/*
|--------------------------------------------------------------------------
| ADMIN LOGIN
|--------------------------------------------------------------------------
*/

if (
    $method === 'POST' &&
    $uri === '/admin/login'
) {
    (new AuthController($db))->login();
    exit;
}


/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

if (strpos($uri, '/admin') === 0) {

    /*
    |--------------------------------------------------------------------------
    | AUTHENTICATION
    |--------------------------------------------------------------------------
    */

    AuthMiddleware::check($db);


    /*
    |--------------------------------------------------------------------------
    | ADMIN LOGOUT
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'POST' &&
        $uri === '/admin/logout'
    ) {
        (new AuthController($db))->logout();
        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $uri === '/admin/dashboard'
    ) {
        (new DashboardController($db))->adminGetStats();
        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | SETTINGS
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $uri === '/admin/settings'
    ) {
        (new SettingsController($db))->adminGet();
        exit;
    }

    if (
        $method === 'POST' &&
        $uri === '/admin/settings'
    ) {
        (new SettingsController($db))->adminSave();
        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | HERO
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $uri === '/admin/hero'
    ) {
        (new HeroController($db))->adminGet();
        exit;
    }

    if (
        $m = matchRoute(
            'PUT',
            $uri,
            '/admin/hero/{id}'
        )
    ) {
        (new HeroController($db))->adminUpdate((int) $m['id']);
        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | ABOUT
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $uri === '/admin/about'
    ) {
        (new AboutController($db))->adminGet();
        exit;
    }

    if (
        $m = matchRoute(
            'PUT',
            $uri,
            '/admin/about/{id}'
        )
    ) {
        (new AboutController($db))->adminUpdate((int) $m['id']);
        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | ABOUT STATS
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $uri === '/admin/about/stats'
    ) {
        (new AboutController($db))->adminGetStats();
        exit;
    }

    if (
        $method === 'POST' &&
        $uri === '/admin/about/stats'
    ) {
        (new AboutController($db))->adminCreateStat();
        exit;
    }

    if (
        $m = matchRoute(
            'PUT',
            $uri,
            '/admin/about/stats/{id}'
        )
    ) {
        (new AboutController($db))->adminUpdateStat((int) $m['id']);
        exit;
    }

    if (
        $m = matchRoute(
            'DELETE',
            $uri,
            '/admin/about/stats/{id}'
        )
    ) {
        (new AboutController($db))->adminDeleteStat((int) $m['id']);
        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | SERVICES
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $uri === '/admin/services'
    ) {
        (new ServicesController($db))->adminGetAll();
        exit;
    }

    if (
        $method === 'POST' &&
        $uri === '/admin/services'
    ) {
        (new ServicesController($db))->adminCreate();
        exit;
    }

    if (
        $m = matchRoute(
            'PUT',
            $uri,
            '/admin/services/{id}'
        )
    ) {
        (new ServicesController($db))->adminUpdate((int) $m['id']);
        exit;
    }

    if (
        $m = matchRoute(
            'DELETE',
            $uri,
            '/admin/services/{id}'
        )
    ) {
        (new ServicesController($db))->adminDelete((int) $m['id']);
        exit;
    }

    if (
        $m = matchRoute(
            'PUT',
            $uri,
            '/admin/services/{id}/toggle'
        )
    ) {
        (new ServicesController($db))->adminTogglePublish((int) $m['id']);
        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | TECHNOLOGIES
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $uri === '/admin/technologies'
    ) {
        (new TechnologiesController($db))->adminGetAll();
        exit;
    }

    if (
        $method === 'POST' &&
        $uri === '/admin/technologies'
    ) {
        (new TechnologiesController($db))->adminCreate();
        exit;
    }

    if (
        $m = matchRoute(
            'PUT',
            $uri,
            '/admin/technologies/{id}'
        )
    ) {
        (new TechnologiesController($db))->adminUpdate((int) $m['id']);
        exit;
    }

    if (
        $m = matchRoute(
            'DELETE',
            $uri,
            '/admin/technologies/{id}'
        )
    ) {
        (new TechnologiesController($db))->adminDelete((int) $m['id']);
        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | PROJECTS
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $uri === '/admin/projects'
    ) {
        (new ProjectsController($db))->adminGetAll();
        exit;
    }

    if (
        $method === 'POST' &&
        $uri === '/admin/projects'
    ) {
        (new ProjectsController($db))->adminCreate();
        exit;
    }

    if (
        $m = matchRoute(
            'GET',
            $uri,
            '/admin/projects/{id}'
        )
    ) {
        (new ProjectsController($db))->adminGetOne((int) $m['id']);
        exit;
    }

    if (
        $m = matchRoute(
            'PUT',
            $uri,
            '/admin/projects/{id}'
        )
    ) {
        (new ProjectsController($db))->adminUpdate((int) $m['id']);
        exit;
    }

    if (
        $m = matchRoute(
            'DELETE',
            $uri,
            '/admin/projects/{id}'
        )
    ) {
        (new ProjectsController($db))->adminDelete((int) $m['id']);
        exit;
    }

    if (
        $m = matchRoute(
            'PUT',
            $uri,
            '/admin/projects/{id}/toggle'
        )
    ) {
        (new ProjectsController($db))->adminToggle((int) $m['id']);
        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | EXPERIENCE
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $uri === '/admin/experience'
    ) {
        (new ExperienceController($db))->adminGetAll();
        exit;
    }

    if (
        $method === 'POST' &&
        $uri === '/admin/experience'
    ) {
        (new ExperienceController($db))->adminCreate();
        exit;
    }

    if (
        $m = matchRoute(
            'PUT',
            $uri,
            '/admin/experience/{id}'
        )
    ) {
        (new ExperienceController($db))->adminUpdate((int) $m['id']);
        exit;
    }

    if (
        $m = matchRoute(
            'DELETE',
            $uri,
            '/admin/experience/{id}'
        )
    ) {
        (new ExperienceController($db))->adminDelete((int) $m['id']);
        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | CERTIFICATIONS
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $uri === '/admin/certifications'
    ) {
        (new CertificationsController($db))->adminGetAll();
        exit;
    }

    if (
        $method === 'POST' &&
        $uri === '/admin/certifications'
    ) {
        (new CertificationsController($db))->adminCreate();
        exit;
    }

    if (
        $m = matchRoute(
            'PUT',
            $uri,
            '/admin/certifications/{id}'
        )
    ) {
        (new CertificationsController($db))->adminUpdate((int) $m['id']);
        exit;
    }

    if (
        $m = matchRoute(
            'DELETE',
            $uri,
            '/admin/certifications/{id}'
        )
    ) {
        (new CertificationsController($db))->adminDelete((int) $m['id']);
        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | TESTIMONIALS
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $uri === '/admin/testimonials'
    ) {
        (new TestimonialsController($db))->adminGetAll();
        exit;
    }

    if (
        $method === 'POST' &&
        $uri === '/admin/testimonials'
    ) {
        (new TestimonialsController($db))->adminCreate();
        exit;
    }

    if (
        $m = matchRoute(
            'PUT',
            $uri,
            '/admin/testimonials/{id}'
        )
    ) {
        (new TestimonialsController($db))->adminUpdate((int) $m['id']);
        exit;
    }

    if (
        $m = matchRoute(
            'DELETE',
            $uri,
            '/admin/testimonials/{id}'
        )
    ) {
        (new TestimonialsController($db))->adminDelete((int) $m['id']);
        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | CONTACT SETTINGS
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $uri === '/admin/contact'
    ) {
        (new ContactController($db))->adminGetSettings();
        exit;
    }

    if (
        $m = matchRoute(
            'PUT',
            $uri,
            '/admin/contact/{id}'
        )
    ) {
        (new ContactController($db))->adminUpdateSettings((int) $m['id']);
        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | CONTACT MESSAGES
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $uri === '/admin/messages'
    ) {
        (new ContactController($db))->adminGetMessages();
        exit;
    }

    if (
        $m = matchRoute(
            'PUT',
            $uri,
            '/admin/messages/{id}/read'
        )
    ) {
        (new ContactController($db))->adminMarkRead((int) $m['id']);
        exit;
    }

    if (
        $m = matchRoute(
            'DELETE',
            $uri,
            '/admin/messages/{id}'
        )
    ) {
        (new ContactController($db))->adminDeleteMessage((int) $m['id']);
        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | SOCIAL LINKS
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $uri === '/admin/social-links'
    ) {
        (new SocialController($db))->adminGetAll();
        exit;
    }

    if (
        $method === 'POST' &&
        $uri === '/admin/social-links'
    ) {
        (new SocialController($db))->adminCreate();
        exit;
    }

    if (
        $m = matchRoute(
            'PUT',
            $uri,
            '/admin/social-links/{id}'
        )
    ) {
        (new SocialController($db))->adminUpdate((int) $m['id']);
        exit;
    }

    if (
        $m = matchRoute(
            'DELETE',
            $uri,
            '/admin/social-links/{id}'
        )
    ) {
        (new SocialController($db))->adminDelete((int) $m['id']);
        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | CV
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $uri === '/admin/cv'
    ) {
        (new CvController($db))->adminGetList();
        exit;
    }

    if (
        $method === 'POST' &&
        $uri === '/admin/cv/upload'
    ) {
        (new CvController($db))->adminUpload();
        exit;
    }

    if (
        $m = matchRoute(
            'PUT',
            $uri,
            '/admin/cv/{id}/activate'
        )
    ) {
        (new CvController($db))->adminActivate((int) $m['id']);
        exit;
    }

    if (
        $m = matchRoute(
            'DELETE',
            $uri,
            '/admin/cv/{id}'
        )
    ) {
        (new CvController($db))->adminDelete((int) $m['id']);
        exit;
    }

    if (
        $method === 'GET' &&
        $uri === '/admin/cv/downloads'
    ) {
        (new CvController($db))->adminGetDownloads();
        exit;
    }


    /*
    |--------------------------------------------------------------------------
    | MEDIA
    |--------------------------------------------------------------------------
    */

    if (
        $method === 'GET' &&
        $uri === '/admin/media'
    ) {
        (new MediaController($db))->adminGetAll();
        exit;
    }

    if (
        $method === 'POST' &&
        $uri === '/admin/media'
    ) {
        (new MediaController($db))->adminUpload();
        exit;
    }

    if (
        $m = matchRoute(
            'DELETE',
            $uri,
            '/admin/media/{id}'
        )
    ) {
        (new MediaController($db))->adminDelete((int) $m['id']);
        exit;
    }
}


/*
|--------------------------------------------------------------------------
| 404 - ENDPOINT NOT FOUND
|--------------------------------------------------------------------------
*/

Response::json(
    false,
    'Endpoint Not Found: ' . $method . ' ' . $uri,
    null,
    404
);