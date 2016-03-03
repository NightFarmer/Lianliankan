"use strict";

var pathUtil = require("pathUtil");
cc.Class({
	"extends": cc.Component,

	properties: {
		// foo: {
		//    default: null,
		//    url: cc.Texture2D,  // optional, default is typeof default
		//    serializable: true, // optional, default is true
		//    visible: true,      // optional, default is true
		//    displayName: 'Foo', // optional
		//    readonly: false,    // optional, default is false
		// },
		// ...
		ground: {
			"default": null,
			type: cc.Node
		},
		fkMask: {
			"default": null,
			type: cc.Prefab
		},
		fk: {
			"default": [],
			type: [cc.Prefab]
		},
		xSize: 10,
		ySize: 10,
		xSizeFk: 50,
		ySizeFk: 50,
		_preCheck: null,
		_map: []
	},

	// use this for initialization
	onLoad: function onLoad() {
		xMin = Math.round(-this.xSize / 2);
		xMax = Math.round(this.xSize / 2);
		yMin = Math.round(-this.ySize / 2);
		yMax = Math.round(this.ySize / 2);
		for (var x = yMin - 1; x < xMax + 1; x++) {
			this._map[x] = [];
			for (var y = yMin - 1; y < yMax + 1; y++) {
				this._map[x][y] = 1;
			}
		}
		var fkTypeCount = [];
		var fkCount = 0;
		var fkMaxCount = this.xSize * this.ySize;
		for (var i = 0; i < this.fk.length; i++) {
			fkTypeCount[i] = 0;
		}
		for (var x = xMin; x < xMax; x++) {
			for (var y = yMin; y < yMax; y++) {
				this._map[x][y] = 0;
				var index = Math.floor(cc.random0To1() * this.fk.length);
				if (++fkCount > fkMaxCount - this.fk.length) {
					for (var f = 0; f < this.fk.length; f++) {
						if (fkTypeCount[f] / 2 % 1 !== 0) {
							index = f;
							break;
						}
					}
				}
				fkTypeCount[index] = fkTypeCount[index] + 1;
				var oneFk = cc.instantiate(this.fk[index]);
				this.ground.addChild(oneFk);
				var fkMask = cc.instantiate(this.fkMask);
				oneFk.addChild(fkMask);

				//绑定数据和关系
				oneFk.width = this.xSizeFk;
				oneFk.height = this.ySizeFk;
				oneFk.x = x * this.xSizeFk;
				oneFk.y = y * this.ySizeFk;
				var info = {
					loc: { x: x, y: y },
					type: index
				};
				fkMask.width = this.xSizeFk;
				fkMask.height = this.ySizeFk;
				fkMask.x = 0;
				fkMask.y = 0;
				fkMask.info = info;
				var maskJs = fkMask.getComponent("fkMaskJS");
				maskJs.info = info;
				maskJs.fk = oneFk;
				maskJs.llk = this;

				console.info(oneFk.width);
			}
		}
	},

	// called every frame, uncomment this function to activate update callback
	// update: function (dt) {

	// },
	findPath: function findPath(loc1, loc2) {
		return pathUtil.findPath([loc1.x, loc1.y], [loc2.x, loc2.y], this._map, 1);
	}
});