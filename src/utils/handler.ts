/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import { useDispatch } from 'react-redux';
import logger from './logger';
import {
  setHistoryMsg,
  // setInterruptMsg,
  updateAITalkState,
  // updateAIThinkState,
} from '@/store/slices/room';
import RtcClient from '@/lib/RtcClient';
import Utils from '@/utils/utils';
import config, { AIGC_PROXY_HOST } from '@/config';

export type AnyRecord = Record<string, any>;

export enum MESSAGE_TYPE {
  BRIEF = 'conv',
  SUBTITLE = 'subv',
  FUNCTION_CALL = 'tool',
}

export enum AGENT_BRIEF {
  UNKNOWN,
  LISTENING,
  THINKING,
  SPEAKING,
  INTERRUPTED,
  FINISHED,
}

/**
 * @brief Command types
 */
export enum COMMAND {
  /**
   * @brief Interrupt command
   */
  INTERRUPT = 'interrupt',
  /**
   * @brief Send external text to drive TTS
   */
  EXTERNAL_TEXT_TO_SPEECH = 'ExternalTextToSpeech',
  /**
   * @brief Send external text to drive LLM
   */
  EXTERNAL_TEXT_TO_LLM = 'ExternalTextToLLM',
}

/**
 * @brief Interrupt priority types
 * refer https://docs.byteplus.com/en/docs/byteplus-rtc/docs-1404671
 */
export enum INTERRUPT_PRIORITY {
  /**
   * @brief Placeholder
   */
  NONE,
  /**
   * @brief High priority. The incoming information directly interrupts the interaction and is processed.
   */
  HIGH,
  /**
   * @brief Medium priority. Wait until the current interaction ends and then process.
   */
  MEDIUM,
  /**
   * @brief Low priority. If an interaction is currently occurring, directly discard the information passed in by Message.
   */
  LOW,
}

export const MessageTypeCode = {
  [MESSAGE_TYPE.SUBTITLE]: 1,
  [MESSAGE_TYPE.FUNCTION_CALL]: 2,
  [MESSAGE_TYPE.BRIEF]: 3,
};

export const useMessageHandler = () => {
  const dispatch = useDispatch();

  const maps = {
    [MESSAGE_TYPE.BRIEF]: (parsed: AnyRecord) => {
      const { Stage } = parsed || {};
      const { Code, Description } = Stage || {};
      logger.debug(Code, Description);
      switch (Code) {
        case AGENT_BRIEF.THINKING:
          // dispatch(updateAIThinkState({ isAIThinking: true }));
          break;
        case AGENT_BRIEF.SPEAKING:
          dispatch(updateAITalkState({ isAITalking: true }));
          break;
        case AGENT_BRIEF.FINISHED:
          dispatch(updateAITalkState({ isAITalking: false }));
          break;
        case AGENT_BRIEF.INTERRUPTED:
          // dispatch(setInterruptMsg());
          break;
        default:
          break;
      }
    },
    [MESSAGE_TYPE.SUBTITLE]: (parsed: AnyRecord) => {
      const data = parsed.data?.[0] || {};
      /** debounce */
      if (data) {
        const { text: msg, definite, userId: user, paragraph } = data;
        logger.debug(data);
        if ((window as any)._debug_mode) {
          dispatch(setHistoryMsg({ msg, user, paragraph, definite }));
        } else {
          const isAudioEnable = RtcClient.getAudioBotEnabled();
          if (isAudioEnable) {
            dispatch(setHistoryMsg({ text: msg, user, paragraph, definite }));
          }
        }
      }
    },
    [MESSAGE_TYPE.FUNCTION_CALL]: async (parsed: AnyRecord) => {
      const toolCall = parsed?.tool_calls?.[0] || {};
      const name: string = toolCall?.function?.name;
      const toolCallId: string = toolCall?.id;

      let parameters: any = {};
      try {
        const args = toolCall?.function?.arguments;
        parameters = typeof args === 'string' ? JSON.parse(args || '{}') : args || {};
      } catch (e) {
        logger.debug('parse function arguments error', e);
      }

      let content = '';
      try {
        const res = await fetch(`${AIGC_PROXY_HOST}/tool/fc`, {
          method: 'post',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({ name, parameters }),
        });

        // Prefer text; if JSON, stringify for transport
        const text = await res.text();
        try {
          const maybeJson = JSON.parse(text);
          content = typeof maybeJson === 'string' ? maybeJson : JSON.stringify(maybeJson);
        } catch (_) {
          content = text;
        }
      } catch (error: any) {
        content = `Function call failed: ${error?.message || 'unknown error'}`;
      }

      try {
        RtcClient.engine.sendUserBinaryMessage(
          config.BotName,
          Utils.string2tlv(
            JSON.stringify({
              ToolCallID: toolCallId,
              Content: content,
            }),
            'func'
          )
        );
      } catch (e) {
        logger.debug('sendUserBinaryMessage error', e);
      }
    },
  };

  return {
    parser: (buffer: ArrayBuffer) => {
      try {
        const { type, value } = Utils.tlv2String(buffer);
        maps[type as MESSAGE_TYPE]?.(JSON.parse(value));
      } catch (e) {
        logger.debug('parse error', e);
      }
    },
  };
};
