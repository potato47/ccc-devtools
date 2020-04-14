const NEX_CONFIG = {
	nodeSchema: {
		node2d: {
			title: 'Node',
			key: 'cc.Node',
			rows: [
				{ name: 'Name', key: 'name', type: 'text' },
				{ name: 'X', key: 'x', type: 'number' },
				{ name: 'Y', key: 'y', type: 'number' },
				{ name: 'Width', key: 'width', type: 'number' },
				{ name: 'Height', key: 'height', type: 'number' },
				{ name: 'Angle', key: 'angle', type: 'number' },
				{ name: 'ScaleX', key: 'scaleX', type: 'number' },
				{ name: 'ScaleY', key: 'scaleY', type: 'number' },
				{ name: 'Opacity', key: 'opacity', type: 'number' },
				{ name: 'Color', key: 'hex_color', type: 'color' },
				{ name: 'Group', key: 'group', type: 'text' },
			]
		},
		node3d: {
			title: 'Node',
			key: 'cc.Node',
			rows: [
				// TODO:
			]
		},
	},
	componentsSchema: {
		'cc.Camera': {
			title: 'cc.Camera',
			key: 'cc.Camera',
			rows: [
				{ name: 'Zoom Ratio', key: 'zoomRatio', type: 'number' },
				{ name: 'Depth', key: 'depth', type: 'number' },
				{ name: 'Bacground Color', key: 'hex_backgroundColor', rawKey: 'backgroundColor', type: 'color' },
				{ name: 'Align with Screen', key: 'alignWithScreen', type: 'bool' },
			]
		},
		'cc.Sprite': {
			key: 'cc.Sprite',
			title: 'cc.Sprite',
			rows: []
		},
		'cc.Label': {
			title: 'cc.Label',
			key: 'cc.Label',
			rows: [
				{ name: 'String', key: 'string', type: 'textarea' },
				{ name: 'Font Size', key: 'fontSize', type: 'number' },
				{ name: 'Line Height', key: 'lineHeight', type: 'number' },
			]
		}
	}
}