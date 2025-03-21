```
new Vue({
    el: '#app',
    data() {
      return {
        // ========== REM/EM转换相关参数 ==========
        pxValue: null,        // 输入的像素值
        rootFontSize: 16,     // 根字体大小（默认16px）
        convertType: 'rem',   // 转换类型（rem/em）
  
        // ========== VW转换相关参数 ==========
        pxValueVw: null,      // 需要转换的像素值（vw转换用）
        viewportWidth: 1920   // 视口宽度（默认1920px）
      }
    },
    computed: {
      /**
       * 计算REM/EM转换结果
       * 1. 执行输入验证
       * 2. 计算最优表达式
       * 3. 处理无法整除的情况
       */
      remResult() {
        // 输入验证
        if (isNaN(this.pxValue)) return "请输入有效的像素值"
        if (isNaN(this.rootFontSize)) return "请输入有效的字体大小"
        if (this.rootFontSize <= 0) return "字体大小必须大于0"
        if (this.pxValue <= 0) return "像素值必须大于0"
  
        const px = parseFloat(this.pxValue)
        const root = parseFloat(this.rootFontSize)
        const ratio = px / root
  
        // 完美整除情况
        if (this.canBeFiniteDecimal(px, root)) {
          return `${ratio}${this.convertType}`
        } 
        // 需要拆分表达式的情况
        else {
          const optimalK = this.findOptimalK(px, root)
          const optimalRem = optimalK / root
          const remainder = px - optimalK
  
          if (optimalK > 0 && remainder >= 0) {
            return `calc(${this.formatDecimal(optimalRem)}${this.convertType} + ${this.formatDecimal(remainder)}px)`
          } else {
            const integerPart = Math.floor(ratio)
            const remainderOriginal = px % root
            return `calc(${integerPart}${this.convertType} + ${this.formatDecimal(remainderOriginal)}px)`
          }
        }
      },
  
      /**
       * 计算VW转换结果
       * 公式：vw = (px / viewportWidth) * 100
       */
      vwResult() {
        // 输入验证
        if (isNaN(this.pxValueVw)) return "请输入有效的像素值"
        if (isNaN(this.viewportWidth)) return "请输入有效的视口宽度"
        if (this.viewportWidth <= 0) return "视口宽度必须大于0"
        if (this.pxValueVw <= 0) return "像素值必须大于0"
  
        const vw = (this.pxValueVw / this.viewportWidth) * 100
        return `${this.formatDecimal(vw)}vw`
      }
    },
    methods: {
      /**
       * 复制结果到剪贴板
       * @param {string} text - 需要复制的文本内容
       */
      copyResult(text) {
        // 创建临时文本域
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'absolute'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        
        // 执行复制操作
        textarea.select()
        try {
          document.execCommand('copy')
          this.$message.success('复制成功！')
        } catch (err) {
          this.$message.error('复制失败，请手动复制')
        }
        // 清理临时元素
        document.body.removeChild(textarea)
      },
  
      /**
       * 判断分数是否可以表示为有限小数
       * @param {number} numerator - 分子
       * @param {number} denominator - 分母
       * @returns {boolean}
       */
      canBeFiniteDecimal(numerator, denominator) {
        // 计算最大公约数
        const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b))
        const divisor = gcd(numerator, denominator)
        
        // 约分后的分母
        let reducedDenominator = denominator / divisor
        
        // 去除2和5的因子
        while (reducedDenominator % 2 === 0) reducedDenominator /= 2
        while (reducedDenominator % 5 === 0) reducedDenominator /= 5
        
        // 如果最终分母为1则是有限小数
        return reducedDenominator === 1
      },
  
      /**
       * 寻找最大可分解值
       * @param {number} px - 原始像素值
       * @param {number} root - 根字体大小
       * @returns {number} 最优化的K值
       */
      findOptimalK(px, root) {
        let k = Math.min(Math.floor(px), px)
        // 递减寻找最大可分解值
        while (k >= 0) {
          if (this.canBeFiniteDecimal(k, root)) return k
          k--
        }
        return 0
      },
  
      /**
       * 格式化小数显示
       * @param {number} value - 原始值
       * @returns {string} 格式化后的字符串
       */
      formatDecimal(value) {
        // 保留4位小数后去除多余零
        const fixed = value.toFixed(4)
        return fixed.replace(/\.?0+$/, '')
      }
    }
  })
```

1. 核心功能
功能模块	输入参数	输出结果	计算公式
PX转REM/EM	px值, 根字体大小, 转换类型	rem/em值或calc表达式	rem = px / rootFontSize
PX转VW	px值, 视口宽度	vw值	vw = (px / viewportWidth) * 100
2. 数据属性说明
属性名称	类型	默认值	说明
pxValue	Number	null	需要转换的像素值（REM用）
rootFontSize	Number	16	根字体大小（单位：px）
convertType	String	rem	转换类型（rem/em）
pxValueVw	Number	null	需要转换的像素值（VW用）
viewportWidth	Number	1920	设计稿视口宽度（px）
3. 方法说明
方法名称	功能说明	算法复杂度
copyResult()	复制结果到剪贴板	O(1)
canBeFiniteDecimal()	判断分数是否可表示为有限小数	O(log n)
findOptimalK()	寻找最大可分解值用于生成最优表达式	O(n)
formatDecimal()	格式化小数显示（保留4位精度，去除末尾零）	O(1)