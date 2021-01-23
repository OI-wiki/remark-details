'use strict'

var remark2rehype = require('remark-rehype')
var unified = require('unified')
var markdown = require('remark-parse')
var html = require('rehype-stringify')

const magic = unified()
  .use(markdown).use(remark2rehype).use(html)

const regex = /(?:^|\n)[\?\!]{3}(\+)? ?(?:([\u4e00-\u9fa5_a-zA-Z0-9\-]+(?: +[\u4e00-\u9fa5_a-zA-Z0-9\-]+)*?)?(?: +"(.*?)")|([\u4e00-\u9fa5_a-zA-Z0-9\-]+(?: +[\u4e00-\u9fa5_a-zA-Z0-9\-]+)*?)) *(?:\n|$)/gm;
// const regex = /(?:^|\n)[\?\!]{3}(\+)? ?(?:([\w\-]+(?: +[\w\-]+)*?)?(?: +"(.*?)")|([\w\-]+(?: +[\w\-]+)*?)) *(?:\n|$)/gm;

var tab = '\t'
var tabSize = 4
var lineFeed = '\n'
var space = ' '


module.exports = function blockPlugin (opts) {
  function blockTokenizer (eat, value, silent) {
    // console.log('=======================\n blockTokenizers: ');
    // console.log(value);
    var length = value.length + 1
    var index = 0
    var subvalue = ''
    // var fenceCount
    // var marker
    var character
    // var queue
    // var content
    // var exdentedContent
    // var closing
    // var exdentedClosing
    // var indent
    var now
    var self = this
    // var settings = self.options
    // var commonmark = settings.commonmark
    // var gfm = settings.gfm
    // var tokenizers = self.blockTokenizers
    // var interruptors = self.interruptParagraph
    var index = value.indexOf(lineFeed)
    var length = value.length
    var position
    // var subvalue
    var character
    var size
    var now

    // console.log('index: ', index, `[${value.charAt(index)}]`);
    // console.log(typeof lineFeed, `[${lineFeed}]`);
    while (index < length) {
      // Eat everything if there’s no following newline.
      if (index === -1) {
        index = length
        break
      }

      // Stop if the next character is NEWLINE.
      let c = value.charAt(index + 1)
      // console.log(index+1, 'c:', `[${c}]`);
      if (c != lineFeed && c != space && c != tab) {
        // console.log('break1:', index + 1, 'c:', `[${c}]`);
        break
      }

      if (c == lineFeed) { // empty line
        // ok
      } else {
        // Stop if next 4 characters aren't all space
        let nc = value.slice(index + 1, index + 5)
        // console.log(nc === '    ')
        // console.log(nc, '???')
        if (nc !== '    ') {
          // console.log('break2:', 'nc:', `[${nc}]`);
          break
        }
      }

      // console.log(value.slice(0, index))
      // In commonmark-mode, following indented lines are part of the paragraph.
      size = 0
      position = index + 1

      while (position < length) {
        character = value.charAt(position)

        if (character === tab) {
          size = tabSize
          break
        } else if (character === space) {
          size++
        } else {
          break
        }

        position++
      }
      if (size >= tabSize && character !== lineFeed) {
        // console.log(value.slice(0, index), index)
        index = value.indexOf(lineFeed, index + 1)
        // console.log(value.slice(0, index), index)
        // console.log(index)
        continue
      }

      // subvalue = value.slice(index + 1)

      position = index
      index = value.indexOf(lineFeed, index + 1)
    }
    subvalue = value.slice(0, index)
    // console.log('subvalue', subvalue, 'ends')
    // console.log(value)
    if (silent) {
      return true
    }

    now = eat.now()
    now.column += subvalue.length
    now.offset += subvalue.length
    let res = regex.exec(subvalue)
    // console.log(res)
    // subvalue += value
    if (res !== null) {
      let header = res[0]
      if (silent) {
        return true
      }
      let val = res[2] || res[4]
      // console.log(val)
      let title = res[3] || ''
      if (res[0][0] == '!') {
        title = res[4]
        val = ''
      }
      // console.log(subvalue)
      // console.log(subvalue.replace(regexonce, ''))
      // console.log(subvalue.replace(regexonce, ''))
      // console.log(subvalue)
      // console.log(now)
      let childval = subvalue.replace(regex, '').split('\n')
      // console.log(childval)
      childval.forEach((e, idx) => {
        // console.log(e.length)
        if (e.length == 0) {
          // childval[idx] = '\n' // 禁止超级加倍
        } else {
          childval[idx] = e.replace(/\s{4}/, '')
        }
      })
      // console.log(childval)
      childval = childval.join('\n')
      // console.log(childval)

      // pack header into hProp.summary as HTML string
      let summary
      if (header.length > 0) {
        let headerH = header.replace('\n', '')
        summary = headerH.substr('4') || ''
        let icon = 'note'
        if (summary.indexOf('warning') > -1) icon = 'warning'
        summary = summary.replace(icon, '').trim()
        summary = summary.replace(/"+$/, "").replace(/^"+/, "").trim();
      }
      let summaryHTML = (magic.processSync(summary).contents)
      // console.log(summaryHTML)
      // console.log("==========================header===============================");
      // console.log(header);
      // console.log("==========================child=================================");
      // console.log(childval);
      // console.log("==========================subvalue==============================");
      // console.log(subvalue);
      // console.log("===============================================================");

      const func = eat(subvalue);
      return func({
        type: 'details',
        data: {
          hProperties: {
            class: 'details',
            header: header,
            summary: `${summaryHTML}`
          }
        },
        header: header,
        value: val,
        title: title,
        children: self.tokenizeBlock(childval, now)
      })
    }
  }

  const Parser = this.Parser

  // Inject blockTokenizer
  const blockTokenizers = Parser.prototype.blockTokenizers
  const blockMethods = Parser.prototype.blockMethods
  blockTokenizers.details = blockTokenizer
  blockMethods.splice(blockMethods.indexOf('paragraph') - 1, 0, 'details')

  // Inject details to interrupt rules
  const interruptParagraph = Parser.prototype.interruptParagraph
  const interruptList = Parser.prototype.interruptList
  const interruptBlockquote = Parser.prototype.interruptBlockquote
  // interruptParagraph.splice(interruptParagraph.indexOf('paragraph') - 1, 0, ['details'])
  // interruptList.splice(interruptList.indexOf('paragraph') - 1, 0, ['details'])
  // interruptBlockquote.splice(interruptBlockquote.indexOf('paragraph') - 1, 0, ['details'])

  const Compiler = this.Compiler

  // Stringify for details block
  if (Compiler != null) {
    const visitors = Compiler.prototype.visitors
    visitors.details = function (node) {
      // return '$$\n' + node.value + '\n$$'
      // console.log('visited in index.js')
      // console.log(node.value)
      // console.log(node.children)
      // let res = '??? ' + node.title + '\n'
      // for (let w of node.children) {
      //   console.log(w)
      //   res += visitors[w.type].call(w)
      // }
      // console.olg
      // return this.encode(node.children)
      // return res
      let children_ = this.all(node).map((ele) => {
        // console.log(ele.split('\n').map(e => '    ' + e))
        return ele.split('\n').map(e => '    ' + e).join('\n')
      }
      ).join('\n    \n')
      // console.log(children_)

      return node.header + children_
    }
  }
}
