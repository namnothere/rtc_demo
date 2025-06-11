/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { OPENAI_VOICE_TYPE } from '../voiceChat/tts';
import { LLMManager } from './llm';

/**
 * @brief RealTime Mode Config.
 * @note For more information, you can refer to https://docs.byteplus.com/en/docs/byteplus-rtc/docs-1316255
 */
export class RealTimeConfig {
  llm: LLMManager;

  constructor() {
    this.llm = new LLMManager();
  }

  set voice(value: OPENAI_VOICE_TYPE) {
    this.llm.voiceType = value;
  }

  get voice() {
    return this.llm.voiceType;
  }

  set systemMessages(value: string[]) {
    /** Realtime only receive one message. */
    this.llm.systemMessages = value?.[0] || '';
  }

  get config() {
    return {
      LLMConfig: this.llm.value,
    };
  }
}
