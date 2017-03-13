
/**
 * Created by dragon on 2017/3/12.
 */
var g_nWidth;   //格子的个数 宽 列
var g_nHeight;  //格子的个数 高 行
var g_nMineNum=0;  //雷的个数
var g_nMineIndex=0; //当前雷的个数
var g_ary = new Array();  //二维数组
var g_arrayIsOpen = new Array(); // 是否翻开过雷 0:未翻开 1：翻开 2：不确定是不是雷
var g_sMinePath = "../images/mine.gif";
var g_bMineFlage = 9; //标记为雷
var g_nResidue = 0;// 标记剩余未翻开的数
var g_nMineResidue = 0; //标记雷的个数


function $(id) {
    var ret = typeof id === "string"?document.getElementById(id):id;
    return ret;
}

/**
 * 设置宽度，高度
 * @param id id
 * @param w 宽
 * @param h 高
 */
function frameModel(id,w,h) {
    console.log("[frameModel]id: "+id+" w:"+w+" h:"+h);
    var frameW = w*32 + w*4;
     var frameH = h*32 + h*4;
    $(id).style.width = frameW+"px";  //设置宽度
    $(id).style.height= frameH+"px";
}


/**
 * 初始化（游戏板）
 * @param w 宽度
 * @param h 高度
 */
function init(id,w,h) {
    console.log("[init]id: "+id+" w:"+w+" h:"+h);
    frameModel(id,w,h);

    var frame = $(id);
    for(var i=0;i<h;i++)
    {
        for (var j=0;j<w;j++)
        {
            var oDiv = document.createElement("div"); //创建div
            var divId = i*w+j;
            oDiv.className = "module";  //div类名
            oDiv.id = divId;
            frame.appendChild(oDiv);
        }
    }

    divClick(id);
}

/**
 * 小div绑定事件
 * @param id
 */
function divClick(id) {
    //
    var oDivs = $(id).getElementsByTagName("div");
    console.log("oDivs len: "+oDivs.length);
    for(var i=0;i<oDivs.length;i++)
    {
        oDivs[i].onclick = function () {
            console.log("this.id: "+this.id);  //id是string
            // console.log(typeof this.id);
            var samllDivId = parseInt(this.id);
            var row = parseInt(samllDivId/g_nWidth);
            var col = parseInt(samllDivId%g_nWidth);
            console.log("row: "+row+" col:"+col);
            sweeping(row,col,"false");
        }

        //右击
        oDivs[i].oncontextmenu = function () {
            var samllDivId = parseInt(this.id);
            var row = parseInt(samllDivId/g_nWidth);
            var col = parseInt(samllDivId%g_nWidth);
            console.log("row: "+row+" col:"+col);
            sweeping(row,col,"true");
            return false;
        }
    }

}

/**
 *
 * 翻到0时翻开周围的数字 （递归）
 * @param row 行号
 * @param col 列号
 * @param unsure 标记为不确定
 */
function seek_sweep(row, col) {
    console.log("seek_sweep");
    // TODO：判断是否翻开过，如果翻开过，如果没翻开过，则标记翻开过，计数-1；
    if(g_arrayIsOpen[row][col] ===1)
    {
        return;
    }
    showText(row,col,0);
    g_arrayIsOpen[row][col] = 1;
    g_nResidue--; // 计数-1

    //遍历0 九宫格是否为0或数字
    for ( var i = row-1; i <= row+1; i++)
    {
        for (var j = col-1; j <= col+1; j++)
        {
            if ((i>=0 && i<g_nHeight && j>=0 && j<g_nWidth) && g_arrayIsOpen[i][j] != 1)
            {
                if (i == row && j == col)
                    continue;// 当前位置不考虑
                // g_arrayIsOpen[i][j] = 1;
                // g_nResidue--;
                if (g_ary[i][j] == 0)
                {
                    showText(i,j,0);
                    seek_sweep(i, j);
                }
                else if(g_ary[i][j] != g_bMineFlage)
                {
                    g_arrayIsOpen[i][j] = 1;
                    g_nResidue--;
                    showText(i, j,0);
                }
                else {
                    continue;
                }
            }
        }
    }

    // TODO：计数值等于雷数，游戏胜利
    if (g_nResidue == g_nMineNum) {
            showText(g_bMineFlage,g_bMineFlage,0);
            alert("恭喜你！你赢了！");
    }
}

/**
 * 扫雷
 * @param row 行号
 * @param col 列号
 * @param unsure 标记为不确定
 */
