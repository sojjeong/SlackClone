import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';

import axios from 'axios';
import useSWR from 'swr';

import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import fetcher from '@utils/fetcher';

import { IChannel, IUser } from '@typings/db';

import { Button, Input, Label } from '@pages/SignUp/styles';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: React.FC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { workspace } = useParams<{ workspace: string; channel: string }>(); // 주소에 저장된 데이터를 이용

  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
  const { mutate: mutateChannel } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();

      if (!newChannel || !newChannel.trim()) {
        return;
      }

      // 채널을 만들 때, 어떤 워크스페이스에 있는지 서버가 알아야 함
      axios
        .post(`/api/workspaces/${workspace}/channels`, { name: newChannel })
        .then(() => {
          mutateChannel();
          setShowCreateChannelModal(false);
          setNewChannel('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newChannel, mutateChannel, setNewChannel, setShowCreateChannelModal, workspace],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널 이름</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button>생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
