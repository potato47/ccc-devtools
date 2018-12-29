const NEX_CONFIG = {
	propSchema: {
		node2d: {
			title: 'Node',
			key: 'node',
			rows: [
				// Position
				[{
					key: 'node_pos_label',
					type: 'label',
					span: 6,
					value: 'Position'
				}, {
					key: 'node_x_label',
					type: 'label',
					span: 1,
					value: 'X'
				}, {
					key: 'node_x',
					type: 'number',
					span: 8,
					field: 'x'
				}, {
					key: 'node_y_label',
					type: 'label',
					span: 1,
					value: 'Y'
				}, {
					key: 'node_y',
					type: 'number',
					span: 8,
					field: 'y'
				}],
				// Angle
				[{
					key: 'node_angle_label',
					type: 'label',
					span: 6,
					value: 'Angle'
				}, {
					key: 'node_angle',
					type: 'number',
					span: 18,
					field: 'angle'
				}],
				// Scale
				[{
					key: 'node_scale_label',
					type: 'label',
					span: 6,
					value: 'Scale'
				}, {
					key: 'node_scalex_label',
					type: 'label',
					span: 1,
					value: 'X'
				}, {
					key: 'node_scalex',
					type: 'number',
					span: 8,
					field: 'scaleX'
				}, {
					key: 'node_scaley_label',
					type: 'label',
					span: 1,
					value: 'Y'
				}, {
					key: 'node_scaley',
					type: 'number',
					span: 8,
					field: 'scaleY'
				}],
				// Anchor
				[{
					key: 'node_anchor_label',
					type: 'label',
					span: 6,
					value: 'Anchor'
				}, {
					key: 'node_anchorx_label',
					type: 'label',
					span: 1,
					value: 'X'
				}, {
					key: 'node_anchorx',
					type: 'number',
					span: 8,
					field: 'anchorX'
				}, {
					key: 'node_anchory_label',
					type: 'label',
					span: 1,
					value: 'Y'
				}, {
					key: 'node_anchory',
					type: 'number',
					span: 8,
					field: 'anchorY'
				}],
				// Size
				[{
					key: 'node_size_label',
					type: 'label',
					span: 6,
					value: 'Size'
				}, {
					key: 'node_width_label',
					type: 'label',
					span: 1,
					value: 'W'
				}, {
					key: 'node_width',
					type: 'number',
					span: 8,
					field: 'width'
				}, {
					key: 'node_height_label',
					type: 'label',
					span: 1,
					value: 'H'
				}, {
					key: 'node_height',
					type: 'number',
					span: 8,
					field: 'height'
				}],
				// Color
				[{
					key: 'node_color_label',
					type: 'label',
					span: 6,
					value: 'Color',
				}, {
					key: 'node_color',
					type: 'color',
					span: 16,
					field: 'hex_color'
				}],
				// Opacity
				[{
					key: 'node_opacity_label',
					type: 'label',
					span: 6,
					value: 'Opacity'
				}, {
					key: 'node_opacity',
					type: 'number',
					span: 18,
					field: 'opacity'
				}],
				// Skew
				[{
					key: 'node_skew_label',
					type: 'label',
					span: 6,
					value: 'Skew'
				}, {
					key: 'node_skewx_label',
					type: 'label',
					span: 1,
					value: 'X'
				}, {
					key: 'node_skewx',
					type: 'number',
					span: 8,
					field: 'skewX'
				}, {
					key: 'node_skewy_label',
					type: 'label',
					span: 1,
					value: 'Y'
				}, {
					key: 'node_skewy',
					type: 'number',
					span: 8,
					field: 'skewY'
				}],
				// Group
				[{
					key: 'node_group_label',
					type: 'label',
					span: 6,
					value: 'Group'
				}, {
					key: 'node_group',
					type: 'input',
					span: 18,
					field: 'group'
				}]
			]
		},
		node3d: {

		},
		label: {

		}
	}
}