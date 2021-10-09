
import { _decorator, Component, Node, Prefab, instantiate, tween, Label } from 'cc';
import { Item } from './item';
import { STATE_TYPE } from './constant';
const { ccclass, property } = _decorator;

// enum STATE_TYPE {
//     NORMAL = 'normal',
//     DRAW = 'draw',
//     LOSE = 'lose'
// }

@ccclass('Main')
export class Main extends Component {

    @property(Prefab)
    itemPrefab: Prefab = null

    @property(Node)
    parentNode: Node = null

    @property(Node)
    endLabel: Node = null


    private _resultIndex = -1
    private _lastIndex = -1
    private _endDrawCount = 0
    private _allItemArr = []


    onLoad() {
        for (let childIndex in this.parentNode.children) {
            let child = this.parentNode.children[childIndex]
            let itemPre = instantiate(this.itemPrefab)
            itemPre.getComponent(Item).setState(STATE_TYPE.NORMAL)
            itemPre.getComponent(Item).setLabel(childIndex)
            child.addChild(itemPre)
            this._allItemArr.push(child)
        }
        this.getResultIndex()
    }

    /**
     * 点击开始抽奖
     */
    clickStart() {

        if (this._allItemArr.length <= 1) {
            console.log('抽奖结束');
            this.node.pauseSystemEvents(true)
            this.endLabel.active= true
            return
        }

        let times = Math.floor(40/ 16 * this._allItemArr.length)
        console.log('times  ' , times);

        let tween1 = tween(this.node)
        .call(() => {
            this.luckDraw()
        })
        .delay(0.1)
        .union()
        .repeat(times)
        .call(() => {
            this.scheduleHandle(0.15)
        })
        tween1.start()
    }

    /**
     * 抽奖闪烁
     */
    luckDraw() {

        let randIndex = Math.floor(Math.random() * this._allItemArr.length)
        if (this._lastIndex != -1) {
            while (randIndex === this._lastIndex) {
                randIndex = Math.floor(Math.random() * this._allItemArr.length)
            }
            this._allItemArr[this._lastIndex].children[0].getComponent(Item).setState(STATE_TYPE.NORMAL)
        }
        this._allItemArr[randIndex].children[0].getComponent(Item).setState(STATE_TYPE.DRAW)
        this._lastIndex = randIndex
    }

    /**
     * 抽奖变化变慢逻辑
     * @param time 间隔时间
     */
    scheduleHandle(time: number) {
        this.scheduleOnce(() => {
            this._endDrawCount++
            if (this._endDrawCount === 8) {
                this.endLuckDraw()
            }else {
                this.luckDraw()
                this.scheduleHandle(time + 0.05)
            }
        }, time)
    }

    /**
     * 抽奖结束
     */
    endLuckDraw() {
        console.log('结束抽奖 ' , this._lastIndex, this._resultIndex);

        //当数目较少时，容易发生最后一次闪烁的item跟目标item一致的情况，做一下特殊处理
        if (this._lastIndex != this._resultIndex) {
            this._allItemArr[this._resultIndex].children[0].getComponent(Item).setState(STATE_TYPE.DRAW)
            this._allItemArr[this._lastIndex].children[0].getComponent(Item).setState(STATE_TYPE.NORMAL)
        }

        this.scheduleOnce(() => {
            this._allItemArr[this._resultIndex].children[0].getComponent(Item).setState(STATE_TYPE.LOSE)
            this._allItemArr.splice(this._resultIndex, 1)
            this._lastIndex = -1
            this._endDrawCount = 0
        }, 1)
    }

    /**
     * 随机获取抽奖结果
     */
    getResultIndex() {
        this._resultIndex =  Math.floor(Math.random() * this._allItemArr.length)
        console.log('结果index为  '  , this._resultIndex);
    }

}

