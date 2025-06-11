/**
 * Copyright 2025 Beijing Volcano Engine Technology Co., Ltd. All Rights Reserved.
 * SPDX-license-identifier: BSD-3-Clause
 */

import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tag, Spin } from '@arco-design/web-react';
import { RootState } from '@/store';
import Loading from '@/components/Loading/HorizonLoading';
import Config from '@/config';
import { Provider } from '@/config/basic';
import { isRealTimeCallMode } from '@/app/base';
import styles from './index.module.less';

const lines: (string | React.ReactNode)[] = [];

function Conversation(props: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const room = useSelector((state: RootState) => state.room);
  const msgHistory = room.msgHistory;
  const { userId } = room.localUser;
  const remoteUsers = room.remoteUsers;
  const { isAITalking, isUserTalking } = useSelector((state: RootState) => state.room);
  const isAIReady = remoteUsers.find(
    (user) => user.userId === Config.BotName || user.userId?.startsWith('voiceChat')
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMsg = msgHistory?.[msgHistory.length - 1];
  // Only realtime & byteplus tts are supported.
  const isSupportedSubtitle =
    isRealTimeCallMode() || (!isRealTimeCallMode() && Config['Provider.TTS'] === Provider.Byteplus);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }
  }, [msgHistory.length, lastMsg?.value?.length]);

  return (
    <div ref={containerRef} className={`${styles.conversation} ${className}`} {...rest}>
      {lines.map((line) => line)}
      {!isAIReady ? (
        <div className={styles.aiReadying}>
          <Spin size={16} className={styles['aiReading-spin']} />
          AI preparing...
        </div>
      ) : (
        <div className={styles.notification}>
          <div className={styles.title}>
            You can speak to me directly, for example, try asking the following questions:
          </div>
          <div className={styles.tips}>
            {[
              'How to develop good habits for a healthy lifestyle?',
              'What problems can you help me solve?',
              'Please tell me a story.',
              'What are your hobbies?',
              'Why is the sky blue?',
            ].map((tip) => (
              <div key={tip} className={styles.tip}>
                {tip}
              </div>
            ))}
          </div>
        </div>
      )}
      {isSupportedSubtitle &&
        msgHistory?.map(({ value, user, isInterrupted }, index) => {
          const isUserMsg = user === userId;
          const isRobotMsg = user === Config.BotName;
          if (!isUserMsg && !isRobotMsg) {
            return '';
          }
          return (
            <div
              className={`${styles.sentence} ${isUserMsg ? styles.user : styles.robot}`}
              key={`msg-${index}`}
            >
              <div className={styles.content}>
                {value}
                <div className={styles['loading-wrapper']}>
                  {/* Realtime non-streaming mode */}
                  {!isRealTimeCallMode() &&
                  isAIReady &&
                  (isUserTalking || isAITalking) &&
                  index === msgHistory.length - 1 ? (
                    <Loading gap={3} className={styles.loading} dotClassName={styles.dot} />
                  ) : (
                    ''
                  )}
                </div>
              </div>
              {!isUserMsg && isInterrupted ? (
                <Tag className={styles.interruptTag}>Interrupted</Tag>
              ) : (
                ''
              )}
            </div>
          );
        })}
    </div>
  );
}

export default Conversation;
