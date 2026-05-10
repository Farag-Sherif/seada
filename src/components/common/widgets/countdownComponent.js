import React, { Fragment } from "react";
import Countdown from "react-countdown";
import { useLanguage } from "../../../helpers/Language/useLanguage";

const CountdownComponent = () => {
  const { t, isRTL } = useLanguage();
  
  const Completionist = () => <span style={{ direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}>{t('you_are_good_to_go')}</span>;

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <div className="timer-box" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
            <div className="timer">
              <div className="timer-p" id="demo">
                <span>
                  {days}
                  <span className="padding-l">:</span>
                  <span className="timer-cal">{t('days')}</span>
                </span>
                <span>
                  {hours}
                  <span className="padding-l">:</span>
                  <span className="timer-cal">{t('hrs')}</span>
                </span>
                <span>
                  {minutes}
                  <span className="padding-l">:</span>
                  <span className="timer-cal">{t('min')}</span>
                </span>
                <span>
                  {seconds}
                  <span className="timer-cal">{t('sec')}</span>
                </span>
              </div>
            </div>
        </div>
      );
    }
  };

  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth();
  var day = d.getDate();
  var coundown = new Date(year, month, day + 10).getTime();

  return (
    <Fragment>
      <Countdown date={coundown} renderer={renderer} />
    </Fragment>
  );
};

export default CountdownComponent;
