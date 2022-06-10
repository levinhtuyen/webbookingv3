import {
  isEncryptParamValid,
} from '~jsDefinePath/general';
import {
  DABLE_TRACKING,
} from '~jsDefinePath/tracking-define';

const App = (() => {
  const _startTimeStamp = Date.now();
  let _g2jDablena = null;
  let _g2jEncrypt = null;

  const __calcSpaceOfSecond = () => {
    return parseInt(Math.abs(Date.now() - _startTimeStamp) / (1000) % 60);
  }; // _calcSpaceOfSecond()

  const _lockGlobalService = () => {
    _g2jEncrypt = window.Go2JoyEncrypt;
    window.Go2JoyEncrypt = function() {
      if(isEncryptParamValid(this?.key, this?.no_encrypt)) {
        return _g2jEncrypt;
      }
    };

    // NOTE - dable
    let asyncLockDablenaInterval = setInterval(function() {
      if(__calcSpaceOfSecond() >= 3) {
        clearInterval(asyncLockDablenaInterval);
        asyncLockDablenaInterval = null;
      }

      if(
        typeof window.dablena === 'object' &&
        typeof window.dablena.isInit
      ) {
        _g2jDablena = window.dablena.handle;
        window.dablena = function() {
          if(isEncryptParamValid(this?.key)) {
            return _g2jDablena;
          }
        };

        clearInterval(asyncLockDablenaInterval);
        asyncLockDablenaInterval = null;
      }
    }, 30);
  }; // lockGlobalService()

  const _footerTrackingEvent = () => {
    const elFooterSection = document.getElementById('footer__section');

    if(elFooterSection) {
      // NOTE - tracking follow info group youtube channel
      const elFooterBlockFollowInfoGroupFollowItemYT = elFooterSection.getElementsByClassName('footer-block__follow-info-group__follow-item--yt');

      if(elFooterBlockFollowInfoGroupFollowItemYT.length) {
        elFooterBlockFollowInfoGroupFollowItemYT[0].addEventListener('click', function(ev) {
          ev.preventDefault();
          const href = this.getAttribute('href');

          __footerTrackingDablena(
            href,
            true,
            DABLE_TRACKING.TRACKING_VIEW_YOUTUBE_CHANNEL
          );
        });
      }

      // NOTE - tracking follow info group youtube channel
      const elFooterBlockFollowInfoGroupFollowItemFB = elFooterSection.getElementsByClassName('footer-block__follow-info-group__follow-item--fb');

      if(elFooterBlockFollowInfoGroupFollowItemFB.length) {
        elFooterBlockFollowInfoGroupFollowItemFB[0].addEventListener('click', function(ev) {
          ev.preventDefault();
          const href = this.getAttribute('href');

          __footerTrackingDablena(
            href,
            true,
            DABLE_TRACKING.TRACKING_VIEW_FACEBOOK_PAGE
          );
        });
      }

      // NOTE - tracking footer item list
      const elFooterBlockG2JInfoItemList = elFooterSection.getElementsByClassName('footer-block__g2j-info-item--link');

      if(elFooterBlockG2JInfoItemList.length) {
        for(const elFooterBlockG2JInfoItem of elFooterBlockG2JInfoItemList) {
          elFooterBlockG2JInfoItem.addEventListener('click', function(ev) {
            const href = this.getAttribute('href');

            if(!/tel:|mailto:/img.test(href)) {
              ev.preventDefault();

              const isOpenNewTab = (this.getAttribute('target') === '_blank');
              const trackingName = DABLE_TRACKING[this.dataset.trackingDableKey];

              __footerTrackingDablena(
                href,
                isOpenNewTab,
                trackingName,
              );
            }
          });
        }
      }

      // NOTE - tracking footer download app
      const elFooterBlockDownloadAppLinkList = elFooterSection.getElementsByClassName('footer-block__download-app-link');

      if(elFooterBlockDownloadAppLinkList.length) {
        for(const elFooterBlockDownloadAppLink of elFooterBlockDownloadAppLinkList) {
          elFooterBlockDownloadAppLink.addEventListener('click', function(ev) {
            ev.preventDefault();

            const href = this.getAttribute('href');
            const trackingName = DABLE_TRACKING[this.dataset.trackingDableKey];

            __footerTrackingDablena(
              href,
              true,
              trackingName,
            );
          });
        }
      }
    }
  }; // _footerTrackingEvent()

  const __footerTrackingDablena = (href, isOpenNewTab, trackingName) => {
    if(
      trackingName &&
      typeof trackingName === 'string'
    ) {
      _g2jDablena('track', trackingName);
    }

    if(
      href &&
      typeof href === 'string'
    ) {
      if(
        href.includes('http') &&
        isOpenNewTab
      ) {
        window.open(
          href,
          '_blank'
        );
      } else if(!isOpenNewTab) {
        window.location.href = href;
      }
    }
  }; // __footerTrackingDablena()

  return {
    init() {
      _lockGlobalService();
      _footerTrackingEvent();
    }
  };
})();

App.init();
