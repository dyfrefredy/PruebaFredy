import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'avDateTimeOffset'
})
export class AvDateTimeOffsetPipe implements PipeTransform {

  transform(value: any, formato: string): unknown {
    let stringDateOffset={
      date:value.indexOf("T")>-1?value.substring(0, value.indexOf("T")):"",
      time:value.indexOf("T")>-1?value.substring(value.indexOf("T")+1,value.indexOf("T")+6 ):"",
      timeFull:value.indexOf("T")>-1?value.substring(value.indexOf("T")+1,value.indexOf("T")+9 ):"",
      zone:"GMT "+value.substring(value.length-6,value.length)
    };
    
    switch (formato) {
      case "OriginalLocation":
        return  stringDateOffset.date+ " " + stringDateOffset.time+" "+stringDateOffset.zone;
        break;
      case "OriginalLocation2":
        return  stringDateOffset.date+ " <br>" + stringDateOffset.time+" "+stringDateOffset.zone;
        break;
      case "OriginalLocationDate":
        return stringDateOffset.date;
        break;
      case "OriginalLocationTime":
        return  stringDateOffset.time;
        break;
      case "OriginalLocationTimeZone":
        return stringDateOffset.time+" "+stringDateOffset.zone;
        break;

      default:
        return new Date(value);
        break;
    }
  }

}
