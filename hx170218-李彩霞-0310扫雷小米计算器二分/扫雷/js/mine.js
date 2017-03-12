
var g_nWidth;   //格子的个数 宽 列
var g_nHeight;  //格子的个数 高 行
var g_nMineNum=0;  //雷的个数
var g_nMineIndex=0; //当前雷的个数
var g_ary = new Array(g_nHeight);  //二维数组
var g_sMinePath = "../images/mine.gif";
var g_bMineFlage = 9; //标记为雷

/**
 * Created by dragon on 2017/3/12.
 */
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
 * @param id id
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
}

/**
 * 初始化（游戏板）
 * @param row 行号
 * @param col 列号
 * @param unsure 标记为不确定
 */
function sweeping(row, col, unsure) {
    if (row >= 0 && col >= 0 && row+1 < g_nHeight && col+1 < g_nWidth) {
        if(unsure === "true") {
            // 当前位置标记为不确定

            // 先判断当前位置是否标记过，如果是则取消标记，否则添加标记（插根旗帜）

        }
        else {
            if (g_ary[row][col] === g_bMineFlage) {
                // 游戏结束
            }
            else if (g_ary[row][col] > 0 && g_ary[row][col] < 9) {
                // 显示数字
            }
            else if (g_ary[row][col] == 0) {
                sweeping();
            }
        }
    }
}


window.onload = function () {
    // var g_nWidth;   //格子的个数 宽 列
    // var g_nHeight;  //格子的个数 高 行
    // var g_nMineNum=0;  //雷的个数
    // var g_nMineIndex=0; //当前雷的个数
    // var g_ary = new Array(g_nHeight);  //二维数组
    // var g_sMinePath = "../images/mine.gif";
    // var g_bMineFlage = true; //标记为雷

    //开始游戏
    $("start").onclick = function () {
        g_nWidth = $("setWidth").value;  //宽度
        g_nHeight = $("setHeight").value;  //高度
        g_nMineNum = $("setMine").value; //雷的个数
        console.log("g_nMineNum: "+g_nMineNum);
        g_nMineIndex=0;

        $("set").style.display = "none";
        $("frame").style.display = "block";
        init("frame",g_nWidth,g_nHeight);



        //申请二维数组
        for(var i=0;i<g_nHeight;i++)
        {
            g_ary[i] = new Array(g_nWidth);
        }

        //数组初始化为空
        for(var i =0;i<g_nHeight;i++)
        {
            for(var j=0;j<g_nWidth;j++)
            {
                g_ary[i][j]=null;
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
            if(g_ary[y][x] === g_sMinePath)
            {
                continue;
            }
            g_ary[y][x] = g_bMineFlage;  //标记是雷
            g_nMineIndex++;
            var mineId = y*g_nWidth + x;
            var mineIdStr = mineId.toString();  //数字转为字符
            console.log(typeof mineIdStr);
            $(mineIdStr).className = "mine";
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
                    console.log(g_ary[i][j]);
                    $(mineIdStr).innerText = g_ary[i][j];
                }
            }
        }


    }





}

