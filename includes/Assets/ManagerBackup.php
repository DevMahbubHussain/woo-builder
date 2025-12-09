<?php

declare(strict_types=1);

namespace App\Assets;

defined('ABSPATH') || exit;

class ManagerBackup
{
    public function register()
    {
        /** Register all standard (non-block) assets */
        add_action('init', [$this, 'register_all_scripts']);

        /** Register block assets (view.js, editor.js, etc.) */
        add_action('init', [$this, 'register_block_assets']);

        /** Enqueue frontend */
        add_action('wp_enqueue_scripts', [$this, 'woo_builder_wp_register_assets']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_block_frontend_assets']);

        /** Enqueue admin/editor */
        add_action('admin_enqueue_scripts', [$this, 'woo_builder_admin_register_assets']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_block_editor_assets']);
    }

    /*--------------------------------------------------------------
        STANDARD ASSETS (FRONTEND + ADMIN)
    --------------------------------------------------------------*/

    public function register_all_scripts()
    {
        $this->register_styles($this->get_styles());
        $this->register_scripts($this->get_scripts());
    }

    public function get_styles()
    {
        return [
            'category-load-more-css' => [
                'src' => MH_ACADEMY_PLUGIN_URL  . 'Assets/css/frontend.css',
                'version' => MH_ACADEMY_VERSION,
                'deps' => []
            ],
        ];
    }

    public function get_scripts()
    {
        return [
            'category-load-more-js' => [
                'src' => MH_ACADEMY_PLUGIN_URL . 'Assets/js/category-load-more.js',
                'version' => MH_ACADEMY_VERSION,
                'deps' => ['jquery'],
                'in_footer' => true,
            ],

            'infinite-scroll-js' => [
                'src' => MH_ACADEMY_PLUGIN_URL . 'Assets/js/infinite-scroll.js',
                'version' => MH_ACADEMY_VERSION,
                'deps' => ['jquery'],
                'in_footer' => true,
            ],

            'load-more-and-infinite-scroll' => [
                'src' => MH_ACADEMY_PLUGIN_URL . 'Assets/js/load-more-and-infinite-scroll.js',
                'version' => MH_ACADEMY_VERSION,
                'deps' => ['jquery'],
                'in_footer' => true,
            ],
        ];
    }

    public function register_styles(array $styles)
    {
        foreach ($styles as $handle => $style) {
            wp_register_style($handle, $style['src'], $style['deps'], $style['version']);
        }
    }

    public function register_scripts(array $scripts)
    {
        foreach ($scripts as $handle => $script) {
            wp_register_script(
                $handle,
                $script['src'],
                $script['deps'],
                $script['version'],
                $script['in_footer']
            );
        }
    }

    public function woo_builder_wp_register_assets()
    {
        wp_enqueue_style('category-load-more-css');
        wp_enqueue_script('category-load-more-js');
        wp_enqueue_script('infinite-scroll-js');
        wp_enqueue_script('load-more-and-infinite-scroll');

        wp_localize_script('category-load-more-js', 'loadmore_params', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'action_hook' => 'load_more_categories',
            'nonce' => wp_create_nonce('load_more_nonce')
        ]);
    }

    public function woo_builder_admin_register_assets()
    {
        // Admin-only assets here if needed
    }


    /*--------------------------------------------------------------
        GUTENBERG BLOCK ASSETS (view.js, editor.js, asset.php)
    --------------------------------------------------------------*/
    public function register_block_assets()
    {
        $build_path = MH_ACADEMY_PLUGIN_PATH . 'build/';
        // var_dump($build_path);

        if (!is_dir($build_path)) {
            return;
        }

        foreach (glob($build_path . '*/') as $block_path) {

            $block_slug = basename($block_path);

            $asset_file = $block_path . 'view.asset.php';
            $js_file    = $block_path . 'view.js';

            if (!file_exists($asset_file) || !file_exists($js_file)) {
                continue;
            }

            $asset = require $asset_file;

            // Add WooCommerce Blocks dependency
            $asset['dependencies'] = array_merge(
                $asset['dependencies'],
                [
                    'wp-element',
                    'wp-i18n',
                    'wp-data',
                    'wc-blocks-data-store'
                ]
            );

            // Handle will be: woo-builder-block-woo-category
            $handle = "woo-builder-block-{$block_slug}";

            wp_register_script(
                $handle,
                MH_ACADEMY_PLUGIN_URL . "build/{$block_slug}/view.js",
                $asset['dependencies'],
                $asset['version'],
                true
            );
        }
    }

    public function enqueue_block_frontend_assets()
    {
        $build_path = MH_ACADEMY_PLUGIN_PATH . 'build/';

        foreach (glob($build_path . '*/') as $block_path) {

            $block_slug = basename($block_path);

            // Full block name from block.json = woo-builder/woo-category
            $block_id = "woo-builder/{$block_slug}";

            $handle = "woo-builder-block-{$block_slug}";
            // var_dump($handle);

            if (has_block($block_id)) {
                wp_enqueue_script($handle);
            }
        }
    }

    public function enqueue_block_editor_assets()
    {
        $build_path = MH_ACADEMY_PLUGIN_PATH . 'build/';

        foreach (glob($build_path . '*/') as $block_path) {

            $block_slug = basename($block_path);
            $handle = "woo-builder-block-{$block_slug}";

            wp_enqueue_script($handle);
        }
    }
}
