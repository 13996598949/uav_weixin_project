<template>
  <van-pull-refresh v-model="isLoading" @refresh="onRefresh" style="height: 100%">
  <div style="height: 100%">
    <van-nav-bar left-arrow @click-left="onClickLeft" title="我发布的"/>
    <cross-line></cross-line>

    <div class="title-bar">
      <span>租赁区</span>
    </div>
    <div v-if="publishRentData==''">
      <span style="font-size: 14px;text-align: center;padding-top: 30px">暂未在租赁区发布过产品哦~快去发布吧！</span>
      <div class="bottomFix"></div>
    </div>
    <div v-if="publishRentData!=''">
    <div class="seller-list-item" v-for="item in publishRentData" :item= "item" :key="item">
      <div class="left" @click="toAdminRentDetail(item.id)">
        <img :src="'http://127.0.0.1:8081/'+item.rentProductPicture">
      </div>

      <div class="content">
        <div class="name" @click="toAdminRentDetail(item.id)">
          {{item.rentProductName}}
        </div>

        <div class="mid">
          <span class="describe">{{item.rentProductDescribe}}</span>
        </div>

        <div>
          <span class="price fl"><b>￥{{item.rentProductPrice}}/天</b></span>
          <div class="fr">
            <van-button size="small" @click="toEditRentMyPublish(item.id)">编辑</van-button>
            <van-button size="small" @click="toDeleteRentMyPublish(item.id)">删除</van-button>
          </div>
        </div>
      </div>
    </div>
    </div>

    <div class="title-bar">
      <span>出售区</span>
    </div>
    <div v-if="publishSaleData==''">
      <span style="font-size: 14px;text-align: center;padding-top: 30px">暂未在出售区发布过产品哦~快去发布吧！</span>
      <div class="bottomFix"></div>
    </div>
    <div v-if="publishSaleData!=''">
    <div class="seller-list-item" v-for="item in publishSaleData" :item= "item" :key="item">
      <div class="left" @click="toAdminSaleDetail(item.id)">
        <img :src="'http://127.0.0.1:8081/'+item.saleProductPicture">
      </div>

      <div class="content">
        <div class="name" @click="toAdminSaleDetail(item.id)">
          {{item.saleProductName}}
        </div>

        <div class="mid">
          <span class="describe">{{item.saleProductDescribe}}</span>
        </div>

        <div>
         <span class="price fl"><b>￥{{item.saleProductPrice}}</b></span>
          <div class="fr">
            <van-button size="small" @click="toEditSaleMyPublish(item.id)">编辑</van-button>
            <van-button size="small" @click="toDeleteSaleMyPublish(item.id)">删除</van-button>
          </div>
       </div>
      </div>
    </div>

    </div>
  </div>
  </van-pull-refresh>
</template>

