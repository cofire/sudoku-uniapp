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
        <text>{{time}}</text>
      </view>
    </view>
    <view class="detail">
      <view class="grid">
        <div v-for="(xs, x) in sudoku" :key="xs.id" class="row">
          <div v-for="(ys,y) in xs" :key="ys.id" :class="dealClass(x,y,ys)" @click="tapGrid(x,y,ys)">
            <text v-if="ys.marks.length == 0"> {{ ys.value==0?"":ys.value }}</text>
            <text v-if="ys.marks.length > 0 && ys.value>0"> {{ys.value }}</text>
            <view class="marks" v-else>
              <div v-for="(markx,indexx) in [0,1,2]" :key="markx.id" class="mark-row">
                <div v-for="(marky,indexy) in [0,1,2]" :key="marky.id" class="mark-col">
                  {{ ys.marks[markx*3+marky] == markx*3+marky +1? markx*3+marky +1: "" }}
                </div>
              </div>
            </view>
          </div>
        </div>
      </view>

    </view>
    <view class="operation-bar">
      <view class="operation-list">
        <view class="operation">
          <view class="icon">
            <image src="../../static/icon/undo.png" mode="aspectFill"></image>
          </view>
          <p>撤销</p>
        </view>
        <view class="operation" @click="erase()">
          <view class="icon">
            <image v-show="!operations.erase.disabled" src="../../static/icon/erase.png" mode="aspectFill"></image>
            <image v-show="operations.erase.disabled" src="../../static/icon/erase_disabled.png" mode="aspectFill"></image>
          </view>
          <p>删除</p>
        </view>
        <view :class="operations.mark.selected? 'operation selected': 'operation'" @click="handleOperation()">
          <view class="icon">
            <image v-show="!operations.mark.disabled" src="../../static/icon/mark.png" mode="aspectFill"></image>
            <image v-show="operations.mark.disabled" src="../../static/icon/mark_disabled.png" mode="aspectFill"></image>
          </view>
          <p>标记</p>
        </view>
        <view class="operation">
          <view class="icon">
            <image src="../../static/icon/save.png" mode="aspectFill"></image>
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
  import {
    SudokuGame
  } from './sudoku.js';
  export default {
    data() {
      return {
        startTime: "",
        time: "00:00",
        levelList: [{
          value: '2',
          lable: '初级'
        }, {
          value: '3',
          lable: '中级'
        }, {
          value: '4',
          lable: '高级'
        }, {
          value: '5',
          lable: '骨灰级'
        }],
        sudoku: [],
        levelIndex: 0,
        nums: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        preSelected: {
          x: 0,
          y: 0,
          grid: {}
        },
        gridSelected: {},
        timer: "",
        operations: {
          undo: {
            selected: false,
            disabled: false
          },
          erase: {
            selected: false,
            disabled: false
          },
          mark: {
            selected: false,
            disabled: false
          },
          save: {
            selected: false,
            disabled: false
          },
        }
      }
    },
    methods: {
      async loadData() {
        this.levelList = await this.$json('levelList');
        this.sudoku = await this.$json("sudoku");
      },
      levelChange(e) {
        this.levelIndex = e.detail.value;
        this.sudoku = new SudokuGame(this.levelList[this.levelIndex].value).sudoku;
        this.startTime = new Date();
        this.settime();
      },
      dealClass(x, y, grid) {
        let gridClass = 'col row-' + (x + 1) + ' col-' + (y + 1) + " " + grid.type;
        if (grid.numClass != undefined || grid.numClass != null) {
          gridClass += " " + grid.numClass;
        }
        return gridClass;
      },
      erase() {
        if (this.gridSelected.type == "new") {
          this.gridSelected.value = 0;
          this.operations.mark.disabled = false;
        }
      },
      handleOperation() {
        this.operations.mark.selected = !this.operations.mark.selected;
      },
      /**选中格子**/
      tapGrid(x, y, grid) {
        this.gridSelected = grid;
        if (this.gridSelected.type == "old") {
          this.operations.erase.disabled = true;
          this.operations.mark.disabled = true;
        } else {
          this.operations.erase.disabled = false;
          this.operations.mark.disabled = false;
        }
        this.initClass();
        this.addClass(x, y, grid);
      },
      initClass() {
        for (var i = 0; i <= 8; i++) {
          for (var j = 0; j <= 8; j++) {
            this.sudoku[i][j].numClass = "";
          }
        }
      },
      addClass(x, y, grid) {
        for (var i = 0; i <= 8; i++) {
          this.sudoku[x][i].numClass = "peers";
          this.sudoku[i][y].numClass = "peers";
        }
        for (var i = parseInt(x / 3) * 3; i < parseInt(x / 3) * 3 + 3; i++) {
          for (var j = parseInt(y / 3) * 3; j < parseInt(y / 3) * 3 + 3; j++) {
            this.sudoku[i][j].numClass = "peers";
          }
        }
        for (var i = 0; i <= 8; i++) {
          for (var j = 0; j <= 8; j++) {
            if (grid.value == this.sudoku[i][j].value)
              this.sudoku[i][j].numClass += " same";
          }
        }
        grid.numClass = "selected";
      },

      /**填写数字**/
      fillNum(num) {
        if (this.gridSelected.type == "old") {
          return;
        }
        if (!this.operations.mark.selected) {
          this.gridSelected.value = num;
          this.operations.mark.disabled = true;
          if (this.isCompleted()) {
            clearTimeout(this.timer);
            this.$msg("恭喜您完成");
          }
          return;
        }
        if (this.gridSelected.marks[num - 1] == num) {
          this.gridSelected.marks[num - 1] = 0;
        } else {
          this.gridSelected.marks[num - 1] = num;
        }

        this.$forceUpdate();
      },
      reStart() {
        let that = this;
        uni.showModal({
          title: '提示',
          content: '是否重新开始游戏',
          success: function(res) {
            if (res.confirm) {
              for (var i = 0; i <= 8; i++) {
                for (var j = 0; j <= 8; j++) {
                  if (that.sudoku[i][j].type == "new") {
                    that.sudoku[i][j].value = 0;
                    that.sudoku[i][j].marks = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                  }
                }
              }
              that.gridSelected = {};
              that.initClass();
              that.startTime = new Date();
              that.settime();
            } else if (res.cancel) {
              return;
            }
          }
        });
      },
      isCompleted() {
        let sum = 0;
        for (let i = 0; i < 9; i++) {
          sum = 0;
          for (let j = 0; j < 9; j++) {
            sum += this.sudoku[i][j].value;
          }
          if (sum == 45) {
            continue;
          } else {
            return false;
          }
        }
        for (let i = 0; i < 9; i++) {
          sum = 0;
          for (let j = 0; j < 9; j++) {
            sum += this.sudoku[j][i].value;
          }
          if (sum == 45) {
            continue;
          } else {
            return false;
          }
        }
        for (let i = 0; i < 9; i = i + 3) {
          for (let j = 0; j < 9; j = j + 3) {
            sum = 0;
            sum += this.sudoku[i][j].value + this.sudoku[i + 1][j].value + this.sudoku[i + 2][j].value;
            sum += this.sudoku[i][j + 1].value + this.sudoku[i + 1][j + 1].value + this.sudoku[i + 2][j + 1].value;
            sum += this.sudoku[i][j + 2].value + this.sudoku[i + 1][j + 2].value + this.sudoku[i + 2][j + 2].value;
            if (sum == 45) {
              continue;
            } else {
              return false;
            }
          }
        }
        return true;
      },
      settime() {
        let that = this;
        //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
        var dateEnd = new Date(); //获取当前时间
        var dateDiff = dateEnd.getTime() - this.startTime; //时间差的毫秒数
        var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
        if (dateDiff < 10) {
          dateDiff = "0" + dateDiff;
        }
        var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
        if (hours < 10) {
          hours = "0" + hours;
        }
        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        //计算相差秒数
        var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000);
        if (seconds < 10) {
          seconds = "0" + seconds;
        }
        var timeFn = dayDiff + ": " + hours + ": " + minutes + " :" + seconds;
        this.time = timeFn;
        this.timer = setTimeout(function() {
          that.settime();
        }, 1000)
      }
    },
    onLoad() {
      this.sudoku = new SudokuGame(2).sudoku;
      this.startTime = new Date();
      this.settime();
    }
  }
</script>

<style lang="scss" scoped>
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
      color: #4399FC;
    }

    .peers {
      background-color: #a1ffbf;
    }

    .selected {
      color: #FFFFFF;
      background-color: #4CD964;
    }

    .same {
      color: #F0AD4E;
    }

    .marks {
      width: 76rpx;
      height: 76rpx;

      .mark-row {
        height: 25rpx;

        .mark-col {
          float: left;
          width: 25rpx;
          height: 25rpx;
          line-height: 25rpx;
          font-size: 10rpx;
        }
      }
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
        padding: 10rpx;

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

      .selected {
        background-color: #DCDFE6;
      }
    }

    .nums {
      text-align: center;
      font-size: 76rpx;
      font-weight: 400;
      color: #333333;

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