function sweeping(row, col, unsure) {
    console.log("sweeping");
    if (row >= 0 && col >= 0 && row < g_nHeight && col < g_nWidth && g_arrayIsOpen[row][col] != 1) {
        if(unsure == "true") {

            if (g_arrayIsOpen[row][col] === 2) {
                g_arrayIsOpen[row][col] = 0;
                if (g_ary[row][col] === g_bMineFlage) {
                    g_nMineResidue--;
                }
            }
            else {
                g_arrayIsOpen[row][col] = 2;//
                g_nMineResidue++;
                if (g_nMineResidue == g_nMineNum) {
                    showText(g_bMineFlage,g_bMineFlage,0);
                    alert("恭喜你！你赢了！");
                }
                else {
                    showText(row,col,1);
                }
            }

        }
        else {
            if (g_ary[row][col] === g_bMineFlage) {
                // 游戏结束
                showText(g_bMineFlage,g_bMineFlage,0);
                alert("点错了哟！游戏结束！");
            }
            else if (g_ary[row][col] > 0 && g_ary[row][col] < 9) {
                // 显示数字
                g_nResidue --;
                showText(row,col,0);

                // TODO：计数值等于雷数，游戏胜利
                if (g_nResidue == g_nMineNum) {
                    showText(g_bMineFlage,g_bMineFlage,0);
                    alert("恭喜你！你赢了！");
                }
            }
            else if (g_ary[row][col] == 0) {
                seek_sweep(row, col);
            }
        }
    }
}

/**
 * 显示div内容
 * @param id
 * @param row
 * @param col
 * @param type 类型 0：数字 1：标记地雷 2：不确定
 */
function showText(row, col,type) {
    console.log("row: "+row+" col: "+col);
    if(row === g_bMineFlage && col === g_bMineFlage){
        //数组初始化为空
        for(var i =0;i<g_nHeight;i++)
        {
            for(var j=0;j<g_nWidth;j++)
            {
                var id = (i * g_nWidth + j).toString();
                console.log("id: "+id);
                if(g_ary[i][j] === g_bMineFlage)
                {
                    $(id).className = "mine";
                }
                else {
                    $(id).innerText = g_ary[i][j];
                }
            }
        }
    }
    else {
        var id = (row * g_nWidth + col).toString();
        console.log("id: "+id);
        console.log(g_ary[row][col]);
        switch (type)
        {
            case 0:{
                $(id).innerText = g_ary[row][col];
                break;
            }
            case 1:{
                $(id).className= "flag";
                break;
            }
            case 2:{
                $(id).className = "doubt";
                break;
            }
            default: break;
        }


    }
}


