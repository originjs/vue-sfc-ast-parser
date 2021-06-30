import { vueSfcAstParser, stringifyDescriptor } from '../src/index'

test('testAst', async () => {
    const source = `<script  lang="js">
export default {
  name: 'MmIcon',
  props: {
    type: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 16
    }
  },
  methods: {
    getIconCls() {
      return 'icon-' + this.type
    },
    getIconStyle() {
      return { fontSize: this.size + 'px' }
    },
    onClick(e) {
      this.$emit('click', e)
    }
  },
  render() {
    const Icon = (
      <i
        onClick={this.onClick}
        class={'iconfont ' + this.getIconCls()}
        style={this.getIconStyle()}
      />
    )
    return Icon
  }
}
</script>

<style lang="less">
.iconfont {
  display: inline-block;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  line-height: 1;
  vertical-align: baseline;
  text-transform: none;
  speak: none;
  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
`
    const file = { path: '/tmp/a.vue', source }
    // @ts-ignore
    const { templateAST, scriptAST, descriptor, jscodeshiftParser } = vueSfcAstParser(file)
    scriptAST.find(jscodeshiftParser.ObjectProperty)

    expect(scriptAST.findJSXElements().length).toBeGreaterThan(0)

    const expected = `<script lang="tsx">
export default {
  name: 'MmIcon',
  props: {
    type: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 16
    }
  },
  methods: {
    getIconCls() {
      return 'icon-' + this.type
    },
    getIconStyle() {
      return { fontSize: this.size + 'px' }
    },
    onClick(e) {
      this.$emit('click', e)
    }
  },
  render() {
    const Icon = (
      <i
        onClick={this.onClick}
        class={'iconfont ' + this.getIconCls()}
        style={this.getIconStyle()}
      />
    )
    return Icon
  }
}
</script>
<style lang="less">
.iconfont {
  display: inline-block;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  line-height: 1;
  vertical-align: baseline;
  text-transform: none;
  speak: none;
  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
`
    descriptor!.script!.attrs.lang = 'tsx'
    expect(stringifyDescriptor(descriptor!)).toBe(expected)
});