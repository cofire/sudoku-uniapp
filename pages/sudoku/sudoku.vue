<template>
  <view class="content">
    <view class="header">
      <view class="item">
        <picker @change="levelChange" :value="levelIndex" :range="levelList" range-key="lable">
          <view class="uni-input">{{levelList[levelIndex].lable}} <span class="icon">▼</span></view>
        </picker>
      </view>
      <view class="item">
        <text>计时器：</text>
        <text>1:19:12</text>
      </view>
    </view>
    <view class="detail">
      <view class="grid">
        <div v-for="x in nums" :key="x.id" class="row">
          <div v-for="y in nums" :key="y.id" :class="true?'col row-'+x + ' col-'+y:''">
            {{ y }}
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
        <view class="operation">
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
        levelIndex: 0,
        nums: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        numChoose: 5
      }
    },
    methods: {
      /**填写数字**/
      fillNum(num) {
        console.log(num);
      }
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
      width: 50%;
      text-align: left;
      height: 100%;
      line-height: 100rpx;
      padding-left: 50rpx;
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
