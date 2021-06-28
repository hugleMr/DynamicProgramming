const {ccclass, property} = cc._decorator;

@ccclass
export default class GameCtrl extends cc.Component {
    @property([cc.Label])
    listSuggestNumberLabel : cc.Label[] = [];
    
    private listResultNumberLabel : cc.Label[] = [];

    @property(cc.Node)
    itemResult : cc.Node = null;
    @property(cc.Label)
    lblSum : cc.Label = null;
    @property(cc.Node)
    resultNode : cc.Node = null;

    private suggestNumber : number[] = [];
    private listResultNumber : number[] = [];
    private sum : number = 0;

    onLoad () {
        this.nextLevel();
    }

    nextLevel(){
        let n = Math.floor(Math.random() * 30) + 5;
        this.init(n);
    }

    init(n : number){
        let listResult = [];
        let listSuggest = [];
        do {
            listSuggest = this.randomSuggestNumber()
            listResult = this.logic(n, listSuggest)
        }while(listResult.length <= 1)

        this.suggestNumber = listSuggest
        this.listResultNumber = listResult

        this.sum = n;
        this.lblSum.string = "Sum = " + n;
        this.showSuggestNumber();
        this.showResultHidden();
    }

    showSuggestNumber(){
        for(let i in this.suggestNumber){
            this.listSuggestNumberLabel[i].string = this.suggestNumber[i] + ""
        }
    }

    showResultHidden(){
        this.resultNode.removeAllChildren();
        this.listResultNumberLabel = [];
        for(let i = 0; i < this.listResultNumber.length; i++){
            let node = cc.instantiate(this.itemResult);
            node.parent = this.resultNode;
            node.active = true;
            node.y = 0;
            node.x = (i - (this.listResultNumber.length - 1) / 2) * node.width * 1.2;
            let labelNode = node.getChildByName("value");
            if(labelNode){
                let label = labelNode.getComponent(cc.Label);
                if(label){
                    this.listResultNumberLabel.push(label);
                    label.string = "";
                }
            }
        }
    }

    setItemResultValue(value : number){
        for(let i = 0; i < this.listResultNumberLabel.length; i++){
            let label = this.listResultNumberLabel[i];
            if(label.string == ""){
                label.string = value + "";
                break;
            }
        }

        let isGameCompleted = this.checkResult();
        if(isGameCompleted){
            this.scheduleOnce(()=>{
                this.nextLevel();
            }, 0.5);
        }
    }

    checkResult(){
        let _sum = 0;
        for(let label of this.listResultNumberLabel){
            if(label.string != ""){
                let number = parseInt(label.string);
                _sum += number;
            }
        }

        return _sum != 0 && _sum == this.sum;
    }

    getAllNumberInresult(){

    }

    randomSuggestNumber(){
        let listNumber = [];
        let count = 0;
        do {
            let number = Math.floor(Math.random() * 9) + 1;
            if(!listNumber.includes(number)){
                listNumber.push(number);
                count++;
            }
        } while(count < 4)

        return listNumber;
    }

    onNumberSuggestClick(event : any, index : string){
        if(this.suggestNumber.length ==0) return;

        let number = this.suggestNumber[index];
        this.setItemResultValue(number);
    }

    onResultClick(event : any, index : string){
        let node = event.target;
        let lbl = node.getChildByName("value").getComponent(cc.Label);
        lbl.string = "";
    }

    logic(n : number, list : any[]){
        let value = new Array(n).fill(0)
        let first = new Array(n).fill(0)
        let result = []
        for (let x = 1; x <= n; x++) {
            value[x] = Infinity
            for (let c of list) {
                if (x - c >= 0 && value[x - c] + 1 < value[x]) {
                    value[x] = value[x - c] + 1
                    first[x] = c
                }
            }
        }
        
        while(n > 0){
            result.push(first[n])
            n -= first[n]
        }

        return result;
    }
}
