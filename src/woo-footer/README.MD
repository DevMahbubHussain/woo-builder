### block.json supports elements 

```
"color": {
    "background": true, // Allow changing background color
    "text": true,       // Allow changing text color
    "link": true        // Allow changing link color
},

"spacing": {
	"margin":true,  // Allow padding control
	"padding":true
}

"layout": {   // Enables column/block flow control
	"inherit": false,
	"default": {
		"type": "flex",
		"orientation": "horizontal",
		"justifyContent": "space-between",
	    "flexWrap": "wrap"
	}
}
		