<script>
  import CrossLine from "@/components/base/cross-line/cross-line"
  import { Toast } from 'vant';
  import { Dialog } from 'vant';

  export default {
    components: {
      CrossLine
    },
    data () {
      return {
        isLoading: false,
        userInfo:{},
        publishRentData:[],
        publishSaleData:[],
      }
    },
    props: {
      item:{
        type:Object,
        default:{}
      }
    },
    methods:{
      toAdminRentDetail(id){
        this.$router.push({
          path:'rentAdminDetailInfo',
          query: {
            data: id
          }
        })
      },
      toAdminSaleDetail(id){
        this.$router.push({
          path:'saleAdminDetailInfo',
          query: {
            data: id
          }
        })
      },
      toDeleteRentMyPublish(id){
        Dialog.confirm({
          title: '提示',
          message: '确认要删除吗？'
        }).then(() => {
          var that = this;
          this.$axios.delete(this.global.ip+"/rent/deleteMyPublishRent/"+id)
            .then(function (RentResult) {
              if (RentResult.data.status){
                Toast("删除成功!");
                that.$axios.get(that.global.ip+"/rent/getMyPublishRent/"+that.userInfo.id)
                  .then(function (RentResult) {
                    that.publishRentData = RentResult.data.data;
                  })
                  .catch(function (error) {
                    console.log(error)
                  });
              } else {
                Toast("删除失败!");
              }
            })
            .catch(function (error) {
              console.log(error)
            });
        }).catch(() => {

        });
      },
      toEditRentMyPublish(id){
        this.$router.push({
          path:'rentEdit',
          query: {
            data: id
          }
        })
      },
      toDeleteSaleMyPublish(id){
        Dialog.confirm({
          title: '提示',
          message: '确认要删除吗？'
        }).then(() => {
          var that = this;
          this.$axios.delete(this.global.ip+"/sale/deleteMyPublishSale/"+id)
            .then(function (SaleResult) {
              if (SaleResult.data.status){
                Toast("删除成功!");
                that.$axios.get(that.global.ip+"/sale/getMyPublishSale/"+that.userInfo.id)
                  .then(function (SaleResult) {
                    that.publishSaleData = SaleResult.data.data;
                  })
                  .catch(function (error) {
                    console.log(error)
                  });
              } else {
                Toast("删除失败!");
              }
            })
            .catch(function (error) {
              console.log(error)
            });
        }).catch(() => {

        });
      },
      toEditSaleMyPublish(id){
        this.$router.push({
          path:'saleEdit',
          query: {
            data: id
          }
        })
      },
      onClickLeft(){
        this.$router.push({path:"/mine"})
      },
      onRefresh() {
        setTimeout(() => {
          var that = this;
          this.$axios.get(this.global.ip+"/rent/getMyPublishRent/"+this.userInfo.id)
            .then(function (RentResult) {
              that.publishRentData = RentResult.data.data;
            })
            .catch(function (error) {
              console.log(error)
            });

          this.$axios.get(this.global.ip+"/sale/getMyPublishSale/"+this.userInfo.id)
            .then(function (SaleResult) {
              that.publishSaleData = SaleResult.data.data;
            })
            .catch(function (error) {
              console.log(error)
            });
          this.$toast('刷新成功');
          this.isLoading = false;
        }, 500);
      }
    },
    created(){
      var storage = window.sessionStorage;
      var userInfo = JSON.parse(storage.getItem("session"));
      this.userInfo = userInfo;

      var that = this;
      this.$axios.get(this.global.ip+"/rent/getMyPublishRent/"+this.userInfo.id)
        .then(function (RentResult) {
          that.publishRentData = RentResult.data.data;
        })
        .catch(function (error) {
          console.log(error)
        });

      this.$axios.get(this.global.ip+"/sale/getMyPublishSale/"+this.userInfo.id)
        .then(function (SaleResult) {
          that.publishSaleData = SaleResult.data.data;
        })
        .catch(function (error) {
          console.log(error)
        });
    }
  }
</script>

<style scoped>
  .seller-list-item {
    margin-bottom: 5px;
    display: flex;
    flex-direction: row;
    padding: 12.5px 0 12.5px 0;
    overflow: hidden;
    margin-left:10px;
    border-bottom: solid 1px #eee;
  }
  /*左侧图片*/
  .left {
    position: relative;
    flex: 0 0 86px;
    width: 86px;
  }
  .left span {
    display: inline-block;
    text-align: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 28px;
    height: 14px;
    line-height: 14px;
    font-size: 12px;
    color: white;
  }
  .left img {
    border:solid 1px #e4e4e4;
    display: block;
    width: 84px;
    height: 63px;
    margin: 0 auto;
  }

  /*右侧内容*/
  .content {
    /*background-color: red;*/
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 15px 0 10px;
  }
  .content .name {
    font-size: 17px;
    color: #333;
    overflow: hidden;
    font-weight: bold;
    overflow: hidden;
  }

  .content .mid {
    flex: 1;
    margin-top: 7px;
    color: #666;
    font-size: 12px;
  }
  .content img{
    width: 20px;
    height: 20px;
  }
  .down img{
    background-color: #F2FCFC;
    width: 15px;
    height: 15px;
  }
  .describe{
    font-size: 12px;
    color: slategray;
  }
  .price{
    font-size: 15px;
    color: red;
  }

  .title-bar {
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 20px;
  }
  .title-bar span {
    display: inline-block;
    position: relative;
    font-weight: bold;
    color: #333;
  }
  .title-bar span:before {
    content: '';
    position: absolute;
    top: 20px;
    left: -45px;
    width: 30px;
    border-top: 1px solid #333;
    transform: scaleY(0.5);
  }
  .title-bar span:after {
    content: '';
    position: absolute;
    top: 20px;
    right: -43px;
    width: 30px;
    border-top: 1px solid #333;
    transform: scaleY(0.5);
  }
</style>
