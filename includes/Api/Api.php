<?php

namespace App\Api;

use WP_Error;

class Api
{
    protected $namespace = 'shaped-auth/v1';

    public function register()
    {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes()
    {
        register_rest_route($this->namespace, '/register', [
            'methods'             => 'POST',
            'callback'            => [$this, 'handle_register'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route($this->namespace, '/login', [
            'methods'             => 'POST',
            'callback'            => [$this, 'handle_login'],
            'permission_callback' => '__return_true',
        ]);
    }

    /**
     * REGISTER
     */
    public function handle_register($request)
    {
        $params = $request->get_json_params();

        $email    = sanitize_email($params['email'] ?? '');
        $password = $params['password'] ?? '';
        $username = sanitize_user($params['username'] ?? '');

        if (!$email || !$password || !$username) {
            return new WP_Error('missing_fields', 'All fields are required.', ['status' => 400]);
        }

        if (email_exists($email) || username_exists($username)) {
            return new WP_Error('user_exists', 'User already exists.', ['status' => 400]);
        }

        $user_id = wp_create_user($username, $password, $email);

        if (is_wp_error($user_id)) {
            return $user_id;
        }

        // WordPress login
        wp_clear_auth_cookie();
        wp_set_current_user($user_id);
        wp_set_auth_cookie($user_id, true);

        do_action('wp_login', $username, get_user_by('id', $user_id));

        return [
            'success' => true,
            'message' => 'Account created successfully.',
            'redirect' => wc_get_page_permalink('myaccount'),
        ];
    }

    /**
     * LOGIN
     */
    public function handle_login($request)
    {
        $params = $request->get_json_params();

        $email    = sanitize_email($params['email'] ?? '');
        $password = $params['password'] ?? '';

        if (!$email || !$password) {
            return new WP_Error('missing_fields', 'Email and password are required.', ['status' => 400]);
        }

        $user = get_user_by('email', $email);
        if (!$user) {
            return new WP_Error('login_failed', 'Invalid credentials.', ['status' => 403]);
        }

        $signed_in  = wp_signon([
            'user_login'    => $user->user_login,
            'user_password' => $password,
            'remember'      => true,
        ], false);

        if (is_wp_error($user)) {
            return new WP_Error('login_failed', 'Invalid credentials.', ['status' => 403]);
        }

        return [
            'success'  => true,
            'message'  => 'Login successful.',
            'user'     => [
                'name'  => $signed_in->display_name,
                'email' => $signed_in->user_email,
            ],
            'redirect' => wc_get_page_permalink('myaccount'),
        ];
    }
}
