import React, { useCallback, useState } from 'react';

import Modal from '@components/Modal';
import useInput from '@hooks/useInput';

import { Button, Input, Label } from '@pages/SignUp/styles';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: React.FC<Props> = ({ show, onCloseModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const onCreateChannel = useCallback(() => {}, []);

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-lable">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
