import { parse as parseSFC } from './sfcUtils'
import type { SFCDescriptor } from './sfcUtils'
import * as templateParser from 'vue-eslint-parser'
import { ESLintProgram } from "vue-eslint-parser/ast";
// @ts-ignore
import getParser from 'jscodeshift/src/getParser'
import jscodeshift from 'jscodeshift'
import { JSCodeshift } from "jscodeshift/src/core";

type FileInfo = {
    path: string
    source: string
}

export default function vueSfcAstParse(
    fileInfo: FileInfo
) {
    const { path, source } = fileInfo
    let descriptor: SFCDescriptor
    const extension = (/\.([^.]*)$/.exec(path) || [])[0]
    if (extension !== '.vue') {
        return {}
    }

    // get vue sfc descriptor
    descriptor = parseSFC(source, { filename: path }).descriptor

    const templateAST : ESLintProgram | null = parseTemplate(descriptor)
    const parseScriptResult = parseScript(descriptor)
    let scriptAST
    let jscodeshiftParser
    if (!parseScriptResult) {
        scriptAST = null
        jscodeshiftParser = null
    } else {
        scriptAST = parseScriptResult.scriptAST
        jscodeshiftParser = parseScriptResult.jscodeshiftParser
    }

    return {
        templateAST : templateAST,
        scriptAST : scriptAST,
        descriptor : descriptor,
        jscodeshiftParser: jscodeshiftParser
    }

}

function parseTemplate(descriptor: SFCDescriptor) : ESLintProgram | null {
    if (!descriptor.template) {
        return null
    }

    const templateContent : string = descriptor.template.ast.loc.source
    const options = { sourceType: 'module' }
    const templateAST : ESLintProgram = templateParser.parse(templateContent, options)
    return templateAST
}

function parseScript(descriptor: SFCDescriptor) : any {
    if (!descriptor.script) {
        return null
    }

    const lang : string = descriptor.script.lang || 'js'
    const scriptContent : string = descriptor.script.content

    let parserOption : string = 'babylon'

    // force inject `parser` option for .tsx? files, unless the module specifies a custom implementation
    if (lang.startsWith('ts')) {
        parserOption = lang
    }

    const parser = !!parserOption ? getParser(parserOption) : getParser()
    const jscodeshiftParser : JSCodeshift = jscodeshift.withParser(parser)
    const scriptAST = jscodeshiftParser(scriptContent)

    return { scriptAST, jscodeshiftParser }
}