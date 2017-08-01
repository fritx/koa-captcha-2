# koa-captcha-2

> Captcha utils for koa 2

*Based on [gd-bmp](https://github.com/zengming00/node-gd-bmp)*

### Install via npm

```plain
npm i -S koa-captcha-2
```

### Draw the image

```js
let { drawCaptcha } = require('koa-captcha-2')
// ...
router.get('/api/captcha', drawCaptcha)
```

### Verify the code

```js
let { verifyCaptcha } = require('koa-captcha-2')
// ...
router.post('/api/login', ctx => {
  if (!verifyCaptcha(ctx)) {
    ctx.throw(400, 'Captcha not correct')
  }
  // ...
})
```

### Form markups

```vue
<template>
  <el-form-item label="Captcha">
    <el-input type="text" v-model="model.captcha" auto-complete="off">
      <img slot="append" :src="captchaSrc" @click="reloadCaptcha">
    </el-input>
  </el-form-item>
</template>

<script>
export default {
  data () {
    return {
      captchaKey: Date.now(),
      model: {
        account: 'admin',
        password: 'admin',
        captcha: ''
      }
    }
  },
  computed: {
    captchaSrc () {
      return `/api/captcha?key=${this.captchaKey}`
    }
  },
  methods: {
    reloadCaptcha () {
      this.captchaKey = Date.now()
      this.model.captcha = ''
    },
    submitForm () {
      let { captchaKey } = this
      postApi('/api/login', {
        ...this.model, captchaKey
      })
      .then(() => {
        // ...
      })
      .catch(err => {
        // ...
        this.reloadCaptcha()
      })
    }
  }
}
</script>
```
