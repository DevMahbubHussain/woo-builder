<?php
/**
 * Main render.php file
 * Variables available:
 *   $attributes
 *   $content
 *   $block
 */
global $product;

if ( ! $product || ! $product->is_type( 'simple' ) ) {
    return;
}
$related_count = isset( $attributes['relatedCount'] ) ? $attributes['relatedCount'] : 6;
$discount = isset( $attributes['discountPercentage'] ) ? $attributes['discountPercentage'] : 0;


$templates = __DIR__ . '/templates';
?>

<<div 
    <?php 
        echo get_block_wrapper_attributes( [
            'class' => 'wp-block-mh-frequently-bought-together',
             'data-product-id' => $product->get_id(),
             'data-related-count' => $related_count,
             'data-discount' => $discount,
             
        ] ); 
    ?>
>


    <?php
    // Include smaller template files
    if ( file_exists( $templates . '/header.php' ) ) {
        include $templates . '/header.php';
    }

    // Add more templates if needed
    // include $templates . '/title.php';
    // include $templates . '/content.php';
    // include $templates . '/buttons.php';
    // include $templates . '/footer.php';
    ?>

</div>
