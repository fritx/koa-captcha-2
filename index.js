let { BMP24 } = require('gd-bmp')
let prefix = 'cap:'

exports.drawCaptcha = drawCaptcha
exports.verifyCaptcha = verifyCaptcha

async function drawCaptcha (ctx) {
  let { img, str } = makeCaptcha()
  let { key } = ctx.query
  let sessKey = `${prefix}${key}`
  ctx.session[sessKey] = str
  ctx.type = 'image/bmp'
  ctx.body = img.getFileData()
}

function verifyCaptcha (ctx) {
  let { captchaKey, captcha } = ctx.request.body
  let sessKey = `${prefix}${captchaKey}`
  let val = ctx.session[sessKey]
  ctx.session[sessKey] = null // 一次性使用后清空
  return val === captcha.toUpperCase()
}

// https://github.com/zengming00/node-gd-bmp
/* eslint-disable */
//制造验证码图片
function makeCaptcha() {
    var img = new BMP24(100, 40);

    img.fillRect(0, 0, 100, 40, 0xf8f8f8);
    img.drawCircle(rand(0, 100), rand(0, 40), rand(10 , 40), rand(0, 0xffffff));
    //边框
    // img.drawRect(0, 0, img.w-1, img.h-1, rand(0, 0xffffff));
    // img.fillRect(rand(0, 100), rand(0, 40), rand(10, 35), rand(10, 35), rand(0, 0xffffff));
    img.drawLine(rand(0, 100), rand(0, 40), rand(0, 100), rand(0, 40), rand(0, 0xffffff));
    //return img;

    //画曲线
    // var w=img.w/2;
    // var h=img.h;
    // var color = rand(0, 0xffffff);
    // var y1=rand(-7,7); //Y轴位置调整
    // var w2=rand(15,20); //数值越小频率越高
    // var h3=rand(6,8); //数值越小幅度越大
    // var bl = rand(1,5);
    // for(var i=-w; i<w; i+=0.1) {
    //     var y = Math.floor(h/h3*Math.sin(i/w2)+h/2+y1);
    //     var x = Math.floor(i+w);
    //     for(var j=0; j<bl; j++){
    //         img.drawPoint(x, y+j, color);
    //     }
    // }

    var p = "ABCDEFGHKMNPQRSTUVWXYZ3456789";
    var str = '';
    for(var i=0; i<4; i++){
        str += p.charAt(Math.random() * p.length |0);
    }

    // var fonts = [BMP24.font8x16, BMP24.font12x24, BMP24.font16x32];
    var fonts = [BMP24.font12x24, BMP24.font16x32];
    var x = 15, y=8;
    for(var i=0; i<str.length; i++){
        var f = fonts[Math.random() * fonts.length |0];
        y = 8 + rand(-10, 10);
        img.drawChar(str[i], x, y, f, rand(0, 0xffffff));
        x += f.w + rand(2, 8);
    }
    return { img, str };
}

//仿PHP的rand函数
function rand(min, max) {
    return Math.random()*(max-min+1) + min | 0; //特殊的技巧，|0可以强制转换为整数
}
