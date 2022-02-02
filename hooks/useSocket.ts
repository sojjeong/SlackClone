import { useCallback } from 'react';

import { io, Socket } from 'socket.io-client';
import axios from 'axios';

// 소켓은 한번 열면 끊어지지 않음
// 리액트와 socket은 잘 어울리지 않음, 다른 컴포넌트 가면 연결끊어질 수 있음
// 하나의 컴포넌트에 종속적이지 않도록 설계해야함
// 공통 컴포넌트에 넣어주자 -> high order component -> hooks로 대체
// 화면단이 없고 로직만 있으면 hook으로 뺀다

const backUrl = 'http://localhost:3095';

// [key: string] 어떤 값이 들어오든, 문자열이기만 하면 된다
const sockets: { [key: string]: Socket } = {};

const useSocket = (workspace?: string): [Socket | undefined, () => void] => {
  // 다른 워크스페이스 갈 때는 그 때의 소켓이 끊어지게 해줘야함
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }

  // 없으면 새로 만들고, 있으면 기존 꺼 리턴
  if (!sockets[workspace]) {
    sockets[workspace] = io(`${backUrl}/ws-${workspace}`, { transports: ['websocket'] });
  }

  // `${backUrl}` 이렇게만 하면 서버에 있는 모든 사람한테 메시지가 다 가기 때문에 계층을 나눠줘야함
  // socket.io에서도 계층이 존재
  // 워크스페이스 -> socket namespace / 채널 -> socket room
  // 연결 할 때, polling 하지 않고 웹소켓만 쓰게 하기 위해 transports 옵션 사용
  // sockets[workspace] = io(`${backUrl}/ws-${workspace}`, { transports: ['websocket'] });

  /**
   * 소켓 객체
   * - receiveBuffer, sendBuffer 에 서버가 불안정할 때, 데이터를 담아둠
   * - callbacks : on 해서 붙혀둔 이벤트 리스너들이 붙어 있음
   */

  return [sockets[workspace], disconnect];
};

export default useSocket;
