import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';

import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import axios from 'axios';

import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';
import { IDM, IUser } from '@typings/db';

import gravatar from 'gravatar';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { DragOver } from '@pages/Channel/styles';
import { Header, Container } from '@pages/DirectMessage/styles';

const PAGE_SIZE = 20;
const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();

  const [chat, onChangeChat, setChat] = useInput('');
  const [dragOver, setDragOver] = useState(false);
  const scrollbarRef = useRef<Scrollbars>(null);

  const { data: userData } = useSWR<IUser>(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR<IUser>(`/api/users`, fetcher);
  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_SIZE}&page=1`,
    fetcher,
  );

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            mutateChat();
            setChat('');
          })
          .catch(console.error);
      }
    },
    [chat, workspace, id, myData, userData, chatData, mutateChat, setChat],
  );

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData?.email, { s: '24px', d: 'retro' })} alt={userData?.nickname} />
      </Header>
      {/* <ChatList /> */}
      <ChatBox
        onSubmitForm={onSubmitForm}
        chat={chat}
        onChangeChat={onChangeChat}
        data={[]}
        placeholder={`Message ${userData.nickname}`}
      />
    </Container>
  );
};

export default DirectMessage;
