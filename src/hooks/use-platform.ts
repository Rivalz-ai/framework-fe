import { useMemo } from 'react';

const MOBILE_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

type PlatformPayload = {
  isSSR: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  isMac: boolean;
};

export const usePlatform = (): PlatformPayload => {
  const platforms = useMemo(() => {
    const isClient = typeof window !== 'undefined';

    if (!isClient) {
      return {
        isSSR: true,
        isMobile: false,
        isDesktop: false,
        isMac: false
      };
    }

    const isMobile = MOBILE_REGEX.test(window.navigator.userAgent);
    const isMac = /mac/i.test(window.navigator.userAgent);

    return {
      isSSR: false,
      isMobile,
      isDesktop: !isMobile,
      isMac
    };
  }, []);

  return platforms;
};
