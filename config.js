const NEX_CONFIG = {
	nodeSchema: {
		node: {
			title: 'Node',
			key: 'cc.Node',
			rows: [
				{ name: 'Name', key: 'name', type: 'text' },
				{ name: 'Position.X', parentKey: 'position', key: 'x', type: 'object_number', method: 'setPosition' },
				{ name: 'Position.Y', parentKey: 'position', key: 'y', type: 'object_number', method: 'setPosition' },
				{ name: 'Position.Z', parentKey: 'position', key: 'z', type: 'object_number', method: 'setPosition' },
				{ name: 'Angle.X', parentKey: 'eulerAngles', key: 'x', type: 'object_number', method: 'setRotationFromEuler' },
				{ name: 'Angle.Y', parentKey: 'eulerAngles', key: 'y', type: 'object_number', method: 'setRotationFromEuler' },
				{ name: 'Angle.Z', parentKey: 'eulerAngles', key: 'z', type: 'object_number', method: 'setRotationFromEuler' },
				{ name: 'Scale.X', parentKey: 'scale', key: 'x', type: 'object_number', method: 'setScale' },
				{ name: 'Scale.Y', parentKey: 'scale', key: 'y', type: 'object_number', method: 'setScale' },
				{ name: 'Scale.Z', parentKey: 'scale', key: 'z', type: 'object_number', method: 'setScale' },
			]
		},
	},
	componentsSchema: {
		'cc.Camera': {
			title: 'cc.Camera',
			key: 'cc.Camera',
			rows: [
				{ name: 'ClearDepth', key: 'clearDepth', type: 'number' },
				{ name: 'ClearColor', key: 'hex_clearColor', rawKey: 'clearColor', type: 'color' },
			]
		},
		'cc.DirectionalLight': {
			title: 'cc.DirectionalLight',
			key: 'cc.DirectionalLight',
			rows: [
				{ name: 'UseColorTemperature', key: 'useColorTemperature', type: 'bool' },
				{ name: 'ColorTemperature', key: 'colorTemperature', type: 'number' },
				{ name: 'Illuminance', key: 'illuminance', type: 'number' },
				{ name: 'Color', key: 'hex_color', rawKey: 'color', type: 'color' },
			]
		},
		'cc.UITransform': {
			key: 'cc.UITransform',
			title: 'cc.UITransform',
			rows: [
				{ name: 'Width', key: 'width', type: 'number' },
				{ name: 'Height', key: 'height', type: 'number' },
				{ name: 'AnchorX', key: 'anchorX', type: 'number' },
				{ name: 'AnchorY', key: 'anchorY', type: 'number' },
				{ name: 'Priority', key: 'priority', type: 'number' },
			]
		},
		'cc.Sprite': {
			key: 'cc.Sprite',
			title: 'cc.Sprite',
			rows: [
				{ name: 'Color', key: 'hex_color', rawKey: 'color', type: 'color' },
			]
		},
		'cc.Label': {
			title: 'cc.Label',
			key: 'cc.Label',
			rows: [
				{ name: 'String', key: 'string', type: 'textarea' },
				{ name: 'Font Size', key: 'fontSize', type: 'number' },
				{ name: 'Line Height', key: 'lineHeight', type: 'number' },
				{ name: 'Color', key: 'hex_color', rawKey: 'color', type: 'color' },
			]
		}
	}
}