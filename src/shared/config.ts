import type StaticConfig from '../../static/config.json';
import {LoadJsonFile} from "@kjmaster2/kj_lib";

let config = LoadJsonFile('static/config.json');

$BROWSER: {
  config = await config;
}

export default config as typeof StaticConfig;