/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */
const merge = require('lodash/merge');
require('dotenv').config();

/**
 * @note Not required, if you invoke getSessionToken to generate sessionToken, you should fill it.
 * @refer https://console.byteplus.com/user/basics/
 */
const ACCOUNT_ID = process.env.ACCOUNT_ID;

/**
 * @note Not required, if you invoke getSessionToken to generate sessionToken, you should fill it.
 */
const SUB_ACCOUNT_NAME = process.env.SUB_ACCOUNT_NAME;

/**
 * @note Sign up for AK/SK.
 *        You can manage your AK/SK via https://console.byteplus.com/iam/keymanage
 */
const ACCOUNT_INFO = {
  /**
   * @note Required, get from https://console.byteplus.com/iam/keymanage
   */
  accessKeyId: process.env.ACCESS_KEY_ID,
  /**
   * @note Required, get from https://console.byteplus.com/iam/keymanage
   */
  secretKey: process.env.SECRET_KEY,
};

/**
 * @brief RTC AppKey
 * @refer https://console.byteplus.com/rtc/listRTC
 */
const RTC_APP_KEY = process.env.RTC_APP_KEY;

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
        ID: process.env.AMAZON_ASR_ID,
        /**
         * @note Amazon Secret access key. For detail, see Create new access keys for an IAM user.
         * @refer https://docs.aws.amazon.com/keyspaces/latest/devguide/create.keypair.html
         */
        Secret: process.env.AMAZON_ASR_SECRET,
      },
      google: {
        /**
         * @refer https://cloud.google.com/docs/authentication/application-default-credentials#GAC
         */
        CredentialsJSON: process.env.GOOGLE_ASR_CREDENTIALS_JSON,
      },
      BytePlus: {
        /**
         * @note The AppId obtained on BytePlus ASR Console, used to identify the application.
         * @refer https://console.byteplus.com/voice/service/1000017
         */
        AppId: process.env.BYTEPLUS_ASR_APP_ID,
        /**
         * @brief AccessToken obtained on BytePlus ASR Console, used for authentication.
         * @refer https://console.byteplus.com/voice/service/1000017
         */
        AccessToken: process.env.BYTEPLUS_ASR_ACCESS_TOKEN,
        /**
         * @brief The service plan type for the BytePlus ASR Model.
         * @note Fixed to volc.bigasr.sauc.duration
         * @refer https://docs.byteplus.com/en/docs/byteplus-rtc/docs-1558163#byteplusasr
         */
        ApiResourceId: process.env.BYTEPLUS_ASR_API_RESOURCE_ID,
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
          appid: process.env.BYTEPLUS_TTS_APP_ID,
          /**
           * @note The Access Token corresponding to the App ID of Text-to-Speech service, used for identity authentication. You can obtain it by on BytePlus Text-to-Speech Console.
           * @refer https://console.byteplus.com/voice/service/1000014?
           */
          token: process.env.BYTEPLUS_TTS_TOKEN,
        },
      },
      amazon: {
        /**
         * @note Amazon Access key ID. For detail, see Create new access keys for an IAM user.
         * @refer https://docs.aws.amazon.com/keyspaces/latest/devguide/create.keypair.html
         */
        ID: process.env.AMAZON_TTS_ID,
        /**
         * @note Amazon Secret access key. For detail, see Create new access keys for an IAM user.
         * @refer https://docs.aws.amazon.com/keyspaces/latest/devguide/create.keypair.html
         */
        Secret: process.env.AMAZON_TTS_SECRET
      },
      openai: {
        /**
         * @note Fixed to the value: https://api.openai.com/v1/audio/speech
         * @example https://api.openlai.com/v1/audio/speech
         */
        URL: process.env.OPENAI_TTS_URL,
        /**
         * @note APIKey. Acquire on api-keys.
         * @refer https://platform.openai.com/api-keys
         */
        APIKey: process.env.OPENAI_TTS_API_KEY,
      },
    },
  },
  LLMConfig: {
    CustomLLM: {
      /**
       * @brief APIKey, acquire on https://platform.openai.com/api-keys
       */
      APIKey: process.env.OPENAI_LLM_API_KEY,
    },
    BytePlusArk: {
      /**
       * @note APIKey. Acquire on View API Key.
       * @refer https://console.byteplus.com/ark/region:ark+ap-southeast-1/endpoint?config=%7B%7D
       */
      APIKey: process.env.BYTEPLUS_LLM_API_KEY,
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
    Token: process.env.OPENAI_REALTIME_TOKEN,
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
