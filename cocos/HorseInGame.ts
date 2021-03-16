import { Component, RenderableComponent, _decorator, Node, Camera, Vec3, Prefab, Texture2D, Material, MeshRenderer, tween, LabelComponent, Rect } from "cc";
import { cc } from "../game/CCGlobal";
import { GameSettings } from "../game/GameSettings";
import { InGame } from "../game/InGame";
import { CamControl } from "./CamControl";
import { DB } from "./DB";
import { HorseMob } from "./HorseMob";
import { TestUI } from "./ui/TestUI";

const {ccclass, property} = _decorator;

@ccclass
export class HorseInGame extends InGame 
{

    @property([Material])
    markerMats: Material[] = [];

    @property(Node)
    markerCon: Node = null;

    @property(Prefab)
    markerPrefab: Prefab = null;

    @property([Prefab])
    horsePres: Prefab[] = [];

    @property(Prefab)
    track:Prefab = null;

    @property(Node)
    horseCon:Node = null;

    @property(Node)
    nameCon:Node = null;

    @property(Node)
    trackCon:Node = null;

    @property(Node)
    testHorse:Node = null;

    @property(CamControl)
    camControl:CamControl = null;

    @property(TestUI)
    testUI:TestUI = null;

    @property(LabelComponent)
    toggleLabel:LabelComponent = null;

    horseList:Array<HorseMob>;
    racingList:Array<HorseMob>;
    horseIdMap:any;
    
    isRacing = false;

    finishCount = 0;

    roundData:any;
    resultStr = '';

    onLoad () {
        this.testHorse.active = false;
    }

    start() {
        super.start();
        this.initDatas();
        this.genTracks();
        let horseInfos = [];
        for (let i = 0; i < 8; i++ ) horseInfos.push(GameSettings.HORSE_INFOS[i]);
        this.initHorses(horseInfos);
    }

    initDatas()
    {
        this.roundData = [];
        for (let i = 0; i < GameSettings.HORSE_INFOS.length; i++)
        {
            this.roundData[(i+1)] = [[], []];
        }
        let totalRounds = DB.data.length/56;
        for (let i = 0; i < totalRounds; i++)
        {
            let result = DB.data.substr(i*56 + 48, 8);
            this.roundData[result.charAt(0)][0].push(i);
            this.roundData[result.charAt(1)][1].push(i);
        }
    }

    public onCanvasResize()
    {
        let dsize = cc.view.getDesignResolutionSize();
        let vp = cc.view.getViewportRect();

        let gameSize = {x: 0, y: 0, width:0, height:0};
        let r = vp.width/vp.height;
        if (r < 1024/768) r = 1024/768;
        if (dsize.width/dsize.height > vp.width/vp.height) 
        {
            gameSize.width = dsize.width;
            gameSize.height = dsize.width*(1/r);
        }
        else {
            gameSize.height = dsize.height;
            gameSize.width = dsize.height*r;
        }
        
        let x = gameSize.x/vp.width;
        let y = gameSize.y/vp.height;
        let scale = 1;
        GameSettings.GAME_W = gameSize.width;
        GameSettings.GAME_H = gameSize.height;
        
        scale = vp.width/dsize.width; // fit width
        if (GameSettings.GAME_H > vp.height/scale) GameSettings.GAME_H = vp.height/scale;
        this.cam.rect = new Rect(x*scale, y*scale + (vp.height - gameSize.height*scale)*0.5/vp.height, gameSize.width*scale/vp.width, gameSize.height*scale/vp.height);

        this.testUI.onCanvasResize();
    }

    genTracks()
    {
        for (let i = 0; i < 50; i++)
        {
            let track = cc.instantiate(this.track);
            track.setPosition(cc.v3(0, 0, i*2));
            this.trackCon.addChild(track);
        }

        for (let i = 0; i < 10; i++)
        {
            let marker = cc.instantiate(this.markerPrefab);
            marker.setPosition(cc.v3(0, 0, (i+1)*10));
            let renderer:any = marker.getChildByName('txt').getComponent(MeshRenderer);
            if (renderer) renderer.setMaterial(this.markerMats[i], 0);
            this.markerCon.addChild(marker);
        }
    }

    initHorses(horseInfos:Array<any>)
    {
        this.horseCon.removeAllChildren();
        this.horseList = [];
        this.horseIdMap = {};
        for (let i = 0; i < horseInfos.length; i++)
        {
            let info = horseInfos[i];
            let horse = cc.instantiate(this.horsePres[i]);
            this.horseCon.addChild(horse);
            let horseMob = horse.getComponent(HorseMob);
            horseMob.initData(info.name, info.s, info.a, false);
            horseMob.horseSimul.info = info;
            this.horseList.push(horseMob);

            horseMob.node.active = false;

            this.horseIdMap[info.id] = horseMob;
        }

        // optimization - query all skinned mesh and dissable shadow receive mode --
        // ---------------
    }

    startRacingRandom()
    {
        let l = 56;
        let totalRounds = DB.data.length/l;
        let roundInd = Math.round(Math.random()*(totalRounds - 1));
        let rstr = DB.data.substr(l*roundInd, l);
        
        for (let i = 0; i < this.horseList.length; i++) this.horseList[i].setHighlight(false);
        this.startRacing(rstr);
    }

