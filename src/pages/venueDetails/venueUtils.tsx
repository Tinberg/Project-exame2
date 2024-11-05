//-- Weather --//
import {
  WiDaySunny,
  WiCloudy,
  WiDayCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
} from "react-icons/wi";
import { IconType } from "react-icons/lib";
import "./venueUtils.scss";

export const getWeatherIcon = (
  weathercode: number
): { icon: IconType; className: string } => {
  switch (weathercode) {
    case 0:
      return { icon: WiDaySunny, className: "sunny" };
    case 1:
    case 2:
    case 3:
      return { icon: WiCloudy, className: "cloudy" };
    case 61:
    case 63:
    case 65:
      return { icon: WiRain, className: "rain" };
    case 71:
    case 73:
    case 75:
      return { icon: WiSnow, className: "snow" };
    case 95:
      return { icon: WiThunderstorm, className: "thunderstorm" };
    default:
      return { icon: WiDayCloudy, className: "default" };
  }
};
