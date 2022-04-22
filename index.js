import { scheduleJob } from "node-schedule";
import {Start} from "./trying.js";
var j = scheduleJob("0 * * * *", function () {
  Start();
});
