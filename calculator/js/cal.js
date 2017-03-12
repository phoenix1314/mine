/**
 * Created by dragon on 2017/3/9.
 */

var g_bFlge = false;  //标记是否点击等号=
var aryText = new Array(); //存储计算的数据
var aryOp = ["+","-","*","/"]; //操作符
var minusFlag = false; //标记1：正数:0：负数

/**
 * 通过id获取元素
 * @param id 标签的命名id
 * @returns {Element} 元素
 */
function $(id) {
    var ret = typeof id ==="string"? document.getElementById(id):id;
    return ret;
}

/**
 * 输入的数据保存在数组中
 * @param index 输入文本信息
 */
function saveAry(index) {
    var state = 0; //0：最后一位是数字 1：最后一位是符号
    var lastText = aryText[aryText.length-1]; //取出数组的最后一位
    console.log("lastText: "+lastText);
    for(var i=0;i<aryOp.length;i++)
    {
        //遍历查找 文本最后一个是否是操作符 1、是操作符直接追加 2、不是做拼接并且替换最后一位数
        // console.log("aryOp: "+aryOp[i]);
        if(lastText == aryOp[i] || index == aryOp[i])
        {
            state = 1;
            break;
        }
    }
    console.log("op state: "+state);
    var lastNum;
    if(!state)
    {
        if(lastText.indexOf(".") > -1 && index == ".")
        {
            //有小数点不在添加
            return;
        }
        lastNum = lastText+index;
        console.log("lastNum: "+lastNum);
        aryText.splice(aryText.length-1,1,lastNum);
    }
    else{
        //小数点前没有数字时，默认加0
        if(index.indexOf(".")==0)
        {
            index = "0"+index;
        }
        // console.log("**1111**"+lastText.lastIndexOf("."));
        // console.log(lastText.length-1);
        // if(lastText.lastIndexOf(".") == lastText.length-1)
        // {
        //     //小数点如果是最后一位 将删除小数点,小数点的位置是lastText.length-1
        //     console.log("del dot");
        //     lastText.substr(0,lastText.length-1);
        //     console.log("del dot lastText: "+lastText);
        //     aryText.splice(aryText.length-1,1,lastText);
        //
        // }
        aryText.push(index);
    }
    showResultText(aryText);
}


/**
 * 键盘数字按钮点击事件
 * @param index 键盘数字
 */
function showNum(index) {
    console.log("index: "+index);
    minusFlag = false;

    if(!g_bFlge)
    {
        //文本框显示为0时，直接赋值，否则不为0或者小数点做拼接
        var text = $("showReult").value;
        console.log("result: "+text);
        // console.log(typeof text); //string
        // console.log(text.indexOf("0."));
        //indexOf查找是否包含字符串，返回值为-1，表不包含；返回值为整数，表指出 String 对象内子字符串的开始位置
        if(text == 0 && text.indexOf("0.")==-1)
        {
            // $("showReult").value = index;
            aryText.push(index);
            showResultText(aryText);
        }
        else{
            saveAry(index);
        }
    }
    else {
        //重置之前要先清除存储数据
        aryText.splice(0,aryText.length);
        //再push值并显示
        aryText.push(index);
        showResultText(aryText);
        g_bFlge = false;
    }
    var len = aryText.length - 1;

}

/**
 * 小数点点击事件
 * @param dot 小数点
 */
function showDot(dot) {
    if(!g_bFlge){
        //有可能第一次输入的是小数点，result的0就不能清除
        //showResultText(dot);
        // if(aryText.length>0)
        // {
        //     if(lastText.indexOf("0.")==0)
        // }
        var text = $("showReult").value;
        console.log("aryText len: "+aryText.length);
        if(text == 0)
        {
            //第一次输入是否是0，是的话直接push 否则显示"0."
            if(aryText.length>0)
            {
                saveAry(dot);
            }
            else {
                aryText.push("0.");
                showResultText(aryText);
            }

        }
        else {

            saveAry(dot);
        }
    }
    else {
        g_bFlge = false;
        aryText.splice(0,aryText.length);
        aryText.push("0.");
        showResultText(aryText);
    }
}

/**
 * 操作符点击事件
 * @param op 操作符
 */
function showOp(op) {
    console.log("op: "+op);
    g_bFlge = false;
    if(aryText.length>0)
    {
        saveAry(op);
    }
    else {
        aryText.push("0"+op);
        showResultText(aryText);
    }

    // showResultText(op);
}

/**
 * 显示内容
 * @param ary 数组
 */
function showResultText(ary) {
    // console.log($("showReult").value);
    // $("showReult").value = $("showReult").value + text;
    console.log(ary);
    for(var i=0,textArea=" ";i<ary.length;i++)
    {
        textArea += ary[i];
    }
    console.log("textArea: "+textArea);
    $("showReult").value = textArea;

}

/**
 * AC键点击事件 即清除
 */
function funAc() {
    aryText.splice(0,aryText.length);
    $("showReult").value = 0;
}

/**
 * 等号 计算结果
 */
function equal() {
    var myEqual;
    var result = $("showReult").value;
    /** **************************捕获输入的异常数字********** */
    try  {
        myEqual = eval(result);
    }
    catch(result) {
        // alert(result);
        alert("您输入的可能不是合法的数字，请重新输入！");
        return;
    }
    /** ************************************************* */

    //计算结果后 先清除数据aryText数组
    aryText.splice(0,aryText.length);
    //结果赋值给aryText,并且直接显示结果
    aryText.push(myEqual);
    showResultText(aryText);
    // console.log("myEqual: "+myEqual);
    // $("showReult").value = myEqual;
    g_bFlge = true;
}

/**
 * 删除最后一个数字 即字符串最后一个值
 */
function funDel() {
    var str = $("showReult").value;
    console.log('len: '+str.length);
    $("showReult").value = str.substr(0,str.length-1);
    aryText.splice(aryText.length-1,1);
}

/**
 * 是否要加-号
 */
var lastTextBak; //变成负数前先备份下
function isMinus() {

    var lastNum;
    if(aryText.length>0)
    {
        var len = aryText.length - 1;
        console.log("[isMinus] len" + len);
        lastNum = aryText[len];
    }
    else {
        return;
    }

    console.log("[isMinus] lastNum:" + lastNum);
    console.log("[isMinus] minusFlag: "+minusFlag);
    if(!minusFlag)
    {
        //负数
        minusFlag = true;
        lastTextBak = aryText[aryText.length-1];
        console.log("[isMinus] lastTextBak"+lastTextBak);
        lastNum = "-"+aryText[aryText.length-1];
    }
    else {
        //正数
        minusFlag = false;
        lastNum = lastTextBak;
    }
    console.log("[isMinus] lastNum: "+lastNum);
    aryText.splice(aryText.length-1,1,lastNum);
    showResultText(aryText);
}