const NEX_CONFIG = {
	nodeSchema: {
		node2d: {
			title: 'Node',
			key: 'cc.Node',
			rows: [
				// Position
				[{
					type: 'label',
					span: 6,
					field: 'Position'
				}, {
					type: 'label',
					span: 1,
					field: 'X'
				}, {
					type: 'number',
					span: 8,
					field: 'x'
				}, {
					type: 'label',
					span: 1,
					field: 'Y'
				}, {
					type: 'number',
					span: 8,
					field: 'y'
				}],
				// Angle
				[{
					type: 'label',
					span: 6,
					field: 'Angle'
				}, {
					type: 'number',
					span: 18,
					field: 'angle'
				}],
				// Scale
				[{
					type: 'label',
					span: 6,
					field: 'Scale'
				}, {
					type: 'label',
					span: 1,
					field: 'X'
				}, {
					type: 'number',
					span: 8,
					field: 'scaleX'
				}, {
					type: 'label',
					span: 1,
					field: 'Y'
				}, {
					type: 'number',
					span: 8,
					field: 'scaleY'
				}],
				// Anchor
				[{
					type: 'label',
					span: 6,
					field: 'Anchor'
				}, {
					type: 'label',
					span: 1,
					field: 'X'
				}, {
					type: 'number',
					span: 8,
					field: 'anchorX'
				}, {
					type: 'label',
					span: 1,
					field: 'Y'
				}, {
					type: 'number',
					span: 8,
					field: 'anchorY'
				}],
				// Size
				[{
					type: 'label',
					span: 6,
					field: 'Size'
				}, {
					type: 'label',
					span: 1,
					field: 'W'
				}, {
					type: 'number',
					span: 8,
					field: 'width'
				}, {
					type: 'label',
					span: 1,
					field: 'H'
				}, {
					type: 'number',
					span: 8,
					field: 'height'
				}],
				// Color
				[{
					type: 'label',
					span: 6,
					field: 'Color',
				}, {
					type: 'color',
					span: 18,
					field: 'hex_color',
					rawField: 'color',
				}],
				// Opacity
				[{
					type: 'label',
					span: 6,
					field: 'Opacity'
				}, {
					type: 'number',
					span: 18,
					field: 'opacity'
				}],
				// Skew
				[{
					type: 'label',
					span: 6,
					field: 'Skew'
				}, {
					type: 'label',
					span: 1,
					field: 'X'
				}, {
					type: 'number',
					span: 8,
					field: 'skewX'
				}, {
					type: 'label',
					span: 1,
					field: 'Y'
				}, {
					type: 'number',
					span: 8,
					field: 'skewY'
				}],
				// Group
				[{
					type: 'label',
					span: 6,
					field: 'Group'
				}, {
					type: 'input',
					span: 18,
					field: 'group'
				}]
			]
		},
		node3d: {
			title: 'Node',
			key: 'cc.Node',
			rows: [
				// Position
				[{
					type: 'label',
					span: 6,
					field: 'Position'
				}, {
					type: 'label',
					span: 1,
					field: 'X'
				}, {
					type: 'number',
					span: 5,
					field: 'x'
				}, {
					type: 'label',
					span: 1,
					field: 'Y'
				}, {
					type: 'number',
					span: 5,
					field: 'y'
				}, {
					type: 'label',
					span: 1,
					field: 'Z'
				}, {
					type: 'number',
					span: 5,
					field: 'z'
				}],
				// Angle
				[{
					type: 'label',
					span: 6,
					field: 'Rotation'
				}, {
					type: 'label',
					span: 1,
					field: 'X'
				}, {
					type: '3DAngle',
					span: 5,
					field: 'x'
				}, {
					type: 'label',
					span: 1,
					field: 'Y'
				}, {
					type: '3DAngle',
					span: 5,
					field: 'y'
				}, {
					type: 'label',
					span: 1,
					field: 'Z'
				}, {
					type: '3DAngle',
					span: 5,
					field: 'z'
				}],
				// Scale
				[{
					type: 'label',
					span: 6,
					field: 'Scale'
				}, {
					type: 'label',
					span: 1,
					field: 'X'
				}, {
					type: 'number',
					span: 5,
					field: 'scaleX'
				}, {
					type: 'label',
					span: 1,
					field: 'Y'
				}, {
					type: 'number',
					span: 5,
					field: 'scaleY'
				}, {
					type: 'label',
					span: 1,
					field: 'Z'
				}, {
					type: 'number',
					span: 5,
					field: 'scaleZ'
				}],
				// Anchor
				[{
					type: 'label',
					span: 6,
					field: 'Anchor'
				}, {
					type: 'label',
					span: 1,
					field: 'X'
				}, {
					type: 'number',
					span: 8,
					field: 'anchorX'
				}, {
					type: 'label',
					span: 1,
					field: 'Y'
				}, {
					type: 'number',
					span: 8,
					field: 'anchorY'
				}],
				// Size
				[{
					type: 'label',
					span: 6,
					field: 'Size'
				}, {
					type: 'label',
					span: 1,
					field: 'W'
				}, {
					type: 'number',
					span: 8,
					field: 'width'
				}, {
					type: 'label',
					span: 1,
					field: 'H'
				}, {
					type: 'number',
					span: 8,
					field: 'height'
				}],
				// Color
				[{
					type: 'label',
					span: 6,
					field: 'Color',
				}, {
					type: 'color',
					span: 18,
					field: 'hex_color',
					rawField: 'color',
				}],
				// Opacity
				[{
					type: 'label',
					span: 6,
					field: 'Opacity'
				}, {
					type: 'number',
					span: 18,
					field: 'opacity'
				}],
				// Skew
				[{
					type: 'label',
					span: 6,
					field: 'Skew'
				}, {
					type: 'label',
					span: 1,
					field: 'X'
				}, {
					type: 'number',
					span: 8,
					field: 'skewX'
				}, {
					type: 'label',
					span: 1,
					field: 'Y'
				}, {
					type: 'number',
					span: 8,
					field: 'skewY'
				}],
				// Group
				[{
					type: 'label',
					span: 6,
					field: 'Group'
				}, {
					type: 'input',
					span: 18,
					field: 'group'
				}]
			]
		},
	},
	componentsSchema: {
		'cc.Camera': {
			title: 'cc.Camera',
			key: 'cc.Camera',
			rows: [
				// Zoom Ratio
				[{
					type: 'label',
					span: 6,
					field: 'Zoom Ratio'
				}, {
					type: 'number',
					span: 18,
					field: 'zoomRatio'
				}],
				// Background Color
				[{
					type: 'label',
					span: 6,
					field: 'Bg Color'
				}, {
					type: 'color',
					span: 18,
					field: 'hex_backgroundColor',
					rawField: 'backgroundColor'
				}],
				// Depth
				[{
					type: 'label',
					span: 6,
					field: 'Depth'
				}, {
					type: 'number',
					span: 18,
					field: 'depth'
				}],
			]
		},
		'cc.Sprite': {
			key: 'cc.Sprite',
			title: 'cc.Sprite',
			rows: [
				// Type
				[{
					type: 'label',
					span: 6,
					field: 'Type'
				}, {
					type: 'select',
					span: 18,
					field: 'type',
					options: [{
						label: 'SIMPLE',
						value: 0
					}, {
						label: 'SLICED',
						value: 1
					}, {
						label: 'TILED',
						vlaue: 2
					}, {
						label: 'FILLED',
						value: 3
					}, {
						label: 'MESH',
						value: 4
					}]
				}],
				// Size Mode
				[{
					type: 'label',
					span: 6,
					field: 'Size Mode'
				}, {
					type: 'select',
					span: 18,
					field: 'sizeMode',
					options: [{
						label: 'CUSTOM',
						value: 0
					}, {
						label: 'TRIMMED',
						value: 1
					}, {
						label: 'RAW',
						vlaue: 2
					}]
				}],
				// Trim
				[{
					type: 'label',
					span: 6,
					field: 'Trim'
				}, {
					type: 'bool',
					span: 18,
					field: 'trim'
				}],
			]
		},
		'cc.Label': {
			title: 'cc.Label',
			key: 'cc.Label',
			rows: [
				// String
				[{
					type: 'label',
					span: 6,
					field: 'String'
				}, {
					type: 'textarea',
					span: 18,
					field: 'string'
				}],
				// Horizontal Align
				[{
					type: 'label',
					span: 6,
					field: 'Horizontal'
				}, {
					type: 'select',
					span: 18,
					field: 'horizontalAlign',
					options: [{
						label: 'LEFT',
						value: 0
					}, {
						label: 'CENTER',
						value: 1
					}, {
						label: 'RIGHT',
						value: 2
					}]
				}],
				// Vertical Align
				[{
					type: 'label',
					span: 6,
					field: 'Vertical'
				}, {
					type: 'select',
					span: 18,
					field: 'verticalAlign',
					options: [{
						label: 'TOP',
						value: 0
					}, {
						label: 'CENTER',
						value: 1
					}, {
						label: 'BOTTOM',
						value: 2
					}]
				}],
				// Font Size
				[{
					type: 'label',
					span: 6,
					field: 'Font Size'
				}, {
					type: 'number',
					span: 18,
					field: 'fontSize'
				}],
				// Line Height
				[{
					type: 'label',
					span: 6,
					field: 'Line Height',
				}, {
					type: 'number',
					span: 18,
					field: 'lineHeight'
				}],
				// Overflow
				[{
					type: 'label',
					span: 6,
					field: 'Overflow'
				}, {
					type: 'select',
					span: 18,
					field: 'overflow',
					options: [{
						label: 'NONE',
						value: 0
					}, {
						label: 'CLAMP',
						value: 1
					}, {
						label: 'SHRINK',
						value: 2
					}, {
						label: 'RESIZE_HEIGHT',
						value: 3
					}]
				}],
			]
		}
	}
}