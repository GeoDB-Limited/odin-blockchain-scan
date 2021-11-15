<template>
  <footer>
    <div class="footer-inner container">
      <div class="footer-logo">
        <a href="/">
          <img
            class="logo"
            src="~@/assets/brand/odin-logo-white.png"
            alt="Logo"
            width="80"
          />
        </a>
      </div>
      <nav>
        <a href="">About us</a>
        <a href="">Contact us</a>
        <a href="">Terms of service</a>
        <a href="">Developer APIs</a>
        <a href="">Knowledge base</a>
        <a href="">Network status</a>
      </nav>
    </div>
  </footer>
</template>
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Footer',
  setup() {
    const test = ref()

    return {
      test,
    }
  },
})
</script>
<style scoped lang="scss">
footer {
  background: var(--clr__tooltip-bg);
  height: 92px;
  margin-top: 64px;

  @media screen and (max-width: 992px) {
    height: auto;
    padding: 0 15px;
  }

  @media screen and (max-width: 600px) {
    margin-top: 40px;
  }
}

nav {
  display: flex;
  flex: 1;
  justify-content: space-between;

  a {
    color: #fff;
    text-decoration: none;
    font-size: 16px;
    font-weight: 400;
  }

  @media screen and (max-width: 992px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 24px;
    width: 100%;

    a {
      display: block;
      margin-bottom: 1.6rem;
      text-align: left;
    }
  }
}

.container {
  max-width: 1220px;
  width: 100%;
  margin: 0 auto;
}

.footer {
  &-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;

    @media screen and (max-width: 992px) {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &-logo {
    margin-right: 128px;

    @media screen and (max-width: 992px) {
      margin: 2.4rem 0;
    }
  }
}
</style>
