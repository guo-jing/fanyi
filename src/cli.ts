#!/usr/bin/env node
import * as program from "commander";
import * as index from "./index"

program.parse(process.argv);

if(program.args[0]) {
    index.translate(program.args[0]);
} else {
    console.log('请输入要翻译的内容！');
}

