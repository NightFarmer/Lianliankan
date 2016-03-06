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
        llk: null, //js
        scoreAudio: {
            "default": null,
            url: cc.AudioClip
        }
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
    },

    onDestroy: function onDestroy() {
        this.llk._blockCount--;
        cc.audioEngine.playEffect(this.scoreAudio, false);
        if (!this.llk._blockCount) {
            this.llk.upgrate();
        }
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
								missionLabel: {
												"default": null,
												type: cc.Label
								},
								xSize: 10,
								ySize: 10,
								xSizeFk: 50,
								ySizeFk: 50,
								_preCheck: null,
								_map: [],
								_blockCount: 0,
								_missionNum: 1
				},

				// use this for initialization
				onLoad: function onLoad() {
								this.init();
				},

				// called every frame, uncomment this function to activate update callback
				// update: function (dt) {

				// },
				findPath: function findPath(loc1, loc2) {
								return pathUtil.findPath([loc1.x, loc1.y], [loc2.x, loc2.y], this._map, 1);
				},

				upgrate: function upgrate() {
								if (this.xSize > this.ySize) {
												this.ySize++;
								} else {
												this.xSize++;
								}
								if (this.xSize * this.ySize % 2 !== 0) {
												this.upgrate();
												return;
								}
								this.init();
								this._missionNum++;
								this.missionLabel.string = "第" + this._missionNum + "关";
				},

				init: function init() {
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
																this._blockCount++;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2dyYW0vQ29jb3NDcmVhdG9yL3Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL2xsay9ma01hc2tKUy5qcyIsImFzc2V0cy9sbGsvbGxrLmpzIiwiYXNzZXRzL2xsay9wYXRoVXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzM3ZTcxUmh3K3BIY2FoODl6VVdDM2paJywgJ2ZrTWFza0pTJyk7XG4vLyBsbGtcXGZrTWFza0pTLmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgIC8vICAgIHVybDogY2MuVGV4dHVyZTJELCAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHlwZW9mIGRlZmF1bHRcbiAgICAgICAgLy8gICAgc2VyaWFsaXphYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuICAgICAgICAvLyAgICBkaXNwbGF5TmFtZTogJ0ZvbycsIC8vIG9wdGlvbmFsXG4gICAgICAgIC8vICAgIHJlYWRvbmx5OiBmYWxzZSwgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgZmFsc2VcbiAgICAgICAgLy8gfSxcbiAgICAgICAgLy8gLi4uXG4gICAgICAgIGluZm86IG51bGwsIC8vb2JqXG4gICAgICAgIGZrOiBudWxsLCAvL25vZGVcbiAgICAgICAgbGxrOiBudWxsLCAvL2pzXG4gICAgICAgIHNjb3JlQXVkaW86IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdXJsOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgdGhpcy5ub2RlLm9uKFwidG91Y2hlbmRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKHRoaXMuZmsud2lkdGgpO1xuICAgICAgICAgICAgaWYgKHRoaXMubGxrLl9wcmVDaGVjaykge1xuICAgICAgICAgICAgICAgIHZhciBwcmVJbmZvID0gdGhpcy5sbGsuX3ByZUNoZWNrLmdldENoaWxkQnlOYW1lKFwiZmtNYXNrXCIpLmdldENvbXBvbmVudChcImZrTWFza0pTXCIpLmluZm87XG4gICAgICAgICAgICAgICAgaWYgKHByZUluZm8udHlwZSA9PT0gdGhpcy5pbmZvLnR5cGUgJiYgdGhpcy5sbGsuX3ByZUNoZWNrICE9PSB0aGlzLmZrICYmIHRoaXMucGF0aElzT2socHJlSW5mbykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sbGsuX3ByZUNoZWNrLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sbGsuX3ByZUNoZWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5may5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGxrLl9tYXBbcHJlSW5mby5sb2MueF1bcHJlSW5mby5sb2MueV0gPSAxO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxsay5fbWFwW3RoaXMuaW5mby5sb2MueF1bdGhpcy5pbmZvLmxvYy55XSA9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sbGsuX3ByZUNoZWNrLmdldENoaWxkQnlOYW1lKFwiZmtNYXNrXCIpLmdldENvbXBvbmVudChcImNjLlNwcml0ZVwiKS5zZXRWaXNpYmxlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sbGsuX3ByZUNoZWNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuZmsuZ2V0Q2hpbGRCeU5hbWUoXCJma01hc2tcIikuZ2V0Q29tcG9uZW50KFwiY2MuU3ByaXRlXCIpLnNldFZpc2libGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5sbGsuX3ByZUNoZWNrID0gdGhpcy5maztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG4gICAgLy8gdXBkYXRlOiBmdW5jdGlvbiAoZHQpIHtcblxuICAgIC8vIH0sXG5cbiAgICBwYXRoSXNPazogZnVuY3Rpb24gcGF0aElzT2socHJlSW5mbykge1xuICAgICAgICB2YXIgcGF0aCA9IHRoaXMubGxrLmZpbmRQYXRoKHByZUluZm8ubG9jLCB0aGlzLmluZm8ubG9jKTtcbiAgICAgICAgY29uc29sZS5pbmZvKHBhdGgpO1xuICAgICAgICBpZiAocGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIG9uRGVzdHJveTogZnVuY3Rpb24gb25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLmxsay5fYmxvY2tDb3VudC0tO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuc2NvcmVBdWRpbywgZmFsc2UpO1xuICAgICAgICBpZiAoIXRoaXMubGxrLl9ibG9ja0NvdW50KSB7XG4gICAgICAgICAgICB0aGlzLmxsay51cGdyYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiY2MuX1JGcHVzaChtb2R1bGUsICcxYWQ2ZVpUZHB4SCthd0ZsdFJQTnl1aCcsICdsbGsnKTtcbi8vIGxsa1xcbGxrLmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgcGF0aFV0aWwgPSByZXF1aXJlKFwicGF0aFV0aWxcIik7XG5jYy5DbGFzcyh7XG5cdFx0XHRcdFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cblx0XHRcdFx0cHJvcGVydGllczoge1xuXHRcdFx0XHRcdFx0XHRcdC8vIGZvbzoge1xuXHRcdFx0XHRcdFx0XHRcdC8vICAgIGRlZmF1bHQ6IG51bGwsXG5cdFx0XHRcdFx0XHRcdFx0Ly8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuXHRcdFx0XHRcdFx0XHRcdC8vICAgIHNlcmlhbGl6YWJsZTogdHJ1ZSwgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdC8vICAgIHZpc2libGU6IHRydWUsICAgICAgLy8gb3B0aW9uYWwsIGRlZmF1bHQgaXMgdHJ1ZVxuXHRcdFx0XHRcdFx0XHRcdC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcblx0XHRcdFx0XHRcdFx0XHQvLyAgICByZWFkb25seTogZmFsc2UsICAgIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIGZhbHNlXG5cdFx0XHRcdFx0XHRcdFx0Ly8gfSxcblx0XHRcdFx0XHRcdFx0XHQvLyAuLi5cblx0XHRcdFx0XHRcdFx0XHRncm91bmQ6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiZGVmYXVsdFwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogY2MuTm9kZVxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0ZmtNYXNrOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcImRlZmF1bHRcIjogbnVsbCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IGNjLlByZWZhYlxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0Zms6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiZGVmYXVsdFwiOiBbXSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFtjYy5QcmVmYWJdXG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRtaXNzaW9uTGFiZWw6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFwiZGVmYXVsdFwiOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogY2MuTGFiZWxcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdHhTaXplOiAxMCxcblx0XHRcdFx0XHRcdFx0XHR5U2l6ZTogMTAsXG5cdFx0XHRcdFx0XHRcdFx0eFNpemVGazogNTAsXG5cdFx0XHRcdFx0XHRcdFx0eVNpemVGazogNTAsXG5cdFx0XHRcdFx0XHRcdFx0X3ByZUNoZWNrOiBudWxsLFxuXHRcdFx0XHRcdFx0XHRcdF9tYXA6IFtdLFxuXHRcdFx0XHRcdFx0XHRcdF9ibG9ja0NvdW50OiAwLFxuXHRcdFx0XHRcdFx0XHRcdF9taXNzaW9uTnVtOiAxXG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0Ly8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG5cdFx0XHRcdG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMuaW5pdCgpO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdC8vIGNhbGxlZCBldmVyeSBmcmFtZSwgdW5jb21tZW50IHRoaXMgZnVuY3Rpb24gdG8gYWN0aXZhdGUgdXBkYXRlIGNhbGxiYWNrXG5cdFx0XHRcdC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cblx0XHRcdFx0Ly8gfSxcblx0XHRcdFx0ZmluZFBhdGg6IGZ1bmN0aW9uIGZpbmRQYXRoKGxvYzEsIGxvYzIpIHtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gcGF0aFV0aWwuZmluZFBhdGgoW2xvYzEueCwgbG9jMS55XSwgW2xvYzIueCwgbG9jMi55XSwgdGhpcy5fbWFwLCAxKTtcblx0XHRcdFx0fSxcblxuXHRcdFx0XHR1cGdyYXRlOiBmdW5jdGlvbiB1cGdyYXRlKCkge1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0aGlzLnhTaXplID4gdGhpcy55U2l6ZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy55U2l6ZSsrO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnhTaXplKys7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdGlmICh0aGlzLnhTaXplICogdGhpcy55U2l6ZSAlIDIgIT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMudXBncmF0ZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR0aGlzLmluaXQoKTtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLl9taXNzaW9uTnVtKys7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5taXNzaW9uTGFiZWwuc3RyaW5nID0gXCLnrKxcIiArIHRoaXMuX21pc3Npb25OdW0gKyBcIuWFs1wiO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0XHRcdFx0XHRcdFx0eE1pbiA9IE1hdGgucm91bmQoLXRoaXMueFNpemUgLyAyKTtcblx0XHRcdFx0XHRcdFx0XHR4TWF4ID0gTWF0aC5yb3VuZCh0aGlzLnhTaXplIC8gMik7XG5cdFx0XHRcdFx0XHRcdFx0eU1pbiA9IE1hdGgucm91bmQoLXRoaXMueVNpemUgLyAyKTtcblx0XHRcdFx0XHRcdFx0XHR5TWF4ID0gTWF0aC5yb3VuZCh0aGlzLnlTaXplIC8gMik7XG5cdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgeCA9IHlNaW4gLSAxOyB4IDwgeE1heCArIDE7IHgrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fbWFwW3hdID0gW107XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciB5ID0geU1pbiAtIDE7IHkgPCB5TWF4ICsgMTsgeSsrKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuX21hcFt4XVt5XSA9IDE7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdHZhciBma1R5cGVDb3VudCA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdHZhciBma0NvdW50ID0gMDtcblx0XHRcdFx0XHRcdFx0XHR2YXIgZmtNYXhDb3VudCA9IHRoaXMueFNpemUgKiB0aGlzLnlTaXplO1xuXHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5may5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZmtUeXBlQ291bnRbaV0gPSAwO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRmb3IgKHZhciB4ID0geE1pbjsgeCA8IHhNYXg7IHgrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Zm9yICh2YXIgeSA9IHlNaW47IHkgPCB5TWF4OyB5KyspIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fbWFwW3hdW3ldID0gMDtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5fYmxvY2tDb3VudCsrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSBNYXRoLmZsb29yKGNjLnJhbmRvbTBUbzEoKSAqIHRoaXMuZmsubGVuZ3RoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKCsrZmtDb3VudCA+IGZrTWF4Q291bnQgLSB0aGlzLmZrLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAodmFyIGYgPSAwOyBmIDwgdGhpcy5may5sZW5ndGg7IGYrKykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGZrVHlwZUNvdW50W2ZdIC8gMiAlIDEgIT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aW5kZXggPSBmO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZmtUeXBlQ291bnRbaW5kZXhdID0gZmtUeXBlQ291bnRbaW5kZXhdICsgMTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIG9uZUZrID0gY2MuaW5zdGFudGlhdGUodGhpcy5ma1tpbmRleF0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLmdyb3VuZC5hZGRDaGlsZChvbmVGayk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBma01hc2sgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmZrTWFzayk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9uZUZrLmFkZENoaWxkKGZrTWFzayk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly/nu5HlrprmlbDmja7lkozlhbPns7tcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b25lRmsud2lkdGggPSB0aGlzLnhTaXplRms7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9uZUZrLmhlaWdodCA9IHRoaXMueVNpemVGaztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b25lRmsueCA9IHggKiB0aGlzLnhTaXplRms7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9uZUZrLnkgPSB5ICogdGhpcy55U2l6ZUZrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR2YXIgaW5mbyA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb2M6IHsgeDogeCwgeTogeSB9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IGluZGV4XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZrTWFzay53aWR0aCA9IHRoaXMueFNpemVGaztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZmtNYXNrLmhlaWdodCA9IHRoaXMueVNpemVGaztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZmtNYXNrLnggPSAwO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRma01hc2sueSA9IDA7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGZrTWFzay5pbmZvID0gaW5mbztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIG1hc2tKcyA9IGZrTWFzay5nZXRDb21wb25lbnQoXCJma01hc2tKU1wiKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWFza0pzLmluZm8gPSBpbmZvO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtYXNrSnMuZmsgPSBvbmVGaztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWFza0pzLmxsayA9IHRoaXM7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5pbmZvKG9uZUZrLndpZHRoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cbn0pO1xuXG5jYy5fUkZwb3AoKTsiLCJjYy5fUkZwdXNoKG1vZHVsZSwgJzgwZGE3elVpOU5CVW9Sdkl5WTVXclFMJywgJ3BhdGhVdGlsJyk7XG4vLyBsbGtcXHBhdGhVdGlsLmpzXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgX1BhdGhOb2RlID0gZnVuY3Rpb24gX1BhdGhOb2RlKCkge1xuXHR0aGlzLnggPSAwO1xuXHR0aGlzLnkgPSAwO1xuXHR0aGlzLkcgPSAwOyAvL+W8gOmUgFxuXHR0aGlzLkggPSAwOyAvL+Wvu+i3r+S8mOWFiOe6p++8jOi2iuWwj+i2iuWlvVxufTtcblxudmFyIHBhdGhVdGlsID0ge1xuXHQvL3N0YXJ0Oui1t+Wni+iKgueCuVtpLGpdIO+8jCBlbmQ65pyA57uI6IqC54K5W2ksal0gIG1hcDrlnLDlm77mlbDmja4oMmQpYXJy77yMbWFya2VyOuWPr+S7pemAmui/h+eahOagh+ivhu+8iOS+i+WtkOeUqOeahOaYrzHvvIlcblx0ZmluZFBhdGg6IGZ1bmN0aW9uIGZpbmRQYXRoKHN0YXJ0LCBlbmQsIG1hcCwgbWFya2VyKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHZhciBvcGVuID0gW107XG5cdFx0dmFyIGNsb3NlID0gW107XG5cblx0XHR2YXIgbm9kZVN0YXJ0ID0gbmV3IF9QYXRoTm9kZSgpO1xuXHRcdG5vZGVTdGFydC54ID0gc3RhcnRbMF07XG5cdFx0bm9kZVN0YXJ0LnkgPSBzdGFydFsxXTtcblx0XHR2YXIgbm9kZUVuZCA9IG5ldyBfUGF0aE5vZGUoKTtcblx0XHRub2RlRW5kLnggPSBlbmRbMF07XG5cdFx0bm9kZUVuZC55ID0gZW5kWzFdO1xuXHRcdGNvbnNvbGUuaW5mbyhzdGFydCwgZW5kKTtcblx0XHQvLyBmb3IodmFyIGk9IClcblx0XHRjb25zb2xlLmluZm8obWFwLnRvU3RyaW5nKCkpO1xuXHRcdGNvbnNvbGUuaW5mbyhtYXJrZXIpO1xuXHRcdHZhciBfZ2V0TmV4dFBhdGggPSBmdW5jdGlvbiBfZ2V0TmV4dFBhdGgocHJlUGF0aCwgbm9kZUVuZCkge1xuXG5cdFx0XHR2YXIgbmV4dE5vZGVMaXN0ID0gW107IC8v5Y+v5Lul5b2T5YGa5LiL5LiA5Liq55qE6IqC54K5XG5cdFx0XHR2YXIgcHJlTm9kZSA9IG51bGw7XG5cdFx0XHRpZiAocHJlUGF0aC5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdHByZU5vZGUgPSBwcmVQYXRoW3ByZVBhdGgubGVuZ3RoIC0gMl07XG5cdFx0XHR9XG5cdFx0XHR2YXIgbGF0ZXN0Tm9kZSA9IHByZVBhdGhbcHJlUGF0aC5sZW5ndGggLSAxXTtcblx0XHRcdGZvciAodmFyIGkgPSBsYXRlc3ROb2RlLnggLSAxOyBpIDw9IGxhdGVzdE5vZGUueCArIDE7IGkrKykge1xuXHRcdFx0XHQvL+a3u+WKoOWkh+mAieiKgueCuVxuXHRcdFx0XHRmb3IgKHZhciBqID0gbGF0ZXN0Tm9kZS55IC0gMTsgaiA8PSBsYXRlc3ROb2RlLnkgKyAxOyBqKyspIHtcblx0XHRcdFx0XHQvL+mBjeWOhuWRqOWbtOWFq+iKgueCuSzmjpLpmaToh6rlt7Fcblx0XHRcdFx0XHRpZiAoaSA9PSBsYXRlc3ROb2RlLnggJiYgaiA9PSBsYXRlc3ROb2RlLnkpIGNvbnRpbnVlO1xuXHRcdFx0XHRcdC8v5o6S6Zmk5pac552A6LWw55qE5oOF5Ya1XG5cdFx0XHRcdFx0aWYgKGkgIT09IGxhdGVzdE5vZGUueCAmJiBqICE9PSBsYXRlc3ROb2RlLnkpIHtcblx0XHRcdFx0XHRcdC8vIGNvbnNvbGUuaW5mbyhcInFxcXFcIiwgaSwgaiwgbGF0ZXN0Tm9kZSlcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICghKG1hcFtpXSAmJiBtYXBbaV1bal0gJiYgbWFwW2ldW2pdID09IG1hcmtlcikgJiYgIShpID09PSBub2RlRW5kLnggJiYgaiA9PT0gbm9kZUVuZC55KSkge1xuXHRcdFx0XHRcdFx0Ly/lpoLmnpzmmK/pmpznoo3nianvvIzmiJblnKhjbG9zZeWIl+ihqOS4re+8jOS4lOS4jeaYr+ebruagh1xuXHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dmFyIGRpc3RYID0gbm9kZUVuZC54IC0gaTtcblx0XHRcdFx0XHR2YXIgZGlzdFkgPSBub2RlRW5kLnkgLSBqO1xuXHRcdFx0XHRcdHZhciBuZXdOb2RlID0gbmV3IF9QYXRoTm9kZSgpO1xuXHRcdFx0XHRcdG5ld05vZGUueCA9IGk7XG5cdFx0XHRcdFx0bmV3Tm9kZS55ID0gajtcblx0XHRcdFx0XHRuZXdOb2RlLkggPSBNYXRoLmFicyhkaXN0WCkgKyBNYXRoLmFicyhkaXN0WSk7XG5cdFx0XHRcdFx0bmV3Tm9kZS5HID0gbGF0ZXN0Tm9kZS5HO1xuXHRcdFx0XHRcdC8v5Yik5pat5pa55ZCR77yM5aaC5p6c6L2s5oqYRysxXG5cdFx0XHRcdFx0aWYgKHByZU5vZGUgIT0gbnVsbCkge1xuXHRcdFx0XHRcdFx0Ly9jb25zb2xlLmluZm8obmV3Tm9kZSwgbGF0ZXN0Tm9kZSwgcHJlTm9kZSwgIShNYXRoLmFicyhuZXdOb2RlLngtcHJlTm9kZS54KT09PTIgfHwgTWF0aC5hYnMobmV3Tm9kZS55LXByZU5vZGUueSk9PT0yKSlcblx0XHRcdFx0XHRcdGlmICghKE1hdGguYWJzKG5ld05vZGUueCAtIHByZU5vZGUueCkgPT09IDIgfHwgTWF0aC5hYnMobmV3Tm9kZS55IC0gcHJlTm9kZS55KSA9PT0gMikpIHtcblx0XHRcdFx0XHRcdFx0bmV3Tm9kZS5HID0gbGF0ZXN0Tm9kZS5HICsgMTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gY29uc29sZS5pbmZvKGksaixuZXdOb2RlKVxuXHRcdFx0XHRcdGlmIChuZXdOb2RlLkcgPiAyKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bmV4dE5vZGVMaXN0LnB1c2gobmV3Tm9kZSk7XG5cblx0XHRcdFx0XHRpZiAobmV3Tm9kZS54ID09PSBub2RlRW5kLnggJiYgbmV3Tm9kZS55ID09PSBub2RlRW5kLnkpIHtcblx0XHRcdFx0XHRcdHByZVBhdGgucHVzaChuZXdOb2RlKTtcblx0XHRcdFx0XHRcdC8vIGNvbnNvbGUuaW5mbyhcIiMjIyMjIyMjIyMjIyMjIyMjIzExMTExMTExXCIscHJlUGF0aClcblx0XHRcdFx0XHRcdHJldHVybiBwcmVQYXRoO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAobmV4dE5vZGVMaXN0Lmxlbmd0aCA9PT0gMCkge1xuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9XG5cblx0XHRcdG5leHROb2RlTGlzdC5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG5cdFx0XHRcdHJldHVybiBhLkggKyBhLkcgLSAoYi5IICsgYS5HKTtcblx0XHRcdH0pO1xuXHRcdFx0Ly8gY29uc29sZS5pbmZvKFwiPT09PVwiLG5leHROb2RlTGlzdClcblxuXHRcdFx0dmFyIG51bSA9IDE7XG5cdFx0XHR2YXIgcmVzdWx0ID0gW107XG5cdFx0XHR2YXIgbm93TGlzdFggPSBudWxsO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBuZXh0Tm9kZUxpc3QubGVuZ3RoICYmIHJlc3VsdC5sZW5ndGggPD0gMTsgaSsrKSB7XG5cdFx0XHRcdG5vd0xpc3RYID0gcHJlUGF0aC5zbGljZSgwKTtcblx0XHRcdFx0bm93TGlzdFgucHVzaChuZXh0Tm9kZUxpc3RbaV0pO1xuXHRcdFx0XHRyZXN1bHQgPSBfZ2V0TmV4dFBhdGgobm93TGlzdFgsIG5vZGVFbmQpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcblx0XHR9O1xuXG5cdFx0dmFyIHdheXMgPSBfZ2V0TmV4dFBhdGgoW25vZGVTdGFydF0sIG5vZGVFbmQpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgd2F5cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Zm9yICh2YXIgaiA9IGkgKyAxOyBqICsgMSA8IHdheXMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0aWYgKHdheXNbaV0ueCA9PSB3YXlzW2pdLnggJiYgd2F5c1tqXS54ID09IHdheXNbaiArIDFdLnggfHwgd2F5c1tpXS55ID09IHdheXNbal0ueSAmJiB3YXlzW2pdLnkgPT0gd2F5c1tqICsgMV0ueSB8fCBNYXRoLmFicyh3YXlzW2ldLnggLSB3YXlzW2pdLngpID09IE1hdGguYWJzKHdheXNbaV0ueSAtIHdheXNbal0ueSkgJiYgTWF0aC5hYnMod2F5c1tqXS54IC0gd2F5c1tqICsgMV0ueCkgPT0gTWF0aC5hYnMod2F5c1tqXS55IC0gd2F5c1tqICsgMV0ueSkpIHtcblx0XHRcdFx0XHR3YXlzLnNwbGljZShpICsgMSwgMSk7XG5cdFx0XHRcdFx0ai0tO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiB3YXlzO1xuXHRcdC8vIGNvbnNvbGUuaW5mbyh3YXlzKVxuXHR9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcGF0aFV0aWw7XG5cbmNjLl9SRnBvcCgpOyJdfQ==
