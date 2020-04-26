<template>
  <view class="content">
    <view class="header">
      <view class="item" @click="reStart()">
        <text>重新开始</text>
      </view>
      <view class="item">
        <picker @change="levelChange" :value="levelIndex" :range="levelList" range-key="lable">
          <view class="uni-input">{{levelList[levelIndex].lable}} <span class="icon">▼</span></view>
        </picker>
      </view>
      <view class="item">
        <text>1:19:12</text>
      </view>
    </view>
    <view class="detail">
      <view class="grid">
        <div v-for="(xs, x) in sudoku" :key="xs.id" class="row">
          <div v-for="(ys,y) in xs" :key="ys.id" :class="dealClass(x,y,ys)" @click="tapGrid(x,y,ys)">
            {{ ys.value==0?"":ys.value }}
          </div>
        </div>
      </view>

    </view>
    <view class="operation-bar">
      <view class="operation-list">
        <view class="operation">
          <view class="icon">
            <image src="../../static/icon/undo.png" mode=""></image>
          </view>
          <p>撤销</p>
        </view>
        <view class="operation" @click="erase()">
          <view class="icon">
            <image src="../../static/icon/erase.png" mode=""></image>
          </view>
          <p>删除</p>
        </view>
        <view class="operation">
          <view class="icon">
            <image src="../../static/icon/mark.png" mode=""></image>
          </view>
          <p>标记</p>
        </view>
        <view class="operation">
          <view class="icon">
            <image src="../../static/icon/save.png" mode=""></image>
          </view>
          <p>暂存</p>
        </view>
      </view>
      <view class="nums">
        <text v-for="num in nums" :key="num" class="num" @click="fillNum(num)">{{num}}</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        levelList: [{
          value: 'easy',
          lable: '入门级'
        }],
        sudoku: [],
        levelIndex: 0,
        nums: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        preSelected:{x:0,y:0,grid:{}},
        gridSelected: {}
      }
    },
    methods: {
      async loadData() {
        this.levelList = await this.$json('levelList');
        this.sudoku = await this.$json("sudoku");
      },
      dealClass(x, y, grid) {
        let gridClass = 'col row-' + (x + 1) + ' col-' + (y + 1) + " " + grid.type;
        if(grid.numClass != undefined || grid.numClass != null){
          gridClass += " "+grid.numClass;
        }
        return gridClass;
      },
      erase() {
        if(this.gridSelected.type == "new"){
          this.gridSelected.value = 0;
        }
      },
      /**选中格子**/
      tapGrid(x,y,grid) {
        console.log(this.gridSelected == grid)
        this.gridSelected = grid;
        console.log(this.gridSelected);
        this.initClass();
        this.addClass(x,y,grid);
        console.log(this.sudoku);
      },
      initClass(){
        for(var i=0;i<=8;i++){
          for(var j=0;j<=8;j++){
            this.sudoku[i][j].numClass = "";
          }
        }
      },
      addClass(x,y,grid){
        for(var i=0;i<=8;i++){
          this.sudoku[x][i].numClass = "peers";
          this.sudoku[i][y].numClass = "peers";
        }
        for(var i=parseInt(x/3)*3;i<parseInt(x/3)*3+3;i++){
          for(var j=parseInt(y/3)*3;j<parseInt(y/3)*3+3;j++){
            this.sudoku[i][j].numClass = "peers";
          }
        }
        for(var i=0;i<=8;i++){
          for(var j=0;j<=8;j++){
            if(grid.value == this.sudoku[i][j].value)
            this.sudoku[i][j].numClass += " same";
          }
        }
        grid.numClass = "selected"; 
      },
      
      /**填写数字**/
      fillNum(num) {
        console.log(num);
        this.gridSelected.value = num;
      },
      reStart(){
        for(var i=0;i<=8;i++){
          for(var j=0;j<=8;j++){
            if(this.sudoku[i][j].type == "new"){
              this.sudoku[i][j].value= 0;
            }
          }
        }
        this.gridSelected = {};
        this.initClass();
      }
      
      
    },
    onShow() {
      this.loadData();
    }
  }
</script>

<style lang="scss">
  page,
  .conten {
    width: 100%;
    height: 100%;
  }

  .header {
    height: 100rpx;

    .item {
      float: left;
      width: 33%;
      text-align: center;
      height: 100%;
      line-height: 100rpx;
      font-size: 32rpx;

      picker {}
    }
  }

  .detail {
    height: 750rpx;
  }

  .grid {
    width: 710rpx;
    height: 710rpx;
    margin: 0 auto;
    // margin-top: 40rpx;
    border: 4rpx solid #000000;
    text-align: center;

    .row {
      .col {
        float: left;
        width: 76rpx;
        height: 76rpx;
        line-height: 76rpx;
        border: 2rpx solid #E0E0E0;
      }

      .col-3,
      .col-6,
      .col-9 {
        border-right: 2rpx solid #303133;
      }

      .row-3,
      .row-6,
      .row-9 {
        border-bottom: 2rpx solid #303133;
      }
    }

    .new {
      color: #4CD964;
    }
    
    .peers{
      background-color: #a1ffbf;
    }
    
    .selected{
      color: #FFFFFF;
      background-color: #4CD964;
    }
    
    .same{
      color: #F0AD4E;
    }
  }

  .operation-bar {
    height: 150rpx;

    .operation-list {
      width: 92%;
      margin: 0 auto;
      font-size: 28rpx;

      .operation {
        float: left;
        width: 25%;
        text-align: center;

        .icon {
          width: 50rpx;
          height: 50rpx;
          margin: 0 auto;
          margin-bottom: 10rpx;

          image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .nums {
      text-align: center;
      font-size: 76rpx;
      font-weight: 400;
      color: #909399;

      .num {
        display: inline-block;
        width: 80rpx;
        height: 120rpx;
        line-height: 120rpx;
      }

      .num-choose {
        color: #333333;
      }
    }
  }
</style>
