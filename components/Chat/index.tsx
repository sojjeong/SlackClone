import React, { FC, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';

import dayjs from 'dayjs';
import regexifyString from 'regexify-string';

import { IChat, IDM, IUser } from '@typings/db';

import gravatar from 'gravatar';
import { ChatWrapper } from '@components/Chat/styles';

interface Props {
  data: IDM | IChat;
}

// 컴포넌트 캐싱 : memo / useMemo
const BACK_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3095' : 'https://sleact.nodebird.com';
const Chat: FC<Props> = memo(({ data }) => {
  const { workspace } = useParams<{ workspace: string; channel: string }>();

  // DM 보낸 사람에 Sender 라는 옵션이 달려있음, 나인지 아닌지 판단
  const user: IUser = 'Sender' in data ? data.Sender : data.User;

  // 멘션하는 부분에 대한 정규표현식으로 처리 / 줄바꿈 br로 바꿀때 사용할 수도 있음
  // @[쏘뇽](1)
  // \d 숫자, +는 1개 이상, ?는 0개나 1개, *은 0개 이상 g는 모두찾기
  // +? 최대한 조금 찾음?
  const result = useMemo<(string | JSX.Element)[] | JSX.Element>(
    () =>
      data.content.startsWith('uploads\\') || data.content.startsWith('uploads/') ? (
        <img src={`${BACK_URL}/${data.content}`} style={{ maxHeight: 200 }} />
      ) : (
        regexifyString({
          pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
          decorator(match, index) {
            const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
            if (arr) {
              return (
                <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                  @{arr[1]}
                </Link>
              );
            }
            return <br key={index} />;
          },
          input: data.content,
        })
      ),
    [workspace, data.content],
  );

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
});

export default Chat;
