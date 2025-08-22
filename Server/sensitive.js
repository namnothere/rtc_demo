/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */
const merge = require('lodash/merge');

/**
 * @note Not required, if you invoke getSessionToken to generate sessionToken, you should fill it.
 * @refer https://console.byteplus.com/user/basics/
 */
const ACCOUNT_ID = '3000631366';

/**
 * @note Not required, if you invoke getSessionToken to generate sessionToken, you should fill it.
 */
const SUB_ACCOUNT_NAME = 'Your Sub Account Name';

/**
 * @note Sign up for AK/SK.
 *        You can manage your AK/SK via https://console.byteplus.com/iam/keymanage
 */
const ACCOUNT_INFO = {
  /**
   * @note Required, get from https://console.byteplus.com/iam/keymanage
   */
  accessKeyId: 'AKAPNDgxNzMyMzU4NDFjNGI4ZWFhMDU3YTczMzQ5Njk4Y2I',
  /**
   * @note Required, get from https://console.byteplus.com/iam/keymanage
   */
  secretKey: 'TlRreE5XWTVPV001WkdZMU5HVTFZMkl3TXpReE5UVm1PR1pqTVRJd1pqSQ==',
};

/**
 * @brief RTC AppKey
 * @refer https://console.byteplus.com/rtc/listRTC
 */
const RTC_APP_KEY = '9e211b809be242dc8d766633cfdf6e90';

/**
 * @brief Sensitive fields in Flexible Mode (VoiceChat Mode).
 */
const VOICE_CHAT_MODE = {
  ASRConfig: {
    ProviderParams: {
      amazon: {
        /**
         * @note Amazon Access key ID. For detail, see Create new access keys for an IAM user.
         * @refer https://docs.aws.amazon.com/keyspaces/latest/devguide/create.keypair.html
         */
        ID: 'Your ID',
        /**
         * @note Amazon Secret access key. For detail, see Create new access keys for an IAM user.
         * @refer https://docs.aws.amazon.com/keyspaces/latest/devguide/create.keypair.html
         */
        Secret: 'Your Secret',
      },
      google: {
        /**
         * @refer https://cloud.google.com/docs/authentication/application-default-credentials#GAC
         */
        CredentialsJSON: 'Your Credentials JSON',
      },
      BytePlus: {
        /**
         * @note The AppId obtained on BytePlus ASR Console, used to identify the application.
         * @refer https://console.byteplus.com/voice/service/1000017
         */
        AppId: '6299034879',
        /**
         * @brief AccessToken obtained on BytePlus ASR Console, used for authentication.
         * @refer https://console.byteplus.com/voice/service/1000017
         */
        AccessToken: 'IvMTMec6kw6xuIBmCK4G8NcDRmItYEB5',
        /**
         * @brief The service plan type for the BytePlus ASR Model.
         * @note Fixed to volc.bigasr.sauc.duration
         * @refer https://docs.byteplus.com/en/docs/byteplus-rtc/docs-1558163#byteplusasr
         */
        ApiResourceId: 'volc.bigasr.sauc.duration',
      },
    },
  },
  TTSConfig: {
    ProviderParams: {
      byteplus_Bidirectional_streaming: {
        app: {
          /**
           * @note App ID obtained on BytePlus Text-to-Speech Console, used to identify the application.
           * @refer https://console.byteplus.com/voice/service/1000014?
           */
          appid: '6299034879',
          /**
           * @note The Access Token corresponding to the App ID of Text-to-Speech service, used for identity authentication. You can obtain it by on BytePlus Text-to-Speech Console.
           * @refer https://console.byteplus.com/voice/service/1000014?
           */
          token: 'IvMTMec6kw6xuIBmCK4G8NcDRmItYEB5',
        },
      },
      amazon: {
        /**
         * @note Amazon Access key ID. For detail, see Create new access keys for an IAM user.
         * @refer https://docs.aws.amazon.com/keyspaces/latest/devguide/create.keypair.html
         */
        ID: 'Your ID',
        /**
         * @note Amazon Secret access key. For detail, see Create new access keys for an IAM user.
         * @refer https://docs.aws.amazon.com/keyspaces/latest/devguide/create.keypair.html
         */
        Secret: 'Your Secret',
      },
      openai: {
        /**
         * @note Fixed to the value: https://api.openai.com/v1/audio/speech
         * @example https://api.openai.com/v1/audio/speech
         */
        URL: 'Your OpenAI URL',
        /**
         * @note APIKey. Acquire on api-keys.
         * @refer https://platform.openai.com/api-keys
         */
        APIKey: 'Your OpenAI API Key',
      },
    },
  },
  LLMConfig: {
    CustomLLM: {
      /**
       * @brief APIKey, acquire on https://platform.openai.com/api-keys
       */
      APIKey: 'Your API Key',
    },
    BytePlusArk: {
      /**
       * @note APIKey. Acquire on View API Key.
       * @refer https://console.byteplus.com/ark/region:ark+ap-southeast-1/endpoint?config=%7B%7D
       */
      APIKey: '3a1a1148-7b97-4df3-ba6b-093aa8887b4b',
    },
  },
  // SubtitleConfig: {
  //   /**
  //    * @brief Subtitle callback configuration.
  //    * @note Callbacks can be received through the client or server. The message format is binary and needs to be parsed before use. For detailed instructions, see Real-time Subtitles.
  //    * @refer https://docs.byteplus.com/en/docs/byteplus-rtc/docs-1558163#byteplusasr
  //    */
  //   SubtitleMode: 0,
  // },
};

