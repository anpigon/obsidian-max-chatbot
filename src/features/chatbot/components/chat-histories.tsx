import {FC, useEffect, useState} from 'react';

import moment from 'moment';

import {usePlugin} from '@/hooks/useApp';
import {IconButton} from '@/components';
import Logger from '@/libs/logging';

export interface ChatHistoriesProps {
  onSelect: (sessionID: string) => void;
}

export const ChatHistories: FC<ChatHistoriesProps> = ({onSelect}) => {
  const plugin = usePlugin();
  const [histories, setHistories] = useState<
    {
      sessionID: string;
      title: string;
      created: number;
      relativeTime: string;
    }[]
  >([]);

  useEffect(() => {
    plugin.getChatHistories().then(histories => {
      // relativeTime을 추가하고 최신순으로 정렬
      const historiesWithRelativeTime = histories.map(history => ({
        ...history,
        relativeTime: moment(history.created).fromNow(),
      }));
      const sortedHistories = historiesWithRelativeTime.sort((a, b) => b.created - a.created);
      setHistories(sortedHistories);
    });
  }, []);

  const handleDelete = (sessionID: string) => {
    // 삭제 로직 구현
    Logger.debug('Delete session:', sessionID);
    plugin.deleteChatHistory(sessionID).then(() => {
      setHistories(histories.filter(history => history.sessionID !== sessionID));
    });
  };

  const handleSelect = (sessionID: string) => () => {
    onSelect(sessionID);
  };

  return (
    <div className="flex">
      <div className="vertical-tab-header-group flex-1 *:text-left">
        {histories.map((history, index) => {
          const showRelativeTime = index === 0 || history.relativeTime !== histories[index - 1].relativeTime;

          return (
            <div key={history.sessionID}>
              {showRelativeTime && <div className="vertical-tab-header-group-title">{history.relativeTime}</div>}
              <div className="vertical-tab-nav-item group relative">
                <div className="line-clamp-2 overflow-hidden text-ellipsis break-words break-all pr-8" onClick={handleSelect(history.sessionID)}>
                  {history.title}
                </div>
                <IconButton
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => handleDelete(history.sessionID)}
                  label="delete"
                  icon="trash"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
