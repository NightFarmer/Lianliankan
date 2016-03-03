require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"fkMaskJS":[function(require,module,exports){
cc._RFpush(module, '37e71Rhw+pHcah89zUWC3jZ', 'fkMaskJS');
// llk\fkMaskJS.js

"use strict";

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
        info: null, //obj
        fk: null, //node
        llk: null //js
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.node.on("touchend", function () {
            console.info(this.fk.width);
            if (this.llk._preCheck) {
                var preInfo = this.llk._preCheck.getChildByName("fkMask").getComponent("fkMaskJS").info;
                if (preInfo.type === this.info.type && this.llk._preCheck !== this.fk && this.pathIsOk(preInfo)) {
                    this.llk._preCheck.destroy();
                    this.llk._preCheck = null;
                    this.fk.destroy();
                    this.llk._map[preInfo.loc.x][preInfo.loc.y] = 1;
                    this.llk._map[this.info.loc.x][this.info.loc.y] = 1;
                } else {
                    this.llk._preCheck.getChildByName("fkMask").getComponent("cc.Sprite").setVisible(false);
                    this.llk._preCheck = null;
                }
            } else {
                this.fk.getChildByName("fkMask").getComponent("cc.Sprite").setVisible(true);
                this.llk._preCheck = this.fk;
            }
        }, this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    pathIsOk: function pathIsOk(preInfo) {
        var path = this.llk.findPath(preInfo.loc, this.info.loc);
        console.info(path);
        if (path.length > 0) {
            return true;
        }
        return false;
    }
});

cc._RFpop();
},{}],"llk":[function(require,module,exports){
cc._RFpush(module, '1ad6eZTdpxH+awFltRPNyuh', 'llk');
// llk\llk.js

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

cc._RFpop();
},{"pathUtil":"pathUtil"}],"pathUtil":[function(require,module,exports){
cc._RFpush(module, '80da7zUi9NBUoRvIyY5WrQL', 'pathUtil');
// llk\pathUtil.js

"use strict";

var _PathNode = function _PathNode() {
	this.x = 0;
	this.y = 0;
	this.G = 0; //开销
	this.H = 0; //寻路优先级，越小越好
};

var pathUtil = {
	//start:起始节点[i,j] ， end:最终节点[i,j]  map:地图数据(2d)arr，marker:可以通过的标识（例子用的是1）
	findPath: function findPath(start, end, map, marker) {
		var self = this;
		var open = [];
		var close = [];

		var nodeStart = new _PathNode();
		nodeStart.x = start[0];
		nodeStart.y = start[1];
		var nodeEnd = new _PathNode();
		nodeEnd.x = end[0];
		nodeEnd.y = end[1];
		console.info(start, end);
		// for(var i= )
		console.info(map.toString());
		console.info(marker);
		var _getNextPath = function _getNextPath(prePath, nodeEnd) {

			var nextNodeList = []; //可以当做下一个的节点
			var preNode = null;
			if (prePath.length > 1) {
				preNode = prePath[prePath.length - 2];
			}
			var latestNode = prePath[prePath.length - 1];
			for (var i = latestNode.x - 1; i <= latestNode.x + 1; i++) {
				//添加备选节点
				for (var j = latestNode.y - 1; j <= latestNode.y + 1; j++) {
					//遍历周围八节点,排除自己
					if (i == latestNode.x && j == latestNode.y) continue;
					//排除斜着走的情况
					if (i !== latestNode.x && j !== latestNode.y) {
						// console.info("qqqq", i, j, latestNode)
						continue;
					}

					if (!(map[i] && map[i][j] && map[i][j] == marker) && !(i === nodeEnd.x && j === nodeEnd.y)) {
						//如果是障碍物，或在close列表中，且不是目标
						continue;
					}

					var distX = nodeEnd.x - i;
					var distY = nodeEnd.y - j;
					var newNode = new _PathNode();
					newNode.x = i;
					newNode.y = j;
					newNode.H = Math.abs(distX) + Math.abs(distY);
					newNode.G = latestNode.G;
					//判断方向，如果转折G+1
					if (preNode != null) {
						//console.info(newNode, latestNode, preNode, !(Math.abs(newNode.x-preNode.x)===2 || Math.abs(newNode.y-preNode.y)===2))
						if (!(Math.abs(newNode.x - preNode.x) === 2 || Math.abs(newNode.y - preNode.y) === 2)) {
							newNode.G = latestNode.G + 1;
						}
					}
					// console.info(i,j,newNode)
					if (newNode.G > 2) {
						continue;
					}
					nextNodeList.push(newNode);

					if (newNode.x === nodeEnd.x && newNode.y === nodeEnd.y) {
						prePath.push(newNode);
						// console.info("##################11111111",prePath)
						return prePath;
					}
				}
			}

			if (nextNodeList.length === 0) {
				return [];
			}

			nextNodeList.sort(function (a, b) {
				return a.H + a.G - (b.H + a.G);
			});
			// console.info("====",nextNodeList)

			var num = 1;
			var result = [];
			var nowListX = null;
			for (var i = 0; i < nextNodeList.length && result.length <= 1; i++) {
				nowListX = prePath.slice(0);
				nowListX.push(nextNodeList[i]);
				result = _getNextPath(nowListX, nodeEnd);
			}
			return result;
		};

		var ways = _getNextPath([nodeStart], nodeEnd);
		for (var i = 0; i < ways.length; i++) {
			for (var j = i + 1; j + 1 < ways.length; j++) {
				if (ways[i].x == ways[j].x && ways[j].x == ways[j + 1].x || ways[i].y == ways[j].y && ways[j].y == ways[j + 1].y || Math.abs(ways[i].x - ways[j].x) == Math.abs(ways[i].y - ways[j].y) && Math.abs(ways[j].x - ways[j + 1].x) == Math.abs(ways[j].y - ways[j + 1].y)) {
					ways.splice(i + 1, 1);
					j--;
				}
			}
		}
		return ways;
		// console.info(ways)
	}

};

module.exports = pathUtil;

cc._RFpop();
},{}]},{},["llk","fkMaskJS","pathUtil"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL1Byb2dyYW0vQ29jb3NDcmVhdG9yL3Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL2xsay9ma01hc2tKUy5qcyIsImFzc2V0cy9sbGsvbGxrLmpzIiwiYXNzZXRzL2xsay9wYXRoVXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNjLl9SRnB1c2gobW9kdWxlLCAnMzdlNzFSaHcrcEhjYWg4OXpVV0MzalonLCAnZmtNYXNrSlMnKTtcbi8vIGxsa1xcZmtNYXNrSlMuanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICAvLyBmb286IHtcbiAgICAgICAgLy8gICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICAgICAgaW5mbzogbnVsbCwgLy9vYmpcbiAgICAgICAgZms6IG51bGwsIC8vbm9kZVxuICAgICAgICBsbGs6IG51bGwgLy9qc1xuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwidG91Y2hlbmRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKHRoaXMuZmsud2lkdGgpO1xuICAgICAgICAgICAgaWYgKHRoaXMubGxrLl9wcmVDaGVjaykge1xuICAgICAgICAgICAgICAgIHZhciBwcmVJbmZvID0gdGhpcy5sbGsuX3ByZUNoZWNrLmdldENoaWxkQnlOYW1lKFwiZmtNYXNrXCIpLmdldENvbXBvbmVudChcImZrTWFza0pTXCIpLmluZm87XG4gICAgICAgICAgICAgICAgaWYgKHByZUluZm8udHlwZSA9PT0gdGhpcy5pbmZvLnR5cGUgJiYgdGhpcy5sbGsuX3ByZUNoZWNrICE9PSB0aGlzLmZrICYmIHRoaXMucGF0aElzT2socHJlSW5mbykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sbGsuX3ByZUNoZWNrLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sbGsuX3ByZUNoZWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5may5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGxrLl9tYXBbcHJlSW5mby5sb2MueF1bcHJlSW5mby5sb2MueV0gPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxsay5fbWFwW3RoaXMuaW5mby5sb2MueF1bdGhpcy5pbmZvLmxvYy55XSA9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sbGsuX3ByZUNoZWNrLmdldENoaWxkQnlOYW1lKFwiZmtNYXNrXCIpLmdldENvbXBvbmVudChcImNjLlNwcml0ZVwiKS5zZXRWaXNpYmxlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sbGsuX3ByZUNoZWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZmsuZ2V0Q2hpbGRCeU5hbWUoXCJma01hc2tcIikuZ2V0Q29tcG9uZW50KFwiY2MuU3ByaXRlXCIpLnNldFZpc2libGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5sbGsuX3ByZUNoZWNrID0gdGhpcy5maztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG5cbiAgICBwYXRoSXNPazogZnVuY3Rpb24gcGF0aElzT2socHJlSW5mbykge1xuICAgICAgICB2YXIgcGF0aCA9IHRoaXMubGxrLmZpbmRQYXRoKHByZUluZm8ubG9jLCB0aGlzLmluZm8ubG9jKTtcbiAgICAgICAgY29uc29sZS5pbmZvKHBhdGgpO1xuICAgICAgICBpZiAocGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnMWFkNmVaVGRweEgrYXdGbHRSUE55dWgnLCAnbGxrJyk7XG4vLyBsbGtcXGxsay5qc1xuXG5cInVzZSBzdHJpY3RcIjtcblxudmFyIHBhdGhVdGlsID0gcmVxdWlyZShcInBhdGhVdGlsXCIpO1xuY2MuQ2xhc3Moe1xuXHRcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG5cdHByb3BlcnRpZXM6IHtcblx0XHQvLyBmb286IHtcblx0XHQvLyAgICBkZWZhdWx0OiBudWxsLFxuXHRcdC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcblx0XHQvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcblx0XHQvLyAgICB2aXNpYmxlOiB0cnVlLCAgICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcblx0XHQvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG5cdFx0Ly8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuXHRcdC8vIH0sXG5cdFx0Ly8gLi4uXG5cdFx0Z3JvdW5kOiB7XG5cdFx0XHRcImRlZmF1bHRcIjogbnVsbCxcblx0XHRcdHR5cGU6IGNjLk5vZGVcblx0XHR9LFxuXHRcdGZrTWFzazoge1xuXHRcdFx0XCJkZWZhdWx0XCI6IG51bGwsXG5cdFx0XHR0eXBlOiBjYy5QcmVmYWJcblx0XHR9LFxuXHRcdGZrOiB7XG5cdFx0XHRcImRlZmF1bHRcIjogW10sXG5cdFx0XHR0eXBlOiBbY2MuUHJlZmFiXVxuXHRcdH0sXG5cdFx0eFNpemU6IDEwLFxuXHRcdHlTaXplOiAxMCxcblx0XHR4U2l6ZUZrOiA1MCxcblx0XHR5U2l6ZUZrOiA1MCxcblx0XHRfcHJlQ2hlY2s6IG51bGwsXG5cdFx0X21hcDogW11cblx0fSxcblxuXHQvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cblx0b25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG5cdFx0eE1pbiA9IE1hdGgucm91bmQoLXRoaXMueFNpemUgLyAyKTtcblx0XHR4TWF4ID0gTWF0aC5yb3VuZCh0aGlzLnhTaXplIC8gMik7XG5cdFx0eU1pbiA9IE1hdGgucm91bmQoLXRoaXMueVNpemUgLyAyKTtcblx0XHR5TWF4ID0gTWF0aC5yb3VuZCh0aGlzLnlTaXplIC8gMik7XG5cdFx0Zm9yICh2YXIgeCA9IHlNaW4gLSAxOyB4IDwgeE1heCArIDE7IHgrKykge1xuXHRcdFx0dGhpcy5fbWFwW3hdID0gW107XG5cdFx0XHRmb3IgKHZhciB5ID0geU1pbiAtIDE7IHkgPCB5TWF4ICsgMTsgeSsrKSB7XG5cdFx0XHRcdHRoaXMuX21hcFt4XVt5XSA9IDE7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciBma1R5cGVDb3VudCA9IFtdO1xuXHRcdHZhciBma0NvdW50ID0gMDtcblx0XHR2YXIgZmtNYXhDb3VudCA9IHRoaXMueFNpemUgKiB0aGlzLnlTaXplO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5may5sZW5ndGg7IGkrKykge1xuXHRcdFx0ZmtUeXBlQ291bnRbaV0gPSAwO1xuXHRcdH1cblx0XHRmb3IgKHZhciB4ID0geE1pbjsgeCA8IHhNYXg7IHgrKykge1xuXHRcdFx0Zm9yICh2YXIgeSA9IHlNaW47IHkgPCB5TWF4OyB5KyspIHtcblx0XHRcdFx0dGhpcy5fbWFwW3hdW3ldID0gMDtcblx0XHRcdFx0dmFyIGluZGV4ID0gTWF0aC5mbG9vcihjYy5yYW5kb20wVG8xKCkgKiB0aGlzLmZrLmxlbmd0aCk7XG5cdFx0XHRcdGlmICgrK2ZrQ291bnQgPiBma01heENvdW50IC0gdGhpcy5may5sZW5ndGgpIHtcblx0XHRcdFx0XHRmb3IgKHZhciBmID0gMDsgZiA8IHRoaXMuZmsubGVuZ3RoOyBmKyspIHtcblx0XHRcdFx0XHRcdGlmIChma1R5cGVDb3VudFtmXSAvIDIgJSAxICE9PSAwKSB7XG5cdFx0XHRcdFx0XHRcdGluZGV4ID0gZjtcblx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGZrVHlwZUNvdW50W2luZGV4XSA9IGZrVHlwZUNvdW50W2luZGV4XSArIDE7XG5cdFx0XHRcdHZhciBvbmVGayA9IGNjLmluc3RhbnRpYXRlKHRoaXMuZmtbaW5kZXhdKTtcblx0XHRcdFx0dGhpcy5ncm91bmQuYWRkQ2hpbGQob25lRmspO1xuXHRcdFx0XHR2YXIgZmtNYXNrID0gY2MuaW5zdGFudGlhdGUodGhpcy5ma01hc2spO1xuXHRcdFx0XHRvbmVGay5hZGRDaGlsZChma01hc2spO1xuXG5cdFx0XHRcdC8v57uR5a6a5pWw5o2u5ZKM5YWz57O7XG5cdFx0XHRcdG9uZUZrLndpZHRoID0gdGhpcy54U2l6ZUZrO1xuXHRcdFx0XHRvbmVGay5oZWlnaHQgPSB0aGlzLnlTaXplRms7XG5cdFx0XHRcdG9uZUZrLnggPSB4ICogdGhpcy54U2l6ZUZrO1xuXHRcdFx0XHRvbmVGay55ID0geSAqIHRoaXMueVNpemVGaztcblx0XHRcdFx0dmFyIGluZm8gPSB7XG5cdFx0XHRcdFx0bG9jOiB7IHg6IHgsIHk6IHkgfSxcblx0XHRcdFx0XHR0eXBlOiBpbmRleFxuXHRcdFx0XHR9O1xuXHRcdFx0XHRma01hc2sud2lkdGggPSB0aGlzLnhTaXplRms7XG5cdFx0XHRcdGZrTWFzay5oZWlnaHQgPSB0aGlzLnlTaXplRms7XG5cdFx0XHRcdGZrTWFzay54ID0gMDtcblx0XHRcdFx0ZmtNYXNrLnkgPSAwO1xuXHRcdFx0XHRma01hc2suaW5mbyA9IGluZm87XG5cdFx0XHRcdHZhciBtYXNrSnMgPSBma01hc2suZ2V0Q29tcG9uZW50KFwiZmtNYXNrSlNcIik7XG5cdFx0XHRcdG1hc2tKcy5pbmZvID0gaW5mbztcblx0XHRcdFx0bWFza0pzLmZrID0gb25lRms7XG5cdFx0XHRcdG1hc2tKcy5sbGsgPSB0aGlzO1xuXG5cdFx0XHRcdGNvbnNvbGUuaW5mbyhvbmVGay53aWR0aCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXG5cdC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG5cdC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cblx0Ly8gfSxcblx0ZmluZFBhdGg6IGZ1bmN0aW9uIGZpbmRQYXRoKGxvYzEsIGxvYzIpIHtcblx0XHRyZXR1cm4gcGF0aFV0aWwuZmluZFBhdGgoW2xvYzEueCwgbG9jMS55XSwgW2xvYzIueCwgbG9jMi55XSwgdGhpcy5fbWFwLCAxKTtcblx0fVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsImNjLl9SRnB1c2gobW9kdWxlLCAnODBkYTd6VWk5TkJVb1J2SXlZNVdyUUwnLCAncGF0aFV0aWwnKTtcbi8vIGxsa1xccGF0aFV0aWwuanNcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfUGF0aE5vZGUgPSBmdW5jdGlvbiBfUGF0aE5vZGUoKSB7XG5cdHRoaXMueCA9IDA7XG5cdHRoaXMueSA9IDA7XG5cdHRoaXMuRyA9IDA7IC8v5byA6ZSAXG5cdHRoaXMuSCA9IDA7IC8v5a+76Lev5LyY5YWI57qn77yM6LaK5bCP6LaK5aW9XG59O1xuXG52YXIgcGF0aFV0aWwgPSB7XG5cdC8vc3RhcnQ66LW35aeL6IqC54K5W2ksal0g77yMIGVuZDrmnIDnu4joioLngrlbaSxqXSAgbWFwOuWcsOWbvuaVsOaNrigyZClhcnLvvIxtYXJrZXI65Y+v5Lul6YCa6L+H55qE5qCH6K+G77yI5L6L5a2Q55So55qE5pivMe+8iVxuXHRmaW5kUGF0aDogZnVuY3Rpb24gZmluZFBhdGgoc3RhcnQsIGVuZCwgbWFwLCBtYXJrZXIpIHtcblx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0dmFyIG9wZW4gPSBbXTtcblx0XHR2YXIgY2xvc2UgPSBbXTtcblxuXHRcdHZhciBub2RlU3RhcnQgPSBuZXcgX1BhdGhOb2RlKCk7XG5cdFx0bm9kZVN0YXJ0LnggPSBzdGFydFswXTtcblx0XHRub2RlU3RhcnQueSA9IHN0YXJ0WzFdO1xuXHRcdHZhciBub2RlRW5kID0gbmV3IF9QYXRoTm9kZSgpO1xuXHRcdG5vZGVFbmQueCA9IGVuZFswXTtcblx0XHRub2RlRW5kLnkgPSBlbmRbMV07XG5cdFx0Y29uc29sZS5pbmZvKHN0YXJ0LCBlbmQpO1xuXHRcdC8vIGZvcih2YXIgaT0gKVxuXHRcdGNvbnNvbGUuaW5mbyhtYXAudG9TdHJpbmcoKSk7XG5cdFx0Y29uc29sZS5pbmZvKG1hcmtlcik7XG5cdFx0dmFyIF9nZXROZXh0UGF0aCA9IGZ1bmN0aW9uIF9nZXROZXh0UGF0aChwcmVQYXRoLCBub2RlRW5kKSB7XG5cblx0XHRcdHZhciBuZXh0Tm9kZUxpc3QgPSBbXTsgLy/lj6/ku6XlvZPlgZrkuIvkuIDkuKrnmoToioLngrlcblx0XHRcdHZhciBwcmVOb2RlID0gbnVsbDtcblx0XHRcdGlmIChwcmVQYXRoLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0cHJlTm9kZSA9IHByZVBhdGhbcHJlUGF0aC5sZW5ndGggLSAyXTtcblx0XHRcdH1cblx0XHRcdHZhciBsYXRlc3ROb2RlID0gcHJlUGF0aFtwcmVQYXRoLmxlbmd0aCAtIDFdO1xuXHRcdFx0Zm9yICh2YXIgaSA9IGxhdGVzdE5vZGUueCAtIDE7IGkgPD0gbGF0ZXN0Tm9kZS54ICsgMTsgaSsrKSB7XG5cdFx0XHRcdC8v5re75Yqg5aSH6YCJ6IqC54K5XG5cdFx0XHRcdGZvciAodmFyIGogPSBsYXRlc3ROb2RlLnkgLSAxOyBqIDw9IGxhdGVzdE5vZGUueSArIDE7IGorKykge1xuXHRcdFx0XHRcdC8v6YGN5Y6G5ZGo5Zu05YWr6IqC54K5LOaOkumZpOiHquW3sVxuXHRcdFx0XHRcdGlmIChpID09IGxhdGVzdE5vZGUueCAmJiBqID09IGxhdGVzdE5vZGUueSkgY29udGludWU7XG5cdFx0XHRcdFx0Ly/mjpLpmaTmlpznnYDotbDnmoTmg4XlhrVcblx0XHRcdFx0XHRpZiAoaSAhPT0gbGF0ZXN0Tm9kZS54ICYmIGogIT09IGxhdGVzdE5vZGUueSkge1xuXHRcdFx0XHRcdFx0Ly8gY29uc29sZS5pbmZvKFwicXFxcVwiLCBpLCBqLCBsYXRlc3ROb2RlKVxuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYgKCEobWFwW2ldICYmIG1hcFtpXVtqXSAmJiBtYXBbaV1bal0gPT0gbWFya2VyKSAmJiAhKGkgPT09IG5vZGVFbmQueCAmJiBqID09PSBub2RlRW5kLnkpKSB7XG5cdFx0XHRcdFx0XHQvL+WmguaenOaYr+manOeijeeJqe+8jOaIluWcqGNsb3Nl5YiX6KGo5Lit77yM5LiU5LiN5piv55uu5qCHXG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHR2YXIgZGlzdFggPSBub2RlRW5kLnggLSBpO1xuXHRcdFx0XHRcdHZhciBkaXN0WSA9IG5vZGVFbmQueSAtIGo7XG5cdFx0XHRcdFx0dmFyIG5ld05vZGUgPSBuZXcgX1BhdGhOb2RlKCk7XG5cdFx0XHRcdFx0bmV3Tm9kZS54ID0gaTtcblx0XHRcdFx0XHRuZXdOb2RlLnkgPSBqO1xuXHRcdFx0XHRcdG5ld05vZGUuSCA9IE1hdGguYWJzKGRpc3RYKSArIE1hdGguYWJzKGRpc3RZKTtcblx0XHRcdFx0XHRuZXdOb2RlLkcgPSBsYXRlc3ROb2RlLkc7XG5cdFx0XHRcdFx0Ly/liKTmlq3mlrnlkJHvvIzlpoLmnpzovazmiphHKzFcblx0XHRcdFx0XHRpZiAocHJlTm9kZSAhPSBudWxsKSB7XG5cdFx0XHRcdFx0XHQvL2NvbnNvbGUuaW5mbyhuZXdOb2RlLCBsYXRlc3ROb2RlLCBwcmVOb2RlLCAhKE1hdGguYWJzKG5ld05vZGUueC1wcmVOb2RlLngpPT09MiB8fCBNYXRoLmFicyhuZXdOb2RlLnktcHJlTm9kZS55KT09PTIpKVxuXHRcdFx0XHRcdFx0aWYgKCEoTWF0aC5hYnMobmV3Tm9kZS54IC0gcHJlTm9kZS54KSA9PT0gMiB8fCBNYXRoLmFicyhuZXdOb2RlLnkgLSBwcmVOb2RlLnkpID09PSAyKSkge1xuXHRcdFx0XHRcdFx0XHRuZXdOb2RlLkcgPSBsYXRlc3ROb2RlLkcgKyAxO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBjb25zb2xlLmluZm8oaSxqLG5ld05vZGUpXG5cdFx0XHRcdFx0aWYgKG5ld05vZGUuRyA+IDIpIHtcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRuZXh0Tm9kZUxpc3QucHVzaChuZXdOb2RlKTtcblxuXHRcdFx0XHRcdGlmIChuZXdOb2RlLnggPT09IG5vZGVFbmQueCAmJiBuZXdOb2RlLnkgPT09IG5vZGVFbmQueSkge1xuXHRcdFx0XHRcdFx0cHJlUGF0aC5wdXNoKG5ld05vZGUpO1xuXHRcdFx0XHRcdFx0Ly8gY29uc29sZS5pbmZvKFwiIyMjIyMjIyMjIyMjIyMjIyMjMTExMTExMTFcIixwcmVQYXRoKVxuXHRcdFx0XHRcdFx0cmV0dXJuIHByZVBhdGg7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmIChuZXh0Tm9kZUxpc3QubGVuZ3RoID09PSAwKSB7XG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblxuXHRcdFx0bmV4dE5vZGVMaXN0LnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcblx0XHRcdFx0cmV0dXJuIGEuSCArIGEuRyAtIChiLkggKyBhLkcpO1xuXHRcdFx0fSk7XG5cdFx0XHQvLyBjb25zb2xlLmluZm8oXCI9PT09XCIsbmV4dE5vZGVMaXN0KVxuXG5cdFx0XHR2YXIgbnVtID0gMTtcblx0XHRcdHZhciByZXN1bHQgPSBbXTtcblx0XHRcdHZhciBub3dMaXN0WCA9IG51bGw7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG5leHROb2RlTGlzdC5sZW5ndGggJiYgcmVzdWx0Lmxlbmd0aCA8PSAxOyBpKyspIHtcblx0XHRcdFx0bm93TGlzdFggPSBwcmVQYXRoLnNsaWNlKDApO1xuXHRcdFx0XHRub3dMaXN0WC5wdXNoKG5leHROb2RlTGlzdFtpXSk7XG5cdFx0XHRcdHJlc3VsdCA9IF9nZXROZXh0UGF0aChub3dMaXN0WCwgbm9kZUVuZCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH07XG5cblx0XHR2YXIgd2F5cyA9IF9nZXROZXh0UGF0aChbbm9kZVN0YXJ0XSwgbm9kZUVuZCk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB3YXlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRmb3IgKHZhciBqID0gaSArIDE7IGogKyAxIDwgd2F5cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRpZiAod2F5c1tpXS54ID09IHdheXNbal0ueCAmJiB3YXlzW2pdLnggPT0gd2F5c1tqICsgMV0ueCB8fCB3YXlzW2ldLnkgPT0gd2F5c1tqXS55ICYmIHdheXNbal0ueSA9PSB3YXlzW2ogKyAxXS55IHx8IE1hdGguYWJzKHdheXNbaV0ueCAtIHdheXNbal0ueCkgPT0gTWF0aC5hYnMod2F5c1tpXS55IC0gd2F5c1tqXS55KSAmJiBNYXRoLmFicyh3YXlzW2pdLnggLSB3YXlzW2ogKyAxXS54KSA9PSBNYXRoLmFicyh3YXlzW2pdLnkgLSB3YXlzW2ogKyAxXS55KSkge1xuXHRcdFx0XHRcdHdheXMuc3BsaWNlKGkgKyAxLCAxKTtcblx0XHRcdFx0XHRqLS07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHdheXM7XG5cdFx0Ly8gY29uc29sZS5pbmZvKHdheXMpXG5cdH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwYXRoVXRpbDtcblxuY2MuX1JGcG9wKCk7Il19