    startRacingWithResult()
    {
        let l = 56;
        let horseId = this.testUI.horseCombo.baseItem.data.id;
        let rankId = this.testUI.rankCombo.baseItem.data.id;

        for (let i = 0; i < this.horseList.length; i++) this.horseList[i].setHighlight(false);
        this.horseIdMap[horseId].setHighlight(true);

        let arr = this.roundData[horseId][rankId];
        let roundInd = arr[Math.round(Math.random()*(arr.length - 1))];
        let rstr = DB.data.substr(l*roundInd, l);
        this.startRacing(rstr);
    }
    
    startRacing(rstr, horseIds:Array<any> = null, positionList:Array<any> = null)
    {
        //let bug = '46108866677136409236440073772304520987199643292348312756';
        let bug = '63342299955205216952669362124578776112763545165084165732';
        //rstr = bug.substr(bug.length - 56, 56);
        cc.log('start racing === ' + rstr);
        this.resultStr = rstr.substr(rstr.length - 8, 8);
        this.racingList = [];
        this.finishCount = 0;
        this.isRacing = true;
        
        this.camControl.startMove();
        for (let i = 0; i < this.horseList.length; i++) this.horseList[i].node.active = false;
        // server should return the order
        if (!horseIds)
        {
            horseIds = [];
            for (let i = 0; i < 8; i++) horseIds.push((i+1));
        }

        for (let i = 0; i < horseIds.length; i++)
        {
            this.racingList.push(this.horseIdMap[horseIds[i]]);
        }

        if (!positionList) 
        {
            positionList = horseIds.slice();
            // suffle
            for (let i = 0; i < positionList.length; i++) {
                let n = Math.round(Math.random()*(positionList.length - 1));
                let temp = positionList[i];
                positionList[i] = positionList[n];
                positionList[n] = temp;
            }
        }

        for (let i = 0; i < positionList.length; i++)
        {
            let horseId = positionList[i];
            let horse:HorseMob = this.horseIdMap[horseId];
            horse.node.setPosition(cc.v3(-0.166*i, 0, 0));
            horse.setRaceNumber((i+1));

            let runningInfo = this.testUI.runningInfos[i];
            runningInfo.numTf.string = (i+1).toString();
            runningInfo.nameTf.string = horse.horseSimul.name;
            runningInfo.rankTf.string = '1';
            horse.testRunningInfo = runningInfo;
        }

        for (let i = 0; i < horseIds.length; i++)
        {
            let horseId = horseIds[i];
            let r1 = rstr.substr(6*i, 3);
            let r2 = rstr.substr(6*i + 3, 3);
            let horse = this.horseIdMap[horseId];
            horse.node.active = true;
            horse.startRace(1000, 100, horse.horseSimul.info.start + (parseFloat(r1)/1000)*(horse.horseSimul.info.end - horse.horseSimul.info.start), 
                this.onHorseFinish.bind(this, horse), (parseFloat(r2)/1000));
        }
    }

    onHorseFinish(horse:HorseMob)
    {
        cc.log(horse.horseSimul.name + ' time: ' + horse.horseSimul.duration.toFixed(2));
        this.camControl.stopMove();
        if (this.finishCount == 0)
        {
            for (let i = 0; i < this.racingList.length; i++)
            {
                this.racingList[i].pause();
            }
            tween(this.node).delay(3.0).call(()=>{
                for (let i = 0; i < this.racingList.length; i++)
                {
                    this.racingList[i].resume();
                }
            }).start();
        }
        this.finishCount++;
        if (this.finishCount == this.racingList.length) this.onEndRacing();
    }

    onEndRacing()
    {
        this.isRacing = false;
        // for last rank update 
        for (let i = 0; i < this.resultStr.length; i++)
        {
            let horse = this.horseIdMap[this.resultStr.charAt(i)];
            if (horse.testRunningInfo) horse.testRunningInfo.rank = horse.rank - 1;
        }
    }

    getFirstHorse():HorseMob
    {
        let horse:HorseMob = null;
        for (let i = 0; i < this.racingList.length; i++)
        {
            if (!horse || horse.horseSimul.racingPos < this.racingList[i].horseSimul.racingPos) horse = this.racingList[i];
        }

        return horse;
    }

    getLastHorse():HorseMob
    {
        let horse:HorseMob = null;
        for (let i = 0; i < this.racingList.length; i++)
        {
            if (!horse || horse.horseSimul.racingPos > this.racingList[i].horseSimul.racingPos) horse = this.racingList[i];
        }

        return horse;
    }

    update(dt:number)
    {
        if (this.isRacing)
        {
            let hl = [];
            for (let i = 0; i < this.racingList.length; i++) if (!this.racingList[i].horseSimul.isMovingDone) hl.push(this.racingList[i]);
            hl = hl.sort((a, b)=>{return a.horseSimul.racingPos < b.horseSimul.racingPos?1:-1});
            for (let i = 0; i < hl.length; i++) hl[i].rank = this.finishCount + i + 1;
        }
    }

    toggleInfo()
    {
        let infoCon = this.testUI.node.getChildByName('info');
        infoCon.active = !infoCon.active;
        this.toggleLabel.string =  !infoCon.active?'<< show info':'>> hide info';
    }
}
