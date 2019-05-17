import { Component, OnInit } from "@angular/core";
import { DataService } from "../data.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  AlarmData: any = {};

  constructor(private data: DataService) {}

  ngOnInit() {
    this.data.getData().subscribe(data => {
      this.AlarmData = data;
      console.log(this.AlarmData);
    });
  }

  /*
  After reading data from the json and put it in the correct format to assign it to an object, I will use a function to
  find when the alarm begins by checking its type (looking for 6 or 7) and then looking for its pair (8 or 9), then using that information
  to calculate the time to add to a global time variable telling us the total time the alarm was active. In the case of not finding a pair I will
  use the endtime as the second variable.
  */
  calcTime(data) {
    let totalTime = 0;
    let outAlarm = false;

    for (let i = 0; i < data.tripUploadEvents.length; i++) {
      if (data.tripUploadEvents[i].eventType === 6 && outAlarm === false) {
        outAlarm = true;
        for (let j = i; j < data.tripUploadEvents.length; j++) {
          if (
            data.tripUploadEvents[j] === 8 &&
            j != data.tripUploadEvents.length - 1
          ) {
            totalTime +=
              data.tripUploadEvents[j].timestamp -
              data.tripUploadEvents[i].timestamp;
            outAlarm = false;
          } else {
            totalTime += data.endTime - data.tripUploadEvents[i].timestamp;
            outAlarm = false;
          }
        }
      }
      if (data.tripUploadEvents[i].eventType === 7 && outAlarm === false) {
        outAlarm = true;
        for (let k = i; k < data.tripUploadEvents.length; k++) {
          if (
            data.tripUploadEvents[k] === 9 &&
            k != data.tripUploadEvents.length - 1
          ) {
            totalTime +=
              data.tripUploadEvents[k].timestamp -
              data.tripUploadEvents[i].timestamp;
            outAlarm = false;
          } else {
            totalTime += data.endTime - data.tripUploadEvents[i].timestamp;
            outAlarm = false;
          }
        }
      }
    }

    return totalTime;
  }
}
