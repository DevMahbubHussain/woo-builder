<?php

global $product;

$current_user = wp_get_current_user();

if ( ! $product ) {
    return;
}


$templates = __DIR__ . '/templates';
?>


<div 
    <?php 
        echo get_block_wrapper_attributes( [
            'class' => 'example-block wp-block-woo-reviews-block',
            'data-product-id' => $product->get_id(),
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

<script>
	window.wcReviewContext = {
		userId: <?php echo (int) $current_user->ID; ?>,
		userName: "<?php echo esc_js( $current_user->display_name ); ?>",
		userEmail: "<?php echo esc_js( $current_user->user_email ); ?>"
	};
</script>