/**
 * @brief Sensitive fields in RealTime Mode.
 */
const REALTIME_API_MODE = {
  LLMConfig: {
    /**
     * @brief API key of OpenAI.
     * @refer https://platform.openai.com/api-keys
     */
    Token: 'Your OpenAI Token',
  },
};

/**
 * @brief Inject sensitive info.
 * @param body Request body.
 * @param isVoiceChatMode Whether voice chat mode.
 */
const injectSensitiveInfo = (body, isVoiceChatMode) => {
  if (isVoiceChatMode) {
    /** Inject voice chat mode sensitive info */
    if (body?.Config?.ASRConfig?.ProviderParams) {
      body.Config.ASRConfig.ProviderParams = merge(
        body.Config?.ASRConfig?.ProviderParams,
        VOICE_CHAT_MODE.ASRConfig.ProviderParams[body.Config?.ASRConfig?.Provider]
      );
    }
    if (body?.Config?.TTSConfig?.ProviderParams) {
      body.Config.TTSConfig.ProviderParams = merge(
        body.Config?.TTSConfig?.ProviderParams,
        VOICE_CHAT_MODE.TTSConfig.ProviderParams[body.Config?.TTSConfig?.Provider]
      );
    }
    if (body?.Config?.LLMConfig) {
      body.Config.LLMConfig = merge(
        body.Config?.LLMConfig,
        VOICE_CHAT_MODE.LLMConfig[body.Config?.LLMConfig?.Mode]
      );
    }
    if (body?.Config?.SubtitleConfig) {
      body.Config.SubtitleConfig = merge(
        body.Config?.SubtitleConfig,
        VOICE_CHAT_MODE.SubtitleConfig
      );
    }
  } else {
    /** Inject realtime mode sensitive info */
    body.LLMConfig && (body.LLMConfig = merge(body.LLMConfig, REALTIME_API_MODE.LLMConfig));
  }
};

module.exports = {
  ACCOUNT_ID,
  SUB_ACCOUNT_NAME,
  ACCOUNT_INFO,
  VOICE_CHAT_MODE,
  REALTIME_API_MODE,
  RTC_APP_KEY,
  injectSensitiveInfo,
};
