<template>
  <div>
    <div class="goods">
      <van-nav-bar left-arrow @click-left="onClickLeft" title="商品详情"/>
      <cross-line></cross-line>
      <img :src="'http://127.0.0.1:8081/'+this.SaleData.saleProductPicture" style="width: 375px;height: 375px">

      <van-cell-group class="goods-cell-group">
        <van-cell>
          <div class="goods-title">{{ this.SaleData.saleProductName }}</div>
          <div class="goods-describe">{{ this.SaleData.saleProductDescribe }}</div>
          <div class="goods-price">{{ formatPrice(this.SaleData.saleProductPrice) }}</div>
          <span class="type fr" v-if="this.SaleData.type==0">消费级</span>
          <span class="type fr" v-if="this.SaleData.type==1">专业级</span>
        </van-cell>

        <div class="box fl">
          <img :src="'http://127.0.0.1:8081/'+this.SaleData.header" style="width: 50px;height: 50px"/>
          <p style="padding-left: 10px">{{this.SaleData.alias}}</p>
        </div>
      </van-cell-group>
    </div>

    <cross-line></cross-line>

    <div class="goods">
    <p class="liuyan"><b>留言</b></p>
    <p v-if="saleMessage==''"  style="padding-top:20px;font-size: 16px;text-align: center;">暂无留言！快来添加留言吧~</p>
    <van-cell-group v-if="saleMessage!=null" class="goods-cell-group" v-for="item in saleMessage" :item= "item" :key="item">
      <van-cell>
        <div class="box fl">
          <img :src="'http://127.0.0.1:8081/'+item.header" style="width: 30px;height: 30px">
          <p style="padding-left: 10px"><b>{{item.personName}}</b></p>
        </div>
        <div style="padding-top: 40px;padding-left: 50px">
          {{item.message}}
          <p style="color: gray">{{item.messageTimeStr}}</p>
        </div>
      </van-cell>
      <van-cell style="padding-left: 60px" v-if="item.replyPersonName != null">
        <div class="box fl">
          <img :src="'http://127.0.0.1:8081/'+item.replyHeader" style="width: 30px;height: 30px">
          <p style="padding-left: 10px"><b>{{item.replyPersonName}}</b></p>
        </div>
        <div style="padding-top: 40px;padding-left: 50px">
          {{item.replyMessage}}
          <p style="color: gray">{{item.replyTimeStr}}</p>
        </div>
      </van-cell>
    </van-cell-group>

      <van-goods-action>
        <van-goods-action-mini-btn icon="chat" @click="toMessage">
          留言
        </van-goods-action-mini-btn>
        <van-goods-action-mini-btn :icon=icon @click="collect">
          收藏
        </van-goods-action-mini-btn>
        <van-goods-action-big-btn primary @click="toOrderPaying">
          立即下单
        </van-goods-action-big-btn>
      </van-goods-action>
    <van-dialog v-model="show"
                show-cancel-button
                :before-close="beforeClose">
      <van-field
        v-model="message"
        label="留言"
        placeholder="请输入留言"
      />
    </van-dialog>
    </div>
    </div>
</template>

<script>
  import CrossLine from "@/components/base/cross-line/cross-line"
  import { Toast } from 'vant';
