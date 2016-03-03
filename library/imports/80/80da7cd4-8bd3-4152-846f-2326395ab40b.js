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