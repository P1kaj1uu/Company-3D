<template>
  <div class="cardBox">
    <img :src="advantageItem.imgUrl" alt="">
    <div>{{ advantageItem.title }}</div>
  </div>
</template>

<script>
  export default {
    name: 'Card',
    props: ['advantageItem'],
    mounted () {

    },
    methods: {},
    created () {

    },

  }
</script>

<style lang="less" scoped>
  .cardBox {
    width: 320px;
    height: 260px;
    background: #010714;
    color: #FFFFFF;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;

    &:hover {
      border: 2px solid #0AF9BA;
      box-shadow: 0px 0px 32px 0px rgba(0, 255, 188, 0.75);
      color: #0AF9BA;
      transform: scale(1.05);
    }

    > img {
      width: 182px;
      height: 142px;
    }

    > div {
      width: 100px;
      height: 23px;
      font-size: 24px;
      font-weight: 400;
      font-style: italic;
      line-height: 50px;

    }
  }
</style>