export default {
  components: {
    CrossLine
  },
  data () {
    return {
      icon: "like-o",
      SaleData:{},
      userInfo:{},
      show:false,
      message:"",
      messageDto:{},
      saleMessage:[]
    }
  },
  methods: {
    toMessage(){
      if (this.userInfo == null){
        Toast("请先登录哦！")
      } else {
        this.show = true;
      }
    },
    beforeClose(action,done){
      if (action === 'confirm') {
        if (this.message != "") {
          this.messageDto.productId = this.SaleData.id;
          this.messageDto.personId = this.userInfo.id;
          this.messageDto.message = this.message;
          var that = this;
          this.$axios.post(this.global.ip + "/sale/insertSaleMessage", this.messageDto)
            .then(function (result) {
              if (result.data.status != false) {
                Toast("留言成功！")
                that.$axios.get(that.global.ip+"/sale/getSaleMessage/"+that.SaleData.id)
                  .then(function (MessageResult) {
                    if(MessageResult.data.status != false) {
                      that.saleMessage = MessageResult.data.data;
                    }else {
                      Toast(MessageResult.data.message)
                    }
                  })
                  .catch(function (error) {
                    console.log(error)
                  });
              } else {
                Toast(result.data.message);
              }
            })
            .catch(function (error) {
              console.log(error)
            });
          done();
        } else {
          Toast("留言不能为空哦！")
          done();
        }
      }else {
        done();
      }
    },
    toOrderPaying(){
      if (this.userInfo == null) {
        this.$router.push({path: '/login'});
        Toast("请先登录");
      }else {
        this.$router.push({
          path: 'saleToBuy',
          query: {
            SaleData: this.SaleData
          }
        })
      }
    },
    collect(){
      if (this.userInfo == null) {
        this.$router.push({path: '/login'});
        Toast("请先登录");
      } else {
        var that = this
        if (that.SaleData.collectFlag) {
          this.$axios.delete(this.global.ip+"/collect/deleteCollectSale/" + that.userInfo.id + "/" + this.SaleData.id)
            .then(function (result) {
              if (result.data.status != false) {
                that.SaleData.collectFlag = false
              }
            })
            .catch(function (error) {
              console.log(error)
            });
        } else {
          this.$axios.post(this.global.ip+"/collect/insertCollectSale/" + that.userInfo.id + "/" + this.SaleData.id)
            .then(function (result) {
              if (result.data.status != false) {
                that.SaleData.collectFlag = true
              }
            })
            .catch(function (error) {
              console.log(error)
            });
        }
        if (!this.SaleData.collectFlag) {
          this.icon = "like"
        } else {
          this.icon = "like-o"
        }
      }
    },
    onClickLeft(){
      this.$router.go(-1)
    },
    formatPrice() {
      return '¥' + (this.SaleData.saleProductPrice).toFixed(2);
    }
  },
  created () {
    var storage = window.sessionStorage;
    var userInfo = JSON.parse(storage.getItem("session"));
    this.userInfo = userInfo;

    var id;
    if (this.userInfo == null){
      id=0;
    } else {
      id=this.userInfo.id
    }

    // 取到路由带过来的参数
    let routerParams = this.$route.query.data;
    var that = this;
    this.$axios.get(this.global.ip+"/sale/getSaleDetailInfo/"+routerParams+"/"+id)
      .then(function (SaleResult) {
        that.SaleData = SaleResult.data.data;
        if (that.SaleData.collectFlag){
          that.icon = "like"
        } else {
          that.icon = "like-o"
        }
      })
      .catch(function (error) {
        console.log(error)
      });

    this.$axios.get(this.global.ip+"/sale/getSaleMessage/"+routerParams)
      .then(function (MessageResult) {
        if(MessageResult.data.status != false) {
          that.saleMessage = MessageResult.data.data;
        }else {
          Toast(MessageResult.data.message)
        }
      })
      .catch(function (error) {
        console.log(error)
      });
  }
}
</script>

<style lang="less" scoped>
  .type{
    color: gray;
    font-size: 14px;
  }
  .liuyan{
    padding-top: 10px;
    padding-left: 5px;
    font-size: 20px;
    color: gray;
  }
  .box{
    display:flex;
    align-items: center;//子元素垂直居中
    justify-content: center;//子元素水平居中
    padding-top: 10px;
  }
  .box img{
    padding-left: 10px;
  }
.goods {
  padding-bottom: 50px;
  &-title {
    font-size: 16px;
  }
  &-describe{
    font-size: 10px;
    color: gray;
  }
  &-price {
    color: #f44;
  }
  &-express {
    color: #999;
    font-size: 12px;
    padding: 5px 15px;
  }
  &-cell-group {
    margin: 15px 0;
    .van-cell__value {
      color: #999;
    }
  }
}
</style>
