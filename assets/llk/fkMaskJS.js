cc.Class({
    extends: cc.Component,

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
        info:null,//obj
        fk:null,//node
        llk:null,//js
        scoreAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function () {
        this.node.on("touchend", function(){
			console.info(this.fk.width)
            if(this.llk._preCheck){
                var preInfo = this.llk._preCheck.getChildByName("fkMask").getComponent("fkMaskJS").info;
                if(preInfo.type === this.info.type && this.llk._preCheck!==this.fk && this.pathIsOk(preInfo)){
                    this.llk._preCheck.destroy();
                    this.llk._preCheck=null;
                    this.fk.destroy();
					this.llk._map[preInfo.loc.x][preInfo.loc.y] = 1;
					this.llk._map[this.info.loc.x][this.info.loc.y] = 1;
                }else{
                    this.llk._preCheck.getChildByName("fkMask").getComponent("cc.Sprite").setVisible(false)
                    this.llk._preCheck = null;
                }
            }else{
                this.fk.getChildByName("fkMask").getComponent("cc.Sprite").setVisible(true)
                this.llk._preCheck = this.fk;
            }
            
        }, this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
	
	pathIsOk:function(preInfo){
		var path = this.llk.findPath(preInfo.loc, this.info.loc);
		console.info(path)
		if(path.length>0){
			return true;
		}
		return false;
	},
	
	onDestroy:function(){
	    this.llk._blockCount--;
	    cc.audioEngine.playEffect(this.scoreAudio, false);
	    if(!this.llk._blockCount){
	        this.llk.upgrate();
	    }
	}
});
