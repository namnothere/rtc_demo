/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { Provider } from '../basic';

/**
 * @brief Flexible Mode (VoiceChat Mode) Config.
 * @note For more information, you can refer to https://docs.byteplus.com/en/docs/byteplus-rtc/docs-1316243
 *       Some sensitive fields not provided in frontend were injected by the server (See: Server/sensitive.js).
 */
export class ASRManager {
  provider: Provider.Amazon | Provider.Google;

  #paramsMap: {
    [Provider.Amazon]: {
      Provider: Provider.Amazon | Provider.Google;
      ProviderParams: {
        /**
         * @brief Create new access keys for an IAM user.
         * @note Injected by server, refer to Server/sensitive.js.
         * @refer https://docs.aws.amazon.com/keyspaces/latest/devguide/create.keypair.html
         */
        ID?: string;
        /**
         * @brief Create new access keys for an IAM user.
         * @note Injected by server, refer to Server/sensitive.js.
         * @refer https://docs.aws.amazon.com/keyspaces/latest/devguide/create.keypair.html
         */
        Secret?: string;
        /**
         * @refer https://console.aws.amazon.com/iam/
         */
        Region: 'us-west-2';
        /**
         * @refer https://docs.aws.amazon.com/transcribe/latest/dg/supported-languages.html
         */
        Language: 'zh-CN' | 'en-US';
      };
    };
    [Provider.Google]: {
      /**
       * @refer https://cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages?_gl=1*fvvdba*_up*MQ..&gclid=Cj0KCQiAoJC-BhCSARIsAPhdfShixYZAER8RJaVCJ161wYklfPL8dKNOw3Q_ODbdFw_gN1AEloZXus4aAlUWEALw_wcB&gclsrc=aw.ds
       */
      Language?: string;
      /**
       * @note Injected by server, refer to Server/sensitive.js.
       * @refer https://cloud.google.com/docs/authentication/application-default-credentials#GAC
       */
      CredentialsJSON?: string;
    };
  };

  constructor() {
    this.provider = Provider.Amazon;
    this.#paramsMap = {
      [Provider.Amazon]: {
        Provider: Provider.Amazon,
        ProviderParams: {
          Region: 'us-west-2',
          Language: 'en-US',
        },
      },
      [Provider.Google]: {
        Language: 'en-US',
      },
    };
  }

  get value() {
    return this.#paramsMap[this.provider] || {};
  }
}
