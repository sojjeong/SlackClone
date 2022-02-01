import React, { useCallback, useState } from 'react';
import { Redirect, Switch, Route } from 'react-router';

import useSWR from 'swr';
import axios from 'axios';
import loadable from '@loadable/component';

import fetcher from '@utils/fetcher';
import { IUser } from '@typings/db';

import {
  Channels,
  Chats,
  Header,
  MenuScroll,
  ProfileImg,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import gravatar from 'gravatar';

// 컴포넌트 자체를 레이아웃으로 감싸던지, 레이아웃 안에서 어떤 컴포넌트를 쓸껀지 중첩 라우팅을 하던지
// 여기서는 중첩 라우팅 사용
const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

// children을 사용하면 Channel 페이지에서 workspace안의 태그들이 children이 됨
const Workspace: React.FC = ({ children }) => {
  const { data, error, mutate } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);
  const [logout, setLogout] = useState('');
  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, { withCredentials: true }).then(() => {
      mutate(false, false);
    });
  }, []);

  if (data === false) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>test</Header>
      <RightMenu>
        <span>
          <ProfileImg src={gravatar.url(data?.nickname as string, { s: '28px', d: 'retro' })} alt={data?.nickname} />
        </span>
      </RightMenu>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menu scroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route exact path="/workspace/channel" component={Channel} />
            <Route exact path="/workspace/dm/" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      {children}
    </div>
  );
};

export default Workspace;
