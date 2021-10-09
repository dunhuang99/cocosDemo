
import { _decorator, Component, Node, Vec3, Label } from 'cc';
import { STATE_TYPE } from './constant';

const { ccclass, property } = _decorator;

@ccclass('Item')
export class Item extends Component {

    onLoad() {
        this.node.setScale(new Vec3(0.7,0.7,1))
    }

    setLabel(index: string) {
        this.node.getChildByName('Label').getComponent(Label).string = index
    }

    setState(type: number) {
        this.node.getChildByName('normal').active = type === STATE_TYPE.NORMAL ? true : false
        this.node.getChildByName('draw').active = type === STATE_TYPE.DRAW ? true : false
        this.node.getChildByName('lose').active = type === STATE_TYPE.LOSE ? true : false
    }
}

