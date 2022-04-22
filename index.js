import { scheduleJob } from "node-schedule";
import {Start} from "./trying.js";
var j = scheduleJob("* * * * *", function () {
  Start();
});