window.onload = function () {

    //开始游戏
    $("start").onclick = function () {
        g_nWidth = $("setWidth").value;  //宽度
        g_nHeight = $("setHeight").value;  //高度
        g_nMineNum = $("setMine").value; //雷的个数
        console.log("g_nMineNum: "+g_nMineNum);

        //初始化
        g_nMineIndex=0;
        g_nMineResidue = 0;

        $("set").style.display = "none";
        $("frame").style.display = "block";
        init("frame",g_nWidth,g_nHeight);


        g_nResidue = g_nWidth*g_nHeight;
        //申请二维数组
        g_arrayIsOpen = new Array(g_nHeight);
        g_ary = new Array(g_nHeight)

        for(var i=0;i<g_nHeight;i++)
        {
            g_ary[i] = new Array(g_nWidth);
            g_arrayIsOpen[i] = new Array(g_nWidth);
        }

        //数组初始化为空
        for(var i =0;i<g_nHeight;i++)
        {
            for(var j=0;j<g_nWidth;j++)
            {
                g_ary[i][j]=null;
                g_arrayIsOpen[i][j]=0;
            }
        }

        console.log("g_nMineNum: "+g_nMineNum);
        console.log("g_nMineIndex: "+g_nMineIndex);


        //布雷
        while (g_nMineIndex < g_nMineNum)
        {
            var x = Math.floor(Math.random()*g_nWidth);  //取随机数 列
            var y = Math.floor(Math.random()*g_nHeight); //取随机数 行
            console.log("x: "+x+" y: "+y);
            if(g_ary[y][x] === g_bMineFlage)
            {
                continue;
            }
            g_ary[y][x] = g_bMineFlage;  //标记是雷
            g_nMineIndex++;
            var mineId = y*g_nWidth + x;
            var mineIdStr = mineId.toString();  //数字转为字符
           // console.log(typeof mineIdStr);

           //  $(mineIdStr).className = "mine";
        }

        //填充数字 九宫格
        for(var i =0;i<g_nHeight;i++)
        {
            for(var j=0;j<g_nWidth;j++)
            {
                if(g_ary[i][j] != g_bMineFlage)
                {

                    if((i-1)>=0 && (j-1)>=0 && (i+1)<g_nHeight && (j+1) < g_nWidth)
                    {
                        //填充数字
                        g_ary[i][j] = (g_ary[i-1][j-1] === g_bMineFlage)*(i-1 >= 0)*(j-1 >= 0)    +
                            (g_ary[i-1][j] === g_bMineFlage)*(i-1 >= 0)               +
                            (g_ary[i-1][j+1] === g_bMineFlage) *(i-1 >= 0)*(j+1 < g_nWidth)+
                            (g_ary[i][j-1] === g_bMineFlage)*(j-1 >= 0)               +
                            (g_ary[i][j+1] === g_bMineFlage)*(j+1 < g_nWidth)              +
                            (g_ary[i+1][j-1] === g_bMineFlage)*(j-1 >= 0)             +
                            (g_ary[i+1][j] === g_bMineFlage)*(i+1 < g_nHeight)              +
                            (g_ary[i+1][j+1] === g_bMineFlage)*(i+1 < g_nHeight)*(j+1 < g_nWidth);

                        // var count = 0; //计算几个雷
                        // //上一行
                        // if(g_ary[i-1][j-1] === g_bMineFlage)
                        // {
                        //     count++;
                        // }
                        // if(g_ary[i-1][j] === g_bMineFlage)
                        // {
                        //     count++;
                        // }
                        // if(g_ary[i-1][j+1] === g_bMineFlage)
                        // {
                        //     count++;
                        // }
                        //
                        // //当前行
                        // if(g_ary[i][j-1] === g_bMineFlage)
                        // {
                        //     count++;
                        // }
                        // if(g_ary[i][j+1] === g_bMineFlage)
                        // {
                        //     count++;
                        // }
                        //
                        // //下一行
                        // if(g_ary[i+1][j-1] === g_bMineFlage)
                        // {
                        //     count++;
                        // }
                        // if(g_ary[i+1][j] === g_bMineFlage)
                        // {
                        //     count++;
                        // }
                        // if(g_ary[i+1][j+1] === g_bMineFlage)
                        // {
                        //     count++;
                        // }
                        // g_ary[i][j] = count;

                    }
                    else{
                        //最外层
                        if(i==0 && j>0 && j+1< g_nWidth)
                        {
                            //填充数字
                            g_ary[i][j] = (g_ary[i][j-1] === g_bMineFlage)       +
                                (g_ary[i][j+1] === g_bMineFlage)              +
                                (g_ary[i+1][j-1] === g_bMineFlage)          +
                                (g_ary[i+1][j] === g_bMineFlage)             +
                                (g_ary[i+1][j+1] === g_bMineFlage);
                        }
                        else if(i==g_nHeight-1 && j>0 && j+1< g_nWidth){
                            //填充数字
                            g_ary[i][j] = (g_ary[i-1][j-1] === g_bMineFlage)   +
                                (g_ary[i-1][j] === g_bMineFlage)     +
                                (g_ary[i-1][j+1] === g_bMineFlage) +
                                (g_ary[i][j-1] === g_bMineFlage)       +
                                (g_ary[i][j+1] === g_bMineFlage);
                        }
                        else  if(j==0 && i>0 && i+1< g_nHeight)
                        {
                            //填充数字
                            g_ary[i][j] =
                                (g_ary[i-1][j] === g_bMineFlage)     +
                                (g_ary[i-1][j+1] === g_bMineFlage) +
                                (g_ary[i][j+1] === g_bMineFlage)              +
                                (g_ary[i+1][j] === g_bMineFlage)             +
                                (g_ary[i+1][j+1] === g_bMineFlage);
                        }
                        else  if(j==g_nWidth-1 && i>0 && i+1< g_nHeight)
                        {
                            //填充数字
                            g_ary[i][j] = (g_ary[i-1][j-1] === g_bMineFlage)   +
                                (g_ary[i-1][j] === g_bMineFlage)     +
                                (g_ary[i][j-1] === g_bMineFlage)       +
                                (g_ary[i+1][j-1] === g_bMineFlage)          +
                                (g_ary[i+1][j] === g_bMineFlage);
                        }
                        else if(i==0 && j==0)
                        {
                            g_ary[i][j] = (g_ary[i][j+1] === g_bMineFlage) +
                                (g_ary[i+1][j] === g_bMineFlage) +
                                (g_ary[i+1][j+1] === g_bMineFlage);
                        }
                        else if(i==0 && j==g_nWidth-1)
                        {
                            g_ary[i][j] = (g_ary[i][j-1] === g_bMineFlage) +
                                (g_ary[i+1][j-1] === g_bMineFlage) +
                                (g_ary[i+1][j] === g_bMineFlage);
                        }
                        else if(i==g_nHeight-1 && j==0)
                        {
                            g_ary[i][j] = (g_ary[i-1][j] === g_bMineFlage) +
                                (g_ary[i-1][j+1] === g_bMineFlage) +
                                (g_ary[i][j+1] === g_bMineFlage);
                        }
                        else if(i==g_nHeight-1 && j==g_nWidth-1)
                        {
                            g_ary[i][j] = (g_ary[i-1][j-1] === g_bMineFlage) +
                                (g_ary[i-1][j] === g_bMineFlage) +
                                (g_ary[i][j-1] === g_bMineFlage);
                        }
                    }
                    var mineId = i*g_nWidth + j;
                    var mineIdStr = mineId.toString();  //数字转为字符
                   // console.log(g_ary[i][j]);
                   //  $(mineIdStr).innerText = g_ary[i][j];
                }
            }
        }

    }










}

