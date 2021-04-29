<?php
/**
 * Controls Categories
 */

namespace Extendify\ExtendifySdk\Controllers;

use Extendify\ExtendifySdk\Http;

if (!defined('ABSPATH')) {
    die('No direct access.');
}

/**
 * The controller for dealing with categories
 */
class CategoryController
{

    /**
     * Return all categories
     *
     * @return WP_REST_Response|WP_Error
     */
    public static function index()
    {
        $response = Http::get('/airtable-categories', []);

        if (!isset($response['records']) || empty($response['records'])) {
            return new \WP_Error('nothing_found', \__('Categories not found. Please try again later', 'extendify-sdk'), ['status' => 404]);
        }

        return new \WP_REST_Response(
            array_map(
                function ($record) {
                    return isset($record['fields']['title']) ? $record['fields']['title'] : '';
                },
                $response['records']
            )
        );
    }
}
